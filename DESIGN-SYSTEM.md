# Isaac D'Césares — Brand Design System
> **Version 2.2 · October 2026**
> *The visual translation of the brand essence into a coherent, reproducible system.*

---

## 0. How to Use This Document

This design system is the **visual and interactive authority** for the Isaac D'Césares brand — from the personal website to social media cards, presentation decks, GitHub profiles and institutional materials. Personal facts live in `PROFILE.md`; writing behavior lives in `VOICE.md`; public brand expression lives in `BRAND-VOICE.md`.

**For designers:** Follow the tokens, scales, and component patterns. Every decision has intent — do not substitute without understanding the reasoning.

**For developers:** Link `membrane.css` (tokens + base + components) and build with the component library in `components/` (§6). The CSS custom properties in `tokens/design-tokens.css` are **generated** from `tokens/membrane.tokens.json`; edit the JSON source and run `npm run build:system`. When you write your own CSS, consume Tier 2 semantic tokens (`--color-action-primary`, `--color-text-tertiary`, etc.), never Tier 1 primitives (`--color-terracotta`) or raw color values — the component build enforces exactly this rule on the library itself.

**For AI agents:** Start from `llms.txt` and `components/manifest.json` for the UI API. Read `PROFILE.md` before making claims about Isaac, `VOICE.md` for writing behavior and register adaptation, and `BRAND-VOICE.md` for public-facing brand expression. Use this document as the visual/UI constraint: validate output against Section 1 (Principles), Section 2 (Color), Section 3 (Typography) and Section 6 (Components) at minimum, and §11.4 for a ready-made constraint block.

**The test for visual output:** Is the chosen register meaningful for the content? When human and digital concerns meet, does the interface hold them coherently? Is it warm without being casual and precise without being cold? For factual and verbal output, use the authority hierarchy above rather than inferring from visual principles.

---

## 1. Design Principles

Five principles govern every design decision. They are derived directly from the brand essence and listed in priority order.

### 1.1 Translation, Not Decoration
Every visual element must carry meaning. A color is not chosen because it "looks nice" — it is chosen because it communicates a specific register (human, digital, or the bridge between them). Ornament for its own sake is excluded. If a design element cannot answer "what does this translate?", it does not belong.

### 1.2 Warmth at the Foundation
The default surface is warm, never clinical. Backgrounds carry subtle warmth (cream, not white; charcoal, not black). This principle ensures that even the most technical content — code blocks, data visualizations, system diagrams — is presented in a context that feels human. Inspired by how Anthropic uses cream tones and hand-drawn textures to soften cutting-edge AI, and how Perplexity uses warm accent tones to escape the "tech brand" trap.

### 1.3 Confident Restraint
The brand is authoritative without being loud. This manifests as generous whitespace, deliberate typography, and a limited but meaningful color palette. Like the photo — arms crossed, direct gaze, warm smile — confidence is communicated through composure, not volume. No gradients-for-gradients-sake, no excessive animation, no visual noise.

### 1.4 The Maker's Mark
A subtle hand-crafted quality should be perceptible. This is not about literal hand-drawn elements everywhere, but about choices that feel considered rather than generated: optical adjustments in spacing, thoughtful type pairing (a variable serif alongside a geometric sans), moments of texture. Inspired by Anthropic's doodle-and-craft aesthetic — the sense that a human shaped this, not a template.

### 1.5 Brazilian Texture
The design carries the warmth, light, and materiality of Rio de Janeiro without being literal or folkloric. This manifests in the color palette (earth tones, ocean tones, tropical green), in the preference for natural warmth over Scandinavian coolness, and in a certain generosity of space that echoes hospitality. The brand is globally legible but culturally grounded.

---

## 2. Color System

### 2.1 The Membrane Palette — Concept

The color system is organized around the brand's central metaphor: **the membrane between the human and the digital**. Colors are classified into three registers that mirror the brand's semantic field:

```
HUMAN REGISTER          THE MEMBRANE          DIGITAL REGISTER
(warmth, earth,    →    (where they     ←    (technology, depth,
 hands, pedagogy)        translate)            precision, code)

  Terracotta              Warm Cream              Deep Teal
  Amber Gold              Warm Gray               Steel Blue*
  Burgundy                                        Charcoal
```

\* Steel Blue exists only as a data color (`--color-chart-5`); it never appears in UI chrome. Earlier versions also listed a "Slate" that was never defined — the digital register's dark anchor is Charcoal.

This is not arbitrary. When a design element relates to the human side of the brand (education, community, ethics), it gravitates toward warm tones. When it relates to the digital side (code, AI, systems), it gravitates toward cool tones. When it bridges both — which is most of the time — it uses the neutral membrane colors with accents from either register.

### 2.2 Core Palette

#### Primary Colors

| Token | Name | Hex | HSL | Role |
|-------|------|-----|-----|------|
| `--color-terracotta` | Terracotta | `#B35530` | `17, 58%, 45%` | **Primary brand color.** The human register made visible. Earth, hands, making, Brazilian clay. Used for primary CTAs, key highlights, the signature accent. *Adjusted for WCAG AA compliance.* |
| `--color-teal` | Deep Teal | `#1B756D` | `175, 62%, 28%` | **Secondary brand color.** The digital register. Technology, depth, Rio's ocean. Used for secondary actions, links, code accents, digital-context elements. |

#### Derived Tints

Alpha washes of the palette, computed with `color-mix()` and mode-aware (dark mode derives them from the `-light` primitives). They are Tier 1: use them for decorative surfaces in page layouts. **Components and UI text use the semantic washes instead** (`--color-human-bg`, `--color-digital-bg`, `--color-success-bg`, … in §2.3), which come paired with a gate-checked text color.

| Token | Mix | Usage |
|-------|-----|-------|
| `--color-terracotta-10` / `-20` | terracotta @ 10% / 20% | Warm decorative washes |
| `--color-teal-08` / `-10` / `-12` / `-20` | teal @ 8–20% | Digital decorative washes, page glows |
| `--color-amber-10`, `--color-burgundy-10`, `--color-sage-10` | accent @ 10% | Accent washes |

#### Canvas Colors

| Token | Name | Hex | HSL | Role |
|-------|------|-----|-----|------|
| `--color-cream` | Warm Cream | `#FAF6EE` | `40, 55%, 96%` | **Light canvas.** The membrane surface. Never pure white — warmth is baked into the ground. Primary background for light mode. |
| `--color-charcoal` | Rich Charcoal | `#1A1B1F` | `228, 9%, 11%` | **Dark canvas.** Depth and sophistication. Primary background for dark mode. Slightly cool to create contrast with warm accents. |

#### Accent Colors

| Token | Name | Hex | HSL | Role |
|-------|------|-----|-----|------|
| `--color-amber` | Amber Gold | `#D49A3A` | `37, 64%, 53%` | **Making energy.** Making, creation, sunlight, optimism. Used sparingly for highlights, badges, "new" indicators, callout borders. |
| `--color-burgundy` | Burgundy | `#7A3345` | `345, 41%, 34%` | **Heritage depth.** The D'Césares lineage, intellectual depth, gravitas. Used for deep emphasis, footnotes, premium contexts. |
| `--color-sage` | Sage Green | `#5A8A6E` | `145, 21%, 45%` | **Growth.** Education, nature, Rio's vegetation, development. Used for success states, growth metrics, educational contexts. |

#### Neutral Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-neutral-50` | `#FAF6EE` | = Warm Cream (lightest) |
| `--color-neutral-100` | `#F0EBE1` | Cards and alternating sections (`--color-bg-secondary`); primary text in dark mode |
| `--color-neutral-200` | `#E2DCD2` | Default borders and nested fills in light mode (`--color-border-default`, `--color-bg-tertiary`) |
| `--color-neutral-300` | `#C8C1B5` | Emphasized borders in light mode (`--color-border-emphasis`) |
| `--color-neutral-400` | `#A39D93` | Secondary text in **dark** mode (too light for text on cream) |
| `--color-neutral-500` | `#7D776E` | Form-control boundaries in both modes (`--color-border-input`, ≥3:1); not for text, which uses the darker `#6E685F` |
| `--color-neutral-600` | `#5C564E` | Secondary text in light mode; emphasized borders in dark mode |
| `--color-neutral-700` | `#3D3832` | Tertiary text under `prefers-contrast: more` (light) |
| `--color-neutral-800` | `#2A2622` | Primary text and headings in light mode (`--color-text-primary`) |
| `--color-neutral-900` | `#1A1B1F` | = Rich Charcoal (darkest) |

> Components never use these directly: they consume the semantic roles in parentheses (§2.3).

> **Note:** The neutral scale is intentionally warm. Every gray carries a subtle amber undertone (shifting toward `hsl(35, 8%, x%)`) rather than being purely achromatic. This ensures that even structural elements (borders, backgrounds, disabled states) contribute to the warmth principle.

### 2.3 Semantic Colors

Each token carries its `light-dark()` pair internally — the same property name works in both modes. No override blocks required. The families:

- **Text** — `text-primary/secondary/tertiary`, `text-accent` (links), `text-on-accent` (labels on filled buttons), `text-inverse`.
- **Surfaces** — `bg-primary` (page), `bg-secondary` (cards), `bg-tertiary` (nested), `bg-elevated` (dialogs/popovers; lighter in dark mode), `bg-inverse` (tooltips), `bg-hover` / `bg-active` (translucent state washes that work on any surface).
- **Borders** — `border-default` and `border-emphasis` are decorative; `border-input` is the ≥3:1 boundary every form control needs (WCAG 1.4.11).
- **Actions** — `action-primary` (terracotta) and `action-secondary` (teal), each with a `-hover` fill; `focus`.
- **Registers** — `human-text` + `human-bg`, `digital-text` + `digital-bg`: the membrane metaphor as gate-checked text/wash pairs.
- **Status** — for each of success, warning, error, info: a fill (`success`), a text color (`success-text`) and a wash (`success-bg`), plus `error-hover` for destructive buttons.

The table below is **generated** from `tokens/membrane.tokens.json` by `npm run build:tokens`.

