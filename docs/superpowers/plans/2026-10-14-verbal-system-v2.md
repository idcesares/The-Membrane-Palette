# Verbal System v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Verbal System v2 so factual biography, observed writing behavior, public brand expression and visual/UI rules have separate authorities, while shipping the release as v2.2.0 without breaking the public component/token API.

**Architecture:** Add `PROFILE.md` and `VOICE.md` as new source documents, reduce `BRAND-VOICE.md` to a public application layer, and keep `DESIGN-SYSTEM.md` authoritative for visual/UI behavior. Agent-facing generators and deployment must expose the new authority hierarchy. Existing generated files continue to flow from `tokens/membrane.tokens.json`, component READMEs and the build scripts; do not hand-edit generated artifacts.

**Tech Stack:** Markdown documentation, Node.js >=22 build scripts, DTCG token JSON, framework-free HTML/CSS component docs, Playwright/axe/html-validate/type-check verification.

**Spec:** `docs/superpowers/specs/2026-10-14-verbal-system-v2-design.md`

## Global Constraints

- Identity is `Researcher · Educator · Developer` / `Pesquisador · Educador · Desenvolvedor`.
- `PROFILE.md` is the only verbal-system authority for mutable personal facts.
- `VOICE.md` is the authority for writing behavior and register adaptation.
- `BRAND-VOICE.md` is the public-brand application layer; it may not invent biography.
- `DESIGN-SYSTEM.md` remains the visual/UI authority.
- Core agent rule: `PROFILE decides what is true. VOICE decides how Isaac says it. BRAND-VOICE decides how that voice is expressed publicly. DESIGN-SYSTEM decides how it appears and behaves in interfaces.`
- Never infer biography from a writing example.
- Examples must be classified as `OBSERVED`, `APPROVED` or `ILLUSTRATIVE` when used as voice evidence.
- `Developer` replaces `Builder` only when `Builder` describes Isaac's personal identity. Aesthetic/technical uses become context-specific terms such as `making`, `technical craft`, `code` or `development`.
- Do not rename stable public CSS classes, component attributes or token names solely for this work.
- `Let's co-create` / `Vamos cocriar?` may remain as optional campaign/sample copy, but must not be documented as a universal or default CTA.
- Generated artifacts must be regenerated through `npm run build:system`; never hand-edit `llms.txt`, `components/manifest.json`, generated CSS or generated README/showcase regions.
- Target release is v2.2.0.

## Review Focus

1. **Biography leakage from examples:** any first-person sample that reads as personal history must either be observed/approved and factual, or rewritten as non-biographical illustrative copy.
2. **Mechanical Builder replacement:** technical phrases such as `builder/code register` must become context-appropriate language, not `developer/code register` by blind substitution.
3. **Generated-file drift:** changes to component examples, token descriptions or agent indexes must be made in source and followed by a clean `npm run build:system`.
4. **Agent discoverability:** deployed `llms.txt` / `llms-full.txt` and README guidance must actually expose `PROFILE.md`, `VOICE.md`, `BRAND-VOICE.md` and their precedence.
5. **Visual regressions caused by copy changes:** if example text changes alter screenshots, inspect visual diffs rather than accepting new baselines automatically.

---

### Task 1: Establish factual and writing authorities

**Files:**
- Create: `PROFILE.md`
- Create: `VOICE.md`
- Modify: `BRAND-VOICE.md`

**Interfaces:**
- Consumes: approved design spec and existing `BRAND-VOICE.md` v1 content.
- Produces: the three-source verbal authority model used by all later tasks.

- [ ] **Step 1: Create `PROFILE.md` with a dated factual baseline**

Include exactly these approved current facts and explicit non-inferences:
- Public name: `Isaac D'Césares`.
- Current role: `Coordenador de Tecnologias Educacionais no Departamento Nacional do Sesc`.
- English role: `Educational Technology Coordinator at Sesc's National Department`.
- UFRJ wording: `pesquisador (mestrando)`.
- English academic wording: `researcher and master's candidate at UFRJ`.
- Public identity terms: researcher, educator, developer.
- Primary domains: education technology, emerging technologies, artificial intelligence, digital transformation, software/development, research and higher education.
- Explicitly unsupported as current facts: `Director of Digital Transformation`, completed Master's degree, invented years of AI specialization.
- `Last reviewed: 2026-10-14`.

Add the factuality rules from the spec: no participation→leadership, ongoing study→completed degree, adjacent experience→quantified specialization, illustrative scenario→personal history, example project→delivered case, or broad interest→formal title.

- [ ] **Step 2: Create `VOICE.md` around `Stable voice, adaptive register`**

