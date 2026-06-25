// Level state + command parsing. Flag file is the source of truth for "current level".
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const { VALID_LEVELS, DEFAULT_LEVEL } = require('../principles/build-instructions.js');

function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
}
function flagPath() {
  return path.join(configDir(), '.capybara-active');
}
function ponytailActive() {
  return fs.existsSync(path.join(configDir(), '.ponytail-active'));
}

function getLevel() {
  try {
    const v = fs.readFileSync(flagPath(), 'utf8').trim().toLowerCase();
    if (VALID_LEVELS.includes(v)) return v;
  } catch {}
  const env = (process.env.CAPYBARA_DEFAULT_LEVEL || '').trim().toLowerCase();
  if (VALID_LEVELS.includes(env)) return env;
  try {
    const cfg = path.join(os.homedir(), '.config', 'capybara', 'config.json');
    const v = JSON.parse(fs.readFileSync(cfg, 'utf8')).defaultLevel;
    if (VALID_LEVELS.includes(v)) return v;
  } catch {}
  return DEFAULT_LEVEL;
}

function setLevel(level) {
  try {
    fs.mkdirSync(configDir(), { recursive: true });
    fs.writeFileSync(flagPath(), `${level}\n`);
  } catch {}
}

// "/capybara high", "capybara low", "/capybara off" -> level; null if no match.
function parseCommand(text) {
  const m = /(?:^|\s)\/?capybara\s+(off|low|medium|high)\b/i.exec(text || '');
  return m ? m[1].toLowerCase() : null;
}
// "stop capybara" / "normal mode" -> deactivate.
function isDeactivation(text) {
  return /\b(stop\s+capybara|normal\s+mode)\b/i.test(text || '');
}

module.exports = { configDir, flagPath, ponytailActive, getLevel, setLevel, parseCommand, isDeactivation };
