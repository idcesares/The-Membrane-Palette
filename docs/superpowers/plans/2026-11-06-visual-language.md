# Visual Language Implementation Plan

> Execute inline with `superpowers:executing-plans`; preserve the existing shared checkout. The user's instruction to proceed authorizes this implementation.

**Goal:** Make Membrane's combined editorial/structural expression usable through assets, arrangements and finished examples.

**Architecture:** Deterministic SVG renderer consumes resolved semantic tokens; static HTML/CSS composes those assets with existing components. Documentation and assets ship in the current static build.

**Tech Stack:** Node ESM, SVG, native HTML/CSS, existing Playwright/axe tools.

**Spec:** `docs/superpowers/specs/2026-11-06-visual-language-design.md`

## Global constraints

- Continue in the shared checkout and preserve previous authorized work; no commit/push/deploy.
- No runtime dependency or new component API. Existing brand marks stay intact.
- Six constructions, two theme variants each. Resolved semantic tokens supply every color.
- Meaningful diagrams retain visible text equivalents; sample content remains illustrative.

## Review focus

Standalone SVGs must not silently rely on page CSS/fonts. Light/dark artwork must match its actual surface, including the explicitly dark specimen. Enlarged labels must reflow without hiding meaning. Cropping applies only to decorative fields, never to diagrams. Asset downloads and documentation must work from source and deployed paths.

### Task 1: Visual assets

**Files:** `scripts/render-visual-assets.mjs`, `brand/visuals/*`, `scripts/tests/visual-assets.test.mjs`, `package.json`, build scripts.

**Interfaces:** renderer consumes `tokens/tokens.resolved.json`; produces `brand/visuals/catalog.json` and `<id>-<light|dark>.svg` for the six IDs in the spec. Catalog records id, title, role, description, usage, limitations and files.

- [x] Write renderer contract checks and observe the missing renderer fail.
- [x] Implement deterministic geometry and semantic-token color resolution; generate the catalog and twelve SVGs.
- [x] Verify self-contained SVGs, exact catalog/file closure and matching semantic colors. Run build tests.

### Task 2: Working visual specimen

**Files:** `examples/visual-language.html`, `examples/visual-language.css`, `tests/visual-language.spec.mjs`, gallery/renderer integration.

**Interfaces:** consumes catalog paths from Task 1; provides sections `#opening`, `#presentation-cover`, `#teaching-card`, `#arrangements`, `#asset-library` and a sixth gallery reference.

- [x] Write specimen reflow/download/theme checks; observe the missing reference fail.
- [x] Compose website opening, dark cover, teaching card, grouped icons, annotated diagram and six-asset catalog with real download links.
- [x] Add gallery entry and preview capture; update gallery expectations from five to six.
- [x] Inspect both themes/phone/enlarged text and scoped print; run focused browser checks.

### Task 3: Guidance and delivery

**Files:** `docs/visual-language/README.md`, spec/README/agent docs/changelog, `scripts/build-components.mjs`, `scripts/build-cloudflare-pages.mjs`, `tests/links.spec.mjs`.

**Interfaces:** consumes assets/specimen; ships the guide and includes it in the agent index/full document.

- [x] Document role choices, motif grammar, arrangements, scales, accessibility, themes and editing/generation. Update illustration rules by purpose.
- [x] Integrate guide/catalog/specimen into all discovery/build paths; verify source and deployed links.
- [x] Regenerate previews and outputs; run build/HTML/type/verbal checks and full three-browser suite.
- [x] Obtain a focused independent review, resolve material findings, record actual verification and limits.

## Ledger

Pre-flight: Task 2 consumes the six IDs/variant paths emitted by Task 1; Task 3 ships these unchanged. No interface conflict.

Ruling: Work in place to preserve the preceding uncommitted system improvements, which this feature directly builds on. Keep the change reviewable without committing the combined working tree.


## Completion evidence — 2026-11-06

- Renderer tests failed against the missing renderer, then passed against the real token-driven implementation. The specimen test failed against the missing page, then passed after implementation.
- Focused Chromium verification: 40 passed (specimen, compositions and links). The lazy-image assertion was adjusted to scroll each image into view before checking decode, matching actual use; preview capture eagerly decodes images so below-the-fold artwork is present in full-page renders.
- Full command: `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LD_LIBRARY_PATH="/tmp/membrane-apt/libs/usr/lib/x86_64-linux-gnu${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}" PLAYWRIGHT_JSON_OUTPUT_FILE=/tmp/membrane-visual-full.json npm test -- --workers=3 --reporter=list,json`.
- Full results: 16 Node build checks passed; system/site build, HTML and TypeScript validation passed; 373 browser tests passed, 11 expected platform skips, zero failures. Logs: `/tmp/membrane-visual-full.log`; structured results: `/tmp/membrane-visual-full.json`.
- Verbal authority guard and whitespace checks passed. Desktop/phone previews in both themes, the six-asset catalog, presentation cover and print layout were inspected. Print clipping probe returned no clipped cover/card/catalog blocks; Chromium produced a seven-page A4 specimen for inspection.
- Independent focused review completed with no Critical, Important or Minor findings. The initial reviewer could not start due a model usage limit; an available reviewer completed the review.
- Scope rulings from review: static OS/fixed-surface theme handling is sufficient for this specimen; manual theme controls, a new pictogram/runtime API, unrelated prior examples and deployment are outside this request. Manual screen-reader/usability testing was not claimed or performed. Existing canonical pixel baselines were preserved; this run did not perform the container pixel-comparison project.
- No commit, push or deployment performed; the completed change remains in the shared workspace with previous authorized improvements intact.


### Final print correction

Author print inspection found the base print reset lightened the fixed dark cover and could leave OS-dark picture variants on a light paper surface. Two regressions failed before correction. The cover now explicitly retains its dark scheme in print; ordinary dark picture sources apply only on screen, so paper uses light variants. The guide documents this actual-surface rule.

Rebuilt and HTML-validated successfully, then ran the complete visual-language suite and its page accessibility/overflow checks in Chromium, Firefox and WebKit: 27 passed, zero failures (`/tmp/membrane-visual-final-scoped.log`, structured report `/tmp/membrane-visual-final-scoped.json`). The scoped correction leaves other pages untouched; their 373-pass/11-skip full-suite results remain the broader verification basis. The final A4 cover render was inspected and preserves the intended dark surface and matching artwork.
