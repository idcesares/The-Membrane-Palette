# Membrane Composition Layer Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. The user has authorized proceeding with the recommendation.

**Goal:** Make complete Membrane compositions easier to design and review.

**Architecture:** Markdown guidance plus three static HTML exemplars using existing components and a local composition stylesheet. Extend the existing build and browser coverage to deliver and validate those references.

**Tech Stack:** HTML, semantic CSS custom properties, Node.js, Playwright and axe.

**Spec:** `docs/superpowers/specs/2026-11-05-composition-layer-design.md`

## Global constraints

- Preserve the component/token API and framework-free architecture.
- Use existing semantic tokens for visual values; local CSS controls composition.
- Mark examples illustrative; establish no personal or institutional facts.
- Support both themes, 360px screens, keyboard use and six landscape print pages.
- Do not deploy.

## Review focus

- New example pages must be included in browser coverage automatically.
- The complete deck must remain readable with enlarged text on screen.
- Print must contain six pages with no clipped slide contents.
- Documentation and previews must resolve from both source and built site.
- Agent indexes must expose the same composition guidance as human entry points.

### Task 1: Guidance and exemplars

- [x] Write deck behavior/print tests; verify they fail before the new reference exists.
- [x] Add composition guide, creative freedom guidance and visual rubric.
- [x] Add workshop, research explainer and six-slide presentation, plus shared composition CSS.
- [x] Update specification, README, showcase and changelog.

### Task 2: Delivery and verification

- [x] Discover all example HTML in existing accessibility/link suites; include nested composition Markdown in link checks.
- [x] Ship composition docs and inlined guidance in the static build; update generated index source and rebuild.
- [x] Add a repeatable preview render command and inspect desktop/mobile/print renders.
- [x] Run verbal check, full build and browser suite, and review the final diff.


## Execution notes

- Deck navigation, enlarged-text and PDF checks first failed against the missing reference, then passed with the implementation.
- Review caught source-checkout homepage links; a source-reference test reproduced the break before the links/build rewrite were corrected.
- Review caught workshop/research overflow at 200% text and 360px. Regression checks reproduced 35px/23px overflow; inherited wrapping and a local wrapping action fixed both.
- The README now explicitly identifies local page CSS as authored source.
- Preview renders cover light/dark desktop, phone and all six deck canvases. All six exported PDF pages were visually inspected.
- Browser installation required temporary user-space libraries for WebKit. No runtime configuration was committed. The canonical Playwright container could not be pulled (Forbidden); gallery pixel baselines were not changed.
- The full accessibility run exposed an unlandmarked deck instruction block. A labeled complementary landmark fixed it; all six theme/browser checks passed on rerun.
- Final validation: build (162 contrast checks, component/docs lint), HTML validation, TypeScript and verbal guard passed. Full browser run: 207 passed, 7 skipped, 2 timeouts in existing showcase tests (Firefox dark axe scan and WebKit toast dismissal). Both timeout cases passed in a serial retry, for 209 passing checks overall. The seven skips are existing engine-specific exclusions plus non-Chromium PDF output.
