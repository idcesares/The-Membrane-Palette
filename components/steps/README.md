---
name: Steps
category: Navigation
status: stable
summary: Progress through an ordered sequence — course modules, onboarding, a multi-page form — vertical or horizontal, with complete, current and upcoming steps.
---

# Steps

The learning journey made visible. Completed steps turn teal with a check, the current step gets a terracotta ring (where the person is — the human register), upcoming steps stay neutral. Vertical by default, which fits module lists with descriptions; `data-orientation="horizontal"` for short checkout-style flows.

## Examples

### Course modules

```html
<ol class="mp-steps" aria-label="Course progress">
  <li class="mp-steps__item" data-status="complete">
    <p class="mp-steps__label">Start from the classroom<span class="mp-visually-hidden"> (completed)</span></p>
    <p class="mp-steps__description">Map one real problem before touching a tool.</p>
  </li>
  <li class="mp-steps__item" aria-current="step">
    <p class="mp-steps__label">How models actually work</p>
    <p class="mp-steps__description">Tokens, context, and why confident answers can be wrong.</p>
  </li>
  <li class="mp-steps__item">
    <p class="mp-steps__label">Design the assistant</p>
    <p class="mp-steps__description">Co-create the prompts with your students.</p>
  </li>
</ol>
```

### Horizontal

```html
<ol class="mp-steps" data-orientation="horizontal" aria-label="Enrolment">
  <li class="mp-steps__item" data-status="complete"><p class="mp-steps__label">Account<span class="mp-visually-hidden"> (completed)</span></p></li>
  <li class="mp-steps__item" data-status="complete"><p class="mp-steps__label">Cohort<span class="mp-visually-hidden"> (completed)</span></p></li>
  <li class="mp-steps__item" aria-current="step"><p class="mp-steps__label">Payment</p></li>
  <li class="mp-steps__item"><p class="mp-steps__label">Done</p></li>
</ol>
```

## Accessibility

- An `<ol>` with an `aria-label` announces "list, 3 items" and each position.
- `aria-current="step"` marks — and styles — the current step.
- Completion isn't an ARIA state, so completed steps carry visually hidden text, "(completed)", in addition to `data-status="complete"`.
- Steps are a progress indicator, not navigation; if steps are clickable, put a link inside `.mp-steps__label`.

## API

<!-- GENERATED:API -->
_Generated from `steps.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-steps` | root |
| `.mp-steps__item` | part of `.mp-steps` |
| `.mp-steps__label` | part of `.mp-steps` |
| `.mp-steps__description` | part of `.mp-steps` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-status` | `complete` |
| `data-orientation` | `horizontal` |

**States styled** — `[aria-current="step"]`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-steps-marker` | `2rem` |
| `--mp-steps-ring` | `var(--color-border-input)` |
| `--mp-steps-line` | `var(--color-border-default)` |

**Design tokens consumed** — `--border-width-medium` `--border-width-thin` `--color-action-primary` `--color-action-secondary` `--color-bg-primary` `--color-border-default` `--color-border-input` `--color-human-bg` `--color-human-text` `--color-text-on-accent` `--color-text-primary` `--color-text-secondary` `--font-sans` `--leading-small` `--radius-full` `--space-1` `--space-2` `--space-4` `--space-6` `--text-small` `--weight-medium` `--weight-semibold`
<!-- /GENERATED:API -->
