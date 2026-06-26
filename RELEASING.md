# Releasing

capybaraa is a Claude Code plugin, distributed straight from this GitHub repo:
no npm, no registry. Users install it with `/plugin marketplace add
katipally/capybaraa`, and the marketplace pin follows `ref:"main"` in
`.claude-plugin/marketplace.json`. So **a release is just a push to `main`.**

```
 write CHANGELOG  ──▶  npm run release -- X.Y.Z  ──▶  bump + test + commit + push main
                                                  └─▶  tag vX.Y.Z + push + GitHub Release
```

## Cut a release

1. Write a dated `## [X.Y.Z]` section in `CHANGELOG.md`. The script uses it as the
   GitHub Release notes and refuses to release without it.
2. Run the release script with the version. The `--` is required so npm forwards it:
   ```bash
   npm run release -- X.Y.Z
   ```

That one command does everything: bumps the version in all three files
(`.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` nested
`plugins[0].version`, `package.json`), runs `npm test` and a best-effort
`claude plugin validate`, then commits, tags `vX.Y.Z`, pushes `main` **and** the tag, and
creates the GitHub Release from the changelog section. So a tag can never land without its
Release again (the gap that left 0.3.0 and 0.3.1 tagged but unreleased).

Preview without touching anything:

```bash
npm run release -- X.Y.Z --dry-run
```

Preflight refuses to run off `main`, on an existing tag, or without a changelog section.
Needs `gh` authed for the Release step. CI (`.github/workflows/ci.yml`) re-runs `npm test`
on Node 18/20/22 for every push, so a broken plugin never lands on `main`.

Marketplace users get the new version on their next pull regardless of the Release (the
pin follows `ref:"main"`); the Release is the visible changelog entry.

## Optional: official Claude Code marketplace

Listing in the community catalog adds discovery, not capability: direct repo
install already works. Validate, then submit:

```bash
claude plugin validate .
claude plugin validate . --strict
```

- Individual authors → <https://platform.claude.com/plugins/submit>
- Org owners → <https://claude.ai/admin-settings/directory/submissions/plugins/new>

Approved plugins are pinned to a commit SHA in `anthropics/claude-plugins-community`
and synced nightly. Allow 1 to 2 days.
