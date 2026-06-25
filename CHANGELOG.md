# Changelog

All notable changes to this project are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com).

## [0.2.1] - 2026-06-25

- Renamed to **capybaraa** across the board (plugin, slash commands `/capybaraa`,
  skills, flag file, statusline badge, npm package). Plain `capybara` was already
  taken on npm; the doubled `a` is the published name and now the consistent brand.
- First release published to npm and wired for tag-driven releases. See
  [RELEASING.md](RELEASING.md).

## [0.2.0] - 2026-06-24

- Capybaraa is now fully independent. Removed the ponytail detection and the
  LEAN-pillar dedupe; all six pillars ship every session regardless of what else
  is installed.
- CLARIFY now routes real work into Claude Code's plan mode instead of just hoping
  the model asks questions. The injected text and skills point at plan mode with
  curated ASCII questions.
- New `/capybaraa-review` skill: reviews the current diff against the six pillars
  and lists findings, one line each. Does not edit files.
- Added a reproducible benchmark harness under `benchmarks/` (tasks, correctness
  gate, LOC/cost/latency scoring) so impact can be measured, not asserted.
- Rewrote the principle text and docs in plain language. No em-dashes, no shipped
  tagline.

## [0.1.0] - 2026-06-24

Initial release.

- Six pillars injected proportionally: **clarify, lean, optimal, economy,
  complete, hygiene**.
- Levels `low` / `medium` / `high` / `off` (default `medium`), switched with
  `/capybaraa <level>` or "stop capybaraa".
- Skills: `/capybaraa` (level switch) and `/capybaraa-help`.
- SessionStart / UserPromptSubmit / SubagentStart hooks; statusline badge.
- Coexistence with ponytail (dropped the overlapping LEAN pillar when ponytail was
  active). Removed in 0.2.0.
- `npx capybaraa init|doctor|update|uninstall` wizard installing rules
  bridges into Claude Code, Cursor, Copilot, and OpenCode.
