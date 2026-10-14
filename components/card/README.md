---
name: Card
category: Content
status: stable
summary: A contained unit — overline, serif title, body, footer, optional media — with standard, featured and flat variants and an accessible whole-card link.
---

# Card

Cards group one idea: a project, an essay, a workshop. Warm surface, soft radius, restrained border; the terracotta (or teal) accent appears only on the `featured` variant, when the content asks for emphasis.

## Anatomy

```
.mp-card
├── .mp-card__media     optional — image/video, full-bleed at the top
├── .mp-card__overline  optional — uppercase label (register-colored)
├── .mp-card__title     Fraunces heading (use a real <h2>/<h3>)
│   └── .mp-card__link  optional — makes the whole card clickable
├── .mp-card__body      supporting text
└── .mp-card__footer    optional — metadata, tags, actions (pinned to bottom)
```

Media example:

```text
<div class="mp-card__media"><img src="cover.jpg" alt=""></div>
```

## When to use

- Collections of comparable items in an `.mp-grid`.
- `data-variant="featured"` for the one item that deserves emphasis; `data-tone="digital"` switches its accent to teal for technical content.
- `data-variant="flat"` inside an already-raised surface, to avoid card-in-card shadows.

## Examples

### Standard, featured, digital

```html
<div class="mp-grid">
  <article class="mp-card">
    <p class="mp-card__overline">Essay</p>
    <h3 class="mp-card__title">Learning platforms with institutional memory</h3>
    <p class="mp-card__body">What changes when a course remembers every cohort that took it.</p>
    <div class="mp-card__footer"><span>8 min read</span></div>
  </article>
  <article class="mp-card" data-variant="featured">
    <p class="mp-card__overline">Featured</p>
    <h3 class="mp-card__title">The membrane between people and systems</h3>
    <p class="mp-card__body">A field guide to designing where pedagogy meets code.</p>
  </article>
  <article class="mp-card" data-variant="featured" data-tone="digital">
    <p class="mp-card__overline">Open source</p>
    <h3 class="mp-card__title">Token pipeline</h3>
    <p class="mp-card__body">DTCG JSON in, gate-checked OKLCH CSS out.</p>
  </article>
</div>
```

### With media

```html
<div class="mp-grid" data-min="sm">
  <article class="mp-card">
    <div class="mp-card__media"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23F0EBE1'/%3E%3Cpath d='M-10 140C80 20 160 20 330 120' fill='none' stroke='%23B35530' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M-10 50C90 170 200 170 330 40' fill='none' stroke='%231B756D' stroke-width='3' stroke-linecap='round'/%3E%3Ccircle cx='160' cy='86' r='6' fill='%23D49A3A'/%3E%3C/svg%3E" alt=""></div>
    <p class="mp-card__overline">Illustration</p>
    <h3 class="mp-card__title">Where the registers cross</h3>
    <p class="mp-card__body">Media sits full-bleed at the top and picks up the brand's warm photo filter.</p>
  </article>
</div>
```

### Clickable card

```html
<article class="mp-card">
  <p class="mp-card__overline">Sample case</p>
  <h3 class="mp-card__title"><a class="mp-card__link" href="#components">Teaching AI literacy at scale</a></h3>
  <p class="mp-card__body">A fictional program for testing collaborative AI-literacy workflows.</p>
  <div class="mp-card__footer">
    <span class="mp-tag" data-tone="human">Education</span>
    <span class="mp-tag" data-tone="digital">LLMs</span>
  </div>
</article>
```

## Accessibility

- Use a real heading element for `.mp-card__title`, at the right level for the page outline.
- Clickable cards: put **one** `.mp-card__link` on the title. Its `::after` stretches over the card, so the whole surface is clickable but the accessible name is just the title — never wrap the card in `<a>`.
- Other buttons/links inside a clickable card are lifted above the stretched link automatically.
- Decorative media gets `alt=""`.

## API

<!-- GENERATED:API -->
_Generated from `card.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-card` | root |
| `.mp-card__media` | part of `.mp-card` |
| `.mp-card__overline` | part of `.mp-card` |
| `.mp-card__title` | part of `.mp-card` |
| `.mp-card__body` | part of `.mp-card` |
| `.mp-card__footer` | part of `.mp-card` |
| `.mp-card__link` | part of `.mp-card` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-tone` | `digital` |
| `data-variant` | `featured` · `flat` |

**States styled** — `:focus-visible` `:hover`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-card-padding` | `var(--space-6)` |
| `--mp-card-bg` | `var(--color-bg-secondary)` |
| `--mp-card-shadow` | `var(--elevation-raised)` |
| `--mp-card-accent` | `var(--color-action-primary)` |
| `--mp-card-overline` | `var(--color-human-text)` |

**Design tokens consumed** — `--border-default` `--border-width-thick` `--border-width-thin` `--color-action-primary` `--color-action-secondary` `--color-bg-secondary` `--color-bg-tertiary` `--color-border-emphasis` `--color-digital-text` `--color-human-text` `--color-text-primary` `--color-text-secondary` `--color-text-tertiary` `--elevation-overlay` `--elevation-raised` `--focus-ring` `--focus-ring-offset` `--font-sans` `--font-serif` `--leading-body` `--leading-label` `--leading-small` `--leading-subheading` `--photo-warmth` `--radius-lg` `--space-2` `--space-3` `--space-4` `--space-6` `--space-8` `--text-body` `--text-h3` `--text-small` `--text-xs` `--tracking-label` `--tracking-subheading` `--transition-slow` `--weight-semibold`
<!-- /GENERATED:API -->
