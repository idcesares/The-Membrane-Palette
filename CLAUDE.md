# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build:tokens      # Regenerate tokens/design-tokens.css, base.css, membrane-tailwind.css, tokens.resolved.json, fonts/fonts.css and the spec/showcase token tables; runs the WCAG contrast gate (every `GATE` pair × light/dark) and aborts on failure
npm run build:components  # Lint components + README examples + pattern pages, then write components/membrane-components.css, membrane.css, components/manifest.json, components/membrane.d.ts, llms.txt, the README API sections and the showcase gallery
npm run build:system      # Both of the above, in order — run this after any source change
npm run build             # Cloudflare Pages build: build:system, then assembles dist/ (adds llms-full.txt)
npm test                  # Build, html-validate dist/, type-check membrane.d.ts, serve dist/, run Playwright in Chromium/Firefox/WebKit: axe-core on every page in both themes, phone-width overflow, link integrity + self-containment, keyboard/focus/ARIA, motion (full/reduced/touch)
npm run test:visual       # Pixel baselines of every gallery example, light + dark. Canonical only inside mcr.microsoft.com/playwright:v1.56.1-noble (CI's `visual` job). After an INTENDED visual change, commit the baselines CI uploads as the `visual-baselines` artifact, or record them in that image (command in tests/visual.spec.mjs)
npm run render:social     # Re-render the og:image and apple-touch icon in showcase/assets/ (manual; commit the PNGs)
npm run render:figures    # Re-render the report figures (docs/figures/src/*.html → PNG, light + dark) after a visual change (manual; commit the PNGs)
npm run dev               # Build, then start local dev server at localhost:3456
npm run preview           # Alias of dev
npm run deploy            # Build, then `wrangler pages deploy` — uploads dist/ to the Cloudflare Pages project in wrangler.toml (releases: docs/RELEASING.md)
```

Three layers of checks, all in CI (`.github/workflows/ci.yml`): the contrast gate (`build:tokens`), the component/docs/coverage lint (`build:components`), and the browser suite (`npm test`, `tests/*.spec.mjs`). CI also fails if any committed generated file differs from a fresh build. Run `npm test` after changing component CSS, `membrane.js`, the showcase or an example page. `dist/` is gitignored and fully generated — never commit it or hand-edit it.

## Architecture

A **token-based design system with a framework-free CSS component library**:

- `tokens/membrane.tokens.json` — **Source of truth for values.** DTCG-flavored JSON (custom `$type`s: `tint` = alpha wash, `mix` = oklab mix of two tokens, `cssValue`). Edit this; never hand-edit generated CSS.
- `components/<name>/<name>.css` — **Component source.** Plain CSS; the bundler wraps it in `@layer components`.
- `components/<name>/README.md` — **Component docs.** Frontmatter (`name`, `category`, `status`, `summary`), `## Examples` with `### Title` + ```` ```html ```` blocks (rendered in the showcase and copied into the manifest), and a generated `## API` section between `<!-- GENERATED:API -->` markers.
- `components/membrane.js` — hand-written behaviors: tabs, menu and combobox keyboard patterns, toast API, tooltip Escape, dialog invoker fallback.
- `fonts/fonts.json` — **source for the self-hosted fonts** (files, unicode ranges, measured fallback overrides). `build:tokens` writes `fonts/fonts.css`; `build:components` inlines it at the top of `membrane.css` with `fonts/` URLs. Pages need no Google Fonts link; a test fails on any third-party request. After replacing a font file, rerun `scripts/measure-fonts.py` (needs Python fontTools).
- `brand/` — outlined brand-mark SVGs from `scripts/render-brand-marks.py` (needs fontTools + uharfbuzz and the full Fraunces variable font). Never hand-edit the paths.
- `scripts/build-tokens.mjs` / `scripts/build-components.mjs` — the two builds (see Commands).
- **Generated, committed, never hand-edited:** `fonts/fonts.css`, `components/membrane.d.ts` (TypeScript types from the manifest), `tests/visual.spec.mjs-snapshots/` (recorded only in the Playwright container, never edited), `tokens/design-tokens.css`, `tokens/base.css` (includes `:where()`-level page defaults for `body`), `tokens/membrane-tailwind.css` (Tailwind v4 theme), `tokens/tokens.resolved.json`, `components/membrane-components.css`, `components/manifest.json`, `membrane.css`, `llms.txt`, and the `GENERATED:*` marker regions in `showcase/index.html`, `DESIGN-SYSTEM.md` and each component README.
- `showcase/index.html` — static reference site; its gallery, token table and contrast matrix are generated.
- `DESIGN-SYSTEM.md` — authoritative specification (§6 = component conventions).
- `examples/*.html` — complete pages (starter, article, dashboard) built only from the library; linted by `build:components` exactly like README examples.

Distribution: consumers link `membrane.css` (or the split files) from jsDelivr. npm publishing is not set up; the CDN link in `README.md` is the only supported channel.

**Changing a token value:** edit the JSON, run `npm run build:system`. A new color pairing that UI depends on also gets a `GATE` entry in `scripts/build-tokens.mjs`.

**Changing or adding a component:** edit/create `components/<name>/<name>.css` + `README.md`, add new names to `ORDER` in `scripts/build-components.mjs`, run `npm run build:system`, then `npm test` (a new or changed example also needs new visual baselines: review the diff, then commit CI's `visual-baselines` artifact). The component lint rejects: raw colors (hex/rgb/oklch/white/black), unknown or deprecated tokens, Tier 1 primitives (`--color-terracotta`, `--color-neutral-*`, alpha tints), and custom properties not named `--mp-*`. The docs lint rejects README examples that use classes, `data-*` attributes or values the CSS doesn't implement, duplicate ids across all examples, icon-only buttons without `aria-label`, and `<img>` without `alt`. The coverage lint requires every class and every `data-*` value the CSS implements to appear in at least one README example (so the showcase renders it); a README can opt an attribute or class out with a frontmatter line such as `exempt: data-gap, .mp-skip-link`, which should be reserved for token scales and runtime-only state.

**Behavior hooks:** `data-mp-*` attributes (e.g. `data-mp-toast`, `data-mp-value` on a combobox option) are read by `membrane.js` and are valid on any element. `window.MembranePalette.toast()` is the only JS API; it renders text with `textContent`, never HTML.

**Charts:** series colors are `--color-chart-1…6`, a palette validated for color-blind separation; assign in order, never cycle, max 2 series in scatter-type charts.

**Component conventions:** root class `mp-<name>`, parts `mp-<name>__<part>`, options as `data-*` attributes (`data-variant`, `data-size`, `data-tone`…; omit for default), **states from native attributes/ARIA only** (`disabled`, `aria-invalid`, `aria-current`, `aria-selected`, `aria-pressed`, `aria-busy`, `[open]`) — never state classes. Tier 3 knobs are `--mp-<name>-*`, declared on the component root and defaulting to semantic tokens.

**Breaking changes:** a token or component class/attribute rename or removal is breaking regardless of channel — deprecate first (`"$deprecated"` in the JSON), bump major on removal, and add a migration note to `CHANGELOG.md`.

## Design System Core Concepts

**The Membrane Palette** — the central metaphor organizing all design decisions:

| Register | Role | Colors |
|---|---|---|
| Human | Warm, pedagogical, tactile | Terracotta `#B35530`, Amber, Burgundy |
| The Membrane | Translation zone (canvas) | Warm Cream `#FAF6EE`, Warm Gray |
| Digital | Precision, depth, code | Deep Teal `#1B756D`, Charcoal `#1A1B1F` (Steel Blue exists only as chart color `--color-chart-5`) |

**Typography:** self-hosted (`fonts/`), each with a metric-matched `"<Family> Fallback"` face in the font stack.
- `Fraunces` (variable serif) = human/heading register
- `Instrument Sans` = digital/body register
- `JetBrains Mono` = builder/code register

**Spacing:** 4px base unit (`--space-1` = 0.25rem, scale to `--space-32`)

**Shadows:** Warm-tinted in light mode via `light-dark()`, never pure black

**Dark mode:** `light-dark()` on every semantic token, driven by `color-scheme: light dark` on `:root`. Manual override via `[data-theme="dark"|"light"]` attribute (works on any subtree — pair with `.mp-surface`) (the legacy `.theme-dark` class still works but is deprecated: never generate it). Primitives (`--color-terracotta`, etc.) are immutable — never redefine them inside a theme override; only semantic tokens (`--color-action-primary`, `--color-focus`, etc.) theme.

**Controls:** `--size-control-sm/md/lg` = 36/44/52px; `--size-touch-target` = 44px. Compact controls grow to 44px on coarse pointers.

**Motion (spec §8):** Overlays use `--transition-exit` on the closed state and `--transition-enter` on the open state (`--transition-state` for in-place toggles); animate only opacity, transforms, colors and box-shadow, never layout properties (the accordion's `block-size`, behind `interpolate-size`, is the one exception). Hover-only effects go inside `@media (hover: hover)`. Under `prefers-reduced-motion` the `--duration-*`/`--transition-*` tokens become `0ms` (`--duration-slower` keeps `150ms`); `--duration-loop` is kept so loaders pulse in place instead of freezing — any new loader needs a reduced-motion pulse, and any movement (lift, nudge, slide) needs removing under reduced motion.

## Asset Naming Convention

`idcesares-{type}-{descriptor}-{variant}.{ext}`

Examples: `idcesares-logo-wordmark-primary.svg`, `idcesares-photo-speaking-header.jpg`
