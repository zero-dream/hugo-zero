[example]: /example

# Hugo Gallery Theme

A very simple and opinionated photo gallery theme for Hugo.

This project is developed based on [nicokaiser/hugo-theme-gallery](https://github.com/nicokaiser/hugo-theme-gallery/).

## Features

- Justified images gallery
- Image lightbox

- Download image
- Add a watermark to the image
- SEO with Open Graph tags
- Custom select cover image
- A page used to display all taxonomies

- Private albums
- Dark color scheme
- Theme toggle
- Responsive design
- Image lazysizes

- Blur effect
- Top navigation bar pinned

**Important note: do not try to use WebP images.** The golang WebP implementation used in Hugo has a bug which leads to wrong image levels (dull looking images) upon resize. See [nicokaiser/hugo-theme-gallery#102](https://github.com/nicokaiser/hugo-theme-gallery/issues/102) for more details.

## Used Project

- Justified images gallery with [nk-o/flickr-justified-gallery](https://github.com/nk-o/flickr-justified-gallery)
- Photoswipe and lightbox with [dimsemenov/photoswipe](https://github.com/dimsemenov/photoswipe)
- Lazy loader for images with [aFarkas/lazysizes](https://github.com/aFarkas/lazysizes)
- Prose typography with [tailwindlabs/tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)
- Some icons with [tailwindlabs/heroicons](https://github.com/tailwindlabs/heroicons)
- Some css with [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)

## Hugo Modules

This theme requires Hugo Extended >= 0.162.0. Dependencies are bundled, so no Node.js/NPM and PostCSS is needed.

### Installation

Requires the Go binary installed.

```sh
hugo new project <repo>
```

Change to the `<repo>` directory under the current path.

```sh
hugo mod init github.com/<owner>/<repo>
```

Add the theme to the `hugo.yaml` config:

```yaml
module:
  hugoVersion:
    extended: true
    min: "0.162.0"
  imports:
    - path: "github.com/zero-dream/hugo-gallery"
```

Start Hugo’s development server.

```sh
hugo server
```

### Update A Module

To update a module to the latest version:

```sh
hugo mod get -u github.com/zero-dream/hugo-gallery
```

### Update All Modules

To update all modules to the latest version:

```sh
hugo mod get -u
```

## Usage

Please refer to the [example][example] for details.

### Content Structure

Page bundles which contain at least one image are listed as album or gallery:

```plain
content/
├── _index.md
├── about.md            <-- not listed in album list
├── animals/
│   ├── _index.md
│   ├── cover.jpeg      <-- animals album cover (must)
│   ├── cats/
│   |   ├── index.md
│   |   ├── cat1.jpeg   <-- cats album cover (first)
│   |   ├── cat2.jpeg
│   └── dogs/
│       ├── index.md
│       ├── dog1.jpeg   <-- dogs album cover (first)
│       └── dog2.jpeg
├── graph.jpeg          <-- site thumbnail (OpenGraph)
└── nature/
    ├── index.md        <-- contains `cover: true` param for `tree.jpeg`
    ├── nature1.jpeg
    ├── nature2.jpeg
    └── tree.jpeg       <-- nature album cover (param)
```

- `/about.md`: Not a PageBundle and does not have image resources. It is not displayed in the album list.
- `/animals`: A BranchBundle (has `_index.md` and has children) => Displayed as album list (`list` layout).
- `/nature`: A LeafBundle (has `index.md` and no children) => Displayed as gallery (`single` layout).
- The list page must have an image.
- Albums without an image are not shown.

### Lightbox Action

`click`: Toggle the visibility of controls.
`double click`: Zoom the current image.
`swipe left and right`: Switch to the previous/next slide.
`swipe down`: Close the lightbox.

## Front Matter

`cascade`: (map) The key defined here can be inherited by any of its descendants, or it can be overridden.
`draft`: (bool) Whether to disable rendering unless you pass the --buildDrafts flag to the hugo command.
`date`: (string) The date associated with the page, typically the creation date.
`title`: (string) Title of the album, shown in the album list and on the album page.
`description`: (string) Render on the page as `markdown`, and also add to the `meta` elements in the `head` element.
`weight`: (int) The page weight, used to order the page within a page collection.

### Draft

**Support:** cascade;

Reports whether the given page is a draft as defined in front matter.

`draft`: (bool) If set to `true`, Hugo does not publish draft pages when you build your project. To include draft pages when you build your project, use the --buildDrafts command line flag.

```yaml
---
draft: true
title: Draft Album
---
```

### Categories

**Support:** cascade;

If you use categories in your albums, the homepage displays a list of categories.

Make sure `term` is not included in `disableKinds` in the site config.

```yaml
---
title: "Cats"
categories: ["Animals"]
---
```

By default, the "animals" category will have "Animals" as title and no description. You can have a custom title and description by simply creating `content/categories/<category>/_index.md`:

content/categories/animals/\_index.md:

```yaml
---
title: "Cute Animals"
description: "This is the description text of the <animals> category."
---
```

### Private Album

**Support:** cascade;

The album will be built by Hugo, and it can be accessed using the corresponding URL.

`private`: (bool) If set to `true`, setting the album to private will prevent it from appearing in lists, RSS, sitemaps, etc.

```yaml
---
title: "Private Album"
params:
  private: true
---
```

### Featured Content On The Homepage

**Support:** cascade;

Albums (and also taxonomy pages like categories) can be marked as `featured`:

```yaml
---
title: "Featured Album"
params:
  featured: true
---
```

When used in combination with `private` this album is only shown as featured album on the homepage, and not in any album list:

```yaml
---
title: "Featured Album"
params:
  private: true
  featured: true
---
```

### Album Cover

By default, the cover image of an album is the first image in its folder. To select a specific image (which must be part of the album), use the `cover` resource parameter in the front matter:

```yaml
---
title: "Nature"
resources:
  - src: "tree.jpeg"
    params:
      cover: true
---
```

You can hide images from the gallery and use them only as a cover:

```yaml
---
title: "Nature"
resources:
  - src: "nature-cover.jpeg"
    params:
      cover: true
      hidden: true
---
```

## Hugo Config

The file is located at `config/_default/hugo.yaml`.

### Exclude Original Images

**Support:** cascade;

Exclude all original images from the published site, you can use the `build.publishResources` configuration option. With `publishResources: false` only the resized images (without any metadata) are included in the published site, which can save quite some disk space.

**Note: The original image may not be completely excluded.** Improper use of the `.Permalink`, `.RelPermalink` or `Publish` methods may result in it being included.

```yaml
cascade:
  - build:
      publishResources: false
```

### Download Image

**Support:** cascade;

Explicitly set whether the download function is enabled.

`enable`: (bool) Whether to enable the download feature.

`imageSpec`: (string) If the value is an empty string `""`, use the value of the [`publishResources`](#exclude-original-images) field (when this value is `true`, download the original image; when `false`, download the lightbox image).

```yaml
params:
  downImage:
    enable: true
    imageSpec: "fit 3200x3200"
```

### Album

#### Sort

The default sort order for page collections, follows this priority:

- weight (ascending)
- date (descending)
- linkTitle falling back to title (ascending)
- logical path (ascending)

### Gallery

#### Sort

**Support:** cascade;

Used to sort images in the gallery.

The first element has the highest priority.

`key`: (string) Sort by. Values: title; name; params.weight; params.date;

`order`: (string) Sort order. Values: asc(ascending); desc(descending);

```yaml
params:
  gallery:
    sort:
      - { key: "params.weight", order: "asc" }
      - { key: "params.date", order: "desc" }
      - { key: "title", order: "asc" }
      - { key: "name", order: "asc" }
```

Front matter:

```yaml
---
resources:
  - src: "dog-1.jpeg"
    name: "dog-siberian-husky"
    title: "Siberian Husky"
    params:
      weight: 1
      date: "2026-01-02T08:00:00+01:00"
  - src: "dog-2.jpeg"
    name: "dog-alaskan-malamute"
    title: "Alaskan Malamute"
    params:
      weight: 2
      date: "2026-01-02T09:00:00+01:00"
---
```

#### PhotoSwipe

**Support:** cascade;

PhotoSwipe lightbox settings.

`photoSwipe.enableCaption`: (float) Whether to display caption content on the lightbox.

```yaml
params:
  gallery:
    photoSwipe:
      enableCaption: true
```

#### Justified

**Support:** cascade;

Justified image gallery layout settings.

`justified.gutterH`: (int) Horizontal spacing between items.

`justified.gutterV`: (int) Vertical spacing between items.

`justified.rowHeight`: (int) Rows height.

`justified.rowHeightTolerance`: (float) The value range is [0,1], how far row heights can stray from rowHeight. 0 would force rows to be the rowHeight exactly and would likely make it impossible to justify.

```yaml
params:
  gallery:
    justified:
      gutterH: 10
      gutterV: 10
      rowHeight: 320
      rowHeightTolerance: 0.25
```

### Watermark

**Support:** cascade;

Add a watermark to each image.

`path`: (string) Relative to the `assets/` path.

`opacity`: (float) Control the opacity of the watermark image.

`size`: (float) The coefficient that controls the watermark relative to the height of the original image.

`x`: (float) The horizontal offset factor relative to the original image width

`y`: (float) The vertical offset factor relative to the original image height.

When `x & y` are in [0, 1], the watermark will not go beyond the image boundaries; when they are both 0.5, the watermark is centered.

**Note:** If the watermark is set in the corner, it may be blocked by elements with the `overflow: hidden` property. The watermark has actually been correctly added. It is recommended to download the image for verification.

```yaml
params:
  watermark:
    path: "images/watermark/watermark.png"
    # The value range of the following field is [0,1].
    opacity: 0.2
    size: 0.05
    x: 0.5
    y: 0.5
```

### Social Icons

Add social icons on the bottom of each page.

`Icons`: twitter instagram linkedin website mastodon pixelfed mixcloud flickr 500px

```yaml
params:
  socialIcons:
    github: "https://github.com/zero-dream/hugo-gallery/"
    facebook: "https://www.facebook.com/"
    youtube: "https://www.youtube.com/"
    email: "mailto:user@example.com"
    whatsapp: "1234567890"
```

### Related Content

If related content is available for your site (e.g. when keywords or tags are used), related albums are shown below each gallery. Read more about this in the [Hugo Docs](https://gohugo.io/content-management/related/#configure-related-content).

```yaml
related:
  includeNewer: true
  threshold: 10
  toLower: false
  indices:
    - applyFilter: false
      cardinalityThreshold: 0
      name: "categories"
      pattern: ""
      toLower: false
      type: "basic"
      weight: 10
    - applyFilter: false
      cardinalityThreshold: 0
      name: "keywords"
      pattern: ""
      toLower: false
      type: "basic"
      weight: 50
```

## Custom

### Custom Head

You can add additional `head` elements in `layouts/_partials/common/head-custom.html`.

### Custom CSS

CSS is generated with Hugo Pipes, so you can add additional CSS in `assets/css/common/custom.scss`.

### Custom JavaScript

You can add additional JavaScript in `assets/js/common/custom.js`.

## Handle

### Local Storage

Each build will clear the `localStorage` under the current domain.

- Custom toggled themes will be reset.
