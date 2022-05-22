  // Copyright (c) 2019 SmileOnMyMac, LLC dba Smile. All rights reserved
  function macNotification(window, nativeRegisterCallbacks) {
  const INT32_MAX_VALUE = 2147483647;
  let counter = 0;

  const notifications = new Map();

  const callbacks = {
    error: (id) => {    // notification could not be presented
      const notification = notifications.get(id);
      if (notification && notification.onerror) {
        notification.onerror(new window.Event('error'));
      }
      notifications.delete(id);
    },
    click: (id) => {    // triggered each time the user clicks the notification (only one time is possible on Mac)
      const notification = notifications.get(id);
      if (notification && notification.onclick) {
        notification.onclick(new window.MouseEvent('click'));
      }
    },
    close: (id) => {    // triggered when the user closes the notification
      const notification = notifications.get(id);
      if (notification && notification.onclose) {
        notification.onclose();
      }
      notifications.delete(id);
    },
    show: (id) => {   // triggered when the notification is displayed
      const notification = notifications.get(id);
      if (notification && notification.onshow) {
        notification.onshow(new window.Event('show'));
      }
    }
  };

  nativeRegisterCallbacks(callbacks);

  nativeShowNotification = (infoDict) => {
    window.webkit.messageHandlers.showNotification.postMessage(infoDict);
  };
  nativeCloseNotification = (anId) => {
    window.webkit.messageHandlers.closeNotification.postMessage(anId);
  };

  // TODO: after upgrade to next version of CEF, use
  //       direct inheritance from window.EventTarget. (Need at least Chrome 64)
  window.Notification = class {
    constructor(title, options = {}) {
      const myId = counter;
      do {
        counter = (counter + 1) % INT32_MAX_VALUE;
      } while (notifications.has(counter));

      notifications.set(myId, this);

      const nativeOptions = {
        noteId: myId,
        title: title,
        tag: options.tag || '',
        body: options.body || ''
      };
      nativeShowNotification(nativeOptions);
      this.close = () => { nativeCloseNotification(myId); };

      Object.defineProperties(this, {
        data: { value: options.data, enumerable: true},
        title: { value: title, enumerable: true},
        direction: { value: options.dir, enumerable: true},
        language: { value: options.lang, enumerable: true },
        body: { value: options.body, enumerable: true },
        tag: { value: options.tag, enumerable: true},
        baseUrl: { value: window.baseUrl, enumerable: true },
        timestamp: { value: options.timestamp || Date.now(), enumerable: true },
        actions: { value: Object.freeze([]), enumerable: true } // XXXBB Mac could have an action
      })
    }
  };

  window.Notification.requestPermission = (deprecatedCallback) => {
    return new Promise((resolve) => {
      resolve('granted'); // On Mac the permission is controlled in System Preferences by the user.
    }).then(result => {   // The system always appears to the application "to be working/enabled" regardless of the user setting.
      if (deprecatedCallback) {
        deprecatedCallback(result);
      }
      return result;
    });
  };

  Object.defineProperties(window.Notification, {
    'permission': { get: () => 'granted', enumerable: true },
    'maxActions': { value: 0, enumerable: true }  // XXXBB we could support one action on Mac
  });
}

// Provide a way for ObjC to call the callbacks (to inform the Notification that it was clicked, etc).
// Ex: callbackAnchor.close(5)
const callbackAnchor = {};

macNotification(window, (callbacks) => {
  Object.assign(callbackAnchor, callbacks);
});
