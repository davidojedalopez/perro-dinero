const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItToc = require('markdown-it-toc-done-right');

function createMarkdownLibrary() {
  return markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.linkInsideHeader({
      class: 'direct-link',
      symbol: '🔗',
    }),
  }).use(markdownItToc, {
    level: [1, 2, 3],
  }).disable('code');
}

function registerMarkdown(eleventyConfig) {
  eleventyConfig.setLibrary('md', createMarkdownLibrary());
}

module.exports = {
  createMarkdownLibrary,
  registerMarkdown,
};
