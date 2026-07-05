# Isaac D'Césares — Brand Design System
> **Version 2.0 · July 2026**
> *The visual translation of the brand essence into a coherent, reproducible system.*

---

## 0. How to Use This Document

This design system is the **single source of truth** for every visual and interactive expression of the Isaac D'Césares brand — from the personal website to social media cards, presentation decks, GitHub profiles, institutional materials, and AI-generated content.

**For designers:** Follow the tokens, scales, and component patterns. Every decision has intent — do not substitute without understanding the reasoning.

**For developers:** The CSS custom properties in `tokens/design-tokens.css` are **generated** from `tokens/membrane.tokens.json`. Edit the JSON source, run `npm run build:tokens`, and the CSS updates. All semantic token names map 1:1 to this document. Prefer Tier 2 semantic tokens (`--color-action-primary`, `--color-text-tertiary`, etc.) over Tier 1 primitives (`--color-terracotta`) in component code.

**For AI agents:** Use this document as your style constraint. When generating any visual or textual content for the brand, validate against Section 1 (Principles), Section 2 (Color), and Section 3 (Typography) at minimum.

**The test for any output:** Does it hold both the human register and the digital register simultaneously? Is it warm without being casual? Is it precise without being cold?

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
  Amber Gold              Warm Gray               Steel Blue
  Burgundy                                        Slate
```

This is not arbitrary. When a design element relates to the human side of the brand (education, community, ethics), it gravitates toward warm tones. When it relates to the digital side (code, AI, systems), it gravitates toward cool tones. When it bridges both — which is most of the time — it uses the neutral membrane colors with accents from either register.

### 2.2 Core Palette

#### Primary Colors

| Token | Name | Hex | HSL | Role |
|-------|------|-----|-----|------|
| `--color-terracotta` | Terracotta | `#B35530` | `15, 58%, 44%` | **Primary brand color.** The human register made visible. Earth, hands, making, Brazilian clay. Used for primary CTAs, key highlights, the signature accent. *Adjusted for WCAG AA compliance.* |
| `--color-teal` | Deep Teal | `#1B756D` | `174, 63%, 28%` | **Secondary brand color.** The digital register. Technology, depth, Rio's ocean. Used for secondary actions, links, code accents, digital-context elements. |

#### Primary Opacity Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-terracotta-10` | `rgba(179, 85, 48, 0.10)` | Warm tint for tags, selection, subtle emphasis |
| `--color-terracotta-20` | `rgba(179, 85, 48, 0.20)` | Stronger warm tint for hover/focus affordances |
| `--color-teal-08` | `rgba(27, 117, 109, 0.08)` | Very subtle digital wash for page-level ambient backgrounds |
| `--color-teal-10` | `rgba(27, 117, 109, 0.10)` | Default teal tint for tags and quiet UI states |
| `--color-teal-12` | `rgba(27, 117, 109, 0.12)` | Slightly stronger teal tint for focal background glows |
| `--color-teal-20` | `rgba(27, 117, 109, 0.20)` | Stronger teal tint for bars, selected states, and hover surfaces |

#### Canvas Colors

| Token | Name | Hex | HSL | Role |
|-------|------|-----|-----|------|
| `--color-cream` | Warm Cream | `#FAF6EE` | `40, 55%, 96%` | **Light canvas.** The membrane surface. Never pure white — warmth is baked into the ground. Primary background for light mode. |
| `--color-charcoal` | Rich Charcoal | `#1A1B1F` | `228, 10%, 11%` | **Dark canvas.** Depth and sophistication. Primary background for dark mode. Slightly cool to create contrast with warm accents. |

#### Accent Colors

| Token | Name | Hex | HSL | Role |
|-------|------|-----|-----|------|
| `--color-amber` | Amber Gold | `#D49A3A` | `37, 62%, 53%` | **Builder energy.** Making, creation, sunlight, optimism. Used sparingly for highlights, badges, "new" indicators, callout borders. |
| `--color-burgundy` | Burgundy | `#7A3345` | `345, 41%, 34%` | **Heritage depth.** The D'Césares lineage, intellectual depth, gravitas. Used for deep emphasis, footnotes, premium contexts. |
| `--color-sage` | Sage Green | `#5A8A6E` | `147, 21%, 45%` | **Growth.** Education, nature, Rio's vegetation, development. Used for success states, growth metrics, educational contexts. |

