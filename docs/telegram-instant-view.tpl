~version: "2.1"

# Dragon Lab sample template for Telegram Instant View.
# Open https://instantview.telegram.org/templates and adapt the path rule
# and optional channel/author rules for the domain that uses this theme.
# Keep the version rule above as the first non-empty line.

?path: /([a-z]{2}/)?posts/.+
!exists: //article[@data-iv-article]

$article: (//article[@data-iv-article])[1]
$body: ($article//*[@data-iv-content])[1]

@remove: //script
@remove: //style
@remove: //noscript
@remove: //*[contains(@data-iv-remove, "true")]
@split_parent: $body//p/figure
@split_parent: $body//p/img

title: ($article//h1[has-class("iv-title")])[1]
author: (//meta[@property="article:author"]/@content)[1]
author_url: (//meta[@property="article:author:url"]/@content)[1]
description: (//meta[@name="description"]/@content)[1]
site_name: (//meta[@property="og:site_name"]/@content)[1]
image_url: (//meta[@property="og:image"]/@content)[1]
cover: ($article//figure[@data-iv-cover])[1]
@datetime(0, "en-US", "yyyy-MM-dd'T'HH:mm:ssXXX"): ($article//time[@data-iv-published]/@datetime)[1]
published_date: $@
body: $body
