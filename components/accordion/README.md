---
name: Accordion
category: Navigation
status: stable
summary: Expandable sections on native <details>/<summary> — no script, keyboard-ready, exclusive with a shared name, animated where supported.
---

# Accordion

Native disclosure: the browser handles keyboard, state and find-in-page (closed content is still searchable). Adjacent accordions share borders automatically. Give them the same `name` to make them exclusive (opening one closes the others).

## Examples

### FAQ

```html
<div>
  <details class="mp-accordion" name="accordion-faq" open>
    <summary class="mp-accordion__summary">Do I need a framework?</summary>
    <div class="mp-accordion__content"><p>No. Link one stylesheet and write HTML with <code class="mp-code">mp-</code> classes.</p></div>
  </details>
  <details class="mp-accordion" name="accordion-faq">
    <summary class="mp-accordion__summary">Does dark mode need extra CSS?</summary>
    <div class="mp-accordion__content"><p>No. Every semantic token carries its own light and dark value.</p></div>
  </details>
  <details class="mp-accordion" name="accordion-faq">
    <summary class="mp-accordion__summary">Can agents use it?</summary>
    <div class="mp-accordion__content"><p>Yes — start from <code class="mp-code">components/manifest.json</code>.</p></div>
  </details>
</div>
```

## Accessibility

- `<summary>` is the button; don't put other interactive elements inside it.
- Keep summaries short and descriptive — they're read as button labels.

## API

<!-- GENERATED:API -->
_Generated from `accordion.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-accordion` | root |
| `.mp-accordion__summary` | part of `.mp-accordion` |
| `.mp-accordion__content` | part of `.mp-accordion` |

**States styled** — `:focus-visible` `:hover` `[open]`

**Design tokens consumed** — `--border-default` `--border-width-medium` `--color-bg-hover` `--color-text-primary` `--color-text-secondary` `--duration-normal` `--focus-ring` `--font-sans` `--leading-body` `--leading-small` `--radius-sm` `--size-control-md` `--space-2` `--space-3` `--space-4` `--space-5` `--text-body` `--transition-default` `--transition-fast` `--weight-semibold`
<!-- /GENERATED:API -->
