<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-B35530?style=flat-square" alt="Version 2.0.0">
  <img src="https://img.shields.io/badge/tokens-DTCG_JSON_→_CSS-1B756D?style=flat-square" alt="DTCG JSON">
  <img src="https://img.shields.io/badge/colors-OKLCH-5A8A6E?style=flat-square" alt="OKLCH">
  <img src="https://img.shields.io/badge/WCAG-AA_gated_(40_pairs)-5A8A6E?style=flat-square" alt="WCAG AA">
  <img src="https://img.shields.io/badge/dark_mode-light--dark()_native-D49A3A?style=flat-square" alt="light-dark()">
  <img src="https://img.shields.io/badge/license-MIT-7A3345?style=flat-square" alt="MIT License">
</p>

<br>

<h1 align="center">
  <strong>The Membrane Palette</strong>
</h1>

<p align="center">
  <em>A token-based design system where human warmth meets digital precision.</em>
</p>

<br>

<p align="center">
  <code>#B35530</code> Terracotta &nbsp;&bull;&nbsp;
  <code>#1B756D</code> Deep Teal &nbsp;&bull;&nbsp;
  <code>#FAF6EE</code> Warm Cream &nbsp;&bull;&nbsp;
  <code>#1A1B1F</code> Rich Charcoal
</p>

<br>

---

<br>

## The Concept

Every design system makes trade-offs. This one makes a specific bet: **the best interfaces hold the human and the digital simultaneously** — warm without being casual, precise without being cold.

The **Membrane Palette** is organized around a central metaphor — the translation zone between registers:

```
 HUMAN REGISTER          THE MEMBRANE           DIGITAL REGISTER
 (warmth, earth,    →    (where they      ←    (technology, depth,
  hands, pedagogy)        translate)             precision, code)

   Terracotta              Warm Cream              Deep Teal
   Amber Gold              Warm Gray               Steel Blue
   Burgundy                                        Slate
```

When a design element relates to the human side — education, community, ethics — it gravitates toward warm tones. When it relates to the digital side — code, AI, systems — it gravitates toward cool tones. When it bridges both (which is most of the time), it uses the neutral membrane colors with accents from either register.

<br>

## What This Is

This is a **token-based design system** — not a component library. It provides:

| File | Purpose |
|------|---------|
| [`tokens/membrane.tokens.json`](tokens/membrane.tokens.json) | **Single source of truth.** DTCG-flavored JSON. Edit this; never edit the CSS. |
| [`tokens/design-tokens.css`](tokens/design-tokens.css) | **Generated.** Pure CSS custom properties — 3-tier, OKLCH colors, `light-dark()`, `@layer tokens`. |
| [`tokens/base.css`](tokens/base.css) | **Generated (optional).** Element-level rules: `::selection`, reduced motion, focus, typography composites in `@layer base`. |
| [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) | **Authoritative specification.** 15 sections covering colors, typography, spacing, components, dark mode, accessibility. |
| [`showcase/index.html`](showcase/index.html) | **Living reference.** Static page demonstrating every token and component pattern. |

There is no TypeScript or framework dependency. The intended model: **import the tokens, build components following the spec.**

<br>

## Quick Start

### Option A — npm (recommended)

```bash
npm install @idcesares/design-system
```

```html
<!-- Tokens only (required) -->
<link rel="stylesheet" href="node_modules/@idcesares/design-system/tokens/design-tokens.css">

<!-- Optional layer: selection color, reduced motion, typography composites -->
<link rel="stylesheet" href="node_modules/@idcesares/design-system/tokens/base.css">
```

Or with a bundler:

```js
import '@idcesares/design-system';              // tokens only
import '@idcesares/design-system/base';         // + base layer
```

