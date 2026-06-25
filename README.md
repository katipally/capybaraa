# 🦫 capybara

Calm senior-dev mode for AI coding agents. Funny name, professional work.

Coding agents over-build, skip questions, ignore edge cases, bloat output, claim
"done" without checking, and leave messes behind. Capybara injects six principles
that fix that — applied **proportionally**, so trivial asks stay light and only
real work earns the extra rigor.

## The 6 pillars

| Pillar | What it enforces |
|--------|------------------|
| **CLARIFY** | Before non-trivial code: ASCII diagram, 3–4 grouped questions, explicit edge cases. Don't guess the spec. |
| **LEAN** | YAGNI ladder — does it need to exist? reuse what's here? stdlib? native? one line? *then* minimal code. |
| **OPTIMAL** | Right data structure, best feasible time/space, no needless O(n²). |
| **ECONOMY** | Terse output, no useless comments or filler, minimal tokens, don't over-explore. |
| **COMPLETE** | Finish terminally, root cause not symptom, and **run the check** before claiming done. |
| **HYGIENE** | Refactor = replace not pile-on; delete dead code & stale comments; sanitize; flag security — out-of-scope finds get surfaced, not silently fixed. |

## Install

**Claude Code (native plugin — recommended):**
```
/plugin marketplace add capybara https://github.com/yashwanth/capybara
/plugin install capybara@capybara
```

**Cursor / Copilot / OpenCode (one-shot wizard, run in your project):**
```
npx capybara init       # detects your tools, writes the rules files
npx capybara doctor     # show what's installed where
npx capybara update     # refresh to the latest text
```

## Levels

`/capybara low | medium | high | off`  ·  `medium` is default  ·  `stop capybara` = off

- **low** — nudges only; build it, name the leaner option in one line.
- **medium** — all pillars, proportional; ASCII planning when warranted.
- **high** — aggressive; max questioning, deletion-first, strict done-gate.

The level shows in your statusline as `[CAPYBARA]` / `[CAPYBARA:HIGH]` (optional —
`activate.js` prints the one-line settings snippet to enable it).

## Skills

`/capybara-plan` · `/capybara-review` · `/capybara-clean` · `/capybara-done` · `/capybara-help`

## How it works

One source of truth — `principles/build-instructions.js` — injected every session
via the `SessionStart` hook and into every subagent via `SubagentStart`. Level
lives in a flag file (`~/.claude/.capybara-active`). The bridges (`installer/
bridges.js`) write that same text into each other tool's conventional rules file.

No separate output-style: the hook injection is the always-on path (proven by
ponytail), so a second static copy would just duplicate the text. <!-- dogfooding ECONOMY -->

**Coexists with [ponytail](https://github.com/DietrichGebert/ponytail):** if
ponytail is active, capybara drops its overlapping LEAN pillar so you don't pay
for the same guidance twice.

## Develop

```
node test/smoke.js                 # core checks
claude --plugin-dir ./capybara     # load locally in Claude Code
```

MIT.
