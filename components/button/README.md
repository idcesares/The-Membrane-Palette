---
name: Button
category: Actions
status: stable
summary: Pill-shaped action trigger. Primary is terracotta (one per view), secondary is a teal outline, ghost is quiet, danger is destructive.
---

# Button

Buttons commit an action: submit, save, open, delete. They are pills — rounded, approachable — and every size keeps a 44px touch target on touch screens.

| Variant | Use for | Rule |
|---|---|---|
| *(none)* | The single most important action in a view | At most **one** per view — terracotta is the brand's signature accent |
| `secondary` | Alternatives and navigation-like actions | Teal outline; fills teal on hover |
| `ghost` | Low-emphasis actions in toolbars, cards, dialogs | Neutral; shows a wash on hover |
| `danger` | Irreversible destructive actions | Pair with a confirmation step |

## When to use

- An action happens on this page (submit, toggle, open a dialog) → `<button class="mp-button">`.
- A call-to-action that navigates elsewhere but must *look* like a button → `<a class="mp-button" href="…">`.

## When not to use

- Navigation inside running text → use [Link](../link/README.md).
- A filter that toggles on/off → a [Tag](../tag/README.md) with `aria-pressed`, or a [Switch](../switch/README.md).

## Examples

### Variants

```html
<div class="mp-cluster">
  <button class="mp-button" type="button">Let's co-create</button>
  <button class="mp-button" type="button" data-variant="secondary">See the work</button>
  <button class="mp-button" type="button" data-variant="ghost">Cancel</button>
  <button class="mp-button" type="button" data-variant="danger">Delete draft</button>
</div>
```

### Sizes

```html
<div class="mp-cluster">
  <button class="mp-button" type="button" data-size="sm">Small</button>
  <button class="mp-button" type="button">Default</button>
  <button class="mp-button" type="button" data-size="lg">Large</button>
</div>
```

### With icons

```html
<div class="mp-cluster">
  <a class="mp-button" href="#components" data-variant="secondary">
    Read the essay
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  </a>
  <button class="mp-button" type="button" data-variant="ghost" data-icon-only aria-label="Add to reading list">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
  </button>
</div>
```

### Full width

```html
<div class="mp-grid" data-min="sm" data-gap="4">
  <article class="mp-card">
    <h3 class="mp-card__title">Builders' Lab</h3>
    <p class="mp-card__body">Two days, twelve seats, one deployed tool.</p>
    <div class="mp-card__footer"><button class="mp-button" type="button" data-full-width>Join the waitlist</button></div>
  </article>
  <article class="mp-card">
    <h3 class="mp-card__title">AI Literacy I</h3>
    <p class="mp-card__body">Six weeks, online, starting from your classroom.</p>
    <div class="mp-card__footer"><button class="mp-button" type="button" data-variant="secondary" data-full-width>Read the syllabus</button></div>
  </article>
</div>
```

### States

```html
<div class="mp-cluster">
  <button class="mp-button" type="button" disabled>Disabled</button>
  <button class="mp-button" type="button" aria-busy="true">Saving</button>
  <button class="mp-button" type="button" data-variant="secondary" aria-pressed="true">Following</button>
</div>
```

## Accessibility

- Use `<button type="button">` for actions and `<a href>` for navigation; never a `<div>` with a click handler.
- Icon-only buttons (`data-icon-only`) **must** have an `aria-label`. Icons inside buttons get `aria-hidden="true"`.
- Loading: set `aria-busy="true"` — the label is hidden visually and a spinner appears, but the accessible name stays. Pair with a live region announcing the result.
- Prefer `aria-disabled="true"` over `disabled` when the button should stay focusable so users can discover *why* it is unavailable.
- Label text on primary, secondary-hover and danger fills is gate-checked at ≥4.5:1 in both modes, including hover.

## Do / Don't

- **Do** write labels as verbs in the brand voice: "Let's co-create", "Save draft".
- **Don't** put two primary buttons side by side — demote one to `secondary`.
- **Don't** set `min-height` or colors by hand; change a `--mp-button-*` knob if you must.

## API

<!-- GENERATED:API -->
_Generated from `button.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-button` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-variant` | `secondary` · `ghost` · `danger` |
| `data-size` | `sm` · `lg` |
| `data-icon-only` | boolean — presence enables it |
| `data-full-width` | boolean — presence enables it |

**States styled** — `:active` `:disabled` `:focus-visible` `:hover` `[aria-busy="true"]` `[aria-disabled="true"]` `[aria-pressed="true"]`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-button-bg` | `var(--color-action-primary)` |
| `--mp-button-bg-hover` | `var(--color-action-primary-hover)` |
| `--mp-button-fg` | `var(--color-text-on-accent)` |
| `--mp-button-fg-hover` | `var(--mp-button-fg)` |
| `--mp-button-border` | `transparent` |
| `--mp-button-glow` | `var(--shadow-glow-warm)` |
| `--mp-button-height` | `var(--size-control-md)` |
| `--mp-button-padding` | `var(--space-6)` |
| `--mp-button-font-size` | `var(--text-body)` |

**Design tokens consumed** — `--border-width-medium` `--color-action-primary` `--color-action-primary-hover` `--color-action-secondary` `--color-bg-hover` `--color-bg-primary` `--color-error` `--color-error-hover` `--color-text-on-accent` `--color-text-primary` `--focus-ring` `--focus-ring-offset` `--font-sans` `--leading-label` `--radius-full` `--shadow-glow-teal` `--shadow-glow-warm` `--size-control-lg` `--size-control-md` `--size-control-sm` `--space-2` `--space-4` `--space-6` `--space-8` `--state-disabled-opacity` `--text-body` `--text-body-lg` `--text-small` `--tracking-small` `--transition-fast` `--weight-medium`
<!-- /GENERATED:API -->
