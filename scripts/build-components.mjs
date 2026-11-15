/**
 * Membrane Palette component build.
 *
 * Reads components/<slug>/<slug>.css + components/<slug>/README.md and:
 *   1. Lints every component against the token system (see LINT RULES below).
 *   2. Lints every README example against the component CSS, so docs can't
 *      advertise a class, variant or value the CSS doesn't implement.
 *   3. Writes generated artifacts:
 *        components/membrane-components.css   all components, @layer components
 *        membrane.css                         tokens + base + components, one file
 *        components/manifest.json             machine-readable API for agents/tools
 *        llms.txt                             index for LLM agents (llmstxt.org)
 *        components/<slug>/README.md          the "API" section (between markers)
 *        showcase/index.html                  the component gallery (between markers)
 *
 * LINT RULES (a violation fails the build):
 *   - No raw color literals (hex, rgb(), hsl(), oklch(), white/black). Only tokens.
 *   - Every var(--x) is a design token or a --mp-* knob declared in the same file.
 *   - No Tier 1 primitives (--color-terracotta, --color-neutral-*, alpha tints):
 *     components consume the semantic tier so they retheme automatically.
 *   - No deprecated tokens.
 *   - Component-level custom properties are named --mp-*.
 *
 * Run after build-tokens.mjs (membrane.css embeds the generated token CSS).
 */

import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseColor, composite, contrast } from "./lib/contrast.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (...p) => path.join(root, ...p);
const pkg = JSON.parse(await readFile(rel("package.json"), "utf8"));

const REPO = "https://github.com/idcesares/The-Membrane-Palette";
const DOCS_BASE = `${REPO}/blob/master/`;
const CDN = "https://cdn.jsdelivr.net/gh/idcesares/The-Membrane-Palette@2.2.0/";
const SITE = "https://membrane-palette.dcesares.dev/";

/** Display order. A component folder missing from this list fails the build. */
const ORDER = [
  "layout", "text", "prose",
  "button", "link",
  "field", "input", "combobox", "choice", "switch",
  "card", "tag", "badge", "avatar", "quote", "code", "divider", "table", "stat", "chart",
  "icon",
  "alert", "progress", "skeleton", "empty-state", "toast", "tooltip", "dialog",
  "navbar", "breadcrumb", "tabs", "accordion", "pagination", "steps", "menu",
];
const CATEGORIES = ["Layout", "Actions", "Forms", "Content", "Feedback", "Navigation"];
const STATUSES = ["stable", "beta", "deprecated"];
const GLOBAL_DATA_ATTRS = new Set(["theme"]); // valid on any element

const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

/* ------------------------------------------------------------------ *
 *  Design-token registry (tier + deprecation), from the JSON source
 * ------------------------------------------------------------------ */

const tokenJson = JSON.parse(await readFile(rel("tokens", "membrane.tokens.json"), "utf8"));
const tokens = new Map(); // cssName -> { path, tier, deprecated, description }
(function walk(node, parts, prefix) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$") || !child || typeof child !== "object") continue;
    const p = [...parts, key];
    if ("$value" in child) {
      if (node.$extensions?.cssComment) continue; // comment-only (breakpoints)
      const dotted = p.join(".");
      const tier = /^color\.(primitive|neutral|tint)\./.test(dotted) ? "primitive" : dotted.startsWith("color.semantic.") ? "semantic" : "scale";
      tokens.set(prefix + key, { path: dotted, tier, deprecated: child.$deprecated, description: child.$description });
    } else {
      walk(child, p, child.$extensions?.cssPrefix ?? prefix);
    }
  }
})(tokenJson, [], null);

/* ------------------------------------------------------------------ *
 *  Parsing
 * ------------------------------------------------------------------ */

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const uniq = (arr) => [...new Set(arr)];

// CSS named colors are literals too; currentColor and transparent remain valid.
const namedColors = `aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood
cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet
deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon
lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy
oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen`.split(/\s+/);
const namedColorPattern = new RegExp(`(?<![\\w-])(?:${namedColors.join("|")})(?![\\w-])`, "i");