#### Neutral Scale

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-neutral-50` | `#FAF6EE` | = Warm Cream (lightest) |
| `--color-neutral-100` | `#F0EBE1` | Subtle backgrounds, cards on cream |
| `--color-neutral-200` | `#E2DCD2` | Borders, dividers (light mode) |
| `--color-neutral-300` | `#C8C1B5` | Disabled states, placeholder text |
| `--color-neutral-400` | `#A39D93` | Secondary text (light mode) |
| `--color-neutral-500` | `#7D776E` | Tertiary text, captions |
| `--color-neutral-600` | `#5C564E` | Body text (light mode) |
| `--color-neutral-700` | `#3D3832` | Headings (light mode), body text (dark mode) |
| `--color-neutral-800` | `#2A2622` | Deep emphasis (light mode) |
| `--color-neutral-900` | `#1A1B1F` | = Rich Charcoal (darkest) |

> **Note:** The neutral scale is intentionally warm. Every gray carries a subtle amber undertone (shifting toward `hsl(35, 8%, x%)`) rather than being purely achromatic. This ensures that even structural elements (borders, backgrounds, disabled states) contribute to the warmth principle.

### 2.3 Semantic Colors

Each token carries its `light-dark()` pair internally — the same property name works in both modes. No override blocks required.

| Token | Light value | Dark value | Usage |
|-------|------------|-----------|-------|
| `--color-text-primary` | `--neutral-800` | `--neutral-100` | Primary body text |
| `--color-text-secondary` | `--neutral-600` | `--neutral-400` | Supporting text, captions |
| `--color-text-tertiary` | `#6E685F` | `#938D83` | Placeholder, metadata. v2.0: darkened to meet 4.5:1 on bg-primary and bg-secondary. |
| `--color-text-accent` | `--color-teal` | `--color-teal-light` | Links, interactive text |
| `--color-text-on-accent` | `#FFFFFF` | `--color-charcoal` | Text on action-primary background. v2.0: dark mode flips to charcoal — white on lightened terracotta was 3.3:1. |
| `--color-action-primary` | `--color-terracotta` | `--color-terracotta-light` | Primary CTAs, key interactive accents. Use instead of bare `--color-terracotta` on interactive elements. |
| `--color-action-secondary` | `--color-teal` | `--color-teal-light` | Secondary/navigational actions. |
| `--color-focus` | `--color-teal` | `--color-teal-light` | Focus ring color. v2.0: dark mode remapped to teal-light (raw teal is 3.1:1 on charcoal). |
| `--color-bg-primary` | `--color-cream` | `--color-charcoal` | Page background |
| `--color-bg-secondary` | `--neutral-100` | `#242429` | Cards, sections |
| `--color-bg-tertiary` | `--neutral-200` | `#2E2E34` | Nested containers |
| `--color-border-default` | `--neutral-200` | `#3D3842` | Default borders |
| `--color-border-emphasis` | `--neutral-300` | `--neutral-600` | Emphasized borders |
| `--color-overlay-bg` | `rgba(26, 27, 31, 0.70)` | same | Scrims, navigation overlays, image readability layers |
| `--color-success` | `--color-sage` | `--color-sage-light` | Success fills, icons, large text (≥3:1 on bg-primary). |
| `--color-success-text` | `#3E6B52` | `--color-sage-light` | Success body text (4.5:1). v2.0: new. |
| `--color-warning` | `--color-amber` | `--color-amber-light` | Warning fills and badges with dark text on top. Never use as text on light surfaces (2.3:1). |
| `--color-warning-text` | `#8A6420` | `--color-amber-light` | Warning body text (5.0:1). v2.0: new. |
| `--color-error` | `#C44040` | `#E86060` | Error fills and icons. |
| `--color-error-text` | `#B23A3A` | `#E86060` | Error body text (5.5:1). v2.0: new. |
| `--color-info` | `--color-teal` | `--color-teal-light` | Informational states |
| `--color-selection` | terracotta 20% | terracotta-light 20% | Text selection highlight. v2.0: new. |

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
| `--gradient-membrane` | `linear-gradient(135deg, #B35530 0%, #1B756D 100%)` | The brand's signature gradient. Human → Digital. Used on hero sections, key visual moments, not on small UI elements. |
| `--gradient-warmth` | `radial-gradient(ellipse at 15% 0%, rgba(179,85,48,0.08) 0%, transparent 70%)` | Subtle warm glow applied to section backgrounds. Creates ambient warmth without being decorative. |
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
| `--code-comment` | `#7D776E` | Comments |
| `--code-number` | `#5AC8C0` | Numeric values |

---

## 3. Typography

