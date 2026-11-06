# Fixed principles, adaptable compositions

Membrane should be recognizable across an essay, a technical explanation, a workshop and an expressive opening. Recognizability comes from meaningful registers, typography, warm surfaces and careful behavior. It does not require the same layout each time.

## What stays fixed

- **Meaning:** visual choices must help communicate the subject. Human and digital accents express roles; color is never the only way to tell those roles apart.
- **Visual vocabulary:** use the existing type families, semantic colors, spacing, shapes and motion tokens. Keep the official brand marks intact and follow their clearspace and minimum sizes.
- **Readable output:** preserve contrast, visible focus, keyboard access, labels, touch targets, text alternatives and reduced-motion behavior. Diagrams need a readable text equivalent.
- **Honest content:** personal facts come from `PROFILE.md` or a verified source. Sample data, hypothetical methods and illustrative copy remain visibly labeled. Never turn a diagram or example into a claimed finding.
- **Working interaction:** controls perform the action they name. A visual specimen can use ordinary section links. Do not suggest registration, submission or a completed operation when no service exists.

These requirements come from the [visual specification](../../DESIGN-SYSTEM.md) and the existing verbal authorities. This guide interprets composition; it does not replace them.

## What you can change

| Kind of piece | Useful starting point | Freedom that serves the task |
|---|---|---|
| Editorial | Calm reading path, generous space, one strong heading | Asymmetric columns, pull quotes, changes of scale and rhythm |
| Expressive opening | A single memorable idea or relationship | Oversized type, overlap, meaningful illustration, a restrained system gradient |
| Research or technical explanation | Question, relationship, method, qualification | Dense diagrams, code, tables and supporting annotations when they clarify the argument |
| Interactive tool | Understandable state, immediate feedback, a clear next step | Explorers, calculators and alternative representations using the same component and accessibility contracts |

Choose the composition from the content. A sequence needs a path; a comparison needs shared alignment; a system needs named relationships. A diagram made for the question can carry more meaning than three equal cards. Hand-built diagrams are allowed: the icon rules govern interface glyphs, not original explanatory graphics.

The [visual language](../visual-language/README.md) supplies an original family of gestures, frames, routes and supporting fields, with [editable SVG assets](../../brand/visuals/catalog.json). Use the role and arrangement guidance to decide whether a piece needs an icon, illustration, diagram, motif or photograph. The specimen demonstrates several compositions using the same family.

## Use restraint as judgment

The calm-slide 30-word limit is a useful default for a spoken presentation, where the speaker carries the detail. A method slide, an accessible stand-alone deck or a comparison may need more words. Keep the hierarchy clear and the type readable, and record the reason in the exemplar's notes. Do not remove necessary qualifications to meet an arbitrary count.

Likewise, whitespace has a purpose. Leave room around the main idea; do not apply a fixed empty-area percentage to a reference table or dashboard. A heading needs to be the first read, but a universal heading/body ratio would erase differences between a poster and a technical report.

Depth, gradients and motion need a referent. Use the system's shadows and gradient roles to show layering or a relationship. Check text contrast at the least favorable background behind it, including intermediate animation states. Static readability comes first; essential information must remain available when motion is reduced or scripts fail. Component motion keeps the existing §8 contract; this layer introduces no new timing scale or animation API.

## Review the idea and the result

State the idea in one line before drawing. After rendering, check whether that idea is actually the first thing someone sees. Use the [rubric](rubric.md) for every piece, then ask: could this structure belong to any subject, or does it explain this one? Change the structure when the content calls for it.
