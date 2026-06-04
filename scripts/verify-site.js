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

function getJsonLdBlocks(contents, relPath) {
  const scripts = contents.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];

  return scripts.map((script, index) => {
    const json = script.replace(/^<script\b[^>]*>/i, '').replace(/<\/script>$/i, '').trim();
    try {
      const data = JSON.parse(json);
      pass(`${relPath} JSON-LD block ${index + 1} parses`);
      return data;
    } catch (error) {
      fail(`${relPath} JSON-LD block ${index + 1} should be valid JSON: ${error.message}`);
      return null;
    }
  }).filter(Boolean);
}

function toSchemaArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(toSchemaArray);
  }

  if (Array.isArray(value['@graph'])) {
    return value['@graph'].flatMap(toSchemaArray);
  }

  return [value];
}

function findSchema(schemas, type) {
  return schemas.find((schema) => {
    const schemaType = schema && schema['@type'];
    return schemaType === type || (Array.isArray(schemaType) && schemaType.includes(type));
  });
}

function assertSchemaType(schemas, type, relPath) {
  const schema = findSchema(schemas, type);
  if (schema) {
    pass(`${relPath} has ${type} schema`);
  } else {
    fail(`${relPath} should have ${type} schema`);
  }
  return schema;
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

function assertSingleFileMatch(relDir, regex, description) {
  const fullDir = path.join(site, relDir);
  const matches = fs.existsSync(fullDir)
    ? fs.readdirSync(fullDir).filter((entry) => regex.test(entry))
    : [];

  if (matches.length === 1) {
    pass(`${description} exists: ${path.posix.join(relDir, matches[0])}`);
  } else {
    fail(`${description} should have exactly one matching file, found ${matches.length}`);
  }

  return matches;
}

function assertNetlifyHeader(pathPattern, expectedCacheControl) {
  const netlifyTomlPath = path.join(root, 'netlify.toml');
  const netlifyToml = fs.existsSync(netlifyTomlPath) ? fs.readFileSync(netlifyTomlPath, 'utf8') : '';
  const escapedPathPattern = pathPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const headerBlock = netlifyToml.match(new RegExp(`\\[\\[headers\\]\\][\\s\\S]*?for\\s*=\\s*["']${escapedPathPattern}["'][\\s\\S]*?(?=\\n\\[\\[|$)`));

  if (!headerBlock) {
    fail(`netlify.toml should define headers for ${pathPattern}`);
    return;
  }

  if (headerBlock[0].includes(`cache-control = "${expectedCacheControl}"`)) {
    pass(`netlify.toml sets ${expectedCacheControl} for ${pathPattern}`);
  } else {
    fail(`netlify.toml should set cache-control = "${expectedCacheControl}" for ${pathPattern}`);
  }
}

function extractTags(contents, tagName) {
  return contents.match(new RegExp(`<${tagName}\\b(?:[^>"']|"[^"]*"|'[^']*')*>`, 'gi')) || [];
}

function assertImageAttributes(contents, relPath) {
  for (const tag of extractTags(contents, 'img')) {
    const src = extractAttribute(tag, 'src') || '(missing src)';
    const alt = extractAttribute(tag, 'alt');
    if (alt) {
      pass(`${relPath} image ${src} has alt text`);
    } else {
      fail(`${relPath} image ${src} should have non-empty alt text`);
    }

    if (extractAttribute(tag, 'decoding') === 'async') {
      pass(`${relPath} image ${src} uses async decoding`);
    } else {
      fail(`${relPath} image ${src} should use decoding=\"async\"`);
    }
  }
}

function assertPictureHasAvif(contents, relPath) {
  const pictures = contents.match(/<picture\b[\s\S]*?<\/picture>/gi) || [];
  for (const [index, picture] of pictures.entries()) {
    if (/\.(?:gif|webp)(?:\s|\?|["'])/i.test(picture) && !/\.(?:jpe?g|png)(?:\s|\?|["'])/i.test(picture)) {
      pass(`${relPath} picture ${index + 1} is animated-only and does not require AVIF`);
    } else if (/type=["']image\/avif["']/i.test(picture)) {
      pass(`${relPath} picture ${index + 1} includes AVIF source`);
    } else {
      fail(`${relPath} picture ${index + 1} should include an AVIF source`);
    }
  }
}

assertExists('_site/index.html');
assertExists('_site/feed.xml');
assertExists('_site/feed.json');
assertExists('_site/api/indicadores_economicos.json');
assertExists('_site/posts/cetes/index.html');
assertExists('_site/posts/rendimientos-en-cetes/index.html');
assertExists('_site/herramientas/index.html');
assertExists('_site/portafolio/index.html');
const hashedMainCssFiles = assertSingleFileMatch('assets', /^main\.[a-f0-9]{8,}\.css$/, 'hashed main CSS');
const hashedMainJsFiles = assertSingleFileMatch('assets', /^main\.[a-f0-9]{8,}\.js$/, 'hashed main JS');
const annotationChunkFiles = assertSingleFileMatch('assets', /^annotations\.[a-f0-9]{8,}\.js$/, 'lazy annotations JS chunk');
const debtPlannerChunkFiles = assertSingleFileMatch('assets', /^debt-planner\.[a-f0-9]{8,}\.js$/, 'lazy debt planner JS chunk');
const newsletterObserverChunkFiles = assertSingleFileMatch('assets', /^newsletter-observer\.[a-f0-9]{8,}\.js$/, 'lazy newsletter observer JS chunk');
assertExists('_site/assets/manifest.json');
assertExists('_site/service-worker.js');

const mainJsRelPath = hashedMainJsFiles[0] ? path.join('assets', hashedMainJsFiles[0]) : '';
const mainJsPath = mainJsRelPath ? path.join(site, mainJsRelPath) : '';
const mainJs = mainJsPath && fs.existsSync(mainJsPath) ? fs.readFileSync(mainJsPath, 'utf8') : '';
if (mainJs && fs.statSync(mainJsPath).size < 14 * 1024) {
  pass('initial main JS bundle is under 14 KB');
} else if (mainJsPath) {
  fail('initial main JS bundle should stay under 14 KB after lazy-loading page features');
}

for (const forbidden of ['rough-notation', 'Tarjeta de crédito (tasa alta)', 'simulatePlan', 'newsletter-cta-iframe']) {
  if (mainJs.includes(forbidden)) {
    fail(`initial main JS bundle should not eagerly include page feature code: ${forbidden}`);
  } else {
    pass(`initial main JS bundle does not include ${forbidden}`);
  }
}

const debtPlannerChunk = debtPlannerChunkFiles[0]
  ? fs.readFileSync(path.join(site, 'assets', debtPlannerChunkFiles[0]), 'utf8')
  : '';
if (debtPlannerChunk.includes('Tarjeta de crédito (tasa alta)') && debtPlannerChunk.includes('La mejor opción para pagar menos intereses')) {
  pass('debt planner code is emitted in the debt planner chunk');
} else {
  fail('debt planner chunk should contain the debt planner implementation');
}

const newsletterObserverChunk = newsletterObserverChunkFiles[0]
  ? fs.readFileSync(path.join(site, 'assets', newsletterObserverChunkFiles[0]), 'utf8')
  : '';
if (newsletterObserverChunk.includes('newsletter-cta-iframe')) {
  pass('newsletter observer code is emitted in the newsletter observer chunk');
} else {
  fail('newsletter observer chunk should contain the newsletter iframe observer implementation');
}

const annotationChunk = annotationChunkFiles[0]
  ? fs.readFileSync(path.join(site, 'assets', annotationChunkFiles[0]), 'utf8')
  : '';
if (annotationChunk.includes('annotated') && /rough|annotation/i.test(annotationChunk)) {
  pass('annotation code is emitted in the annotations chunk');
} else {
  fail('annotations chunk should contain the rough notation implementation');
}

for (const relPath of ['_site/assets/main.css', '_site/assets/main.js']) {
  if (fs.existsSync(path.join(root, relPath))) {
    fail(`${relPath} should not exist; main CSS/JS should be content-hashed`);
  } else {
    pass(`${relPath} is not emitted`);
  }
}

const indexHtml = fs.existsSync(path.join(site, 'index.html'))
  ? fs.readFileSync(path.join(site, 'index.html'), 'utf8')
  : '';
for (const file of [...hashedMainCssFiles, ...hashedMainJsFiles]) {
  if (indexHtml.includes(`/assets/${file}`)) {
    pass(`index.html references /assets/${file}`);
  } else {
    fail(`index.html should reference /assets/${file}`);
  }
}

for (const staleReference of ['/assets/main.css', '/assets/main.js']) {
  if (indexHtml.includes(staleReference)) {
    fail(`index.html should not reference stale un-hashed asset ${staleReference}`);
  } else {
    pass(`index.html does not reference ${staleReference}`);
  }
}

assertNetlifyHeader('/assets/*', 'public, max-age=31536000, immutable');
assertNetlifyHeader('/service-worker.js', 'public, max-age=0, must-revalidate');

const generatedAvifFiles = walk(path.join(site, 'img')).filter((file) => file.endsWith('.avif'));
if (generatedAvifFiles.length > 0) {
  pass(`generated AVIF image count is ${generatedAvifFiles.length}`);
} else {
  fail('generated image output should include AVIF derivatives');
}

const ANIMATED_IMAGE_DERIVATIVE_ALLOWLIST = [
  'img/posts-coraje_sorprendido-230w.webp',
  'img/posts-dogs_and_child-240w.webp',
  'img/posts-frustrado-200w.webp',
  'img/posts-perro_en_computadora-480w.webp',
];

const oversizedOptimizedImages = walk(path.join(site, 'img'))
  .filter((file) => /-\d+w\.(?:avif|webp|jpeg)$/.test(file))
  .filter((file) => !ANIMATED_IMAGE_DERIVATIVE_ALLOWLIST.includes(path.relative(site, file)))
  .filter((file) => fs.statSync(file).size > 500 * 1024)
  .map((file) => `${path.relative(site, file)} (${Math.round(fs.statSync(file).size / 1024)} KB)`);
if (oversizedOptimizedImages.length === 0) {
  pass('optimized responsive image derivatives are under 500 KB');
} else {
  fail(`optimized responsive image derivatives should be under 500 KB: ${oversizedOptimizedImages.slice(0, 10).join(', ')}`);
}

if (indexHtml) {
  const firstIndexImage = extractTags(indexHtml, 'img')[0] || '';
  if (extractAttribute(firstIndexImage, 'loading') === 'eager') {
    pass('homepage LCP image uses eager loading');
  } else {
    fail('homepage LCP image should use loading="eager"');
  }

  if (extractAttribute(firstIndexImage, 'fetchpriority') === 'high') {
    pass('homepage LCP image uses high fetchpriority');
  } else {
    fail('homepage LCP image should use fetchpriority="high"');
  }
}

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
  assertImageAttributes(contents, relPath);
  assertPictureHasAvif(contents, relPath);

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

  const schemas = getJsonLdBlocks(contents, relPath).flatMap(toSchemaArray);

  if (relPath === 'index.html') {
    const website = assertSchemaType(schemas, 'WebSite', relPath);
    if (website) {
      if (website.url && isAbsoluteHttpUrl(website.url)) {
        pass(`${relPath} WebSite schema has an absolute url`);
      } else {
        fail(`${relPath} WebSite schema should have an absolute url`);
      }

      if (website.inLanguage === 'es-MX') {
        pass(`${relPath} WebSite schema uses es-MX`);
      } else {
        fail(`${relPath} WebSite schema should use inLanguage es-MX`);
      }
    }
  }

  if (relPath === 'posts/cetes/index.html') {
    const blogPosting = assertSchemaType(schemas, 'BlogPosting', relPath);
    const breadcrumb = assertSchemaType(schemas, 'BreadcrumbList', relPath);
    if (blogPosting) {
      for (const property of ['headline', 'description', 'datePublished', 'dateModified', 'image', 'url', 'mainEntityOfPage']) {
        if (blogPosting[property]) {
          pass(`${relPath} BlogPosting schema has ${property}`);
        } else {
          fail(`${relPath} BlogPosting schema should have ${property}`);
        }
      }

      if (blogPosting.inLanguage === 'es-MX') {
        pass(`${relPath} BlogPosting schema uses es-MX`);
      } else {
        fail(`${relPath} BlogPosting schema should use inLanguage es-MX`);
      }
    }

    if (breadcrumb?.itemListElement?.length >= 3) {
      pass(`${relPath} BreadcrumbList schema has page hierarchy`);
    } else {
      fail(`${relPath} BreadcrumbList schema should include home, section, and page items`);
    }
  }

  if (relPath === 'preguntas-frecuentes/index.html') {
    const faqPage = assertSchemaType(schemas, 'FAQPage', relPath);
    if (faqPage?.mainEntity?.length >= 1) {
      pass(`${relPath} FAQPage schema has questions`);
    } else {
      fail(`${relPath} FAQPage schema should include at least one question`);
    }
  }

  if (relPath === 'libros/el-monje-que-vendio-su-ferrari/index.html') {
    const book = assertSchemaType(schemas, 'Book', relPath);
    const breadcrumb = assertSchemaType(schemas, 'BreadcrumbList', relPath);
    if (book) {
      for (const property of ['name', 'author', 'description', 'image', 'url']) {
        if (book[property]) {
          pass(`${relPath} Book schema has ${property}`);
        } else {
          fail(`${relPath} Book schema should have ${property}`);
        }
      }
    }

    if (breadcrumb?.itemListElement?.length >= 3) {
      pass(`${relPath} BreadcrumbList schema has page hierarchy`);
    } else {
      fail(`${relPath} BreadcrumbList schema should include home, section, and page items`);
    }
  }
}

if (failures > 0) {
  console.error(`Site smoke verification failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Site smoke verification passed.');
