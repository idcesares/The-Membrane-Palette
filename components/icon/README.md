---
name: Icon
category: Content
status: stable
summary: Sizes and colors an inline line-icon SVG from the --size-icon-* tokens (20/24/32/48px) and the register/status text colors.
---

# Icon

The system doesn't ship its own icon set; it standardizes how icons look. Use **[Lucide](https://lucide.dev)** (ISC license) — outlined, 24px grid, rounded caps and joins, which is exactly the style in [`DESIGN-SYSTEM.md` §7.3](../../DESIGN-SYSTEM.md#73-iconography). Paste the SVG, drop its presentation attributes, and add `class="mp-icon"`: the class sets size, `currentColor` stroke and the 1.5px stroke width.

| Size | Token | Use |
|---|---|---|
| `sm` | `--size-icon-sm` (20px) | inline with text, inside buttons and alerts |
| default | `--size-icon-md` (24px) | standalone UI |
| `lg` | `--size-icon-lg` (32px) | feature lists |
| `xl` | `--size-icon-xl` (48px) | empty states, heroes |

## Examples

### Sizes and tones

```html
<div class="mp-cluster" data-gap="5">
  <svg class="mp-icon" data-size="sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  <svg class="mp-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  <svg class="mp-icon" data-size="lg" data-tone="human" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
  <svg class="mp-icon" data-size="xl" data-tone="digital" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16"/></svg>
  <svg class="mp-icon" data-tone="success" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
  <svg class="mp-icon" data-tone="warning" viewBox="0 0 24 24" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/></svg>
  <svg class="mp-icon" data-tone="error" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
</div>
```

## Accessibility

- Decorative icons (next to a text label) get `aria-hidden="true"`.
- An icon that is the only content of a control needs a label on the control (`aria-label` on the button), not on the SVG.
- An icon that carries meaning on its own (rare) gets `role="img"` and an `aria-label`.
- Tone colors are the gate-checked `-text` tokens, so a meaningful icon has ≥ 4.5:1 contrast.

## API

<!-- GENERATED:API -->
_Generated from `icon.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-icon` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-size` | `sm` · `lg` · `xl` |
| `data-tone` | `human` · `digital` · `success` · `warning` · `error` |

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-icon-size` | `var(--size-icon-md)` |

**Design tokens consumed** — `--color-digital-text` `--color-error-text` `--color-human-text` `--color-success-text` `--color-warning-text` `--size-icon-lg` `--size-icon-md` `--size-icon-sm` `--size-icon-xl`
<!-- /GENERATED:API -->
