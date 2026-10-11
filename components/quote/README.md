---
name: Quote
category: Content
status: stable
summary: Blockquote with attribution in Fraunces italic; the pull variant renders the brand's signature phrases large and centered.
---

# Quote

Quotes are the human register at its most literal: Fraunces italic, terracotta rule. Use the `figure` + `figcaption` structure so the attribution is programmatically tied to the quote.

## Examples

### Blockquote

```html
<figure class="mp-quote">
  <blockquote class="mp-quote__text">
    <p>The role of the teacher is to create the conditions for invention rather than provide ready-made knowledge.</p>
  </blockquote>
  <figcaption class="mp-quote__source">— <cite>Seymour Papert</cite>, <i>Mindstorms</i></figcaption>
</figure>
```

### Pull quote

```html
<figure class="mp-quote" data-variant="pull">
  <blockquote class="mp-quote__text"><p>Human intelligence, amplified with technological intentionality.</p></blockquote>
</figure>
```

## Accessibility

- Put the attribution in `<figcaption>`, not inside the `<blockquote>` — only quoted words belong in the quote.
- Pull quotes that repeat body text should be `aria-hidden="true"` to avoid reading the sentence twice.

## API

<!-- GENERATED:API -->
_Generated from `quote.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-quote` | root |
| `.mp-quote__text` | part of `.mp-quote` |
| `.mp-quote__source` | part of `.mp-quote` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-variant` | `pull` |

**Design tokens consumed** — `--border-width-thick` `--color-action-primary` `--color-human-text` `--color-text-primary` `--color-text-secondary` `--container-sm` `--font-sans` `--font-serif` `--leading-body-lg` `--leading-heading` `--leading-small` `--space-12` `--space-3` `--space-6` `--space-8` `--text-body-lg` `--text-h2` `--text-small` `--tracking-heading` `--weight-medium` `--weight-regular` `--weight-semibold`
<!-- /GENERATED:API -->
