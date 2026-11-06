# Explaining data

Start with [Table](../../components/table/README.md), [Chart](../../components/chart/README.md) and [Stat](../../components/stat/README.md). The [existing visualization rules](../../DESIGN-SYSTEM.md#74-data-visualization) remain authoritative: ordered categorical slots 1–6, fixed colors per entity, no cycling, at most two series for scatter/bubble/maps, semantic status colors and readable values independent of color. This guide adds the explanation around those marks.

## Choose the comparison first

| Question | Useful representation | Interpretation requirement |
|---|---|---|
| What is the exact value? | Table or a single Stat with context | Include units, definition, time and denominator when relevant. |
| Which category is larger? | Labelled bar list | Use a common baseline, usually zero; keep meaningful sorting explicit. |
| How does a quantity change over time? | Line chart supplied by the product, within the Chart shell | Use an honest time axis and distinguish missing intervals from zero. The library supplies no line-chart engine. |
| How do parts make a whole? | Labelled stacked bars, or a table | Define the whole and check whether parts sum to it. For precise cross-category comparison, separate bars may be easier. |
| Is there a relationship between two measures? | Scatter plot supplied by the product, with a table equivalent | Name both measures, explain the observation unit and avoid claiming causality from association. |

Use one y-axis per chart. Do not use decorative area, a second axis or a truncated bar baseline to make a small difference seem large. A chart is optional when a short sentence and a table answer the question more clearly.

## Put interpretation beside the evidence

Give each figure a descriptive title, a brief explanation of the meaningful comparison and a caption containing provenance or a nearby source link. State:

- **Measure and unit:** count, percentage, currency, duration or rate; define numerator and denominator. A change from 40% to 50% is 10 percentage points, or 25% relative growth.
- **Scope and time:** population, inclusion/exclusion rules, period, time zone where relevant and the last update. A cumulative total and a period total are different measures.
- **Source and transformation:** where the data came from, how it was aggregated and whether values were rounded, normalized or estimated.
- **Missingness:** distinguish zero, not collected, unavailable and not applicable. Do not turn absent data into a zero-height mark or connect a line across a gap without explaining it.
- **Uncertainty and limits:** name estimates, ranges, sample size or coverage limits. Explain what an interval represents and what the data cannot establish.

For example: **ILLUSTRATIVE — hypothetical data, not a study finding.** “In this invented sample, 50 of 100 local records use format A (50%), for January–March 2026. Ten additional records have no format and are excluded from that denominator. Source: authored demonstration data; no population inference.” Keep the illustrative label in the visible figure, table, screenshot and export. Never attribute these figures to Isaac or a real institution.

## Preserve access to the values

Label a figure with its title and use a caption for context. Native tables need a useful caption and header relationships (`th` and `scope` for simple tables). Keep text in text tokens rather than series colors. A legend or direct labels identify series; color alone cannot do that work.

The built-in HTML bar list prints every value and is already readable as text; it needs neither a tooltip nor a redundant table. Richer plotted charts need a keyboard/focus equivalent to hover information and a table view, as required by the specification. A canvas or image needs an accessible name and a meaningful text/data equivalent; “chart” is not a sufficient description. Verify theme changes, forced colors and data filtering without remapping entity colors.

References: Carbon's [chart types](https://www.carbondesignsystem.com/building-blocks/data-visualization/simple-charts). These support chart semantics and interpretation; they do not replace Membrane's palette rules or establish conformance for a product.
