# Designing a complete task

A component answers a small interface question. A pattern connects those components into a task: what someone needs to know, what they can do, what happens next and how they recover when it fails.

Start with the existing [component catalog](../../DESIGN-SYSTEM.md#63-catalog) and [composition guidance](../composition/README.md). These guides add task behavior; they introduce no new library classes, attributes or JavaScript API. Use native HTML first, semantic tokens for visual roles and the existing `components/membrane.js` behaviors where required.

| Task or decision | Guide | Working reference |
|---|---|---|
| Enter, check and confirm information | [Forms and review](forms.md) | [Form journey](../../examples/form-journey.html) |
| Explain a wait, missing content or failure | [States and recovery](states-and-recovery.md) | [Resource explorer](../../examples/resource-explorer.html) |
| Choose a control or message | [Choosing components](choosing-components.md) | Component READMEs linked in the guide |
| Adapt a task to the available space | [Adaptive layouts](adaptive-layouts.md) | [Resource explorer](../../examples/resource-explorer.html) |
| Explain quantities responsibly | [Data explanations](data-explanations.md) | [Dashboard](../../examples/dashboard.html) and Chart/Table components |
| Give people control around AI output | [AI interactions](ai-interactions.md) | Optional guidance; no AI service is supplied |
| Adopt the system in an existing product | [Incremental adoption](adoption.md) | Existing CDN distribution |

The resource explorer and form journey contain **ILLUSTRATIVE** content. Both offer English and pt-BR through a language selector; the initial Portuguese view can also use `?lang=pt-BR`. The explorer uses a local resource collection and simulated wait/recovery scenarios. The form creates a local plan request specimen: it does not transmit a request, contact anyone or provide a service. Keep those boundaries visible when copying either reference.

Review the whole task with a keyboard, enlarged text, both themes and both languages. Automated coverage and outstanding manual checks are recorded in the [accessibility evidence inventory](../accessibility/README.md). A passing component check alone does not establish that people can complete a task.
