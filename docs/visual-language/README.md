# A gesture and a structure

Membrane's visual language joins an expressive mark with a useful structure: a curve and a route, a loose plane and a precise frame, an observation and an annotation. The relationship gives a piece its character. The typography, warm surfaces and human/digital registers keep it connected to the rest of the system.

Start with the [working specimen](../../examples/visual-language.html). It shows a website opening, a presentation cover, a teaching card, grouped icons and a reasoning diagram. All example content is **ILLUSTRATIVE**. The drawings communicate ideas; they record no observations, measurements or research findings.

## Choose a visual job

| Visual | What it does | Start here |
|---|---|---|
| Interface icon | Identifies an action, object or state at a glance | Existing [Lucide/Icon contract](../../components/icon/README.md); consistent scale, `currentColor`, accessible control labels |
| Pictogram | Introduces a topic with a simple recognizable symbol | A carefully selected Lucide glyph with a visible label; introduce an original pictogram family only when a repeated need justifies it |
| Illustration | Opens a scene, question or interpretation | A focal construction, or an original drawing following the grammar below |
| Diagram | Explains named relationships, sequence or structure | Actual labels, connectors, reading order and a text equivalent; [research explainer](../../examples/research-explainer.html) and the specimen's reasoning sequence |
| Motif or field | Gives a margin, cover or transition a recognizable rhythm | The original assets below; keep decorative meaning separate from evidence |
| Photograph | Shows a real person, setting, material or activity | Supplied, appropriately licensed photography with the [existing treatment](../../DESIGN-SYSTEM.md#71-photography-style), useful framing and captions |

Choose from the task: a search control needs an icon; a question may benefit from an illustration; a process needs a diagram. A repeated motif does not replace the explanation of a process. The system does not ship a new interface icon set or an original pictogram collection in this iteration.

## The shared grammar

**Gesture.** Deliberate curves, open loops and slightly irregular planes bring warmth. Draw a line with a reason and repeatable geometry. Random jitter, artificial paper noise and indiscriminate scribbles do not make a composition more human.

**Structure.** Frames, alignment, spaced markers and routes bring precision. Leave openings where the subject remains uncertain or revisable. A dotted boundary can distinguish an interpretive interval; explain that meaning when it matters to the argument.

**Meeting.** Let the two registers share a crossing, an alignment or an overlap. Their relationship is the focal idea. A piece can emphasize either register without depicting a literal membrane every time.

**Color.** Start with the human and digital semantic text colors plus neutral linework/surfaces. The generated assets use `--color-human-text`, `--color-digital-text`, `--color-text-primary`, `--color-border-emphasis`, `--color-human-bg` and `--color-digital-bg`. These resolve from the token source. A larger explanatory scene may use additional semantic colors for meaningful distinctions; keep the palette tied to those roles. Color never carries a necessary distinction alone.

**Stroke.** Interface icons retain their existing 24px drawing grid and 1.5px CSS stroke. These illustrations use an 800-unit canvas: expressive traces are generally 6–8 units, structural routes 3–6, supporting rules 2. This hierarchy scales with the drawing; it is not a new UI stroke scale. Remove secondary detail when a drawing becomes small.

## Original asset family

The [catalog](../../brand/visuals/catalog.json) records descriptions, purpose, limits, dimensions and variant paths. Each SVG is transparent, self-contained and editable in a vector editor. It contains no fonts, scripts, linked images or external stylesheets. MIT terms follow the repository [license](https://github.com/idcesares/The-Membrane-Palette/blob/master/LICENSE).

| Construction | Job | Light | Dark |
|---|---|---|---|
| Passage | Focal crossing between gesture and structured routes; website openings and editorial covers | [SVG](../../brand/visuals/passage-light.svg) | [SVG](../../brand/visuals/passage-dark.svg) |
| Confluence | Independent paths gathering and continuing; synthesis and presentation covers | [SVG](../../brand/visuals/confluence-light.svg) | [SVG](../../brand/visuals/confluence-dark.svg) |
| Field notes | Observation, frame and annotation anchors; teaching cards and editorial sidebars | [SVG](../../brand/visuals/field-notes-light.svg) | [SVG](../../brand/visuals/field-notes-dark.svg) |
| Learning loop | An unfinished return route; reflection and iteration | [SVG](../../brand/visuals/learning-loop-light.svg) | [SVG](../../brand/visuals/learning-loop-dark.svg) |
| Permeable grid | Sparse supporting texture; margins and section transitions | [SVG](../../brand/visuals/permeable-grid-light.svg) | [SVG](../../brand/visuals/permeable-grid-dark.svg) |
| Trace field | Wide decorative interval; editorial strips and cover margins | [SVG](../../brand/visuals/trace-field-light.svg) | [SVG](../../brand/visuals/trace-field-dark.svg) |

These are original Membrane constructions. They are expressive assets, not official logos, scientific models, charts or measurements. Preserve the [brand marks](../../DESIGN-SYSTEM.md#103-files) and their own clearspace rules.

## Arrange for the idea

| Arrangement | How to compose it | What to check |
|---|---|---|
| Title + focal construction | Put a strong title and one picture in separate areas; let the picture take real space | The title leads; the art remains recognizable; both stack in a useful order on a phone |
| Annotated observation | Place a drawing beside numbered notes; make each note refer to a specific feature | The connector reaches its referent; labels stay readable text and survive export |
| Labelled icon group | Align a few related glyphs and their labels; add a short distinction under each | Consistent size and baseline; grouping communicates a relationship; no unexplained constellation |
| Reasoning route | Draw the sequence with labels and visible connections, or use a native ordered list whose geometry reinforces order | Reading and focus order follow the same route; direction is understandable without color |
| Comparison | Align two or more views on a shared baseline with consistent labels | Equivalent visual weight; differences are deliberate; essential qualifications stay beside each view |
| Cropped field + solid text area | Let a field enter from a margin or separate strip; keep reading copy on a clean surface | Only decorative content is cropped; no pattern texture under required text |
| Photograph + annotation | Frame a real image and put contextual notes beside it | Consent/licence as applicable, meaningful crop, factual caption and a clear separation from illustration |

The [specimen](../../examples/visual-language.html#arrangements) demonstrates icon grouping, a reasoning route and a separate decorative strip. Its teaching card shows how illustration, instructions and editorial notes can work together. Photography needs actual source material, so this specimen includes none.

## Scale, density and restraint

- Give a focal drawing roughly 240–600 CSS pixels as a starting range, then inspect the actual result. At small sizes simplify or use an icon/pictogram for a concrete subject. Do not shrink the entire illustration until secondary strokes disappear.
- Start with one focal visual per composition. A dense explanatory figure can contain several views when their relationship is the subject. Repeating equal-weight decorative art beside every paragraph weakens hierarchy.
- Crop fields and peripheral flourishes deliberately. Preserve the meeting point of a focal construction. A meaningful diagram retains every required label, connector and qualifier.
- Atmosphere can be subtle. Essential diagram lines, focus cues, labels and status information must retain their required contrast. Never apply one low-opacity treatment to an entire explanatory figure.
- Use space to establish relationships and pauses. Overlap is useful when it describes a relationship and preserves reading order. Keep body text off a busy drawing.

Follow the [composition rubric](../composition/rubric.md), with two additional questions: does the visual do a specific job, and can a reader explain why these elements belong together?

## Theme and accessible use

Choose artwork for its **actual background**, including a dark panel on a light page. The specimen's presentation cover keeps its dark surface and asset on screen and paper; the remaining pictures follow the OS theme on screen and use light variants for the light print surface. Native `picture` sources follow media preferences, not a parent element's `data-theme`. Products with a manual theme control must update the selected asset too, or deliberately choose an explicit variant for a fixed surface.

```html
<!-- Decorative art next to a complete textual explanation. -->
<picture>
  <source media="screen and (prefers-color-scheme: dark)" srcset="passage-dark.svg">
  <img src="passage-light.svg" alt="" width="800" height="600">
</picture>
```

Use empty `alt` for decoration. For an illustration carrying necessary meaning, write a useful alternative describing that meaning and keep a caption or longer text equivalent nearby when needed. A meaningful diagram needs visible labels and a readable account of its relationships. SVG titles/descriptions help standalone inspection; they do not replace the HTML image's alternative. If embedding SVG markup inline more than once, namespace its IDs and ARIA references.

The supplied artwork is static. A future motion treatment must retain a complete static reading and respect reduced motion. Inspect both themes, 360px, enlarged text, print and the final exported image. Automated page scans cannot establish screen-reader or participant usability results; keep those distinctions in the [evidence inventory](../accessibility/README.md).

## Editing and generation

In a consuming project, edit a copy of the downloaded SVG and keep the shared grammar. In this repository, the committed SVGs and catalog are generated: edit `scripts/render-visual-assets.mjs`, then run:

```bash
npm run build:system
npm run render:composition
```

`npm run render:visuals` redraws assets from the current resolved tokens; `build:system` first regenerates those tokens. The full site build runs the same renderer so token changes and downloaded artwork stay aligned. Do not hand-edit generated SVGs or add a second hard-coded color palette. Keep source geometry, accessible descriptions, catalog purposes and rendered previews together when adding a construction.

The renderer is intentionally small and deterministic. It supplies original drawings and two supporting fields, rather than an open-ended graphics engine. Add a new visual only when an actual composition needs something the existing family cannot express.

## Relationship to RSE

[RSE's design guidance](https://github.com/idcesares/RSE-Design-System/blob/main/DESIGN.md) connects signature constructions, patterns, editable assets and finished compositions. Membrane adopts that continuity and develops its own organic/structural grammar. RSE's cubes, institutional typography, palette and mark rules remain specific to RSE.
