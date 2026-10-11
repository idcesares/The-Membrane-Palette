---
name: Text
category: Layout
status: stable
summary: Tone (muted, subtle, human, digital) and reading measure for running copy — combine with the .type-* size classes instead of writing inline color or max-width.
---

# Text

Size comes from the typography composites in `tokens/base.css` (`.type-body-lg`, `.type-small`, …); `.mp-text` adds the two things pages otherwise hand-code: **which text color** and **how wide a line may run**. It also removes the default paragraph margin, because spacing belongs to the surrounding [Stack](../layout/README.md).

| Tone | Token | Use |
|---|---|---|
| *(none)* | inherits | body copy |
| `muted` | `--color-text-secondary` | ledes, descriptions |
| `subtle` | `--color-text-tertiary` | metadata, timestamps |
| `human` | `--color-human-text` | warm emphasis, overlines |
| `digital` | `--color-digital-text` | technical emphasis |

## Examples

### Tones and measure

```html
<div class="mp-stack" data-gap="2">
  <p class="mp-text type-label" data-tone="human">Workshop</p>
  <h3 class="type-h3">AI literacy, from the classroom up</h3>
  <p class="mp-text type-body-lg" data-tone="muted" data-measure>Six weeks for educators who want to use AI with intention — warm in how we teach, precise in how we build.</p>
  <p class="mp-text type-small" data-tone="subtle">Updated 3 days ago · <span class="mp-text" data-tone="digital">v2.1</span></p>
</div>
```

## Accessibility

- Every tone is a gate-checked text token (≥ 4.5:1 on page and card surfaces in both modes).
- `data-measure` keeps lines near 65 characters (WCAG 1.4.8 guidance for readable text).

## API

<!-- GENERATED:API -->
_Generated from `text.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-text` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-tone` | `muted` · `subtle` · `human` · `digital` |
| `data-measure` | boolean — presence enables it |

**Design tokens consumed** — `--color-digital-text` `--color-human-text` `--color-text-secondary` `--color-text-tertiary` `--measure`
<!-- /GENERATED:API -->
