// State (on/off) + command parsing. The flag file is the source of truth for "is it on".
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const { DEFAULT_STATE, normalizeState } = require('../principles/build-instructions.js');

function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}
function flagPath() {
  return path.join(configDir(), '.capybaraa-active');
}

// Resolution order: flag file -> env -> ~/.config/capybaraa/config.json -> default.
// Any non-"off" value (including legacy deep/lean/medium) normalizes to "on".
function getState() {
  try {
    const v = normalizeState(fs.readFileSync(flagPath(), 'utf8'));
    if (v) return v;
  } catch {}
  const env = normalizeState(process.env.CAPYBARAA_DEFAULT_LEVEL || process.env.CAPYBARAA_DEFAULT_STATE);
  if (env) return env;
  try {
    const cfg = path.join(os.homedir(), '.config', 'capybaraa', 'config.json');
    const raw = JSON.parse(fs.readFileSync(cfg, 'utf8'));
    const v = normalizeState(raw.defaultState || raw.defaultLevel);
    if (v) return v;
  } catch {} // missing or malformed config: fall through to the default, never crash the hook
  return DEFAULT_STATE;
}

function setState(state) {
  try {
    fs.mkdirSync(configDir(), { recursive: true });
    fs.writeFileSync(flagPath(), `${normalizeState(state) || DEFAULT_STATE}\n`);
  } catch {}
}

// A real command is the whole (trimmed) message, not a phrase buried in prose. This is
// the root-cause fix for the substring bug: quoting "capybaraa off" inside a paragraph
// must not flip state. "/capybaraa on", "capybaraa off", "/capybaraa:capybaraa on" -> state; null if none.
function parseCommand(text) {
  const m = /^\s*[/@$]?capybaraa(?::capybaraa)?\s+(on|off)\s*$/i.exec(text || '');
  return m ? m[1].toLowerCase() : null;
}
// Whole-message deactivation only: "stop capybaraa" / "normal mode".
function isDeactivation(text) {
  return /^\s*(stop\s+capybaraa|normal\s+mode)\s*$/i.test(text || '');
}
// Whole-message activation: "start capybaraa" / "capybaraa on".
function isActivation(text) {
  return /^\s*(start\s+capybaraa|capybaraa\s+on)\s*$/i.test(text || '');
}

// Emit hook context in the form Claude Code expects per event.
// SessionStart / UserPromptSubmit accept raw stdout; SubagentStart DROPS raw text
// and requires the hookSpecificOutput JSON wrapper or the context never arrives.
function writeHookOutput(event, context) {
  if (!context) return;
  if (event === 'SubagentStart') {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: event, additionalContext: context },
    }));
  } else {
    process.stdout.write(context);
  }
}

module.exports = { configDir, flagPath, getState, setState, parseCommand, isDeactivation, isActivation, writeHookOutput };
