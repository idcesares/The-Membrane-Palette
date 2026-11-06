# Adopt Membrane incrementally

Start with one real task and improve it in stages: principles → tokens → components → patterns. Each stage should produce something people can use and the team can review. An existing product does not need to replace every screen at once.

| Stage | First useful change | Evidence before expanding |
|---|---|---|
| Principles | Name the task, reading order, human/digital meaning and honest content boundaries | A concrete problem, existing alternatives and the context in which the change should help |
| Tokens | Apply semantic color, typography, spacing, focus and motion roles to a bounded surface | Both themes, contrast pairings, reduced motion, enlarged text and existing product CSS coexistence |
| Components | Replace a repeated control with the documented native markup and supported options | Real labels, keyboard/focus behavior, error and disabled states in the consuming product |
| Patterns | Connect components into entry/review/recovery or search/list/detail | Task completion evidence, recovery behavior, language adaptation and remaining limitations |

Use the [component-choice guide](choosing-components.md) and [working references](README.md) before inventing a new abstraction. Keep page-specific geometry local and preserve the existing brand marks, typography, warm surfaces and semantic register roles. A borrowed interaction principle does not require another system's visual identity.

## Distribution and compatibility

The currently supported consumer channel is the versioned jsDelivr CDN link documented in the [repository README](https://github.com/idcesares/The-Membrane-Palette/blob/master/README.md) and [specification](../../DESIGN-SYSTEM.md#61-using-the-library). Load `components/membrane.js` only where its documented behaviors are needed. npm publishing is not set up; package metadata and exports do not constitute an npm availability promise.

Start with a bounded page and inspect the effect of the bundled zero-specificity base styles on existing markup. The documented split stylesheets can help a deliberate integration, but load order and product overrides still require review. Pin a version, review release notes before upgrades and follow the existing deprecation policy for removed or renamed tokens, classes and attributes. Do not fork token values in a theme override to work around an integration issue.

## Decide from evidence

Record an owner, the affected contexts and the next review point. A pattern can be useful before user research is available; mark that evidence unknown instead of inventing findings. API `stable`/`beta` describes contract maturity, not whether people have successfully used the pattern in your setting.

Use the [lightweight proposal](../../CONTRIBUTING.md#proposing-a-pattern-or-component) for a repeated unmet need. Keep [accessibility evidence](../accessibility/README.md) with the shipped reference, including not-tested manual work. Expand adoption when the task works and known limitations are understood, rather than treating component coverage as a measure of user success.

Reference: the US Web Design System's [maturity model](https://designsystem.digital.gov/maturity-model/) describes incremental adoption through principles, guidance and code. Membrane adapts that progression to its own tokens, components and complete task patterns.
