~version: "2.1"

# Dragon Lab sample template for Telegram Instant View.
# Open https://instantview.telegram.org/templates and adapt the path rule
# and optional channel/author rules for the domain that uses this theme.

?exists: //article[@data-iv-article]
?path: .*\/posts\/.+

@remove: //*[contains(@data-iv-remove, "true")]
@remove: //script
@remove: //style

title: //h1[contains(concat(" ", normalize-space(@class), " "), " iv-title ")]
published_date: //time[@data-iv-published]/@datetime
author: //meta[@property="article:author"]/@content
description: //meta[@name="description"]/@content
image_url: //meta[@property="og:image"]/@content
cover: //figure[@data-iv-cover]
body: //*[@data-iv-content]
