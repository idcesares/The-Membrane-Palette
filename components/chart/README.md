---
name: Chart
category: Content
status: beta
summary: A figure shell (title, legend, caption) and a CSS bar list — single, multi-series or stacked — colored by the validated --color-chart-* palette, with every value printed.
---

# Chart

Most numbers in an education product are "one value per category": completion by cohort, enrollment by format. `.mp-chart` renders those as horizontal bars from plain HTML — no library, no canvas, readable by screen readers as a list — and gives any richer chart (from a charting library) the same frame: title, legend and caption.

## Color rules

The six series colors are a **validated categorical palette**, not picks: each light and dark step was searched for, then checked for lightness band, chroma floor, color-blind separation between neighbors (worst ΔE 11.5 in OKLab ×100, target ≥ 8), normal-vision separation (≥ 16) and ≥ 3:1 contrast on page and card surfaces. The contrast part is enforced by the token build.

| Slot | Token | Hue |
|---|---|---|
| 1 | `--color-chart-1` | terracotta — the brand's lead series |
| 2 | `--color-chart-2` | teal |
| 3 | `--color-chart-3` | amber |
| 4 | `--color-chart-4` | burgundy |
| 5 | `--color-chart-5` | steel blue |
| 6 | `--color-chart-6` | green |

- **Assign in order, never cycle.** A 7th series folds into "Other" or the chart splits into small multiples.
- **Color follows the entity**: filtering out a series never repaints the survivors.
- **One series = slot 1 and no legend** — the title names it. Don't color bars by their value; bar length already shows it.
- **Scatter, bubble or maps** (any two marks can touch): at most **2 series** (slots 1–2). Slots 1 and 3 collapse for deuteranopes when they sit side by side.
- **Status meaning** (pass/fail, error rate) uses the status tokens (`--color-success`, `--color-error`…) with a label, never a chart slot.
- **Text never wears the series color** — labels and values stay in text tokens.

## Examples

### Single series

```html
<figure class="mp-chart" aria-labelledby="chart-completion-title">
  <div class="mp-chart__header">
    <p class="mp-chart__title" id="chart-completion-title">Course completion by cohort</p>
  </div>
  <ul class="mp-chart__bars">
    <li class="mp-chart__row"><span class="mp-chart__label">AI Literacy I</span><span class="mp-chart__track"><span class="mp-chart__fill" style="--mp-chart-value: 82%"></span></span><span class="mp-chart__value">82%</span></li>
    <li class="mp-chart__row"><span class="mp-chart__label">Prompting for Teachers</span><span class="mp-chart__track"><span class="mp-chart__fill" style="--mp-chart-value: 64%"></span></span><span class="mp-chart__value">64%</span></li>
    <li class="mp-chart__row"><span class="mp-chart__label">Developers' Lab</span><span class="mp-chart__track"><span class="mp-chart__fill" style="--mp-chart-value: 47%"></span></span><span class="mp-chart__value">47%</span></li>
  </ul>
  <figcaption class="mp-chart__caption">Learners who finished every module, 2026.</figcaption>
</figure>
```

### Stacked, with legend

```html
<figure class="mp-chart" aria-labelledby="chart-format-title">
  <div class="mp-chart__header">
    <p class="mp-chart__title" id="chart-format-title">Enrollment by format</p>
    <ul class="mp-chart__legend">
      <li class="mp-chart__key" data-series="1">Online</li>
      <li class="mp-chart__key" data-series="2">Hybrid</li>
      <li class="mp-chart__key" data-series="3">In person</li>
    </ul>
  </div>
  <ul class="mp-chart__bars">
    <li class="mp-chart__row"><span class="mp-chart__label">2024</span><span class="mp-chart__track"><span class="mp-chart__fill" data-series="1" style="--mp-chart-value: 40%"></span><span class="mp-chart__fill" data-series="2" style="--mp-chart-value: 25%"></span><span class="mp-chart__fill" data-series="3" style="--mp-chart-value: 35%"></span></span><span class="mp-chart__value">40 · 25 · 35%</span></li>
    <li class="mp-chart__row"><span class="mp-chart__label">2025</span><span class="mp-chart__track"><span class="mp-chart__fill" data-series="1" style="--mp-chart-value: 52%"></span><span class="mp-chart__fill" data-series="2" style="--mp-chart-value: 28%"></span><span class="mp-chart__fill" data-series="3" style="--mp-chart-value: 20%"></span></span><span class="mp-chart__value">52 · 28 · 20%</span></li>
    <li class="mp-chart__row"><span class="mp-chart__label">2026</span><span class="mp-chart__track"><span class="mp-chart__fill" data-series="1" style="--mp-chart-value: 61%"></span><span class="mp-chart__fill" data-series="2" style="--mp-chart-value: 27%"></span><span class="mp-chart__fill" data-series="3" style="--mp-chart-value: 12%"></span></span><span class="mp-chart__value">61 · 27 · 12%</span></li>
  </ul>
</figure>
```

