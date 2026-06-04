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

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(root, relPath), 'utf8'));
}

const pkg = readJson('package.json');
const lock = readJson('package-lock.json');
const allDeps = {
  ...(pkg.dependencies || {}),
  ...(pkg.devDependencies || {}),
};

assert(!allDeps['@11ty/eleventy-cache-assets'], '@11ty/eleventy-cache-assets is not a direct dependency', '@11ty/eleventy-cache-assets should be removed as a deprecated direct dependency');
assert(!lock.packages?.['node_modules/@11ty/eleventy-cache-assets'], 'package-lock does not install @11ty/eleventy-cache-assets', 'package-lock should not contain @11ty/eleventy-cache-assets');
assert(allDeps['@11ty/eleventy-fetch'], '@11ty/eleventy-fetch remains available for external data caching', '@11ty/eleventy-fetch should remain as the supported cache/fetch dependency');

const repoTextFiles = [
  'README.md',
  'AGENTS.md',
  '.eleventy.js',
  '_data/banxico.js',
].filter((relPath) => fs.existsSync(path.join(root, relPath)));

for (const relPath of repoTextFiles) {
  const contents = fs.readFileSync(path.join(root, relPath), 'utf8');
  if (contents.includes('@11ty/eleventy-cache-assets')) {
    fail(`${relPath} should not reference deprecated @11ty/eleventy-cache-assets`);
  }
}

const overrideNames = Object.keys(pkg.overrides || {});
assert(overrideNames.length > 0, 'package overrides are explicit');
const readme = fs.existsSync(path.join(root, 'README.md')) ? fs.readFileSync(path.join(root, 'README.md'), 'utf8') : '';
for (const overrideName of overrideNames) {
  assert(
    readme.includes(`\`${overrideName}\``),
    `README documents override ${overrideName}`,
    `README should document why override ${overrideName} exists`,
  );
}

const renovatePath = path.join(root, 'renovate.json');
assert(fs.existsSync(renovatePath), 'renovate.json exists', 'dependency automation config should exist');
if (fs.existsSync(renovatePath)) {
  const renovate = readJson('renovate.json');
  const rules = renovate.packageRules || [];
  const groupNames = rules.map((rule) => rule.groupName).filter(Boolean);
  for (const group of ['Node runtime', 'Eleventy stack', 'Tailwind and PostCSS stack', 'Webpack and Workbox stack', 'Netlify plugins', 'Low-risk npm patch/minor updates']) {
    assert(groupNames.includes(group), `Renovate groups ${group}`, `Renovate should define group: ${group}`);
  }
  assert(Array.isArray(renovate.schedule) && renovate.schedule.length > 0, 'Renovate has a bounded schedule', 'Renovate should be scheduled to avoid noisy PR spam');
  assert((renovate.prConcurrentLimit || 0) <= 3, 'Renovate PR concurrency is scoped', 'Renovate should cap concurrent PRs');
}

if (failures > 0) {
  console.error(`Dependency verification failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Dependency verification passed.');
