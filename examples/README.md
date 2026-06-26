# Examples

Real model output, verbatim from the benchmark runs. Same model (`claude-sonnet-4-6`), same
prompt, same seeded files. The only thing that changes is whether capybaraa is on.

These are not hand-written. Reproduce any of them with the harness:
`benchmarks/agentic/run.py --task <id> --arms baseline,capybaraa --models sonnet`.

| Example | Pillar | What it shows |
|---|---|---|
| [Asks before it guesses](asks-before-it-guesses.md) | CLARIFY | A vague ticket: the bare agent invents a spec and writes ~300 lines; capybaraa asks the three questions that decide the design, with an ASCII sketch, before writing a line. |
| [Leaner, still complete](leaner-still-complete.md) | LEAN / ECONOMY | A clear build: capybaraa ships a smaller, fully working widget than the bare agent. Honest note: ponytail goes leaner still; capybaraa is not the fewest-lines tool. |

Honest framing: capybaraa is not a "fewest lines" contest winner. On clear, reducible builds a
pure-minimal tool like ponytail writes fewer lines. capybaraa's edge is spending tokens where
they buy correctness, asking before it builds the wrong thing, finishing the job, leaving the
repo clean. The first example is where that shows most. Full numbers and the four-arm
comparison live in [../benchmarks/results/2026-06-26-sonnet-4arm.md](../benchmarks/results/2026-06-26-sonnet-4arm.md).
