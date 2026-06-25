// Smallest checks that fail if the core logic breaks. `node test/smoke.js`.
'use strict';

const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const { getInstructions } = require('../principles/build-instructions.js');
const { parseCommand, isDeactivation, writeHookOutput } = require('../hooks/config.js');

// principles
assert.strictEqual(getInstructions('off'), '', 'off => empty');
assert.match(getInstructions('medium'), /level: medium/);
assert.match(getInstructions('bogus'), /level: medium/, 'unknown level => default');
assert.match(getInstructions('medium'), /2\. LEAN/, 'all six pillars ship');

// command parsing
assert.strictEqual(parseCommand('please /capybaraa high'), 'high');
assert.strictEqual(parseCommand('capybaraa off'), 'off');
assert.strictEqual(parseCommand('no command here'), null);
assert.ok(isDeactivation('stop capybaraa'));
assert.ok(isDeactivation('go normal mode now'));
assert.ok(!isDeactivation('keep going'));

// command parsing handles the namespaced form too
assert.strictEqual(parseCommand('/capybaraa:capybaraa off'), 'off');

// the three slash skills exist (Claude Code surfaces skills, not commands/*.toml)
for (const s of ['capybaraa', 'capybaraa-help', 'capybaraa-review']) {
  const p = path.join(__dirname, '..', 'skills', s, 'SKILL.md');
  assert.ok(fs.existsSync(p), `missing skill ${s}`);
  assert.ok(fs.readFileSync(p, 'utf8').startsWith('---'), `skill ${s} needs frontmatter`);
}

// SubagentStart MUST be JSON-wrapped or Claude Code drops the context
const captured = [];
const orig = process.stdout.write;
process.stdout.write = (s) => { captured.push(s); return true; };
writeHookOutput('SubagentStart', 'hello');
writeHookOutput('SessionStart', 'plain');
process.stdout.write = orig;
assert.deepStrictEqual(JSON.parse(captured[0]).hookSpecificOutput, { hookEventName: 'SubagentStart', additionalContext: 'hello' });
assert.strictEqual(captured[1], 'plain', 'SessionStart stays raw');

console.log('ok: all smoke checks passed');
