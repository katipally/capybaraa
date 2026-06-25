#!/usr/bin/env node
// SubagentStart: carry the principles into spawned subagents so they stay on-brand.
'use strict';

const { getLevel, ponytailActive } = require('./config.js');
const { getInstructions } = require('../principles/build-instructions.js');

const level = getLevel();
if (level !== 'off') process.stdout.write(getInstructions(level, ponytailActive()));
process.exit(0);
