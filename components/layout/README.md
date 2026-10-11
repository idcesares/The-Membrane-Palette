---
name: Layout
category: Layout
status: stable
summary: Container, Stack, Cluster, Grid, Section and Surface primitives that compose any page without custom layout CSS.
---

# Layout

Six small primitives cover almost every arrangement on a page. Gaps are always a step on the spacing scale (`data-gap="4"` → `--space-4`), so rhythm stays on the 4px grid without anyone typing a pixel value.

| Primitive | Does | Default gap |
|---|---|---|
| `.mp-container` | Centers content at a max width with fluid side margins (`--site-margin`) | — |
| `.mp-stack` | Vertical flow | `--space-4` |
| `.mp-cluster` | Horizontal row that wraps (buttons, tags, metadata) | `--space-3` |
| `.mp-grid` | Responsive auto-fit columns, no breakpoints needed | `--space-6` |
| `.mp-section` | Vertical padding for a page band | `--space-20` |
| `.mp-surface` | Paints `--color-bg-primary` + `--color-text-primary` (needed when you flip a subtree with `data-theme`) | — |

`.mp-visually-hidden` hides content visually while keeping it available to screen readers.

## When to use

- Any page or panel layout. Reach for these before writing `display: flex` by hand.
- `.mp-grid` for card collections: columns appear and collapse based on available width, so it works in sidebars and full-width bands alike.

## When not to use

- Complex, named-area layouts (dashboards with a fixed sidebar) — write a CSS Grid with `grid-template-areas`, still using `--space-*` for gaps.

## Examples

### Stack and cluster

```html
<div class="mp-stack" data-gap="3">
  <p class="mp-card__overline">Workshop</p>
  <h3 class="type-h3">Designing with the membrane</h3>
  <div class="mp-cluster" data-gap="2">
    <span class="mp-tag" data-tone="human">Pedagogy</span>
    <span class="mp-tag" data-tone="digital">AI systems</span>
    <span class="mp-tag">90 min</span>
  </div>
</div>
```

### Responsive grid

```html
<div class="mp-grid" data-min="sm" data-gap="4">
  <div class="mp-card" data-variant="flat"><p class="mp-card__body">One</p></div>
  <div class="mp-card" data-variant="flat"><p class="mp-card__body">Two</p></div>
  <div class="mp-card" data-variant="flat"><p class="mp-card__body">Three</p></div>
</div>
```

### Dark band inside a light page

```html
<section class="mp-section mp-surface" data-size="sm" data-theme="dark">
  <div class="mp-container" data-size="sm">
    <p class="type-body">Every token inside this section resolves to its dark value, because <code class="mp-code">data-theme="dark"</code> sets <code class="mp-code">color-scheme</code> for the subtree.</p>
  </div>
</section>
```

## Accessibility

- Layout primitives change visual order only through normal document flow — they never reorder content, so reading order and focus order stay aligned.
- `.mp-visually-hidden` content is announced but invisible; it becomes visible if it (or a descendant) receives focus.

## API

<!-- GENERATED:API -->
_Generated from `layout.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-container` | root |
| `.mp-stack` | root |
| `.mp-cluster` | root |
| `.mp-grid` | root |
| `.mp-section` | root |
| `.mp-surface` | root |
| `.mp-visually-hidden` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-size` | `sm` · `md` · `lg` |
| `data-justify` | `between` · `center` · `end` |
| `data-align` | `start` · `baseline` |
| `data-min` | `sm` · `lg` |
| `data-gap` | `0` · `1` · `2` · `3` · `4` · `5` · `6` · `8` · `10` · `12` · `16` |
| `data-tone` | `secondary` · `elevated` |

**States styled** — `:active` `:focus-within`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-container-max` | `var(--container-xl)` |
| `--mp-gap` | `var(--space-4)` |
| `--mp-grid-min` | `16rem` |
| `--mp-section-space` | `var(--space-20)` |

**Design tokens consumed** — `--color-bg-elevated` `--color-bg-primary` `--color-bg-secondary` `--color-text-primary` `--container-lg` `--container-md` `--container-sm` `--container-xl` `--site-margin` `--space-1` `--space-10` `--space-12` `--space-16` `--space-2` `--space-20` `--space-3` `--space-32` `--space-4` `--space-5` `--space-6` `--space-8`
<!-- /GENERATED:API -->
