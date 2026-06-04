const fs = require('fs');
const path = require('path');

const root = process.cwd();
const site = path.join(root, '_site');
const siteOrigin = 'https://perrodinero.blog';
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
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

function extractAttribute(tag, attribute) {
  const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = tag.match(new RegExp(`${escapedAttribute}=["']([^"']*)["']`, 'i'));
  return match ? match[1].trim() : '';
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function isIgnoredHref(href) {
  return !href
    || href.startsWith('#')
    || href.startsWith('mailto:')
    || href.startsWith('tel:')
    || href.startsWith('javascript:')
    || href.startsWith('sms:')
    || href.startsWith('whatsapp:');
}

function toSitePath(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath);
  } catch {
    pathname = urlPath;
  }
  pathname = pathname.replace(/\/+/g, '/');
  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`;
  }
  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  } else if (!path.posix.extname(pathname)) {
    pathname += '/index.html';
  }
  return pathname.replace(/^\//, '');
}

function targetExists(sitePath) {
  return fs.existsSync(path.join(site, sitePath));
}

function collectAnchors(contents) {
  const anchors = new Set();
  for (const tag of contents.match(/<[^>]+>/g) || []) {
    const id = extractAttribute(tag, 'id');
    const name = extractAttribute(tag, 'name');
    if (id) anchors.add(id);
    if (name) anchors.add(name);
  }
  return anchors;
}

const htmlFiles = walk(site).filter((file) => file.endsWith('.html'));
const pages = new Map();
const titles = new Map();
const descriptions = new Map();
const incoming = new Map();

function participatesInIndexQuality(relPath) {
  // Post-purchase confirmation pages are transactional endpoints, not indexable content hubs.
  return !relPath.startsWith('ebook/sale/');
}

for (const file of htmlFiles) {
  const relPath = path.relative(site, file).split(path.sep).join('/');
  const contents = fs.readFileSync(file, 'utf8');
  pages.set(relPath, { contents, anchors: collectAnchors(contents) });
  incoming.set(relPath, new Set());

  const head = contents.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
  const title = stripTags(head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
  const descriptionTag = head.match(/<meta\b[^>]*name=["']description["'][^>]*>/i)?.[0] || '';
  const description = decodeHtml(extractAttribute(descriptionTag, 'content'));

  if (participatesInIndexQuality(relPath)) {
    if (!title) {
      fail(`${relPath} has missing title`);
    } else {
      const existing = titles.get(title) || [];
      existing.push(relPath);
      titles.set(title, existing);
    }

    if (!description) {
      fail(`${relPath} has missing description`);
    } else {
      const existing = descriptions.get(description) || [];
      existing.push(relPath);
      descriptions.set(description, existing);
    }
  }
}

const brokenLinks = [];
const brokenAnchors = [];
let checkedInternalLinks = 0;

for (const [sourceRelPath, page] of pages.entries()) {
  for (const tag of page.contents.match(/<a\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi) || []) {
    const href = decodeHtml(extractAttribute(tag, 'href'));
    if (isIgnoredHref(href)) {
      continue;
    }

    let parsed;
    try {
      parsed = new URL(href, `${siteOrigin}/${sourceRelPath}`);
    } catch {
      brokenLinks.push(`${sourceRelPath} -> ${href} (invalid URL)`);
      continue;
    }

    if (parsed.origin !== siteOrigin) {
      continue;
    }

    checkedInternalLinks += 1;
    const targetRelPath = toSitePath(parsed.pathname);
    if (!targetExists(targetRelPath)) {
      brokenLinks.push(`${sourceRelPath} -> ${href} (missing ${targetRelPath})`);
      continue;
    }

    const targetIncoming = incoming.get(targetRelPath);
    if (targetIncoming) {
      targetIncoming.add(sourceRelPath);
    }

    if (parsed.hash) {
      const anchor = parsed.hash.slice(1);
      let decodedAnchor = anchor;
      try {
        decodedAnchor = decodeURIComponent(anchor);
      } catch {
        // Keep raw anchor if the fragment is not decodable.
      }
      const targetPage = pages.get(targetRelPath);
      if (targetPage && !targetPage.anchors.has(anchor) && !targetPage.anchors.has(decodedAnchor)) {
        brokenAnchors.push(`${sourceRelPath} -> ${href} (missing anchor #${anchor})`);
      }
    }
  }
}

if (brokenLinks.length === 0) {
  pass(`internal links resolve (${checkedInternalLinks} checked)`);
} else {
  brokenLinks.slice(0, 50).forEach((link) => fail(`broken internal link: ${link}`));
  if (brokenLinks.length > 50) fail(`and ${brokenLinks.length - 50} more broken internal links`);
}

if (brokenAnchors.length === 0) {
  pass('internal link anchors resolve');
} else {
  brokenAnchors.slice(0, 50).forEach((link) => fail(`broken internal anchor: ${link}`));
  if (brokenAnchors.length > 50) fail(`and ${brokenAnchors.length - 50} more broken internal anchors`);
}

for (const [title, relPaths] of titles.entries()) {
  if (relPaths.length > 1) {
    fail(`duplicate title "${title}" on ${relPaths.join(', ')}`);
  }
}

for (const [description, relPaths] of descriptions.entries()) {
  if (relPaths.length > 1) {
    fail(`duplicate meta description "${description}" on ${relPaths.join(', ')}`);
  }
}

const sitemapPath = path.join(site, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const missingSitemapTargets = sitemapUrls.filter((loc) => {
    const parsed = new URL(loc);
    return parsed.origin === siteOrigin && !targetExists(toSitePath(parsed.pathname));
  });
  if (missingSitemapTargets.length === 0) {
    pass(`sitemap URLs resolve locally (${sitemapUrls.length} checked)`);
  } else {
    missingSitemapTargets.forEach((loc) => fail(`sitemap URL has no generated page: ${loc}`));
  }
}

const importantPages = ['index.html', 'herramientas/index.html', 'preguntas-frecuentes/index.html', 'portafolio/index.html'];
const orphanImportantPages = importantPages.filter((relPath) => pages.has(relPath) && relPath !== 'index.html' && (incoming.get(relPath)?.size || 0) === 0);
if (orphanImportantPages.length === 0) {
  pass('important pages have incoming internal links');
} else {
  orphanImportantPages.forEach((relPath) => fail(`important page has no incoming internal links: ${relPath}`));
}

if (failures > 0) {
  console.error(`Link/content verification failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Link/content verification passed.');
