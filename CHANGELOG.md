# Changelog

All notable changes to this project are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com).

## [0.1.0] — 2026-06-24

Initial release.

- Six pillars injected proportionally: **clarify, lean, optimal, economy,
  complete, hygiene**.
- Levels `low` / `medium` / `high` / `off` (default `medium`), switched with
  `/capybara <level>` or "stop capybara".
- Skills: `/capybara-plan`, `/capybara-review`, `/capybara-clean`,
  `/capybara-done`, `/capybara-help`, plus the level-switch skill.
- `capybara-planner` subagent for plan mode.
- SessionStart / UserPromptSubmit / SubagentStart hooks; statusline badge.
- Coexistence with ponytail (drops the overlapping LEAN pillar when ponytail is
  active).
- `npx @katipally/capybara init|doctor|update|uninstall` wizard installing rules
  bridges into Claude Code, Cursor, Copilot, and OpenCode.
