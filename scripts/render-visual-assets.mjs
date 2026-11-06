/** Original Membrane artwork. Edit geometry here; theme colors come from tokens. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "brand/visuals");
const tokens = JSON.parse(await readFile(path.join(root, "tokens/tokens.resolved.json"), "utf8"));
const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const palette = mode => Object.fromEntries(Object.entries({ human: "--color-human-text", digital: "--color-digital-text", ink: "--color-text-primary", rule: "--color-border-emphasis", humanWash: "--color-human-bg", digitalWash: "--color-digital-bg" }).map(([role, token]) => {
  const value = tokens.modes[mode][token];
  if (!value) throw new Error(`Missing ${mode} semantic color ${token}`);
  return [role, value];
}));

const assets = [
  {
    id: "passage", title: "Passage", role: "focal", height: 600,
    description: "An open organic trace meets a dotted boundary and continues as three aligned routes.",
    usage: "Website openings, editorial covers and section introductions about interpretation or translation.",
    limitations: "An expressive motif, not a measured process. Keep labels outside the artwork; preserve the crossing when cropping.",
    draw: c => `
  <path d="M126 127C203 66 327 101 362 199C395 292 344 424 251 467C155 512 69 435 73 330C77 242 66 177 126 127Z" fill="${c.humanWash}"/>
  <rect x="463" y="119" width="239" height="367" rx="22" fill="${c.digitalWash}"/>
  <path d="M420 82C393 172 446 236 420 317C400 384 422 431 415 516" stroke="${c.ink}" stroke-width="2" stroke-dasharray="2 13"/>
  <g stroke="${c.rule}" stroke-width="2"><path d="M487 151h31m-31 0v31m191-31h-31m31 0v31M487 454h31m-31 0v-31m191 31h-31m31 0v-31"/><path d="M521 190v225M568 190v225M615 190v225" stroke-dasharray="2 10"/></g>
  <g stroke="${c.human}" stroke-width="8"><path d="M66 364C144 435 230 425 242 337C255 243 141 214 160 298C178 377 315 395 420 302"/><path d="M103 188C209 105 254 189 298 205C341 221 381 214 420 214" stroke-width="4"/><path d="M135 465C270 509 310 383 420 390" stroke-width="4"/></g>
  <g stroke="${c.digital}" stroke-width="6"><path d="M420 214h229"/><path d="M420 302h123v88h106"/><path d="M420 390h66v-88h163"/></g>
  <g fill="${c.digital}"><circle cx="661" cy="214" r="8"/><circle cx="661" cy="302" r="8"/><rect x="653" y="382" width="16" height="16" rx="2"/></g>
  <circle cx="420" cy="302" r="12" fill="${c.ink}"/>`,
  },
  {
    id: "confluence", title: "Confluence", role: "focal", height: 600,
    description: "Three independent curved paths gather at an open ring, then separate into a structured set of routes.",
    usage: "Presentation covers and introductions to collective inquiry or synthesis.",
    limitations: "Do not imply that different perspectives become equivalent. Use a labelled diagram for an actual method.",
    draw: c => `
  <path d="M119 110C242 67 359 147 388 265C417 386 300 512 170 467C49 425 17 171 119 110Z" fill="${c.humanWash}"/>
  <circle cx="397" cy="300" r="113" fill="${c.digitalWash}"/>
  <g stroke="${c.rule}" stroke-width="2"><path d="M498 105h203v390H498" stroke-dasharray="3 12"/><path d="M520 150h160M520 450h160"/></g>
  <g stroke="${c.human}" stroke-width="7"><path d="M92 147C193 79 196 303 352 300"/><path d="M58 305C175 425 236 189 352 300"/><path d="M116 467C230 534 226 302 352 300"/></g>
  <circle cx="397" cy="300" r="45" stroke="${c.ink}" stroke-width="3"/>
  <g stroke="${c.digital}" stroke-width="6"><path d="M442 300h86V168h147"/><path d="M442 300h233"/><path d="M528 300v132h147"/></g>
  <g fill="${c.digital}"><circle cx="687" cy="168" r="8"/><rect x="679" y="292" width="16" height="16" rx="2"/><circle cx="687" cy="432" r="8"/></g>`,
  },
  {
    id: "field-notes", title: "Field notes", role: "editorial", height: 600,
    description: "A loose warm plane sits behind a precise open frame, with a curved observation trace and annotation anchors.",
    usage: "Teaching cards, editorial sidebars and introductory illustrations about observation.",
    limitations: "Anchors are decorative until connected to visible HTML labels. Never substitute this motif for actual evidence.",
    draw: c => `
  <path d="M128 113C177 62 277 113 325 95C391 71 451 118 427 190L388 362C367 438 248 486 173 420C101 358 59 188 128 113Z" fill="${c.humanWash}"/>
  <path d="M136 129C218 85 281 143 326 125" stroke="${c.human}" stroke-width="3"/>
  <rect x="280" y="172" width="377" height="318" rx="6" fill="${c.digitalWash}" stroke="${c.digital}" stroke-width="3"/>
  <g stroke="${c.rule}" stroke-width="2" stroke-dasharray="2 11"><path d="M312 252h312M312 331h312M312 410h312M390 205v253M468 205v253M546 205v253"/></g>
  <path d="M146 377C166 218 321 193 358 305C384 385 464 410 507 315C537 250 591 280 615 226" stroke="${c.human}" stroke-width="7"/>
  <g stroke="${c.ink}" stroke-width="2"><path d="M358 305l-36-74H218M507 315l54 83h140"/><circle cx="358" cy="305" r="10"/><circle cx="507" cy="315" r="10"/></g>
  <g fill="${c.digital}"><rect x="272" y="164" width="16" height="16"/><rect x="649" y="482" width="16" height="16"/></g>`,
  },
  {
    id: "learning-loop", title: "Learning loop", role: "editorial", height: 600,
    description: "An unfinished organic loop and an open rectangular route share two meeting points, leaving room for revision.",
    usage: "Reflection prompts, iteration stories and workshop material.",
    limitations: "The open loop suggests revisiting an idea; it does not encode a universal learning model or a progress value.",
    draw: c => `
  <path d="M152 131C267 54 434 133 421 288C405 465 160 493 92 360C42 262 79 180 152 131Z" fill="${c.humanWash}"/>
  <rect x="392" y="150" width="279" height="307" rx="8" fill="${c.digitalWash}"/>
  <path d="M164 401C69 341 125 139 262 152C407 165 407 359 274 390C221 402 193 358 209 328" stroke="${c.human}" stroke-width="8"/>
  <path d="M392 204h237v198H418v-98h116" stroke="${c.digital}" stroke-width="6"/>
  <g stroke="${c.rule}" stroke-width="2" stroke-dasharray="2 11"><path d="M535 99v99M686 304h-85M392 503v-71"/></g>
  <g stroke="${c.ink}" stroke-width="3"><circle cx="392" cy="204" r="11"/><circle cx="418" cy="402" r="11"/></g>
  <path d="M518 288l17 16-17 16" stroke="${c.digital}" stroke-width="5"/>`,
  },
  {
    id: "permeable-grid", title: "Permeable grid", role: "field", height: 400,
    description: "An open dotted grid interrupted by three organic crossings, with generous blank intervals.",
    usage: "Cropped margins, section transitions and separate supporting fields.",
    limitations: "Decorative texture only. Keep text on its own solid surface and never treat dot counts as data.",
    draw: c => `
  <g fill="${c.digital}">${Array.from({length: 9}, (_, x) => Array.from({length: 5}, (_, y) => `<circle cx="${180 + x * 64}" cy="${72 + y * 64}" r="2"/>`).join("")).join("")}</g>
  <g stroke="${c.human}" stroke-width="4"><path d="M56 80C160 23 174 200 283 152C377 112 372 59 462 89"/><path d="M92 213C178 163 223 320 329 265C419 219 448 168 555 216"/><path d="M195 348C291 302 341 396 429 340C513 286 600 289 710 327"/></g>`,
  },
  {
    id: "trace-field", title: "Trace field", role: "field", height: 400,
    description: "A family of independent warm curves becomes spaced, straight teal traces across an open seam.",
    usage: "Wide editorial strips, cover margins and transitions between sections.",
    limitations: "Decorative line field, not a chart, frequency scale or representation of recorded signals.",
    draw: c => `
  <path d="M414 42v316" stroke="${c.ink}" stroke-width="2" stroke-dasharray="2 12"/>
  ${Array.from({length: 8}, (_, i) => {
    const y = 65 + i * 38;
    return `<path d="M68 ${y}C176 ${y - 60 + i * 9} 282 ${y + 62 - i * 9} 414 ${y}" stroke="${c.human}" stroke-width="3"/><path d="M414 ${y}h306" stroke="${c.digital}" stroke-width="3"/><circle cx="732" cy="${y}" r="3" fill="${c.digital}"/>`;
  }).join("\n  ")}`,
  },
];

await mkdir(output, { recursive: true });
const catalog = { schemaVersion: 1, name: "Membrane visual assets", generated: "Edit scripts/render-visual-assets.mjs, then run npm run render:visuals. Colors resolve from semantic tokens.", license: "MIT — repository LICENSE", source: "scripts/render-visual-assets.mjs", colorSource: "tokens/membrane.tokens.json", assets: [] };
for (const asset of assets) {
  const { draw, height, ...metadata } = asset;
  const files = {};
  for (const mode of ["light", "dark"]) {
    const name = `${asset.id}-${mode}.svg`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${height}" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-labelledby="${asset.id}-title ${asset.id}-description">
  <title id="${asset.id}-title">${escape(asset.title)}</title>
  <desc id="${asset.id}-description">${escape(asset.description)} Original Membrane illustration; not data.</desc>${draw(palette(mode))}
</svg>\n`;
    await writeFile(path.join(output, name), svg);
    files[mode] = name;
  }
  catalog.assets.push({ ...metadata, width: 800, height, files });
}
await writeFile(path.join(output, "catalog.json"), JSON.stringify(catalog, null, 2) + "\n");
console.log(`✓ Rendered ${assets.length} original visual constructions in light and dark (${assets.length * 2} SVGs) and catalog`);
