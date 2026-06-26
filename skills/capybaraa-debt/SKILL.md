---
name: capybaraa-debt
description: >
  Harvest the `capybaraa:` deferral ledger from the codebase: every intentional
  simplification marked with a capybaraa: comment, with its ceiling and upgrade trigger.
  One line per marker, the no-trigger ones flagged first as highest rot risk. Lists only,
  does not edit.
  Use when the user says "capybaraa debt", "/capybaraa-debt", "show the deferral ledger",
  "what did we simplify on purpose", or "what's deferred in this repo".
license: MIT
---

# Capybaraa Debt

Capybaraa marks deliberate simplifications with a `capybaraa:` comment naming the ceiling
and the upgrade trigger (HYGIENE pillar), e.g.
`# capybaraa: in-memory cache, swap to Redis if multi-process`. This skill collects those
markers into one ledger so a decision made "for now" doesn't quietly become permanent.
It is not a bug or bloat scan: for those use `/capybaraa-review` (diff) or
`/capybaraa-audit` (repo).

Detailed guidance on the marker convention: [`references/principles.md`](../../references/principles.md) (HYGIENE).

## How to run it

1. Find the markers. Skip vendored code, lockfiles, build output, and `.git`:

   `grep -rnE '(#|//|--|;) ?capybaraa:' . `

2. For every marker, emit ONE line:

   `path:line — <what was simplified>. ceiling: <the limit>. upgrade: <the trigger>.`

3. Rank by rot risk: markers with **no upgrade trigger** first (they are the ones that
   rot, nothing will ever flip them), then the rest.
4. Group nothing, pad nothing. End with a one-line count.

## Output shape

```
src/cache.js:12 — in-memory cache, no eviction. ceiling: single process. upgrade: none given.
src/auth.js:40 — global rate-limit lock. ceiling: one bucket for all accounts. upgrade: per-account if throughput matters.
api/upload.py:88 — 10MB hardcoded size cap. ceiling: 10MB. upgrade: make configurable when a user hits it.
3 markers, 1 with no trigger (cache.js:12 — name a trigger or it never gets revisited).
```

If there are none:

```
No capybaraa: debt. Clean ledger.
```

## Boundaries

Lists findings only, does not edit files. It reports what is deferred and how risky each
deferral is; it does not do the upgrades. If a marker's ceiling is already breached (the
condition that should trigger the upgrade is already true), say so on its line, that is
the one to act on now.