### 3.1 Type Philosophy

The typographic system encodes the same tension that defines the brand:

- **Fraunces** (variable serif) = The human register. Warm, intellectual, with subtle optical personality. It has soft, organic curves and a wonky character that prevents it from feeling institutional. It says: *there is a person behind this thinking.*
- **Instrument Sans** (sans-serif) = The digital register. Clean, geometric, technical — but not sterile. It has enough character to avoid feeling generic. It says: *this is built with precision.*
- **JetBrains Mono** (monospace) = The builder register. Code, systems, the maker at work. It says: *this person ships.*

This triad mirrors the brand identity triad: **Researcher (Fraunces) · Educator (Instrument Sans) · Builder (JetBrains Mono).**

### 3.2 Font Stack

```css
--font-serif:    'Fraunces', 'Georgia', 'Times New Roman', serif;
--font-sans:     'Instrument Sans', 'Inter', 'Helvetica Neue', sans-serif;
--font-mono:     'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

**Loading strategy:** Fraunces and Instrument Sans via Google Fonts with `display=swap`. JetBrains Mono self-hosted or via Google Fonts.

**Variable font axes (Fraunces):**
- `wght`: 400–700 (use 400 for body, 600 for emphasis, 700 for display)
- `opsz`: 9–144 (optical sizing — let the browser handle this automatically)
- `WONK`: 0–1 (set to 1 for display headings to activate the softer, more characterful forms)

### 3.3 Type Scale

The scale uses a **variable ratio** — approximately 1.20 between small steps, widening to approximately 1.375 at display sizes. All sizes use `clamp()` for fluid responsive behavior.

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

#### Website Compatibility Aliases

The website uses a small set of semantic size aliases in component CSS. They resolve to the canonical scale and are included in `tokens/design-tokens.css` for compatibility.

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

**Site margin:** `clamp(1.5rem, 5vw, 5rem)` — fluid margins that scale gracefully from mobile to desktop.

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

> **Note:** The current website uses `999rem` for fully-rounded buttons. This carries forward. Buttons are pills — rounded, approachable, inviting. Cards are softly rounded but not pill-shaped.

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
| `--border-default` | `1px solid var(--color-border-default)` | Standard borders |
| `--border-emphasis` | `1px solid var(--color-border-emphasis)` | Emphasized separation |
| `--border-accent` | `2px solid var(--color-terracotta)` | Active states, selected items |

---

## 6. Component Patterns

### 6.1 Buttons

**Primary Button (Terracotta)**
```
Background:     var(--color-terracotta)
Text:           #FFFFFF
Padding:        0.875rem 2rem
Border-radius:  var(--radius-full)
Font:           Instrument Sans, 500, var(--text-body)
Letter-spacing: 0.01em
Hover:          brightness(1.08), shadow-glow-warm
Active:         brightness(0.95)
Transition:     all 0.2s ease
```

**Secondary Button (Teal, outline)**
```
Background:     transparent
Border:         2px solid var(--color-teal)
Text:           var(--color-teal)
Padding:        0.75rem 1.75rem
Border-radius:  var(--radius-full)
Hover:          background var(--color-teal), text #FFFFFF
```

**Ghost Button**
```
Background:     transparent
Text:           var(--color-text-primary)
Padding:        0.75rem 1.5rem
Border-radius:  var(--radius-full)
Hover:          background var(--color-bg-secondary)
```

**Button sizing:**
| Size | Padding | Font size |
|------|---------|-----------|
| Small | `0.5rem 1.25rem` | `--text-small` |
| Default | `0.875rem 2rem` | `--text-body` |
| Large | `1rem 2.5rem` | `--text-body-lg` |

### 6.2 Cards

**Standard Card**
```
Background:     var(--color-bg-secondary)
Border:         var(--border-default)
Border-radius:  var(--radius-lg)
Padding:        var(--space-6)
Shadow:         var(--shadow-sm)
Hover:          shadow-md, translateY(-2px)
Transition:     all 0.25s ease
```

**Featured Card**
```
Background:     var(--color-bg-secondary)
Border-left:    3px solid var(--color-terracotta)
Border-radius:  var(--radius-lg)
Padding:        var(--space-8)
Shadow:         var(--shadow-md)
```

**Card anatomy:**
1. Optional image/media area (top, full-bleed within card radius)
2. Overline label (text-xs, uppercase, terracotta or teal, `--space-3` bottom)
3. Title (H3, Fraunces, `--space-2` bottom)
4. Description (body text, `--space-4` bottom)
5. Optional metadata footer (text-small, secondary text color)

### 6.3 Navigation

```
Height:         64px (desktop), 56px (mobile)
Background:     var(--color-bg-primary) with backdrop-blur(12px) + 80% opacity
Border-bottom:  var(--border-default)
Position:       sticky top
Logo:           Left-aligned
Nav links:      Instrument Sans, 500, --text-small, uppercase, letter-spacing 0.04em
Active link:    color var(--color-terracotta), underline-offset 4px
```

### 6.4 Input Fields

```
Background:     var(--color-bg-primary)
Border:         var(--border-default)
Border-radius:  var(--radius-sm)
Padding:        0.75rem 1rem
Font:           Instrument Sans, 400, --text-body
Focus:          border-color var(--color-teal), shadow-glow-teal (subtle)
Placeholder:    var(--color-text-tertiary)
```

### 6.5 Tags / Pills

```
Background:     rgba(27, 117, 109, 0.1)  /* teal at 10% */
Text:           var(--color-teal)
Padding:        var(--space-1) var(--space-3)
Border-radius:  var(--radius-full)
Font:           Instrument Sans, 500, --text-xs
```

For human-register tags (education topics): use terracotta at 10% with terracotta text.
For builder-register tags (tech stack): use teal at 10% with teal text.

### 6.6 Blockquotes

```
Border-left:    3px solid var(--color-terracotta)
Padding-left:   var(--space-6)
Font:           Fraunces, 400 italic, --text-body-lg
Color:          var(--color-text-primary)
Margin:         var(--space-8) 0
```

Pull quotes (the brand's signature phrases) get special treatment:
```
Font:           Fraunces, 600 italic, --text-h2
Color:          var(--color-terracotta)
Text-align:     center
Max-width:      var(--container-sm)
Margin:         var(--space-12) auto
```

### 6.7 Code Blocks

```
Background:     #1E1F26 (always dark, even in light mode)
Text:           #E2DCD2
Border-radius:  var(--radius-md)
Padding:        var(--space-6)
Font:           JetBrains Mono, 400, --text-code
Line-height:    1.6
Border:         1px solid rgba(255,255,255,0.06)
```

Syntax highlighting accents:
- Keywords: `--color-terracotta` (lightened to `#E07050`)
- Strings: `--color-sage` (lightened to `#7BC494`)
- Functions: `--color-amber` (lightened to `#E8B44A`)
- Comments: `--neutral-500`
- Numbers: teal lightened to `#5AC8C0`

