# Changelog

All notable changes to The Membrane Palette follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format.
Versioning follows semantic conventions: breaking token renames or removals increment the major version.

---

## [Unreleased]

### Changed

- **Brand marks in interfaces (`DESIGN-SYSTEM.md` §10.6, new).** The navbar brand on Isaac's own sites is now the `dc` monogram instead of the compact wordmark: it is the only mark that shows both registers, it matches the favicon, and it doesn't repeat the name the page title already gives. The compact wordmark moves to the footer sign-off and to co-branded headers. §10.6 also documents inlining the SVG with the action tokens so the monogram rethemes in dark mode, the accessible name on the link, and minimum sizes. §10.1–10.3 and §11.1 updated to match. Guidance only: no token, class or file changed.

---

## [2.1.0] — 2026-10-11

### Why

An assessment of v2.0 (written up in [`docs/AUDIT-2026-10.md`](docs/AUDIT-2026-10.md)) found that the system stopped at tokens: components existed only as prose recipes in `DESIGN-SYSTEM.md` §6 and as showcase-local CSS that had already drifted from them, so every consumer re-implemented every component. It also found contrast failures the v2.0 gate didn't cover (form-control borders, tag text on tints, code comments) and nothing an agent could consume beyond prose. This release adds a real component library and makes the docs machine-readable and build-verified. No token was renamed or removed.

### Added — component library

