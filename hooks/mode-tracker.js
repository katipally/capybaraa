#!/usr/bin/env node
// UserPromptSubmit: catch "/capybaraa <level>" and "stop capybaraa" to switch state.
'use strict';

const { parseCommand, isDeactivation, setLevel, writeHookOutput } = require('./config.js');

let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  let prompt = '';
  try { prompt = JSON.parse(input).prompt || ''; } catch { prompt = input; }

  if (isDeactivation(prompt)) {
    setLevel('off');
    writeHookOutput('UserPromptSubmit', '[capybaraa] off. Say "capybaraa medium" to re-enable.');
  } else {
    const lvl = parseCommand(prompt);
    if (lvl) {
      setLevel(lvl);
      writeHookOutput('UserPromptSubmit', lvl === 'off' ? '[capybaraa] off.' : `[capybaraa] level: ${lvl}.`);
    }
  }
  process.exit(0);
});
