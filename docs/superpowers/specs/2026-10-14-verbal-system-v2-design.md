# Verbal System v2 — Design Specification

**Date:** 2026-10-14  
**Status:** Proposed  
**Target release:** v2.2.0  
**Branch:** `verbal-system-v2`

## 1. Purpose

The Membrane Palette already has a mature visual and technical system, but its verbal layer mixes three responsibilities that age at different speeds: factual biography, writing behavior, and public-facing brand expression. That coupling has allowed outdated or unsupported claims to become part of the source material consumed by AI agents.

Verbal System v2 separates those concerns while preserving the visual system, component API, the membrane metaphor, and the existing interface-writing strengths.

The goal is not to create a more polished persona. The goal is to make the system more faithful, more maintainable, and safer for humans and agents that write in Isaac's name.

## 2. Core Decision

The verbal system will have three distinct authorities:

- `PROFILE.md` — decides **what is true** about Isaac.
- `VOICE.md` — decides **how Isaac writes and communicates**.
- `BRAND-VOICE.md` — decides **how that voice is expressed publicly as a brand**.

`DESIGN-SYSTEM.md` remains the authority for visual and interface behavior.

Agent precedence:

> PROFILE decides what is true. VOICE decides how Isaac says it. BRAND-VOICE decides how that voice is expressed publicly. DESIGN-SYSTEM decides how it appears and behaves in interfaces. Never infer biography from a writing example.

When documents disagree, use the authority above for the relevant question rather than trying to reconcile them by inference.

## 3. Identity Model

The current compressed identity `Researcher · Educator · Builder` changes to:

> **Researcher · Educator · Developer**

Portuguese:

> **Pesquisador · Educador · Desenvolvedor**

`Developer` is a concrete practice and public identity. `Builder` is removed as a personal identity label because it reads as an aspirational archetype rather than an accurate professional descriptor.

Where the existing design system uses “builder” to describe a visual or technical register, it should not be mechanically replaced with `developer`. Prefer context-specific language such as:

- `making`
- `technical craft`
- `code`
- `development`

Examples:

- `Builder energy` → `Making energy`
- `builder/code register` → `technical craft / code register`
- “builder impulse” → “developer/maker practice” where personal identity is actually intended

This is a semantic/documentation change. Public token names, CSS classes, component attributes, and other stable APIs must not be renamed solely for this revision.

## 4. PROFILE.md

### 4.1 Responsibility

`PROFILE.md` is a small, factual, dated source of truth for mutable biographical information used in bios, speaker descriptions, portfolio content, agent outputs, and project examples.

It must be written so a future maintainer can update a role, academic status, or approved bio without editing the voice model.

### 4.2 Initial factual baseline

The first version should include, at minimum:

- Full public name: Isaac D'Césares.
- Current professional role: **Coordenador de Tecnologias Educacionais no Departamento Nacional do Sesc**.
- English role: **Educational Technology Coordinator at Sesc's National Department**.
- UFRJ public wording: **pesquisador (mestrando)**.
- English academic wording: **researcher and master's candidate at UFRJ**.
- Primary professional domains: education technology, emerging technologies, artificial intelligence, digital transformation, software/development, research and higher education.
- Public identity terms that are approved: researcher, educator, developer.
- Terms that must not be inferred as current titles: Director of Digital Transformation; completed Master's degree.
- Last reviewed date.

The profile may include approved short and long bios, but every sentence in them must be derivable from explicitly listed facts.

### 4.3 Factuality rules

Agents and maintainers must never automatically convert:

- participation into leadership;
- ongoing education into a completed degree;
- adjacent experience into a quantified duration of specialization;
- an illustrative scenario into personal history;
- a project example into a delivered case unless the profile or another cited project source establishes it;
- a broad area of interest into a formal job title.

If a fact is missing, write around it or request verification. Do not make a plausible inference and present it as biography.

## 5. VOICE.md

### 5.1 Responsibility

`VOICE.md` models Isaac's observed communication behavior independently of branding. It should be useful for email, chat, institutional writing, academic writing, social posts, documentation, teaching material, technical writing, and agent-assisted drafting.

Its central model is:

> **Stable voice, adaptive register.**

The voice stays recognizable. Formality, density, vocabulary, sentence length, and explicitness adapt to audience and purpose.

### 5.2 Stable voice

The stable characteristics are:

- human;
- reflective;
- precise;
- contextual;
- structurally minded;
- warm without excess;
- technically honest;
- nuanced without becoming evasive;
- direct when the context is already understood.

### 5.3 Common reasoning structure

A common pattern in Isaac's writing is:

> **context → nuance → intention → action**

This is a tendency, not a mandatory template. Short operational messages may collapse directly to action.

### 5.4 Sentence behavior

The guide should explicitly capture the distinction between cognitive draft and finished artifact:

