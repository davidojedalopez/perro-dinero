const fs = require('fs');
const { DateTime } = require('luxon');
const themes = require('../_data/themes');

function normalizeThemeToken(value = '') {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function toArray(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function createThemeLookup() {
  return Object.entries(themes).reduce((lookup, [themeKey, themeData]) => {
    const tokens = [themeKey, ...(themeData.aliases || [])];
    tokens.forEach((token) => {
      lookup[normalizeThemeToken(token)] = themeKey;
    });
    return lookup;
  }, {});
}

const themeLookup = createThemeLookup();

function resolvePostThemeKeys(postData = {}, { fallbackToTags = true, onInvalidTheme } = {}) {
  const explicitThemes = toArray(postData.themes).filter((token) => typeof token === 'string');
  const rawTokens = explicitThemes.length > 0
    ? explicitThemes
    : (fallbackToTags ? toArray(postData.tags) : []);

  const postThemes = new Set();

  rawTokens.forEach((token) => {
    const normalized = normalizeThemeToken(token);
    const canonicalThemeKey = themeLookup[normalized];

    if (canonicalThemeKey && themes[canonicalThemeKey]) {
      postThemes.add(canonicalThemeKey);
      return;
    }

    if (explicitThemes.length > 0 && onInvalidTheme) {
      onInvalidTheme(token);
    }
  });

  return Array.from(postThemes);
}

function stripFrontMatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

function contentForReadingTime(postOrContent) {
  if (typeof postOrContent === 'string') {
    return postOrContent;
  }

  if (!postOrContent || typeof postOrContent !== 'object') {
    return '';
  }

  if (typeof postOrContent.rawInput === 'string') {
    return postOrContent.rawInput;
  }

  const inputPath = postOrContent.inputPath || postOrContent.page?.inputPath;
  if (inputPath && fs.existsSync(inputPath)) {
    return fs.readFileSync(inputPath, 'utf8');
  }

  return '';
}

function readingTimeFilter(postOrContent, { printSeconds = false, raw = false, speed = 300 } = {}) {
  const content = stripFrontMatter(contentForReadingTime(postOrContent))
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\{[%#][\s\S]*?[%#]\}/g, '')
    .replace(/\{\{[\s\S]*?\}\}/g, '');
  const matches = content.match(/[\u0400-\u04FF]+|\S+\s*/g);
  const count = matches !== null ? matches.length : 0;

  if (printSeconds) {
    const min = Math.floor(count / speed);
    const sec = Math.floor((count % speed) / (speed / 60));

    if (raw) {
      return min * 60 + sec;
    }

    const mins = min + ' minute' + (min === 1 ? '' : 's') + ', ';
    const secs = sec + ' second' + (sec === 1 ? '' : 's');
    return min > 0 ? mins + secs : secs;
  }

  const min = Math.ceil(count / speed);
  return raw ? min : min + ' min';
}

function normalizeSiteUrl(value, baseUrl) {
  if (!value) {
    return '';
  }

  try {
    return new URL(value).href;
  } catch {
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return new URL(value.toString().replace(/^\/+/, ''), normalizedBase).href;
  }
}

function isExternalUrl(value, baseUrl) {
  if (!value) {
    return false;
  }

  try {
    return new URL(value).origin !== new URL(baseUrl).origin;
  } catch {
    return false;
  }
}

function registerFilters(eleventyConfig) {
  eleventyConfig.addFilter('readingTime', readingTimeFilter);
  eleventyConfig.addFilter('absoluteSiteUrl', normalizeSiteUrl);
  eleventyConfig.addFilter('isExternalUrl', isExternalUrl);

  eleventyConfig.addFilter('readableDate', (dateObj) => {
    if (dateObj instanceof String) {
      dateObj = new Date(dateObj);
    }
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLLL yyyy');
  });

  eleventyConfig.addFilter('toISOString', (dateObj) => {
    if (dateObj instanceof String) {
      dateObj = new Date(dateObj);
    }
    return dateObj.toISOString();
  });

  eleventyConfig.addFilter('getTime', (dateObj) => {
    if (dateObj instanceof String) {
      dateObj = new Date(dateObj);
    }
    return dateObj.getTime();
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('slugDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy/LL/dd');
  });

  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  eleventyConfig.addFilter('postThemes', (postData = {}) => {
    return resolvePostThemeKeys(postData).map((themeKey) => ({
      key: themeKey,
      ...themes[themeKey],
    }));
  });
}

module.exports = {
  contentForReadingTime,
  createThemeLookup,
  isExternalUrl,
  normalizeSiteUrl,
  normalizeThemeToken,
  readingTimeFilter,
  registerFilters,
  resolvePostThemeKeys,
  stripFrontMatter,
  toArray,
};
