---
name: capybaraa-help
description: Quick reference for capybaraa, what it does, the six pillars, and how to set the level. Use when the user types /capybaraa-help or asks how capybaraa works.
disable-model-invocation: true
license: MIT
---

# Capybaraa Help

Render this card, change nothing.

```
 capybaraa: calm senior-dev mode.
 the six pillars are ALWAYS ON; they apply to every task. no command needed.

 PILLARS  CLARIFY  explore first, then clarify before coding: curated
                   questions + ASCII on the options + edge cases
          LEAN     YAGNI · reuse · stdlib first
          OPTIMAL  right data structure · best feasible complexity
          ECONOMY  terse · no useless comments · minimal tokens
          COMPLETE root-cause fix · run the check before claiming done
          HYGIENE  replace not pile-on · kill dead code/stale comments ·
                   sanitize · flag security

 SLASH    /capybaraa [low|medium|high|off]   set intensity
          /capybaraa-review                  review the diff against the pillars
          /capybaraa-audit                   scan the whole repo against the pillars
          /capybaraa-help                    this card

 DETAIL   full per-pillar guidance: references/principles.md

 LEVELS   low = nudges · medium = default · high = aggressive
 OFF      "stop capybaraa"  or  /capybaraa off
 DEFAULT  CAPYBARAA_DEFAULT_LEVEL env (low|medium|high|off), or
          ~/.config/capybaraa/config.json {"defaultLevel":"high"}
```