Document:
- stable traits: human, reflective, precise, contextual, structurally minded, warm without excess, technically honest, nuanced, direct when shared context allows;
- recurring structure: context → nuance → intention → action;
- cognitive-draft vs finished-artifact sentence behavior;
- observed vocabulary families (`ideia`, `proposta`, `processo`, `estrutura`, `organização`, `contexto`, `camada`, `mapear`, `apoiar`, `considerar`, `principalmente`, `justamente`, `realmente`, `acho`, `talvez`, `a ideia é`);
- epistemic hedging rule: confidence follows evidence;
- register adaptations for institutional, academic, teaching, developer/technical, social/LinkedIn and informal/direct messages;
- anti-patterns: abstraction without referent, generic AI/LinkedIn phrasing, excessive sloganization, repeated `not X, but Y`, forced enthusiasm, ceremonial corporate language, excessive em dashes, false certainty, excess sentimentality and persona-like over-polish.

Add an evidence section defining `OBSERVED`, `APPROVED` and `ILLUSTRATIVE`. Include only examples that can be labeled honestly. Do not reuse first-person fabricated memories from the old guide.

- [ ] **Step 3: Rewrite `BRAND-VOICE.md` as a shorter application layer**

Preserve:
- membrane/human↔digital framing;
- `warm without being casual, precise without being cold`;
- articulate, warm, concrete, confident-without-arrogance;
- Brazilian grounding without folkloric performance;
- ethical attention to agency and trade-offs.

Change:
- `The Translator` from defining archetype to optional lens;
- `Researcher · Educator · Builder` to `Researcher · Educator · Developer`;
- signature phrases from required identity rules to optional campaign assets;
- `Vamos cocriar?` from defining/default CTA to optional phrase;
- public bio rules so every factual sentence must derive from `PROFILE.md`.

Delete or rewrite unsupported autobiographical examples, including the fabricated Rio-teacher memory, `Director of Digital Transformation`, `I have a Master's from UFRJ`, invented `eight years` / `three years` experience statements, and any other unsupported first-person history.

- [ ] **Step 4: Verify the authority documents manually and by search**

Run:
```bash
grep -n "Director of Digital Transformation\|I have a Master's\|eight years\|three years building AI" PROFILE.md VOICE.md BRAND-VOICE.md || true
grep -n "Researcher.*Educator.*Builder" PROFILE.md VOICE.md BRAND-VOICE.md || true
```
Expected: no unsupported/current-authority matches. Any occurrence retained for an explicit `do not infer` warning must be clearly labeled as unsupported, not used as biography.

- [ ] **Step 5: Commit**

```bash
git add PROFILE.md VOICE.md BRAND-VOICE.md
git commit -m "docs: establish Verbal System v2 authorities"
```

---

### Task 2: Integrate the verbal system into the design specification

**Files:**
- Modify: `DESIGN-SYSTEM.md`
- Modify: `tokens/membrane.tokens.json`
- Modify: `components/code/README.md`
- Modify: `components/prose/README.md`
- Modify as needed after search: `components/tag/README.md`, `components/choice/README.md`, `components/button/README.md`, `components/input/README.md`, `components/navbar/README.md`, `components/table/README.md`, `components/chart/README.md`
- Modify: `examples/starter.html`
- Modify: `examples/article.html`
- Modify if affected by wording: `docs/figures/src/membrane.html`

**Interfaces:**
- Consumes: `PROFILE.md`, `VOICE.md`, `BRAND-VOICE.md` from Task 1.
- Produces: consistent visual/verbal semantics and safe sample content for generators in Task 3.

- [ ] **Step 1: Update `DESIGN-SYSTEM.md` authority references and identity language**

At minimum:
- update the header to `Version 2.2 · October 2026` when release metadata is applied in Task 5; until then keep version work grouped there if preferred;
- in sections that currently point only to `BRAND-VOICE.md`, distinguish profile facts, writing behavior and public branding;
- replace personal identity `Builder` with `Developer`;
- change `Builder energy` to `Making energy`;
- change `builder/code register` semantics to `technical craft / code register` or an equally specific phrase;
- change the AI constraint block so it no longer requires every output to hold both registers or uses `Let's co-create` as default CTA;
- keep §16 interface-writing patterns for errors, empty states, confirmations, labels and toasts;
- replace the button rule that privileges a signature phrase with a rule that primary labels describe the action; signature phrases are allowed only when the action genuinely is an invitation to collaborate.

- [ ] **Step 2: Update token-source descriptions without renaming tokens**