### 6.8 Section Dividers

Prefer generous spacing (`--space-16` to `--space-24`) over visible lines. When a visual divider is needed:

```
Border:         none
Height:         1px
Background:     linear-gradient(90deg, transparent, var(--color-border-default), transparent)
Margin:         var(--space-16) auto
Max-width:      var(--container-sm)
```

This fading-edge line feels more intentional and less utilitarian than a full-width rule.

---

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
- **Source:** Use a consistent icon set (recommended: Phosphor Icons or Lucide — both have the right balance of warmth and precision).

### 7.4 Data Visualization

When displaying metrics, charts, or diagrams:
- **Primary data:** Terracotta
- **Secondary data:** Teal
- **Tertiary data:** Amber
- **Background/grid:** `--neutral-200` (light) / `--neutral-800` (dark)
- **Labels:** Instrument Sans, `--text-small`
- **Style:** Clean and minimal. No 3D effects, no unnecessary embellishment. Rounded line caps.

---

## 8. Motion & Interaction

### 8.1 Motion Principles

1. **Purposeful, not performative.** Every animation should communicate something: a state change, spatial relationship, or hierarchy. No animation for decoration.
2. **Warm pacing.** Slightly slower than typical tech-brand animations. The brand is not in a rush. Standard duration is `250ms`, not `150ms`.
3. **Ease with intention.** Use `ease-out` for elements entering (welcoming), `ease-in` for elements leaving (respectful exit), `ease-in-out` for state changes.

### 8.2 Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | `150ms` | Micro-interactions: hover color changes, opacity shifts |
| `--duration-normal` | `250ms` | Standard transitions: hover effects, active states |
| `--duration-slow` | `400ms` | Larger transitions: card hover lift, section reveals |
| `--duration-slower` | `600ms` | Page transitions, hero entrance animations |

