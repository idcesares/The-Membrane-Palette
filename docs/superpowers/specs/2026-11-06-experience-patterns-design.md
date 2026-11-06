# Membrane experience patterns

## Approved intent

Extend Membrane from complete visual compositions to complete interactions. The user approved recommendations drawn from GOV.UK, Carbon, Material, Fluent, Atlassian and USWDS. Prioritize task patterns, state/recovery guidance and visible accessibility evidence; demonstrate them together in a bilingual resource explorer. Preserve existing sources and framework-free component contracts.

## Deliverables and boundaries

- Two local-only interactive references: `examples/resource-explorer.html` and `examples/form-journey.html`, each with its own JS and token-based CSS. Both support English/pt-BR, visible sample labels, native controls and useful noscript guidance.
- Explorer: six actual Membrane reference links with localized catalog copy; explicit search/topic filters; adaptive list/detail preserving selection; loading, cancellation, no results, empty collection, partial availability and recoverable failure. A collapsed example-state panel controls deterministic local simulations. No external dependencies or data collection.
- Form: learning goal + format, focusable linked error summary, retained answers, review/edit, simulated submission failure/retry and honest local confirmation. No request is transmitted or durably saved.
- Guides under `docs/patterns/`: forms, states/recovery, component/message selection, adaptation, data explanation, optional AI interaction design, incremental adoption.
- Evidence inventory under `docs/accessibility/`: five interactive components and the two patterns, exact automated coverage references and explicit untested manual screen-reader/usability status. API maturity is distinguished from usability evidence.
- Improve contribution criteria and replace the rigid three-word action-label limit with concise, specific, localizable labels.
- Route everything through README, specification, showcase, generated index and deployed docs. Existing component/token API remains unchanged; AI recommendations are guidance, without an AI backend.

## Validation

Write browser behavior tests first. Exercise language changes without losing state, validation focus and retained answers, retry/cancel behavior, filter preservation, mobile back navigation and resizing, keyboard operation, no third-party requests, both themes and 200% text. Existing page discovery extends axe/link/phone checks to both references. Test every sample state with axe, not only the initial render. Verify evidence links and prevent a manual-tested record without a real dated scenario and environment. Inspect desktop/mobile renders and print remains scoped to the existing deck.

## Implementation choices

Use existing `mp-*` controls and local `composition-*` geometry. Demo-only controls stay in a labeled collapsed panel. Scripts update UI with `textContent` and native attributes. Local failure simulations are deterministic and accurately labeled. Guidance uses the researched official primary sources while retaining Membrane's visual identity and factual authorities.
