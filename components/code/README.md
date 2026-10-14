---
name: Code
category: Content
status: stable
summary: Inline code, keyboard keys, and always-dark code blocks with gate-checked syntax colors that also style Prism and highlight.js output.
---

# Code

The technical-craft register. Code blocks are **always dark**, even on light pages; every syntax color is checked at ≥4.5:1 on `--code-bg`. Syntax classes are provided in three spellings — `.mp-syntax-*`, Prism's `.token.*` and highlight.js's `.hljs-*` — so you can drop in highlighter output unchanged.

## Examples

### Inline code and keys

```html
<p class="type-body">Run <code class="mp-code">npm run build:system</code>, then press <kbd class="mp-kbd">Ctrl</kbd> + <kbd class="mp-kbd">R</kbd> to reload.</p>
```

### Code block

```html
<figure class="mp-code-block">
  <figcaption class="mp-code-block__header"><span>button.css</span><span>CSS</span></figcaption>
  <pre tabindex="0"><code><span class="mp-syntax-comment">/* Consume the semantic tier */</span>
<span class="mp-syntax-keyword">.cta</span> {
  <span class="mp-syntax-function">background</span>: var(<span class="mp-syntax-string">--color-action-primary</span>);
  <span class="mp-syntax-function">min-height</span>: <span class="mp-syntax-number">44</span>px;
}</code></pre>
</figure>
```

## Accessibility

- Scrollable `<pre>` gets `tabindex="0"` so keyboard users can scroll it; the focus ring is drawn on the block.
- Use `<figure>` + `<figcaption>` for the file name so it's announced with the code.
- `<kbd>` for keys the user presses, `<code>` for literal code — screen readers can distinguish them.

## API

<!-- GENERATED:API -->
_Generated from `code.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-code` | root |
| `.mp-kbd` | root |
| `.mp-code-block` | root |
| `.mp-syntax-keyword` | root |
| `.mp-syntax-string` | root |
| `.mp-syntax-function` | root |
| `.mp-syntax-number` | root |
| `.mp-syntax-comment` | root |
| `.mp-code-block__header` | part of `.mp-code-block` |

**States styled** — `:focus-visible`

**Design tokens consumed** — `--border-width-medium` `--border-width-thin` `--code-bg` `--code-border` `--code-comment` `--code-function` `--code-keyword` `--code-number` `--code-string` `--code-text` `--color-bg-secondary` `--color-bg-tertiary` `--color-border-emphasis` `--color-text-primary` `--elevation-raised` `--focus-ring` `--focus-ring-offset` `--font-mono` `--leading-code` `--leading-small` `--radius-md` `--radius-sm` `--space-3` `--space-4` `--space-5` `--space-6` `--text-code` `--text-xs`
<!-- /GENERATED:API -->