- During exploration, sentences may be long, iterative and self-correcting because the reasoning is visible while it is being formed.
- In finalized communication, unnecessary branches are removed while relevant nuance is preserved.
- When context is already shared, messages can become extremely short.
- Sentence length should therefore follow cognitive load, not a fixed brand rhythm.

### 5.5 Lexical tendencies

Document recurring vocabulary that genuinely appears in Isaac's writing, including families such as:

- ideia
- proposta
- processo
- estrutura
- organização
- contexto
- camada
- mapear
- apoiar
- considerar
- principalmente
- justamente
- realmente
- acho
- talvez
- “a ideia é”

These are observations, not mandatory keywords. Agents should not sprinkle them mechanically into generated copy.

### 5.6 Precision and hedging

The current voice guide overcorrects against hedging. In v2, uncertainty markers are valid when they carry epistemic meaning.

Use terms such as `acho`, `talvez`, `considerando`, `pode`, or equivalents when they correctly calibrate confidence. Remove only empty or defensive hedging that obscures a claim.

Rule:

> Be as certain as the evidence allows, not as certain as branding would prefer.

### 5.7 Adaptation by audience

The system should explicitly describe shifts by context:

**Institutional leaders / managers**  
Evidence, concise context, responsibilities, implications and the requested action. Neutral, non-escalatory language when dealing with operational friction.

**Academic / research**  
Conceptual precision, evidence, literature, methods, limitations and unresolved questions. Complexity is allowed when it carries real meaning.

**Teaching / education**  
Progressive explanation, mediation, examples and conceptual bridges. Do not simplify away the important part of the idea.

**Developer / technical**  
Architecture, constraints, interfaces, trade-offs, reproducibility and implementation detail. Prefer exactness over branding vocabulary.

**Social / LinkedIn**  
Reflective and accessible, usually beginning from an observation, question or experience. Avoid motivational-template rhythm and artificial punchlines.

**Direct messages / informal communication**  
Natural spoken rhythm, relational cues, parentheses and occasional humor where appropriate. Minimal structure when the relationship already supplies context.

### 5.8 What to avoid

Avoid rules based on blacklisting ordinary professional vocabulary. Words such as `ecosystem`, `stakeholder`, `optimization`, `ROI`, `innovation` or `alignment` are acceptable when technically necessary and specific.

The actual anti-pattern is:

> **abstraction without a referent.**

Also avoid:

- generic AI/LinkedIn phrasing;
- excessive sloganization;
- repeated “not X, but Y” constructions;
- forced enthusiasm;
- ceremonial corporate language when plain wording works;
- excessive em dashes used as a house style;
- false certainty;
- sentimentality that exceeds the relationship or context;
- over-polishing that removes natural thought and makes the text feel authored by a persona.

## 6. Evidence Model for Writing Examples

Every example in `VOICE.md` or `BRAND-VOICE.md` must belong to one of three explicit classes:

### OBSERVED

Text actually written by Isaac. May be used as evidence for style.

### APPROVED

Text drafted or transformed with assistance and explicitly accepted by Isaac as representative. May guide style, but must not be presented as an independently observed sample.

### ILLUSTRATIVE

Fictional copy created only to demonstrate a writing principle. It must not contain autobiographical claims, invented memories, unsupported metrics, fabricated project outcomes, fake quotations, job titles, degrees, or durations attributed to Isaac.

Core boundary:

> Voice examples may invent scenarios. Biographical examples may never invent facts.

Existing examples that fabricate first-person memories or appear to assert unsupported cases must be removed, relabeled or rewritten.

## 7. BRAND-VOICE.md v2

### 7.1 Responsibility

`BRAND-VOICE.md` becomes an application layer rather than a personality model. It translates `PROFILE.md` + `VOICE.md` into public-facing material such as portfolio copy, bios, presentation language, social identity and campaign-style statements.

It should be materially shorter than the current v1 document.

### 7.2 Preserve

Preserve concepts that remain strong and distinctive:

- The Membrane as the design system's central metaphor.
- Human ↔ digital translation as a useful framing device.
- `warm without being casual, precise without being cold`.
- Articulate, warm, concrete and confident-without-arrogance as useful quality checks.
- Brazilian cultural grounding without folkloric performance.
- Ethical attention to agency, trade-offs and human consequences.

### 7.3 Reduce or reposition

- `The Translator` becomes a useful lens, not Isaac's definitive archetype.
- The Membrane is primarily a system metaphor, not an obligation for every piece of writing to reference human/digital duality.
- Signature phrases become optional campaign assets rather than required identity statements.
- `Vamos cocriar?` remains available but is not a universal CTA or default button label.
- Slogan-heavy constructions should be sparse and clearly separated from normal prose.

### 7.4 Public bios

All public bios must be assembled from `PROFILE.md`. `BRAND-VOICE.md` may specify structure and tone, but may not independently add credentials, durations, titles or claims.

## 8. DESIGN-SYSTEM.md Integration

The visual architecture remains stable.

### 8.1 Keep