In `tokens/membrane.tokens.json`, change the Amber description from `Builder energy...` to `Making energy...` (preserving the existing contrast/use constraints). Search token descriptions for other personal-identity `builder` language and rewrite contextually.

Do not edit `tokens/tokens.resolved.json`, `tokens/design-tokens.css`, `tokens/base.css`, `tokens/membrane-tailwind.css` or `membrane.css` by hand.

- [ ] **Step 3: Audit source component examples for obsolete semantics and privileged CTAs**

Use:
```bash
grep -RniE "builder|builders|Let's co-create|Vamos cocriar" components --include='README.md'
```

Apply context-specific changes:
- `components/code/README.md`: `The builder register` → `The code / technical-craft register`.
- `components/prose/README.md`: remove `builder register` phrasing while preserving the design explanation.
- `components/button/README.md`: replace generic primary example `Let's co-create` with an action-specific label such as `Save draft` or `Start workshop`; update Do/Don't so verbs are required but no brand CTA is privileged. If `Builders' Lab` is merely fictional sample content, either rename it to a neutral fictional workshop name or keep it only if it cannot be confused with Isaac's identity.
- `components/input/README.md`: replace `Vamos cocriar?` textarea sample with neutral sample text unless the example is explicitly labeled as optional campaign copy.
- `components/navbar/README.md`: replace default navbar CTA with a context-specific action.
- `components/tag/README.md`, `components/choice/README.md`, `components/table/README.md`, `components/chart/README.md`: review `Builder/Builders` labels and keep only genuinely domain/sample meanings; otherwise replace with `Developers`, `Technical`, or neutral fictional data as appropriate.

- [ ] **Step 4: Make sample cases non-biographical**

Replace the unsupported `How 3,000 educators co-designed their own assistant.` in `components/card/README.md` and `examples/article.html` with clearly fictional/neutral copy that does not imply Isaac delivered that case. Prefer a visibly generic sample, e.g. `A sample program for testing collaborative AI-literacy workflows.` or a fictional organization/case label.

Review `examples/article.html` for any other text that could be read as Isaac's biography or delivered portfolio rather than an illustrative pattern.

In `examples/starter.html`, keep collaboration language only where context justifies it; do not present `Let's co-create` / `Vamos cocriar?` as the system default.

- [ ] **Step 5: Rebuild token/component outputs and inspect the diff**

Run:
```bash
npm run build:system
git diff -- tokens/tokens.resolved.json tokens/design-tokens.css components/manifest.json llms.txt showcase/index.html
```
Expected: generated changes reflect only source description/example updates plus later agent-index work; no API classes/attributes/tokens are renamed.

- [ ] **Step 6: Verify no accidental Builder identity remains**

Run:
```bash
grep -RniE "Researcher.*Educator.*Builder|builder/code register|Builder energy" . \
  --exclude-dir=.git --exclude='CHANGELOG.md' --exclude='docs/superpowers/specs/2026-10-14-verbal-system-v2-design.md' --exclude='docs/superpowers/plans/2026-10-14-verbal-system-v2.md' || true
```
Expected: zero current-system matches after generated outputs are rebuilt. Historical changelog/spec references are allowed only when explicitly historical.

- [ ] **Step 7: Commit**

```bash
git add DESIGN-SYSTEM.md tokens/membrane.tokens.json components/*/README.md examples/*.html docs/figures/src/membrane.html tokens/*.css tokens/tokens.resolved.json components/manifest.json components/membrane.d.ts components/membrane-components.css membrane.css showcase/index.html llms.txt
git commit -m "docs: align design semantics with Developer identity"
```

Only add files actually changed; do not force unrelated generated files into the commit.

---

### Task 3: Teach agents the new authority hierarchy

**Files:**
- Modify: `scripts/build-components.mjs`
- Modify: `scripts/build-cloudflare-pages.mjs`
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Generated: `llms.txt`
- Generated at build/deploy time: `dist/llms-full.txt`

**Interfaces:**
- Consumes: verbal authorities and design semantics from Tasks 1–2.
- Produces: machine-readable discovery and deployed documentation that points agents to the correct source for each question.

- [ ] **Step 1: Update the generated `llms.txt` source in `scripts/build-components.mjs`**

Where the script composes agent rules/index content, add links/descriptions for:
- `PROFILE.md` — factual identity and current biographical claims;
- `VOICE.md` — observed writing behavior and register adaptation;
- `BRAND-VOICE.md` — public brand application;
- `DESIGN-SYSTEM.md` — visual/UI rules.

Encode the precedence and `Never infer biography from examples` rule in the generated house rules. Keep component API generation unchanged.

- [ ] **Step 2: Update deployed docs assembly in `scripts/build-cloudflare-pages.mjs`**

