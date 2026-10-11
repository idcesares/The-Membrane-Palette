---
name: Input
category: Forms
status: stable
summary: One class for text inputs, textareas and selects, with a ≥3:1 control boundary, visible focus ring, and invalid/disabled/read-only states.
---

# Input

`.mp-input` styles `<input>`, `<textarea>` and `<select>` identically, so a form reads as one surface. Always place it inside a [Field](../field/README.md) with a label.

The border uses `--color-border-input`, which is gate-checked at ≥3:1 against page, card and dialog surfaces (WCAG 1.4.11) — `--color-border-default` is decorative and too faint to be a control's only boundary.

## Examples

### Text, select, textarea

```html
<div class="mp-stack">
  <div class="mp-field">
    <label class="mp-field__label" for="input-name">Full name</label>
    <input class="mp-input" id="input-name" type="text" autocomplete="name" placeholder="Isaac D'Césares">
  </div>
  <div class="mp-field">
    <label class="mp-field__label" for="input-topic">Topic</label>
    <select class="mp-input" id="input-topic">
      <option>AI in education</option>
      <option>Learning design</option>
      <option>Developer tooling</option>
    </select>
  </div>
  <div class="mp-field">
    <label class="mp-field__label" for="input-message">Message</label>
    <textarea class="mp-input" id="input-message" rows="3">Vamos cocriar?</textarea>
  </div>
</div>
```

### Sizes and states

```html
<div class="mp-stack" data-gap="3">
  <input class="mp-input" type="text" data-size="sm" aria-label="Small input" placeholder="Small">
  <input class="mp-input" type="text" data-size="lg" aria-label="Large input" placeholder="Large">
  <input class="mp-input" type="text" aria-label="Disabled input" value="Disabled" disabled>
  <input class="mp-input" type="text" aria-label="Read-only input" value="Read-only" readonly>
  <input class="mp-input" type="text" aria-label="Invalid input" value="Invalid" aria-invalid="true">
</div>
```

## Accessibility

- Every input needs a visible `<label>` (or, only where a visible label truly can't exist, `aria-label`).
- Set `autocomplete` on personal-data fields (WCAG 1.3.5) and the right `type` (`email`, `tel`, `url`) so mobile keyboards adapt.
- Focus shows both a `--color-focus` border and the 2px `--focus-ring` — never remove it.
- `<select>` falls back to the native control under Windows High Contrast.

## API

<!-- GENERATED:API -->
_Generated from `input.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-input` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-size` | `sm` · `lg` |

**States styled** — `:disabled` `:focus-visible` `:hover` `[aria-invalid="true"]` `[multiple]` `[readonly]`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-input-border` | `var(--color-border-input)` |
| `--mp-input-height` | `var(--size-control-md)` |
| `--mp-input-padding` | `var(--space-4)` |

**Design tokens consumed** — `--border-width-thin` `--color-bg-primary` `--color-bg-secondary` `--color-border-input` `--color-error` `--color-focus` `--color-text-primary` `--color-text-secondary` `--color-text-tertiary` `--focus-ring` `--focus-ring-offset` `--font-sans` `--leading-body` `--leading-small` `--radius-sm` `--size-control-lg` `--size-control-md` `--size-control-sm` `--space-10` `--space-2` `--space-24` `--space-3` `--space-4` `--space-5` `--state-disabled-opacity` `--text-body` `--text-body-lg` `--text-small` `--transition-fast`
<!-- /GENERATED:API -->
