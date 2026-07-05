# Changelog

All notable changes to The Membrane Palette follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.
Versioning follows semantic conventions: breaking token renames or removals increment the major version.

---

## [Unreleased]

- `package.json` name changed from `@idcesares/design-system` (a scope/name that was never published and didn't match the repository) to `@idcesares/the-membrane-palette`. `package-lock.json` regenerated to match.
- Removed npm as a documented delivery path for now — `README.md`, `CLAUDE.md`, and `AGENTS.md` no longer describe an `npm install` / `npm publish` flow for the tokens. The jsDelivr CDN link is the only supported integration path until npm distribution is set up.
- Fixed the jsDelivr CDN URL in `README.md`: dropped the `@2` version pin (no matching release tag exists) — `https://cdn.jsdelivr.net/gh/idcesares/The-Membrane-Palette/tokens/design-tokens.css`.

---

## [2.0.0] — 2026-07-05

### Architecture overhaul

**Single source of truth.** All token values now live exclusively in `tokens/membrane.tokens.json` (DTCG-flavored JSON). `tokens/design-tokens.css` and `tokens/base.css` are **generated files** — the build (`npm run build:tokens`) writes them. Never edit the CSS directly.

**Three-tier token architecture.**
- Tier 1 primitives (`--color-terracotta`, `--color-neutral-*`, etc.) are now immutable; they never change between light and dark mode.
- Tier 2 semantic tokens (`--color-action-primary`, `--color-text-tertiary`, etc.) carry their own `light-dark()` pairs and are what applications should consume.
- Tier 3 component recipes are documented in `DESIGN-SYSTEM.md §6`; not emitted as tokens.

**CSS modernization.**
- All colors emitted as **OKLCH** (round-trip-verified against sRGB source values). Hex values appear as inline comments for reference.
- Dark mode collapsed from ~70 lines of duplicated overrides to `light-dark()` on each semantic token. Manual toggle is now `[data-theme="dark"] { color-scheme: dark }` — three lines instead of a copied block.
- `:root { color-scheme: light dark }` declaration added — native controls, scrollbars, and `::selection` now respect the active mode.
- `@layer tokens` wraps all custom properties; `@layer base` wraps element rules in `base.css`. Any unlayered consumer CSS wins automatically.
- `prefers-contrast: more` and `forced-colors: active` media queries added.
- Side-effect rules (reduced motion, `::selection`, focus ring, typography composites) moved from `design-tokens.css` to the optional `tokens/base.css`.

**Derived tints.** The seven alpha-wash tokens (`--color-terracotta-10/20`, `--color-teal-08/10/12/20`, etc.) are now computed via `color-mix()` from the palette — mode-aware, no hand-tuned rgba literals.

**Automated contrast gate.** The build verifies 40 foreground/background pairs (both modes) against their WCAG minima before writing output. A failing pair aborts the build.

### Added

- `tokens/membrane.tokens.json` — DTCG-flavored source of truth.
- `tokens/base.css` — optional layer (reduced motion, selection, focus, typography composites).
- `scripts/build-tokens.mjs` — token compiler with OKLCH round-trip verification and contrast gate.
- `npm run build:tokens` script.
- `package.json` `exports` map and `files` list for npm distribution.
- New semantic tokens: `--color-action-primary`, `--color-action-secondary`, `--color-focus`, `--color-success-text`, `--color-warning-text`, `--color-error-text`, `--color-selection`.
- New size tokens: `--size-icon-sm/md/lg/xl`, `--size-touch-target`, `--size-nav`, `--size-nav-mobile`.
- New border-width tokens: `--border-width-thin/medium/thick` (previously literal px values in specs).
- New semantic elevation aliases: `--elevation-raised`, `--elevation-overlay`, `--elevation-modal`.
- New state token: `--state-disabled-opacity`, wired to a real disabled-button demo in the showcase (hover/active feedback in this system stays brightness()-filter-based per §6.1, so no separate hover/pressed opacity tokens were introduced).
- New blur token: `--blur-backdrop` (previously 12px in spec, 18px in showcase — now unified at 12px).
- New glow token: `--shadow-glow-teal` dark-mode variant (previously unmapped).
- New photo token: `--photo-dim-dark` (the `brightness(0.92)` factor from spec §12.2 rule 6).
- New accent color tints: `--color-amber-10`, `--color-burgundy-10`, `--color-sage-10`.
- Showcase: status semantics specimen (success/warning/error text + fill tokens side by side).
- `.github/workflows/ci.yml` — runs `npm run build:tokens` (OKLCH round-trip + 40-pair contrast gate) and `npm run build` on every push/PR, and fails if the committed generated CSS doesn't match a fresh build. Full pixel-diff visual regression was considered and intentionally scoped out: this project has no existing test framework, and screenshot-baseline maintenance is disproportionate for a token/CSS-only system without a component tree to snapshot.
- Token lifecycle & deprecation policy (`DESIGN-SYSTEM.md` §15) with a real mechanism behind it: mark a token `"$deprecated": "<reason>"` in `tokens/membrane.tokens.json` and the build emits an inline `/* @deprecated */` comment above its CSS declaration plus a console summary on every `npm run build:tokens` run (surfaced in CI logs too).
- Showcase "05 / Reference" section: a Do/Don't specimen (six concrete good/bad comparisons — semantic vs. primitive tokens, contrast-safe vs. unsafe status text, tokenized vs. literal touch targets); a full, searchable, generated token table (186 rows, vanilla-JS filter, live `var()` color swatches); and a generated contrast matrix (all 40 gated pairs with pass/fail badges). The table and matrix are rendered by `scripts/build-tokens.mjs` from the exact same registry and gate computation used to build the CSS — there is no hand-maintained copy to fall out of sync.

### Fixed

**Contrast failures (were silent bugs, now gate-checked on every build):**
- `--color-text-tertiary` was `#A39D93` (2.5:1 on cream) — now `#6E685F` light / `#938D83` dark (5.1:1 / 5.2:1).
- `--color-warning` amber (`#D49A3A`) was used as text color on cream (2.3:1) — introduce `--color-warning-text` (`#8A6420`, 5.0:1) for text; raw `--color-warning` is fills/badges only.
- `--color-success` sage was 3.7:1 on cream for normal text — introduce `--color-success-text` (`#3E6B52`, 5.7:1).
- `--color-error-text` added (`#B23A3A`, 5.5:1) — distinct from `--color-error` fill.
- Dark mode focus ring `--color-focus` now maps to `teal-light` (was raw `teal`, which is 3.1:1 on charcoal).
- Dark mode `--color-text-on-accent` on the lightened terracotta button was 3.3:1 — now maps to charcoal in dark mode (8.3:1).

**Spec ↔ showcase drift:**
- Nav height harmonized: `--size-nav` = 64px (spec was 64, showcase was 68).
- Backdrop blur harmonized: `--blur-backdrop` = 12px (spec was 12, showcase was 18).
- Shell margin now uses `--site-margin` instead of a hard-coded `calc(100% - 3rem)`.
- Button hover state uses `--color-bg-primary` instead of the literal inverse (secondary button dark-mode fix).
- `border-left` on featured cards uses `--border-width-thick` (3px) via token.
- All interactive references to `--color-terracotta` / `--color-teal` inside the showcase replaced with `--color-action-primary` / `--color-action-secondary`.
- `--gradient-membrane` endpoints now lighten in dark mode (spec §12.2 rule 3 was documented but not implemented).
- `--shadow-*` tokens now carry their own dark-mode values via `light-dark()` (were not overridden in dark mode).
- `--gradient-warmth` stop-color is now mode-aware via `light-dark()`.
- `DESIGN-SYSTEM.md` §6 component recipes (buttons, cards, nav, inputs, tags, blockquotes, code blocks) referenced Tier 1 primitives directly instead of the new Tier 2 semantic tokens — the exact defect the semantic tier exists to prevent. Rewritten to use `--color-action-primary/secondary`, `--color-focus`, `--elevation-*`, and `--border-width-*` throughout.
- `DESIGN-SYSTEM.md` §12.1's dark-mode mapping table and §5.3/§13.2 token tables still showed pre-fix literal values (old tertiary-text hex, old `--border-accent`/`--focus-ring` values) after the token layer had already moved on.
- §12.2 rule 2 described a "cards get a border instead of a shadow" dark-mode behavior that was never implemented and was redundant with the always-on card border in §6.2 — corrected to describe what's actually true.
- The showcase reimplemented `.type-display`/`.type-heading`/`.type-body`/`.type-code` locally instead of consuming the real `.type-display`/`.type-h2`/`.type-body`/`.type-code` composite classes shipped in `tokens/base.css` — removed the duplicate, wired the showcase to the real classes.
- The showcase's card/toggle/swatch shadows referenced raw `--shadow-sm`/`--shadow-md` directly instead of the semantic `--elevation-raised`/`--elevation-overlay` aliases introduced alongside them; wired where the component is genuinely card/overlay-shaped (large decorative panels and the code-block panel intentionally kept raw `--shadow-lg`, since "modal" doesn't describe them).
- `CLAUDE.md` and `AGENTS.md` (identical content) claimed "no build step" and named `design-tokens.css` as the single source of truth — both false as of this release. Updated to describe the actual build commands and the JSON-source/generated-CSS split; also fixed a transposed terracotta hex (`#BF5B33` → `#B35530`) that predated this release.

