# Composition hardening and discovery

The user approved the three prioritized follow-ups: scope deck printing, enforce semantic tokens in local composition CSS and expose the three exemplars in a thumbnail gallery. Preserve the existing component API and existing work in this checkout.

- [x] Add regression checks for ordinary-page PDF size, gallery navigation and build rejection of invalid example stylesheets; verify they fail against the current implementation.
- [x] Use named print pages for the deck and scope its chrome-hiding rules; keep ordinary examples on browser-selected paper.
- [x] Share token/color validation between component CSS and every direct `examples/*.css` stylesheet. Preserve component knob validation; allow declared `--composition-*` and `--mp-*` knobs in example CSS. Reject raw colors, unknown/primitive/deprecated tokens and token redefinitions.
- [x] Add a visible compositions section using existing cards, theme-aware thumbnails, intent summaries, live-preview links and source links. Link it from primary navigation.
- [x] Update documentation, agent instructions and changelog; regenerate artifacts and previews if their appearance changes.
- [x] Inspect gallery desktop/mobile and print output, run build regression tests and the full browser suite, then obtain a focused review and fix material findings.

Validation uses temporary build fixtures rather than editing this checkout's source for negative tests. PDF checks use explicit A4 options for workshop/research and retain the six landscape pages check for the deck. No deployment or additional exemplar is included.


## Verification and review

- Initial regressions reproduced the unscoped landscape PDF settings, missing gallery and absent example-CSS build enforcement.
- Twelve temporary-checkout build tests pass, including named colors, unknown/primitive/deprecated tokens, token redefinitions, declared local knobs and quoted copy.
- Review findings were fixed with failing-then-passing tests: rootless components retain their file-specific diagnostic, and accepted custom-property/var syntax remains represented in manifest and README API output. Guard and metadata now share one scanner.
- Full browser suite: 220 passed, 11 engine-specific skips, zero failures across Chromium, Firefox and WebKit. Named-page PDF checks, gallery navigation, automatic/manual thumbnail themes and all existing suites passed.
- HTML validation, TypeScript, verbal guard and whitespace checks pass. Desktop/phone gallery renders were inspected in light and dark. Existing pixel-baseline files were not changed.
- Changes remain in this checkout; no deployment or additional exemplar.
