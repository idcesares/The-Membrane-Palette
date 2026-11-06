# States and recovery

Start with [Progress](../../components/progress/README.md), [Skeleton](../../components/skeleton/README.md), [Empty state](../../components/empty-state/README.md), [Alert](../../components/alert/README.md) and [Toast](../../components/toast/README.md). State feedback belongs beside the part of the task it describes. Use one clear message rather than several competing announcements.

The [resource explorer](../../examples/resource-explorer.html) uses local illustrative resources to demonstrate loading, cancellation, retry, empty content, no matches and partial results. These are simulated states, not evidence of a remote service. The [form journey](../../examples/form-journey.html) demonstrates a recoverable local completion failure.

| State | What to communicate | Recovery and focus |
|---|---|---|
| Loading | What is being prepared; measurable progress if available | Preserve query, filters, answers and existing useful content. Mark the affected region busy; leave unrelated controls usable. |
| Cancelled | The wait stopped; what remains available | Keep the current inputs and last usable view. Offer a deliberate restart; ignore any stale completion from the cancelled attempt. |
| Empty collection | What belongs here and why none is available | Explain a meaningful next step. Clearing filters cannot fix a genuinely empty collection. |
| No results | No items match the current query/filter combination | Keep the query visible. Offer clear filters or a revised search; do not silently reset someone's choices. |
| Recoverable error | What failed, what remains intact and what can happen next | Offer retry for a transient problem and edit for a correctable one. Keep the error until recovery succeeds or the person dismisses it knowingly. |
| Partial result | Which content is available and which part failed or is missing | Keep the usable portion, label its limits and offer retry for the missing part. Do not imply the collection is complete. |
| Success | The operation that actually completed | Keep important results on the page. A toast can supplement them without taking focus. |

## Match the wait to what is known

Follow [the existing motion and loading contract](../../DESIGN-SYSTEM.md#85-component-recipes): avoid flashing a loader for waits below roughly 300ms; use a spinner for short unknown work, a skeleton when the incoming shape is known and native determinate `progress` when progress is measurable. Keep an appearing loader visible for roughly 500ms to avoid flicker. These are presentation heuristics, not reasons to delay a result or invent progress percentages.

For a longer wait, explain what is happening and make cancellation available when the operation can actually stop. A cancelled visual wait must not later replace the page with an obsolete result. In a real service, explain whether cancellation stops server work or only stops waiting for its response. Use the component's reduced-motion behavior; an animation alone conveys neither status nor progress.

## Announce the outcome, preserve the task

Use a persistent polite status region for routine results or progress summaries. Do not announce every keystroke or animation frame. Avoid multiple live regions repeating the same message; reserve assertive alerts for urgent failures that need immediate attention. `aria-busy` describes the updating region, rather than the whole page by default.

Background filtering should leave focus on the search/filter control. A person choosing a new step may need focus on that step's heading; a failed form continuation needs its [error summary](forms.md). If an update removes the focused result or control, put focus on a surviving logical control and explain the change. Preserve the selected resource when it still exists; explain when it no longer belongs to the result set.

An error message needs an action that can work. Retry the same operation with retained input, and report repeated failure honestly. Real services must handle uncertain outcomes before retrying a potentially duplicated action. Keep consequential information inline; a transient toast must never be the only record or recovery route.

References: Fluent's [Wait UX](https://fluent2.microsoft.design/wait-ux), Carbon's [empty-state guidance](https://www.carbondesignsystem.com/building-blocks/core/patterns/empty-states) and Atlassian's [message design guidance](https://atlassian.design/foundations/content/designing-messages/). They inform timing, placement and recovery decisions without changing Membrane's component contracts.
