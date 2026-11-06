# Experience Patterns Implementation Plan

> Use test-first implementation and a focused final review. The user has authorized the recommendations; implementation proceeds in this checkout while preserving prior work.

**Goal:** Teach complete task behavior with inspectable guidance, honest evidence and two bilingual working references.

**Spec:** `docs/superpowers/specs/2026-11-06-experience-patterns-design.md`

**Architecture:** Native HTML + plain local JS, existing component library and semantic tokens. Authored Markdown/evidence JSON ships with the static site and agent index. No new service or runtime dependency.

## Tasks

- [x] Write explorer browser regressions; verify failure against the missing reference.
- [x] Implement explorer search/filter, adaptive selection/back, deterministic loading/cancel/retry/partial/empty states, and in-place English/pt-BR translation.
- [x] Implement and verify independent bilingual form journey (delegated four-file ownership).
- [x] Author pattern/adoption guides and accessibility evidence inventory with untested manual status (delegated documentation ownership).
- [x] Integrate docs, evidence, examples, gallery, previews and source links; relax the word-count rule while retaining concrete action labels.
- [x] Add evidence-contract checks and complete behavior/state accessibility checks.
- [x] Run build checks, full three-browser suite and rendered inspections; address focused review findings and report actual limits.

## Review focus

Late local operations must not overwrite canceled/new states. Filtering and language changes must preserve meaningful state. Mobile pane hiding must not strand keyboard focus. Validation must preserve answers and link errors to inputs. Demo confirmation must not imply a real submission. Manual accessibility or user research must never be claimed from automated results. Every new guide, script and source URL must resolve from the built site.

## Verification and limits — 2026-11-06

- Focused independent review identified native-disabled action focus loss; a failing keyboard regression preceded the guarded `aria-disabled` correction. Mobile recovery controls remain reachable with detail open.
- State/theme audits exposed an intermediate link-color contrast failure while changing OS theme. Local color changes now switch together, retaining transform/shadow motion.
- Full browser run: 345 passed, 11 expected skips, one WebKit Portuguese/200% overflow failure. The scoped native-select wrapping correction was followed by all 63 explorer tests across Chromium, Firefox and WebKit, all passing. Latest unique outcomes: 346 passed, 11 skipped, no unresolved failures.
- The dated [execution record](../../accessibility/automated-run-2026-11-06.json) identifies commands, source snapshots, engine versions and skipped assertions. Build regression tests, HTML/type validation, verbal guard and source/deployed links were checked; previews were regenerated and desktop/mobile plus translated error/review/detail states inspected.
- No manual screen-reader or participant usability session was performed. Canonical container pixel comparisons remain unrun because the image pull was blocked with Forbidden; existing baseline images were preserved. No commit, push or deployment was performed.
