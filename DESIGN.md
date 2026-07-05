# DEPRECATED — v2.0

> This file is a hand-synced YAML mirror of the token values that existed in v1.1.
> It is no longer updated. The canonical machine-readable source is now
> `tokens/membrane.tokens.json` (DTCG-flavored JSON).
> This file will be removed in v3.0.

---
name: Isaac D'Césares Design System
version: 1.1  # frozen — see tokens/membrane.tokens.json for current values

colors:
  # Primary (Human)
  terracotta: "#B35530"
  terracotta-light: "#D4724F"
  terracotta-dark: "#944425"
  terracotta-10: "rgba(179, 85, 48, 0.10)"
  terracotta-20: "rgba(179, 85, 48, 0.20)"
  # Primary (Digital)
  teal: "#1B756D"
  teal-light: "#3AAFA8"
  teal-dark: "#145C56"
  teal-08: "rgba(27, 117, 109, 0.08)"
  teal-10: "rgba(27, 117, 109, 0.10)"
  teal-12: "rgba(27, 117, 109, 0.12)"
  teal-20: "rgba(27, 117, 109, 0.20)"
  
  # Canvas
  cream: "#FAF6EE"
  charcoal: "#1A1B1F"
  
  # Accents
  amber: "#D49A3A"
  amber-light: "#E8B44A"
  burgundy: "#7A3345"
  burgundy-light: "#9A4558"
  sage: "#5A8A6E"
  sage-light: "#6FBF8A"
  
  # Neutrals (Warm-tinted)
  neutral-50: "#FAF6EE"
  neutral-100: "#F0EBE1"
  neutral-200: "#E2DCD2"
  neutral-300: "#C8C1B5"
  neutral-400: "#A39D93"
  neutral-500: "#7D776E"
  neutral-600: "#5C564E"
  neutral-700: "#3D3832"
  neutral-800: "#2A2622"
  neutral-900: "#1A1B1F"

  # Semantic roles
  text-primary: "{colors.neutral-800}"
  text-secondary: "{colors.neutral-600}"
  text-tertiary: "{colors.neutral-400}"
  text-accent: "{colors.teal}"
  text-on-accent: "#FFFFFF"
  
  bg-primary: "{colors.cream}"
  bg-secondary: "{colors.neutral-100}"
  bg-tertiary: "{colors.neutral-200}"

  border-default: "{colors.neutral-200}"
  border-emphasis: "{colors.neutral-300}"
  overlay-bg: "rgba(26, 27, 31, 0.70)"

  success: "{colors.sage}"
  warning: "{colors.amber}"
  error: "#C44040"
  info: "{colors.teal}"

gradients:
  membrane: "linear-gradient(135deg, #B35530 0%, #1B756D 100%)"
  warmth: "radial-gradient(ellipse 600px 300px at 15% 0%, rgba(179, 85, 48, 0.08) 0%, transparent 70%)"
  depth: "linear-gradient(180deg, var(--color-charcoal) 0%, #12131A 100%)"
  divider: "linear-gradient(90deg, transparent, var(--color-border-default), transparent)"
  subtle: "linear-gradient(150deg, var(--color-bg-secondary) 8%, var(--color-bg-primary) 92%)"

ambientGlows:
  terracotta: "rgba(179, 85, 48, 0.09)"
  teal: "rgba(27, 117, 109, 0.10)"
  sage: "rgba(90, 138, 110, 0.08)"
  focal: "rgba(179, 85, 48, 0.06)"
  focal-loaded: "rgba(179, 85, 48, 0.10)"

typography:
  fonts:
    serif: "'Fraunces', 'Georgia', 'Times New Roman', serif"
    sans: "'Instrument Sans', 'Inter', 'Helvetica Neue', sans-serif"
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
  
  sizes:
    display: "clamp(2.25rem, 3.5vw + 1rem, 3.75rem)"
    h1: "clamp(1.875rem, 2.5vw + 1rem, 2.75rem)"
    h2: "clamp(1.5rem, 2vw + 0.75rem, 2rem)"
    h3: "clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem)"
    h4: "clamp(1.125rem, 1vw + 0.5rem, 1.25rem)"
    body-lg: "clamp(1.0625rem, 0.5vw + 0.9rem, 1.1875rem)"
    body: "clamp(1rem, 0.25vw + 0.9rem, 1.0625rem)"
    small: "0.875rem"
    xs: "0.75rem"
    code: "clamp(0.875rem, 0.25vw + 0.8rem, 0.9375rem)"
    sm: "{typography.sizes.small}"
    base: "{typography.sizes.body}"
    md: "{typography.sizes.h4}"
    lg: "{typography.sizes.h3}"
    xl: "{typography.sizes.h2}"
  
  lineHeights:
    display: "1.1"
    heading: "1.2"
    subheading: "1.3"
    body: "1.6"
    body-lg: "1.5"
    small: "1.5"
    code: "1.6"
    label: "1.2"

  letterSpacing:
    display: "-0.02em"
    heading: "-0.015em"
    subheading: "-0.01em"
    body: "0"
    small: "0.01em"
    label: "0.08em"

  weights:
    regular: "400"
    medium: "500"
    semibold: "600"
    bold: "700"

spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
  "10": "2.5rem"
  "12": "3rem"
  "16": "4rem"
  "20": "5rem"
  "24": "6rem"
  "32": "8rem"

