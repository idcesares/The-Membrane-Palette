---
name: Avatar
category: Content
status: stable
summary: A person as a warm-filtered photo or Fraunces initials; digital tone uses monospace for bots and systems. Groups overlap.
---

# Avatar

Photos get the brand's `--photo-warmth` filter automatically. Without a photo, initials sit on a human-register wash; agents, bots and services use `data-tone="digital"` (teal, monospace) so people and systems are visibly different.

## Examples

### Sizes and tones

```html
<div class="mp-cluster">
  <span class="mp-avatar" data-size="sm" role="img" aria-label="Ana Lima">AL</span>
  <span class="mp-avatar" role="img" aria-label="Isaac D'Césares">ID</span>
  <span class="mp-avatar" data-size="lg" role="img" aria-label="Rafael Costa">RC</span>
  <span class="mp-avatar" data-size="xl" data-tone="digital" role="img" aria-label="Course assistant (AI)">AI</span>
</div>
```

### Group

```html
<div class="mp-avatar-group" role="group" aria-label="Facilitators">
  <span class="mp-avatar" role="img" aria-label="Ana Lima">AL</span>
  <span class="mp-avatar" role="img" aria-label="Bruno Reis">BR</span>
  <span class="mp-avatar" data-tone="digital" role="img" aria-label="Course assistant (AI)">AI</span>
</div>
```

## Accessibility

- Photo: `<span class="mp-avatar"><img src="…" alt="Isaac D'Césares"></span>`. If the name is printed right next to it, use `alt=""`.
- Initials: give the wrapper `role="img"` and an `aria-label` with the full name.

## API

<!-- GENERATED:API -->
_Generated from `avatar.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-avatar` | root |
| `.mp-avatar-group` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-size` | `sm` · `lg` · `xl` |
| `data-tone` | `digital` |

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-avatar-size` | `2.5rem` |

**Design tokens consumed** — `--border-width-medium` `--color-bg-primary` `--color-digital-bg` `--color-digital-text` `--color-human-bg` `--color-human-text` `--font-mono` `--font-serif` `--photo-warmth` `--radius-full` `--weight-semibold`
<!-- /GENERATED:API -->