### 8.3 Easing

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | General purpose |
| `--ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Elements entering view |
| `--ease-in` | `cubic-bezier(0.4, 0.0, 1, 1)` | Elements leaving view |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful micro-interactions (use sparingly) |

### 8.4 Transition Composites

Shorthand tokens combining duration and easing for common use:

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `150ms ease-default` | Micro-interactions |
| `--transition-default` | `250ms ease-default` | Standard transitions |
| `--transition-slow` | `400ms ease-default` | Larger transitions |

### 8.5 Reduced Motion

**Always respect `prefers-reduced-motion`.** When active:
- Set all durations to 0ms (except --duration-slower at 150ms for essential feedback).
- Restrict transition-property to opacity, color, background-color, border-color, and box-shadow.
- Disable all transform-based animations via `!important` override.
- Disable parallax, scroll-triggered transforms, and auto-playing sequences.

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
| `D'Césares` | Compact formal (navigation, footer, watermark) |
| `idcesares` | Digital/developer contexts (GitHub, terminal, social handles) |
| `dc` | Monogram / favicon (Fraunces, 700, terracotta on cream or cream on charcoal) |

### 10.2 Monogram

A two-letter monogram `dc` set in Fraunces Bold, lowercase, with tight tracking (`-0.05em`). The `d` is in `--color-terracotta` and the `c` is in `--color-teal`, representing the two registers meeting.

**Monogram usage:**
- Favicon (16×16, 32×32, with solid background)
- Social media avatar (circular crop, on cream background)
- Watermark on slide decks (bottom-right, 30% opacity)
- App icon contexts

### 10.3 Clear Space

Minimum clear space around any brand mark = the height of the lowercase `d` in the wordmark. This ensures the mark always breathes.

### 10.4 Color Combinations

| Context | Mark Color | Background |
|---------|-----------|------------|
| Light default | `--color-charcoal` | `--color-cream` |
| Dark default | `--color-cream` | `--color-charcoal` |
| Accent | `--color-cream` | `--color-terracotta` |
| Digital | `--color-cream` | `--color-teal` |
| Monochrome | `--color-neutral-700` | White |

---

## 11. Application Guidelines

### 11.1 Website (dcesares.dev)

- **Primary canvas:** Light mode (warm cream) as default, with dark mode support.
- **Hero section:** Large Fraunces display heading, Instrument Sans body, profile photo with warm filter, terracotta primary CTA.
- **Section backgrounds:** Alternate between cream and slightly darker cream (`--neutral-100`) to create rhythm without borders.
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
- **Accent color in emails:** Use terracotta `#B35530` for links and CTAs (high contrast, warm, identifiable)
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

VOICE CONSTRAINTS (from Brand Essence):
- Articulate, warm, concrete, confident without arrogance
- Never hype-driven ("disrupting", "revolutionizing")
- Never credential-forward (titles follow impact)
- Always hold both human and digital registers
- Default CTA: "Let's co-create" / "Vamos cocriar?"
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
| Text tertiary | `#A39D93` | `#7D776E` |
| Border default | `#E2DCD2` | `#3D3842` |
| Terracotta | `#B35530` | `#D4724F` (lightened for contrast) |
| Teal | `#1B756D` | `#3AAFA8` (lightened for contrast) |
| Amber | `#D49A3A` | `#E8B44A` |
| Sage | `#5A8A6E` | `#6FBF8A` |
> **Note:** Terracotta now properly lightens in dark mode via `var(--color-terracotta-light)` to maintain sufficient contrast with dark backgrounds while preserving the warmth principle.

### 12.2 Dark Mode Rules

1. **Accent colors lighten by ~15% in dark mode** to maintain WCAG AA contrast ratios.
2. **Shadows shift from opacity-based to glow-based** in dark mode. Cards get a subtle border instead of a drop shadow.
3. **The membrane gradient remains the same direction** (terracotta → teal) but both endpoints lighten.
4. **Ambient glow stop-colors shift brighter** so background texture remains perceptible on dark surfaces.
5. **Manual toggles support both `[data-theme="dark"]` and `:root.theme-dark`.** The class exists for compatibility with the current website theme script.
6. **Images receive a subtle `brightness(0.92)` filter** in dark mode to prevent them from blowing out against dark surfaces.

---

## 13. Accessibility

> The design system now enforces accessibility at the build level — see §13.1 for the automated contrast gate. The rules below are design intent; the gate is what makes them non-negotiable.



### 13.1 Contrast Requirements

All text must meet **WCAG AA minimum** (4.5:1 for body text, 3:1 for large text and UI components). Target **AAA** (7:1 / 4.5:1) where possible.