Add `PROFILE.md` and `VOICE.md` to the root files copied into `dist/` alongside `DESIGN-SYSTEM.md` and `BRAND-VOICE.md`.

Add the new verbal authority docs to the `llms-full.txt` sections before component docs, in this order:
1. `llms.txt`
2. `PROFILE.md`
3. `VOICE.md`
4. `BRAND-VOICE.md`
5. component READMEs
6. `DESIGN-SYSTEM.md`

This ensures factual and writing authorities are loaded before generated UI examples.

- [ ] **Step 3: Update human-facing agent guidance in `README.md`**

In `What This Is` / file table and `For AI Agents`:
- list `PROFILE.md`, `VOICE.md`, `BRAND-VOICE.md` separately;
- explain the authority hierarchy in one compact paragraph;
- replace generic `Let's co-create` quick-start examples with action-specific copy so the README does not teach it as a default UI label.

- [ ] **Step 4: Update `AGENTS.md` and `CLAUDE.md` identically**

Add a `Verbal System` or equivalent section that states:
- read `PROFILE.md` for claims about Isaac;
- read `VOICE.md` for prose behavior;
- read `BRAND-VOICE.md` for public brand copy;
- read `DESIGN-SYSTEM.md` for UI/visual behavior;
- never turn examples into biography;
- unsupported facts must be omitted or explicitly marked for verification.

Change the typography semantic wording from `JetBrains Mono = builder/code register` to `JetBrains Mono = technical craft / code register` in both files.

- [ ] **Step 5: Rebuild and inspect agent outputs**

Run:
```bash
npm run build:system
npm run build
grep -n "PROFILE.md\|VOICE.md\|Never infer biography" llms.txt dist/llms-full.txt
```
Expected: both agent surfaces expose the hierarchy and rules; `dist/PROFILE.md`, `dist/VOICE.md`, `dist/BRAND-VOICE.md`, and `dist/DESIGN-SYSTEM.md` exist.

- [ ] **Step 6: Commit**

```bash
git add scripts/build-components.mjs scripts/build-cloudflare-pages.mjs README.md AGENTS.md CLAUDE.md llms.txt components/manifest.json showcase/index.html
git commit -m "feat: expose verbal authority model to agents"
```

Add only generated files actually changed by the build.

---

### Task 4: Add regression checks for factuality and authority drift

**Files:**
- Create: `scripts/check-verbal-system.mjs`
- Modify: `package.json`
- Modify: `.github/workflows/ci.yml` if the existing CI does not run the new check through `npm test` / build.

**Interfaces:**
- Consumes: the final verbal-system file set.
- Produces: an automated guard against known regressions without trying to lint subjective style.

- [ ] **Step 1: Add a deterministic verbal-system check script**

Create `scripts/check-verbal-system.mjs` that exits non-zero when any of these invariants fail:
- required files `PROFILE.md`, `VOICE.md`, `BRAND-VOICE.md`, `DESIGN-SYSTEM.md` do not exist;
- `PROFILE.md` lacks `Coordenador de Tecnologias Educacionais`, `pesquisador (mestrando)`, `Researcher`, `Educator`, and `Developer`/Portuguese equivalents;
- current authoritative docs contain `Researcher · Educator · Builder`;
- `DESIGN-SYSTEM.md`, `AGENTS.md`, `CLAUDE.md` or generated `llms.txt` still contain `builder/code register` or `Builder energy`;
- `DESIGN-SYSTEM.md` still declares `Default CTA: "Let's co-create"`;
- `BRAND-VOICE.md` still contains the old unsupported current title `As Director of Digital Transformation at Sesc DN` or claims a completed UFRJ Master's;
- `llms.txt` lacks links/rules for both `PROFILE.md` and `VOICE.md`.

The script should report the file and violated invariant, not rewrite anything.

- [ ] **Step 2: Wire the check into npm scripts**

Add:
```json
"check:verbal": "node scripts/check-verbal-system.mjs"
```

Run it as part of `build:system` after both generators, or as an explicit prerequisite in `test`, so CI always evaluates generated `llms.txt` rather than a stale pre-build file. Preferred ordering:
`build:tokens` → `build:components` → `check:verbal`.

- [ ] **Step 3: Verify the check fails on a controlled bad input, then restore**

Temporarily change a local working-copy phrase (do not commit) to one prohibited invariant, run `npm run check:verbal`, confirm a non-zero exit with the expected message, restore the file, then run again and confirm success.

- [ ] **Step 4: Run the full existing validation**

