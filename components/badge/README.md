---
name: Badge
category: Content
status: stable
summary: A compact, uppercase, non-interactive label for status and metadata — info, success, warning, error, or a register tone.
---

# Badge

Badges report state: "Draft", "Live", "Deprecated", "Pass". They are small and quiet; tone carries the meaning, the word carries it too.

## Examples

### Tones

```html
<div class="mp-cluster" data-gap="2">
  <span class="mp-badge">Draft</span>
  <span class="mp-badge" data-tone="info">Beta</span>
  <span class="mp-badge" data-tone="success">Live</span>
  <span class="mp-badge" data-tone="warning">Deprecated</span>
  <span class="mp-badge" data-tone="error">Failing</span>
  <span class="mp-badge" data-tone="human">Workshop</span>
  <span class="mp-badge" data-tone="digital">API</span>
</div>
```

### With status dot

```html
<div class="mp-cluster" data-gap="2">
  <span class="mp-badge" data-tone="success" data-variant="dot">Online</span>
  <span class="mp-badge" data-tone="warning" data-variant="dot">Degraded</span>
  <span class="mp-badge" data-tone="error" data-variant="dot">Offline</span>
</div>
```

## Accessibility

- The word is the message; color is reinforcement. Never use a colored badge with no text.
- If a badge updates live (e.g. build status), put it inside an element with `role="status"`.

## API

<!-- GENERATED:API -->
_Generated from `badge.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-badge` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-tone` | `info` · `success` · `warning` · `error` · `human` · `digital` |
| `data-variant` | `dot` |

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-badge-bg` | `var(--color-bg-tertiary)` |
| `--mp-badge-fg` | `var(--color-text-secondary)` |

**Design tokens consumed** — `--color-bg-tertiary` `--color-digital-bg` `--color-digital-text` `--color-error-bg` `--color-error-text` `--color-human-bg` `--color-human-text` `--color-info-bg` `--color-info-text` `--color-success-bg` `--color-success-text` `--color-text-secondary` `--color-warning-bg` `--color-warning-text` `--font-sans` `--leading-label` `--radius-full` `--radius-sm` `--space-1` `--space-2` `--text-xs` `--tracking-label` `--weight-semibold`
<!-- /GENERATED:API -->
