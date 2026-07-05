# Changelog

All notable changes to The Membrane Palette follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.
Versioning follows semantic conventions: breaking token renames or removals increment the major version.

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
- New state-layer tokens: `--state-hover-opacity`, `--state-pressed-opacity`, `--state-disabled-opacity`.
- New blur token: `--blur-backdrop` (previously 12px in spec, 18px in showcase — now unified at 12px).
- New glow token: `--shadow-glow-teal` dark-mode variant (previously unmapped).
- New photo token: `--photo-dim-dark` (the `brightness(0.92)` factor from spec §12.2 rule 6).
- New accent color tints: `--color-amber-10`, `--color-burgundy-10`, `--color-sage-10`.
- Showcase: status semantics specimen (success/warning/error text + fill tokens side by side).

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

**Primitive mutation removed.** `[data-theme="dark"]` no longer redefines `--color-terracotta` or other primitives. Primitives are invariant; dark-mode behavior is entirely in semantic tokens.

**README CDN link fixed.** The Quick Start `<link>` example now uses jsDelivr instead of `raw.githubusercontent.com` (which serves `text/plain` and is rejected by browsers).

### Changed (non-breaking)

- `package.json` name changed from `idcesares-design-system` to `@idcesares/design-system`.
- Type-scale description updated in spec: the scale is a variable ratio (≈1.20 at small steps, ≈1.375 at display), not a fixed Major Third.

### Deprecated

- `DESIGN.md` — the YAML file was a hand-synced mirror of the tokens. It is preserved for one release but will be removed in v3.0. The canonical machine-readable source is now `tokens/membrane.tokens.json`.

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
