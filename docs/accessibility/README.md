# Accessibility evidence and remaining checks

This inventory records where automated coverage exists and where human evidence is still missing. It is not a formal WCAG conformance statement, a certification or a claim that an entire product is accessible. A component's `stable` or `beta` API status does not describe its usability or assistive-technology validation.

The machine-readable inventory is [evidence.json](evidence.json). **Manual screen-reader and usability testing have not been performed for this inventory.** Every area therefore records `status: "not-tested"` and `lastTested: null` for those activities. No tester, browser version, screen-reader version or successful result has been inferred from automated checks.

## Automated coverage and dated results

`covered` means test code addresses the named scope. It does not mean the tests pass on every future revision. The [2026-11-06 local execution record](automated-run-2026-11-06.json) contains exact commands, engine versions, source hashes, outcomes and conditional skips. The initial full suite found one WebKit overflow failure; all 63 explorer checks passed across the three engines after its scoped correction. Latest outcomes across the full suite and that rerun are **346 passed, 11 skipped, zero unresolved failures**. The inventory's `lastVerified`, `result` and `runEvidence` refer to this dated record, not to unrecorded manual testing or a future source revision.

| Area | Coverage sources | What the coverage addresses | Manual evidence |
|---|---|---|---|
| Dialog | [behavior](../../tests/behavior.spec.mjs), [a11y](../../tests/a11y.spec.mjs), [motion](../../tests/motion.spec.mjs) | Modal opening, Escape/backdrop dismissal, scroll lock; page scan; overlay motion | Screen reader: not tested. Usability: not tested. |
| Combobox | [behavior](../../tests/behavior.spec.mjs), [a11y](../../tests/a11y.spec.mjs) | Filtering, active option/selection, disabled options, no matches and status markup; page scan | Screen reader: not tested. Usability: not tested. |
| Menu | [behavior](../../tests/behavior.spec.mjs), [a11y](../../tests/a11y.spec.mjs), [motion](../../tests/motion.spec.mjs) | Keyboard navigation, focus return, expanded state; page scan; overlay motion | Screen reader: not tested. Usability: not tested. |
| Tabs | [behavior](../../tests/behavior.spec.mjs), [a11y](../../tests/a11y.spec.mjs), [motion](../../tests/motion.spec.mjs) | Roving focus, selection and panel visibility; page scan; compact touch target | Screen reader: not tested. Usability: not tested. |
| Toast | [behavior](../../tests/behavior.spec.mjs), [a11y](../../tests/a11y.spec.mjs), [motion](../../tests/motion.spec.mjs) | Live-region/alert attributes, error dismissal, literal text rendering; page scan; exit behavior | Screen reader: not tested. Usability: not tested. |
| Resource explorer | [explorer](../../tests/resource-explorer.spec.mjs), [a11y](../../tests/a11y.spec.mjs) | Dedicated task-state tests; page scan and phone overflow | Screen reader: not tested. Usability: not tested. |
| Form journey | [form](../../tests/form-journey.spec.mjs), [a11y](../../tests/a11y.spec.mjs) | Dedicated entry/review/recovery tests; page scan and phone overflow | Screen reader: not tested. Usability: not tested. |

The a11y suite discovers all shipped HTML examples through `tests/pages.mjs`, scans page states on initial load with axe in light and dark themes, checks runtime page errors and checks overflow at 360px. It does not automatically exercise every dynamic state or language. Dedicated task tests supplement that starting-state scan; inspect their assertions for precise coverage. ARIA attributes checked in the DOM do not establish what a screen reader actually announces.

The current automation baseline uses **`@playwright/test` 1.56.1** with configured Chromium, Firefox and WebKit projects. The canonical visual environment uses the Playwright `v1.56.1-noble` image. These identify test infrastructure; they are not supported-browser-version promises or records of manual testing in Chrome, Safari or Firefox. Record actual software versions when a manual session occurs.

