# Asks before it guesses

**Task:** "Add user settings persistence to this web app."

Seeded with a near-empty page (`index.html` with `<main id="app">Welcome</main>`, an empty
`app.js`). The ticket is real and the spec is missing: which settings, stored where, per-device
or synced. Model `claude-sonnet-4-6`, temperature default, no plan mode. Reproduce:
`run.py --task clarify-settings --arms baseline,capybaraa --models sonnet`.

## Without capybaraa, ~308 lines

The bare agent invented a spec and built the whole thing:

> Done. Here's what was added:
>
> **Settings panel** (slide-in from the right) with four settings:
> - Dark mode toggle (applies immediately on toggle)
> - Font size stepper (12-24px, applies live as you click)
> - Notifications toggle
> - Language select
>
> **Persistence** via `localStorage` under the key `app_settings`. Settings load on page
> startup and are applied before first render to avoid a flash. [...]

353 lines written across `index.html` and `app.js`, for a feature nobody specified. Dark mode,
font size, notifications, language: all guessed. If the real ask was "remember the user's theme
on the account," most of that is wrong and gets thrown away.

## With capybaraa, 0 lines and one question

> The app is a blank slate, so "user settings" is entirely undefined. I need one answer before
> writing a line:
>
> **What settings should be persisted, and what's the UI?**
>
> Here are the realistic options so the tradeoff is concrete:
>
> ```
> A) Theme toggle (light / dark)
>    [Light] [Dark]  ← two buttons, saves to localStorage
>    Simple, self-contained, zero dependencies.
>
> B) A settings panel with multiple prefs
>    ┌─────────────────────────┐
>    │ ⚙ Settings              │
>    │  Theme:    [Light▼]     │
>    │  Font size: [Medium▼]   │
>    │  Language: [EN▼]        │
>    └─────────────────────────│
>    More UI work; you define which prefs to include.
>
> C) Generic key/value store — no UI, just the persistence layer
>    settings.get('key') / settings.set('key', val)
>    You wire up UI yourself later.
> ```
>
> Which of these (or something else) did you have in mind? Also: localStorage is fine for this,
> or do you need server-side persistence (requires a backend)?

Zero premature lines, an ASCII sketch of the real options, and the two questions (which prefs,
where to persist) that actually decide the design. The CLARIFY judge scored this 3/3.

**308 lines of a guessed feature, or one question, same model, same prompt.** And it cost less:
$0.17 to ask versus $0.26 to build the wrong thing.
