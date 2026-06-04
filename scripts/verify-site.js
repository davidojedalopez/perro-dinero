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

if (failures > 0) {
  console.error(`Site smoke verification failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Site smoke verification passed.');
