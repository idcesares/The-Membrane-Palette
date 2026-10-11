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
const deprecated = []; // { cssName, message }

function walk(node, pathParts, prefix) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    const childPath = [...pathParts, key];
    if (isToken(child)) {
      if (!prefix) throw new Error(`No cssPrefix in scope for token ${childPath.join(".")}`);
      const cssName = prefix + key;
      registry.set(childPath.join("."), {
        cssName,
        token: child,
        comment: node.$extensions?.cssComment === true,
      });
      if (child.$deprecated) {
        deprecated.push({
          cssName,
          message: typeof child.$deprecated === "string" ? child.$deprecated : "no replacement noted",
        });
      }
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
  if (token.$type === "tint") {
    const { light, dark, amount } = token.$value;
    const c = parseColor(resolveLiteral(mode === "dark" ? dark : light, mode));
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${amount})`;
  }
  if (token.$type === "mix") {
    const { base, with: other, amount } = token.$value;
    return mixOklab(resolveLiteral(base, mode), resolveLiteral(other, mode), amount);
  }
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

const toHex = ({ r, g, b }) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

/** color-mix(in oklab, a, b amount) for opaque sRGB literals — mirrors what the browser computes. */
function mixOklab(aStr, bStr, amount) {
  const lab = (str) => {
    const { L, C, H } = rgbToOklch(parseColor(str));
    const hr = (H * Math.PI) / 180;
    return [L, C * Math.cos(hr), C * Math.sin(hr)];
  };
  const [a, b] = [lab(aStr), lab(bStr)];
  const [L, A, B] = a.map((v, i) => v * (1 - amount) + b[i] * amount);
  const C = Math.hypot(A, B);
  const H = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return toHex(oklchToRgb({ L, C, H }));
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

function contrast(fgStr, bgStr, backdropStr) {
  let bg = parseColor(bgStr);
  if (bg.a !== 1) bg = composite(bg, parseColor(backdropStr));
  const fg = composite(parseColor(fgStr), bg);
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

/* ------------------------------------------------------------------ *
 *  WCAG contrast gate — build fails if any pair regresses
 * ------------------------------------------------------------------ */

const S = "color.semantic.";
const C = "code.";
// [foreground, background, minimum ratio, note, backdrop?]. A translucent
// background (tint) is composited over the backdrop — bg-primary unless a
// fifth element names another surface — before measuring. Washes are checked
// over both page and card surfaces, because tags and alerts live on both.
const ON_CARD = S + "bg-secondary";
const ON_ELEVATED = S + "bg-elevated";
const GATE = [
  // Text on surfaces
  [S + "text-primary", S + "bg-primary", 7.0, "body text, AAA target"],
  [S + "text-primary", S + "bg-secondary", 7.0, "body text on cards"],
  [S + "text-primary", S + "bg-elevated", 7.0, "body text in dialogs/popovers"],
  [S + "text-primary", S + "bg-active", 7.0, "selected rows/items"],
  [S + "text-secondary", S + "bg-primary", 4.5, "supporting text"],
  [S + "text-secondary", S + "bg-secondary", 4.5, "supporting text on cards"],
  [S + "text-secondary", S + "bg-tertiary", 4.5, "neutral tags"],
  [S + "text-secondary", S + "bg-elevated", 4.5, "supporting text in dialogs"],
  [S + "text-secondary", S + "bg-hover", 4.5, "hovered nav links / ghost buttons"],
  [S + "text-tertiary", S + "bg-primary", 4.5, "metadata/placeholder"],
  [S + "text-tertiary", S + "bg-secondary", 4.5, "metadata on cards"],
  [S + "text-tertiary", S + "bg-elevated", 4.5, "metadata in dialogs"],
  [S + "text-accent", S + "bg-primary", 4.5, "links"],
  [S + "text-accent", S + "bg-secondary", 4.5, "links on cards"],
  [S + "text-inverse", S + "bg-inverse", 4.5, "tooltips"],
  // Actions
  [S + "text-on-accent", S + "action-primary", 4.5, "primary button label"],
  [S + "text-on-accent", S + "action-primary-hover", 4.5, "primary button label, hover"],
  [S + "text-on-accent", S + "action-secondary", 4.5, "secondary button label, hover fill"],
  [S + "text-on-accent", S + "action-secondary-hover", 4.5, "checked controls, pressed secondary"],
  [S + "text-on-accent", S + "error", 4.5, "danger button label"],
  [S + "text-on-accent", S + "error-hover", 4.5, "danger button label, hover"],
  [S + "action-primary", S + "bg-primary", 3.0, "primary action affordance"],
  [S + "action-secondary", S + "bg-primary", 3.0, "secondary action affordance"],
  [S + "action-secondary", S + "bg-secondary", 3.0, "secondary action on cards"],
  [S + "action-secondary", S + "bg-tertiary", 3.0, "progress value vs track"],
  // Non-text UI (WCAG 1.4.11)
  [S + "border-input", S + "bg-primary", 3.0, "form control boundary"],
  [S + "border-input", S + "bg-secondary", 3.0, "form control boundary on cards"],
  [S + "border-input", S + "bg-elevated", 3.0, "form control boundary in dialogs"],
  [S + "focus", S + "bg-primary", 3.0, "focus ring (WCAG 1.4.11)"],
  [S + "focus", S + "bg-secondary", 3.0, "focus ring on cards"],
  [S + "focus", S + "bg-elevated", 3.0, "focus ring in dialogs"],
  // Registers
  [S + "human-text", S + "bg-primary", 4.5, "human-register text"],
  [S + "human-text", S + "bg-secondary", 4.5, "human-register text on cards"],
  [S + "human-text", S + "human-bg", 4.5, "human tag / callout"],
  [S + "human-text", S + "human-bg", 4.5, "human tag on a card", ON_CARD],
  [S + "digital-text", S + "bg-primary", 4.5, "digital-register text"],
  [S + "digital-text", S + "bg-secondary", 4.5, "digital-register text on cards"],
  [S + "digital-text", S + "digital-bg", 4.5, "digital tag / callout"],
  [S + "digital-text", S + "digital-bg", 4.5, "digital tag on a card", ON_CARD],
  // Status
  [S + "success", S + "bg-primary", 3.0, "success icon/fill"],
  [S + "success-text", S + "bg-primary", 4.5, "success text"],
  [S + "success-text", S + "bg-secondary", 4.5, "success text on cards"],
  [S + "success-text", S + "success-bg", 4.5, "success alert/badge"],
  [S + "success-text", S + "success-bg", 4.5, "success badge on a card", ON_CARD],
  [S + "warning-text", S + "bg-primary", 4.5, "warning text"],
  [S + "warning-text", S + "bg-secondary", 4.5, "warning text on cards"],
  [S + "warning-text", S + "warning-bg", 4.5, "warning alert/badge"],
  [S + "warning-text", S + "warning-bg", 4.5, "warning badge on a card", ON_CARD],
  [S + "error", S + "bg-primary", 3.0, "error icon/fill, invalid border"],
  [S + "error-text", S + "bg-primary", 4.5, "error text"],
  [S + "error-text", S + "bg-secondary", 4.5, "error text on cards"],
  [S + "error-text", S + "error-bg", 4.5, "error alert/badge"],
  [S + "error-text", S + "error-bg", 4.5, "error badge on a card", ON_CARD],
  [S + "info-text", S + "bg-primary", 4.5, "info text"],
  [S + "info-text", S + "info-bg", 4.5, "info alert/badge"],
  [S + "info-text", S + "info-bg", 4.5, "info badge on a card", ON_CARD],
  [S + "success-text", S + "bg-elevated", 4.5, "success toast title"],
  [S + "warning-text", S + "bg-elevated", 4.5, "warning toast title"],
  [S + "error-text", S + "bg-elevated", 4.5, "error toast title, danger menu item"],
  [S + "text-primary", S + "bg-hover", 7.0, "hovered rows on a card", ON_CARD],
  [S + "text-primary", S + "bg-active", 7.0, "active combobox option (popup)", ON_ELEVATED],
  [S + "text-secondary", S + "bg-elevated", 4.5, "combobox empty message, menu labels"],
  [S + "focus", S + "bg-active", 3.0, "active-option marker (popup)", ON_ELEVATED],
  // Data visualization — categorical series are non-text marks (WCAG 1.4.11)
  ...[1, 2, 3, 4, 5, 6].flatMap((n) => [
    [S + "chart-" + n, S + "bg-primary", 3.0, `chart series ${n} on page`],
    [S + "chart-" + n, S + "bg-secondary", 3.0, `chart series ${n} on a card`],
  ]),
  // Code blocks (always dark)
  [C + "text", C + "bg", 4.5, "code text"],
  [C + "keyword", C + "bg", 4.5, "syntax: keyword"],
  [C + "string", C + "bg", 4.5, "syntax: string"],
  [C + "function", C + "bg", 4.5, "syntax: function"],
  [C + "comment", C + "bg", 4.5, "syntax: comment"],
  [C + "number", C + "bg", 4.5, "syntax: number"],
];

const short = (p) => entryOf(`{${p}}`).cssName;
const gateFailures = [];
const gateReport = [];
const gateRows = []; // structured rows for the showcase matrix and the spec table
for (const mode of ["light", "dark"]) {
  for (const [fg, bg, min, note, on = S + "bg-primary"] of GATE) {
    const fgV = resolveLiteral(`{${fg}}`, mode);
    const bgV = resolveLiteral(`{${bg}}`, mode);
    const ratio = contrast(fgV, bgV, resolveLiteral(`{${on}}`, mode));
    const line = `${mode.padEnd(5)} ${short(fg).padEnd(30)} on ${short(bg).padEnd(30)} ${ratio.toFixed(2).padStart(6)} (min ${min})  ${note}`;
    gateReport.push(line);
    const pass = ratio >= min;
    gateRows.push({ mode, fg: short(fg), bg: short(bg), ratio, min, note, pass });
    if (!pass) gateFailures.push(line);
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
      const [l, d] = [entryOf(light).cssName, entryOf(darkRef).cssName];
      const color = l === d ? `var(${l})` : `light-dark(var(${l}), var(${d}))`;
      return { css: `color-mix(in srgb, ${color} ${pct}, transparent)`, comment: null };
    }
    case "mix": {
      const { base, with: other, amount } = $value;
      return {
        css: `color-mix(in oklab, var(${entryOf(base).cssName}), var(${entryOf(other).cssName}) ${Math.round(amount * 100)}%)`,
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
      if (e.token.$deprecated) {
        const msg = typeof e.token.$deprecated === "string" ? e.token.$deprecated : "no replacement noted";
        lines.push(`    /* @deprecated ${e.cssName} — ${msg} */`);
      }
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

/* Cascade order for the whole system. Unlayered consumer CSS beats all three. */
@layer tokens, base, components;

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
      --transition-enter:   0ms var(--ease-out);
      --transition-exit:    0ms var(--ease-in);
      --transition-state:   0ms var(--ease-in-out);
      /* --duration-loop is not reduced: loaders swap to an opacity pulse. */
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
      --color-border-input:   var(--color-text-secondary);
      --focus-ring:           var(--border-width-thick) solid var(--color-focus);
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

@layer tokens, base, components;

@layer base {

  /* Page defaults. Zero specificity (:where), so any rule you write wins. */
  :where(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :where(html) {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  :where(body) {
    margin: 0;
    background-color: var(--color-bg-primary);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    font-size: var(--text-body);
    line-height: var(--leading-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background: var(--color-selection);
  }

  :focus-visible {
    outline: var(--focus-ring);
    outline-offset: var(--focus-ring-offset);
  }

  /* ===========================================================
     REDUCED MOTION — "reduce", not "remove".
     Library components (mp-*) manage their own reduced motion:
     transitions go instant through the duration tokens, surfaces
     stop lifting, and loaders swap rotation/sliding for a gentle
     opacity pulse so they still say "working". This rule is the
     safety net for everything else on the page: animations run
     once and end, and only color/opacity may still transition.
     =========================================================== */

  @media (prefers-reduced-motion: reduce) {
    :where(html) {
      scroll-behavior: auto !important;
    }

    :not([class^="mp-"], [class*=" mp-"]),
    :not([class^="mp-"], [class*=" mp-"])::before,
    :not([class^="mp-"], [class*=" mp-"])::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-property: opacity, color, background-color, border-color, box-shadow !important;
    }
  }

  /* ===========================================================
     PRINT — light scheme everywhere (including dark subtrees),
     no page tint, and component fills printed as designed so
     white-on-terracotta labels and code blocks stay legible.
     =========================================================== */

  @media print {
    :where(:root, [data-theme], .theme-dark) {
      color-scheme: light;
    }

    :where(body) {
      background: none;
    }

    :where([class^="mp-"], [class*=" mp-"]) {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
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
 *  Generated showcase content — token table & contrast matrix.
 *  Rendered from the same registry/gateRows used to build the CSS,
 *  so the showcase can never drift from the actual token source the
 *  way a hand-maintained reference table would.
 * ------------------------------------------------------------------ */

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function humanizeCategory(key) {
  const parts = key.split(".");
  parts.pop();
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" / ");
}

function buildTokenTableRows() {
  const rows = [];
  for (const [key, entry] of registry) {
    if (entry.comment) continue; // breakpoints are reference-only, never real custom properties
    const category = humanizeCategory(key);
    const isColor = ["color", "tint", "mix"].includes(entry.token.$type);
    const desc = entry.token.$description || "";
    const preview = isColor
      ? `<span class="token-swatch" style="background: var(${entry.cssName});" aria-hidden="true"></span>`
      : "";
    const deprecated = Boolean(entry.token.$deprecated);
    rows.push({
      cssName: entry.cssName,
      category,
      desc,
      preview,
      deprecated,
      searchText: `${entry.cssName} ${category} ${desc}`.toLowerCase(),
    });
  }
  rows.sort((a, b) => a.cssName.localeCompare(b.cssName));
  return rows;
}

function renderTokenTable(rows) {
  return rows
    .map((r) => {
      const badge = r.deprecated ? ` <span class="mp-badge" data-tone="warning">deprecated</span>` : "";
      return `                <tr data-search="${escapeHtml(r.searchText)}">
                  <td class="token-table__preview">${r.preview}</td>
                  <td><code>${escapeHtml(r.cssName)}</code>${badge}</td>
                  <td>${escapeHtml(r.category)}</td>
                  <td>${escapeHtml(r.desc)}</td>
                </tr>`;
    })
    .join("\n");
}

function renderContrastMatrix(rows) {
  return rows
    .map((r) => {
      const tone = r.pass ? "success" : "error";
      const statusText = r.pass ? "Pass" : "Fail";
      return `                <tr>
                  <td>${r.mode}</td>
                  <td><code>${r.fg}</code></td>
                  <td><code>${r.bg}</code></td>
                  <td data-align="end">${r.ratio.toFixed(2)}:1</td>
                  <td data-align="end">${r.min.toFixed(1)}:1</td>
                  <td><span class="mp-badge" data-tone="${tone}">${statusText}</span></td>
                </tr>`;
    })
    .join("\n");
}

function injectMarker(html, markerName, content, { file = "showcase/index.html", indent = "                " } = {}) {
  const re = new RegExp(`(<!-- GENERATED:${markerName} -->)[\\s\\S]*?(<!-- /GENERATED:${markerName} -->)`);
  if (!re.test(html)) throw new Error(`Marker GENERATED:${markerName} not found in ${file}`);
  return html.replace(re, (_, open, close) => `${open}\n${content}\n${indent}${close}`);
}

/** How a semantic token resolves in one mode, for the spec table: "`--color-neutral-800` #2A2622". */
function describeSide(token, mode) {
  const val = mode === "dark" && token.$extensions?.mode?.dark !== undefined ? token.$extensions.mode.dark : token.$value;
  if (token.$type === "tint") {
    const ref = mode === "dark" ? token.$value.dark : token.$value.light;
    return `\`${entryOf(ref).cssName}\` @ ${Math.round(token.$value.amount * 100)}%`;
  }
  if (token.$type === "mix") {
    const { base, with: other, amount } = token.$value;
    return `\`${entryOf(base).cssName}\` + ${Math.round(amount * 100)}% \`${entryOf(other).cssName}\` → ${mixOklab(resolveLiteral(base, mode), resolveLiteral(other, mode), amount)}`;
  }
  if (token.$type === "cssValue") return "`" + refsToVars(String(val)).replace(/\|/g, "\\|") + "`";
  if (typeof val === "string" && val.startsWith("{")) {
    const lit = resolveLiteral(val, mode);
    return `\`${entryOf(val).cssName}\` ${lit.startsWith("#") ? lit.toUpperCase() : lit}`;
  }
  return String(val).toUpperCase();
}

