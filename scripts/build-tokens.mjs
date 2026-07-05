/**
 * Membrane Palette token build.
 *
 * Reads tokens/membrane.tokens.json (the single source of truth) and generates:
 *   - tokens/design-tokens.css  (pure custom properties, 3-tier, light-dark(), @layer tokens)
 *   - tokens/base.css           (optional element-level layer: selection, focus, reduced motion,
 *                                typography composites, prefers-contrast / forced-colors)
 *
 * The build refuses to emit if:
 *   - any hex/rgb color fails OKLCH round-trip verification, or
 *   - any pair in the WCAG contrast gate falls below its required ratio (checked in BOTH modes).
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "tokens", "membrane.tokens.json");

const tokens = JSON.parse(await readFile(SOURCE, "utf8"));
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

/* ------------------------------------------------------------------ *
 *  Token graph helpers
 * ------------------------------------------------------------------ */

function isToken(node) {
  return node && typeof node === "object" && "$value" in node;
}

/** Walk the tree; collect { path, name (css var), token, group } for every token. */
const registry = new Map(); // "color.primitive.terracotta" -> { cssName, token }

function walk(node, pathParts, prefix) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    const childPath = [...pathParts, key];
    if (isToken(child)) {
      if (!prefix) throw new Error(`No cssPrefix in scope for token ${childPath.join(".")}`);
      registry.set(childPath.join("."), {
        cssName: prefix + key,
        token: child,
        comment: node.$extensions?.cssComment === true,
      });
    } else if (child && typeof child === "object") {
      walk(child, childPath, child.$extensions?.cssPrefix ?? prefix);
    }
  }
}
walk(tokens, [], null);

function entryOf(ref) {
  const key = ref.replace(/[{}]/g, "");
  const entry = registry.get(key);
  if (!entry) throw new Error(`Unknown token reference: ${ref}`);
  return entry;
}

const REF_RE = /\{[a-z0-9.\-]+\}/gi;

/** Replace {a.b.c} refs inside a string with var(--css-name). */
function refsToVars(str) {
  return str.replace(REF_RE, (m) => `var(${entryOf(m).cssName})`);
}

/** Resolve a token path/ref to its concrete literal value for a given mode. */
function resolveLiteral(ref, mode) {
  const { token } = entryOf(ref);
  let value = token.$value;
  if (mode === "dark" && token.$extensions?.mode?.dark !== undefined) {
    value = token.$extensions.mode.dark;
  }
  if (typeof value === "string" && REF_RE.test(value)) {
    REF_RE.lastIndex = 0;
    const single = value.match(/^\{[a-z0-9.\-]+\}$/i);
    if (single) return resolveLiteral(value, mode);
    return value.replace(REF_RE, (m) => resolveLiteral(m, mode));
  }
  return value;
}

/* ------------------------------------------------------------------ *
 *  Color math: sRGB <-> OKLCH (Björn Ottosson's matrices) + WCAG
 * ------------------------------------------------------------------ */

function parseColor(str) {
  const hex = str.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgba = str.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgba) {
    return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: rgba[4] === undefined ? 1 : +rgba[4] };
  }
  return null;
}

const srgbToLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

