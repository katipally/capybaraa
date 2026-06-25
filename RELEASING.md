# Releasing

capybaraa ships through two channels. GitHub is the Claude Code plugin; npm is the
`npx capybaraa` CLI. One tag drives both.

```
 git tag vX.Y.Z  ──▶  push  ──▶  publish.yml
                                   ├─ verify tag == package.json version
                                   ├─ npm test
                                   ├─ npm publish --provenance   (npm)
                                   └─ gh release create           (GitHub Release)
 push to main    ──▶  marketplace pin follows ref:"main"         (plugin users)
```

## One-time setup (do once, ever)

npm publishing uses **OIDC trusted publishing** — no `NPM_TOKEN` secret to manage.

1. Claim the name on npm (first publish only). Either run `npm publish --access public`
   once from your machine, or create the package on the npm website.
2. On npm: **capybaraa → Settings → Trusted Publisher → Add GitHub Actions**,
   repo `katipally/capybaraa`, workflow `publish.yml`.

After this, every release is just a tag push — the Action mints a short-lived
token via OIDC at publish time. Needs npm ≥ 11.5.1 (Node 22 in the workflow).

## Cut a release

1. Bump the version in **all three** manifests (they must agree, the CI guard
   enforces tag == `package.json`):
   - `package.json`
   - `.claude-plugin/plugin.json`
   - `.claude-plugin/marketplace.json` (the nested `plugins[0].version`)
2. Add a dated `## [X.Y.Z]` section to `CHANGELOG.md`.
3. Commit and push to `main`. (Plugin users on the marketplace pin get it now,
   the pin follows `ref:"main"`.)
4. Tag and push:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
5. Watch the **Publish to npm** Action. Green = live on npm with a GitHub Release.

That's it. CI runs `npm test` on every push/PR (Node 18/20/22); the publish job
re-runs it before publishing, so a broken build never ships.

## Optional: official Claude Code marketplace

Listing in the community catalog adds discovery, not capability — direct repo
install already works. Validate, then submit:

```bash
claude plugin validate .
claude plugin validate . --strict
```

- Individual authors → <https://platform.claude.com/plugins/submit>
- Org owners → <https://claude.ai/admin-settings/directory/submissions/plugins/new>

Approved plugins are pinned to a commit SHA in `anthropics/claude-plugins-community`
and synced nightly. Allow ~1–2 days.
