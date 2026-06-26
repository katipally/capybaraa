#!/usr/bin/env node
// SessionStart: ensure flag exists, inject the principles, nudge statusline once.
'use strict';

const fs = require('fs');
const path = require('path');
const { getState, setState, flagPath, writeHookOutput } = require('./config.js');
const { getInstructions } = require('../principles/build-instructions.js');

const state = getState();
if (!fs.existsSync(flagPath())) setState(state); // first run: persist default

if (state !== 'off') {
  let out = getInstructions(state);

  // One-time statusline nudge: only if no statusline configured yet.
  try {
    const settings = path.join(process.env.CLAUDE_CONFIG_DIR || path.join(require('os').homedir(), '.claude'), 'settings.json');
    const raw = fs.existsSync(settings) ? JSON.parse(fs.readFileSync(settings, 'utf8')) : {};
    if (!raw.statusLine) {
      const sh = path.join(__dirname, 'statusline.sh');
      out += `\n\n[capybaraa] Optional: show the badge in your statusline by adding to settings.json:\n"statusLine": { "type": "command", "command": "bash \\"${sh}\\"" }`;
    }
  } catch {}

  writeHookOutput('SessionStart', out);
}
process.exit(0);
