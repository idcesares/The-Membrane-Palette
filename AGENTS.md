# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run build:tokens   # Regenerate tokens/design-tokens.css + tokens/base.css from source; runs a 40-pair WCAG contrast gate and aborts on failure
npm run build           # Cloudflare Pages build: regenerates tokens, then assembles dist/
npm run dev              # Build, then start local dev server at localhost:3456
```

No linting tools or tests are configured. The token build's contrast gate is the closest thing to a test suite — treat a failing gate as a build break.

## Architecture

This is a **token-based design system** — not a component library. It consists of:

- `tokens/membrane.tokens.json` — **Single source of truth.** DTCG-flavored JSON. Edit this; never hand-edit the generated CSS.
- `tokens/design-tokens.css` — **Generated.** Pure CSS custom properties (3-tier: immutable primitives → `light-dark()`-paired semantics), OKLCH colors, `@layer tokens`. Produced by `scripts/build-tokens.mjs`.
- `tokens/base.css` — **Generated (optional).** Element-level rules — `::selection`, reduced motion, focus ring, typography composite classes — in `@layer base`. Import after `design-tokens.css` if you want these defaults.
- `showcase/index.html` — Static reference site demonstrating all tokens and component patterns in one file.
- `DESIGN-SYSTEM.md` — Authoritative specification: 15 sections covering colors, typography, spacing, components, dark mode, accessibility, and naming conventions.
- `DESIGN.md` — **Deprecated.** Frozen v1.1 YAML mirror, scheduled for removal in v3.0. Do not update it; update `tokens/membrane.tokens.json` instead.

There is no TypeScript or framework. The intended distribution model: other projects import `tokens/design-tokens.css` directly, then build components manually following the patterns in `DESIGN-SYSTEM.md`.

**If you need to change a token value:** edit `tokens/membrane.tokens.json`, then run `npm run build:tokens`. Never edit `tokens/design-tokens.css` or `tokens/base.css` directly — they are overwritten on every build.

## Design System Core Concepts

**The Membrane Palette** — the central metaphor organizing all design decisions:

| Register | Role | Colors |
|---|---|---|
| Human | Warm, pedagogical, tactile | Terracotta `#B35530`, Amber, Burgundy |
| The Membrane | Translation zone (canvas) | Warm Cream `#FAF6EE`, Warm Gray |
| Digital | Precision, depth, code | Deep Teal `#1B756D`, Steel Blue, Slate |

**Typography:**
- `Fraunces` (variable serif) = human/heading register
- `Instrument Sans` = digital/body register
- `JetBrains Mono` = builder/code register

**Spacing:** 4px base unit (`--space-1` = 0.25rem, scale to `--space-32`)

**Shadows:** Warm-tinted in light mode via `light-dark()`, never pure black

**Dark mode:** `light-dark()` on every semantic token, driven by `color-scheme: light dark` on `:root`. Manual override via `[data-theme="dark"|"light"]` attribute or the legacy `.theme-dark` class. Primitives (`--color-terracotta`, etc.) are immutable — never redefine them inside a theme override; only semantic tokens (`--color-action-primary`, `--color-focus`, etc.) theme.

**Motion:** Respects `prefers-reduced-motion`. `--duration-fast/normal/slow` fall back to `0ms`; `--duration-slower` falls back to `150ms` (kept nonzero for essential feedback).

## Asset Naming Convention

`idcesares-{type}-{descriptor}-{variant}.{ext}`

Examples: `idcesares-logo-wordmark-primary.svg`, `idcesares-photo-speaking-header.jpg`