- Membrane registers.
- Color system.
- Typography.
- component APIs.
- accessibility model.
- interface writing rules for errors, empty states, confirmations, labels and feedback.
- “Translation, Not Decoration”.
- “Warmth at the Foundation”.
- “Confident Restraint”.
- Brazilian visual texture.

### 8.2 Update

- References to `BRAND-VOICE.md` should point to the appropriate new authority.
- Agent guidance must read `PROFILE.md` for personal facts and `VOICE.md` for writing behavior.
- Replace personal-identity uses of `builder` with `developer`.
- Replace aesthetic/semantic uses of `builder` with `making`, `technical craft`, `code` or another context-specific term.
- Interface documentation should not treat `Let's co-create` / `Vamos cocriar?` as a privileged default CTA.

No public component/token API changes are required for this work.

## 9. Agent Contract

Agent-facing documentation (`AGENTS.md`, `CLAUDE.md`, `llms.txt`, README guidance and the AI constraint block in `DESIGN-SYSTEM.md`) must encode the same authority hierarchy.

Minimum contract:

1. Use `PROFILE.md` for facts about Isaac.
2. Use `VOICE.md` for prose behavior and register adaptation.
3. Use `BRAND-VOICE.md` for public branding applications.
4. Use `DESIGN-SYSTEM.md` for visual/UI constraints.
5. Never infer biography from examples.
6. When a requested claim is not supported by the profile, omit it or mark it for verification.
7. Preserve the difference between OBSERVED, APPROVED and ILLUSTRATIVE examples.

Generated agent files must be updated through their source/build pipeline rather than edited by hand.

## 10. Sample Content and Demo Safety

Examples and component demos may use fictional organizations, people, courses and metrics, but they must not be easily mistaken for Isaac's real biography or portfolio.

Preferred approaches:

- explicitly neutral sample data;
- fictional names not tied to Isaac's institutions;
- labels such as `Sample case` where a case-like example could be interpreted as real;
- avoid attaching unsupported metrics or outcomes to Isaac's name.

Existing examples such as first-person fabricated memories or unsupported “3,000 educators” project claims must be reviewed under this rule.

## 11. Scope and Compatibility

### In scope

- Add `PROFILE.md`.
- Add `VOICE.md`.
- Rewrite/reduce `BRAND-VOICE.md` as an application layer.
- Correct outdated factual claims.
- Update identity from Builder to Developer where it refers to Isaac.
- Update design-system semantics where `builder` is an aesthetic/technical register.
- Update agent guidance and source-generation rules.
- Audit misleading sample content.
- Update changelog and documentation references.
- Regenerate committed generated outputs through the existing build system.

### Out of scope

- Redesigning the color palette.
- Renaming public CSS classes or component attributes.
- Renaming stable public tokens solely because their descriptions change.
- Reworking the brand marks.
- Changing the component architecture.
- Rebuilding the website/portfolio itself.
- Adding new product features unrelated to the verbal system.

## 12. Expected Files

Likely new files:

- `PROFILE.md`
- `VOICE.md`

Likely source/documentation updates:

- `BRAND-VOICE.md`
- `DESIGN-SYSTEM.md`
- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `CHANGELOG.md`
- `tokens/membrane.tokens.json` where descriptions contain obsolete builder semantics
- selected `components/*/README.md`
- selected `examples/*.html`
- generation scripts if agent indexes need additional verbal-system links

Generated outputs may include:

- `llms.txt`
- `components/manifest.json`
- generated regions of README/component docs/showcase
- token-derived output files when descriptions are generated from the token source

The implementation plan must determine the exact set before edits begin.

## 13. Verification

The implementation is complete only when:

1. Searches for obsolete factual claims find no authoritative current copy.
2. Personal-identity uses of `Builder` are replaced with `Developer`.
3. Remaining uses of `builder` are intentional technical/history references or have been replaced with context-specific terminology.
4. No voice example presents an invented autobiographical event as real.
5. Agent documentation contains the PROFILE → VOICE → BRAND-VOICE → DESIGN-SYSTEM authority model.
6. Generated files match a fresh `npm run build:system`.
7. Relevant documentation lint/build checks pass.
8. `npm test` passes if changed sources affect generated component/example/showcase output.
9. No visual baseline update is required unless the implementation intentionally changes rendered visual content; if text changes alter visual baselines, those diffs must be reviewed rather than blindly accepted.

## 14. Success Criteria

A future agent should be able to answer four questions unambiguously:

- **Who is Isaac right now?** → `PROFILE.md`
- **How does Isaac naturally communicate?** → `VOICE.md`
- **How should Isaac's public brand speak?** → `BRAND-VOICE.md`
- **How should that brand look and behave?** → `DESIGN-SYSTEM.md`

A role change should require editing the profile, not rebuilding the personality model. A newly observed writing habit should update the voice, not the biography. A campaign headline should be allowed to be expressive without silently becoming a factual claim.

That separation is the central design requirement of Verbal System v2.
