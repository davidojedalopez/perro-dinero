const themes = require('../_data/themes');
const { resolvePostThemeKeys } = require('./filters');

function isLivePost(post, now = Date.now()) {
  return post.data.published_at <= now && !post.data.draft;
}

function registerCollections(eleventyConfig, { now = Date.now() } = {}) {
  const shouldBeLive = (post) => isLivePost(post, now);

  eleventyConfig.addCollection('publishables', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob(['posts/*.md', 'books/*.md', 'atomic_essays/*.md', 'newsletters/*.md'])
      .filter(shouldBeLive);
  });

  eleventyConfig.addCollection('rssables', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob(['posts/*.md', 'books/*.md', 'atomic_essays/*.md'])
      .filter(shouldBeLive);
  });

  eleventyConfig.addCollection('posts', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('posts/*.md')
      .filter(shouldBeLive);
  });

  eleventyConfig.addCollection('postsByTheme', (collectionApi) => {
    const index = Object.values(themes).reduce((acc, theme) => {
      acc[theme.slug] = [];
      return acc;
    }, {});

    collectionApi
      .getFilteredByGlob('posts/*.md')
      .filter(shouldBeLive)
      .forEach((post) => {
        const postThemes = resolvePostThemeKeys(post.data, {
          fallbackToTags: true,
          onInvalidTheme: (token) => {
            console.warn(`[themes] Tema no definido "${token}" en ${post.inputPath}`);
          },
        });

        postThemes.forEach((themeKey) => {
          index[themes[themeKey].slug].push(post);
        });
      });

    return index;
  });

  eleventyConfig.addCollection('books', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('books/*.md')
      .filter(shouldBeLive);
  });

  eleventyConfig.addCollection('postsAndBooks', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob(['posts/*.md', 'books/*.md'])
      .filter(shouldBeLive);
  });

  eleventyConfig.addCollection('atomic_essays', (collectionApi) => {
    return collectionApi
      .getFilteredByGlob('atomic_essays/*.md')
      .filter(shouldBeLive);
  });

  eleventyConfig.addCollection('faqs', (collectionApi) => {
    return collectionApi.getFilteredByGlob('faqs/*.md');
  });
}

module.exports = {
  isLivePost,
  registerCollections,
  resolvePostThemeKeys,
};
