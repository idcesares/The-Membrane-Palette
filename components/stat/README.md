---
name: Stat
category: Content
status: stable
summary: A headline metric — label, Fraunces numeral, and a delta whose arrow (trend) and color (sentiment) are set independently.
---

# Stat

For KPIs and impact numbers. The value is set in Fraunces with tabular lining figures; the delta's **arrow** comes from `data-trend` and its **color** from `data-sentiment`, because a falling number is good news for things like drop-out rate.

## Examples

### Stat row

```html
<div class="mp-grid" data-min="sm">
  <div class="mp-stat">
    <p class="mp-stat__label">Educators trained</p>
    <p class="mp-stat__value">3,214</p>
    <p class="mp-stat__delta" data-trend="up" data-sentiment="positive">18% vs. last year</p>
  </div>
  <div class="mp-stat">
    <p class="mp-stat__label">Drop-out rate</p>
    <p class="mp-stat__value">6.2%</p>
    <p class="mp-stat__delta" data-trend="down" data-sentiment="positive">2.1 pts since redesign</p>
  </div>
  <div class="mp-stat">
    <p class="mp-stat__label">Median session</p>
    <p class="mp-stat__value">41 min</p>
    <p class="mp-stat__delta" data-trend="down" data-sentiment="negative">4 min this term</p>
  </div>
</div>
```

## Accessibility

- The arrow is decorative (empty alt text); write the direction into the words when it matters ("up 18%", "2.1 pts lower").
- Color is never the only signal — the sentence carries the meaning.

## API

<!-- GENERATED:API -->
_Generated from `stat.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-stat` | root |
| `.mp-stat__label` | part of `.mp-stat` |
| `.mp-stat__value` | part of `.mp-stat` |
| `.mp-stat__delta` | part of `.mp-stat` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-trend` | `up` · `down` |
| `data-sentiment` | `positive` · `negative` |

**Design tokens consumed** — `--color-error-text` `--color-success-text` `--color-text-primary` `--color-text-secondary` `--font-sans` `--font-serif` `--leading-display` `--leading-small` `--space-1` `--text-h1` `--text-small` `--tracking-display` `--weight-bold` `--weight-medium`
<!-- /GENERATED:API -->
