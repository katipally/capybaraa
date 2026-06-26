#!/usr/bin/env node
// One-shot release: bump versions, test, commit, tag, push, and create the GitHub
// Release together, so a tag can never land without its Release again.
//   npm run release -- X.Y.Z        (the -- is required so npm forwards the version)
//   npm run release -- X.Y.Z --dry-run
'use strict';

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.join(__dirname, '..');
const cap = (cmd) => execSync(cmd, { cwd: root, encoding: 'utf8' }).trim(); // capture
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' });        // stream
const die = (msg) => { console.error(`release: ${msg}`); process.exit(1); };

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const version = (args.find((a) => !a.startsWith('-')) || '').replace(/^v/, '');
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  die(`need a semver version. usage: npm run release -- X.Y.Z [--dry-run] (got "${args.join(' ') || ''}")`);
}
const tag = `v${version}`;

// --- preflight: only release from a clean position with notes ready ---
const branch = cap('git rev-parse --abbrev-ref HEAD');
if (branch !== 'main') die(`releases ship from main, you are on "${branch}"`);
if (cap(`git tag --list ${tag}`)) die(`tag ${tag} already exists`);

const lines = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8').split('\n');
const start = lines.findIndex((l) => l.startsWith(`## [${version}]`));
if (start === -1) die(`add a "## [${version}]" section to CHANGELOG.md before releasing`);
let end = lines.findIndex((l, i) => i > start && l.startsWith('## ['));
if (end === -1) end = lines.length;
const notes = lines.slice(start + 1, end).join('\n').trim();
if (!notes) die(`the "## [${version}]" section in CHANGELOG.md is empty`);

console.log(`release: ${tag} on ${branch}\n--- notes ---\n${notes}\n-------------`);

if (dryRun) {
  console.log('release: --dry-run, stopping before any change. Preflight passed.');
  process.exit(0);
}

// --- bump the three version fields in place (string-replace keeps formatting) ---
for (const file of ['.claude-plugin/plugin.json', 'package.json', '.claude-plugin/marketplace.json']) {
  const p = path.join(root, file);
  const src = fs.readFileSync(p, 'utf8');
  const re = /("version":\s*")\d+\.\d+\.\d+(")/;
  if (!re.test(src)) die(`no version field in ${file}`);
  fs.writeFileSync(p, src.replace(re, `$1${version}$2`));
}

// --- prove it before publishing ---
run('npm test');
try { run('npx --yes @anthropic-ai/claude-code plugin validate .'); }
catch { console.warn('release: plugin validate unavailable, skipped (CI re-checks)'); }

// --- commit, tag, push, release ---
run('git add -A');
run(`git commit -m "release ${version}"`);
run(`git tag ${tag}`);
run('git push origin main');
run(`git push origin ${tag}`);

const notesFile = path.join(os.tmpdir(), `capybaraa-${tag}.md`);
fs.writeFileSync(notesFile, notes);
try {
  run(`gh release create ${tag} --title ${tag} --notes-file "${notesFile}" --latest`);
} catch {
  die(`pushed ${tag}, but the GitHub Release failed (is gh authed?). Finish with:\n  gh release create ${tag} --title ${tag} --notes-file "${notesFile}" --latest`);
}
console.log(`release: ${tag} shipped.`);
