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

async function imageShortCode(src, alt, altShouldBeCaption = true, caption = '', loading = 'lazy', sizes = "(min-width: 30em) 50vw, 100vw") {
  const metadata = await Image(src, {
    widths: [200, 400, 600, 640],
    formats: ['jpeg', 'webp'],
    filenameFormat: ((id, src, width, format, options) => {
      const extension = path.extname(src);
      const name = path.basename(src, extension)
      return `${name}-${width}w.${format}`;
    }),
    urlPath: "/img/",
    outputDir: "./_site/img",
    useCache: true
  });

  const imageAttributes = {
    alt,
    sizes,
    loading,
    decoding: 'async',
  }

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

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        // browserSync.addMiddleware("*", (req, res) => {
        //   const content_404 = fs.readFileSync('_site/404.html'));
        //   res.writeHead(404, { "ContentType": "text/html; charset=UTF-8" })
        //   res.write(content_404);
        //   res.end();
        // });
      },
    },
    ui: false,
    ghostMode: false
  });

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortCode);

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
