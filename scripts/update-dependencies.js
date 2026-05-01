#!/usr/bin/env node
/**
 * Fetches the latest versions of selected @processmaker packages from
 * https://registry.npmjs.org/ and updates package.json (devDependencies;
 * peerDependencies for vue-form-elements). Runs npm install when anything
 * changes. Scoped registry overrides in .npmrc do not affect the lookup.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const semver = require('semver');

const PUBLIC_REGISTRY = 'https://registry.npmjs.org/';
const ROOT = path.resolve(__dirname, '..');
const PKG_PATH = path.join(ROOT, 'package.json');

const TARGETS = [
  { name: '@processmaker/vue-form-elements', peer: true },
  { name: '@processmaker/vue-multiselect', peer: false },
];

function readPkg() {
  return JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
}

function npmLatestVersion(name) {
  const out = execSync(
    `npm view "${name}" version --registry ${PUBLIC_REGISTRY}`,
    { encoding: 'utf8', cwd: ROOT },
  );
  return out.trim();
}

function main() {
  const pkg = readPkg();
  const updates = [];

  for (const { name, peer } of TARGETS) {
    const currentRaw =
      (pkg.devDependencies && pkg.devDependencies[name]) ||
      (pkg.dependencies && pkg.dependencies[name]);
    if (!currentRaw) {
      console.error(`Missing ${name} in package.json dependencies.`);
      process.exit(1);
    }
    const current = semver.minVersion(currentRaw);
    if (!current) {
      console.error(`Could not parse current version for ${name}: ${currentRaw}`);
      process.exit(1);
    }

    let latest;
    try {
      latest = npmLatestVersion(name);
    } catch (e) {
      console.error(`Failed to resolve latest version for ${name} from npmjs.`);
      console.error(e.message);
      process.exit(1);
    }
    if (!semver.valid(latest)) {
      console.error(`Invalid latest version from registry for ${name}: ${latest}`);
      process.exit(1);
    }

    if (!semver.gt(latest, current)) {
      console.log(`${name}: no update (current ${current}, npm latest ${latest}).`);
      continue;
    }

    pkg.devDependencies[name] = latest;
    if (peer) {
      if (!pkg.peerDependencies || !Object.prototype.hasOwnProperty.call(pkg.peerDependencies, name)) {
        console.error(`${name} is expected in peerDependencies but was not found.`);
        process.exit(1);
      }
      pkg.peerDependencies[name] = latest;
    }
    updates.push({ name, from: String(current), to: latest });
  }

  if (updates.length === 0) {
    console.log('No dependency updates applied.');
    return;
  }

  fs.writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  for (const u of updates) {
    console.log(`Updated ${u.name}: ${u.from} -> ${u.to}`);
  }
  console.log('Running npm install…');
  execSync('npm install', { stdio: 'inherit', cwd: ROOT });
}

main();
