---
name: Navbar
category: Navigation
status: stable
summary: Sticky translucent site header with brand, uppercase links (aria-current marks the active page) and an actions slot; collapses by its own width.
---

# Navbar

The site header. Sticky, 64px tall (`--size-nav`), translucent with a `--blur-backdrop` blur, warm hairline at the bottom. It uses a **container query**, so it reflows based on its own width — on narrow widths the links move to a horizontally scrolling row under the brand.

## Examples

### Site header

```html
<header class="mp-navbar">
  <div class="mp-navbar__inner">
    <a class="mp-navbar__brand" href="#components">D'Césares</a>
    <nav class="mp-navbar__nav" aria-label="Primary">
      <ul class="mp-navbar__links">
        <li><a class="mp-navbar__link" href="#components" aria-current="page">Work</a></li>
        <li><a class="mp-navbar__link" href="#components">Writing</a></li>
        <li><a class="mp-navbar__link" href="#components">Workshops</a></li>
        <li><a class="mp-navbar__link" href="#components">About</a></li>
      </ul>
    </nav>
    <div class="mp-navbar__actions">
      <a class="mp-button" href="#components" data-size="sm">Let's co-create</a>
    </div>
  </div>
</header>
```

## Accessibility

- Wrap links in `<nav aria-label="Primary">`; mark the current page with `aria-current="page"` (that attribute drives the active style).
- Put a [skip link](../link/README.md) before the navbar.
- Links keep a 44px target height.

## API

<!-- GENERATED:API -->
_Generated from `navbar.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-navbar` | root |
| `.mp-navbar__inner` | part of `.mp-navbar` |
| `.mp-navbar__brand` | part of `.mp-navbar` |
| `.mp-navbar__nav` | part of `.mp-navbar` |
| `.mp-navbar__links` | part of `.mp-navbar` |
| `.mp-navbar__link` | part of `.mp-navbar` |
| `.mp-navbar__actions` | part of `.mp-navbar` |

**States styled** — `:focus-visible` `:hover` `[aria-current="page"]`

**Design tokens consumed** — `--blur-backdrop` `--border-default` `--border-width-medium` `--color-action-primary` `--color-bg-hover` `--color-bg-primary` `--color-human-text` `--color-text-primary` `--color-text-secondary` `--container-xl` `--focus-ring` `--focus-ring-offset` `--font-sans` `--font-serif` `--radius-full` `--radius-sm` `--site-margin` `--size-nav` `--size-nav-mobile` `--size-touch-target` `--space-1` `--space-2` `--space-3` `--space-4` `--space-6` `--text-h4` `--text-xs` `--tracking-heading` `--tracking-label` `--transition-fast` `--weight-bold` `--weight-semibold` `--z-nav`
<!-- /GENERATED:API -->
