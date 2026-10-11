---
name: Alert
category: Feedback
status: stable
summary: An inline message about state — info, success, warning, error — or a human-register editorial note, with optional icon and actions.
---

# Alert

Alerts explain what happened and what to do next. Every tone uses a gate-checked pair: the title is the tone's `-text` color on the tone's `-bg` wash (≥4.5:1), the body stays `--color-text-primary`.

## When to use

- Form-level errors, save confirmations, deprecation notices, editorial callouts (`data-tone="human"`).

## When not to use

- A single field is wrong → use the field's `.mp-field__error`.
- Transient confirmation that needs no action → a status line or toast, not a persistent alert.

## Examples

### Tones

```html
<div class="mp-stack" data-gap="3">
  <div class="mp-alert">
    <svg class="mp-alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
    <div class="mp-alert__content">
      <p class="mp-alert__title">Tokens are generated</p>
      <p>Edit <code class="mp-code">membrane.tokens.json</code>, never the CSS.</p>
    </div>
  </div>
  <div class="mp-alert" data-tone="success">
    <div class="mp-alert__content">
      <p class="mp-alert__title">Every contrast check passes</p>
      <p>Light and dark mode, including hover states.</p>
    </div>
  </div>
  <div class="mp-alert" data-tone="warning">
    <div class="mp-alert__content">
      <p class="mp-alert__title">5 tokens are deprecated</p>
      <p>They keep working until v3.0.0.</p>
    </div>
  </div>
  <div class="mp-alert" data-tone="error" role="alert">
    <div class="mp-alert__content">
      <p class="mp-alert__title">We couldn't save your draft</p>
      <p>Your connection dropped. Nothing was lost — try again in a moment.</p>
      <div class="mp-alert__actions"><button class="mp-button" type="button" data-size="sm" data-variant="secondary">Try again</button></div>
    </div>
  </div>
  <div class="mp-alert" data-tone="human">
    <div class="mp-alert__content">
      <p class="mp-alert__title">A note from the facilitator</p>
      <p>Bring one real problem from your classroom. We'll build around it.</p>
    </div>
  </div>
</div>
```

## Accessibility

- Static alerts need no role. Alerts injected after an action need `role="status"` (polite) — or `role="alert"` only for errors that block progress.
- Start with a clear title so the tone isn't carried by color alone.
- Icons are decorative (`aria-hidden="true"`); the title says what the icon shows.

## API

<!-- GENERATED:API -->
_Generated from `alert.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-alert` | root |
| `.mp-alert__icon` | part of `.mp-alert` |
| `.mp-alert__content` | part of `.mp-alert` |
| `.mp-alert__title` | part of `.mp-alert` |
| `.mp-alert__actions` | part of `.mp-alert` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-tone` | `success` · `warning` · `error` · `human` |

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-alert-accent` | `var(--color-info)` |
| `--mp-alert-bg` | `var(--color-info-bg)` |
| `--mp-alert-title` | `var(--color-info-text)` |

**Design tokens consumed** — `--border-width-thick` `--border-width-thin` `--color-action-primary` `--color-error` `--color-error-bg` `--color-error-text` `--color-human-bg` `--color-human-text` `--color-info` `--color-info-bg` `--color-info-text` `--color-success` `--color-success-bg` `--color-success-text` `--color-text-primary` `--color-warning` `--color-warning-bg` `--color-warning-text` `--font-sans` `--leading-small` `--radius-md` `--size-icon-sm` `--space-1` `--space-2` `--space-3` `--space-4` `--space-5` `--text-body` `--text-small` `--weight-semibold`
<!-- /GENERATED:API -->
