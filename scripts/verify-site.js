const fs = require('fs');
const path = require('path');

const root = process.cwd();
const site = path.join(root, '_site');
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function assertExists(relPath) {
  const fullPath = path.join(root, relPath);
  if (!fs.existsSync(fullPath)) {
    fail(`${relPath} is missing`);
    return false;
  }
  pass(`${relPath} exists`);
  return true;
}

function countMatches(contents, regex) {
  return [...contents.matchAll(regex)].length;
}

function extractAttribute(tag, attribute) {
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = tag.match(new RegExp(`${escapedAttribute}=["']([^"']*)["']`, 'i'));
  return match ? match[1].trim() : '';
}

function isAbsoluteHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function hasDoubleSlashInPath(value) {
  try {
    return new URL(value).pathname.includes('//');
  } catch {
    return false;
  }
}

function isValidIsoDate(value) {
  if (!value || /^\d+$/.test(value)) {
    return false;
  }

  const timestamp = Date.parse(value);
  return !Number.isNaN(timestamp) && new Date(timestamp).toISOString() === value;
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

assertExists('_site/index.html');
assertExists('_site/feed.xml');
assertExists('_site/feed.json');
assertExists('_site/api/indicadores_economicos.json');
assertExists('_site/posts/cetes/index.html');
assertExists('_site/posts/rendimientos-en-cetes/index.html');
assertExists('_site/herramientas/index.html');
assertExists('_site/portafolio/index.html');
assertExists('_site/assets/main.css');
assertExists('_site/assets/main.js');
assertExists('_site/service-worker.js');

if (fs.existsSync(path.join(site, 'AGENTS.md'))) {
  fail('_site/AGENTS.md should not exist');
} else {
  pass('_site/AGENTS.md is not emitted');
}

for (const relPath of ['.agents', '.hermes']) {
  if (fs.existsSync(path.join(site, relPath))) {
    fail(`_site/${relPath} should not exist`);
  } else {
    pass(`_site/${relPath} is not emitted`);
  }
}

const feedPath = path.join(site, 'feed.xml');
if (fs.existsSync(feedPath)) {
  const feed = fs.readFileSync(feedPath, 'utf8');
  if (feed.includes('<feed') || feed.includes('<rss')) {
    pass('feed.xml contains feed markup');
  } else {
    fail('feed.xml does not contain feed markup');
  }
}

const indicatorsPath = path.join(site, 'api/indicadores_economicos.json');
if (fs.existsSync(indicatorsPath)) {
  try {
    const indicators = JSON.parse(fs.readFileSync(indicatorsPath, 'utf8'));
    const banxico = indicators.banxico || indicators;

    for (const key of [
      'border_minimum_wage',
      'general_minimum_wage',
      'udi',
      'cetes_28_days_yield_rate',
      'cetes_91_days_yield_rate',
      'cetes_182_days_yield_rate',
      'cetes_364_days_yield_rate',
    ]) {
      if (!Object.prototype.hasOwnProperty.call(banxico, key)) {
        fail(`missing Banxico indicator ${key}`);
        continue;
      }

      const value = banxico[key];
      if (typeof value.amount !== 'number' || Number.isNaN(value.amount)) {
        fail(`Banxico indicator ${key} has non-numeric amount`);
      } else {
        pass(`Banxico indicator ${key} is present`);
      }
    }
  } catch (error) {
    fail(`indicator JSON failed to parse: ${error.message}`);
  }
}

for (const file of walk(site).filter((file) => /\.(html|json|xml)$/.test(file))) {
  const contents = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(root, file);

  if (contents.includes('token=')) {
    fail(`token query string leaked into ${relPath}`);
  }

  if (contents.includes('BANXICO_API_KEY')) {
    fail(`environment variable name leaked into ${relPath}`);
  }
}

for (const file of walk(site).filter((file) => file.endsWith('.html'))) {
  const contents = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(site, file);

  const htmlTag = contents.match(/<html\b[^>]*>/i)?.[0] || '';
  const headContents = contents.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
  const lang = extractAttribute(htmlTag, 'lang');
  if (lang === 'es-MX') {
    pass(`${relPath} uses lang=\"es-MX\"`);
  } else {
    fail(`${relPath} should use html lang=\"es-MX\"`);
  }

  const titleCount = countMatches(headContents, /<title\b[^>]*>[\s\S]*?<\/title>/gi);
  if (titleCount === 1) {
    pass(`${relPath} has exactly one title`);
  } else {
    fail(`${relPath} should have exactly one title, found ${titleCount}`);
  }

  const titleTag = headContents.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleTag || !titleTag[1].trim()) {
    fail(`${relPath} has an empty title`);
  }

  const descriptionTag = headContents.match(/<meta\b[^>]*name=["']description["'][^>]*>/i);
  const description = descriptionTag ? extractAttribute(descriptionTag[0], 'content') : '';
  if (description) {
    pass(`${relPath} has a meta description`);
  } else {
    fail(`${relPath} should have a non-empty meta description`);
  }

  const canonicalTags = headContents.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi) || [];
  if (canonicalTags.length !== 1) {
    fail(`${relPath} should have exactly one canonical URL, found ${canonicalTags.length}`);
  } else {
    const canonicalUrl = extractAttribute(canonicalTags[0], 'href');
    if (isAbsoluteHttpUrl(canonicalUrl)) {
      pass(`${relPath} has an absolute canonical URL`);
    } else {
      fail(`${relPath} canonical URL should be absolute: ${canonicalUrl || '(empty)'}`);
    }
  }

  for (const property of ['og:title', 'og:description', 'og:image']) {
    const tag = headContents.match(new RegExp(`<meta\\b[^>]*property=["']${property}["'][^>]*>`, 'i'));
    const value = tag ? extractAttribute(tag[0], 'content') : '';
    if (value) {
      pass(`${relPath} has ${property}`);
    } else {
      fail(`${relPath} should have non-empty ${property}`);
    }
  }

  for (const property of ['og:image', 'twitter:image']) {
    const tag = headContents.match(new RegExp(`<meta\\b[^>]*(?:property|name)=["']${property}["'][^>]*>`, 'i'));
    const value = tag ? extractAttribute(tag[0], 'content') : '';
    if (!value) {
      fail(`${relPath} should have non-empty ${property}`);
      continue;
    }

    if (!isAbsoluteHttpUrl(value)) {
      fail(`${relPath} ${property} should be absolute: ${value}`);
      continue;
    }

    if (hasDoubleSlashInPath(value)) {
      fail(`${relPath} ${property} should not contain double slashes in its path: ${value}`);
    } else {
      pass(`${relPath} ${property} URL has a normalized path`);
    }
  }

  for (const property of ['article:published_time', 'article:modified_time']) {
    const tag = headContents.match(new RegExp(`<meta\\b[^>]*property=["']${property}["'][^>]*>`, 'i'));
    if (!tag) {
      continue;
    }

    const value = extractAttribute(tag[0], 'content');
    if (isValidIsoDate(value)) {
      pass(`${relPath} has ISO ${property}`);
    } else {
      fail(`${relPath} ${property} should be an ISO timestamp: ${value || '(empty)'}`);
    }
  }
}

if (failures > 0) {
  console.error(`Site smoke verification failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Site smoke verification passed.');
