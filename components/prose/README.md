---
name: Prose
category: Layout
status: stable
summary: One class that styles long-form HTML — articles, Markdown output, CMS content — with the full typographic system.
---

# Prose

Add `.mp-prose` to the element that wraps rendered Markdown or CMS HTML. Headings get Fraunces, body gets Instrument Sans, code gets the always-dark block treatment, and the line length is capped at `--measure` (65ch).

Every inner selector is wrapped in `:where()`, so the whole component has the specificity of one class — any rule you write wins.

## When to use

- Blog posts, documentation pages, case studies: anything authored as Markdown or rich text where you don't control the markup.

## When not to use

- Application UI. Use the specific components (`.mp-card`, `.mp-alert`, …) instead — prose styles bare elements and would fight them.

## Examples

### Article body

```html
<article class="mp-prose">
  <h2>Translation, not decoration</h2>
  <p>Every element should answer one question: <strong>what does this translate?</strong> If it cannot, it does not belong. Read the <a href="#prose-notes">notes</a> for the full argument.</p>
  <ul>
    <li>Warm surfaces for human moments</li>
    <li>Cool precision for systems and code</li>
  </ul>
  <blockquote>Learning happens best when people build things that matter to them.</blockquote>
  <p id="prose-notes">Inline <code>code</code> keeps the builder register visible without taking over the paragraph.</p>
</article>
```

## Accessibility

- Keeps a 65-character measure and 1.6 line height for sustained reading (WCAG 1.4.8 guidance).
- Links stay underlined inside prose — color alone never marks a link.
- Code blocks that can scroll sideways need `tabindex="0"` on the `<pre>` so keyboard users can scroll them (most Markdown renderers let you add it in a post-process step).

## API

<!-- GENERATED:API -->
_Generated from `prose.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-prose` | root |

**States styled** — `:focus-visible` `:hover`

**Design tokens consumed** — `--border-default` `--border-width-thick` `--border-width-thin` `--code-bg` `--code-border` `--code-text` `--color-action-primary` `--color-bg-tertiary` `--color-text-accent` `--color-text-primary` `--color-text-secondary` `--color-text-tertiary` `--focus-ring` `--focus-ring-offset` `--font-mono` `--font-sans` `--font-serif` `--gradient-divider` `--leading-body` `--leading-body-lg` `--leading-code` `--leading-heading` `--leading-small` `--leading-subheading` `--measure` `--radius-lg` `--radius-md` `--radius-sm` `--space-12` `--space-2` `--space-3` `--space-5` `--space-6` `--text-body` `--text-body-lg` `--text-code` `--text-h1` `--text-h2` `--text-h3` `--text-h4` `--text-small` `--tracking-heading` `--tracking-subheading` `--weight-bold` `--weight-semibold`
<!-- /GENERATED:API -->
