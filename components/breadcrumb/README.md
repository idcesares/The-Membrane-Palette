---
name: Breadcrumb
category: Navigation
status: stable
summary: The path from site root to the current page, as an ordered list with decorative separators and aria-current on the last item.
---

# Breadcrumb

## Examples

### Path

```html
<nav class="mp-breadcrumb" aria-label="Breadcrumb">
  <ol class="mp-breadcrumb__list">
    <li class="mp-breadcrumb__item"><a class="mp-breadcrumb__link" href="#components">Home</a></li>
    <li class="mp-breadcrumb__item"><a class="mp-breadcrumb__link" href="#components">Workshops</a></li>
    <li class="mp-breadcrumb__item"><a class="mp-breadcrumb__link" href="#components" aria-current="page">AI Literacy I</a></li>
  </ol>
</nav>
```

## Accessibility

- `<nav aria-label="Breadcrumb">` + `<ol>` conveys "list of 3 items" and position.
- Separators are CSS with empty alt text, so they're never read aloud.
- The current page link has `aria-current="page"`.

## API

<!-- GENERATED:API -->
_Generated from `breadcrumb.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-breadcrumb` | root |
| `.mp-breadcrumb__list` | part of `.mp-breadcrumb` |
| `.mp-breadcrumb__item` | part of `.mp-breadcrumb` |
| `.mp-breadcrumb__link` | part of `.mp-breadcrumb` |

**States styled** — `:focus-visible` `:hover` `[aria-current="page"]`

**Design tokens consumed** — `--color-text-primary` `--color-text-secondary` `--color-text-tertiary` `--focus-ring` `--focus-ring-offset` `--font-sans` `--leading-small` `--radius-sm` `--space-2` `--text-small` `--weight-medium`
<!-- /GENERATED:API -->
