# Membrane composition layer

## Intent and scope

The approved direction is composition guidance, three rendered exemplars and a short visual review rubric. Help a person or agent make a complete piece with Membrane's existing components and human/digital registers.

## Approach

Extend the existing Markdown documentation and static HTML examples. A prose-only extension would leave the visual quality bar implicit; a new component or framework layer would add machinery without addressing composition. Static, token-based references fit the existing build and browser checks. This implementation choice follows the user's instruction to proceed with the recommendation.

## Design

- Add `docs/composition/README.md` as the entry point: intent routes, register selection, reusable composition moves, format guidance and links to examples.
- Add `creative-latitude.md` to distinguish brand/accessibility/factuality invariants from adaptable editorial defaults, and `rubric.md` for reviewing actual renders.
- Create `examples/workshop.html`, `research-explainer.html` and `presentation.html`, with shared local `composition.css`. Each has a different visual structure: learning journey, question–method–limitation, and a six-canvas argument.
- Use semantic tokens and existing components; local classes only compose page geometry. Keep the existing component/token API. Copyable source HTML is the live reference; include generated PNG previews and a repeatable render command.
- All sample content is explicitly illustrative and establishes no claims about Isaac, a study, an institution or a scheduled event. Use English to match the current example pages; the guide includes pt-BR adaptation advice.
- A presentation is a responsive reading view on screen and six landscape pages in print. Ordinary links provide keyboard-accessible navigation without new JavaScript. Dense evidence canvases may exceed the calm-slide 30-word default without shrinking text.
- Link from README, specification, showcase and generated agent index. Ship composition docs in `dist/` and inline them in `llms-full.txt`.

## Validation

Existing token/component lint, HTML validation, type checks and three-browser suites apply. Discover example pages automatically so all references get axe, phone-overflow, link and self-containment checks. Add deck-specific checks for navigation, enlarged text and six unclipped print pages. Inspect rendered desktop/mobile and print output before handoff.

## Boundaries

No token redesign, React wrappers, distribution changes, motif engine, biography changes or deployment. Existing identity and verbal authorities remain authoritative. RSE informs the method, not the visual vocabulary or institutional rules.