/** Keep validation and generated API metadata on the same CSS syntax. */
function scanCustomProperties(src) {
  const declarations = new Map();
  for (const match of src.matchAll(/(?:^|[{;])\s*(--[a-z0-9_-]+)\s*:\s*([^;{}]+)(?=[;}])/gi)) {
    if (!declarations.has(match[1])) declarations.set(match[1], match[2].replace(/\s+/g, " ").trim());
  }
  const references = uniq([...src.matchAll(/var\(\s*(--[a-z0-9_-]+)/gi)].map((match) => match[1]));
  return { declarations, references };
}

/** Shared color/token contract for library and local composition styles. */
function lintTokenCss(css, where, { prefixes = ["--mp-"] } = {}) {
  const src = stripComments(css);
  const { declarations, references: used } = scanCustomProperties(src);
  const declared = new Set(declarations.keys());
  const hex = src.match(/#[0-9a-f]{3,8}\b/gi);
  if (hex) fail(where, `raw hex color(s) ${uniq(hex).join(", ")} — use a semantic token`);
  const fn = src.match(/\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color|device-cmyk)\(/gi);
  if (fn) fail(where, `raw color function(s) ${uniq(fn).join(", ")} — use a semantic token`);
  // Inspect declaration values, excluding quoted copy and custom-property names.
  const named = [...src.matchAll(/(?:^|[;{])\s*[\w-]+\s*:\s*([^;{}]+)(?=[;}])/g)]
    .map((match) => match[1].replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, ""))
    .find((value) => namedColorPattern.test(value));
  if (named) fail(where, `named color in "${named.trim()}" — use a semantic token`);
  const names = prefixes.map((prefix) => `${prefix}*`).join(" or ");
  for (const key of declared) {
    if (!prefixes.some((prefix) => key.startsWith(prefix))) {
      fail(where, `custom property ${key} must be named ${names} — design tokens are only defined in tokens/membrane.tokens.json`);
    }
  }
  for (const name of used) {
    if (declared.has(name)) continue;
    const token = tokens.get(name);
    if (!token) fail(where, `var(${name}) is neither a design token nor a ${names} knob declared in this file`);
    else if (token.tier === "primitive") fail(where, `var(${name}) is a Tier 1 primitive — consume a semantic token (--color-action-*, --color-*-text, --color-*-bg…)`);
    else if (token.deprecated) fail(where, `var(${name}) is deprecated: ${token.deprecated}`);
  }
}

function parseCss(slug, css) {
  const src = stripComments(css);
  const classes = uniq([...src.matchAll(/\.(mp-[a-z0-9-]+(?:__[a-z0-9-]+)?)/g)].map((m) => m[1]));
  const roots = classes.filter((c) => !c.includes("__"));
  const parts = classes.filter((c) => c.includes("__"));

  const dataAttrs = {}; // name -> Set(values); empty set = boolean attribute
  for (const m of src.matchAll(/\[data-([a-z-]+)(?:="([^"]*)")?\]/g)) {
    dataAttrs[m[1]] ??= new Set();
    if (m[2] !== undefined) dataAttrs[m[1]].add(m[2]);
  }

  const states = uniq([
    ...[...src.matchAll(/\[((?:aria-[a-z]+|open|hidden|readonly|disabled|multiple)(?:="[^"]*")?)\]/g)].map((m) => `[${m[1]}]`),
    ...[...src.matchAll(/:(hover|active|focus-visible|focus-within|disabled|checked|indeterminate|invalid|modal|popover-open|dir\(rtl\))/g)].map((m) => `:${m[1]}`),
  ]).sort();

  const { declarations: knobs, references: used } = scanCustomProperties(src);

  const where = `components/${slug}/${slug}.css`;
  lintTokenCss(css, where);
  if (roots.length === 0) fail(where, "declares no .mp-* root class");

  return {
    classes, roots, parts, dataAttrs, states,
    knobs: [...knobs].filter(([k]) => k.startsWith("--mp-")),
    tokensUsed: used.filter((v) => tokens.has(v)).sort(),
  };
}

function parseReadme(slug, md) {
  const where = `components/${slug}/README.md`;
  const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
  const meta = {};
  if (!fm) fail(where, "missing --- frontmatter ---");
  else for (const line of fm[1].split("\n")) {
    const m = line.match(/^([a-z]+):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  for (const key of ["name", "category", "status", "summary"]) if (!meta[key]) fail(where, `frontmatter is missing "${key}"`);
  if (meta.category && !CATEGORIES.includes(meta.category)) fail(where, `category "${meta.category}" is not one of ${CATEGORIES.join(", ")}`);
  if (meta.status && !STATUSES.includes(meta.status)) fail(where, `status "${meta.status}" is not one of ${STATUSES.join(", ")}`);

  const section = md.match(/^## Examples\n([\s\S]*?)(?=^## )/m);
  const examples = [];
  if (section) {
    for (const m of section[1].matchAll(/^### (.+)\n+```html\n([\s\S]*?)\n```/gm)) {
      examples.push({ title: m[1].trim(), html: m[2] });
    }
  }
  if (examples.length === 0) fail(where, 'needs at least one "### Title" + ```html example under "## Examples"');
  if (!/<!-- GENERATED:API -->[\s\S]*<!-- \/GENERATED:API -->/.test(md)) fail(where, "missing <!-- GENERATED:API --> markers");
  return { meta, examples };
}

/* ------------------------------------------------------------------ *
 *  Load all components
 * ------------------------------------------------------------------ */

const dirs = (await readdir(rel("components"), { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
for (const d of dirs) if (!ORDER.includes(d)) fail(`components/${d}`, "folder is not listed in ORDER in scripts/build-components.mjs");
for (const s of ORDER) if (!dirs.includes(s)) fail(`components/${s}`, "listed in ORDER but folder does not exist");

const components = [];
for (const slug of ORDER.filter((s) => dirs.includes(s))) {
  const css = await readFile(rel("components", slug, `${slug}.css`), "utf8");
  const md = await readFile(rel("components", slug, "README.md"), "utf8");
  components.push({ slug, css, md, ...parseCss(slug, css), ...parseReadme(slug, md) });
}

/* ------------------------------------------------------------------ *
 *  Example lint — docs must only use what the CSS implements
 * ------------------------------------------------------------------ */

const allClasses = new Set(components.flatMap((c) => c.classes));
const ownerOfRoot = new Map(components.flatMap((c) => c.roots.map((r) => [r, c])));
const ownerOfClass = new Map(components.flatMap((c) => c.classes.map((k) => [k, c])));
const seenIds = new Map();
const demonstrated = new Map(components.map((c) => [c.slug, {}])); // slug -> { attr: Set(values) }

/** Lint one HTML fragment or page against the component CSS. */
function lintMarkup(html, ctx, ids, { record = false, idHint = "" } = {}) {
  // Components present anywhere in the markup: the context for unclassed
  // elements such as <td data-align> inside an .mp-table.
  const present = uniq([...html.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).map((k) => ownerOfClass.get(k)).filter(Boolean));
  for (const tag of html.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi)) {
    const [, name, attrStr] = tag;
    const attrs = Object.fromEntries([...attrStr.matchAll(/([a-z][a-z0-9-:]*)(?:="([^"]*)")?/gi)].map((m) => [m[1], m[2] ?? ""]));
    const cls = (attrs.class || "").split(/\s+/).filter(Boolean);

    for (const k of cls) if (k.startsWith("mp-") && !allClasses.has(k)) fail(ctx, `class "${k}" is not defined by any component`);

    const own = uniq(cls.map((k) => ownerOfClass.get(k)).filter(Boolean));
    const owners = own.length ? own : present;
    for (const [attr, value] of Object.entries(attrs)) {
      if (!attr.startsWith("data-")) continue;
      const key = attr.slice(5);
      if (GLOBAL_DATA_ATTRS.has(key) || key.startsWith("mp-")) continue; // data-mp-* = membrane.js behavior hooks
      if (owners.length === 0) { fail(ctx, `<${name} ${attr}> has no .mp-* root class that defines it`); continue; }
      const defs = owners.map((o) => o.dataAttrs[key]).filter(Boolean);
      if (defs.length === 0) { fail(ctx, `${attr} is not an attribute of ${owners.map((o) => o.slug).join(", ")}`); continue; }
      const allowed = new Set(defs.flatMap((s) => [...s]));
      if (allowed.size > 0 && !allowed.has(value)) fail(ctx, `${attr}="${value}" — allowed: ${[...allowed].join(", ")}`);
      if (record) for (const o of owners) if (o.dataAttrs[key]) (demonstrated.get(o.slug)[key] ??= new Set()).add(value);
    }

    if ("data-icon-only" in attrs && !attrs["aria-label"]) fail(ctx, "icon-only button needs aria-label");
    if (name === "img" && !("alt" in attrs)) fail(ctx, "<img> needs alt");
    if (attrs.id) {
      if (ids.has(attrs.id)) fail(ctx, `id "${attrs.id}" already used in ${ids.get(attrs.id)}${idHint}`);
      else ids.set(attrs.id, ctx);
    }
  }
}

for (const c of components) {
  for (const ex of c.examples) {
    lintMarkup(ex.html, `components/${c.slug}/README.md › "${ex.title}"`, seenIds, {
      record: true,
      idHint: " — example ids must be unique (they share one showcase page)",
    });
  }
}

// Local composition styles obey the same color/token contract as components.
const exampleStyles = (await readdir(rel("examples"))).filter((f) => f.endsWith(".css")).sort();
for (const file of exampleStyles) {
  lintTokenCss(await readFile(rel("examples", file), "utf8"), `examples/${file}`, {
    prefixes: ["--composition-", "--mp-"],
  });
}

// Pattern pages: the same rules, ids unique per page.
const examplePages = (await readdir(rel("examples"))).filter((f) => f.endsWith(".html")).sort();
for (const f of examplePages) {
  lintMarkup(await readFile(rel("examples", f), "utf8"), `examples/${f}`, new Map());
}

/* Breakpoints — every width in an @media query is a step of the breakpoint
   scale (tokens: breakpoint.*), written in px or rem. Container queries are
   exempt: they measure the component's own box, not the viewport. Prefer
   range syntax, (width < 48rem), so neighbouring queries never overlap. */
const BREAKPOINTS = new Map(Object.entries(tokenJson.breakpoint).filter(([k]) => !k.startsWith("$")).map(([k, t]) => [parseFloat(t.$value), k]));
function lintBreakpoints(css, where) {
  for (const m of stripComments(css).matchAll(/@media([^{]*)\{/g)) {
    const prelude = m[1];
    if (!/width/.test(prelude)) continue;
    for (const [, n, unit] of prelude.matchAll(/(\d*\.?\d+)(px|rem|em)\b/g)) {
      const px = unit === "px" ? +n : +n * 16;
      if (!BREAKPOINTS.has(px)) {
        const scale = [...BREAKPOINTS].map(([v, k]) => `${k} ${v}px / ${v / 16}rem`).join(", ");
        fail(where, `@media${prelude.trimEnd()} uses ${n}${unit}, which is not on the breakpoint scale (${scale})`);
      }
    }
  }
}
for (const c of components) lintBreakpoints(c.css, `components/${c.slug}/${c.slug}.css`);
for (const file of exampleStyles) lintBreakpoints(await readFile(rel("examples", file), "utf8"), `examples/${file}`);
for (const file of [...examplePages.map((f) => `examples/${f}`), "showcase/index.html"]) {
  const html = await readFile(rel(file), "utf8");
  for (const [, style] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) lintBreakpoints(style, file);
}

/* Coverage — every option the CSS implements is demonstrated in the README
   examples (and therefore rendered in the showcase), unless the README's
   frontmatter lists it under `exempt:` (e.g. a spacing scale). */
for (const c of components) {
  const exempt = new Set((c.meta.exempt || "").split(",").map((s) => s.trim()).filter(Boolean));
  const shown = demonstrated.get(c.slug);
  const exampleHtml = c.examples.map((e) => e.html).join("\n");
  for (const k of c.classes) {
    if (exempt.has("." + k)) continue;
    if (!new RegExp(`class="[^"]*\\b${k}\\b`).test(exampleHtml)) fail(`components/${c.slug}/README.md`, `.${k} is never demonstrated in an example (or list it under "exempt:" in the frontmatter)`);
  }
  for (const [key, values] of Object.entries(c.dataAttrs)) {
    if (exempt.has(`data-${key}`)) continue;
    if (!shown[key]) { fail(`components/${c.slug}/README.md`, `data-${key} is never demonstrated in an example (or list it under "exempt:" in the frontmatter)`); continue; }
    const missing = [...values].filter((v) => !shown[key].has(v));
    if (missing.length) fail(`components/${c.slug}/README.md`, `data-${key} value(s) ${missing.map((v) => `"${v}"`).join(", ")} never demonstrated in an example`);
  }
}

// Catalog lint: the hand-curated component tables in README.md and
// DESIGN-SYSTEM.md §6.3 must list every component, and mark beta ones with
// <sup>β</sup> (and only those), so the catalogs can't drift from the folders.
for (const file of ["README.md", "DESIGN-SYSTEM.md"]) {
  const text = await readFile(rel(file), "utf8");
  for (const c of components) {
    const link = `](components/${c.slug}/README.md)`;
    const i = text.indexOf(link);
    if (i === -1) { fail(file, `component catalog doesn't list ${c.meta.name} (components/${c.slug}/README.md)`); continue; }
    const marked = text.slice(i + link.length).startsWith("<sup>β</sup>");
    if (c.meta.status === "beta" && !marked) fail(file, `${c.meta.name} is status: beta; mark its first catalog link with <sup>β</sup>`);
    if (c.meta.status !== "beta" && marked) fail(file, `${c.meta.name} is marked beta in the catalog but its README says status: ${c.meta.status}`);
  }
}

/* ------------------------------------------------------------------ *
 *  Component-token contrast gate
 *
 *  The token gate (build-tokens.mjs) measures semantic pairs; this one
 *  measures the pairs a component actually paints, through its --mp-*
 *  knobs. Each pair is checked in light and dark, once for the root
 *  defaults and once for every rule that reassigns either side (a tone,
 *  variant or state), over each backdrop a translucent or transparent
 *  background can sit on. A knob may point at another knob; the chain is
 *  resolved the way the cascade does on one element.
 * ------------------------------------------------------------------ */

const PAGE = "--color-bg-primary";
const CARD = "--color-bg-secondary";
const ELEVATED = "--color-bg-elevated";
// slug -> [foreground, background, minimum, note, backdrops?]. Either side is
// a --mp-* knob of that component or a design token. Only pairs that carry
// information are gated (WCAG 1.4.3 text, 1.4.11 meaningful graphics): the
// accent stripes on cards, alerts and toasts repeat what the title and icon
// already say, so they are decorative and may use the brand fills.
const COMPONENT_GATE = {
  // Links carry --color-text-accent; linked code drops the code wash.
  prose: [
    ["--color-text-primary", "--color-bg-tertiary", 4.5, "inline code"],
    ["--color-text-accent", PAGE, 4.5, "link, including linked code", [PAGE]],
    ["--color-text-accent", CARD, 4.5, "link on a card", [CARD]],
  ],
  button: [
    ["--mp-button-fg", "--mp-button-bg", 4.5, "label"],
    ["--mp-button-fg-hover", "--mp-button-bg-hover", 4.5, "label, hover / pressed"],
  ],
  card: [
    ["--color-text-primary", "--mp-card-bg", 7.0, "card body"],
    ["--mp-card-overline", "--mp-card-bg", 4.5, "overline"],
  ],
  tag: [["--mp-tag-fg", "--mp-tag-bg", 4.5, "tag label"]],
  badge: [["--mp-badge-fg", "--mp-badge-bg", 4.5, "badge label"]],
  alert: [
    ["--mp-alert-title", "--mp-alert-bg", 4.5, "alert title"],
    ["--color-text-primary", "--mp-alert-bg", 4.5, "alert body"],
    ["--mp-alert-icon", "--mp-alert-bg", 3.0, "alert icon"],
  ],
  toast: [
    ["--mp-toast-title", ELEVATED, 4.5, "toast title", [ELEVATED]],
  ],
  progress: [["--mp-progress-value", "--mp-progress-track", 3.0, "progress value vs track"]],
  steps: [["--mp-steps-ring", PAGE, 3.0, "step marker ring", [PAGE]]],
  choice: [
    ["--mp-choice-border", "--mp-choice-bg", 3.0, "control boundary"],
    ["--mp-choice-border-hover", "--mp-choice-bg", 3.0, "control boundary, hover"],
    ["--mp-choice-checked", PAGE, 3.0, "checked fill on page", [PAGE]],
    ["--mp-choice-checked", CARD, 3.0, "checked fill on a card", [CARD]],
    ["--mp-choice-mark", "--mp-choice-checked", 3.0, "check / dot mark"],
  ],
  tabs: [
    ["--mp-tabs-fg", PAGE, 4.5, "tab label", [PAGE, CARD]],
    ["--mp-tabs-fg-hover", "--mp-tabs-bg-hover", 4.5, "tab label, hover"],
    ["--mp-tabs-fg-selected", PAGE, 7.0, "selected tab label", [PAGE, CARD]],
    ["--mp-tabs-indicator", PAGE, 3.0, "selected-tab indicator", [PAGE, CARD]],
    ["--mp-tabs-fg", "--mp-tabs-track", 4.5, "pill tab label"],
    ["--mp-tabs-fg-selected", "--mp-tabs-bg-selected", 7.0, "selected pill tab label"],
  ],
  // The bar is 88% --mp-navbar-bg over the page; measured opaque.
  navbar: [
    ["--mp-navbar-fg", "--mp-navbar-bg", 7.0, "brand"],
    ["--mp-navbar-link", "--mp-navbar-bg", 4.5, "nav link"],
    ["--mp-navbar-link-hover", "--mp-navbar-link-bg-hover", 4.5, "nav link, hover", ["--mp-navbar-bg"]],
    ["--mp-navbar-link-current", "--mp-navbar-bg", 4.5, "current page link"],
    ["--mp-navbar-indicator", "--mp-navbar-bg", 3.0, "current page underline"],
  ],
  dialog: [
    ["--mp-dialog-fg", "--mp-dialog-bg", 7.0, "dialog title"],
    ["--mp-dialog-body", "--mp-dialog-bg", 4.5, "dialog body"],
  ],
  menu: [
    ["--mp-menu-fg", "--mp-menu-bg", 7.0, "menu item"],
    ["--mp-menu-fg", "--mp-menu-item-bg-hover", 4.5, "menu item, focused", ["--mp-menu-bg"]],
    ["--mp-menu-danger", "--mp-menu-bg", 4.5, "danger item"],
    ["--mp-menu-label", "--mp-menu-bg", 4.5, "group label"],
  ],
};

const resolvedTokens = JSON.parse(await readFile(rel("tokens", "tokens.resolved.json"), "utf8"));
const TRANSPARENT = "rgba(0, 0, 0, 0)";

/** Innermost `selector { declarations }` rules (at-rule wrappers drop away). */
function cssRules(css) {
  return [...stripComments(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({
    selector: m[1].trim().replace(/\s+/g, " "),
    decls: new Map([...m[2].matchAll(/(--mp-[a-z0-9-]+)\s*:\s*([^;]+)/g)].map((d) => [d[1], d[2].trim()])),
  }));
}

/** Resolve a knob or token to a color literal for one mode and context. */
function resolveColor(name, mode, ctx, where, seen = new Set()) {
  if (seen.has(name)) throw new Error(`${where}: ${[...seen, name].join(" → ")} is circular`);
  seen.add(name);
  if (name.startsWith("--mp-")) {
    const value = ctx.get(name);
    if (value === undefined) throw new Error(`${where}: ${name} is not declared by the component`);
    if (value === "transparent") return TRANSPARENT;
    const ref = value.match(/^var\(\s*(--[a-z0-9-]+)\s*\)$/);
    if (!ref) throw new Error(`${where}: ${name}: ${value} is not a single var() the gate can resolve`);
    return resolveColor(ref[1], mode, ctx, where, seen);
  }
  const literal = resolvedTokens.modes[mode][name];
  if (literal === undefined || !parseColor(literal)) throw new Error(`${where}: ${name} does not resolve to a color in ${mode} mode`);
  return literal;
}

/** Composite a backdrop chain (outermost last) down to one opaque color. */
function flatten(stack) {
  let base = parseColor(stack.at(-1));
  for (const layer of stack.slice(0, -1).reverse()) base = composite(parseColor(layer), base);
  return `rgb(${base.r}, ${base.g}, ${base.b})`;
}

const componentGateRows = [];
for (const c of components) {
  const pairs = COMPONENT_GATE[c.slug];
  if (!pairs) continue;
  const where = `components/${c.slug}/${c.slug}.css`;
  const defaults = new Map(c.knobs);
  const rules = cssRules(c.css);
  for (const [fg, bg, min, note, backdrops = [PAGE, CARD]] of pairs) {
    // Contexts: the defaults, then every rule that reassigns a knob in the
    // pair's chain (directly or through a knob it points at).
    const chain = (n) => {
      const out = new Set([n]);
      for (const name of out) {
        const ref = defaults.get(name)?.match(/var\(\s*(--mp-[a-z0-9-]+)/);
        if (ref) out.add(ref[1]);
      }
      return out;
    };
    const involved = new Set([...chain(fg), ...chain(bg), ...backdrops.flatMap((b) => [...chain(b)])]);
    const contexts = [{ label: "default", ctx: defaults }];
    for (const rule of rules) {
      if (rule.decls.size === 0 || ![...rule.decls.keys()].some((k) => involved.has(k))) continue;
      if ([...rule.decls].every(([k, v]) => defaults.get(k) === v)) continue; // the root rule itself
      contexts.push({ label: rule.selector, ctx: new Map([...defaults, ...rule.decls]) });
    }
    for (const mode of ["light", "dark"]) {
      for (const { label, ctx } of contexts) {
        for (const backdrop of backdrops) {
          try {
            const back = flatten([resolveColor(backdrop, mode, ctx, where), resolvedTokens.modes[mode][PAGE]]);
            const bgV = resolveColor(bg, mode, ctx, where);
            const ratio = contrast(resolveColor(fg, mode, ctx, where), bgV, back);
            const row = { component: c.slug, mode, context: label, fg, bg, backdrop, ratio, min, note, pass: ratio >= min };
            componentGateRows.push(row);
            if (!row.pass) fail(where, `${mode} ${label}: ${fg} on ${bg} (over ${backdrop}) is ${ratio.toFixed(2)}:1, needs ${min}:1 — ${note}`);
          } catch (e) {
            fail(where, e.message.replace(`${where}: `, ""));
          }
        }
      }
    }
  }
}
for (const slug of Object.keys(COMPONENT_GATE)) if (!ORDER.includes(slug)) fail("scripts/build-components.mjs", `COMPONENT_GATE names unknown component "${slug}"`);

if (errors.length > 0) {
  console.error(`\nCOMPONENT BUILD FAILED — ${errors.length} problem(s):`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 *  Generated API section for each README
 * ------------------------------------------------------------------ */

const code = (s) => "`" + s + "`";

function renderApi(c) {
  const out = [];
  out.push("_Generated from `" + c.slug + ".css` by `npm run build:components` — do not edit this section by hand._", "");
  out.push("**Classes**", "", "| Class | Kind |", "|---|---|");
  for (const k of c.roots) out.push(`| ${code("." + k)} | root |`);
  for (const k of c.parts) out.push(`| ${code("." + k)} | part of ${code("." + k.split("__")[0])} |`);
  out.push("");
  const attrs = Object.entries(c.dataAttrs);
  if (attrs.length) {
    out.push("**Attributes**", "", "| Attribute | Values |", "|---|---|");
    for (const [name, values] of attrs) {
      const v = values.size ? [...values].map(code).join(" · ") : "boolean — presence enables it";
      out.push(`| ${code("data-" + name)} | ${v} |`);
    }
    out.push("");
  }
  if (c.states.length) out.push("**States styled** — " + c.states.map(code).join(" "), "");
  if (c.knobs.length) {
    out.push("**Component tokens** (override on an instance to restyle it)", "", "| Property | Default |", "|---|---|");
    for (const [k, v] of c.knobs) out.push(`| ${code(k)} | ${code(v.replace(/\|/g, "\\|"))} |`);
    out.push("");
  }
  out.push("**Design tokens consumed** — " + c.tokensUsed.map(code).join(" "));
  return out.join("\n");
}

for (const c of components) {
  const next = c.md.replace(/(<!-- GENERATED:API -->)[\s\S]*?(<!-- \/GENERATED:API -->)/, (_, a, b) => `${a}\n${renderApi(c)}\n${b}`);
  if (next !== c.md) await writeFile(rel("components", c.slug, "README.md"), next);
}

/* ------------------------------------------------------------------ *
 *  CSS bundles
 * ------------------------------------------------------------------ */

const banner = (title, extra = "") => `/* ============================================================
   ${title}
   Version ${pkg.version}

   GENERATED FILE — do not edit by hand.
   Sources:         components/<name>/<name>.css
   Regenerate with: npm run build:components
${extra}   ============================================================ */
`;

const indent = (s) => s.trim().split("\n").map((l) => (l ? "  " + l : l)).join("\n");

const bundle = `${banner(
  "The Membrane Palette — component library",
  `
   ${components.length} components, all in @layer components: any unlayered
   CSS you write wins without !important. Requires the tokens
   (tokens/design-tokens.css) to be loaded first.
`
)}
@layer tokens, base, components;

@layer components {
${components.map((c) => `\n  /* ---- ${c.meta.name} (${c.slug}) ${"-".repeat(Math.max(4, 50 - c.meta.name.length - c.slug.length))} */\n\n${indent(c.css)}\n`).join("")}}
`;
await writeFile(rel("components", "membrane-components.css"), bundle);

const tokensCss = await readFile(rel("tokens", "design-tokens.css"), "utf8");
const baseCss = await readFile(rel("tokens", "base.css"), "utf8");
// fonts.css sits next to its files; membrane.css sits one level up.
const fontsCss = (await readFile(rel("fonts", "fonts.css"), "utf8")).replace(/url\("(?!fonts\/)/g, 'url("fonts/');
const allInOne = `${banner(
  "The Membrane Palette — all-in-one stylesheet",
  `
   fonts/fonts.css + tokens/design-tokens.css + tokens/base.css +
   components/membrane-components.css, concatenated.
   One <link> gives you the whole system, fonts included.
`
)}
${fontsCss}
${tokensCss}
${baseCss}
${bundle}`;
await writeFile(rel("membrane.css"), allInOne);

/* ------------------------------------------------------------------ *
 *  Manifest (for agents and tooling)
 * ------------------------------------------------------------------ */

/** Worst measured ratio of each gated pair, per mode, with the rule it came from. */
function contrastSummary(slug) {
  const pairs = new Map();
  for (const row of componentGateRows.filter((r) => r.component === slug)) {
    const key = `${row.fg} on ${row.bg}`;
    const pair = pairs.get(key) ?? { foreground: row.fg, background: row.bg, minimum: row.min, use: row.note, light: null, dark: null };
    const worst = pair[row.mode];
    if (!worst || row.ratio < worst.ratio) pair[row.mode] = { ratio: Math.round(row.ratio * 100) / 100, context: row.context, over: row.backdrop };
    pairs.set(key, pair);
  }
  return [...pairs.values()];
}

const manifest = {
  name: "The Membrane Palette",
  version: pkg.version,
  generated: "Do not edit — produced by scripts/build-components.mjs from components/*/",
  install: {
    allInOne: `<link rel="stylesheet" href="${CDN}membrane.css">`,
    behaviors: `<script src="${CDN}components/membrane.js" defer></script>`,
    split: [`${CDN}fonts/fonts.css`, `${CDN}tokens/design-tokens.css`, `${CDN}tokens/base.css`, `${CDN}components/membrane-components.css`],
  },
  conventions: {
    classPrefix: "mp-",
    parts: "BEM-style elements: .mp-<component>__<part>",
    options: "Enumerated options are data-* attributes (data-variant, data-size, data-tone…). Omit the attribute for the default.",
    states: "Visual states come from native attributes and ARIA (disabled, aria-invalid, aria-selected, aria-current, aria-pressed, aria-busy, open). Set the semantic attribute; never add a state class.",
    theming: "Dark mode is automatic. Add data-theme=\"dark\"|\"light\" to any element to force a subtree; add .mp-surface so the subtree paints its own background.",
    componentTokens: "--mp-<component>-* custom properties are per-component knobs; override them on an instance.",
    designTokens: "In your own CSS consume semantic tokens (--color-text-*, --color-bg-*, --color-action-*, --space-*, --text-*). Never Tier 1 primitives or raw color values.",
    layer: "All component CSS is in @layer components; unlayered CSS overrides it.",
    behaviorHooks: "data-mp-* attributes are hooks for components/membrane.js (e.g. data-mp-toast). Valid on any element.",
    tailwind: "Using Tailwind v4? Import tokens/membrane-tailwind.css: only mp- utilities exist (bg-mp-surface, text-mp-fg, bg-mp-primary, rounded-mp-lg, shadow-mp-raised, font-mp-display, text-mp-h2); the default palette is removed. p-4 = --space-4.",
    patterns: "examples/*.html include complete compositions and bilingual resource-explorer/form-journey interactions using the library, linted like component examples. See docs/composition/README.md for composition and docs/patterns/README.md for task behavior, states and recovery.",
    accessibilityEvidence: "docs/accessibility/evidence.json records automated coverage separately from manual screen-reader and usability evidence. Component API maturity does not imply manual verification.",
    visualLanguage: "docs/visual-language/README.md defines original organic/structural motifs, role choices and arrangements. brand/visuals/catalog.json lists self-contained light/dark SVGs; examples/visual-language.html demonstrates use. Keep actual-surface variants and readable diagram equivalents; motifs are not data or logos.",
  },
  categories: CATEGORIES,
  components: components.map((c) => ({
    slug: c.slug,
    name: c.meta.name,
    category: c.meta.category,
    status: c.meta.status,
    summary: c.meta.summary,
    docs: `components/${c.slug}/README.md`,
    css: `components/${c.slug}/${c.slug}.css`,
    classes: { roots: c.roots, parts: c.parts },
    attributes: Object.fromEntries(Object.entries(c.dataAttrs).map(([k, v]) => [`data-${k}`, v.size ? [...v] : "boolean"])),
    states: c.states,
    componentTokens: Object.fromEntries(c.knobs),
    tokensUsed: c.tokensUsed,
    contrast: contrastSummary(c.slug),
    examples: c.examples,
  })),
};
await writeFile(rel("components", "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

/* ------------------------------------------------------------------ *
 *  TypeScript types (for React/Vue/Svelte/Astro users and wrappers)
 * ------------------------------------------------------------------ */

const pascal = (slug) => slug.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
const literal = (v) => JSON.stringify(v);
const union = (values) => (values.length ? values.map(literal).join(" | ") : "never");
const wrap = (items, per = 4) => {
  const lines = [];
  for (let i = 0; i < items.length; i += per) lines.push(items.slice(i, i + per).join(" | "));
  return lines.join("\n  | ");
};
const publicTokens = [...tokens].filter(([, t]) => t.tier !== "primitive" && !t.deprecated).map(([name]) => name);
const knobs = [...new Set(manifest.components.flatMap((c) => Object.keys(c.componentTokens)))].sort();
const typeClasses = [...new Set(manifest.components.flatMap((c) => [...c.classes.roots, ...c.classes.parts]))].sort();

const attrInterfaces = manifest.components.map((c) => {
  const entries = Object.entries(c.attributes);
  const body = entries.length
    ? entries.map(([attr, values]) =>
        `  ${literal(attr)}?: ${values === "boolean" ? 'true | ""' : union(values)};`).join("\n")
    : "  // No options: this component is styled by class and native state only.";
  return `/** ${c.name} — ${c.summary.replace(/\*\//g, "*\\/")}\n *  Docs: ${c.docs} */\nexport interface Mp${pascal(c.slug)}Attributes {\n${body}\n}`;
});

const dts = `/* ============================================================
   The Membrane Palette — TypeScript types
   Version ${pkg.version}

   GENERATED FILE — do not edit by hand.
   Source:          components/manifest.json (from the component CSS)
   Regenerate with: npm run build:components

   Types only, no runtime. They let a framework catch an option the
   CSS doesn't implement (data-variant="primary") at compile time:

     import type { MpAttrs } from "…/components/membrane.d.ts";
     const save: MpAttrs<"button"> = { "data-variant": "secondary" };
     <button className="mp-button" {...save}>Save</button>

   Boolean options are presence attributes: pass true (or "") to set
   them and leave them out to unset them. Never pass false, because a
   framework renders it as data-x="false" and the attribute still
   matches.
   ============================================================ */

/** Every component class (roots and parts). */
export type MpClass =
  | ${wrap(typeClasses.map(literal), 3)};

${attrInterfaces.join("\n\n")}

/** Option attributes by component slug. */
export interface MpComponentAttributes {
${manifest.components.map((c) => `  ${literal(c.slug)}: Mp${pascal(c.slug)}Attributes;`).join("\n")}
}

export type MpComponent = keyof MpComponentAttributes;

/** The option attributes one component accepts. */
export type MpAttrs<C extends MpComponent> = MpComponentAttributes[C];

/** Design tokens you may consume in your own CSS (semantic and scale
 *  tokens; Tier 1 primitives and deprecated aliases are left out). */
export type MpToken =
  | ${wrap(publicTokens.map(literal), 3)};

/** Tier 3 component knobs, each declared on its component's root. */
export type MpKnob =
  | ${wrap(knobs.map(literal), 3)};

/** A style object that can set knobs and read tokens:
 *  const style: MpStyle = { "--mp-button-bg": "var(--color-action-secondary)" }; */
export type MpStyle = { [K in MpKnob]?: \`var(\${MpToken})\` | (string & {}) };

/** window.MembranePalette, present when components/membrane.js is loaded. */
export interface MpToastOptions {
  title: string;
  body?: string;
  tone?: "info" | "success" | "warning" | "error";
  /** Milliseconds; 0 keeps it until dismissed. Default 6000, errors 0. */
  timeout?: number;
}

export interface MembranePaletteApi {
  toast(options: MpToastOptions): { element: HTMLElement; dismiss(): void };
}

declare global {
  interface Window {
    MembranePalette?: MembranePaletteApi;
  }
}
`;
await writeFile(rel("components", "membrane.d.ts"), dts);

/* ------------------------------------------------------------------ *
 *  Token values as a module (tokens/tokens.mjs + tokens/tokens.d.mts)
 *  for code that needs literals: canvas and chart libraries, native
 *  bridges, tests. The names are exactly MpToken; colors carry their
 *  light and dark values, everything else its CSS value.
 * ------------------------------------------------------------------ */

const tokenEntries = publicTokens.map((name) => {
  const light = resolvedTokens.modes.light[name];
  const entry = light !== undefined
    ? { css: `var(${name})`, light, dark: resolvedTokens.modes.dark[name] }
    : { css: `var(${name})`, value: resolvedTokens.tokens[name].css };
  return [name, entry];
});
const colorTokens = tokenEntries.filter(([, e]) => "light" in e).map(([n]) => n);
const chartTokens = [1, 2, 3, 4, 5, 6].map((n) => `--color-chart-${n}`);
for (const t of chartTokens) if (!colorTokens.includes(t)) throw new Error(`${t} is missing from the public color tokens`);

const tokensJs = `/* The Membrane Palette — token values, version ${pkg.version}.
   GENERATED by scripts/build-components.mjs from tokens/membrane.tokens.json.
   Do not edit. In CSS, use the custom properties; import this only where you
   need literal values (canvas, chart libraries, native code). */

export const tokens = Object.freeze({
${tokenEntries.map(([name, e]) => `  ${JSON.stringify(name)}: Object.freeze(${JSON.stringify(e)}),`).join("\n")}
});

/** A token's literal value: colors for the given scheme, other tokens their CSS value. */
export function tokenValue(name, scheme = "light") {
  const entry = tokens[name];
  if (!entry) throw new Error(\`Unknown or non-public token: \${name}\`);
  if (scheme !== "light" && scheme !== "dark") throw new Error(\`Scheme must be "light" or "dark", got \${scheme}\`);
  return "light" in entry ? entry[scheme] : entry.value;
}

/** The validated categorical chart palette, in assignment order. Never cycle it. */
export function chartColors(scheme = "light") {
  return ${JSON.stringify(chartTokens)}.map((name) => tokenValue(name, scheme));
}
`;
const tokensDts = `/* The Membrane Palette — types for tokens/tokens.mjs, version ${pkg.version}.
   GENERATED by scripts/build-components.mjs. Do not edit. */

import type { MpToken } from "../components/membrane.d.ts";
export type { MpToken };

/** Public tokens that resolve to a color in each scheme. */
export type MpColorToken =
  | ${wrap(colorTokens.map(literal), 3)};

export type MpScheme = "light" | "dark";
export interface MpColorTokenEntry { readonly css: \`var(\${MpColorToken})\`; readonly light: string; readonly dark: string }
export interface MpValueTokenEntry { readonly css: \`var(\${MpToken})\`; readonly value: string }

export declare const tokens: { readonly [K in MpToken]: K extends MpColorToken ? MpColorTokenEntry : MpValueTokenEntry };
export declare function tokenValue(name: MpToken, scheme?: MpScheme): string;
export declare function chartColors(scheme?: MpScheme): [string, string, string, string, string, string];
`;
await writeFile(rel("tokens", "tokens.mjs"), tokensJs);
await writeFile(rel("tokens", "tokens.d.mts"), tokensDts);

/* ------------------------------------------------------------------ *
 *  llms.txt — https://llmstxt.org
 * ------------------------------------------------------------------ */

const llms = `# The Membrane Palette

> A token-based design system and framework-free CSS component library where human warmth meets digital precision. Terracotta (human register) and deep teal (digital register) on warm cream, Fraunces + Instrument Sans + JetBrains Mono, automatic dark mode, WCAG contrast gate-checked at build time. Use it by linking one stylesheet and writing semantic HTML with \`mp-\` classes.

Rules for generating UI with this system:

- For claims about Isaac, read \`PROFILE.md\`; for writing behavior and register adaptation, read \`VOICE.md\`; for public brand expression, read \`BRAND-VOICE.md\`; for visual/UI behavior, read \`DESIGN-SYSTEM.md\`. Never infer biography from examples.
- Load \`${CDN}membrane.css\` (tokens + base + components). Load \`${CDN}components/membrane.js\` when you use Tabs, Menu, Combobox or Toast (they need it for keyboard behavior or rendering), Tooltip Escape-dismiss, or dialog invoker fallbacks.
- Don't add a Google Fonts (or any other font) link: \`membrane.css\` already declares self-hosted Fraunces, Instrument Sans and JetBrains Mono.
- Compose from components (\`.mp-button\`, \`.mp-card\`, \`.mp-field\`…) and layout primitives (\`.mp-container\`, \`.mp-stack\`, \`.mp-cluster\`, \`.mp-grid\`) before writing CSS.
- For complete pages, decks and artwork, start from [composition guidance](docs/composition/README.md). Separate [fixed principles from adaptable defaults](docs/composition/creative-latitude.md) and inspect the actual render with the [visual rubric](docs/composition/rubric.md). Example copy is illustrative, never evidence of personal achievements or research findings.
- For complete tasks, use [experience patterns](docs/patterns/README.md): forms, states/recovery, component choices, adaptive layout, data explanations and optional AI interactions. [Accessibility evidence](docs/accessibility/README.md) distinguishes automated coverage from unperformed manual checks.
- For original artwork, use the [visual language](docs/visual-language/README.md) and [SVG catalog](brand/visuals/catalog.json): organic gesture with precise structure. Choose icons, illustration, diagrams and decorative fields by their job; select artwork for its actual surface and retain meaningful text equivalents.
- Options are \`data-*\` attributes (\`data-variant="secondary"\`); only the values listed in the manifest exist.
- States come from semantic HTML/ARIA (\`disabled\`, \`aria-invalid="true"\`, \`aria-current="page"\`, \`aria-selected\`, \`aria-busy\`), never from extra classes.
- In custom CSS use semantic tokens only (\`--color-text-primary\`, \`--color-bg-secondary\`, \`--color-action-primary\`, \`--space-6\`, \`--text-h2\`). Never hex values, never Tier 1 primitives like \`--color-terracotta\`.
- At most one primary (terracotta) button per view. Cream not white, charcoal not black.
- Charts use \`--color-chart-1\`…\`-6\` in order (never cycled); status meaning uses status tokens with a label.
- Custom motion uses the composites: \`--transition-enter\` on the open state, \`--transition-exit\` on the closed one, \`--transition-state\` for toggles. Animate opacity, transforms, colors and box-shadow (never layout properties), put hover effects inside \`@media (hover: hover)\`, and remove movement under \`prefers-reduced-motion\`.
- Writing Tailwind? Import \`tokens/membrane-tailwind.css\` and use only \`mp-\` utilities (\`bg-mp-surface\`, \`text-mp-fg\`, \`bg-mp-primary\`); off-brand classes like \`bg-blue-500\` don't exist.

## Start here

- [Component manifest (JSON)](components/manifest.json): every component's classes, allowed attribute values, states, knobs, tokens and HTML examples
- [TypeScript types](components/membrane.d.ts): the same API as types (MpAttrs<"button">, MpClass, MpToken) for framework code
- [Token values module](tokens/tokens.mjs): ES module with every public token's CSS reference and light/dark color values, plus tokenValue() and chartColors(); typed by tokens/tokens.d.mts
- [Brand marks](DESIGN-SYSTEM.md#103-files): outlined SVG wordmark and \`dc\` monogram in brand/ — use the files, never retype the name in Fraunces
- [Profile](PROFILE.md): factual identity and current biographical claims — authority for what is true about Isaac
- [Voice](VOICE.md): observed writing behavior, evidence classes and register adaptation
- [Brand voice](BRAND-VOICE.md): public-facing brand application
- [Design system specification](DESIGN-SYSTEM.md): principles, color, type, spacing, motion, dark mode, accessibility and interface behavior
- [Token source (DTCG JSON)](tokens/membrane.tokens.json): every token with descriptions; the only file with authority over values

## Components

${CATEGORIES.map((cat) => components.filter((c) => c.meta.category === cat).map((c) => `- [${c.meta.name}](components/${c.slug}/README.md): ${c.meta.summary}`).join("\n")).join("\n")}

## Optional

- [Starter page](examples/starter.html): a complete landing page to copy from
- [Article pattern](examples/article.html): long-form essay page
- [Dashboard pattern](examples/dashboard.html): product UI with stats, a chart, a table, tabs, steps, pagination, an empty state, a menu and toasts
- [Workshop composition](examples/workshop.html): human opening, learning journey and preparation; illustrative workshop
- [Research explainer](examples/research-explainer.html): relationship diagram, proposed method and limitation; no study or findings
- [Presentation](examples/presentation.html): six-canvas argument, responsive reading view and six landscape print pages; illustrative content
- [Resource explorer](examples/resource-explorer.html): English/pt-BR search, filtering, adaptive list/detail, cancellation and recoverable local sample states
- [Form journey](examples/form-journey.html): English/pt-BR validation, review/edit, simulated failure/retry and local confirmation; nothing transmitted
- [Visual language specimen](examples/visual-language.html): original motifs, website opening, presentation cover, teaching card and editable light/dark SVGs
- [Tailwind v4 theme](tokens/membrane-tailwind.css): mp- utilities mapped onto the semantic tokens
- [Resolved tokens (JSON)](tokens/tokens.resolved.json): every token's light and dark value as plain hex, for charting libraries and native apps
- [Live showcase](${SITE}): every component rendered in light and dark mode
- [Component reference](${SITE}reference/): one page per component with live examples, guidance, API, component tokens with light/dark values and verified contrast
- [Changelog](CHANGELOG.md): versions, deprecations, migration notes
`;
await writeFile(rel("llms.txt"), llms);

/* ------------------------------------------------------------------ *
 *  Showcase gallery
 * ------------------------------------------------------------------ */

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const pad = (s, n) => s.split("\n").map((l) => (l ? " ".repeat(n) + l : l)).join("\n");

function renderGallery() {
  const index = CATEGORIES.map((cat) => {
    const items = components.filter((c) => c.meta.category === cat);
    return `  <div class="gallery-index__group">
    <p class="gallery-index__heading">${cat}</p>
    <ul class="gallery-index__list">
${items.map((c) => `      <li><a class="gallery-index__link" href="#component-${c.slug}">${escapeHtml(c.meta.name)}</a></li>`).join("\n")}
    </ul>
  </div>`;
  }).join("\n");

  const items = components.map((c) => {
    // API at a glance: the options a reader can pick, straight from the CSS.
    const exempt = new Set((c.meta.exempt || "").split(",").map((x) => x.trim()));
    const options = Object.entries(c.dataAttrs)
      .filter(([k]) => !(k === "dismissed" && exempt.has("data-dismissed")))
      .map(([k, v]) => `<div><dt><code>data-${k}</code></dt><dd>${v.size ? [...v].map(escapeHtml).join(" · ") : "boolean"}</dd></div>`)
      .join("");
    const glance = `<dl class="gallery-item__api"><div><dt>Classes</dt><dd>${c.roots.map((r) => `<code>.${r}</code>`).join(" ")}</dd></div>${options}</dl>`;

    const examples = c.examples.map((ex) => `<div class="gallery-example">
  <p class="gallery-example__title">${escapeHtml(ex.title)}</p>
  <div class="gallery-example__stage">
${ex.html}
  </div>
  <details class="gallery-example__code">
    <summary>View HTML</summary>
    <figure class="mp-code-block" data-theme="dark">
      <figcaption class="mp-code-block__header"><span>${escapeHtml(c.meta.name)} · ${escapeHtml(ex.title)}</span><button class="mp-button gallery-copy" type="button" data-variant="ghost" data-size="sm">Copy</button></figcaption>
      <pre tabindex="0"><code>${escapeHtml(ex.html)}</code></pre>
    </figure>
  </details>
</div>`).join("\n");
    return `<article class="gallery-item" id="component-${c.slug}" aria-labelledby="component-${c.slug}-title">
  <header class="gallery-item__header">
    <div>
      <p class="label">${c.meta.category}${c.meta.status !== "stable" ? ` · ${c.meta.status}` : ""}</p>
      <h3 class="gallery-item__title" id="component-${c.slug}-title">${escapeHtml(c.meta.name)}</h3>
    </div>
    <a class="mp-link" data-variant="standalone" href="../reference/${c.slug}.html">Reference<span class="mp-visually-hidden"> for ${escapeHtml(c.meta.name)}</span></a>
  </header>
  <p class="gallery-item__summary">${escapeHtml(c.meta.summary)}</p>
  ${glance}
${examples}
</article>`;
  }).join("\n");

  // No re-indenting: example HTML is inserted verbatim so <pre> content stays exact.
  return `<div class="gallery-layout">
<nav class="gallery-index" aria-label="Components">
${index}
</nav>
<div class="gallery">
${items}
</div>
</div>`;
}

/** Showcase table: every component-gate pair, worst case per mode. */
function renderComponentContrast() {
  const rows = [];
  for (const c of components) {
    for (const p of contrastSummary(c.slug)) {
      const pass = p.light.ratio >= p.minimum && p.dark.ratio >= p.minimum;
      rows.push(`                <tr>
                  <th scope="row"><a class="mp-link" href="../reference/${c.slug}.html#contrast">${escapeHtml(c.meta.name)}</a></th>
                  <td>${escapeHtml(p.use)}</td>
                  <td><code>${p.foreground}</code></td>
                  <td><code>${p.background}</code></td>
                  <td data-align="end">${p.light.ratio.toFixed(2)}:1</td>
                  <td data-align="end">${p.dark.ratio.toFixed(2)}:1</td>
                  <td data-align="end">${p.minimum.toFixed(1)}:1</td>
                  <td><span class="mp-badge" data-tone="${pass ? "success" : "error"}">${pass ? "Pass" : "Fail"}</span></td>
                </tr>`);
    }
  }
  return rows.join("\n");
}

const SHOWCASE = rel("showcase", "index.html");
let html = await readFile(SHOWCASE, "utf8");
const re = /(<!-- GENERATED:COMPONENT-GALLERY -->)[\s\S]*?(<!-- \/GENERATED:COMPONENT-GALLERY -->)/;
if (!re.test(html)) throw new Error("Marker GENERATED:COMPONENT-GALLERY not found in showcase/index.html");
html = html.replace(re, (_, a, b) => `${a}\n${renderGallery()}\n        ${b}`);
const contrastRe = /(<!-- GENERATED:COMPONENT-CONTRAST -->)[\s\S]*?(<!-- \/GENERATED:COMPONENT-CONTRAST -->)/;
if (!contrastRe.test(html)) throw new Error("Marker GENERATED:COMPONENT-CONTRAST not found in showcase/index.html");
html = html.replace(contrastRe, (_, a, b) => `${a}\n${renderComponentContrast()}\n                ${b}`);
await writeFile(SHOWCASE, html);

const exampleCount = components.reduce((n, c) => n + c.examples.length, 0);
console.log(`✓ Contrast-gated ${componentGateRows.length} component-token checks (${Object.keys(COMPONENT_GATE).length} components × variants × light/dark × backdrops)`);
console.log(`✓ Linted ${components.length} components, ${exampleCount} documented examples and ${examplePages.length} pattern pages and ${exampleStyles.length} local stylesheets against ${tokens.size} tokens`);
console.log("✓ Wrote components/membrane-components.css, membrane.css, components/manifest.json, components/membrane.d.ts, tokens/tokens.mjs, tokens/tokens.d.mts, llms.txt");
console.log(`✓ Regenerated API sections in ${components.length} READMEs and the showcase component gallery`);
