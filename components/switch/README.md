---
name: Switch
category: Forms
status: stable
summary: An on/off toggle for settings that take effect immediately — a native checkbox with role="switch".
---

# Switch

A switch is a checkbox that announces itself as on/off and **applies immediately**, with no submit button. Use the same `.mp-choice` label row as checkboxes and radios.

## When to use

- Preferences that change something right away: dark mode, notifications, reduced data.

## When not to use

- Inside a form that is submitted later → use a [checkbox](../choice/README.md).

## Examples

### Settings

```html
<div class="mp-stack" data-gap="0">
  <label class="mp-choice"><input class="mp-switch" type="checkbox" role="switch" checked> Email me when a workshop opens</label>
  <label class="mp-choice"><input class="mp-switch" type="checkbox" role="switch"> Show code samples in TypeScript</label>
  <label class="mp-choice"><input class="mp-switch" type="checkbox" role="switch" disabled> Beta features (invite only)</label>
</div>
```

## Accessibility

- `role="switch"` makes screen readers say "on/off" instead of "checked/not checked".
- The label describes the setting, not the state: "Email me…", never "Turn on email".
- The thumb moves *and* the track changes color, so state isn't conveyed by color alone.

## API

<!-- GENERATED:API -->
_Generated from `switch.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-switch` | root |
| `.mp-choice` | root |

**States styled** — `:checked` `:dir(rtl)` `:disabled` `:focus-visible` `:hover`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-switch-width` | `2.75rem` |
| `--mp-switch-height` | `1.5rem` |
| `--mp-switch-thumb` | `1.125rem` |
| `--mp-switch-inset` | `0.125rem` |
| `--mp-switch-travel` | `calc(var(--mp-switch-width) - var(--mp-switch-thumb) - 2 * var(--border-width-medium) - 2 * var(--mp-switch-inset))` |

**Design tokens consumed** — `--border-width-medium` `--color-action-secondary` `--color-bg-primary` `--color-border-input` `--color-text-on-accent` `--color-text-secondary` `--duration-normal` `--ease-spring` `--focus-ring` `--focus-ring-offset` `--radius-full` `--shadow-sm` `--transition-fast` `--transition-state`
<!-- /GENERATED:API -->