<!-- GENERATED:SEMANTIC-COLORS -->
| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-text-primary` | `--color-neutral-800` #2A2622 | `--color-neutral-100` #F0EBE1 | Primary body text and headings. |
| `--color-text-secondary` | `--color-neutral-600` #5C564E | `--color-neutral-400` #A39D93 | Supporting text: ledes, descriptions, captions. |
| `--color-text-tertiary` | #6E685F | #938D83 | Metadata, placeholders. v2.0: darkened from neutral-400 (2.5:1) to pass WCAG AA 4.5:1 on bg-primary and bg-secondary. |
| `--color-text-accent` | `--color-teal` #1B756D | `--color-teal-light` #3AAFA8 | Inline links and interactive text. |
| `--color-text-on-accent` | #FFFFFF | `--color-charcoal` #1A1B1F | v2.0: flips to charcoal in dark mode — white on the lightened terracotta was 3.3:1. |
| `--color-bg-primary` | `--color-cream` #FAF6EE | `--color-charcoal` #1A1B1F | Page background — the membrane surface. |
| `--color-bg-secondary` | `--color-neutral-100` #F0EBE1 | #242429 | Cards and alternating sections. |
| `--color-bg-tertiary` | `--color-neutral-200` #E2DCD2 | #2E2E34 | Nested containers, neutral tag fills, progress tracks. |
| `--color-border-default` | `--color-neutral-200` #E2DCD2 | #3D3842 | Decorative dividers and card outlines. Too faint to be the only boundary of a control — use border-input there. |
| `--color-border-emphasis` | `--color-neutral-300` #C8C1B5 | `--color-neutral-600` #5C564E | Emphasized separation; hover border for quiet surfaces. |
| `--color-overlay-bg` | RGBA(26, 27, 31, 0.70) | RGBA(26, 27, 31, 0.70) | Scrims and image-readability layers. Intentionally identical in both modes. |
| `--color-action-primary` | `--color-terracotta` #B35530 | `--color-terracotta-light` #D4724F | Primary CTAs and key interactive accents. Replaces direct use of --color-terracotta on interactive elements. |
| `--color-action-secondary` | `--color-teal` #1B756D | `--color-teal-light` #3AAFA8 | Secondary/navigational actions. |
| `--color-focus` | `--color-teal` #1B756D | `--color-teal-light` #3AAFA8 | Focus indicator color. v2.0: dark mode now remaps to teal-light (raw teal was ~3:1 on charcoal). |
| `--color-success` | `--color-sage` #5A8A6E | `--color-sage-light` #6FBF8A | Fills, icons, large text (≥3:1). For body-size text use success-text. |
| `--color-success-text` | #3E6B52 | `--color-sage-light` #6FBF8A | Success body text (≥4.5:1 on page, card, and success-bg). |
| `--color-warning` | `--color-amber` #D49A3A | `--color-amber-light` #E8B44A | Fills and badges with dark text on top. Never use as text on light surfaces — 2.3:1. |
| `--color-warning-text` | #7A571B | `--color-amber-light` #E8B44A | Warning body text (≥4.5:1 on page, card, and warning-bg). |
| `--color-error` | #C44040 | #E86060 | Error fills, icons, invalid-control borders, danger buttons (≥3:1). |
| `--color-error-text` | #A53434 | #F07C78 | Error body text and validation messages (≥4.5:1 on page, card, and error-bg). |
| `--color-info` | `--color-teal` #1B756D | `--color-teal-light` #3AAFA8 | Informational fills and icons. |
| `--color-selection` | `color-mix(in srgb, light-dark(var(--color-terracotta), var(--color-terracotta-light)) 20%, transparent)` | `color-mix(in srgb, light-dark(var(--color-terracotta), var(--color-terracotta-light)) 20%, transparent)` | Text selection highlight. |
| `--color-bg-elevated` | `--color-cream` #FAF6EE | #27272D | Surfaces that float above the page: dialogs, popovers, menus. In dark mode elevation reads as a lighter surface, not just a deeper shadow. |
| `--color-bg-inverse` | `--color-neutral-800` #2A2622 | `--color-neutral-100` #F0EBE1 | Inverted surface for tooltips and high-attention chips. Pair with text-inverse. |
| `--color-text-inverse` | `--color-neutral-100` #F0EBE1 | `--color-neutral-800` #2A2622 | Text on bg-inverse. |
| `--color-bg-hover` | `--color-neutral-800` @ 6% | `--color-neutral-100` @ 6% | Neutral hover wash for quiet controls (ghost buttons, nav links, table rows, accordion summaries). Works on any surface because it is a translucent overlay. |
| `--color-bg-active` | `--color-neutral-800` @ 10% | `--color-neutral-100` @ 10% | Neutral pressed/selected wash. Pair with bg-hover. |
| `--color-border-input` | `--color-neutral-500` #7D776E | `--color-neutral-500` #7D776E | Boundary of form controls (inputs, checkboxes, switches). ≥3:1 against page and card surfaces per WCAG 1.4.11 — border-default is decorative and too faint to be a control's only boundary. |
| `--color-action-primary-hover` | `--color-action-primary` + 16% `--color-text-primary` → #9C4E2F | `--color-action-primary` + 16% `--color-text-primary` → #DA8667 | Hover/pressed fill for primary actions. Mixes toward text-primary, so it darkens in light mode and lightens in dark mode — contrast with text-on-accent always increases. |
| `--color-action-secondary-hover` | `--color-action-secondary` + 16% `--color-text-primary` → #256860 | `--color-action-secondary` + 16% `--color-text-primary` → #61B9B1 | Hover/pressed fill for secondary actions. |
| `--color-error-hover` | `--color-error` + 16% `--color-text-primary` → #AA3E3C | `--color-error` + 16% `--color-text-primary` → #EC7974 | Hover/pressed fill for destructive actions. |
| `--color-human-text` | `--color-terracotta-dark` #944425 | #E08A6A | Human-register text: overlines, tags, pull quotes, active nav. ≥4.5:1 on page, card, and human-bg surfaces. |
| `--color-human-bg` | `--color-terracotta` @ 10% | `--color-terracotta-light` @ 10% | Human-register wash for tags, avatars, callouts. Pair with human-text. |
| `--color-digital-text` | `--color-teal-dark` #145C56 | `--color-teal-light` #3AAFA8 | Digital-register text: tech-stack tags, code-adjacent labels. ≥4.5:1 on page, card, and digital-bg surfaces. |
| `--color-digital-bg` | `--color-teal` @ 10% | `--color-teal-light` @ 10% | Digital-register wash. Pair with digital-text. |
| `--color-info-text` | `--color-teal-dark` #145C56 | `--color-teal-light` #3AAFA8 | Informational body text (4.5:1 on page, card, and info-bg). |
| `--color-success-bg` | `--color-sage` @ 10% | `--color-sage-light` @ 10% | Success surface for alerts and badges. Pair with success-text. |
| `--color-warning-bg` | `--color-amber` @ 10% | `--color-amber-light` @ 10% | Warning surface. Pair with warning-text. |
| `--color-error-bg` | `--color-error` @ 10% | `--color-error` @ 10% | Error surface. Pair with error-text. |
| `--color-info-bg` | `--color-teal` @ 10% | `--color-teal-light` @ 10% | Informational surface. Pair with info-text. |
| `--color-chart-1` | #B35530 | #D4724F | Categorical chart series 1 (terracotta — human register; the brand's lead series). Assign in order, never cycle; validated as a set (adjacent CVD ΔE ≥ 11.5, ≥3:1 on page and cards in both modes). |
| `--color-chart-2` | #009187 | #00A99D | Categorical chart series 2 (teal — digital register). Assign in order, never cycle; validated as a set (adjacent CVD ΔE ≥ 11.5, ≥3:1 on page and cards in both modes). |
| `--color-chart-3` | #A1742A | #B78941 | Categorical chart series 3 (amber). Assign in order, never cycle; validated as a set (adjacent CVD ΔE ≥ 11.5, ≥3:1 on page and cards in both modes). |
| `--color-chart-4` | #9F3B5A | #B6506E | Categorical chart series 4 (burgundy). Assign in order, never cycle; validated as a set (adjacent CVD ΔE ≥ 11.5, ≥3:1 on page and cards in both modes). |
| `--color-chart-5` | #4981B9 | #5E97D0 | Categorical chart series 5 (steel blue). Assign in order, never cycle; validated as a set (adjacent CVD ΔE ≥ 11.5, ≥3:1 on page and cards in both modes). |
| `--color-chart-6` | #4B8F5B | #25984D | Categorical chart series 6 (green). Assign in order, never cycle; validated as a set (adjacent CVD ΔE ≥ 11.5, ≥3:1 on page and cards in both modes). |
<!-- /GENERATED:SEMANTIC-COLORS -->

### 2.4 Color Usage Rules

1. **The 60-30-10 distribution:** 60% canvas (cream/charcoal), 30% neutrals (grays, borders, secondary text), 10% accent colors (terracotta, teal, amber).
2. **Never use pure white (`#FFFFFF`) as a background.** Use `--color-cream` or lighter neutrals. Pure white is reserved exclusively for text on dark/accent backgrounds.
3. **Never use pure black (`#000000`).** Use `--color-charcoal` or darker neutrals.
4. **Terracotta is the primary action color.** If there is one colored element on a page, it should be terracotta.
5. **Teal is the secondary/navigational color.** Links, secondary buttons, and digital-context elements.
6. **Amber and burgundy are spice — use sparingly.** They add depth when used at 5-10% of an accent budget, not as primaries.
7. **In dark mode, accent colors lighten slightly** to maintain contrast ratios (WCAG AA minimum, AAA preferred).

### 2.5 Gradients

Gradients are used intentionally to represent the "membrane" — the translation zone between registers.

| Token | Value | Usage |
|-------|-------|-------|
| `--gradient-membrane` | `linear-gradient(135deg, light-dark(#B35530, #D4724F) 0%, light-dark(#1B756D, #3AAFA8) 100%)` | The brand's signature gradient. Human → Digital. v2.0: both endpoints lighten in dark mode via `light-dark()` on `--color-action-primary`/`--color-action-secondary`. Used on hero sections, key visual moments, not on small UI elements. |
| `--gradient-warmth` | `radial-gradient(ellipse at 15% 0%, color-mix(in srgb, light-dark(#B35530, #D4724F) 8%, transparent) 0%, transparent 70%)` | Subtle warm glow applied to section backgrounds. v2.0: mode-aware via the same mechanism as the derived tints (§2.2). Creates ambient warmth without being decorative. |
| `--gradient-depth` | `linear-gradient(180deg, var(--color-charcoal) 0%, #12131A 100%)` | Dark mode depth. Used on hero backgrounds in dark mode. |
| `--gradient-divider` | `linear-gradient(90deg, transparent, var(--color-border-default), transparent)` | Fading dividers between sections |
| `--gradient-subtle` | `linear-gradient(150deg, var(--color-bg-secondary) 8%, var(--color-bg-primary) 92%)` | Quiet surface transition used by content cards and media frames |

#### Ambient Glow Stop Colors

These tokens provide the website's current page-level glow system without hard-coding rgba values in layouts.

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--bg-glow-terracotta` | `rgba(179, 85, 48, 0.09)` | `rgba(179, 85, 48, 0.12)` | Warm ambient glow |
| `--bg-glow-teal` | `rgba(27, 117, 109, 0.10)` | `rgba(58, 175, 168, 0.10)` | Digital ambient glow |
| `--bg-glow-sage` | `rgba(90, 138, 110, 0.08)` | `rgba(58, 175, 168, 0.08)` | Supporting growth/calm glow |
| `--bg-glow-focal` | `rgba(179, 85, 48, 0.06)` | `rgba(179, 85, 48, 0.08)` | Initial focal glow |
| `--bg-glow-focal-loaded` | `rgba(179, 85, 48, 0.10)` | `rgba(179, 85, 48, 0.14)` | Loaded-state focal glow |

### 2.6 Code Block Colors

Code blocks are always dark, even in light mode. These tokens control syntax highlighting:

| Token | Value | Usage |
|-------|-------|-------|
| `--code-bg` | `#1E1F26` | Code block background |
| `--code-text` | `#E2DCD2` | Default code text |
| `--code-border` | `rgba(255, 255, 255, 0.06)` | Subtle border |
| `--code-keyword` | `#E07050` | Language keywords |
| `--code-string` | `#7BC494` | String literals |
| `--code-function` | `#E8B44A` | Function names |
| `--code-comment` | `#958F84` | Comments (v2.1: was `#7D776E`, 3.7:1 — now 5.2:1) |
| `--code-number` | `#5AC8C0` | Numeric values |