function renderSemanticTable() {
  const rows = ["| Token | Light | Dark | Usage |", "|---|---|---|---|"];
  for (const [key, entry] of registry) {
    if (!key.startsWith(S)) continue;
    const t = entry.token;
    const desc = (t.$description || "").replace(/\|/g, "\\|");
    rows.push(`| \`${entry.cssName}\` | ${describeSide(t, "light")} | ${describeSide(t, "dark")} | ${desc} |`);
  }
  return rows.join("\n");
}

function renderSpecContrastTable() {
  const rows = ["| Foreground | Background | Light | Dark | Min | Use |", "|---|---|---|---|---|---|"];
  const light = gateRows.filter((r) => r.mode === "light");
  const dark = gateRows.filter((r) => r.mode === "dark");
  light.forEach((r, i) => {
    rows.push(`| \`${r.fg}\` | \`${r.bg}\` | ${r.ratio.toFixed(2)} | ${dark[i].ratio.toFixed(2)} | ${r.min.toFixed(1)} | ${r.note} |`);
  });
  return rows.join("\n");
}

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

/* ------------------------------------------------------------------ *
 *  Self-hosted fonts → fonts/fonts.css
 *  (build-components.mjs inlines it into membrane.css with fonts/ URLs)
 * ------------------------------------------------------------------ */

