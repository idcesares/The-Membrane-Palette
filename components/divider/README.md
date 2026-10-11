---
name: Divider
category: Content
status: stable
summary: A fading hairline between sections — or a full-width solid rule inside panels. Prefer whitespace first.
exempt: data-size
---

# Divider

The system prefers generous spacing (`--space-16`–`--space-24`) over visible lines. When a line genuinely helps, the default divider fades at both ends and stays within `--container-sm`, which reads as intentional rather than utilitarian.

`data-size` sets the vertical space around the rule: `sm` → `--space-8`, default → `--space-16`, `lg` → `--space-24`.

## Examples

### Fading and full

```html
<div>
  <p class="type-small">Section one</p>
  <hr class="mp-divider" data-size="sm">
  <p class="type-small">Section two</p>
  <hr class="mp-divider" data-variant="full" data-size="sm">
  <p class="type-small">Section three</p>
</div>
```

## Accessibility

- `<hr>` is announced as a separator — use it for thematic breaks. For purely visual lines use a `<div class="mp-divider" role="presentation">`.

## API

<!-- GENERATED:API -->
_Generated from `divider.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-divider` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-size` | `sm` · `lg` |
| `data-variant` | `full` |

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-divider-space` | `var(--space-16)` |

**Design tokens consumed** — `--border-width-thin` `--color-border-default` `--container-sm` `--gradient-divider` `--space-16` `--space-24` `--space-8`
<!-- /GENERATED:API -->
