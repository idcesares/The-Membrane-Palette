---
name: Table
category: Content
status: stable
summary: Data tables with a quiet uppercase header, tabular numerals, end-aligned numbers, compact/striped/interactive variants and a scrolling frame.
---

# Table

For genuinely tabular data. Numbers use tabular figures so columns line up; numeric cells take `data-align="end"`.

## Examples

### Table in a scrolling frame

```html
<div class="mp-table-wrap" tabindex="0" role="region" aria-labelledby="table-cohorts-caption">
  <table class="mp-table" data-variant="interactive">
    <caption id="table-cohorts-caption">Cohorts, 2026</caption>
    <thead>
      <tr><th scope="col">Cohort</th><th scope="col">Format</th><th scope="col" data-align="end">Learners</th><th scope="col">Status</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row">AI Literacy I</th><td>Online</td><td data-align="end">1,240</td><td><span class="mp-badge" data-tone="success">Live</span></td></tr>
      <tr><th scope="row">Prompting for Teachers</th><td>Hybrid</td><td data-align="end">318</td><td><span class="mp-badge" data-tone="info">Enrolling</span></td></tr>
      <tr><th scope="row">Developers' Lab</th><td>In person</td><td data-align="end">42</td><td><span class="mp-badge">Draft</span></td></tr>
    </tbody>
  </table>
</div>
```

### Compact and striped

```html
<div class="mp-table-wrap">
  <table class="mp-table" data-density="compact" data-variant="striped">
    <caption class="mp-visually-hidden">Contrast checks by surface</caption>
    <thead>
      <tr><th scope="col">Token</th><th scope="col">Surface</th><th scope="col" data-align="end">Ratio</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row"><code class="mp-code">--color-human-text</code></th><td>Card</td><td data-align="end">5.02</td></tr>
      <tr><th scope="row"><code class="mp-code">--color-error-text</code></th><td>Card</td><td data-align="end">4.94</td></tr>
      <tr><th scope="row"><code class="mp-code">--color-warning-text</code></th><td>Card</td><td data-align="end">5.15</td></tr>
      <tr><th scope="row"><code class="mp-code">--color-info-text</code></th><td>Page</td><td data-align="end">7.03</td></tr>
    </tbody>
  </table>
</div>
```

## Accessibility

- Always include a `<caption>` (it can be visually hidden with `.mp-visually-hidden`) and `scope` on header cells.
- A scrolling `.mp-table-wrap` gets `tabindex="0"`, `role="region"` and a label so keyboard users can scroll it.
- Never use tables for layout — use [Layout](../layout/README.md) primitives.

## API

<!-- GENERATED:API -->
_Generated from `table.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-table-wrap` | root |
| `.mp-table` | root |

**Attributes**

| Attribute | Values |
|---|---|
| `data-align` | `end` |
| `data-density` | `compact` |
| `data-variant` | `striped` · `interactive` |

**States styled** — `:focus-visible` `:hover`

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-table-max-height` | `none` |
| `--mp-table-cell-padding` | `var(--space-3) var(--space-4)` |

**Design tokens consumed** — `--border-default` `--color-bg-hover` `--color-bg-secondary` `--color-text-primary` `--color-text-secondary` `--color-text-tertiary` `--focus-ring` `--focus-ring-offset` `--font-sans` `--leading-small` `--radius-md` `--space-2` `--space-3` `--space-4` `--text-small` `--text-xs` `--tracking-label` `--weight-semibold`
<!-- /GENERATED:API -->
