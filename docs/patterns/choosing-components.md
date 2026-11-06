# Choosing components for the task

Start with semantic HTML and the [existing catalog](../../DESIGN-SYSTEM.md#63-catalog). A familiar-looking control can still communicate the wrong behavior. Choose by what the person is doing, then follow that component's README for its actual markup and supported options.

| Need | Start with | Decision boundary |
|---|---|---|
| Go somewhere | [Link](../../components/link/README.md), Navbar or Breadcrumb | A link has a destination. A button performs an action. |
| Perform one visible action | [Button](../../components/button/README.md) | Keep the main action visible; use one primary terracotta action per view. |
| Choose one of a few answers | [Choice radios](../../components/choice/README.md) | Radios expose alternatives for comparison; group them with a legend. |
| Choose one value from a longer closed list | [Native select](../../components/input/README.md) | Use when answers must belong to the list; do not substitute an action menu. |
| Type with suggestions | [Combobox](../../components/combobox/README.md) | Existing behavior permits free text. Do not assume it enforces membership in the suggestions. |
| Search a content collection | Search input + results list | The explorer uses content search, not a value-selection combobox. |
| Choose independent options | [Checkboxes](../../components/choice/README.md) | Use for answers committed with a form action. |
| Apply an immediate setting | [Switch](../../components/switch/README.md) | Its change takes effect immediately; describe that effect. |
| Offer secondary actions | [Menu](../../components/menu/README.md) | Use action items, not page navigation or form options. Do not hide the only route to a main task here. |
| Switch related views in place | [Tabs](../../components/tabs/README.md) | Use links for separate destinations; show content together when comparison matters. |
| Reveal optional supporting detail | [Accordion](../../components/accordion/README.md) | Keep required instructions and important errors visible. |
| Describe an ongoing page/section condition | [Alert](../../components/alert/README.md) | Inline, persistent context belongs near the affected content. |
| Briefly confirm a completed action | [Toast](../../components/toast/README.md) | Supplemental feedback; no focus theft and no sole copy of essential information. |
| Ask for a consequential decision | [Dialog](../../components/dialog/README.md) | Interrupt only when the decision must happen now; prefer inline task flow for substantial work. |
| Explain a term or icon briefly | [Tooltip](../../components/tooltip/README.md) | Essential instructions need visible text; tooltip content cannot be the only label. |
| Show a wait or no content | [Progress](../../components/progress/README.md), Skeleton, Empty state | Choose the correct [state and recovery](states-and-recovery.md), including no matches versus empty collection. |
| Compare exact quantities | [Table](../../components/table/README.md) or [Chart](../../components/chart/README.md) | A chart needs a comparison question; a headline number can use Stat. See [data explanations](data-explanations.md). |

## Check cost before adding a component

Try a plain list, visible text, native control or composition of existing components first. A new abstraction is useful when the same unmet need recurs and its interaction contract can be explained. Record that need and its evidence in the [contribution proposal](../../CONTRIBUTING.md#proposing-a-pattern-or-component). An unfamiliar case may call for local page composition rather than a new library API.

Follow [accessibility evidence](../accessibility/README.md) alongside API status: `stable` describes the library contract, while user research establishes whether this choice helps people in a particular context. Neither stable nor beta is a usability finding.

Reference: Atlassian's [message design guidance](https://atlassian.design/foundations/content/designing-messages/) connects message purpose, component choice and interruption cost. Membrane's own component contracts remain authoritative.
