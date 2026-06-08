const fs = require('fs');
const path = require('path');

const root = process.cwd();
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function assert(condition, passMessage, failMessage = passMessage) {
  if (condition) {
    pass(passMessage);
  } else {
    fail(failMessage);
  }
}

const expectedModules = [
  'config/filters.js',
  'config/collections.js',
  'config/markdown.js',
  'config/shortcodes/image.js',
];

for (const relPath of expectedModules) {
  assert(fs.existsSync(path.join(root, relPath)), `${relPath} exists`, `${relPath} should exist after Eleventy config modularization`);
}

const eleventyConfigPath = path.join(root, '.eleventy.js');
const eleventyLineCount = fs.readFileSync(eleventyConfigPath, 'utf8').split('\n').length;
assert(eleventyLineCount < 120, `.eleventy.js is orchestration-sized (${eleventyLineCount} lines)`, `.eleventy.js should be under 120 lines after modularization; found ${eleventyLineCount}`);

function requireIfExists(relPath) {
  const fullPath = path.join(root, relPath);
  return fs.existsSync(fullPath) ? require(fullPath) : null;
}

const filters = requireIfExists('config/filters.js');
if (filters) {
  assert(typeof filters.registerFilters === 'function', 'filters module exports registerFilters');
  assert(typeof filters.readingTimeFilter === 'function', 'filters module exports readingTimeFilter');
  assert(filters.readingTimeFilter('uno dos tres', { raw: true }) === 1, 'readingTimeFilter returns raw minute count');
  assert(typeof filters.normalizeSiteUrl === 'function', 'filters module exports normalizeSiteUrl');
  assert(filters.normalizeSiteUrl('/posts/cetes/', 'https://perrodinero.blog') === 'https://perrodinero.blog/posts/cetes/', 'normalizeSiteUrl resolves relative URLs');
  assert(typeof filters.isExternalUrl === 'function', 'filters module exports isExternalUrl');
  assert(filters.isExternalUrl('https://example.com', 'https://perrodinero.blog') === true, 'isExternalUrl detects external URLs');
  assert(typeof filters.htmlSafeJsonStringify === 'function', 'filters module exports htmlSafeJsonStringify');
  const unsafeJson = filters.htmlSafeJsonStringify({ value: '</script><img src=x onerror=alert(1)> & \u2028 \u2029' });
  assert(!unsafeJson.includes('<') && !unsafeJson.includes('>') && !unsafeJson.includes('&'), 'htmlSafeJsonStringify escapes HTML-breaking characters');
  assert(JSON.parse(unsafeJson).value.includes('</script>'), 'htmlSafeJsonStringify preserves parsed JSON data');
}

const collections = requireIfExists('config/collections.js');
if (collections) {
  assert(typeof collections.registerCollections === 'function', 'collections module exports registerCollections');
  assert(typeof collections.resolvePostThemeKeys === 'function', 'collections module exports resolvePostThemeKeys');
  assert(collections.resolvePostThemeKeys({ themes: ['Inversión'] }).includes('inversion'), 'resolvePostThemeKeys normalizes accented theme aliases');
}

const markdown = requireIfExists('config/markdown.js');
if (markdown) {
  assert(typeof markdown.createMarkdownLibrary === 'function', 'markdown module exports createMarkdownLibrary');
  const md = markdown.createMarkdownLibrary();
  assert(md.render('# Título').includes('id="t%C3%ADtulo"'), 'markdown module configures heading anchors');
}

const image = requireIfExists('config/shortcodes/image.js');
if (image) {
  assert(typeof image.imageShortCode === 'function', 'image shortcode module exports imageShortCode');
  assert(typeof image.getImageOptions === 'function', 'image shortcode module exports getImageOptions for focused verification');
  const options = image.getImageOptions('img/posts/covers/cetes.jpg');
  assert(options.formats.includes('avif') && options.formats.includes('webp'), 'image shortcode emits modern image formats');
  const gifOptions = image.getImageOptions('img/posts/coraje_sorprendido.gif');
  assert(gifOptions.formats.length === 1 && gifOptions.formats[0] === 'webp', 'animated GIF shortcode emits animated WebP only');
}

if (failures > 0) {
  console.error(`Eleventy config verification failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Eleventy config verification passed.');
