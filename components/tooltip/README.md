---
name: Tooltip
category: Feedback
status: stable
summary: A short inverse-colored hint shown on hover and keyboard focus — CSS-only, hoverable, Escape-dismissable with membrane.js.
---

# Tooltip

Tooltips add a short, **non-essential** hint to a control — typically to name an icon-only button. They appear on hover and on keyboard focus (`:focus-visible`), use the inverse surface (`--color-bg-inverse`), and can be hovered without closing.

## When not to use

- Anything the user must read to complete a task → put it in visible text or a [Field](../field/README.md) hint.
- Interactive content (links, buttons) → use a dialog or a disclosure.

## Examples

### Top and bottom

```html
<div class="mp-cluster" data-gap="6">
  <span class="mp-tooltip">
    <button class="mp-button" type="button" data-variant="ghost" data-icon-only aria-label="Copy token" aria-describedby="tooltip-copy">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>
    </button>
    <span class="mp-tooltip__content" role="tooltip" id="tooltip-copy">Copies the CSS variable name</span>
  </span>
  <span class="mp-tooltip" data-placement="bottom">
    <button class="mp-button" type="button" data-variant="secondary" data-size="sm" aria-describedby="tooltip-gate">Contrast gate</button>
    <span class="mp-tooltip__content" role="tooltip" id="tooltip-gate">Runs on every build</span>
  </span>
</div>
```

## Accessibility

- Connect with `aria-describedby` on the trigger. For icon-only buttons, the button still needs its own `aria-label` — the tooltip *describes*, the label *names*.
- Hoverable (an invisible bridge spans the gap), persistent while hovered or focused, and dismissable with Escape when `components/membrane.js` is loaded — the three WCAG 1.4.13 requirements.
- Never put focusable content inside a tooltip.

## API

<!-- GENERATED:API -->
_Generated from `tooltip.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-tooltip` | root |
| `.mp-tooltip__content` | part of `.mp-tooltip` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-dismissed` | boolean — presence enables it |
| `data-placement` | `bottom` |

**States styled** — `:focus-visible` `:hover`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-tooltip-gap` | `var(--space-2)` |

**Design tokens consumed** — `--color-bg-inverse` `--color-text-inverse` `--duration-fast` `--elevation-overlay` `--font-sans` `--leading-small` `--radius-sm` `--space-1` `--space-2` `--text-xs` `--transition-fast` `--weight-medium` `--z-tooltip`
<!-- /GENERATED:API -->