Run:
```bash
npm run build:system
npm test
```
Expected: build, HTML validation, type check and Chromium/Firefox/WebKit suites pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-verbal-system.mjs package.json package-lock.json .github/workflows/ci.yml
git commit -m "test: guard Verbal System authority invariants"
```

Only include `.github/workflows/ci.yml` if wiring through npm scripts is insufficient for the existing workflow.

---

### Task 5: Prepare v2.2.0 release metadata and final verification

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `README.md`
- Modify: `DESIGN-SYSTEM.md`
- Modify: `CHANGELOG.md`
- Modify if version is rendered there: `showcase/index.html` source/generated region
- Generated version-bearing files: `tokens/design-tokens.css`, `tokens/base.css`, `tokens/membrane-tailwind.css`, `tokens/tokens.resolved.json`, `fonts/fonts.css`, `components/membrane-components.css`, `components/manifest.json`, `components/membrane.d.ts`, `membrane.css`, `llms.txt`
- Optional visual asset if release policy requires it: `showcase/assets/idcesares-social-design-system-og.png`

**Interfaces:**
- Consumes: completed Tasks 1–4.
- Produces: release-ready v2.2.0 branch and PR.

- [ ] **Step 1: Bump version to 2.2.0**

Update `package.json` and the root package entry in `package-lock.json` to `2.2.0`. Update hand-written version strings required by `docs/RELEASING.md`: README badge, `DESIGN-SYSTEM.md` header and showcase footer/source where applicable.

- [ ] **Step 2: Write the v2.2.0 changelog section**

Move current `[Unreleased]` content plus Verbal System v2 changes into `## [2.2.0] — 2026-10-14` (or use the actual tag date if release happens later). Summarize:
- added `PROFILE.md` and `VOICE.md`;
- restructured `BRAND-VOICE.md`;
- Developer identity replacing Builder identity;
- factuality/evidence model;
- agent authority hierarchy and deployment;
- safer sample content;
- no component/token API break.

Keep historical v2.1 text unchanged.

- [ ] **Step 3: Regenerate all version-bearing outputs**

Run:
```bash
npm run build:system
npm run build
```
Expected: generated headers/manifests report 2.2.0 and `dist/` contains the four authority documents.

- [ ] **Step 4: Run semantic search/grep acceptance checks**

Run:
```bash
grep -RniE "As Director of Digital Transformation at Sesc DN|Researcher.*Educator.*Builder|builder/code register|Builder energy|Default CTA:.*Let's co-create|How 3,000 educators co-designed" . \
  --exclude-dir=.git --exclude='CHANGELOG.md' --exclude-dir='docs/superpowers' || true

grep -n "Coordenador de Tecnologias Educacionais" PROFILE.md
grep -n "pesquisador (mestrando)" PROFILE.md
grep -n "Stable voice, adaptive register" VOICE.md
grep -n "PROFILE decides what is true" PROFILE.md VOICE.md BRAND-VOICE.md DESIGN-SYSTEM.md README.md AGENTS.md CLAUDE.md llms.txt
```
Expected: prohibited current-copy search returns no unintended matches; required facts/rules are present.

- [ ] **Step 5: Run full test suite and freshness check**

Run:
```bash
npm ci
npm test
npm run build:system
git status --short
```
Expected: all tests pass and the final build does not create uncommitted generated changes beyond intentional release assets.

If copy changes alter visual regression snapshots, inspect the diffs in the canonical Playwright container/CI. Commit new baselines only when the visual change is an intended consequence of the approved copy change.

- [ ] **Step 6: Render/review social image only if required by the release checklist**

Because the version or visible showcase copy may change, run:
```bash
npm run render:social
```
Inspect `showcase/assets/idcesares-social-design-system-og.png`; commit only if its content changed intentionally.

- [ ] **Step 7: Commit release preparation**

```bash
git add package.json package-lock.json README.md DESIGN-SYSTEM.md CHANGELOG.md showcase/ tokens/ fonts/ components/ membrane.css llms.txt
git commit -m "chore: prepare Membrane Palette v2.2.0"
```

Exclude `dist/` (gitignored) and any unrelated files.

- [ ] **Step 8: Whole-branch review before PR**

Compare against `master` and verify the branch contains no public API rename:
```bash
git diff --stat master...HEAD
git diff master...HEAD -- tokens/membrane.tokens.json components/*/*.css
```
Expected: token values/classes/component CSS behavior remain unchanged except documentation descriptions; no class/attribute/token rename.

- [ ] **Step 9: Open PR**

Title: `Verbal System v2: factual profile, adaptive voice, Developer identity`

PR body should summarize the four-authority model, factual corrections, sample-safety changes, agent integration, tests run, and explicitly state `No public component/token API break`.
