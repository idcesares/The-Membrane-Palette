# Releasing

The CDN is the only distribution channel (npm publishing isn't set up), and jsDelivr serves whatever a git ref points at. **A release is a git tag.** Everything below exists so that the tag points at a commit that is built, tested and documented.

## 1. Before tagging

- [ ] `npm ci && npm test` passes locally. It builds everything, validates the HTML, type-checks the generated types, then runs axe in both themes, link integrity, and keyboard, motion and touch behavior in Chromium, Firefox and WebKit. Visual baselines run in CI's Playwright container (`visual` job).
- [ ] `npm run build:system` leaves `git status` clean. CI checks this too, but it's faster to catch locally.
- [ ] CI is green on the commit you are about to tag.
- [ ] `CHANGELOG.md`: move everything under `[Unreleased]` into a new `## [x.y.z] — YYYY-MM-DD` section. Use the date you tag, not the date you started.
- [ ] A **breaking** change has a migration note, and the version bumps major. Breaking means a token or component class/attribute is renamed or removed (see `CLAUDE.md`). Deprecations ship in a minor release first.
- [ ] `package.json` `version` matches. The generated CSS headers, `manifest.json`, `tokens.resolved.json` and the social image read from it.
- [ ] Update the hand-written version strings: the version badge at the top of `README.md`, the header of `DESIGN-SYSTEM.md` ("Version 2.1 · October 2026") and the showcase footer.
- [ ] If the version or anything visual in the card changed: `npm run render:social`, look at `showcase/assets/idcesares-social-design-system-og.png`, and commit it.
- [ ] Look at the showcase once in a real Safari and a real Firefox. The suite runs their engines headless, which can't judge what a person sees. Things to check:
  - the accordion animates (or snaps cleanly);
  - the menu sits under its button;
  - the theme toggle crossfades;
  - fonts load with no visible jump;
  - print preview of `examples/article.html`.

## 2. Tag

```bash
git switch master && git pull
git tag -a v2.1.0 -m "v2.1.0"
git push origin v2.1.0
```

Optionally, create a GitHub release from the tag and paste the changelog section into it.

## 3. CDN

jsDelivr resolves tags as semver, so after the first tag these URLs work:

| URL | Serves | Use for |
|---|---|---|
| `…/gh/idcesares/The-Membrane-Palette@2/membrane.css` | latest `2.x.y` | **Recommended.** Fixes and additions arrive; breaking changes never do |
| `…/gh/idcesares/The-Membrane-Palette@2.1.0/membrane.css` | exactly that release | Apps that upgrade deliberately |
| `…/gh/idcesares/The-Membrane-Palette/membrane.css` | latest commit on the default branch | Trying things out only |

Append `.min.css` / `.min.js` to any file for jsDelivr's minified copy: `membrane.min.css`, `components/membrane.min.js`.

- [ ] **First release only:** switch the CDN URLs from unpinned to `@2` in these files:
  - `README.md` (Quick Start);
  - `DESIGN-SYSTEM.md` §6.1;
  - the install snippet in the `showcase/index.html` hero;
  - `llms.txt` and the `install` block of `components/manifest.json`, both generated: change the `CDN` constant in `scripts/build-components.mjs` and rebuild;
  - the comments in `examples/*.html`.

  Commit the change after the tag. The tagged files don't need to reference themselves.
- [ ] jsDelivr caches version ranges for up to 7 days. To make `@2` pick up the new tag right away, purge it:
  `curl https://purge.jsdelivr.net/gh/idcesares/The-Membrane-Palette@2/membrane.css` (repeat for each file you changed).

## 4. Site

```bash
npm run deploy   # builds, then wrangler pages deploy → Cloudflare Pages (needs `wrangler login` once)
```

- [ ] Check that the following work on the live site:
  - `/`;
  - `/examples/starter.html`;
  - a missing path, which should show the 404 page;
  - `/llms-full.txt`;
  - the social preview, using any link-preview debugger on the home URL.
- [ ] `curl -I https://membrane-palette.dcesares.dev/membrane.css` shows the `_headers` values: `nosniff` and `Access-Control-Allow-Origin`.

## 5. After

- [ ] Add an empty `## [Unreleased]` section back to the top of `CHANGELOG.md`.
- [ ] Move anything still open in `docs/AUDIT-2026-10.md` to issues, so the list doesn't go stale in a file.
