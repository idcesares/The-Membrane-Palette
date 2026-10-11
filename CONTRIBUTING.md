# Contributing to The Membrane Palette

The system has two kinds of files: **sources** you edit, and **generated** files the build writes. Almost every mistake comes from editing the wrong one, so start here.

| Edit these | Never hand-edit these (the build overwrites them) |
|---|---|
| `tokens/membrane.tokens.json` | `tokens/design-tokens.css`, `tokens/base.css`, `tokens/membrane-tailwind.css`, `tokens/tokens.resolved.json` |
| `components/<name>/<name>.css`, `components/<name>/README.md` (outside the `GENERATED:API` markers), `components/membrane.js` | `components/membrane-components.css`, `components/manifest.json`, `membrane.css`, `llms.txt` |
| `showcase/index.html`, `DESIGN-SYSTEM.md` (outside `GENERATED:*` markers), `examples/*.html`, `tests/*.spec.mjs`, `scripts/*` | everything between `<!-- GENERATED:… -->` markers; `dist/` |

## Setup

```bash
npm install
npx playwright install chromium   # once, for npm test
```

## The loop

```bash
npm run build:system   # tokens (contrast gate) → components (lint + coverage) → generated docs
npm test               # build dist/, axe in both themes, overflow, keyboard behavior
npm run dev            # look at it: http://localhost:3456
```

Commit the regenerated files together with your source change. CI runs all three layers and fails if a generated file is stale.

## Changing a token

1. Edit `tokens/membrane.tokens.json`. Give every semantic token a `$description` — it feeds the spec table, the manifest and agents.
2. If UI will put one color on another, add the pair to `GATE` in `scripts/build-tokens.mjs` (4.5 for text, 3.0 for non-text). Translucent backgrounds are composited over the page; add a second entry over `bg-secondary` if it can sit on a card.
3. Renaming or removing? Don't. Add `"$deprecated": "Use --x instead."` and keep it until the next major (see `DESIGN-SYSTEM.md` §15).

## Adding a component

1. `components/<name>/<name>.css` — root class `mp-<name>`, parts `mp-<name>__<part>`, options as `data-*` attributes, **states from native attributes/ARIA only**, knobs named `--mp-<name>-*`, semantic tokens only.
2. `components/<name>/README.md` — frontmatter (`name`, `category`, `status`, `summary`, optional `exempt`), prose (when to use / not), `## Examples` with `### Title` + `html` blocks, `## Accessibility`, and empty `<!-- GENERATED:API -->` markers.
3. Add `<name>` to `ORDER` in `scripts/build-components.mjs`.
4. `npm run build:system`. The build fails if:
   - the CSS uses a raw color, an unknown/deprecated token, a Tier 1 primitive, or a non-`--mp-` custom property;
   - an example uses a class, attribute or value the CSS doesn't implement, repeats an `id` used by another example, has an icon-only button without `aria-label` or an `<img>` without `alt`;
   - a class or `data-*` value the CSS implements is never shown in an example (coverage). Use `exempt:` only for token scales and runtime-only state, and say why in the README.
5. If it needs behavior, add it to `components/membrane.js` (event delegation, no init call, no `innerHTML` with data) and a test to `tests/behavior.spec.mjs`.
6. `npm test`. axe runs on the showcase, which renders every README example.

## Writing

Interface copy follows `DESIGN-SYSTEM.md` §16 and `BRAND-VOICE.md`: verbs on buttons, errors that say how to fix, empty states that teach, no hype words.

## Pull requests

Branch from `master`, keep one concern per PR, and add an entry under `[Unreleased]` in `CHANGELOG.md` that leads with *why*.
