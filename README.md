# Dragon Lab

Dragon Lab is a multilingual Hugo theme for technical blogs, research notes, and connected long-form writing. It includes an editorial home page, post archive, taxonomy pages, article metadata rail, share links, and interactive archive graphs built from tags and internal links.

## Features

- Multilingual navigation and i18n strings.
- Responsive editorial layouts for home, list, taxonomy, 404, about, and single-post pages.
- Hugo Pipes for fingerprinted CSS and JavaScript assets.
- Tag and post graph views for archive exploration.
- Article rail with metadata, table of contents, and related-post graph.
- Included `exampleSite` with English and Russian demo content.

## Requirements

- Hugo Extended `0.146.0` or newer.

## Installation

Add the theme to a Hugo site:

```sh
git submodule add https://github.com/dukebarman/dragon-lab.git themes/dragon-lab
```

Then set the theme in your site config:

```toml
theme = "dragon-lab"
```

## Configuration

Minimal site configuration:

```toml
baseURL = "https://example.org/"
title = "My Notes"
theme = "dragon-lab"
defaultContentLanguage = "en"
defaultContentLanguageInSubdir = true
locale = "en-US"

[pagination]
  pagerSize = 10

[taxonomies]
  tag = "tags"
  category = "categories"

[outputs]
  home = ["HTML", "JSON"]

[markup]
  [markup.goldmark]
    [markup.goldmark.parser]
      wrapStandAloneImageWithinParagraph = false

  [markup.highlight]
    codeFences = true
    style = "monokai"

[params]
  author = "Your Name"
  description = "Technical notes and essays."
  images = ["images/hero.jpg"]
  heroImage = "images/hero.jpg"
  aboutImage = "images/about.jpg"
  aboutImageAlt = "Portrait illustration of the site author."
  aboutSocial = ["github", "linkedin", "telegram"]
  themeColor = "#09090c"

  # Optional. Analytics scripts are rendered only in production builds.
  # [params.analytics]
  #   google = "G-XXXXXXXXXX"
  #   yandex = "12345678"

  [params.footer]
    showCopyright = true
    showHugoAttribution = true
    showThemeAttribution = true
    themeName = "Dragon Lab"
    themeURL = "https://github.com/dukebarman/dragon-lab"
    themeAuthorName = "dukeBarman"
    themeAuthorURL = "https://dukebarman.pro"

  [[params.social]]
    name = "github"
    url = "https://github.com/example"

[languages]
  [languages.en]
    weight = 1
    contentDir = "content/english"
    locale = "en-US"

    [languages.en.params]
      brandName = "My Notes"
      brandTagline = "field notes / systems archive"
      homeSubtitle = "Research notes, device sketches, and connected system maps."

[menus]
  [[menus.main]]
    identifier = "nav_archive"
    pageRef = "posts"
    weight = 10

  [[menus.main]]
    identifier = "nav_about"
    pageRef = "about"
    weight = 20
```

The theme ships with neutral generated sample images at `images/example-hero.jpg`, `images/example-avatar.jpg`, and `images/example-favicon.jpg`. For a real site, upload your own images under your site's `static/images/` directory and point `params.heroImage`, `params.aboutImage`, and `params.images` to those files. Prefer paths without a leading slash so sites deployed under a subdirectory keep working. Replace the root favicon files in your site `static/` directory when you want custom browser icons.

Set `params.aboutSocial` to choose which entries from `params.social` appear on the about page and in what order. If `aboutSocial` is omitted, the about page shows the first five configured social links.

### About Page Text

Dragon Lab's about layout uses the `about` content page for the page title, front matter description, and optional `imageAlt`, while the longer structured copy comes from Hugo i18n strings. This keeps the reusable theme demo neutral and lets each site provide its own biography without editing theme templates.

To customize the about page for a real site, create site-level i18n files such as `i18n/en.toml` and `i18n/ru.toml`, then override these keys:

```toml
[about_fallback]
other = "Short intro shown when the about page has no description."

[about_intro_kicker]
other = "Introduction"

[about_intro_title]
other = "A one-sentence headline for your about page."

[about_intro_p1]
other = "First paragraph of your biography."

[about_intro_p2]
other = "Second paragraph of your biography."

[about_intro_p3]
other = "Third paragraph of your biography."

[about_focus_text]
other = "Intro text before the focus list."

[focus_kicker]
other = "Focus"

[focus_title]
other = "Areas of work"

[focus_item_1]
other = "First focus area"

[focus_item_2]
other = "Second focus area"

[focus_item_3]
other = "Third focus area"

[about_archive_kicker]
other = "Archive"

[about_archive_title]
other = "A headline for how readers should understand the archive."

[about_archive_p1]
other = "First paragraph about the archive."

[about_archive_p2]
other = "Second paragraph about the archive."

[recent_work_kicker]
other = "New posts in the archive"
```

Use an `about.md` file inside each language content directory for language-specific titles and descriptions, and `[params] aboutImage` / `aboutImageAlt` for the portrait image.

Footer attribution is configurable with `[params.footer]`. You can hide the Hugo or theme attribution, set `themeURL` for the theme link, and set `themeAuthorURL` for the author link.

### Analytics

Dragon Lab supports Google Analytics and Yandex Metrica through optional params:

```toml
[params.analytics]
  google = "G-XXXXXXXXXX"
  yandex = "12345678"
```

Analytics scripts are emitted only for production builds. They are not rendered by `hugo server` unless you explicitly run it with a production environment.

See `exampleSite/hugo.toml` for a fuller multilingual configuration.

## Example Site

From a Hugo site that contains this theme under `themes/dragon-lab`, build the demo:

```sh
hugo --source themes/dragon-lab/exampleSite --themesDir ../.. --theme dragon-lab
```

Or run it locally:

```sh
hugo server --source themes/dragon-lab/exampleSite --themesDir ../.. --theme dragon-lab -D
```

## Authoring Notes

The theme expects posts in the `posts` section and uses standard Hugo front matter fields such as `title`, `date`, `description`, `tags`, and `categories`.

Posts also support optional publication fields that help social previews, structured data, and Telegram Instant View:

```toml
author = "Your Name"
authorURL = "about/"
imageAlt = "Portrait illustration of the author."
cover = "images/post-cover.jpg"
coverAlt = "Short description of the cover image."
coverCaption = "Optional visible caption."
images = ["images/post-cover.jpg"]
```

Internal Markdown links between posts are used to build the archive graph. For multilingual sites, keep links language-local when possible.

The image render hook outputs standalone Markdown images as `<figure>` elements. Keep `markup.goldmark.parser.wrapStandAloneImageWithinParagraph = false` in your site config so Hugo does not wrap those figures in paragraphs.

## Telegram Instant View

Dragon Lab renders posts with stable Instant View selectors, metadata, and media markup:

- `article[data-iv-article]` wraps the post.
- `.iv-title`, `[data-iv-published]`, `[data-iv-author]`, `[data-iv-cover]`, and `[data-iv-content]` expose article fields.
- `[data-iv-remove]` marks navigation, share controls, sidebars, and related-content blocks that should not appear in Instant View.
- Markdown images are rendered as figures with optional captions.
- Code fences render as `<pre data-language="...">` blocks.
- Post pages include Open Graph article metadata and JSON-LD `BlogPosting` data.

Telegram Instant View still has to be configured per domain in Telegram's editor. Use `docs/telegram-instant-view.tpl` as a starting point, then validate several live post URLs in the official tools:

- Documentation: <https://instantview.telegram.org/docs>
- Checklist: <https://instantview.telegram.org/checklist>
- Template editor: <https://instantview.telegram.org/templates>

Recommended checks before submitting a template: one post with a cover, one without a cover, one with images and captions, one with code blocks, and each language branch used by the site.

## License

Licensed under the Apache License, Version 2.0. See `LICENSE` for the
standard license text and `NOTICE` for copyright notices.
