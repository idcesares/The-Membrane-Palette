---
name: Choice
category: Forms
status: stable
summary: Checkbox and radio controls drawn in the brand style, inside a clickable .mp-choice label row with optional description.
---

# Choice

`.mp-checkbox` and `.mp-radio` restyle the native inputs — they stay real form controls, so keyboard support, form submission and validation all work for free. Wrap each one, together with its text, in `<label class="mp-choice">` so the whole row is clickable.

Checked controls use the teal **digital** register (`--color-action-secondary`), keeping terracotta reserved for the one primary action on the page.

## When to use

- Checkbox: independent on/off options, or multi-select from a list.
- Radio: exactly one option from a short list (2–5). Longer lists → a `<select>`.
- A setting that applies immediately → [Switch](../switch/README.md).

## Examples

### Checkboxes

```html
<fieldset class="mp-fieldset">
  <legend class="mp-fieldset__legend">Send me</legend>
  <label class="mp-choice"><input class="mp-checkbox" type="checkbox" checked> New essays</label>
  <label class="mp-choice">
    <input class="mp-checkbox" type="checkbox">
    <span>Workshop dates<span class="mp-choice__description">About once a month, never more.</span></span>
  </label>
  <label class="mp-choice"><input class="mp-checkbox" type="checkbox" disabled> Product updates (paused)</label>
</fieldset>
```

### Radios

```html
<fieldset class="mp-fieldset">
  <legend class="mp-fieldset__legend">Audience</legend>
  <label class="mp-choice"><input class="mp-radio" type="radio" name="choice-audience" checked> Educators</label>
  <label class="mp-choice"><input class="mp-radio" type="radio" name="choice-audience"> Developers</label>
  <label class="mp-choice"><input class="mp-radio" type="radio" name="choice-audience"> Researchers</label>
</fieldset>
```

## Accessibility

- Group related controls in a `<fieldset>` with a `<legend>` — the legend is announced with each option.
- Indeterminate ("some selected") is set from script: `checkbox.indeterminate = true`.
- Under Windows High Contrast the controls revert to native rendering so the checked state stays visible.

## API

<!-- GENERATED:API -->
_Generated from `choice.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-choice` | root |
| `.mp-checkbox` | root |
| `.mp-radio` | root |
| `.mp-choice__description` | part of `.mp-choice` |

**States styled** — `:checked` `:disabled` `:focus-visible` `:hover` `:indeterminate` `[aria-invalid="true"]`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-choice-size` | `1.25rem` |

**Design tokens consumed** — `--border-width-medium` `--color-action-secondary` `--color-bg-primary` `--color-border-input` `--color-error` `--color-text-on-accent` `--color-text-primary` `--color-text-secondary` `--focus-ring` `--focus-ring-offset` `--font-sans` `--leading-body-lg` `--leading-small` `--radius-full` `--radius-sm` `--space-2` `--space-3` `--state-disabled-opacity` `--text-body` `--text-small` `--transition-fast` `--transition-state`
<!-- /GENERATED:API -->
