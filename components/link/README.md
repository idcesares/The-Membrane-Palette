---
name: Link
category: Actions
status: stable
summary: Text links — inline, quiet and standalone call-to-action — plus the skip link every page should start with.
---

# Link

Links navigate. They are teal (the digital, navigational register) and always underlined, so color is never the only cue.

## When to use

- `.mp-link` — inline links in UI copy.
- `data-variant="quiet"` — links inside metadata that should take the surrounding text color.
- `data-variant="standalone"` — a "Read more →" style call-to-action on its own line.
- `.mp-skip-link` — the first element in `<body>`, pointing at `<main id="…">`.

## When not to use

- Inside `.mp-prose` you don't need the class — bare `<a>` is already styled.
- If activating it changes something on this page, it's a [Button](../button/README.md).

## Examples

### Inline, quiet, standalone

```html
<div class="mp-stack" data-gap="2">
  <p class="type-body">Read the <a class="mp-link" href="#components">design principles</a> before proposing a new token.</p>
  <p class="type-small">Updated 3 days ago by <a class="mp-link" data-variant="quiet" href="#components">Isaac</a></p>
  <a class="mp-link" data-variant="standalone" href="#components">Explore the case study</a>
</div>
```

## Skip link

Make it the first child of `<body>`; it targets the `id` of your `<main>`:

```text
<body>
  <a class="mp-skip-link" href="#main">Skip to content</a>
  <header class="mp-navbar">…</header>
  <main id="main">…</main>
</body>
```

## Accessibility

- Link text must make sense out of context: "Explore the case study", not "click here".
- The standalone arrow is decorative (`content: "→" / ""` has empty alt text), so screen readers don't read "right arrow".
- The skip link is off-screen until focused, then slides into view.

## API

<!-- GENERATED:API -->
_Generated from `link.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-link` | root |
| `.mp-skip-link` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-variant` | `quiet` · `standalone` |

**States styled** — `:focus-visible` `:hover`

**Design tokens consumed** — `--border-width-thin` `--color-bg-inverse` `--color-text-accent` `--color-text-inverse` `--focus-ring` `--focus-ring-offset` `--font-sans` `--radius-md` `--radius-sm` `--size-touch-target` `--space-1` `--space-2` `--space-3` `--space-4` `--space-8` `--text-small` `--transition-fast` `--weight-medium` `--weight-semibold` `--z-tooltip`
<!-- /GENERATED:API -->
