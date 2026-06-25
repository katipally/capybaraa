# Multi-arm comparison, 2026-06-25 (Haiku 4.5, n=3)

Ponytail-style head-to-head: five arms through the full agentic suite (11 tasks, 3 runs each
= 165 cells), plus the CLARIFY and completeness judges. Run stamp `20260625-141951`.

Arms: **baseline** (the unaided agent), **capybaraa** (level high), **ponytail** (the
installed plugin, level full), **caveman** (ponytail's caveman skill, an output style), and
**yagni-oneliner** ("Follow YAGNI principles, and prefer one-liner solutions"). ponytail and
caveman are loaded from the installed `ponytail` plugin so the comparison is against what
those skills actually ship.

This is the honest writeup. Capybaraa does not win every axis, and the table says so.

## The one-paragraph result

There is a tradeoff, not a single winner. **yagni-oneliner and ponytail cut the most lines**,
but yagni-oneliner does it by **skipping clarification entirely** (clarify 0.0/3). Capybaraa
sits with ponytail in the "ask first" cluster (both 2.0/3), cuts moderately (near baseline,
leaner than caveman), is the **only arm that writes tests**, and stays 100% safe and complete,
at the **highest token cost**. Caveman is an output style: it barely changes the code. Pick by
what you value: fewest lines (yagni/ponytail) or clarify-and-verify (capybaraa).

## LEAN, over-build traps (median LOC, lower = leaner)

| task | baseline | capybaraa | ponytail | caveman | yagni-oneliner |
|---|---|---|---|---|---|
| feat-rating | 60 | 53 | **40** | 48 | **27** |
| feat-palette | 154 | 135 | **86** | 143 | **47** |
| feat-export | 22 | 23 | 23 | 24 | **16** |

LOC race, leanest to bulkiest: **yagni-oneliner < ponytail < capybaraa ≈ caveman ≈ baseline.**
Capybaraa is not the line-count champion. The surgical tasks (lean-reuse, lean-native) are 1
line for every arm, an irreducible answer, so they tie.

## CLARIFY (judge 0-3 median over the two ambiguous tickets, n=6 each)

| arm | clarify score | what it did |
|---|---|---|
| capybaraa | **2.0** | asked the spec questions before coding |
| ponytail | **2.0** | asked the spec questions before coding |
| baseline | 1.5 | asked sometimes, dove in sometimes |
| caveman | 1.0 | asked about repo/stack, not the actual spec |
| yagni-oneliner | **0.0** | assumed the spec and wrote code immediately |

This is the sharpest divider. The arm that cut the most lines (yagni-oneliner) is the worst at
clarifying: it silently assumed CSV + client-side + sample data and shipped. Capybaraa and
ponytail both ask. Fewer lines is not free if it means guessing the spec.

## The other gates

- **Completeness** (judge 0-3): every arm **3** on all three feature tasks. Nobody won LOC by
  shipping a stub, the comparison is fair.
- **Safety** (adversarial input executed): every arm **100%**. On these tasks no arm dropped a
  guard, even yagni-oneliner at 3 lines. (Ponytail's own writeup found yagni-oneliner dropping
  a path-traversal guard on a different task; it did not happen here.)
- **Tests written**: **only capybaraa** (33-67% of runs on the safety and feature tasks); every
  other arm 0%. This is capybaraa's COMPLETE pillar, and nobody else's.
- **Cost**: capybaraa is the most expensive (it asks, tests, and on Haiku at level high
  sometimes over-produces, one feat-rating run spawned a subagent and wrote ~1000 lines of
  test scaffolding). The prompt-only arms (caveman, yagni) are cheapest.

## Honest caveats

- **Capybaraa at level high is erratic on Haiku.** Two feature runs over-produced badly (a
  539-line palette, a subagent writing a server + five test files for a star rating). The
  median holds up after excluding subagent scratch and counting tests separately, but the
  variance and cost are real. On Sonnet ([that run](2026-06-25-agentic-sonnet.md)) capybaraa
  was clean and consistently leaner. High may be too aggressive for a small model; medium is
  worth testing.
- One model, n=3, a small suite. Treat the LOC numbers as directional. The CLARIFY and
  completeness scores are from an LLM judge (auditable, self-validated), still a model judging
  a model.

## Reproduce

```bash
cd benchmarks/agentic
python3 run.py --selftest
python3 run.py --all --arms baseline,capybaraa,ponytail,caveman,yagni-oneliner --models haiku --runs 3 --workers 6
python3 judge.py --run runs/<stamp> && python3 judge.py --complete-run runs/<stamp>
```

ponytail and caveman arms need the `ponytail` plugin installed (or `PONYTAIL_PLUGIN_DIR` set).