**Primitive mutation removed.** `[data-theme="dark"]` no longer redefines `--color-terracotta` or other primitives. Primitives are invariant; dark-mode behavior is entirely in semantic tokens.

**README CDN link fixed.** The Quick Start `<link>` example now uses jsDelivr instead of `raw.githubusercontent.com` (which serves `text/plain` and is rejected by browsers).

**Repository URL mismatch fixed.** `package.json`'s `repository.url`, the README's jsDelivr CDN link, git clone command, and file-structure diagram all pointed to `github.com/idcesares/idcesares-design-system` — a repository that does not exist. The actual remote is `github.com/idcesares/The-Membrane-Palette`; every reference now matches it. Caught by running `npm publish --dry-run` while verifying publish-readiness for this release.

### Changed (non-breaking)

- `package.json` name changed from `idcesares-design-system` to `@idcesares/design-system`.
- Type-scale description updated in spec: the scale is a variable ratio (≈1.20 at small steps, ≈1.375 at display), not a fixed Major Third.
- `README.md` restructured for two audiences: added a "For AI Agents" section (pointers to `CLAUDE.md`/`AGENTS.md`, `DESIGN-SYSTEM.md` §0/§11.4, `BRAND-VOICE.md`), a "Deployment & Publishing" section documenting the previously-undocumented Cloudflare Pages (`npm run deploy`) and `npm publish` paths, a "Contributing" section, and an anchor-linked nav row under the title.
- `CLAUDE.md` / `AGENTS.md` Commands section now lists `npm run preview` and `npm run deploy` (previously omitted) and documents the `files`/`exports` publish surface in `package.json`.
- `CHANGELOG.md` gained a standing `[Unreleased]` section per Keep a Changelog convention, so PRs have a documented place to add entries.