Every syntax color is gate-checked at ≥4.5:1 on `--code-bg` (§13.1).

---

## 3. Typography

### 3.1 Type Philosophy

The typographic system encodes the same tension that defines the brand:

- **Fraunces** (variable serif) = The human register. Warm, intellectual, with subtle optical personality. It has soft, organic curves and a wonky character that prevents it from feeling institutional. It says: *there is a person behind this thinking.*
- **Instrument Sans** (sans-serif) = The digital register. Clean, geometric, technical — but not sterile. It has enough character to avoid feeling generic. It says: *this is built with precision.*
- **JetBrains Mono** (monospace) = The technical-craft register. Code, systems, the maker at work. It says: *this person ships.*

This triad mirrors the brand identity triad: **Researcher (Fraunces) · Educator (Instrument Sans) · Developer (JetBrains Mono).**

### 3.2 Font Stack

```css
--font-serif:    'Fraunces', 'Fraunces Fallback', 'Georgia', 'Times New Roman', serif;
--font-sans:     'Instrument Sans', 'Instrument Sans Fallback', 'Inter', 'Helvetica Neue', 'Arial', sans-serif;
--font-mono:     'JetBrains Mono', 'JetBrains Mono Fallback', 'Fira Code', 'Consolas', monospace;
```

**Loading strategy:** all three families are self-hosted in `fonts/` (SIL OFL 1.1) as variable woff2 files, latin and latin-ext subsets, and declared in `fonts/fonts.css` (also inlined at the top of `membrane.css`). `unicode-range` means a page downloads only the subsets its text uses, and the italic files only when italics render.

- `font-display: swap`: text is never invisible.
- Each family has a **metric-matched fallback** (`"Fraunces Fallback"` = local Times New Roman, `"Instrument Sans Fallback"` = Arial, `"JetBrains Mono Fallback"` = Courier New) with `size-adjust` and ascent/descent overrides measured by `scripts/measure-fonts.py`. The fallback occupies the same space as the web font, so the swap barely moves the layout.
- Recommended: preload the body face (`instrument-sans-latin-wght-normal.woff2`) and, when headings are above the fold, `fraunces-latin-opsz-normal.woff2` (the showcase does both).
- No third-party font requests: nothing about a visitor reaches Google.

**Variable font axes (Fraunces, as shipped in `fonts/`):**
- `wght`: 100–900 in the file; the system uses 400 (body), 600 (emphasis) and 700 (display).
- `opsz`: 9–144 (optical sizing — let the browser handle this automatically).
- `WONK` and `SOFT` are **not** in the web files (they would roughly double the download). Only the outlined brand marks use `WONK` 1 (§10.3); `font-variation-settings: "WONK" 1` in CSS does nothing.

### 3.3 Type Scale

The scale uses a **variable ratio** — approximately 1.20 between small steps, widening to approximately 1.375 at display sizes. Display through body sizes use `clamp()` for fluid responsive behavior; `small` and `xs` are fixed so metadata stays legible at every width.

| Token | Min (mobile) | Preferred | Max (desktop) | Weight | Font | Usage |
|-------|-------------|-----------|---------------|--------|------|-------|
| `--text-display` | 2.25rem | 3.5vw + 1rem | 3.75rem | 700 | Fraunces | Hero headlines, page titles |
| `--text-h1` | 1.875rem | 2.5vw + 1rem | 2.75rem | 700 | Fraunces | Section headings |
| `--text-h2` | 1.5rem | 2vw + 0.75rem | 2rem | 600 | Fraunces | Subsection headings |
| `--text-h3` | 1.25rem | 1.5vw + 0.5rem | 1.5rem | 600 | Fraunces | Card titles, feature names |
| `--text-h4` | 1.125rem | — | 1.25rem | 600 | Instrument Sans | Small headings, labels |
| `--text-body` | 1rem | — | 1.0625rem | 400 | Instrument Sans | Body copy |
| `--text-body-lg` | 1.0625rem | — | 1.1875rem | 400 | Instrument Sans | Lead paragraphs, intros |
| `--text-small` | 0.875rem | — | 0.875rem | 400 | Instrument Sans | Captions, metadata |
| `--text-xs` | 0.75rem | — | 0.75rem | 500 | Instrument Sans | Labels, badges, overlines |
| `--text-code` | 0.875rem | — | 0.9375rem | 400 | JetBrains Mono | Inline code, code blocks |

#### Website Compatibility Aliases (deprecated in v2.1)

These aliases resolve to the canonical scale. Two names for one size made generated code inconsistent, so they are **deprecated** — they still work, the build flags them, and they will not be removed before v3.0.0. Use the canonical name.

| Alias | Resolves to |
|-------|-------------|
| `--text-sm` | `--text-small` |
| `--text-base` | `--text-body` |
| `--text-md` | `--text-h4` |
| `--text-lg` | `--text-h3` |
| `--text-xl` | `--text-h2` |

### 3.4 Line Height & Letter Spacing

| Context | Line Height | Letter Spacing |
|---------|-------------|----------------|
| Display headings | `1.1` | `-0.02em` |
| H1–H2 | `1.2` | `-0.015em` |
| H3–H4 | `1.3` | `-0.01em` |
| Body text | `1.6` | `0` |
| Body large | `1.5` | `0` |
| Small / captions | `1.5` | `0.01em` |
| Code | `1.6` | `0` |
| Overlines / labels | `1.2` | `0.08em` (uppercase) |

### 3.5 Typography Rules

1. **Headings are always Fraunces** except H4, which uses Instrument Sans at semibold to create a bridge from headline to body.
2. **Body text is always Instrument Sans.** Never set body copy in Fraunces — it's not designed for sustained reading.
3. **Overlines and labels** use Instrument Sans in uppercase with generous letter spacing (`0.08em`). These serve as navigational landmarks.
4. **Italic Fraunces** is used for pull quotes, definitions, and the brand's signature phrases. The italic has distinct soft forms that reinforce the human register.
5. **Maximum body text width: `65ch`** (~600px). This ensures optimal readability regardless of screen size.
6. **Paragraph spacing:** Use `1.25em` margin-bottom between paragraphs, not double line breaks.

### 3.6 Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--weight-regular` | `400` | Body text, default |
| `--weight-medium` | `500` | Navigation links, labels, buttons |
| `--weight-semibold` | `600` | H2-H4 headings, emphasis |
| `--weight-bold` | `700` | Display, H1, brand marks |

---

## 4. Spacing System

### 4.1 Base Unit

All spacing derives from a **4px base unit** (`0.25rem`). This creates a consistent rhythm that is perceptible but not rigid.

### 4.2 Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--space-1` | `0.25rem` | 4px | Micro adjustments, icon-to-text gaps |
| `--space-2` | `0.5rem` | 8px | Tight spacing: between related inline elements |
| `--space-3` | `0.75rem` | 12px | Compact padding: pills, tags, badges |
| `--space-4` | `1rem` | 16px | Base spacing: default gap between elements |
| `--space-5` | `1.25rem` | 20px | Content padding within cards |
| `--space-6` | `1.5rem` | 24px | Section inner padding, card gaps |
| `--space-8` | `2rem` | 32px | Between content groups |
| `--space-10` | `2.5rem` | 40px | Between sections (mobile) |
| `--space-12` | `3rem` | 48px | Between sections (tablet) |
| `--space-16` | `4rem` | 64px | Major section breaks |
| `--space-20` | `5rem` | 80px | Page-level vertical rhythm |
| `--space-24` | `6rem` | 96px | Hero spacing, large breathing room |
| `--space-32` | `8rem` | 128px | Maximum section gap (desktop) |

### 4.3 Layout Grid

**Container widths:**

| Token | Value | Usage |
|-------|-------|-------|
| `--container-sm` | `640px` | Narrow content (blog posts, long-form reading) |
| `--container-md` | `768px` | Default content width |
| `--container-lg` | `1024px` | Wide content (feature sections, grids) |
| `--container-xl` | `1200px` | Maximum content width |
| `--container-full` | `100%` | Full-bleed sections (with padding) |

**Site margin:** `clamp(1.5rem, 5vw, 5rem)` (`--site-margin`) — fluid margins that scale gracefully from mobile to desktop.

**Measure:** `--measure` (`65ch`) caps body-copy line length (§3.5 rule 5).

In practice, use the layout primitives (`.mp-container`, `.mp-stack`, `.mp-cluster`, `.mp-grid`, `.mp-section` — see `components/layout/`) rather than writing these grids by hand; their `data-gap` values map 1:1 to the spacing scale.

**Grid system:**
- Use CSS Grid for layout, Flexbox for alignment within components.
- Default column gap: `--space-6` (1.5rem)
- Default row gap: `--space-8` (2rem)
- Common patterns:
  - **2-column:** `grid-template-columns: 1fr 1fr` (above `768px`)
  - **3-column:** `grid-template-columns: repeat(3, 1fr)` (above `1024px`)
  - **Sidebar:** `grid-template-columns: 280px 1fr` (above `768px`)
- All grids collapse to single-column on mobile (`< 768px`).

### 4.4 Breakpoints

| Token | Value | Name |
|-------|-------|------|
| `--bp-sm` | `640px` | Small (large phones) |
| `--bp-md` | `768px` | Medium (tablets) |
| `--bp-lg` | `1024px` | Large (small desktops) |
| `--bp-xl` | `1280px` | Extra large (desktops) |

Custom properties can't be used inside `@media`, so breakpoints are emitted as comments only — they document the values to type into media queries. Components prefer intrinsic layout (`auto-fit` grids, wrapping clusters) and container queries over viewport breakpoints.

### 4.5 Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `0` | Default stacking |
| `--z-dropdown` | `10` | Dropdown menus |
| `--z-sticky` | `20` | Sticky elements |
| `--z-nav` | `100` | Navigation bar |
| `--z-overlay` | `200` | Overlays, backdrops |
| `--z-modal` | `300` | Modal dialogs |
| `--z-toast` | `400` | Toast notifications |
| `--z-tooltip` | `500` | Tooltips (topmost) |

### 4.6 Opacity Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--opacity-subtle` | `0.10` | Background tints, tag fills |
| `--opacity-light` | `0.20` | Hover backgrounds |
| `--opacity-medium` | `0.50` | Disabled states |
| `--opacity-overlay` | `0.70` | Overlay backdrops |
| `--opacity-heavy` | `0.85` | Near-opaque overlays |



---

## 5. Border, Shadow & Shape