const fontConfig = JSON.parse(await readFile(path.join(root, "fonts", "fonts.json"), "utf8"));
const fontFaces = fontConfig.families.flatMap((fam) => [
  ...fam.faces.map((face) => `@font-face {
  font-family: "${fam.family}";
  font-style: ${face.style};
  font-weight: ${face.weight};
  font-display: ${fontConfig.display};
  src: url("${face.file}") format("woff2");
  unicode-range: ${fontConfig.unicodeRanges[face.subset]};
}`),
  `/* Metric-matched stand-in while ${fam.family} loads (scripts/measure-fonts.py). */
@font-face {
  font-family: "${fam.fallback.family}";
  src: ${fam.fallback.local.map((name) => `local("${name}")`).join(", ")};
${Object.entries(fam.fallback.overrides).map(([k, v]) => `  ${k}: ${v};`).join("\n")}
}`,
]);
const fontsCss = `/* ============================================================
   The Membrane Palette — self-hosted fonts
   Version ${pkg.version}

   GENERATED FILE — do not edit by hand.
   Source of truth:  fonts/fonts.json
   Regenerate with:  npm run build:tokens

   ${fontConfig.families.map((f) => f.family).join(", ")} (SIL Open Font
   License 1.1, see fonts/OFL-*.txt), latin + latin-ext subsets,
   variable weight. unicode-range means a page only downloads the
   files its text actually uses. Already in membrane.css; link this
   file only when you use the split stylesheets.
   ============================================================ */

${fontFaces.join("\n\n")}
`;