radii:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "999px"

shadows:
  sm: "0 1px 3px rgba(26, 27, 31, 0.06), 0 1px 2px rgba(26, 27, 31, 0.04)"
  md: "0 4px 12px rgba(26, 27, 31, 0.08), 0 2px 4px rgba(26, 27, 31, 0.04)"
  lg: "0 12px 32px rgba(26, 27, 31, 0.12), 0 4px 8px rgba(26, 27, 31, 0.06)"
  glow-warm: "0 0 24px rgba(179, 85, 48, 0.15)"
  glow-teal: "0 0 24px rgba(27, 117, 109, 0.15)"

motion:
  durations:
    fast: "150ms"
    normal: "250ms"
    slow: "400ms"
    slower: "600ms"
  easings:
    default: "cubic-bezier(0.25, 0.1, 0.25, 1)"
    out: "cubic-bezier(0.0, 0.0, 0.2, 1)"
    in: "cubic-bezier(0.4, 0.0, 1, 1)"
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"

components:
  button-primary:
    background: "{colors.terracotta}"
    color: "#FFFFFF"
    borderRadius: "{radii.full}"
    padding: "0.875rem 2rem"
    fontFamily: "{typography.fonts.sans}"
    fontWeight: "{typography.weights.medium}"
    fontSize: "{typography.sizes.body}"
    letterSpacing: "0.01em"
  
  button-secondary:
    background: "transparent"
    color: "{colors.teal}"
    border: "2px solid {colors.teal}"
    borderRadius: "{radii.full}"
    padding: "0.75rem 1.75rem"
    
  button-ghost:
    background: "transparent"
    color: "{colors.text-primary}"
    padding: "0.75rem 1.5rem"
    borderRadius: "{radii.full}"
  
  card-default:
    background: "{colors.bg-secondary}"
    border: "1px solid {colors.border-default}"
    borderRadius: "{radii.lg}"
    padding: "{spacing.6}"
    boxShadow: "{shadows.sm}"
    
  card-featured:
    background: "{colors.bg-secondary}"
    borderLeft: "3px solid {colors.terracotta}"
    borderRadius: "{radii.lg}"
    padding: "{spacing.8}"
    boxShadow: "{shadows.md}"
---

# Look & Feel

The Isaac D'Césares Brand Design System is the visual translation of the brand essence — a coherent, reproducible system where the **human register meets the digital register**. The overall feel should be articulate, warm, concrete, and confident without arrogance, bringing the vibrancy of Brazilian texture to precise, digital craftsmanship. 

## Design Principles

1. **Translation, Not Decoration**: Every visual element carries meaning. A color or spacing choice is driven by the necessity to bridge communication, never added as mere ornament.
2. **Warmth at the Foundation**: Backgrounds carry subtle warmth (cream, not white; charcoal, not black). This ensures that even the most technical content (such as code blocks or system diagrams) is presented in a context that feels human.
3. **Confident Restraint**: The brand establishes authority through composure, not volume. It is characterized by generous whitespace, deliberate typography, and a limited color palette.
4. **The Maker's Mark**: A subtle hand-crafted quality that feels considered rather than generated. This emerges in thoughtful type pairing, organic illustration, and optical sizing.
5. **Brazilian Texture**: The warmth, light, and materiality of Rio de Janeiro reflected in earth tones, ocean tones, and hospitable spacing.

## The Membrane Palette

The color system revolves around the metaphor of **the membrane between the human and the digital**:
*   **Human Register:** Earthy, warm, and pedagogic (`terracotta`, `amber`, `burgundy`).
*   **Digital Register:** Technical, precise, and deep (`teal`, `sage`).
*   **The Membrane:** Neutral surfaces (`cream`, `charcoal`) bridging both worlds.

**Terracotta** is the primary action color, used for core highlights and primary CTAs. **Deep Teal** serves as the secondary color, grounding digital contexts like links and code accents.

## Typographic Triad

The typographic system encodes the brand's identity dimensions:
*   **The Researcher (Fraunces)**: A variable serif used for headings. Warm, intellectual, and slightly wonky (set to WONK=1 for display) to affirm the human presence behind the thinking.
*   **The Educator (Instrument Sans)**: A clean, geometric sans-serif used for body copy and navigational elements to render complexity navigable.
*   **The Builder (JetBrains Mono)**: A monospace font for code, representing systems and the maker at work.

## Motion & Interaction

Animations are purposeful and never performative. The pacing is warm and slightly slower than typical tech brands (standard duration is 250ms). Elements entering the view use an `ease-out` (welcoming), while leaving elements use an `ease-in` (respectful exit). 

## Voice Integration

The visual language reinforces the brand voice — an ongoing conversation that translates between human cognition and artificial intelligence. The design speaks with:
*   **Articulate Clarity:** Supported by generous padding scales that leave room for thought.
*   **Grounded Concrete Examples:** Authentic photography features a subtle warmth filter (`sepia(0.05) saturate(1.05) brightness(1.02)`) bringing the human element to the forefront.
*   **The Shared Invitation:** Buttons are consistently mapped to `radius-full` pill shapes, acting as an invitation to collaborate, reflecting the defining CTA: *"Let's co-create. Vamos cocriar?"*
