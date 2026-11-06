# Forms, review and confirmation

Start with [Field](../../components/field/README.md), [Input](../../components/input/README.md), [Choice](../../components/choice/README.md), [Button](../../components/button/README.md) and [Alert](../../components/alert/README.md). The [form journey](../../examples/form-journey.html) composes them into entry → review/edit → simulated completion. It asks for a goal and format only; the local specimen transmits nothing.

## Ask only what the task needs

Explain the purpose before asking for information. Give every control a persistent label, use a hint for requirements known in advance and say which fields are optional. A placeholder cannot carry any of these roles. Group related radios or checkboxes in a native `fieldset` with a `legend`; use `required`, appropriate input types and `autocomplete` where relevant. Keep DOM order equal to reading and focus order.

Use a short radio group when options benefit from comparison; use a native select when the list is longer. A switch applies a setting immediately, so it is unsuitable for an answer that will be reviewed before submission. See the [component choices](choosing-components.md).

## Validate without erasing the attempt

Validate when someone tries to continue, then help them correct the affected fields. Avoid showing errors before they have had a chance to answer. Preserve every value, including valid answers.

1. Show a concise error beside each affected control. Say how to fix the problem; distinguish missing input from an unavailable service.
2. Set `aria-invalid="true"` and associate the error with `aria-describedby`, retaining any useful hint association. Clear obsolete errors when corrected.
3. On an unsuccessful continue action, focus a summary with a heading and links to the affected controls. A focusable summary can use `tabindex="-1"`; its links must reach the actual fields. Do not rely on red borders or a disappearing toast.
4. Keep subsequent focus predictable. An inline correction must not move focus while someone is typing.

The local demo uses `novalidate` to suppress browser validation popovers so one authored summary and its inline messages can demonstrate the same recovery in both languages. It retains native controls and constraints; `novalidate` is not a replacement for validation. Choose native browser validation for simpler forms when it serves the task. A real service must validate separately on the server, enforce its own rules and return errors without discarding entered data. Client-side checks can be bypassed.

## Let people check and change

Before an action with consequences, show answers with their labels and an explicit way to edit. Returning to entry must restore the answers; returning to review must reflect edits. Keep the primary action named for its consequence, and state whether the operation is local or sends information.

While working, indicate the busy state and prevent duplicate attempts without destroying the current data or leaving focus on a removed control. A simulated failure should offer a retry using the same answers and an edit route. Focus a persistent result heading or summary after an explicit step transition; routine background updates can use a polite status region.

Confirmation names what actually happened, what happens next and any reference people need. The demo confirms only local completion and says no request was sent. Do not copy its success message into a service until the server has confirmed the operation. See [states and recovery](states-and-recovery.md) for cancellation and partial results.

## Language and review

Translate labels, hints, errors, summary links, review values and confirmation text together. Set the document language and keep stable internal option values separate from translated labels. Changing language must preserve answers and the current step. Test the longer pt-BR labels at phone widths and with enlarged text.

Adapted from GOV.UK's [question pages](https://design-system.service.gov.uk/patterns/question-pages/), [validation errors](https://design-system.service.gov.uk/patterns/validation/), [check answers](https://design-system.service.gov.uk/patterns/check-answers/) and [confirmation pages](https://design-system.service.gov.uk/patterns/confirmation-pages/). Their task principles inform this pattern; Membrane keeps its own voice, components and visual identity.
