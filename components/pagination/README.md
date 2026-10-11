---
name: Pagination
category: Navigation
status: stable
summary: Numbered page links with previous/next; aria-current marks the current page (teal pill), and narrow containers collapse to previous · current · next.
---

# Pagination

For long lists split across pages (essays, cohorts, search results). The current page is a teal pill — navigation is the digital register — and the component responds to its own width: below 28rem only previous, current and next remain.

## When not to use

- Fewer than ~3 pages → a single "Show more" button.
- Feeds people scroll through casually → load more on demand.

## Examples

### Pages

```html
<nav class="mp-pagination" aria-label="Essays pages">
  <ul class="mp-pagination__list">
    <li class="mp-pagination__item"><a class="mp-pagination__link" href="#components" rel="prev">← Previous</a></li>
    <li class="mp-pagination__item"><a class="mp-pagination__link" href="#components">1</a></li>
    <li class="mp-pagination__item"><a class="mp-pagination__link" href="#components" aria-current="page">2</a></li>
    <li class="mp-pagination__item"><a class="mp-pagination__link" href="#components">3</a></li>
    <li class="mp-pagination__item"><span class="mp-pagination__gap" aria-hidden="true">…</span></li>
    <li class="mp-pagination__item"><a class="mp-pagination__link" href="#components">12</a></li>
    <li class="mp-pagination__item"><a class="mp-pagination__link" href="#components" rel="next">Next →</a></li>
  </ul>
</nav>
```

### First page

```html
<nav class="mp-pagination" aria-label="Cohort pages">
  <ul class="mp-pagination__list">
    <li class="mp-pagination__item"><a class="mp-pagination__link" aria-disabled="true">← Previous</a></li>
    <li class="mp-pagination__item"><a class="mp-pagination__link" href="#components" aria-current="page">1</a></li>
    <li class="mp-pagination__item"><a class="mp-pagination__link" href="#components">2</a></li>
    <li class="mp-pagination__item"><a class="mp-pagination__link" href="#components" rel="next">Next →</a></li>
  </ul>
</nav>
```

## Accessibility

- `<nav>` with a specific `aria-label` ("Essays pages"), so it's distinguishable from the main navigation.
- The current page is `aria-current="page"` — that attribute is also what styles it.
- An unavailable previous/next link has no `href` and `aria-disabled="true"`, so it isn't focusable and reads as disabled.
- Every link keeps a 44 × 44px target.

## API

<!-- GENERATED:API -->
_Generated from `pagination.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-pagination` | root |
| `.mp-pagination__list` | part of `.mp-pagination` |
| `.mp-pagination__link` | part of `.mp-pagination` |
| `.mp-pagination__gap` | part of `.mp-pagination` |
| `.mp-pagination__item` | part of `.mp-pagination` |

**States styled** — `:focus-visible` `:hover` `[aria-current="page"]` `[aria-disabled="true"]`

**Design tokens consumed** — `--color-action-secondary` `--color-bg-hover` `--color-text-on-accent` `--color-text-primary` `--color-text-secondary` `--color-text-tertiary` `--focus-ring` `--focus-ring-offset` `--font-sans` `--radius-full` `--size-touch-target` `--space-1` `--space-3` `--space-8` `--state-disabled-opacity` `--text-small` `--transition-fast` `--weight-medium`
<!-- /GENERATED:API -->