### Removed

- `DESIGN.md` — the hand-synced YAML mirror of the tokens. Since v2.0 had not shipped yet, it was removed outright rather than carried forward as a deprecated stub. The canonical machine-readable source is now `tokens/membrane.tokens.json`.
- References to `isaac-dcesares-brand-essence-ultimate.md` in `DESIGN-SYSTEM.md` and `BRAND-VOICE.md` — this file does not exist anywhere in the repository. Rather than guess at its location or leave an unverifiable pointer, the references were removed.
- `--state-hover-opacity` and `--state-pressed-opacity` — declared but never consumed anywhere; this system's hover/active feedback is brightness()-filter-based (§6.1), not opacity-overlay-based, so the tokens described an interaction model the system doesn't actually use. Only `--state-disabled-opacity` (which is wired to a real component) remains.

### Migration guide

**For consumers reading the CSS directly:** all tokens continue to work with the same `--` names. The only behavioral change is that `--color-text-tertiary`, `--shadow-*`, `--gradient-membrane`, and `--color-text-on-accent` now respond to dark mode automatically without a separate override block. If you had your own `[data-theme="dark"]` block that reassigned these, review for conflicts.

**For consumers using status colors as text:** replace `color: var(--color-warning)` / `color: var(--color-success)` with `--color-warning-text` / `--color-success-text` on normal-size body text.

**For anyone importing `design-tokens.css` and relying on the `* { transition-property: … !important }` reduced-motion rule:** that rule has moved to `tokens/base.css`. Import `base.css` to keep that behavior, or write your own.

---

## [1.1.0] — March 2026

- Added opacity scale tokens (`--opacity-subtle` through `--opacity-heavy`).
- Added ambient glow stop-colors (`--bg-glow-*`).
- Added overlay token (`--color-overlay-bg`).
- Fixed terracotta dark-mode contrast: `[data-theme="dark"]` now maps `--color-terracotta` to `--color-terracotta-light`.
- Improved dark mode: added `--shadow-glow-warm` dark variant.
- Added Cloudflare Pages deploy configuration.
- Added SEO meta tags and structured data to showcase.

## [1.0.0] — January 2026

Initial release. Token categories: color (palette, neutral, semantic, gradients, code), typography (font stacks, fluid scale, line-height, tracking, weight), spacing (4px base), layout (containers, site margin), border (radius, composites), shadow (warm-tinted), motion (durations, easing, transitions), z-index, focus, imagery.