await writeFile(path.join(root, "fonts", "fonts.css"), fontsCss);
await writeFile(path.join(root, "tokens", "design-tokens.css"), header);
await writeFile(path.join(root, "tokens", "base.css"), baseCss);
console.log(`\n✓ All ${GATE.length * 2} contrast checks (${GATE.length} pairs × light/dark) pass; all colors round-trip through OKLCH.`);
console.log("✓ Wrote tokens/design-tokens.css, tokens/base.css, tokens/membrane-tailwind.css, tokens/tokens.resolved.json, fonts/fonts.css");

/* ------------------------------------------------------------------ *
 *  Platform exports
 * ------------------------------------------------------------------ */

// Tailwind CSS v4 theme. Tailwind's default namespaces reuse names this
// system already owns (--radius-md, --text-sm, --shadow-sm, --ease-in…);
// depending on stylesheet order they could override the system's values.
// So every overlapping namespace is reset, and the system is exposed under
// an `mp-` prefix that maps onto the real tokens: bg-mp-surface, text-mp-fg,
// rounded-mp-lg, shadow-mp-raised, font-mp-display, text-mp-h2…
// Spacing needs nothing: Tailwind's --spacing base (0.25rem) is the 4px unit,
// so p-4 === --space-4. Breakpoint defaults (40/48/64/80rem) also match.
const TW = {
  color: {
    surface: "color.semantic.bg-primary", "surface-2": "color.semantic.bg-secondary", "surface-3": "color.semantic.bg-tertiary",
    elevated: "color.semantic.bg-elevated", inverse: "color.semantic.bg-inverse", hover: "color.semantic.bg-hover", active: "color.semantic.bg-active",
    fg: "color.semantic.text-primary", "fg-muted": "color.semantic.text-secondary", "fg-subtle": "color.semantic.text-tertiary",
    "fg-inverse": "color.semantic.text-inverse", "on-accent": "color.semantic.text-on-accent", link: "color.semantic.text-accent",
    primary: "color.semantic.action-primary", "primary-hover": "color.semantic.action-primary-hover",
    secondary: "color.semantic.action-secondary", "secondary-hover": "color.semantic.action-secondary-hover",
    border: "color.semantic.border-default", "border-strong": "color.semantic.border-emphasis", "border-input": "color.semantic.border-input",
    focus: "color.semantic.focus",
    human: "color.semantic.human-text", "human-bg": "color.semantic.human-bg", digital: "color.semantic.digital-text", "digital-bg": "color.semantic.digital-bg",
    success: "color.semantic.success", "success-text": "color.semantic.success-text", "success-bg": "color.semantic.success-bg",
    warning: "color.semantic.warning", "warning-text": "color.semantic.warning-text", "warning-bg": "color.semantic.warning-bg",
    error: "color.semantic.error", "error-text": "color.semantic.error-text", "error-bg": "color.semantic.error-bg", "error-hover": "color.semantic.error-hover",
    info: "color.semantic.info", "info-text": "color.semantic.info-text", "info-bg": "color.semantic.info-bg",
    ...Object.fromEntries([1, 2, 3, 4, 5, 6].map((n) => [`chart-${n}`, `color.semantic.chart-${n}`])),
    "code-bg": "code.bg", "code-fg": "code.text",
  },
  font: { display: "font.serif", body: "font.sans", code: "font.mono" },
  text: [["display", "display"], ["h1", "heading"], ["h2", "heading"], ["h3", "subheading"], ["h4", "subheading"], ["body-lg", "body-lg"], ["body", "body"], ["small", "small"], ["xs", "label"], ["code", "code"]],
  radius: ["sm", "md", "lg", "xl"],
  shadow: { raised: "elevation.raised", overlay: "elevation.overlay", modal: "elevation.modal", "glow-warm": "shadow.glow-warm", "glow-teal": "shadow.glow-teal" },
  ease: ["default", "out", "in", "in-out"],
  container: ["sm", "md", "lg", "xl"],
};
const v = (p) => `var(${entryOf(`{${p}}`).cssName})`;
const twLines = [
  "  /* Reset Tailwind namespaces that overlap the system's own token names. */",
  ...["color", "font", "text", "font-weight", "leading", "tracking", "radius", "shadow", "inset-shadow", "drop-shadow", "ease", "container", "blur"].map((ns) => `  --${ns}-*: initial;`),
  "",
  ...Object.entries(TW.color).map(([k, p]) => `  --color-mp-${k}: ${v(p)};`),
  "",
  ...Object.entries(TW.font).map(([k, p]) => `  --font-mp-${k}: ${v(p)};`),
  "",
  ...TW.text.flatMap(([k, lead]) => [`  --text-mp-${k}: ${v("text." + k)};`, `  --text-mp-${k}--line-height: ${v("leading." + lead)};`]),
  "",
  ...TW.radius.map((k) => `  --radius-mp-${k}: ${v("radius." + k)};`),
  ...Object.entries(TW.shadow).map(([k, p]) => `  --shadow-mp-${k}: ${v(p)};`),
  ...TW.ease.map((k) => `  --ease-mp-${k}: ${v("ease." + k)};`),
  ...TW.container.map((k) => `  --container-mp-${k}: ${v("container." + k)};`),
  "  --font-weight-regular: var(--weight-regular);",
  "  --font-weight-medium: var(--weight-medium);",
  "  --font-weight-semibold: var(--weight-semibold);",
  "  --font-weight-bold: var(--weight-bold);",
];
const tailwindCss = `/* ============================================================
   The Membrane Palette — Tailwind CSS v4 theme
   Version ${pkg.version}

   GENERATED FILE — do not edit by hand.
   Source of truth:  tokens/membrane.tokens.json + scripts/build-tokens.mjs
   Regenerate with:  npm run build:tokens

   Usage (after design-tokens.css is loaded on the page):
     @import "tailwindcss";
     @import "./membrane-tailwind.css";

   Utilities map onto the semantic tokens, so they retheme with
   light-dark() like everything else: bg-mp-surface, text-mp-fg,
   bg-mp-primary hover:bg-mp-primary-hover text-mp-on-accent,
   border-mp-border-input, rounded-mp-lg, shadow-mp-raised,
   font-mp-display, text-mp-h2, p-4 (= --space-4).
   Tailwind's default palette is removed on purpose: only on-brand
   colors exist, and there is no white or black.
   ============================================================ */

@theme inline {
${twLines.join("\n")}
}
`;

