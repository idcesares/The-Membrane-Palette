---
name: Tag
category: Content
status: stable
summary: A pill that names a topic or category, colored by register — human (terracotta), digital (teal) or neutral. Can be a link, a toggle, or removable.
---

# Tag

Tags classify. The tone encodes the membrane metaphor: **human** for education, community and ethics topics; **digital** for tech stack and systems; **neutral** (default) for everything else, like durations or formats.

Tag vs. [Badge](../badge/README.md): a tag is a *topic* (sentence case, pill, can be interactive); a badge is a *status* (uppercase, compact, never interactive).

## Examples

### Tones

```html
<div class="mp-cluster" data-gap="2">
  <span class="mp-tag" data-tone="human">Pedagogy</span>
  <span class="mp-tag" data-tone="human">Community</span>
  <span class="mp-tag" data-tone="digital">TypeScript</span>
  <span class="mp-tag" data-tone="digital">Multi-agent systems</span>
  <span class="mp-tag">45 min</span>
</div>
```

### Interactive

```html
<div class="mp-cluster" data-gap="2">
  <a class="mp-tag" data-tone="digital" href="#components">#design-tokens</a>
  <button class="mp-tag" type="button" data-tone="human" aria-pressed="true">Educators</button>
  <button class="mp-tag" type="button" aria-pressed="false">Developers</button>
  <span class="mp-tag" data-tone="digital">
    OKLCH
    <button class="mp-tag__remove" type="button" aria-label="Remove OKLCH">×</button>
  </span>
</div>
```

## Accessibility

- Filter tags are `<button aria-pressed>`; the pressed state shows a ring, not just a color change.
- The remove button needs a specific label ("Remove OKLCH"), not just "×". It's 24×24px (WCAG 2.5.8).
- Tag text on its tint is gate-checked at ≥4.5:1 for every tone in both modes.

## API

<!-- GENERATED:API -->
_Generated from `tag.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-tag` | root |
| `.mp-tag__remove` | part of `.mp-tag` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-tone` | `human` · `digital` |

**States styled** — `:focus-visible` `:hover` `[aria-pressed="true"]`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-tag-bg` | `var(--color-bg-tertiary)` |
| `--mp-tag-fg` | `var(--color-text-secondary)` |

**Design tokens consumed** — `--border-width-medium` `--border-width-thin` `--color-bg-hover` `--color-bg-tertiary` `--color-digital-bg` `--color-digital-text` `--color-human-bg` `--color-human-text` `--color-text-secondary` `--focus-ring` `--focus-ring-offset` `--font-sans` `--leading-label` `--radius-full` `--space-1` `--space-2` `--space-3` `--text-small` `--text-xs` `--transition-fast` `--weight-medium`
<!-- /GENERATED:API -->