### Option B — CDN (jsDelivr)

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/idcesares/idcesares-design-system@2/tokens/design-tokens.css">
```

> **Note:** Do not use `raw.githubusercontent.com` — GitHub serves raw files as `text/plain` and browsers reject them as stylesheets.

### Option C — Copy the file

Download [`tokens/design-tokens.css`](tokens/design-tokens.css) and place it in your project. Regenerate it with `npm run build:tokens` when you fork and modify the source.

<br>

## Running Locally

```bash
git clone https://github.com/idcesares/idcesares-design-system.git
cd idcesares-design-system
npm install
npm run dev          # builds tokens, then serves showcase at localhost:3456
```

To modify tokens and rebuild:

```bash
# Edit tokens/membrane.tokens.json, then:
npm run build:tokens   # regenerates tokens/design-tokens.css + tokens/base.css
                       # aborts if any WCAG contrast pair fails
```

<br>

## Token Architecture

v2.0 uses a **three-tier architecture**. The single source of truth is `tokens/membrane.tokens.json`; CSS is generated from it.

```
tokens/membrane.tokens.json   ← edit here
        │
        └─ npm run build:tokens
                │
                ├─ tokens/design-tokens.css   ← @layer tokens (custom properties only)
                └─ tokens/base.css            ← @layer base  (element rules, optional)
```

### Tier 1 — Primitives (immutable)

Raw palette values. They never change between light and dark mode. Applications should avoid reaching into primitives directly.

```css
--color-terracotta:   oklch(55.96% 0.1327 41.1);   /* #B35530 */
--color-teal:         oklch(50.99% 0.0816 186.0);  /* #1B756D */
--color-cream:        oklch(97.40% 0.0114 84.6);   /* #FAF6EE */
--color-charcoal:     oklch(22.28% 0.0079 274.6);  /* #1A1B1F */
```

### Tier 2 — Semantics (theme-aware)

Intent-named tokens. **These are what applications consume.** Each carries its own `light-dark()` pair — primitives stay immutable.

```css
--color-action-primary:   light-dark(var(--color-terracotta), var(--color-terracotta-light));
--color-text-primary:     light-dark(var(--color-neutral-800), var(--color-neutral-100));
--color-bg-primary:       light-dark(var(--color-cream), var(--color-charcoal));
--color-focus:            light-dark(var(--color-teal), var(--color-teal-light));
```

Dark mode activates automatically via `color-scheme: light dark` on `:root`. Manual override:

```js
// Toggle
document.documentElement.setAttribute('data-theme', 'dark');   // force dark
document.documentElement.setAttribute('data-theme', 'light');  // force light
document.documentElement.removeAttribute('data-theme');         // follow OS
```

### Status color pairs

Every status color comes in two variants — a fill/icon token and a text token. The fill token is for icons, badges, and large decorative elements; the text token is for body-size text on light surfaces.

| Concept | Fill/icon | Text (≥4.5:1 on bg-primary) |
|---|---|---|
| Success | `--color-success` | `--color-success-text` |
| Warning | `--color-warning` | `--color-warning-text` |
| Error | `--color-error` | `--color-error-text` |

### Colors — 6 semantic families

```css
/* Primary registers */
--color-terracotta: oklch(…)   /* Human register — earth, hands, making */
--color-teal:       oklch(…)   /* Digital register — depth, ocean, code */

/* Canvas */
--color-cream:      oklch(…)   /* Light canvas. Never pure white. */
--color-charcoal:   oklch(…)   /* Dark canvas. Never pure black. */

