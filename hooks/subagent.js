#!/usr/bin/env node
// SubagentStart: carry the principles into spawned subagents so they stay on-brand.
'use strict';

const { getState, writeHookOutput } = require('./config.js');
const { getInstructions } = require('../principles/build-instructions.js');

const state = getState();
if (state !== 'off') writeHookOutput('SubagentStart', getInstructions(state));
process.exit(0);