### 5.1 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `4px` | Small elements: checkboxes, input fields |
| `--radius-md` | `8px` | Cards, modals, dropdowns |
| `--radius-lg` | `12px` | Feature cards, image containers |
| `--radius-xl` | `16px` | Hero cards, prominent containers |
| `--radius-full` | `999px` | Pills, tags, avatar containers, fully-rounded buttons |

> **Note:** Fully rounded buttons use `--radius-full` (`999px`), carried forward from the original website. Buttons are pills — rounded, approachable, inviting. Cards are softly rounded but not pill-shaped.

### 5.2 Shadows

Shadows are warm-tinted (not pure black) to maintain the warmth principle.

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 3px rgba(26, 27, 31, 0.06), 0 1px 2px rgba(26, 27, 31, 0.04)` | Subtle lift: cards at rest, inputs |
| `--shadow-md` | `0 4px 12px rgba(26, 27, 31, 0.08), 0 2px 4px rgba(26, 27, 31, 0.04)` | Active cards, dropdowns, popovers |
| `--shadow-lg` | `0 12px 32px rgba(26, 27, 31, 0.12), 0 4px 8px rgba(26, 27, 31, 0.06)` | Modals, elevated elements |
| `--shadow-glow-warm` | `0 0 24px rgba(179, 85, 48, 0.15)` | Warm glow on hover for terracotta elements |
| `--shadow-glow-teal` | `0 0 24px rgba(27, 117, 109, 0.15)` | Teal glow for digital-context elements |

### 5.3 Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border-default` | `var(--border-width-thin) solid var(--color-border-default)` | Standard borders |
| `--border-emphasis` | `var(--border-width-thin) solid var(--color-border-emphasis)` | Emphasized separation |
| `--border-accent` | `var(--border-width-medium) solid var(--color-action-primary)` | Active states, selected items |

---

## 6. Component Library

> **v2.1:** Components are no longer prose recipes. They ship as real CSS in `components/<name>/<name>.css`, documented in `components/<name>/README.md`, bundled into `components/membrane-components.css` and `membrane.css`. This section states the conventions; each README is the reference for its component, and its **API** section is generated from the CSS so it can't drift.

### 6.1 Using the library

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/idcesares/The-Membrane-Palette/membrane.css">
<!-- Needed for Tabs, Menu, Combobox and Toast; adds tooltip Escape and dialog fallbacks: -->
<script src="https://cdn.jsdelivr.net/gh/idcesares/The-Membrane-Palette/components/membrane.js" defer></script>
```

No framework, no build step for consumers; `tokens/base.css` (inside `membrane.css`) also sets zero-specificity page defaults — canvas, text color, body font, `box-sizing` — so a page needs no CSS of its own. Complete pages to copy live in `examples/` (§16.3).

**Tailwind v4 projects** import `tokens/membrane-tailwind.css` after Tailwind. It removes Tailwind's default palette and exposes the system as `mp-` utilities mapped onto the semantic tokens (`bg-mp-surface`, `text-mp-fg`, `bg-mp-primary hover:bg-mp-primary-hover`, `rounded-mp-lg`, `shadow-mp-raised`, `font-mp-display`, `text-mp-h2`), so utility-first code — including code generated by agents — can't drift off-brand. Spacing needs nothing: Tailwind's 0.25rem step is the system's 4px unit.

### 6.2 Conventions

| Concern | Convention | Example |
|---|---|---|
| Component | One root class, prefixed `mp-` | `.mp-button` |
| Parts | BEM element of the root | `.mp-card__title` |
| Options | `data-*` attribute with a closed set of values; omit for the default | `data-variant="secondary"`, `data-size="sm"`, `data-tone="human"` |
| States | Native attributes and ARIA — never a state class | `disabled`, `aria-invalid="true"`, `aria-current="page"`, `aria-selected="true"`, `aria-pressed="true"`, `aria-busy="true"`, `[open]` |
| Per-instance tuning | Tier 3 component tokens, `--mp-<component>-*` | `style="--mp-button-padding: var(--space-10)"` |
| Theming a subtree | `data-theme="dark"` (or `light`) + `.mp-surface` to paint the background | `<section class="mp-section mp-surface" data-theme="dark">` |
| Cascade | Everything in `@layer components`; unlayered CSS wins without `!important` | — |

**State via ARIA is the core accessibility rule of the library**: the visual state is keyed off the attribute assistive technology reads, so the two cannot disagree. Setting `aria-invalid="true"` is what turns an input's border red; setting `aria-current="page"` is what highlights a nav link.

### 6.3 Catalog

| Category | Components |
|---|---|
| Layout | [Layout](components/layout/README.md) (container, stack, cluster, grid, section, surface), [Text](components/text/README.md), [Prose](components/prose/README.md) |
| Actions | [Button](components/button/README.md), [Link](components/link/README.md) (incl. skip link) |
| Forms | [Field](components/field/README.md) (incl. fieldset), [Input](components/input/README.md) (input, textarea, select), [Combobox](components/combobox/README.md)<sup>β</sup>, [Choice](components/choice/README.md) (checkbox, radio), [Switch](components/switch/README.md) |
| Content | [Card](components/card/README.md), [Tag](components/tag/README.md), [Badge](components/badge/README.md), [Avatar](components/avatar/README.md), [Quote](components/quote/README.md), [Code](components/code/README.md), [Divider](components/divider/README.md), [Table](components/table/README.md), [Stat](components/stat/README.md), [Chart](components/chart/README.md)<sup>β</sup>, [Icon](components/icon/README.md) |
| Feedback | [Alert](components/alert/README.md), [Progress](components/progress/README.md) (incl. spinner), [Skeleton](components/skeleton/README.md), [Empty state](components/empty-state/README.md), [Toast](components/toast/README.md)<sup>β</sup>, [Tooltip](components/tooltip/README.md), [Dialog](components/dialog/README.md) |
| Navigation | [Navbar](components/navbar/README.md), [Breadcrumb](components/breadcrumb/README.md), [Tabs](components/tabs/README.md), [Accordion](components/accordion/README.md), [Pagination](components/pagination/README.md), [Steps](components/steps/README.md), [Menu](components/menu/README.md)<sup>β</sup> |

<sup>β</sup> Beta: newer components whose API may still grow. Removals and renames still follow the deprecation policy (§15). The build fails if this table or the README's misses a component or misstates its status.

### 6.4 Brand rules the components encode

1. **One terracotta action per view.** The default button is `--color-action-primary`; alternatives are `secondary` (teal outline) or `ghost`.
2. **Teal for controls and navigation.** Checked checkboxes, radios and switches, progress bars and links use the digital register, so they never compete with the primary action.
3. **Register tones.** Tags, badges, avatars, alerts and cards take `data-tone="human"` (terracotta family) or `data-tone="digital"` (teal family) to say which side of the membrane the content belongs to.
4. **Pills for actions and topics, soft rectangles for containers.** Buttons and tags use `--radius-full`; inputs `--radius-sm`; cards `--radius-lg`; dialogs `--radius-xl`.
5. **Code is always dark.** `.mp-code-block` uses the `--code-*` tokens in both modes.
6. **Fraunces for titles, never for UI chrome.** Card, dialog and stat titles are serif; buttons, labels, inputs and nav are Instrument Sans.

### 6.5 Contributing a component

1. Create `components/<name>/<name>.css` and `components/<name>/README.md` (frontmatter `name`, `category`, `status`, `summary`; an `## Examples` section with `### Title` + ` ```html ` blocks; `<!-- GENERATED:API -->` markers), and add `<name>` to `ORDER` in `scripts/build-components.mjs`.
2. Run `npm run build:components`. It **fails** if the CSS uses a raw color, an unknown or deprecated token, a Tier 1 primitive, or a custom property not named `--mp-*` — and if any README example uses a class, attribute or value the CSS doesn't implement, duplicates an `id`, or has an icon-only button without `aria-label`. It also fails if a class or `data-*` value the CSS implements is **never demonstrated** in an example — that is what guarantees the showcase renders every option. Token scales and runtime-only state can be exempted with an `exempt:` frontmatter line.
3. If the component needs a new color pairing, add a semantic token and a `GATE` entry in `scripts/build-tokens.mjs` so its contrast is verified in both modes.

## 7. Imagery & Illustration

### 7.1 Photography Style

Derived from the profile photo's qualities:

- **Lighting:** Natural, warm light. Avoid flash or cold studio lighting. Golden hour and soft daylight are ideal.
- **Warmth filter:** A subtle warm color grade. Slightly lifted shadows, gentle warmth in midtones. Never oversaturated.
- **Background:** Depth-of-field with natural/green backgrounds when possible. Blurred textures rather than solid backdrops.
- **Expression:** Confident, approachable, direct eye contact. Warm smile. Never stiff, never performing.
- **Composition:** Subject centered or slightly off-center. Clean framing. No excessive cropping.

**Photo treatment tokens:**
```css
--photo-warmth: sepia(0.05) saturate(1.05) brightness(1.02);
--photo-border-radius: var(--radius-lg);
--photo-shadow: var(--shadow-md);
```

### 7.2 Illustration Style

Inspired by Anthropic's hand-crafted doodle aesthetic, adapted for Isaac's brand:

- **Line quality:** Organic, slightly imperfect. Not geometric perfection. Single-weight line (2px) in `--color-neutral-700` or `--color-terracotta`.
- **Fill:** Minimal. When used, a single flat fill from the brand palette at reduced opacity.
- **Subject matter:** Abstract representations of translation, connection, bridges, neural patterns, growth/branching structures.
- **Complexity:** Simple enough to reproduce at small sizes. No more than 2 colors per illustration.
- **Usage:** Section dividers, empty states, loading states, background textures at very low opacity.

### 7.3 Iconography

