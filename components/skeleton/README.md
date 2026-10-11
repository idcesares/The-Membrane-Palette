---
name: Skeleton
category: Feedback
status: stable
summary: Placeholder text lines, circles and blocks that hold a layout's shape while content loads; still under reduced motion.
---

# Skeleton

Use skeletons when you know the **shape** of what's coming (a card, a list, a profile) and it takes longer than ~300ms. They prevent layout shift and feel calmer than a spinner. For an unknown or short wait, use a [spinner](../progress/README.md).

## Examples

### Loading card

```html
<div class="mp-card" aria-busy="true" aria-describedby="skeleton-status">
  <span class="mp-visually-hidden" id="skeleton-status" role="status">Loading workshop…</span>
  <div class="mp-skeleton" data-variant="block" aria-hidden="true"></div>
  <div aria-hidden="true">
    <div class="mp-skeleton" data-variant="text" style="--mp-skeleton-width: 40%"></div>
    <div class="mp-skeleton" data-variant="text"></div>
    <div class="mp-skeleton" data-variant="text"></div>
  </div>
  <div class="mp-cluster" aria-hidden="true">
    <div class="mp-skeleton" data-variant="circle"></div>
    <div class="mp-skeleton" data-variant="text" style="--mp-skeleton-width: 8rem"></div>
  </div>
</div>
```

## Accessibility

- Skeleton shapes are `aria-hidden="true"`; the loading region has `aria-busy="true"` and a visually hidden `role="status"` message.
- Remove `aria-busy` (and the skeletons) in the same update that inserts the content.
- The shimmer stops under `prefers-reduced-motion`.

## API

<!-- GENERATED:API -->
_Generated from `skeleton.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-skeleton` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-variant` | `text` · `circle` · `block` |

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-skeleton-width` | `100%` |
| `--mp-skeleton-height` | `1rem` |

**Design tokens consumed** — `--color-bg-active` `--color-bg-hover` `--duration-loop` `--ease-in-out` `--radius-full` `--radius-lg` `--radius-sm` `--space-10` `--space-32`
<!-- /GENERATED:API -->