function rgbToOklch({ r, g, b }) {
  const [lr, lg, lb] = [r / 255, g / 255, b / 255].map(srgbToLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(a, bb);
  let H = (Math.atan2(bb, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H: C < 1e-6 ? 0 : H };
}

function oklchToRgb({ L, C, H }) {
  const hr = (H * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const bb = C * Math.sin(hr);
  const l = (L + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * bb) ** 3;
  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  const to255 = (v) => Math.min(255, Math.max(0, Math.round(linearToSrgb(v) * 255)));
  return { r: to255(lr), g: to255(lg), b: to255(lb) };
}

const roundTripFailures = [];

/** Convert a hex/rgba literal to an oklch() string, verifying the round trip is exact. */
function oklchify(literal) {
  const rgb = parseColor(literal);
  if (!rgb) return literal; // e.g. "transparent" or already-modern syntax — pass through
  const { L, C, H } = rgbToOklch(rgb);
  const Ls = (L * 100).toFixed(4).replace(/\.?0+$/, "");
  const Cs = C.toFixed(5).replace(/\.?0+$/, "") || "0";
  const Hs = H.toFixed(3).replace(/\.?0+$/, "") || "0";
  const back = oklchToRgb({ L: +Ls / 100, C: +Cs, H: +Hs });
  if (back.r !== rgb.r || back.g !== rgb.g || back.b !== rgb.b) {
    roundTripFailures.push(`${literal} → oklch(${Ls}% ${Cs} ${Hs}) → rgb(${back.r},${back.g},${back.b})`);
  }
  const alpha = rgb.a !== 1 ? ` / ${rgb.a}` : "";
  return `oklch(${Ls}% ${Cs} ${Hs}${alpha})`;
}

/** WCAG relative luminance & contrast (alpha composited over an opaque backdrop). */
function luminance({ r, g, b }) {
  const [R, G, B] = [r, g, b].map((v) => srgbToLinear(v / 255));
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function composite(fg, bg) {
  if (fg.a === 1) return fg;
  const mix = (f, b) => Math.round(f * fg.a + b * (1 - fg.a));
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a: 1 };
}

function contrast(fgStr, bgStr) {
  const bg = parseColor(bgStr);
  const fg = composite(parseColor(fgStr), bg);
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

/* ------------------------------------------------------------------ *
 *  WCAG contrast gate — build fails if any pair regresses
 * ------------------------------------------------------------------ */

const S = "color.semantic.";
const GATE = [
  // [foreground, background, minimum ratio, note]
  [S + "text-primary", S + "bg-primary", 7.0, "body text, AAA target"],
  [S + "text-primary", S + "bg-secondary", 7.0, "body text on cards"],
  [S + "text-secondary", S + "bg-primary", 4.5, "supporting text"],
  [S + "text-secondary", S + "bg-secondary", 4.5, "supporting text on cards"],
  [S + "text-tertiary", S + "bg-primary", 4.5, "metadata/placeholder"],
  [S + "text-tertiary", S + "bg-secondary", 4.5, "metadata on cards"],
  [S + "text-accent", S + "bg-primary", 4.5, "links"],
  [S + "text-on-accent", S + "action-primary", 4.5, "button labels"],
  [S + "action-primary", S + "bg-primary", 3.0, "primary action affordance"],
  [S + "action-secondary", S + "bg-primary", 3.0, "secondary action affordance"],
  [S + "focus", S + "bg-primary", 3.0, "focus ring (WCAG 1.4.11)"],
  [S + "focus", S + "bg-secondary", 3.0, "focus ring on cards"],
  [S + "success", S + "bg-primary", 3.0, "success icon/fill"],
  [S + "success-text", S + "bg-primary", 4.5, "success text"],
  [S + "success-text", S + "bg-secondary", 4.5, "success text on cards"],
  [S + "warning-text", S + "bg-primary", 4.5, "warning text"],
  [S + "warning-text", S + "bg-secondary", 4.5, "warning text on cards"],
  [S + "error", S + "bg-primary", 3.0, "error icon/fill"],
  [S + "error-text", S + "bg-primary", 4.5, "error text"],
  [S + "error-text", S + "bg-secondary", 4.5, "error text on cards"],
];

const gateFailures = [];
const gateReport = [];
for (const mode of ["light", "dark"]) {
  for (const [fg, bg, min, note] of GATE) {
    const fgV = resolveLiteral(`{${fg}}`, mode);
    const bgV = resolveLiteral(`{${bg}}`, mode);
    const ratio = contrast(fgV, bgV);
    const line = `${mode.padEnd(5)} ${fg.replace(S, "").padEnd(16)} on ${bg.replace(S, "").padEnd(13)} ${ratio.toFixed(2).padStart(6)} (min ${min})  ${note}`;
    gateReport.push(line);
    if (ratio < min) gateFailures.push(line);
  }
}

/* ------------------------------------------------------------------ *
 *  Value emitters
 * ------------------------------------------------------------------ */

function emitColorSide(value) {
  if (/^\{[a-z0-9.\-]+\}$/i.test(value)) return `var(${entryOf(value).cssName})`;
  return oklchify(value);
}

function emitValue(token) {
  const { $type, $value } = token;
  const dark = token.$extensions?.mode?.dark;
  switch ($type) {
    case "color": {
      const light = emitColorSide($value);
      if (dark === undefined) {
        const src = typeof $value === "string" && $value.startsWith("{") ? null : $value;
        return { css: light, comment: src };
      }
      return {
        css: `light-dark(${light}, ${emitColorSide(dark)})`,
        comment: [$value, dark].filter((v) => !String(v).startsWith("{")).join(" / ") || null,
      };
    }
    case "tint": {
      const { light, dark: darkRef, amount } = $value;
      const pct = `${Math.round(amount * 100)}%`;
      return {
        css: `color-mix(in srgb, light-dark(var(${entryOf(light).cssName}), var(${entryOf(darkRef).cssName})) ${pct}, transparent)`,
        comment: null,
      };
    }
    case "cssValue":
      return { css: refsToVars(String($value)), comment: null };
    case "fontFamily":
      return {
        css: $value.map((f) => (/^(serif|sans-serif|monospace)$/.test(f) ? f : `'${f}'`)).join(", "),
        comment: null,
      };
    case "cubicBezier":
      return { css: `cubic-bezier(${$value.join(", ")})`, comment: null };
    default:
      return { css: String($value), comment: null };
  }
}

/* ------------------------------------------------------------------ *
 *  CSS assembly
 * ------------------------------------------------------------------ */

const SECTIONS = [
  ["1. COLORS — Primitives (Tier 1, immutable across modes)", ["color.primitive"]],
  ["2. COLORS — Neutral Scale (warm-tinted grays)", ["color.neutral"]],
  ["3. COLORS — Semantic (Tier 2 — consume these; each carries its light/dark pair)", ["color.semantic"]],
  ["4. COLORS — Derived Tints (computed, mode-aware)", ["color.tint"]],
  ["5. COLORS — Gradients", ["gradient"]],
  ["6. COLORS — Ambient Glows", ["glow"]],
  ["7. COLORS — Code Block (always dark)", ["code"]],
  ["8. TYPOGRAPHY — Font Stacks", ["font"]],
  ["9. TYPOGRAPHY — Scale (fluid; ratio ≈1.2 small steps → ≈1.375 at display)", ["text"]],
  ["10. TYPOGRAPHY — Line Height", ["leading"]],
  ["11. TYPOGRAPHY — Letter Spacing", ["tracking"]],
  ["12. TYPOGRAPHY — Font Weight", ["weight"]],
  ["13. SPACING — Scale (4px base unit)", ["space"]],
  ["14. SIZES — Icons, touch targets, chrome", ["size"]],
  ["15. LAYOUT — Containers & Site Margin", ["container", "layout"]],
  ["16. BORDER RADIUS", ["radius"]],
  ["17. BORDERS — Widths & Composites", ["border-width", "border"]],
  ["18. SHADOWS & ELEVATION", ["shadow", "elevation"]],
  ["19. MOTION — Durations, Easing, Transitions", ["duration", "ease", "transition"]],
  ["20. OPACITY & STATE LAYERS", ["opacity", "state"]],
  ["21. Z-INDEX — Stacking Context", ["z"]],
  ["22. FOCUS — Accessibility", ["focus"]],
  ["23. BLUR", ["blur"]],
  ["24. IMAGERY — Photo Treatment", ["photo"]],
  ["25. BREAKPOINTS (reference only — unusable in media queries)", ["breakpoint"]],
];

function tokensInGroup(groupPath) {
  const out = [];
  for (const [key, entry] of registry) {
    if (key.startsWith(groupPath + ".") && key.split(".").length === groupPath.split(".").length + 1) {
      out.push(entry);
    }
  }
  return out;
}

const lines = [];
for (const [title, groups] of SECTIONS) {
  lines.push("");
  lines.push("    /* --------------------------------------------------------");
  lines.push(`       ${title}`);
  lines.push("       -------------------------------------------------------- */");
  for (const groupPath of groups) {
    const entries = tokensInGroup(groupPath);
    if (entries.length === 0) throw new Error(`Empty section group: ${groupPath}`);
    const width = Math.max(...entries.map((e) => e.cssName.length)) + 1;
    for (const e of entries) {
      const { css, comment } = emitValue(e.token);
      if (e.comment) {
        lines.push(`    /* ${e.cssName}: ${css}; */`);
      } else {
        const decl = `    ${(e.cssName + ":").padEnd(width + 1)} ${css};`;
        lines.push(comment ? `${decl}  /* ${comment} */` : decl);
      }
    }
  }
}

const header = `/* ============================================================
   Isaac D'Césares — Brand Design Tokens · The Membrane Palette
   Version ${pkg.version}

   GENERATED FILE — do not edit by hand.
   Source of truth:  tokens/membrane.tokens.json
   Regenerate with:  npm run build:tokens

   Architecture:
   - Tier 1 primitives are immutable; theming happens only in
     Tier 2 semantic tokens via light-dark().
   - Dark mode follows the OS via \`color-scheme: light dark\`.
     Manual override: set data-theme="dark" | "light" on any
     element (or the legacy .theme-dark class on <html>).
   - Colors are emitted as OKLCH (round-trip-verified against
     the sRGB source values); derived tints use color-mix().
   - This file is pure custom properties + color-scheme wiring.
     Element-level rules (reduced motion, selection, focus,
     typography composites) live in tokens/base.css.

   Requires: Chrome/Edge 123+, Firefox 120+, Safari 17.5+
   (light-dark(), color-mix(), oklch(), @layer).
   ============================================================ */

@layer tokens {

  :root {
    color-scheme: light dark;
${lines.join("\n").replace(/^\n/, "")}
  }

  /* Manual theme override — works on :root or any subtree. */
  [data-theme="light"] { color-scheme: light; }
  [data-theme="dark"],
  .theme-dark { color-scheme: dark; }

  /* ===========================================================
     REDUCED MOTION — token-level fallbacks (pure custom props;
     the element-level rules live in base.css)
     =========================================================== */

  @media (prefers-reduced-motion: reduce) {
    :root {
      --duration-fast:      0ms;
      --duration-normal:    0ms;
      --duration-slow:      0ms;
      --duration-slower:    150ms;

      --transition-fast:    0ms var(--ease-default);
      --transition-default: 0ms var(--ease-default);
      --transition-slow:    0ms var(--ease-default);
    }
  }

  /* ===========================================================
     INCREASED CONTRAST — honor prefers-contrast: more
     =========================================================== */

  @media (prefers-contrast: more) {
    :root {
      --color-text-secondary: var(--color-text-primary);
      --color-text-tertiary:  light-dark(var(--color-neutral-700), var(--color-neutral-300));
      --color-border-default: var(--color-border-emphasis);
    }
  }

  /* ===========================================================
     FORCED COLORS — strip decorative glows; the UA owns color
     =========================================================== */

  @media (forced-colors: active) {
    :root {
      --shadow-glow-warm: none;
      --shadow-glow-teal: none;
    }
  }
}
`;

const baseCss = `/* ============================================================
   The Membrane Palette — base layer (optional)
   Version ${pkg.version}

   GENERATED FILE — do not edit by hand.
   Source of truth:  tokens/membrane.tokens.json + scripts/build-tokens.mjs
   Regenerate with:  npm run build:tokens

   Element-level rules that give the tokens their default
   behavior. Import AFTER design-tokens.css. Everything lives
   in @layer base, so any unlayered consumer CSS wins.
   ============================================================ */

@layer base {

  ::selection {
    background: var(--color-selection);
  }

  :focus-visible {
    outline: var(--focus-ring);
    outline-offset: var(--focus-ring-offset);
  }

  /* ===========================================================
     REDUCED MOTION — restrict animation to safe properties
     =========================================================== */

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-property: opacity, color, background-color, border-color, box-shadow !important;
      scroll-behavior: auto !important;
    }
  }

  /* ===========================================================
     TYPOGRAPHY COMPOSITES — the pairing rules as classes.
     Headings are Fraunces except .type-h4 (Instrument Sans),
     per DESIGN-SYSTEM.md §3.5.
     =========================================================== */

  .type-display {
    font-family: var(--font-serif);
    font-size: var(--text-display);
    font-weight: var(--weight-bold);
    line-height: var(--leading-display);
    letter-spacing: var(--tracking-display);
  }

  .type-h1 {
    font-family: var(--font-serif);
    font-size: var(--text-h1);
    font-weight: var(--weight-bold);
    line-height: var(--leading-heading);
    letter-spacing: var(--tracking-heading);
  }

  .type-h2 {
    font-family: var(--font-serif);
    font-size: var(--text-h2);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-heading);
    letter-spacing: var(--tracking-heading);
  }

  .type-h3 {
    font-family: var(--font-serif);
    font-size: var(--text-h3);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-subheading);
    letter-spacing: var(--tracking-subheading);
  }

  .type-h4 {
    font-family: var(--font-sans);
    font-size: var(--text-h4);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-subheading);
    letter-spacing: var(--tracking-subheading);
  }

  .type-body {
    font-family: var(--font-sans);
    font-size: var(--text-body);
    font-weight: var(--weight-regular);
    line-height: var(--leading-body);
    letter-spacing: var(--tracking-body);
  }

  .type-body-lg {
    font-family: var(--font-sans);
    font-size: var(--text-body-lg);
    font-weight: var(--weight-regular);
    line-height: var(--leading-body-lg);
    letter-spacing: var(--tracking-body);
  }

  .type-small {
    font-family: var(--font-sans);
    font-size: var(--text-small);
    font-weight: var(--weight-regular);
    line-height: var(--leading-small);
    letter-spacing: var(--tracking-small);
  }

  .type-label {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    line-height: var(--leading-label);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
  }

  .type-code {
    font-family: var(--font-mono);
    font-size: var(--text-code);
    font-weight: var(--weight-regular);
    line-height: var(--leading-code);
  }
}
`;

/* ------------------------------------------------------------------ *
 *  Verify, then write
 * ------------------------------------------------------------------ */

console.log("WCAG contrast gate:");
for (const line of gateReport) console.log("  " + line);

if (roundTripFailures.length > 0) {
  console.error("\nOKLCH round-trip failures (increase precision):");
  for (const f of roundTripFailures) console.error("  " + f);
  process.exit(1);
}

if (gateFailures.length > 0) {
  console.error(`\nBUILD FAILED — ${gateFailures.length} contrast pair(s) below minimum:`);
  for (const f of gateFailures) console.error("  ✗ " + f);
  process.exit(1);
}

await writeFile(path.join(root, "tokens", "design-tokens.css"), header);
await writeFile(path.join(root, "tokens", "base.css"), baseCss);
console.log(`\n✓ All ${GATE.length * 2} contrast pairs pass; all colors round-trip through OKLCH.`);
console.log("✓ Wrote tokens/design-tokens.css and tokens/base.css");
