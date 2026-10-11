---
name: Menu
category: Navigation
status: beta
summary: A list of actions in a native popover — opened by a popovertarget button, light-dismissed by the browser, arrow-key navigable with membrane.js.
---

# Menu

For secondary actions that don't deserve permanent space: "Duplicate", "Export", "Archive". Built on the native `popover` attribute, so the browser handles opening, top-layer stacking, Escape and click-outside. `components/membrane.js` adds the WAI-ARIA menu keyboard pattern (↑/↓, Home/End, focus on open, return focus on close), keeps `aria-expanded` in sync and positions the menu in browsers without CSS anchor positioning.

## When not to use

- Navigation between pages → links in a [Navbar](../navbar/README.md).
- Choosing a value for a form → a `<select>` ([Input](../input/README.md)).

## Examples

### Actions menu

```html
<button class="mp-button" type="button" data-variant="secondary" popovertarget="menu-workshop" aria-haspopup="menu" aria-expanded="false">Workshop actions</button>
<div class="mp-menu" id="menu-workshop" popover role="menu" aria-label="Workshop actions">
  <p class="mp-menu__label" role="presentation">Edit</p>
  <button class="mp-menu__item" type="button" role="menuitem">
    <svg class="mp-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
    Duplicate
  </button>
  <button class="mp-menu__item" type="button" role="menuitem">Export syllabus</button>
  <button class="mp-menu__item" type="button" role="menuitem" aria-disabled="true">Move to cohort (none open)</button>
  <hr class="mp-menu__separator">
  <button class="mp-menu__item" type="button" role="menuitem" data-tone="danger">Archive workshop</button>
</div>
```

## Accessibility

- The trigger has `popovertarget`, `aria-haspopup="menu"` and `aria-expanded` (kept in sync by `membrane.js`).
- The popover has `role="menu"` and an `aria-label`; items are `<button role="menuitem">`. Separators and group labels are presentational.
- Keyboard (with `membrane.js`): opening focuses the first item; ↑/↓ move, Home/End jump, Escape closes and returns focus to the trigger; choosing an item closes the menu.
- Destructive items use `data-tone="danger"` **and** a clear verb — color is never the only signal. Follow them with a confirmation [Dialog](../dialog/README.md).

## API

<!-- GENERATED:API -->
_Generated from `menu.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-menu` | root |
| `.mp-menu__item` | part of `.mp-menu` |
| `.mp-menu__separator` | part of `.mp-menu` |
| `.mp-menu__label` | part of `.mp-menu` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-tone` | `danger` |

**States styled** — `:disabled` `:focus-visible` `:hover` `:popover-open` `[aria-disabled="true"]`

**Design tokens consumed** — `--border-default` `--border-width-medium` `--border-width-thin` `--color-bg-elevated` `--color-bg-hover` `--color-border-default` `--color-error-text` `--color-text-primary` `--color-text-tertiary` `--duration-fast` `--duration-normal` `--elevation-overlay` `--focus-ring` `--font-sans` `--radius-md` `--radius-sm` `--size-control-sm` `--size-icon-sm` `--size-touch-target` `--space-1` `--space-2` `--space-3` `--state-disabled-opacity` `--text-small` `--text-xs` `--tracking-label` `--transition-enter` `--transition-exit` `--weight-semibold`
<!-- /GENERATED:API -->