## Manual protocol

Prepare a served build of a known revision, the intended scenario and an unmodified result record. Test English and pt-BR, both themes, narrow and wide layouts, enlarged text, reduced motion and forced colors where the actual environment supports them. Do not mark a context passed without testing it; record skipped or unsupported cases and why.

1. **Keyboard:** enter from the page start, follow the task with Tab/Shift+Tab, use the component's documented arrow/Home/End/Escape keys and check visible focus. Check that hidden content is not focusable and modal dismissal returns to a useful place.
2. **Screen reader:** record the real reader/OS/browser names and versions first. Check accessible names, roles, values, state changes, instructions and reading order. Listen for missing, duplicate or overly frequent announcements and verify that dynamic results can be read at the person's pace.
3. **Recovery:** deliberately trigger invalid, cancelled, empty, no-match, failed and partial states where available. Confirm that answers/query/filters survive, busy state ends, obsolete results do not replace newer work and recovery actions work with keyboard and reader.
4. **Task usability:** ask participants to complete a concrete task without explaining the controls. Record context, assistance needed, misunderstandings, completion and observations. Separate observed difficulty from the evaluator's interpretation; anonymize participant identifiers.
5. **Record and repair:** save actual versus expected outcomes, reproduction steps, evidence links and issue ownership. After a fix, retest the failed context and record a new result rather than overwriting the original observation.

| Area | Required manual scenarios |
|---|---|
| Dialog | Announced title, sensible initial focus, containment, dismissal and focus return; a decision remains understandable at enlarged text. |
| Combobox | Typing with accents, active-option announcements while focus stays in the input, no matches, unavailable options and a free-text answer. |
| Menu | Trigger name/state, first focus, arrow/Home/End navigation, unavailable actions, Escape and focus return. |
| Tabs | Selected tab announced, roving focus, panel association, hidden panels excluded and correct reading order; RTL when used by the product. |
| Toast | Actual polite/error announcements, no focus theft, dismissal and sufficient reading time; essential information remains available elsewhere. |
| Resource explorer | Query + filter + selection; list/detail at narrow width; loading/cancel/retry/empty/no-results/partial states; language change retains task state. |
| Form journey | Empty continuation, summary links and inline errors; correction, review/edit, failure/retry and local confirmation; language change retains answers and step. |

## Result schema

Each area in `evidence.json` has an `automated` coverage record and separate `manual.screenReader` and `manual.usability` records. Manual status is `not-tested`, `passed`, `failed` or `partial`. `lastTested` is an ISO date of an actual session, or `null`; passing one environment cannot close an untested one. Use `partial` when coverage is incomplete and describe the gap in results.

Append one object per actual manual session to `results`, using this shape. The nulls below are placeholders, not a test record:

```json
{
  "testedAt": null,
  "revision": null,
  "tester": null,
  "environment": {
    "os": null,
    "browser": null,
    "browserVersion": null,
    "screenReader": null,
    "screenReaderVersion": null,
    "inputMethod": null
  },
  "contexts": [],
  "scenario": null,
  "expected": null,
  "observed": null,
  "outcome": null,
  "evidence": [],
  "issues": [],
  "limitations": null
}
```

Use `outcome: "passed"`, `"failed"` or `"partial"` only with observed results. For usability sessions, `screenReader` and its version may be `null` when unused; state the actual input method and anonymized participant context in the session limitations. Never fill unknown software versions from a Playwright dependency. An automated run can separately populate `lastVerified`, `result` and `runEvidence` with a revision, exact command and report location; retain the distinction between test coverage and run evidence.

Reference: Carbon's [accessibility testing overview](https://www.carbondesignsystem.com/building-blocks/core/components/overview/accessibility-status) and [modal accessibility documentation](https://www.carbondesignsystem.com/building-blocks/core/components/modal/accessibility) demonstrate why component evidence needs a stated scope and why automation and manual checks should be reported separately.
