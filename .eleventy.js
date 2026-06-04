const fs = require('fs');
const { Settings } = require('luxon');
const pluginRss = require('@11ty/eleventy-plugin-rss').default;
const pluginNavigation = require('@11ty/eleventy-navigation');
const { registerCollections } = require('./config/collections');
const { registerFilters } = require('./config/filters');
const { registerMarkdown } = require('./config/markdown');
const { imageShortCode } = require('./config/shortcodes/image');
const { renderStructuredData } = require('./config/structured-data');

Settings.defaultLocale = 'es-MX';

function registerPassthroughCopy(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('img');
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('robots.txt');
  eleventyConfig.addPassthroughCopy('humans.txt');
  eleventyConfig.addPassthroughCopy('llms.txt');
  eleventyConfig.addPassthroughCopy('manifest.json');
  eleventyConfig.addPassthroughCopy('.well-known');
}

function removeNewsletterOutput() {
  try {
    const dir = '_site/newsletters';
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');

  registerFilters(eleventyConfig);
  registerCollections(eleventyConfig);
  registerPassthroughCopy(eleventyConfig);
  registerMarkdown(eleventyConfig);

  eleventyConfig.addNunjucksShortcode('image', imageShortCode);
  eleventyConfig.addNunjucksShortcode('structured_data', renderStructuredData);
  eleventyConfig.on('eleventy.after', removeNewsletterOutput);

  return {
    templateFormats: [
      'md',
      'njk',
      'html',
      'liquid',
    ],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '_site',
    },
  };
};
