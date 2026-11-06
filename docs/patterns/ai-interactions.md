# Optional AI interactions

Membrane supplies interface components, not an AI backend, model integration or generation API. Use this guidance only when a product actually includes an AI-assisted task. Do not add an AI control to a page merely because it can be styled.

Start with [Field](../../components/field/README.md) and [Input](../../components/input/README.md) for an editable request, [Progress](../../components/progress/README.md) for work in progress, [Alert](../../components/alert/README.md) for persistent limitations and [Button](../../components/button/README.md) for explicit actions. Use the existing [state and recovery](states-and-recovery.md) contract; these recommendations define no new `mp-*` component or behavior hook.

## Make the scope and control visible

Before starting, say what the assistance can produce, what information it will use and what the person will need to review. Explain actual data handling in the product's own terms; do not promise privacy, retention behavior or source access that the implementation cannot support.

Keep the request editable and preserve it through failure, stopping and retry. For work that can take time, provide a stop control and explain its actual effect. Stopping output in the interface is not proof that remote processing stopped. Keep useful partial output labelled incomplete and allow editing or restarting deliberately; do not silently replace a person's own edits when a late result arrives.

## Make output inspectable

- Label generated suggestions as suggestions. Separate user-authored text from generated material without relying on color.
- Show supporting sources when they exist and can be checked. Distinguish retrieved evidence from a generated explanation; a source list alone does not prove each claim follows from it. Say when sources are unavailable.
- Preserve meaningful uncertainty and known limits. Do not turn confidence-looking wording or an uncalibrated percentage into a guarantee.
- Give people review, edit and reject routes before consequential use. Copying, applying, sending or publishing output should be an explicit action with the real consequence named.
- Explain failures with a recovery route that retains the request and any useful result. Do not invent an answer to hide a service failure.

For streamed output, avoid announcing every token. Provide a stable status and an accessible result region, then let someone navigate the completed or stopped text at their own pace. Keyboard users must be able to reach stop, review and edit controls without chasing moving focus. Test long output, late failures, repeated attempts and translated labels.

These are product-design principles, not a claim that the current examples call a model. Any future AI example must visibly label simulated content and state whether it transmits information. Record actual screen-reader and user evidence in the [accessibility inventory](../accessibility/README.md).

References: Fluent's [AI guidance](https://fluent2.microsoft.design/responsible-AI) and Microsoft's [Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/). Adapt their transparency, correction and control principles to the task while retaining Membrane's voice and visual identity.