### All six series

```html
<figure class="mp-chart" aria-labelledby="chart-palette-title">
  <div class="mp-chart__header">
    <p class="mp-chart__title" id="chart-palette-title">Learners by region</p>
    <ul class="mp-chart__legend">
      <li class="mp-chart__key" data-series="1">Sudeste</li>
      <li class="mp-chart__key" data-series="2">Nordeste</li>
      <li class="mp-chart__key" data-series="3">Sul</li>
      <li class="mp-chart__key" data-series="4">Norte</li>
      <li class="mp-chart__key" data-series="5">Centro-Oeste</li>
      <li class="mp-chart__key" data-series="6">Exterior</li>
    </ul>
  </div>
  <ul class="mp-chart__bars">
    <li class="mp-chart__row"><span class="mp-chart__label">2026</span><span class="mp-chart__track"><span class="mp-chart__fill" data-series="1" style="--mp-chart-value: 38%"></span><span class="mp-chart__fill" data-series="2" style="--mp-chart-value: 22%"></span><span class="mp-chart__fill" data-series="3" style="--mp-chart-value: 16%"></span><span class="mp-chart__fill" data-series="4" style="--mp-chart-value: 9%"></span><span class="mp-chart__fill" data-series="5" style="--mp-chart-value: 8%"></span><span class="mp-chart__fill" data-series="6" style="--mp-chart-value: 7%"></span></span><span class="mp-chart__value">100%</span></li>
  </ul>
  <figcaption class="mp-chart__caption">Shares of 3,214 learners. Legend order matches bar order.</figcaption>
</figure>
```

## Using the palette in a charting library

Read the tokens at runtime so charts follow the theme:

```text
const css = getComputedStyle(chartElement);
const series = [1, 2, 3, 4, 5, 6].map((n) => css.getPropertyValue(`--color-chart-${n}`).trim());
const grid = css.getPropertyValue('--color-border-default').trim();
const axisText = css.getPropertyValue('--color-text-secondary').trim();
```

`tokens/tokens.resolved.json` has the same values as plain hex for build-time use. Keep marks thin (2px lines, ≥ 8px markers), gridlines in `--color-border-default`, one y-axis per chart, and ship a hover tooltip and a table view for plotted charts.

## Accessibility

- Wrap in `<figure>` labelled by the title; add a `<figcaption>` for source or definitions.
- Every bar prints its value, so the list reads correctly as text and nothing depends on color.
- A legend is required whenever there are two or more series; keep its order equal to the bar order.
- Under Windows High Contrast, fills switch to the system text color so bars stay visible.

## API

<!-- GENERATED:API -->
_Generated from `chart.css` by `npm run build:components` — do not edit this section by hand._

**Classes**

| Class | Kind |
|---|---|
| `.mp-chart` | root |
| `.mp-chart__header` | part of `.mp-chart` |
| `.mp-chart__title` | part of `.mp-chart` |
| `.mp-chart__legend` | part of `.mp-chart` |
| `.mp-chart__key` | part of `.mp-chart` |
| `.mp-chart__bars` | part of `.mp-chart` |
| `.mp-chart__row` | part of `.mp-chart` |
| `.mp-chart__label` | part of `.mp-chart` |
| `.mp-chart__track` | part of `.mp-chart` |
| `.mp-chart__fill` | part of `.mp-chart` |
| `.mp-chart__value` | part of `.mp-chart` |
| `.mp-chart__caption` | part of `.mp-chart` |

**Attributes**

| Attribute | Values |
|---|---|
| `data-series` | `1` · `2` · `3` · `4` · `5` · `6` |

**Component tokens** (override on an instance to restyle it)

| Property | Default |
|---|---|
| `--mp-chart-bar` | `0.75rem` |
| `--mp-chart-color` | `var(--color-chart-1)` |
| `--mp-chart-value` | `0%` |

**Design tokens consumed** — `--border-width-thin` `--color-bg-hover` `--color-chart-1` `--color-chart-2` `--color-chart-3` `--color-chart-4` `--color-chart-5` `--color-chart-6` `--color-text-primary` `--color-text-secondary` `--color-text-tertiary` `--font-sans` `--leading-small` `--radius-sm` `--space-1` `--space-2` `--space-3` `--space-4` `--space-6` `--text-body` `--text-small` `--text-xs` `--weight-medium` `--weight-semibold`
<!-- /GENERATED:API -->
