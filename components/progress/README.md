---
name: Progress
category: Feedback
status: stable
summary: Native <progress> bars (determinate or indeterminate, three sizes, register tones) and a spinner for short unmeasured waits.
---

# Progress

Uses the native `<progress>` element, so value, max and the indeterminate state are announced by assistive tech without extra ARIA. Default value color is teal (digital: systems at work); `data-tone="human"` for learner progress.

## Examples

### Determinate and indeterminate

```html
<div class="mp-stack">
  <div class="mp-field">
    <label class="mp-field__label" for="progress-course">Course completion — 64%</label>
    <progress class="mp-progress" id="progress-course" value="64" max="100" data-tone="human">64%</progress>
  </div>
  <div class="mp-field">
    <label class="mp-field__label" for="progress-upload">Uploading materials</label>
    <progress class="mp-progress" id="progress-upload" data-size="sm"></progress>
  </div>
  <div class="mp-field">
    <label class="mp-field__label" for="progress-gate">Modules completed — 8 of 8</label>
    <progress class="mp-progress" id="progress-gate" value="8" max="8" data-tone="success" data-size="lg">8 of 8</progress>
  </div>
</div>
```

### Spinner

```html
<div class="mp-cluster">
  <span class="mp-spinner" aria-hidden="true"></span>
  <span class="type-small" role="status">Generating feedback…</span>
</div>
```

## Accessibility

- Label every progress bar (`<label for>` or `aria-label`); include the number in the label when it matters.
- A spinner is decorative — announce the wait with visible text in a `role="status"` element.
- Under reduced motion (with `tokens/base.css`), animations stop; the indeterminate bar and spinner still render as static indicators.

## API

<!-- GENERATED:API -->
_Generated from `progress.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-progress` | root |
| `.mp-spinner` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-tone` | `human` · `success` |
| `data-size` | `sm` · `lg` |

**States styled** — `:indeterminate`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-progress-height` | `0.5rem` |
| `--mp-progress-track` | `var(--color-bg-tertiary)` |
| `--mp-progress-value` | `var(--color-action-secondary)` |
| `--mp-spinner-size` | `1.25rem` |

**Design tokens consumed** — `--border-width-medium` `--color-action-primary` `--color-action-secondary` `--color-bg-tertiary` `--color-success` `--ease-in-out` `--radius-full` `--transition-default`
<!-- /GENERATED:API -->