> **v2.0 enforcement:** The build script (`npm run build:tokens`) verifies 40 foreground/background pairs in both light and dark mode before writing CSS output. The build aborts if any pair regresses. Run it after any token change.

Verified contrast ratios (light mode / dark mode):

| Foreground | Background | Light | Dark | Level |
|-----------|------------|-------|------|-------|
| `--color-text-primary` | `--color-bg-primary` | 13.9:1 | 14.5:1 | AAA |
| `--color-text-primary` | `--color-bg-secondary` | 12.6:1 | 13.0:1 | AAA |
| `--color-text-secondary` | `--color-bg-primary` | 6.7:1 | 6.4:1 | AA |
| `--color-text-tertiary` | `--color-bg-primary` | 5.1:1 | 5.2:1 | AA |
| `--color-text-tertiary` | `--color-bg-secondary` | 4.6:1 | 4.7:1 | AA |
| `--color-text-accent` | `--color-bg-primary` | 5.1:1 | 6.5:1 | AA |
| `--color-text-on-accent` | `--color-action-primary` | 4.9:1 | 8.3:1 | AA / AAA |
| `--color-success-text` | `--color-bg-primary` | 5.7:1 | 7.8:1 | AA |
| `--color-warning-text` | `--color-bg-primary` | 5.0:1 | 9.1:1 | AA |
| `--color-error-text` | `--color-bg-primary` | 5.5:1 | 5.1:1 | AA |
| `--color-focus` | `--color-bg-primary` | 5.1:1 | 6.5:1 | AA (WCAG 1.4.11) |
| `--color-focus` | `--color-bg-secondary` | 4.6:1 | 5.8:1 | AA |

### 13.2 Focus States

| Token | Value |
|-------|-------|
| `--focus-ring` | `2px solid var(--color-teal)` |
| `--focus-ring-offset` | `2px` |

Focus states use the following properties:

```
Outline:        var(--focus-ring)
Outline-offset: var(--focus-ring-offset)
Border-radius:  matches element's border-radius
```

Never remove focus outlines. They are a feature, not a flaw.

### 13.3 Touch Targets

Minimum touch target: 44×44px (WCAG 2.5.5). All buttons, links, and interactive elements must meet this minimum.

---

## 14. File & Asset Naming

Consistent naming across all brand assets:

```
Pattern:  idcesares-{type}-{descriptor}-{variant}.{ext}
Examples:
  idcesares-logo-monogram-cream.svg
  idcesares-photo-profile-2026.jpg
  idcesares-card-linkedin-dark.png
  idcesares-slide-title-charcoal.pptx
```

**Color mode suffixes:** `-light`, `-dark`, `-cream`, `-charcoal`
**Size suffixes:** `-sm`, `-md`, `-lg`, `-xl`, `-2x`, `-3x`
**Platform suffixes:** `-linkedin`, `-instagram`, `-github`, `-web`

---

## 15. Design Token Summary

All tokens are generated from `tokens/membrane.tokens.json` into `tokens/design-tokens.css` and `tokens/base.css`.

```
tokens/
├── membrane.tokens.json   ← Source of truth (DTCG-flavored JSON — edit this)
├── design-tokens.css      ← Generated: @layer tokens — pure custom properties
└── base.css               ← Generated: @layer base — element rules (optional)
```

### Token architecture

Three tiers:
- **Tier 1 — Primitives:** raw values, immutable across modes. (`--color-terracotta`, `--color-neutral-*`, etc.)
- **Tier 2 — Semantics:** intent-named, carry their own `light-dark()` pair. (**Consume these in components.**)
- **Tier 3 — Component recipes:** documented as patterns in §6; not emitted as tokens.

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
--z-nav                     (z-index, layer)
--state-hover-opacity       (interaction, state — v2.0)
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

Numeric suffixes mean different things in different categories — `--color-neutral-100` is a lightness step; `--color-terracotta-10` is an alpha wash (10% opacity). This is a known inconsistency preserved for backwards compatibility. New tokens use explicit suffixes (`--color-tint-terracotta-10`) where ambiguity would arise.

---

> **Companion Documents:**
> - `BRAND-VOICE.md` — Complete voice and tone guide with writing samples, vocabulary, and audience adaptation rules.
> - `isaac-dcesares-brand-essence-ultimate.md` — The generative seed from which this system and the voice guide derive.

---

*This design system is a living document. Revisit every 6 months or at any significant brand evolution.*
*It is the visual companion to the Brand Essence document — both must be consulted together.*
*When in doubt: warm, precise, human, and meaningful. Always.*