/* Accents (spice — use sparingly) */
--color-amber:    oklch(…)     /* Builder energy. Fill/badge use only. */
--color-burgundy: oklch(…)     /* Heritage depth. */
--color-sage:     oklch(…)     /* Growth. Fill/icon; use --color-success-text for text. */
```

Plus a 10-step warm-tinted neutral scale (`--color-neutral-50` → `--color-neutral-900`), derived tints (`color-mix()`, mode-aware), ambient glow stop-colors, gradients, and code-block syntax tokens.

### Typography — 3 registers

| Font | Register | Usage |
|------|----------|-------|
| **Fraunces** (variable serif) | Human | Headings, display text |
| **Instrument Sans** | Digital | Body text, UI |
| **JetBrains Mono** | Builder | Code blocks, technical content |

Fluid type scale from `--text-xs` (0.75rem) to `--text-display` (clamp up to 3.75rem). Typography composite classes (`.type-display`, `.type-h1`…`.type-code`) ship in `tokens/base.css`.

### Spacing, Shadows, Motion

- **4px base unit** — `--space-1` (0.25rem) through `--space-32` (8rem)
- **Warm-tinted shadows** — each stop uses `light-dark()` for automatic dark-mode adaptation
- **Motion** — respects `prefers-reduced-motion`; all durations fall to 0ms when enabled
- **State layers** — `--state-hover-opacity`, `--state-pressed-opacity`, `--state-disabled-opacity`

<br>

## Design Principles

1. **Translation, Not Decoration** — Every element carries meaning. If it can't answer "what does this translate?", it doesn't belong.
2. **Warmth at the Foundation** — Default surfaces are warm, never clinical. Cream, not white. Charcoal, not black.
3. **Confident Restraint** — Authoritative without being loud. Generous whitespace, limited palette.
4. **The Maker's Mark** — Choices feel considered rather than generated. Optical adjustments, thoughtful type pairing.
5. **Brazilian Texture** — The warmth and materiality of Rio de Janeiro — earth tones, ocean tones, tropical green — globally legible but culturally grounded.

<br>

## Accessibility

- **Automated contrast gate:** the build script verifies 40 foreground/background pairs in both light and dark mode before writing CSS output. A failing pair aborts the build.
- All primary/secondary color pairings meet **WCAG AA** contrast requirements; primary text pairs target **AAA**.
- Focus states use a visible `2px solid` ring from `--focus-ring`, with a dedicated `--color-focus` semantic token that remaps to a higher-contrast value in dark mode.
- Motion tokens respect `prefers-reduced-motion: reduce`.
- Interactive targets respect the 44px minimum via `--size-touch-target`.
- `prefers-contrast: more` boosts text-secondary and text-tertiary to primary contrast.
- `forced-colors: active` strips decorative glows so Windows High Contrast mode is unobstructed.

<br>

## Dark Mode

Fully automatic via `color-scheme: light dark` and `light-dark()` on every semantic token:

```css
/* Automatic — follows OS */
:root { color-scheme: light dark; }

/* Manual — attribute or class */
[data-theme="dark"]  { color-scheme: dark; }
[data-theme="light"] { color-scheme: light; }
.theme-dark          { color-scheme: dark; }   /* legacy class */
```

Accent colors are paired per-token (primitives stay immutable; only semantic tokens theme). Shadows, glow effects, gradient endpoints, and derived tints all adapt automatically.

<br>

## File Structure

```
idcesares-design-system/
├── tokens/
│   ├── membrane.tokens.json   ← Source of truth (edit this)
│   ├── design-tokens.css      ← Generated — import this
│   └── base.css               ← Generated — optional element rules
├── scripts/
│   ├── build-tokens.mjs       ← Token compiler (OKLCH + contrast gate)
│   └── build-cloudflare-pages.mjs
├── showcase/
│   └── index.html             ← Living reference
├── DESIGN-SYSTEM.md           ← Full specification
├── BRAND-VOICE.md             ← Verbal identity guidelines
├── CHANGELOG.md               ← Version history
└── CLAUDE.md                  ← AI agent instructions
```

<br>

## Asset Naming Convention

All brand assets follow the pattern:

```
idcesares-{type}-{descriptor}-{variant}.{ext}
```

Examples: `idcesares-logo-wordmark-primary.svg`, `idcesares-photo-speaking-header.jpg`

<br>

## License

[MIT](LICENSE) — Isaac D'Césares

<br>

---

<p align="center">
  <em>Built at the membrane between the human and the digital.</em><br>
  <em>Rio de Janeiro, 2026.</em>
</p>