- **Style:** Outlined, 1.5px stroke, rounded caps and joins.
- **Size grid:** 20px (inline), 24px (standard), 32px (feature), 48px (hero).
- **Color:** Inherits text color by default. Accent icons use terracotta or teal.
- **Source:** Use a consistent icon set Lucide — 24×24 stroke icons. `.mp-icon` draws with `stroke: currentColor` and no fill, so fill-based sets (Phosphor's default weights, Material) render blank; see the Icon README.

### 7.4 Data Visualization

Chart color is computed, not picked. `--color-chart-1` … `--color-chart-6` (terracotta, teal, amber, burgundy, steel blue, green) are one **validated categorical palette** with selected light and dark steps. Each step was searched within its brand hue and checked as a set: lightness band, chroma floor ≥ 0.10, color-blind separation between neighbors (worst ΔE 11.5, OKLab ×100, Machado protan/deutan simulation; target ≥ 8), normal-vision separation ≥ 16, and ≥ 3:1 against page and card surfaces in both modes (the last is enforced by the token gate).

| Job | Rule |
|---|---|
| **Identity** (which series) | Slots 1 → 6 in fixed order, never cycled; a 7th series folds into "Other" or becomes small multiples. Color follows the entity — filtering never repaints survivors. |
| **One series** | Slot 1 (terracotta), no legend; the title names it. Never color bars by value. |
| **Any-pair forms** (scatter, bubble, maps) | Max **2** series. Slots 1 and 3 collapse under deuteranopia when adjacent. |
| **Magnitude** | One hue, light → dark (a ramp of `--color-chart-2` teal via `color-mix()` toward `--color-bg-primary`). Never a rainbow. |
| **Polarity** | Terracotta ↔ neutral (`--color-border-emphasis`) ↔ teal — the membrane itself. |
| **State** (pass/fail, error rate) | Status tokens + an icon/label, never a chart slot. |

**Marks & anatomy:** thin marks — bars ~12px, 2px lines, ≥ 8px markers, 4px rounded data ends, a 2px surface gap between stacked segments. Gridlines `--color-border-default`, axis labels `--color-text-secondary` in Instrument Sans `--text-small`, values in `--color-text-primary` with tabular figures. One y-axis per chart. A legend whenever there are ≥ 2 series; direct labels on up to four. Text never wears the series color.

**Interaction & access:** plotted charts get a hover/focus tooltip and a table view; the `.mp-chart` bar list prints every value, so it needs neither. Headline numbers are a [Stat](components/stat/README.md), not a chart.

The HTML/CSS implementation is [`components/chart`](components/chart/README.md); for charting libraries, read the tokens with `getComputedStyle` or use `tokens/tokens.resolved.json`.

---

## 8. Motion & Interaction

### 8.1 Motion Principles

1. **Purposeful, not performative.** Every animation should communicate something: a state change, spatial relationship, or hierarchy. No animation for decoration.
2. **Warm pacing.** Slightly slower than typical tech-brand animations. The brand is not in a rush. Standard duration is `250ms`, not `150ms`.
3. **Ease with intention.** `ease-out` for elements entering (welcoming), `ease-in` for elements leaving (respectful exit), `ease-in-out` for state changes. Each has a composite token (§8.4) so components don't pick by hand.
4. **Exits are quicker than entrances.** Something the user dismissed should get out of the way: enter at `normal`, leave at `fast`.
5. **Small distances.** Movement accompanies a fade and stays within `--space-2` (8px); a lift is `2px`. Nothing slides across the screen.
6. **Cheap properties.** Animate `opacity`, `transform`/`translate`/`scale`/`rotate`, colors and `box-shadow`. Never `width`, `top`/`left` or `margin` — the one exception is the accordion's `block-size`, which only runs where the browser supports `interpolate-size`.

### 8.2 Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | `150ms` | Hover colors, state changes, every exit |
| `--duration-normal` | `250ms` | Entrances: dialogs, menus, toasts, tooltips, accordion panels |
| `--duration-slow` | `400ms` | Larger surfaces: card hover lift, section reveals |
| `--duration-slower` | `600ms` | Page-level changes: theme crossfade, view transitions. Stays `150ms` under reduced motion |
| `--duration-loop` | `1600ms` | One cycle of an indefinite loader (shimmer, indeterminate bar; the spinner turns at half this). **Not** reduced — loaders change *what* they animate instead |

### 8.3 Easing

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Hover and color transitions |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering view |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving view |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | State changes (toggles, tab indicators, chevrons), loaders |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | The switch thumb only. Overshoot reads as playful; don't spread it |

### 8.4 Transition Composites

Shorthand tokens combining duration and easing. Use them as the time part of a `transition`: `transition: opacity var(--transition-enter);`.

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `fast` + `ease-default` | Hover color changes |
| `--transition-default` | `normal` + `ease-default` | General transitions |
| `--transition-slow` | `slow` + `ease-default` | Larger surfaces |
| `--transition-enter` | `normal` + `ease-out` | Something appearing: put it on the open state (`[open]`, `:popover-open`) |
| `--transition-exit` | `fast` + `ease-in` | Something leaving: put it on the base (closed) state |
| `--transition-state` | `fast` + `ease-in-out` | A control changing state in place |

Because a transition runs with the timing of the state it is heading *to*, an overlay declares the exit timing on its base rule and the enter timing on its open rule — that is the whole enter/exit pattern:

```css
.mp-dialog {               /* closed: where an exit is heading */
  opacity: 0;
  transition: opacity var(--transition-exit),
              overlay var(--duration-fast) allow-discrete,
              display var(--duration-fast) allow-discrete;
}
.mp-dialog[open] {         /* open: where an entrance is heading */
  opacity: 1;
  transition: opacity var(--transition-enter),
              overlay var(--duration-normal) allow-discrete,
              display var(--duration-normal) allow-discrete;
}
@starting-style { .mp-dialog[open] { opacity: 0; } }  /* first frame of the entrance */
```

### 8.5 Component Recipes

| Component | Motion | Reduced motion |
|-----------|--------|----------------|
| Button | Color on hover (`fast`); `translateY(1px)` on press; busy spinner turns once per `loop / 2` | No press offset; busy spinner pulses |
| Card (`data-clickable`) | Shadow + border on hover; `-2px` lift | Shadow + border only |
| Link (`data-standalone`) | Arrow nudges `4px` on hover | Arrow stays |
| Checkbox / radio | Mark scales in (`state`) | Instant |
| Switch | Thumb slides on `ease-spring` | Instant |
| Tabs | Indicator color (`state`) | Instant |
| Accordion | Chevron rotates (`state`); panel height (`enter`, where supported) | Instant |
| Dialog | Fade + `8px` rise and backdrop fade: enter `normal`/`ease-out`, exit `fast`/`ease-in` | Instant |
| Menu | Fade + `4px` drop, same enter/exit split | Instant |
| Combobox | List fades + `4px` drop on open, quicker exit; chevron flips | Instant, no drop |
| Tooltip | Fade + `4px` shift in after a `fast` delay (so passing the pointer over doesn't flash it), out at `fast` | Instant |
| Toast | Fade + rise in; fade + fall out (`data-leaving`, set by `membrane.js`, removes after the exit) | Instant |
| Progress (indeterminate) | Bar sweeps once per `loop` | Bar holds in the middle and pulses |
| Spinner | Rotates once per `loop / 2` | Full ring that pulses |
| Skeleton | Shimmer sweeps once per `loop` | Solid shape that pulses |

**Hover is a pointer thing.** Hover-only effects (button fills, card lift) sit inside `@media (hover: hover)` so a tap on a touch screen doesn't leave them stuck on. Focus styles never depend on hover.

**Loading thresholds.** Show nothing for waits under ~300ms; a spinner (or `aria-busy` on the button) for short waits with no known shape; skeletons when the layout of the incoming content is known; a determinate `<progress>` whenever progress is measurable. A loader that appears should stay at least ~500ms so it doesn't flicker.

### 8.6 Reduced Motion

**Always respect `prefers-reduced-motion`.** Reduced means *reduce*, not *remove*: state still has to be visible, and a loader must never freeze on a frame that looks finished. When the preference is set:

- **Tokens:** `fast`, `normal`, `slow` and every `--transition-*` composite resolve to `0ms`. `--duration-slower` drops to `150ms` for essential feedback. `--duration-loop` is unchanged.
- **Library components** (anything with an `mp-` class) handle it themselves, per the table in §8.5: movement — lifts, nudges, press offsets, sweeps, rotation — is removed, and loaders switch to an in-place opacity pulse.
- **Everything else** gets a safety net in `base.css`: animations run once in ~0ms and transitions are restricted to `opacity`, `color`, `background-color`, `border-color` and `box-shadow`. Library elements are excluded so their pulses keep running.
- `scroll-behavior` falls back to `auto`.
- Don't add parallax, scroll-triggered transforms or auto-playing sequences. If a product needs one, gate it behind `@media (prefers-reduced-motion: no-preference)` rather than adding it unconditionally and undoing it later.

### 8.7 Page Transitions

The library doesn't animate navigation. Pages that want a soft change can opt in to the browser's View Transitions with the tokens:

```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: var(--duration-slower);
    animation-timing-function: var(--ease-in-out);
  }
}
```

For in-page changes (the showcase's theme switch), wrap the DOM update in `document.startViewTransition(update)` when it exists and reduced motion is off; call `update()` directly otherwise.

### 8.8 Other User Preferences

- **`prefers-contrast: more`:** secondary text becomes primary, tertiary text darkens, default borders take the emphasis color, input borders strengthen, and the focus ring thickens to `--border-width-thick`.
- **`forced-colors: active`:** components fall back to system colors; custom-drawn checkboxes and radios hand back to the platform control.
- **Print:** `base.css` forces the light scheme and drops the page background; the navbar, skip link and toast region are hidden; component colors print exactly (`print-color-adjust: exact`); `mp-prose` prints the target of every external link after its text.

---

## 9. Voice Integration — Visual ↔ Verbal Alignment

The design system and the brand voice are inseparable. Here is how the visual language reinforces the voice principles:

| Voice Principle | Visual Expression |
|----------------|-------------------|
| Articulate — ideas expressed with care | Generous whitespace, deliberate hierarchy, no visual clutter |
| Warm — there is a person here | Warm neutrals, terracotta accents, natural photography, hand-crafted illustration touches |
| Concrete — abstraction grounded in example | Data visualizations, real photography (not stock), code examples as first-class citizens |
| Confident without arrogance | Restrained palette (not flashy), quality typography (not loud), subtle motion (not theatrical) |
| Brazilian in texture | Warm color temperature throughout, generous/hospitable spacing, earth and ocean tones |
| Layered — works for multiple audiences | Clear typographic hierarchy, progressive disclosure, content density that rewards attention |

---

## 10. Brand Marks & Logo Usage

### 10.1 Wordmark

The primary brand mark is the **typographic wordmark**: `Isaac D'Césares` set in **Fraunces, weight 700, with WONK=1**.

The apostrophe in D'Césares is a critical brand element. It must always be rendered — never simplified to "DCesares" or "D Cesares."

**Wordmark variations:**
| Variant | Usage |
|---------|-------|
| `Isaac D'Césares` | Full formal (presentations, articles, institutional) |
| `D'Césares` | Compact formal (footer sign-off, watermark, co-branded headers; see §10.6) |
| `idcesares` | Digital/developer contexts (GitHub, terminal, social handles) |
| `dc` | Monogram: site navigation, favicon, avatars (Fraunces 700: terracotta `d` + teal `c` on cream, or cream on charcoal; see §10.3 and §10.6) |

### 10.2 Monogram

A two-letter monogram `dc` set in Fraunces Bold, lowercase, with tight tracking (`-0.05em`). The `d` is in `--color-terracotta` and the `c` is in `--color-teal`, representing the two registers meeting.

**Monogram usage:**
- Site navigation: the brand link in `.mp-navbar` on the owner's own sites (§10.6)
- Favicon (16×16, 32×32, with solid background)
- Social media avatar (circular crop, on cream background)
- Watermark on slide decks (bottom-right, 30% opacity)
- App icon contexts

### 10.3 Files

The marks are outlined SVGs in `brand/` (generated by `scripts/render-brand-marks.py` from Fraunces 700, `WONK` 1, HarfBuzz-kerned). They need no font, and their viewBox is the ink bounds, so add clear space (§10.4) yourself. Download them from the showcase's Brand marks section or the CDN (`…/The-Membrane-Palette/brand/<file>`).

| File | Mark | Use on |
|------|------|--------|
| `idcesares-logo-wordmark-primary.svg` | Isaac D’Césares, charcoal | Cream / light surfaces |
| `idcesares-logo-wordmark-reversed.svg` | Isaac D’Césares, cream | Charcoal, teal, terracotta |
| `idcesares-logo-compact-primary.svg` / `-reversed.svg` | D’Césares | Footers, watermarks, co-branded headers |
| `idcesares-logo-monogram-primary.svg` | `dc`, terracotta + teal | Site navigation; light surfaces |
| `idcesares-logo-monogram-reversed.svg` | `dc`, cream | Dark surfaces |
| `idcesares-icon-monogram-light.svg` / `-dark.svg` | `dc` on a rounded cream / charcoal square | Favicon, avatars, app icons |

The site's `apple-touch-icon` (`showcase/assets/idcesares-icon-monogram-touch.png`, 180×180, full bleed) is rendered from the monogram by `npm run render:social`. The wordmarks use the typographic apostrophe (’), which is the glyph the brand rule in §10.1 protects.

### 10.4 Clear Space

Minimum clear space around any brand mark = the height of the lowercase `d` in the wordmark. This ensures the mark always breathes.

### 10.5 Color Combinations

| Context | Mark Color | Background |
|---------|-----------|------------|
| Light default | `--color-charcoal` | `--color-cream` |
| Dark default | `--color-cream` | `--color-charcoal` |
| Accent | `--color-cream` | `--color-terracotta` |
| Digital | `--color-cream` | `--color-teal` |
| Monochrome | `--color-neutral-700` | Light paper or single-color print (on screen, cream — never pure white) |

### 10.6 Marks in Interfaces

**The navbar carries the monogram.** On Isaac's own sites the `.mp-navbar__brand` link is the `dc` monogram, not a wordmark:

- It is the only mark that shows both registers, so the header states the membrane before any content does.
- It is the mark already in the browser tab (the favicon), so tab and page agree.
- Pages open with the person's name in the hero or title; a wordmark in the bar above would repeat it.
- It is narrow, which leaves the narrow navbar (§6, Navbar) room for its actions.

**The name signs off in the footer** with the compact wordmark (`D'Césares`), so a reader who arrived on an inner page still reads it before leaving.

**Use the compact wordmark in the navbar instead** when the monogram alone can't identify the owner: co-branded or institutional headers, third-party platforms, and any page without a footer.

**In code:**

- Inline the SVG from `brand/` rather than using `<img>`, so the mark follows the theme. Fill the `d` with `--color-action-primary` and the `c` with `--color-action-secondary`: both retheme in dark mode (terracotta-light and teal-light on charcoal), so no reversed file is needed. A one-color wordmark takes `currentColor`.
- The mark is decorative inside a labelled link: `aria-hidden="true"` on the SVG and the full name on the link, e.g. `<a class="mp-navbar__brand" href="/" aria-label="D'Césares, página inicial">`.
- Size by height: about `2rem` for the monogram and `1.5rem` for the compact wordmark in the navbar, never smaller than the 24px it needs to stay legible.

---

## 11. Application Guidelines

### 11.1 Website (dcesares.dev)

- **Primary canvas:** Light mode (warm cream) as default, with dark mode support.
- **Header:** `.mp-navbar` with the `dc` monogram as its brand (§10.6); the compact wordmark signs the footer.
- **Hero section:** Large Fraunces display heading, Instrument Sans body, profile photo with warm filter, terracotta primary CTA.
- **Section backgrounds:** Alternate between `--color-bg-primary` and `--color-bg-secondary` (`.mp-section[data-tone="secondary"]`) to create rhythm without borders.
- **Use `--gradient-warmth`** as a subtle ambient glow on key sections.
- **Code samples** always in dark code blocks, even on light pages.
- **Blog posts:** `--container-sm` width (640px max), Fraunces headings, Instrument Sans body, generous line height.

### 11.2 Social Media

**LinkedIn / Professional:**
- Cards/carousels: Cream background, charcoal text, terracotta accent.
- Pull quotes in Fraunces italic over cream or soft terracotta wash.
- Profile banner: Subtle membrane gradient or textured cream with wordmark.
- Tone: More formal Fraunces, restrained palette.

**Instagram / Visual:**
- Square cards (1080×1080): Cream or charcoal backgrounds with centered type.
- Photo posts: Apply `--photo-warmth` filter for consistency.
- Carousel covers: Fraunces display heading, terracotta accent, minimal.
- Story accents: Terracotta and teal pill-shaped text containers.

**GitHub / Developer:**
- Monospace-forward. JetBrains Mono for key information.
- Teal as primary accent (digital register).
- README headers in the brand's typographic voice.
- Badges in brand colors (terracotta, teal, sage).

**Presentations / Slides:**
- Title slides: Charcoal background, cream text, Fraunces display heading, terracotta rule below.
- Content slides: Cream background, charcoal text, generous margins.
- Code slides: Dark code block styling with syntax highlighting.
- Section dividers: Full-bleed terracotta or teal with cream text.
- Never more than 30 words per slide. Let the typography and spacing work.

### 11.3 Email & Documents

- **Headings:** Fraunces (or Georgia as fallback for email clients)
- **Body:** Instrument Sans (or Helvetica Neue as fallback)
- **Color in emails:** the same rule as on screen (§2.4): links are teal `#1B756D`, and the one call to action per email is a terracotta `#B35530` button. Two terracotta elements would compete, exactly as two primary buttons would.
- **Email signature:** Name in semibold, title in regular weight, `dcesares.dev` as a teal link.

### 11.4 AI Agent Configuration

When configuring AI agents (Claude, GPT, or custom) to produce content on behalf of the brand:

```
VISUAL CONSTRAINTS:
- Color palette: Terracotta (#B35530), Deep Teal (#1B756D), Warm Cream (#FAF6EE), Rich Charcoal (#1A1B1F)
- Accent colors (sparingly): Amber (#D49A3A), Burgundy (#7A3345), Sage (#5A8A6E)
- Never use pure white or pure black
- Primary accent is always terracotta; secondary is teal

TYPOGRAPHY CONSTRAINTS:
- Headlines: Fraunces (serif, warm, characterful)
- Body: Instrument Sans (clean, precise)
- Code: JetBrains Mono
- Maximum body text width: 65 characters per line

UI CONSTRAINTS (when generating HTML/CSS):
- Load membrane.css (fonts included: never add a Google Fonts link); build from mp- components and layout primitives before writing CSS
- Load components/membrane.js when using Tabs, Menu, Combobox or Toast
- Options are data-* attributes; use only values listed in components/manifest.json
- States come from HTML/ARIA (disabled, aria-invalid, aria-current, aria-selected, aria-pressed, aria-busy, [open]), never classes
- Custom CSS uses semantic tokens only (--color-text-*, --color-bg-*, --color-action-*, --space-*, --text-*)
- At most one primary (terracotta) button per view

VERBAL AUTHORITY:
- PROFILE.md decides what is true about Isaac
- VOICE.md decides how Isaac naturally communicates and adapts by register
- BRAND-VOICE.md decides how that voice is expressed publicly
- Never infer biography from a writing or UI example

VOICE CONSTRAINTS:
- Human, reflective, precise, contextual and concrete
- Be as certain as the evidence allows; useful hedging is allowed
- Avoid hype, abstraction without a referent and credential inflation
- Adapt the register to the audience instead of forcing every text to sound branded
- Buttons normally name the concrete action; “Let's co-create” / “Vamos cocriar?” is optional campaign copy only when the action is genuinely collaborative
```

---

## 12. Dark Mode Specification

Dark mode is not an afterthought — it is an equal expression of the brand. The membrane metaphor holds: warm accents on cool-dark surfaces create a compelling visual tension.

### 12.0 Implementation (v2.0)

Dark mode is implemented entirely via `light-dark()` on each semantic token — there are no override blocks or media query duplication. The token file sets:

```css
:root { color-scheme: light dark; }
[data-theme="dark"],  .theme-dark { color-scheme: dark; }
[data-theme="light"] { color-scheme: light; }
```

Every semantic token declares its own pair:

```css
--color-bg-primary:     light-dark(var(--color-cream), var(--color-charcoal));
--color-action-primary: light-dark(var(--color-terracotta), var(--color-terracotta-light));
--color-focus:          light-dark(var(--color-teal), var(--color-teal-light));
```

Primitives are immutable in both modes. **Never redefine a primitive inside a theme override block.**


### 12.1 Dark Mode Color Mapping

| Role | Light Mode | Dark Mode |
|------|-----------|-----------|
| Background primary | `#FAF6EE` | `#1A1B1F` |
| Background secondary | `#F0EBE1` | `#242429` |
| Background tertiary | `#E2DCD2` | `#2E2E34` |
| Text primary | `#2A2622` | `#F0EBE1` |
| Text secondary | `#5C564E` | `#A39D93` |
| Text tertiary | `#6E685F` | `#938D83` |
| Border default | `#E2DCD2` | `#3D3842` |
| Terracotta | `#B35530` | `#D4724F` (lightened for contrast) |
| Teal | `#1B756D` | `#3AAFA8` (lightened for contrast) |
| Amber | `#D49A3A` | `#E8B44A` |
| Sage | `#5A8A6E` | `#6FBF8A` |
> **Note:** Terracotta now properly lightens in dark mode via `var(--color-terracotta-light)` to maintain sufficient contrast with dark backgrounds while preserving the warmth principle.

### 12.2 Dark Mode Rules

1. **Accent colors lighten in dark mode** via each semantic token's `light-dark()` pair, to maintain WCAG AA contrast ratios (verified by the build's contrast gate — see §13.1).
2. **Shadows deepen** in dark mode — each `--shadow-*` token carries its own darker, higher-opacity value via `light-dark()` (see §5.2). Cards do **not** swap to a border-only treatment in dark mode: `--border-default` is already present on cards in both modes (Card README), so no separate dark-only mechanism is needed. *(v1.1 described a border-instead-of-shadow swap here; it was never implemented and was redundant with the always-on card border, so the claim has been retired rather than built.)*
3. **The membrane gradient remains the same direction** (terracotta → teal) but both endpoints lighten via `light-dark()` on `--gradient-membrane`.
4. **Ambient glow stop-colors shift brighter** so background texture remains perceptible on dark surfaces.
5. **Manual toggles use `[data-theme="dark"|"light"]`.** The legacy `.theme-dark` class still works but is **deprecated** (removal in v3.0.0): two switches for one state make generated code inconsistent. Either simply sets `color-scheme: dark`; every semantic token's `light-dark()` pair does the rest.
6. **Photos may receive a subtle `brightness(0.92)` filter** in dark mode to prevent them from blowing out against dark surfaces. The factor is available as `--photo-dim-dark` (a plain number, e.g. `filter: brightness(var(--photo-dim-dark))`); it is not applied automatically since photo treatment is author-controlled per image, not a global rule.

---

## 13. Accessibility

> The design system now enforces accessibility at the build level — see §13.1 for the automated contrast gate. The rules below are design intent; the gate is what makes them non-negotiable.



### 13.1 Contrast Requirements

All text must meet **WCAG AA minimum** (4.5:1 for body text, 3:1 for large text and UI components). Target **AAA** (7:1 / 4.5:1) where possible.

> **Enforcement:** `npm run build:tokens` verifies every pair below in both light and dark mode before writing CSS output, and aborts if any pair regresses. v2.1 extended the gate from 20 pairs to cover hover fills, status and register washes (over page and card surfaces), inverse and elevated surfaces, form-control boundaries (1.4.11), chart series and every code syntax color.

Every pair below is verified by the build in both modes; a translucent background (a `-bg` tint) is composited over `--color-bg-primary` first. This table is generated by `npm run build:tokens` — edit the `GATE` list in `scripts/build-tokens.mjs`, not this table.

<!-- GENERATED:CONTRAST-TABLE -->
| Foreground | Background | Light | Dark | Min | Use |
|---|---|---|---|---|---|
| `--color-text-primary` | `--color-bg-primary` | 13.93 | 14.48 | 7.0 | body text, AAA target |
| `--color-text-primary` | `--color-bg-secondary` | 12.64 | 13.00 | 7.0 | body text on cards |
| `--color-text-primary` | `--color-bg-elevated` | 13.93 | 12.50 | 7.0 | body text in dialogs/popovers |
| `--color-text-primary` | `--color-bg-active` | 11.52 | 11.12 | 7.0 | selected rows/items |
| `--color-text-secondary` | `--color-bg-primary` | 6.73 | 6.39 | 4.5 | supporting text |
| `--color-text-secondary` | `--color-bg-secondary` | 6.10 | 5.74 | 4.5 | supporting text on cards |
| `--color-text-secondary` | `--color-bg-tertiary` | 5.32 | 5.01 | 4.5 | neutral tags |
| `--color-text-secondary` | `--color-bg-elevated` | 6.73 | 5.52 | 4.5 | supporting text in dialogs |
| `--color-text-secondary` | `--color-bg-hover` | 6.04 | 5.53 | 4.5 | hovered nav links / ghost buttons |
| `--color-text-tertiary` | `--color-bg-primary` | 5.12 | 5.23 | 4.5 | metadata/placeholder |
| `--color-text-tertiary` | `--color-bg-secondary` | 4.64 | 4.69 | 4.5 | metadata on cards |
| `--color-text-tertiary` | `--color-bg-elevated` | 5.12 | 4.51 | 4.5 | metadata in dialogs |
| `--color-text-accent` | `--color-bg-primary` | 5.11 | 6.45 | 4.5 | links |
| `--color-text-accent` | `--color-bg-secondary` | 4.64 | 5.79 | 4.5 | links on cards |
| `--color-text-inverse` | `--color-bg-inverse` | 12.64 | 12.64 | 4.5 | tooltips |
| `--color-text-on-accent` | `--color-action-primary` | 4.93 | 5.18 | 4.5 | primary button label |
| `--color-text-on-accent` | `--color-action-primary-hover` | 5.92 | 6.22 | 4.5 | primary button label, hover |
| `--color-text-on-accent` | `--color-action-secondary` | 5.51 | 6.45 | 4.5 | secondary button label, hover fill |
| `--color-text-on-accent` | `--color-action-secondary-hover` | 6.51 | 7.44 | 4.5 | checked controls, pressed secondary |
| `--color-text-on-accent` | `--color-error` | 5.05 | 5.14 | 4.5 | danger button label |
| `--color-text-on-accent` | `--color-error-hover` | 6.06 | 6.19 | 4.5 | danger button label, hover |
| `--color-action-primary` | `--color-bg-primary` | 4.57 | 5.18 | 3.0 | primary action affordance |
| `--color-action-secondary` | `--color-bg-primary` | 5.11 | 6.45 | 3.0 | secondary action affordance |
| `--color-action-secondary` | `--color-bg-secondary` | 4.64 | 5.79 | 3.0 | secondary action on cards |
| `--color-action-secondary` | `--color-bg-tertiary` | 4.04 | 5.06 | 3.0 | progress value vs track |
| `--color-border-input` | `--color-bg-primary` | 4.11 | 3.88 | 3.0 | form control boundary |
| `--color-border-input` | `--color-bg-secondary` | 3.73 | 3.48 | 3.0 | form control boundary on cards |
| `--color-border-input` | `--color-bg-elevated` | 4.11 | 3.35 | 3.0 | form control boundary in dialogs |
| `--color-focus` | `--color-bg-primary` | 5.11 | 6.45 | 3.0 | focus ring (WCAG 1.4.11) |
| `--color-focus` | `--color-bg-secondary` | 4.64 | 5.79 | 3.0 | focus ring on cards |
| `--color-focus` | `--color-bg-elevated` | 5.11 | 5.57 | 3.0 | focus ring in dialogs |
| `--color-human-text` | `--color-bg-primary` | 6.26 | 6.57 | 4.5 | human-register text |
| `--color-human-text` | `--color-bg-secondary` | 5.68 | 5.89 | 4.5 | human-register text on cards |
| `--color-human-text` | `--color-human-bg` | 5.51 | 5.77 | 4.5 | human tag / callout |
| `--color-human-text` | `--color-human-bg` | 5.02 | 5.15 | 4.5 | human tag on a card |
| `--color-digital-text` | `--color-bg-primary` | 7.23 | 6.45 | 4.5 | digital-register text |
| `--color-digital-text` | `--color-bg-secondary` | 6.56 | 5.79 | 4.5 | digital-register text on cards |
| `--color-digital-text` | `--color-digital-bg` | 6.32 | 5.54 | 4.5 | digital tag / callout |
| `--color-digital-text` | `--color-digital-bg` | 5.76 | 4.95 | 4.5 | digital tag on a card |
| `--color-success` | `--color-bg-primary` | 3.68 | 7.78 | 3.0 | success icon/fill |
| `--color-success-text` | `--color-bg-primary` | 5.68 | 7.78 | 4.5 | success text |
| `--color-success-text` | `--color-bg-secondary` | 5.15 | 6.98 | 4.5 | success text on cards |
| `--color-success-text` | `--color-success-bg` | 5.09 | 6.55 | 4.5 | success alert/badge |
| `--color-success-text` | `--color-success-bg` | 4.65 | 5.77 | 4.5 | success badge on a card |
| `--color-warning-text` | `--color-bg-primary` | 6.08 | 9.06 | 4.5 | warning text |
| `--color-warning-text` | `--color-bg-secondary` | 5.51 | 8.13 | 4.5 | warning text on cards |
| `--color-warning-text` | `--color-warning-bg` | 5.63 | 7.49 | 4.5 | warning alert/badge |
| `--color-warning-text` | `--color-warning-bg` | 5.15 | 6.66 | 4.5 | warning badge on a card |
| `--color-error` | `--color-bg-primary` | 4.69 | 5.14 | 3.0 | error icon/fill, invalid border |
| `--color-error-text` | `--color-bg-primary` | 6.20 | 6.44 | 4.5 | error text |
| `--color-error-text` | `--color-bg-secondary` | 5.63 | 5.78 | 4.5 | error text on cards |
| `--color-error-text` | `--color-error-bg` | 5.42 | 5.70 | 4.5 | error alert/badge |
| `--color-error-text` | `--color-error-bg` | 4.94 | 5.10 | 4.5 | error badge on a card |
| `--color-info-text` | `--color-bg-primary` | 7.23 | 6.45 | 4.5 | info text |
| `--color-info-text` | `--color-info-bg` | 6.32 | 5.54 | 4.5 | info alert/badge |
| `--color-info-text` | `--color-info-bg` | 5.76 | 4.95 | 4.5 | info badge on a card |
| `--color-success-text` | `--color-bg-elevated` | 5.68 | 6.71 | 4.5 | success toast title |
| `--color-warning-text` | `--color-bg-elevated` | 6.08 | 7.82 | 4.5 | warning toast title |
| `--color-error-text` | `--color-bg-elevated` | 6.20 | 5.56 | 4.5 | error toast title, danger menu item |
| `--color-text-primary` | `--color-bg-hover` | 11.31 | 11.06 | 7.0 | hovered rows on a card |
| `--color-text-primary` | `--color-bg-active` | 11.52 | 9.39 | 7.0 | active combobox option (popup) |
| `--color-text-secondary` | `--color-bg-elevated` | 6.73 | 5.52 | 4.5 | combobox empty message, menu labels |
| `--color-focus` | `--color-bg-active` | 4.23 | 4.18 | 3.0 | active-option marker (popup) |
| `--color-chart-1` | `--color-bg-primary` | 4.57 | 5.18 | 3.0 | chart series 1 on page |
| `--color-chart-1` | `--color-bg-secondary` | 4.15 | 4.65 | 3.0 | chart series 1 on a card |
| `--color-chart-2` | `--color-bg-primary` | 3.61 | 5.87 | 3.0 | chart series 2 on page |
| `--color-chart-2` | `--color-bg-secondary` | 3.27 | 5.27 | 3.0 | chart series 2 on a card |
| `--color-chart-3` | `--color-bg-primary` | 3.86 | 5.46 | 3.0 | chart series 3 on page |
| `--color-chart-3` | `--color-bg-secondary` | 3.50 | 4.91 | 3.0 | chart series 3 on a card |
| `--color-chart-4` | `--color-bg-primary` | 6.00 | 3.57 | 3.0 | chart series 4 on page |
| `--color-chart-4` | `--color-bg-secondary` | 5.44 | 3.21 | 3.0 | chart series 4 on a card |
| `--color-chart-5` | `--color-bg-primary` | 3.80 | 5.58 | 3.0 | chart series 5 on page |
| `--color-chart-5` | `--color-bg-secondary` | 3.45 | 5.01 | 3.0 | chart series 5 on a card |
| `--color-chart-6` | `--color-bg-primary` | 3.62 | 4.65 | 3.0 | chart series 6 on page |
| `--color-chart-6` | `--color-bg-secondary` | 3.29 | 4.18 | 3.0 | chart series 6 on a card |
| `--code-text` | `--code-bg` | 12.04 | 12.04 | 4.5 | code text |
| `--code-keyword` | `--code-bg` | 5.16 | 5.16 | 4.5 | syntax: keyword |
| `--code-string` | `--code-bg` | 7.95 | 7.95 | 4.5 | syntax: string |
| `--code-function` | `--code-bg` | 8.64 | 8.64 | 4.5 | syntax: function |
| `--code-comment` | `--code-bg` | 5.11 | 5.11 | 4.5 | syntax: comment |
| `--code-number` | `--code-bg` | 8.18 | 8.18 | 4.5 | syntax: number |
<!-- /GENERATED:CONTRAST-TABLE -->

### 13.2 Focus States

| Token | Value |
|-------|-------|
| `--focus-ring` | `var(--border-width-medium) solid var(--color-focus)` |
| `--focus-ring-offset` | `2px` |

`--color-focus` is a dedicated semantic token, distinct from `--color-action-secondary`, so the ring's contrast can be tuned independently of the teal action color — its dark-mode value maps to `--color-teal-light` specifically because raw `--color-teal` measured 3.1:1 on charcoal: technically at the 3:1 WCAG 1.4.11 minimum, with no margin for rendering differences. See §13.1 for the verified ratio.

Focus states use the following properties:

```
Outline:        var(--focus-ring)
Outline-offset: var(--focus-ring-offset)
Border-radius:  matches element's border-radius
```

Never remove focus outlines. They are a feature, not a flaw.

### 13.3 Touch Targets

Target size: **44×44px** (`--size-touch-target`, WCAG 2.5.5 AAA) for buttons, inputs, tabs and nav links; never below **24×24px** (WCAG 2.5.8 AA) for anything interactive.

Control heights come from `--size-control-sm` (36px), `--size-control-md` (44px) and `--size-control-lg` (52px). The compact size exists for dense, pointer-driven UI. Under `@media (pointer: coarse)` every compact control grows back to the 44px `--size-touch-target`: small buttons and inputs, pill tabs, menu items, combobox options and the toast close button (tested in `tests/motion.spec.mjs`).

### 13.4 Component accessibility

- **State via ARIA** (§6.2): every visual state is keyed off the semantic attribute, so it is also announced.
- **Focus** is a 2px `--focus-ring` with a 2px offset on every interactive part. Components that live inside scroll containers (tabs, accordion summaries) draw it inset so it isn't clipped.
- **Forced colors:** custom-drawn controls (checkbox, radio, switch, select chevron) hand rendering back to the platform under `forced-colors: active`; buttons keep a transparent border that High Contrast mode paints.
- **Native first:** dialogs use `<dialog>` + `showModal()`, menus use `popover`, accordions use `<details>`, progress uses `<progress>` — focus trapping, keyboard handling and announcements come from the browser.
- **Tested, not asserted:** `npm test` runs axe-core on the showcase and every pattern page in both themes, checks phone-width overflow, and drives the keyboard patterns (tabs, dialog, tooltip, menu, combobox, toast, skip link) in Chromium, Firefox and WebKit on every CI run, and compares every gallery example with a visual baseline.

---

## 14. File & Asset Naming

Consistent naming across all brand assets:

```
Pattern:  idcesares-{type}-{descriptor}-{variant}.{ext}
Examples:
  idcesares-logo-monogram-primary.svg   (brand/, §10.3)
  idcesares-icon-monogram-dark.svg
  idcesares-photo-profile-2026.jpg
  idcesares-card-linkedin-dark.png
  idcesares-slide-title-charcoal.pptx
```

**Color and mode suffixes:** `-primary` (default colors), `-reversed` (for dark backgrounds), `-light`, `-dark`, `-cream`, `-charcoal`
**Size suffixes:** `-sm`, `-md`, `-lg`, `-xl`, `-2x`, `-3x`
**Platform suffixes:** `-linkedin`, `-instagram`, `-github`, `-web`

---

## 15. Design Token Summary

All tokens are generated from `tokens/membrane.tokens.json` into `tokens/design-tokens.css` and `tokens/base.css`, plus a Tailwind v4 theme and a resolved-value JSON. Fonts come from `fonts/fonts.json` into `fonts/fonts.css`.

```
tokens/
├── membrane.tokens.json   ← Source of truth (DTCG-flavored JSON — edit this)
├── design-tokens.css      ← Generated: @layer tokens — pure custom properties
├── base.css               ← Generated: @layer base — element rules (optional)
├── membrane-tailwind.css  ← Generated: Tailwind v4 theme (mp- utilities)
└── tokens.resolved.json   ← Generated: every token's light/dark value as hex
```

### Token architecture

Three tiers:
- **Tier 1 — Primitives:** raw values, immutable across modes. (`--color-terracotta`, `--color-neutral-*`, etc.)
- **Tier 2 — Semantics:** intent-named, carry their own `light-dark()` pair. (**Consume these in components.**)
- **Tier 3 — Component tokens:** `--mp-<component>-*` custom properties declared inside each component's CSS (e.g. `--mp-button-bg`), defaulting to semantic tokens. Override them on an instance; they are listed in each README's generated API section and in `components/manifest.json`.

### Token naming convention: `--{category}-{property}-{variant}`

```
--color-terracotta          (color, primitive)
--color-action-primary      (color, semantic)
--color-text-tertiary       (color, semantic)
--color-success-text        (color, semantic)
--color-warning-text        (color, semantic)
--text-h1                   (typography, scale)
--weight-semibold           (typography, weight)
--space-8                   (spacing, scale)
--size-touch-target         (size, fixed — v2.0)
--size-nav                  (size, fixed — v2.0)
--border-width-thick        (border, width — v2.0)
--radius-md                 (border-radius, scale)
--elevation-modal           (shadow, semantic — v2.0)
--color-human-bg            (color, semantic wash — v2.1)
--color-action-primary-hover (color, semantic mix — v2.1)
--size-control-md           (size, control height — v2.1)
--measure                   (layout, line length — v2.1)
--mp-button-bg              (component token, Tier 3 — v2.1)
--z-nav                     (z-index, layer)
--state-disabled-opacity    (interaction, state — v2.0)
--opacity-subtle            (opacity, scale)
--shadow-md                 (shadow, scale)
--duration-normal           (motion, scale)
--ease-out                  (motion, easing)
--transition-default        (motion, composite)
--focus-ring                (accessibility, focus)
--blur-backdrop             (blur, scale — v2.0)
--code-bg                   (code block, color)
```

### Naming note

Numeric suffixes mean different things in different categories — `--color-neutral-100` is a lightness step; `--color-terracotta-10` is an alpha wash (10% opacity). This is a known inconsistency preserved for backwards compatibility. New washes use an explicit role suffix instead of a number (`--color-human-bg`, `--color-success-bg`), and pair with a `-text` token of the same family.

### Token lifecycle & deprecation policy

Tokens are a public API — renaming or removing one is a breaking change for every consumer who imported `tokens/design-tokens.css`. This system follows the semantic-versioning discipline already stated at the top of `CHANGELOG.md` (breaking token renames or removals increment the major version), with a concrete process for the deprecation window in between:

1. **Mark, don't remove.** When a token is superseded, add `"$deprecated": "<reason and replacement>"` to its entry in `tokens/membrane.tokens.json` rather than deleting it. Example:
   ```json
   "old-token": { "$type": "color", "$value": "...", "$deprecated": "Use --color-action-primary instead." }
   ```
2. **The build surfaces it automatically.** `scripts/build-tokens.mjs` emits an `/* @deprecated ... */` comment directly above the token's declaration in the generated CSS, and prints a summary of every deprecated token still in the source at the end of every `npm run build:tokens` run (and therefore in every CI log — see `.github/workflows/ci.yml`). A deprecated token is never silently forgotten.
3. **One full major version of overlap, minimum.** A token marked deprecated in `v2.x` is not deleted before `v3.0.0`. This gives consumers a real window to migrate, discoverable by grepping their own CSS for the token name against the CHANGELOG's migration notes.
4. **Removal happens in the CHANGELOG's "Removed" section**, with the same token name and the version it was first deprecated in, so the history stays traceable — mirroring the removed-token entries already in this CHANGELOG (see `--state-hover-opacity`/`--state-pressed-opacity` for the pre-1.0 precedent of removing something that was never actually adopted, versus a true deprecation-then-removal cycle for something consumers may already depend on).
5. **This does not apply to pre-release churn.** Tokens added and removed within the same unreleased version (as happened during the v2.0 rebuild in this document's history) are not deprecations — nothing shipped, so there's nothing to migrate away from.

---

## 16. Content, Localization & Patterns

The components carry the visual brand; the words carry the voice. Interface copy follows `VOICE.md` for writing behavior, `BRAND-VOICE.md` for public-brand application, and `PROFILE.md` whenever copy makes a claim about Isaac.

### 16.1 Interface writing

| Element | Rule | Do | Don't |
|---|---|---|---|
| Buttons | A verb for what happens, ≤ 3 words. Name the concrete action; campaign language is exceptional. | "Save draft", "Start workshop" | "OK", "Submit", "Click here" |
| Links | Say where they go; make sense out of context. | "Read the case study" | "Learn more", "here" |
| Errors | What happened → why (if known) → how to fix. No blame, no codes alone. | "Handles can't contain spaces — try 'idcesares'." | "Invalid input", "Error 422" |
| Empty states | What this place is for → why it's empty → one next action. | "Your reading list starts here…" | "No data", "Nothing to see here 🙃" |
| Confirmations | Name the consequence, then two specific choices. | "Publish this workshop?" · "Publish" / "Not yet" | "Are you sure?" · "Yes" / "No" |
| Toasts | Past tense, what was done. | "Draft saved" | "Success!" |
| Labels | Sentence case, nouns, no colons. Overlines/badges are the only uppercase. | "Email address" | "EMAIL ADDRESS:" |

Avoid hype, credential inflation and abstraction without a referent in UI copy. Ordinary professional vocabulary is valid when it names something specific; see `VOICE.md`.

### 16.2 Localization (pt-BR and beyond)

- **Set `lang`.** `<html lang="en">` or `lang="pt-BR"`; mark inline phrases in the other language: `<span lang="pt-BR">Vamos cocriar?</span>` so screen readers switch pronunciation.
- **Budget for expansion.** Portuguese runs 20–30% longer than English. Components wrap or reflow by design (clusters wrap, grids auto-fit, navbars scroll); buttons do not wrap, so keep their labels short in every language.
- **Format with `Intl`, never by hand.** Numbers, dates and percentages differ: `3,214` / `3.214`, `6.2%` / `6,2%`, `2 October 2026` / `2 de outubro de 2026`. Use `Intl.NumberFormat(locale)` and `Intl.DateTimeFormat(locale)`; put machine-readable dates in `<time datetime>`.
- **Right-to-left is supported.** Components use logical properties (`margin-inline`, `inset-inline-start`, `border-inline-start`) and `membrane.js` mirrors tab arrow keys under `dir="rtl"`.
- **Fonts cover Latin Extended** (Fraunces, Instrument Sans and JetBrains Mono all include Portuguese diacritics). Other scripts fall back to the system stack.

### 16.3 Page patterns

Full pages built only from the library live in `examples/` and are linted on every build exactly like component examples (no invented classes or values):

| Pattern | File | Shows |
|---|---|---|
| Starter | `examples/starter.html` | Landing page: navbar, hero, cards, form, themed footer |
| Article | `examples/article.html` | Long-form essay: breadcrumb, byline, prose, pull quote, related cards |
| Dashboard | `examples/dashboard.html` | Product UI: stats, chart, steps, tabs, table, empty state, menu, toast |

Start new pages by copying the closest pattern.

---

> **Companion Documents:**
> - `PROFILE.md` — factual identity and current biographical claims.
> - `VOICE.md` — observed writing behavior, evidence classes and register adaptation.
> - `BRAND-VOICE.md` — public-brand application layer.

---

*This design system is a living document. Revisit every 6 months or at any significant brand evolution.*
*When in doubt: warm, precise, human, and meaningful. Always.*