- **35 framework-free CSS components** in `components/<name>/`. The first 25: Layout (container, stack, cluster, grid, section, surface, visually-hidden), Prose, Button, Link (+ skip link), Field (+ fieldset), Input (input/textarea/select), Choice (checkbox/radio), Switch, Card, Tag, Badge, Avatar, Quote, Code (+ kbd, code block, Prism/highlight.js mappings), Divider, Table, Stat, Alert, Progress (+ spinner), Tooltip, Dialog, Navbar, Breadcrumb, Tabs, Accordion.
- **One API convention:** `mp-` root class, BEM parts, options as `data-*` attributes with closed value sets, and **state from native attributes/ARIA** (`aria-invalid`, `aria-current`, `aria-selected`, `aria-pressed`, `aria-busy`, `disabled`, `[open]`) so visuals and assistive tech can't disagree. All components live in `@layer components`.
- **Tier 3 component tokens:** each component exposes `--mp-<name>-*` knobs that default to semantic tokens; variants only reassign knobs.
- `membrane.css` — one generated stylesheet with tokens + base + components. `components/membrane-components.css` — components only.
- `components/membrane.js` — behaviors (~5 KB gzipped): WAI-ARIA tabs (click, arrows, Home/End, RTL), menu keys and positioning, combobox filtering and keys, the toast API, tooltip Escape-dismiss (WCAG 1.4.13), and fallbacks for dialog invoker commands and `closedby="any"`. Tabs, Menu, Combobox and Toast need it; everything else works without it.
- `scripts/build-components.mjs` (`npm run build:components`) — **lints** every component (no raw colors, no unknown/deprecated tokens, no Tier 1 primitives, knobs must be `--mp-*`) and every README example (no classes, attributes or values the CSS doesn't implement; unique ids; labelled icon-only buttons; `alt` on images), then writes the bundles, the manifest, `llms.txt`, each README's API section and the showcase gallery.
- **Coverage lint:** every class and `data-*` value a component implements must be demonstrated in its README examples, so the showcase is guaranteed to render all of them (token scales and runtime state can opt out via an `exempt:` frontmatter line).
- `npm run build:system` runs both builds in order.
- **And ten more:** Combobox (WAI-ARIA list autocomplete, accent-insensitive filtering, live result count), Text (tone + reading measure, so pages need no inline styles), Chart (figure, legend, single/stacked bar list), Icon (Lucide-style line icons sized by `--size-icon-*`), Skeleton, Empty state, Toast (`MembranePalette.toast()` + `data-mp-toast`), Pagination, Steps (course progress) and Menu (native `popover`, anchor-positioned, WAI-ARIA menu keys).
- **Page patterns:** `examples/article.html` and `examples/dashboard.html` next to the starter; all `examples/*.html` are linted by the component build like README examples.

### Added — data visualization

- `--color-chart-1` … `--color-chart-6` (terracotta, teal, amber, burgundy, steel blue, green): a categorical palette **searched and validated** per mode — lightness band, chroma floor, adjacent color-blind separation (worst ΔE 11.5, OKLab ×100), normal-vision separation (≥ 16) and ≥ 3:1 on page and cards. Gate-checked on every build. Scatter-type charts are capped at 2 series (slots 1 and 3 collapse for deuteranopes when adjacent) — documented, not hidden.
- `DESIGN-SYSTEM.md` §7.4 rewritten as rules: fixed order, color follows the entity, one-hue magnitude, terracotta↔teal polarity, status kept separate, thin marks, one y-axis.

### Added — platforms & testing

- `tokens/membrane-tailwind.css` — a Tailwind v4 theme generated from the tokens. Tailwind namespaces that collide with the system's own names (`--radius-md`, `--text-sm`, `--shadow-sm`, `--ease-in`…) are reset so load order can never override the system; the system is exposed as `mp-` utilities and the default palette is removed, so off-brand classes don't compile. Verified against Tailwind 4.1.
- `tokens/tokens.resolved.json` — every token's resolved light/dark value (hex for colors) for charting libraries, native apps and tools.
- `npm test` — Playwright + axe-core: every page in both themes, phone-width overflow, and keyboard/focus/ARIA behavior of tabs, dialog, tooltip, menu, combobox, toast, skip link and forms. Runs as a second CI job. It found two real bugs on its first run (an unfocusable scrolling code block, two regions with the same name) — both fixed.
- `CONTRIBUTING.md` — sources vs generated files, the build loop, adding a token or component.
- `DESIGN-SYSTEM.md` §16 — interface writing rules, pt-BR localization (expansion, `Intl` formatting, `lang` on mixed-language phrases, RTL), and the page-pattern index.

### Added — for agents

- `components/manifest.json` — every component's classes, allowed attribute values, styled states, knobs, consumed tokens and HTML examples. Generated.
- `llms.txt` (repo root and site) and `llms-full.txt` (site) per [llmstxt.org](https://llmstxt.org), including the house rules for generating UI.
- `examples/starter.html` — a complete page built only from the library.
- `DESIGN-SYSTEM.md` §11.4 constraint block gained UI rules.

### Added — tokens

- Surfaces: `--color-bg-elevated` (lighter in dark mode), `--color-bg-inverse` / `--color-text-inverse`, `--color-bg-hover` / `--color-bg-active` (translucent state washes).
- `--color-border-input` — ≥3:1 boundary for form controls (WCAG 1.4.11).
- Hover fills: `--color-action-primary-hover`, `--color-action-secondary-hover`, `--color-error-hover` — oklab mixes toward `--color-text-primary`, so label contrast rises on hover in both modes.
- Register pairs: `--color-human-text` / `--color-human-bg`, `--color-digital-text` / `--color-digital-bg`.
- Status washes: `--color-success-bg`, `--color-warning-bg`, `--color-error-bg`, `--color-info-bg`, plus `--color-info-text`.
- `--size-control-sm/md/lg` (36/44/52px), `--measure` (65ch), `--ease-in-out` (§8.1 rule 3 had no token).
- Token types `mix` (oklab color-mix of two tokens, resolved exactly by the gate) and `tint` on semantic tokens.
- Descriptions on every semantic token (they feed the manifest and the spec table).

### Added — fonts, brand marks and types

- **Self-hosted fonts.** Fraunces, Instrument Sans and JetBrains Mono ship in `fonts/` as variable woff2 files (SIL OFL), latin and latin-ext subsets, declared with `unicode-range` and `font-display: swap`. `membrane.css` includes them, so pages drop the Google Fonts link and make no third-party requests (a test enforces it). `fonts/fonts.css` serves the split-file setup.
- **Metric-matched fallbacks:** `"Fraunces Fallback"`, `"Instrument Sans Fallback"` and `"JetBrains Mono Fallback"` are local Times New Roman, Arial and Courier New with `size-adjust` and ascent/descent overrides measured by `scripts/measure-fonts.py`, so the swap barely moves the layout. The `--font-*` stacks include them.
- **Brand marks** in `brand/`: the wordmark, compact wordmark and `dc` monogram (primary and reversed), plus light and dark app icons. They're set in Fraunces 700 with WONK=1, kerned with HarfBuzz and outlined to SVG paths (`scripts/render-brand-marks.py`). The showcase favicon and apple-touch icon use them, and a new Brand marks section offers each file for download. Spec §10.3 lists the files.
- **TypeScript types** in `components/membrane.d.ts`, generated from the manifest:
  - `MpAttrs<"button">` (each component's allowed options);
  - `MpClass`, `MpToken` (public tokens only), `MpKnob` and `MpStyle`;
  - `window.MembranePalette`.

  Boolean options are typed as presence-only, so a framework can't render `data-x="false"`. `npm run lint:types` proves invalid values fail to compile.

### Added — motion & user preferences

- `--transition-enter` (normal + ease-out), `--transition-exit` (fast + ease-in), `--transition-state` (fast + ease-in-out). Dialog, backdrop, menu, tooltip and toast now enter slowly and leave quickly, as §8.1 always specified. Toasts animate out: `membrane.js` sets a runtime `data-leaving` attribute and removes the element after the exit.
- `--duration-loop` (1600ms) for indefinite loaders, kept under reduced motion.
- **Reduced motion reduces instead of removing.** Spinner, indeterminate progress and skeleton pulse in place instead of freezing on a frame. Card lift, standalone-link nudge and button press offset are removed.
- Hover-only effects are gated on `@media (hover: hover)`, so a tap no longer leaves a button filled or a card lifted on touch screens.
- `prefers-contrast: more` also strengthens input borders and thickens the focus ring.
- Print: light scheme, no page background, navbar/skip link/toast region hidden, exact component colors, and `mp-prose` prints external link targets.
- Pages with a navbar get `scroll-padding-top`, so anchored headings aren't hidden under it.
- Showcase theme switch crossfades with a view transition (`--duration-slower`), skipped under reduced motion.
- `DESIGN-SYSTEM.md` §8 rewritten: composites, the enter/exit pattern, a per-component recipe table, loading thresholds, reduced-motion behavior, a page-transition recipe and other user preferences.
- `tests/motion.spec.mjs` covers full motion, reduced motion and touch emulation.

### Added — publishing

- A 1200×630 social preview rendered from the live tokens (`npm run render:social`), with `og:image` and a `summary_large_image` Twitter card.
- A 404 page, built only from library components; Cloudflare serves it for missing paths.
- `_headers`:
  - `nosniff`, referrer and permissions policies, and frame protection;
  - CORS on `llms.txt`, the manifest, the tokens and `membrane.css`, so agents and tools can fetch them cross-origin;
  - short cache lifetimes on unversioned files.
- **Cross-browser:** the Playwright suite runs in Chromium, Firefox and WebKit. **Visual regression:** every gallery example is compared, in both themes, with committed Chromium baselines.
- `npm run lint:html` (html-validate) on every built page, plus link-integrity tests: every same-origin URL and `#fragment` on the site resolves, and every relative link in the Markdown points at a file. Both are part of `npm test`.
- The sitemap lists the example pages.
- [`docs/RELEASING.md`](docs/RELEASING.md) — the release checklist: tag, pinned `@2` CDN URLs, jsDelivr purge, deploy and smoke test.

### Changed

- **Contrast gate: 20 → 81 pairs (162 checks).** Now covers hover fills, every `-text` on its `-bg` wash (composited over both the page and card surfaces), elevated/inverse surfaces, form-control boundaries and focus rings on every surface, and all code syntax colors. Translucent backgrounds are composited over the page before measuring.
- `DESIGN-SYSTEM.md` §6 replaced: the prose recipes are superseded by the library; §6 now documents conventions, catalog, brand rules and how to contribute a component. §2.3 (semantic colors) and §13.1 (contrast) tables are **generated** from the token source, so they can no longer drift. Added §13.4 (component accessibility); corrected the touch-target citation (2.5.5 is AAA; 2.5.8 AA is 24px).
- Showcase structure: foundations first (Palette → Typography → Rhythm), then Components, then Reference. The component gallery has a sticky index that tracks the current component, an "API at a glance" row generated from each component's CSS, and a "View HTML" disclosure with a copy button on every example. The type specimen shows the full scale with its tokens. The hero register map no longer breaks token names mid-word, and the hero stacks below 1200px.
- Showcase rebuilt on the library (navbar, buttons, inputs, tables, code blocks), with a generated component gallery, a composed specimen, and dark-mode previews that use real `data-theme` subtrees instead of hard-coded hex. Theme is applied before first paint and follows the OS until toggled. Skip link added; mobile horizontal overflow fixed.
- `@layer tokens, base, components;` order is declared at the top of every generated stylesheet.
- `tokens/base.css` now sets page defaults — `box-sizing: border-box`, `body` canvas/text/font/margin, text-size-adjust — all wrapped in `:where()` (zero specificity), so a page linking `membrane.css` needs no CSS of its own and any rule you write still wins. If you relied on the browser's 8px body margin with `base.css` loaded, set it back explicitly.
- The digital register no longer lists colors that don't exist: "Slate" was never a token (Charcoal is the dark anchor) and Steel Blue now exists only as data color `--color-chart-5`.
- CI runs both builds and fails if **any** generated file is stale (previously only the two token CSS files were checked).
- `package.json` `exports` now maps `.` to `membrane.css` and adds `./components`, `./components.js`, `./manifest.json`, `./tailwind`, `./tokens.resolved.json`, `./fonts.css` and `./types` (npm is still not a supported channel; no published consumers).
- `package.json` name changed from `@idcesares/design-system` (a scope/name that was never published and didn't match the repository) to `@idcesares/the-membrane-palette`. `package-lock.json` regenerated to match.
- Removed npm as a documented delivery path for now — the jsDelivr CDN link is the only supported integration path until npm distribution is set up.

### Fixed

- Field, Fieldset, Stat, Tabs and Alert content are grids; when a parent grid stretched them, the extra height was distributed across their rows (an input drifted away from its label in a two-column form). They now pin rows to the top (`align-content: start`).
- Narrow Navbar: the horizontally scrolling link row now fades at its trailing edge, so a clipped row reads as scrollable.
- Showcase section overlines rendered at lede size because `.section-heading p` also matched them.
- `--color-warning-text` `#8A6420` → `#7A571B`, `--color-error-text` `#B23A3A` → `#A53434` (dark `#E86060` → `#F07C78`), and dark-mode `--color-human-text` `#E08A6A`: found by running axe-core against the new showcase — on card surfaces the status/register washes composite darker (light) or lighter (dark) than on the page, which the gate didn't measure. The gate now checks every wash over cards too.
- Secondary buttons paint `--color-bg-primary` instead of `transparent`, so their teal label keeps its gated contrast on tinted surfaces such as alerts.
- `--code-comment` `#7D776E` → `#958F84`: was 3.7:1 on `--code-bg`, failing WCAG AA for text; now 5.2:1.
- Form inputs had only `--color-border-default` as their boundary (≈1.3:1 on cream, failing 1.4.11) — `.mp-input` and the choice controls use `--color-border-input`.
- The showcase input removed its focus outline and relied on a 15%-alpha glow; every component now keeps the 2px focus ring.
- Spec §6.5 tag recipe (`--color-action-primary` text on `--color-terracotta-10`) was never contrast-checked; tags now use gate-checked register pairs.
- The jsDelivr CDN URL in `README.md` dropped its `@2` version pin (no matching release tag exists).
- Spec §15 referenced `--color-tint-*` tokens that never existed.
- The former spec §8.5 claimed reduced motion disabled transform animations; nothing did. The base.css reduced-motion safety net now skips library classes (which handle reduced motion themselves) instead of freezing their loaders.
- The showcase's register map and neutral rail had `aria-label` on role-less `<div>`s, which screen readers ignore; they are now labelled groups.
- The starter page's "Writing" nav link pointed at a section that didn't exist.

### Deprecated

- `--text-sm`, `--text-base`, `--text-md`, `--text-lg`, `--text-xl` — compatibility aliases. Use `--text-small`, `--text-body`, `--text-h4`, `--text-h3`, `--text-h2`. They still work and will not be removed before v3.0.0.
- `.theme-dark` — the legacy dark-mode class. Use `data-theme="dark"` (which also offers `"light"` and works on any subtree). Still works; removal no earlier than v3.0.0.

### Migration guide

Nothing breaks. To adopt:

- Replace hand-built buttons/cards/inputs with the library: link `membrane.css` and follow each component's README. Pages that already link `tokens/design-tokens.css` + `tokens/base.css` can add `components/membrane-components.css`.
- If you styled form controls yourself, switch their border to `--color-border-input`.
- If you used `--color-terracotta-10` / `--color-teal-10` behind text, switch to `--color-human-bg` / `--color-digital-bg` with `--color-human-text` / `--color-digital-text`.
- Replace any `filter: brightness(…)` hover with the `-hover` tokens.

---

## [2.0.0] — 2026-07-05

### Architecture overhaul

**Single source of truth.** All token values now live exclusively in `tokens/membrane.tokens.json` (DTCG-flavored JSON). `tokens/design-tokens.css` and `tokens/base.css` are **generated files** — the build (`npm run build:tokens`) writes them. Never edit the CSS directly.

**Three-tier token architecture.**
- Tier 1 primitives (`--color-terracotta`, `--color-neutral-*`, etc.) are now immutable; they never change between light and dark mode.
- Tier 2 semantic tokens (`--color-action-primary`, `--color-text-tertiary`, etc.) carry their own `light-dark()` pairs and are what applications should consume.
- Tier 3 component recipes are documented in `DESIGN-SYSTEM.md §6`; not emitted as tokens.

**CSS modernization.**
- All colors emitted as **OKLCH** (round-trip-verified against sRGB source values). Hex values appear as inline comments for reference.
- Dark mode collapsed from ~70 lines of duplicated overrides to `light-dark()` on each semantic token. Manual toggle is now `[data-theme="dark"] { color-scheme: dark }` — three lines instead of a copied block.
- `:root { color-scheme: light dark }` declaration added — native controls, scrollbars, and `::selection` now respect the active mode.
- `@layer tokens` wraps all custom properties; `@layer base` wraps element rules in `base.css`. Any unlayered consumer CSS wins automatically.
- `prefers-contrast: more` and `forced-colors: active` media queries added.
- Side-effect rules (reduced motion, `::selection`, focus ring, typography composites) moved from `design-tokens.css` to the optional `tokens/base.css`.

**Derived tints.** The seven alpha-wash tokens (`--color-terracotta-10/20`, `--color-teal-08/10/12/20`, etc.) are now computed via `color-mix()` from the palette — mode-aware, no hand-tuned rgba literals.

**Automated contrast gate.** The build verifies 40 foreground/background pairs (both modes) against their WCAG minima before writing output. A failing pair aborts the build.

### Added

- `tokens/membrane.tokens.json` — DTCG-flavored source of truth.
- `tokens/base.css` — optional layer (reduced motion, selection, focus, typography composites).
- `scripts/build-tokens.mjs` — token compiler with OKLCH round-trip verification and contrast gate.
- `npm run build:tokens` script.
- `package.json` `exports` map and `files` list for npm distribution.
- New semantic tokens: `--color-action-primary`, `--color-action-secondary`, `--color-focus`, `--color-success-text`, `--color-warning-text`, `--color-error-text`, `--color-selection`.
- New size tokens: `--size-icon-sm/md/lg/xl`, `--size-touch-target`, `--size-nav`, `--size-nav-mobile`.
- New border-width tokens: `--border-width-thin/medium/thick` (previously literal px values in specs).
- New semantic elevation aliases: `--elevation-raised`, `--elevation-overlay`, `--elevation-modal`.
- New state token: `--state-disabled-opacity`, wired to a real disabled-button demo in the showcase (hover/active feedback in this system stays brightness()-filter-based per §6.1, so no separate hover/pressed opacity tokens were introduced).
- New blur token: `--blur-backdrop` (previously 12px in spec, 18px in showcase — now unified at 12px).
- New glow token: `--shadow-glow-teal` dark-mode variant (previously unmapped).
- New photo token: `--photo-dim-dark` (the `brightness(0.92)` factor from spec §12.2 rule 6).
- New accent color tints: `--color-amber-10`, `--color-burgundy-10`, `--color-sage-10`.
- Showcase: status semantics specimen (success/warning/error text + fill tokens side by side).
- `.github/workflows/ci.yml` — runs `npm run build:tokens` (OKLCH round-trip + 40-pair contrast gate) and `npm run build` on every push/PR, and fails if the committed generated CSS doesn't match a fresh build. Full pixel-diff visual regression was considered and intentionally scoped out: this project has no existing test framework, and screenshot-baseline maintenance is disproportionate for a token/CSS-only system without a component tree to snapshot.
- Token lifecycle & deprecation policy (`DESIGN-SYSTEM.md` §15) with a real mechanism behind it: mark a token `"$deprecated": "<reason>"` in `tokens/membrane.tokens.json` and the build emits an inline `/* @deprecated */` comment above its CSS declaration plus a console summary on every `npm run build:tokens` run (surfaced in CI logs too).
- Showcase "05 / Reference" section: a Do/Don't specimen (six concrete good/bad comparisons — semantic vs. primitive tokens, contrast-safe vs. unsafe status text, tokenized vs. literal touch targets); a full, searchable, generated token table (186 rows, vanilla-JS filter, live `var()` color swatches); and a generated contrast matrix (all 40 gated pairs with pass/fail badges). The table and matrix are rendered by `scripts/build-tokens.mjs` from the exact same registry and gate computation used to build the CSS — there is no hand-maintained copy to fall out of sync.

### Fixed

**Contrast failures (were silent bugs, now gate-checked on every build):**
- `--color-text-tertiary` was `#A39D93` (2.5:1 on cream) — now `#6E685F` light / `#938D83` dark (5.1:1 / 5.2:1).
- `--color-warning` amber (`#D49A3A`) was used as text color on cream (2.3:1) — introduce `--color-warning-text` (`#8A6420`, 5.0:1) for text; raw `--color-warning` is fills/badges only.
- `--color-success` sage was 3.7:1 on cream for normal text — introduce `--color-success-text` (`#3E6B52`, 5.7:1).
- `--color-error-text` added (`#B23A3A`, 5.5:1) — distinct from `--color-error` fill.
- Dark mode focus ring `--color-focus` now maps to `teal-light` (was raw `teal`, which is 3.1:1 on charcoal).
- Dark mode `--color-text-on-accent` on the lightened terracotta button was 3.3:1 — now maps to charcoal in dark mode (8.3:1).

**Spec ↔ showcase drift:**
- Nav height harmonized: `--size-nav` = 64px (spec was 64, showcase was 68).
- Backdrop blur harmonized: `--blur-backdrop` = 12px (spec was 12, showcase was 18).
- Shell margin now uses `--site-margin` instead of a hard-coded `calc(100% - 3rem)`.
- Button hover state uses `--color-bg-primary` instead of the literal inverse (secondary button dark-mode fix).
- `border-left` on featured cards uses `--border-width-thick` (3px) via token.
- All interactive references to `--color-terracotta` / `--color-teal` inside the showcase replaced with `--color-action-primary` / `--color-action-secondary`.
- `--gradient-membrane` endpoints now lighten in dark mode (spec §12.2 rule 3 was documented but not implemented).
- `--shadow-*` tokens now carry their own dark-mode values via `light-dark()` (were not overridden in dark mode).
- `--gradient-warmth` stop-color is now mode-aware via `light-dark()`.
- `DESIGN-SYSTEM.md` §6 component recipes (buttons, cards, nav, inputs, tags, blockquotes, code blocks) referenced Tier 1 primitives directly instead of the new Tier 2 semantic tokens — the exact defect the semantic tier exists to prevent. Rewritten to use `--color-action-primary/secondary`, `--color-focus`, `--elevation-*`, and `--border-width-*` throughout.
- `DESIGN-SYSTEM.md` §12.1's dark-mode mapping table and §5.3/§13.2 token tables still showed pre-fix literal values (old tertiary-text hex, old `--border-accent`/`--focus-ring` values) after the token layer had already moved on.
- §12.2 rule 2 described a "cards get a border instead of a shadow" dark-mode behavior that was never implemented and was redundant with the always-on card border in §6.2 — corrected to describe what's actually true.
- The showcase reimplemented `.type-display`/`.type-heading`/`.type-body`/`.type-code` locally instead of consuming the real `.type-display`/`.type-h2`/`.type-body`/`.type-code` composite classes shipped in `tokens/base.css` — removed the duplicate, wired the showcase to the real classes.
- The showcase's card/toggle/swatch shadows referenced raw `--shadow-sm`/`--shadow-md` directly instead of the semantic `--elevation-raised`/`--elevation-overlay` aliases introduced alongside them; wired where the component is genuinely card/overlay-shaped (large decorative panels and the code-block panel intentionally kept raw `--shadow-lg`, since "modal" doesn't describe them).
- `CLAUDE.md` and `AGENTS.md` (identical content) claimed "no build step" and named `design-tokens.css` as the single source of truth — both false as of this release. Updated to describe the actual build commands and the JSON-source/generated-CSS split; also fixed a transposed terracotta hex (`#BF5B33` → `#B35530`) that predated this release.

**Primitive mutation removed.** `[data-theme="dark"]` no longer redefines `--color-terracotta` or other primitives. Primitives are invariant; dark-mode behavior is entirely in semantic tokens.

**README CDN link fixed.** The Quick Start `<link>` example now uses jsDelivr instead of `raw.githubusercontent.com` (which serves `text/plain` and is rejected by browsers).

**Repository URL mismatch fixed.** `package.json`'s `repository.url`, the README's jsDelivr CDN link, git clone command, and file-structure diagram all pointed to `github.com/idcesares/idcesares-design-system` — a repository that does not exist. The actual remote is `github.com/idcesares/The-Membrane-Palette`; every reference now matches it. Caught by running `npm publish --dry-run` while verifying publish-readiness for this release.

### Changed (non-breaking)

- `package.json` name changed from `idcesares-design-system` to `@idcesares/design-system`.
- Type-scale description updated in spec: the scale is a variable ratio (≈1.20 at small steps, ≈1.375 at display), not a fixed Major Third.
- `README.md` restructured for two audiences: added a "For AI Agents" section (pointers to `CLAUDE.md`/`AGENTS.md`, `DESIGN-SYSTEM.md` §0/§11.4, `BRAND-VOICE.md`), a "Deployment & Publishing" section documenting the previously-undocumented Cloudflare Pages (`npm run deploy`) and `npm publish` paths, a "Contributing" section, and an anchor-linked nav row under the title.
- `CLAUDE.md` / `AGENTS.md` Commands section now lists `npm run preview` and `npm run deploy` (previously omitted) and documents the `files`/`exports` publish surface in `package.json`.
- `CHANGELOG.md` gained a standing `[Unreleased]` section per Keep a Changelog convention, so PRs have a documented place to add entries.

### Removed

- `DESIGN.md` — the hand-synced YAML mirror of the tokens. Since v2.0 had not shipped yet, it was removed outright rather than carried forward as a deprecated stub. The canonical machine-readable source is now `tokens/membrane.tokens.json`.
- References to `isaac-dcesares-brand-essence-ultimate.md` in `DESIGN-SYSTEM.md` and `BRAND-VOICE.md` — this file does not exist anywhere in the repository. Rather than guess at its location or leave an unverifiable pointer, the references were removed.
- `--state-hover-opacity` and `--state-pressed-opacity` — declared but never consumed anywhere; this system's hover/active feedback is brightness()-filter-based (§6.1), not opacity-overlay-based, so the tokens described an interaction model the system doesn't actually use. Only `--state-disabled-opacity` (which is wired to a real component) remains.

### Migration guide

**For consumers reading the CSS directly:** all tokens continue to work with the same `--` names. The only behavioral change is that `--color-text-tertiary`, `--shadow-*`, `--gradient-membrane`, and `--color-text-on-accent` now respond to dark mode automatically without a separate override block. If you had your own `[data-theme="dark"]` block that reassigned these, review for conflicts.

**For consumers using status colors as text:** replace `color: var(--color-warning)` / `color: var(--color-success)` with `--color-warning-text` / `--color-success-text` on normal-size body text.

**For anyone importing `design-tokens.css` and relying on the `* { transition-property: … !important }` reduced-motion rule:** that rule has moved to `tokens/base.css`. Import `base.css` to keep that behavior, or write your own.

---

## [1.1.0] — March 2026

- Added opacity scale tokens (`--opacity-subtle` through `--opacity-heavy`).
- Added ambient glow stop-colors (`--bg-glow-*`).
- Added overlay token (`--color-overlay-bg`).
- Fixed terracotta dark-mode contrast: `[data-theme="dark"]` now maps `--color-terracotta` to `--color-terracotta-light`.
- Improved dark mode: added `--shadow-glow-warm` dark variant.
- Added Cloudflare Pages deploy configuration.
- Added SEO meta tags and structured data to showcase.

## [1.0.0] — January 2026

Initial release. Token categories: color (palette, neutral, semantic, gradients, code), typography (font stacks, fluid scale, line-height, tracking, weight), spacing (4px base), layout (containers, site margin), border (radius, composites), shadow (warm-tinted), motion (durations, easing, transitions), z-index, focus, imagery.
