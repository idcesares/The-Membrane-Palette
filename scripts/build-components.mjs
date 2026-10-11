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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (...p) => path.join(root, ...p);
const pkg = JSON.parse(await readFile(rel("package.json"), "utf8"));

const REPO = "https://github.com/idcesares/The-Membrane-Palette";
const DOCS_BASE = `${REPO}/blob/master/`;
const CDN = "https://cdn.jsdelivr.net/gh/idcesares/The-Membrane-Palette/";
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

  const knobs = new Map(); // --mp-* -> default value (first declaration)
  for (const m of src.matchAll(/[{;]\s*(--[a-z0-9-]+)\s*:\s*([^;{}]+)(?=;)/g)) {
    if (!knobs.has(m[1])) knobs.set(m[1], m[2].replace(/\s+/g, " ").trim());
  }
  const used = uniq([...src.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]));

  /* --- lint --- */
  const where = `components/${slug}/${slug}.css`;
  const hex = src.match(/#[0-9a-f]{3,8}\b/gi);
  if (hex) fail(where, `raw hex color(s) ${uniq(hex).join(", ")} — use a semantic token`);
  const fn = src.match(/\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/gi);
  if (fn) fail(where, `raw color function(s) ${uniq(fn).join(", ")} — use a semantic token`);
  const named = src.match(/:\s*[^;{}]*\b(white|black)\b/gi);
  if (named) fail(where, `named color in "${named[0].trim()}" — use a semantic token`);
  for (const k of knobs.keys()) {
    if (!k.startsWith("--mp-")) fail(where, `custom property ${k} must be named --mp-* (component knob) — design tokens are only defined in tokens/membrane.tokens.json`);
  }
  for (const v of used) {
    if (knobs.has(v)) continue;
    const t = tokens.get(v);
    if (!t) fail(where, `var(${v}) is neither a design token nor a --mp-* knob declared in this file`);
    else if (t.tier === "primitive") fail(where, `var(${v}) is a Tier 1 primitive — consume a semantic token (--color-action-*, --color-*-text, --color-*-bg…)`);
    else if (t.deprecated) fail(where, `var(${v}) is deprecated: ${t.deprecated}`);
  }
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

// Pattern pages: the same rules, ids unique per page.
const examplePages = (await readdir(rel("examples"))).filter((f) => f.endsWith(".html")).sort();
for (const f of examplePages) {
  lintMarkup(await readFile(rel("examples", f), "utf8"), `examples/${f}`, new Map());
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

const manifest = {
  name: "The Membrane Palette",
  version: pkg.version,
  generated: "Do not edit — produced by scripts/build-components.mjs from components/*/",
  install: {
    allInOne: `<link rel="stylesheet" href="${CDN}membrane.css">`,
    behaviors: `<script src="${CDN}components/membrane.js" defer></script>`,
    split: [`${CDN}tokens/design-tokens.css`, `${CDN}tokens/base.css`, `${CDN}components/membrane-components.css`],
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
    patterns: "examples/*.html are complete pages (starter, article, dashboard) built only from the library and linted like the examples here.",
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
 *  llms.txt — https://llmstxt.org
 * ------------------------------------------------------------------ */

const llms = `# The Membrane Palette

> A token-based design system and framework-free CSS component library where human warmth meets digital precision. Terracotta (human register) and deep teal (digital register) on warm cream, Fraunces + Instrument Sans + JetBrains Mono, automatic dark mode, WCAG contrast gate-checked at build time. Use it by linking one stylesheet and writing semantic HTML with \`mp-\` classes.

Rules for generating UI with this system:

- Load \`${CDN}membrane.css\` (tokens + base + components). Load \`${CDN}components/membrane.js\` when you use Tabs, Menu, Combobox or Toast (they need it for keyboard behavior or rendering), Tooltip Escape-dismiss, or dialog invoker fallbacks.
- Compose from components (\`.mp-button\`, \`.mp-card\`, \`.mp-field\`…) and layout primitives (\`.mp-container\`, \`.mp-stack\`, \`.mp-cluster\`, \`.mp-grid\`) before writing CSS.
- Options are \`data-*\` attributes (\`data-variant="secondary"\`); only the values listed in the manifest exist.
- States come from semantic HTML/ARIA (\`disabled\`, \`aria-invalid="true"\`, \`aria-current="page"\`, \`aria-selected\`, \`aria-busy\`), never from extra classes.
- In custom CSS use semantic tokens only (\`--color-text-primary\`, \`--color-bg-secondary\`, \`--color-action-primary\`, \`--space-6\`, \`--text-h2\`). Never hex values, never Tier 1 primitives like \`--color-terracotta\`.
- At most one primary (terracotta) button per view. Cream not white, charcoal not black.
- Charts use \`--color-chart-1\`…\`-6\` in order (never cycled); status meaning uses status tokens with a label.
- Custom motion uses the composites: \`--transition-enter\` on the open state, \`--transition-exit\` on the closed one, \`--transition-state\` for toggles. Animate opacity and transforms only, put hover effects inside \`@media (hover: hover)\`, and remove movement under \`prefers-reduced-motion\`.
- Writing Tailwind? Import \`tokens/membrane-tailwind.css\` and use only \`mp-\` utilities (\`bg-mp-surface\`, \`text-mp-fg\`, \`bg-mp-primary\`); off-brand classes like \`bg-blue-500\` don't exist.

## Start here

- [Component manifest (JSON)](components/manifest.json): every component's classes, allowed attribute values, states, knobs, tokens and HTML examples
- [TypeScript types](components/membrane.d.ts): the same API as types (MpAttrs<"button">, MpClass, MpToken) for framework code
- [Brand marks](DESIGN-SYSTEM.md#103-files): outlined SVG wordmark and \`dc\` monogram in brand/ — use the files, never retype the name in Fraunces
- [Design system specification](DESIGN-SYSTEM.md): principles, color, type, spacing, motion, dark mode, accessibility
- [Token source (DTCG JSON)](tokens/membrane.tokens.json): every token with descriptions; the only file with authority over values
- [Brand voice](BRAND-VOICE.md): tone and vocabulary for any copy you write alongside the UI

## Components

${CATEGORIES.map((cat) => components.filter((c) => c.meta.category === cat).map((c) => `- [${c.meta.name}](components/${c.slug}/README.md): ${c.meta.summary}`).join("\n")).join("\n")}

## Optional

- [Starter page](examples/starter.html): a complete landing page to copy from
- [Article pattern](examples/article.html): long-form essay page
- [Dashboard pattern](examples/dashboard.html): product UI with stats, chart, table, tabs, menu and toast
- [Tailwind v4 theme](tokens/membrane-tailwind.css): mp- utilities mapped onto the semantic tokens
- [Resolved tokens (JSON)](tokens/tokens.resolved.json): every token's light and dark value as plain hex, for charting libraries and native apps
- [Live showcase](${SITE}): every component rendered in light and dark mode
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
    <a class="mp-link" data-variant="standalone" href="${DOCS_BASE}components/${c.slug}/README.md">Docs &amp; API<span class="mp-visually-hidden"> for ${escapeHtml(c.meta.name)}</span></a>
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

const SHOWCASE = rel("showcase", "index.html");
let html = await readFile(SHOWCASE, "utf8");
const re = /(<!-- GENERATED:COMPONENT-GALLERY -->)[\s\S]*?(<!-- \/GENERATED:COMPONENT-GALLERY -->)/;
if (!re.test(html)) throw new Error("Marker GENERATED:COMPONENT-GALLERY not found in showcase/index.html");
html = html.replace(re, (_, a, b) => `${a}\n${renderGallery()}\n        ${b}`);
await writeFile(SHOWCASE, html);

const exampleCount = components.reduce((n, c) => n + c.examples.length, 0);
console.log(`✓ Linted ${components.length} components, ${exampleCount} documented examples and ${examplePages.length} pattern pages against ${tokens.size} tokens`);
console.log("✓ Wrote components/membrane-components.css, membrane.css, components/manifest.json, components/membrane.d.ts, llms.txt");
console.log(`✓ Regenerated API sections in ${components.length} READMEs and the showcase component gallery`);
