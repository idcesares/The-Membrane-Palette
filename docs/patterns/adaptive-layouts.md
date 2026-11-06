# Adaptive task layouts

Start with [Layout](../../components/layout/README.md): container, stack, cluster and grid provide the basic structure. Use the existing [spacing and breakpoint vocabulary](../../DESIGN-SYSTEM.md#4-spacing-system) and logical CSS properties. Local composition CSS can change arrangement when content stops fitting; it must not create a new library API or redefine design tokens.

## Adapt the task, preserve its state

The [resource explorer](../../examples/resource-explorer.html) pairs a filtered list with the selected resource's detail. On a wide canvas, both can be visible. On a narrow canvas, stack them in a readable order or use a deliberate list/detail transition with a visible return action. The right arrangement depends on whether people need to compare results or concentrate on one item.

Keep query, filters, selection and useful results when the viewport changes. Resizing must not restart a request, clear a form or select a different record. Avoid duplicate interactive copies of the same content for different breakpoints. DOM order should remain a sensible reading and keyboard order in every layout; visual rearrangement must not make focus jump across the page.

| Situation | Adaptation | State and access requirement |
|---|---|---|
| List and detail fit comfortably | Show both with clear headings and a visible selected item | Keep the relationship explicit with text/state, rather than color alone. |
| Space is constrained | Stack list and detail, or show one pane with a return route | An intentional detail transition can focus its heading; returning should reach the selected result. Keep focus during resize when its control remains visible; if its pane becomes hidden, move focus to a meaningful visible heading or control. |
| Filters wrap to several lines | Let controls wrap; move secondary controls after the main search | Keep labels visible, controls reachable and the apply/clear action understandable. |
| A selected result leaves the filtered set | Explain the selection change and offer a usable result route | Do not leave a hidden focused control or detail that appears to belong to the new results. |
| Content is dense or enlarged | Reflow text, labels and panels before reducing type | Preserve required qualifiers and actions; avoid horizontal page scrolling. A wide data table may need its own labelled scroll region. |

The reference shows one possible local composition. It is not a universal master/detail component or a promise of persisted browser history. If a product adds routing, define back behavior, deep links and selection restoration explicitly.

## Treat language as part of layout

Both task references include English and pt-BR. Set `html.lang` when the language changes; translate visible and accessible names, status messages, errors, result counts and illustrative-content notices together. Keep stable resource IDs and option values separate from their displayed labels so language changes preserve task state.

Budget for Portuguese expansion, but inspect real translations rather than relying on a percentage. Keep action labels short, allow supporting text to wrap and format actual dates/numbers with `Intl`. Do not truncate a label that someone needs to choose correctly. Keyboard focus should remain on the language selector during a language change unless that control genuinely disappears.

Inspect both themes at 360px, a wide viewport and enlarged text; try a long label, an empty state and an error, not only the default results. Check reduced motion and touch targets. Use the [composition rubric](../composition/rubric.md) and record outstanding manual checks in the [evidence inventory](../accessibility/README.md).

Reference: Material's [canonical layout examples](https://m3.material.io/foundations/layout/canonical-examples/overview) describe feed, list-detail and supporting-pane arrangements. Apply the principle of adapting to available space using Membrane's tokens and visual language.
