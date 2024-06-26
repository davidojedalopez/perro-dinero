const { DateTime, Settings } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const readingTime = require('eleventy-plugin-reading-time');
const Image = require('@11ty/eleventy-img');
const path = require("path");

Settings.defaultLocale = 'es-MX';

function structuredData(data) {
  const HEADLINE_CHARACTER_LIMIT = 110
  if (!data || !data.type) {
    return ''
  }

  const { type, headline, datePublished, dateModified, author, keywords, image } = data
  const validHeadline = headline.slice(0, HEADLINE_CHARACTER_LIMIT)
  const validKeywords = keywords
    .split(',')
    .filter(it => it !== 'posts' && it !== 'books')

  const types = { post: 'BlogPosting' }
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": types[type],
    headline: validHeadline,
    keywords: validKeywords,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url
    },
    inLanguage: "es-MX",
    image
  }
  return `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
}

function imageShortCode(src, alt, altShouldBeCaption = true, caption = '', loading = 'lazy', classes = "", sizes = "(min-width: 30em) 50vw, 100vw") {
  const options = {
    widths: [600, 640, 800, 1200],
    formats: ['webp', 'jpeg'],
    sharpOptions: {
      animated: true
    },
    filenameFormat: ((id, src, width, format, options) => {
      const extension = path.extname(src);
      const second_to_last_part = path.normalize(src).split("/").reverse()[1]
      const name = path.basename(src, extension)
      return `${second_to_last_part}-${name}-${width}w.${format}`;
    }),
    urlPath: "/img/",
    outputDir: "./_site/img",
    useCache: true
  }
  Image(src, options);

  const imageAttributes = {
    class: classes,
    alt,
    sizes,
    loading,
    decoding: 'async',
  }

  const metadata = Image.statsSync(src, options)
  const html = Image.generateHTML(metadata, imageAttributes, { whitespaceMode: 'inline' })
  const figureCaption = altShouldBeCaption ? alt : caption
  return figureCaption ?
    `<figure>${html}<figcaption>${figureCaption}</figcaption></figure>` :
    html
}


module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(readingTime);

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");

  eleventyConfig.addFilter("readableDate", dateObj => {
    if (dateObj instanceof String) {
      dateObj = new Date(dateObj);
    }
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("dd LLLL yyyy");
  });

  eleventyConfig.addFilter("toISOString", dateObj => {
    if (dateObj instanceof String) {
      dateObj = new Date(dateObj)
    }
    return dateObj.toISOString();
  });

  eleventyConfig.addFilter("getTime", dateObj => {
    if (dateObj instanceof String) {
      dateObj = new Date(dateObj)
    }
    return dateObj.getTime();
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('slugDate', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy/LL/dd');
  })

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  const now = Date.now()
  const shouldBeLive = post => post.data.published_at <= now && !post.data.draft;

  eleventyConfig.addCollection("publishables", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob(["posts/*.md", "books/*.md", "atomic_essays/*.md", "newsletters/*.md"])
      .filter(shouldBeLive);
  });

  eleventyConfig.addCollection("rssables", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob(["posts/*.md", "books/*.md", "atomic_essays/*.md"])
      .filter(shouldBeLive);
  });


  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("posts/*.md")
      .filter(shouldBeLive);
  });

  eleventyConfig.addCollection("books", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("books/*.md")
      .filter(shouldBeLive);
  });

  eleventyConfig.addCollection("postsAndBooks", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob(["posts/*.md", "books/*.md"])
      .filter(shouldBeLive);
  });

  eleventyConfig.addCollection("atomic_essays", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob('atomic_essays/*.md')
      .filter(shouldBeLive);
  });

  eleventyConfig.addCollection("faqs", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob('faqs/*.md')
  });

  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy('robots.txt')
  eleventyConfig.addPassthroughCopy('humans.txt')
  eleventyConfig.addPassthroughCopy('manifest.json')
  eleventyConfig.addPassthroughCopy('.well-known')

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "🔗"
  }).use(require("markdown-it-toc-done-right"), {
    level: [1, 2, 3]
  }).disable('code');
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addNunjucksShortcode("image", imageShortCode);
  eleventyConfig.addNunjucksShortcode("structured_data", structuredData);

  eleventyConfig.on('eleventy.after', async () => {
    try {
      const dir = '_site/newsletters'
      if(fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true });
      }
    } catch(error) {
      console.error(error)
    }
  })

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about those.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.io/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`
    // pathPrefix: "/",

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // These are all optional, defaults are shown:
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
