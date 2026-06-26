#!/usr/bin/env node
// UserPromptSubmit: catch "/capybaraa on|off", "stop capybaraa", "start capybaraa" to switch state.
'use strict';

const { parseCommand, isDeactivation, isActivation, setState, writeHookOutput } = require('./config.js');

let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  let prompt = '';
  try { prompt = JSON.parse(input).prompt || ''; } catch { prompt = input; }

  if (isDeactivation(prompt)) {
    setState('off');
    writeHookOutput('UserPromptSubmit', '[capybaraa] off. Say "capybaraa on" to re-enable.');
  } else if (isActivation(prompt)) {
    setState('on');
    writeHookOutput('UserPromptSubmit', '[capybaraa] on.');
  } else {
    const cmd = parseCommand(prompt);
    if (cmd) {
      setState(cmd);
      writeHookOutput('UserPromptSubmit', cmd === 'off' ? '[capybaraa] off.' : '[capybaraa] on.');
    }
  }
  process.exit(0);
});