// Resolved values for tools that can't evaluate CSS (charting libraries,
// native apps, Figma plugins, agents reasoning about contrast).
const resolved = { name: "The Membrane Palette", version: pkg.version, generated: "Do not edit — produced by scripts/build-tokens.mjs", modes: { light: {}, dark: {} }, tokens: {} };
for (const [key, entry] of registry) {
  if (entry.comment) continue;
  const t = entry.token;
  const isColor = ["color", "tint", "mix"].includes(t.$type);
  const item = { path: key, type: t.$type, description: t.$description, deprecated: t.$deprecated };
  if (isColor) {
    for (const mode of ["light", "dark"]) {
      const lit = resolveLiteral(`{${key}}`, mode);
      resolved.modes[mode][entry.cssName] = lit.startsWith("#") ? lit.toUpperCase() : lit;
    }
  } else {
    item.css = emitValue(t).css;
  }
  resolved.tokens[entry.cssName] = item;
}

await writeFile(path.join(root, "tokens", "membrane-tailwind.css"), tailwindCss);
await writeFile(path.join(root, "tokens", "tokens.resolved.json"), JSON.stringify(resolved, null, 2) + "\n");

const SHOWCASE_PATH = path.join(root, "showcase", "index.html");
const tokenTableRows = buildTokenTableRows();
let showcaseHtml = await readFile(SHOWCASE_PATH, "utf8");
showcaseHtml = injectMarker(showcaseHtml, "TOKEN-TABLE", renderTokenTable(tokenTableRows));
showcaseHtml = injectMarker(showcaseHtml, "CONTRAST-MATRIX", renderContrastMatrix(gateRows));
await writeFile(SHOWCASE_PATH, showcaseHtml);
console.log(`✓ Regenerated showcase/index.html: ${tokenTableRows.length}-row token table, ${gateRows.length}-row contrast matrix`);

const SPEC_PATH = path.join(root, "DESIGN-SYSTEM.md");
let spec = await readFile(SPEC_PATH, "utf8");
const specOpts = { file: "DESIGN-SYSTEM.md", indent: "" };
spec = injectMarker(spec, "SEMANTIC-COLORS", renderSemanticTable(), specOpts);
spec = injectMarker(spec, "CONTRAST-TABLE", renderSpecContrastTable(), specOpts);
await writeFile(SPEC_PATH, spec);
console.log("✓ Regenerated DESIGN-SYSTEM.md semantic color + contrast tables");

if (deprecated.length > 0) {
  console.log(`\n⚠ ${deprecated.length} deprecated token(s) still in the source (see DESIGN-SYSTEM.md token lifecycle policy):`);
  for (const d of deprecated) console.log(`  ${d.cssName} — ${d.message}`);
}
