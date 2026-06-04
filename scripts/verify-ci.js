const fs = require('fs');
const path = require('path');

const root = process.cwd();
const workflowPath = path.join(root, '.github/workflows/verify.yml');
const travisPath = path.join(root, '.travis.yml');
let failures = 0;

function pass(message) {
  console.log(`PASS: ${message}`);
}

function fail(message) {
  failures += 1;
  console.error(`FAIL: ${message}`);
}

function assertIncludes(contents, pattern, description) {
  if (typeof pattern === 'string' ? contents.includes(pattern) : pattern.test(contents)) {
    pass(description);
  } else {
    fail(description);
  }
}

if (fs.existsSync(workflowPath)) {
  pass('.github/workflows/verify.yml exists');
} else {
  fail('.github/workflows/verify.yml should exist');
}

if (fs.existsSync(travisPath)) {
  fail('.travis.yml should be removed now that GitHub Actions is the primary PR verification path');
} else {
  pass('.travis.yml is not present');
}

const workflow = fs.existsSync(workflowPath) ? fs.readFileSync(workflowPath, 'utf8') : '';

assertIncludes(workflow, /^name:\s*(CI|Verify)/m, 'workflow has a clear CI/Verify name');
assertIncludes(workflow, /pull_request:/, 'workflow runs on pull requests');
assertIncludes(workflow, /push:[\s\S]*branches:[\s\S]*-\s+master/, 'workflow runs on pushes to master');
assertIncludes(workflow, /actions\/checkout@v4/, 'workflow checks out the repository');
assertIncludes(workflow, /actions\/setup-node@v4/, 'workflow uses actions/setup-node@v4');
assertIncludes(workflow, /node-version-file:\s*['"]?\.nvmrc['"]?/, 'workflow reads Node version from .nvmrc');
assertIncludes(workflow, /cache:\s*['"]?npm['"]?/, 'workflow enables npm cache');
assertIncludes(workflow, /BANXICO_OFFLINE:\s*['"]?true['"]?/, 'workflow uses offline Banxico fixture data for deterministic CI builds');
assertIncludes(workflow, /run:\s*npm ci/, 'workflow runs deterministic npm ci install');
assertIncludes(workflow, /run:\s*npm run verify/, 'workflow runs npm run verify');
assertIncludes(workflow, /run:\s*npm audit --audit-level=moderate/, 'workflow runs moderate npm audit');

if (/netlify build|netlify deploy|@netlify\/plugin-lighthouse|lhci autorun/.test(workflow)) {
  fail('workflow should stay independent of Netlify deploy/plugin/Lighthouse behavior');
} else {
  pass('workflow is independent of Netlify deploy/plugin/Lighthouse behavior');
}

if (failures > 0) {
  console.error(`CI verification failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('CI verification passed.');
