# handrss Snippet
Updated  `07182022-102947`

- [feed.txt](https://tilde.town/~extratone/manual/neorss/feed.txt)

---

```
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>David Blue Dot What The Fuck</title>
  <description>David Blue, syndicated and Hog Wild.</description>
  <link>https://davidblue.wtf</link>
  <lastBuildDate>
    %a, %d %b %Y %H:%M -0500
  </lastBuildDate>
  <ttl>20000</ttl>
  
  <item>
  <title>The title of your item</title>
  <description>
    %fillpart:name=Description:default=yes%This is an RSS Feed Item.%fillpartend%
  </description>
  <link>%clipboard</link>
  <pubDate>
    %a, %d %b %Y %H:%M -0500
  </pubDate>
 </item>
</channel>
</rss>
```
