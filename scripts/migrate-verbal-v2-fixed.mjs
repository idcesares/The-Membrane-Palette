import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const changed = [];
const failures = [];
const nl = (...lines) => lines.join("\n");

async function edit(file, mutate) {
  const target = path.join(root, file);
  const before = await readFile(target, "utf8");
  const after = mutate(before);
  if (after !== before) {
    await writeFile(target, after);
    changed.push(file);
  }
}

function swap(src, before, after, label) {
  if (src.includes(after)) return src;
  if (!src.includes(before)) {
    failures.push(`${label}: expected source text not found`);
    return src;
  }
  return src.replace(before, after);
}

function swapAll(src, before, after, label) {
  if (src.includes(before)) return src.split(before).join(after);
  if (src.includes(after)) return src;
  failures.push(`${label}: expected source text not found`);
  return src;
}

await edit("DESIGN-SYSTEM.md", (src) => {
  src = swap(
    src,
    "This design system is the **single source of truth** for every visual and interactive expression of the Isaac D'Césares brand — from the personal website to social media cards, presentation decks, GitHub profiles, institutional materials, and AI-generated content.",
    "This design system is the **visual and interactive authority** for the Isaac D'Césares brand — from the personal website to social media cards, presentation decks, GitHub profiles and institutional materials. Personal facts live in `PROFILE.md`; writing behavior lives in `VOICE.md`; public brand expression lives in `BRAND-VOICE.md`.",
    "design authority"
  );
  src = swap(
    src,
    "**For AI agents:** Start from `llms.txt` and `components/manifest.json` — the manifest lists every component's classes, the only valid `data-*` values, the ARIA states it styles, and copyable HTML. Use this document as your style constraint: validate output against Section 1 (Principles), Section 2 (Color), Section 3 (Typography) and Section 6 (Components) at minimum, and §11.4 for a ready-made constraint block.",
    "**For AI agents:** Start from `llms.txt` and `components/manifest.json` for the UI API. Read `PROFILE.md` before making claims about Isaac, `VOICE.md` for writing behavior and register adaptation, and `BRAND-VOICE.md` for public-facing brand expression. Use this document as the visual/UI constraint: validate output against Section 1 (Principles), Section 2 (Color), Section 3 (Typography) and Section 6 (Components) at minimum, and §11.4 for a ready-made constraint block.",
    "agent entry"
  );
  src = swap(
    src,
    "**The test for any output:** Does it hold both the human register and the digital register simultaneously? Is it warm without being casual? Is it precise without being cold?",
    "**The test for visual output:** Is the chosen register meaningful for the content? When human and digital concerns meet, does the interface hold them coherently? Is it warm without being casual and precise without being cold? For factual and verbal output, use the authority hierarchy above rather than inferring from visual principles.",
    "visual output test"
  );
  src = swapAll(src, "Builder energy", "Making energy", "builder semantics");
  src = swap(
    src,
    nl(
      "VOICE CONSTRAINTS (from Brand Essence):",
      "- Articulate, warm, concrete, confident without arrogance",
      "- Never hype-driven (\"disrupting\", \"revolutionizing\")",
      "- Never credential-forward (titles follow impact)",
      "- Always hold both human and digital registers",
      "- Default CTA: \"Let's co-create\" / \"Vamos cocriar?\""
    ),
    nl(
      "VERBAL AUTHORITY:",
      "- PROFILE.md decides what is true about Isaac",
      "- VOICE.md decides how Isaac naturally communicates and adapts by register",
      "- BRAND-VOICE.md decides how that voice is expressed publicly",
      "- Never infer biography from a writing or UI example",
      "",
      "VOICE CONSTRAINTS:",
      "- Human, reflective, precise, contextual and concrete",
      "- Be as certain as the evidence allows; useful hedging is allowed",
      "- Avoid hype, abstraction without a referent and credential inflation",
      "- Adapt the register to the audience instead of forcing every text to sound branded",
      "- Buttons normally name the concrete action; “Let's co-create” / “Vamos cocriar?” is optional campaign copy only when the action is genuinely collaborative"
    ),
    "AI verbal block"
  );
  src = swap(
    src,
    "The components carry the visual brand; the words carry the voice. These rules translate `BRAND-VOICE.md` into interface copy.",
    "The components carry the visual brand; the words carry the voice. Interface copy follows `VOICE.md` for writing behavior, `BRAND-VOICE.md` for public-brand application, and `PROFILE.md` whenever copy makes a claim about Isaac.",
    "content authority"
  );
  src = swap(
    src,
    "| Buttons | A verb for what happens, ≤ 3 words. The primary CTA may use the signature phrase. | \"Save draft\", \"Let's co-create\" | \"OK\", \"Submit\", \"Click here\" |",
    "| Buttons | A verb for what happens, ≤ 3 words. Name the concrete action; campaign language is exceptional. | \"Save draft\", \"Start workshop\" | \"OK\", \"Submit\", \"Click here\" |",
    "button writing"
  );
  src = swap(
    src,
    "Never use the hype or credential-forward vocabulary listed in `BRAND-VOICE.md` §4 in UI copy either.",
    "Avoid hype, credential inflation and abstraction without a referent in UI copy. Ordinary professional vocabulary is valid when it names something specific; see `VOICE.md`.",
    "vocabulary rule"
  );
  src = swap(
    src,
    nl(
      "> **Companion Documents:**",
      "> - `BRAND-VOICE.md` — Complete voice and tone guide with writing samples, vocabulary, and audience adaptation rules."
    ),
    nl(
      "> **Companion Documents:**",
      "> - `PROFILE.md` — factual identity and current biographical claims.",
      "> - `VOICE.md` — observed writing behavior, evidence classes and register adaptation.",
      "> - `BRAND-VOICE.md` — public-brand application layer."
    ),
    "companion docs"
  );
  return src;
});

await edit("tokens/membrane.tokens.json", (src) =>
  swapAll(src, "Builder energy. Fill/badge use only", "Making energy. Fill/badge use only", "amber token semantics")
);

await edit("components/code/README.md", (src) => swap(src, "The builder register.", "The technical-craft register.", "code register"));
await edit("components/prose/README.md", (src) => swap(src, "keeps the builder register visible", "keeps the code register visible", "prose register"));
await edit("components/button/README.md", (src) => {
  src = swap(src, "<button class=\"mp-button\" type=\"button\">Let's co-create</button>", "<button class=\"mp-button\" type=\"button\">Save draft</button>", "button primary example");
  src = swap(src, "<h3 class=\"mp-card__title\">Builders' Lab</h3>", "<h3 class=\"mp-card__title\">Prototype Lab</h3>", "button sample lab");
  src = swap(src, "- **Do** write labels as verbs in the brand voice: \"Let's co-create\", \"Save draft\".", "- **Do** name the action with a short verb phrase: \"Save draft\", \"Start workshop\".", "button writing rule");
  return src;
});
await edit("components/navbar/README.md", (src) => swapAll(src, "Let's co-create", "See the work", "navbar CTA"));
await edit("components/input/README.md", (src) => swapAll(src, "Vamos cocriar?", "Tell us what you want to explore.", "input sample"));
for (const file of ["components/tag/README.md", "components/choice/README.md", "components/table/README.md", "components/chart/README.md"]) {
  await edit(file, (src) => src.replace(/\bBuilders\b/g, "Developers"));
}
await edit("components/card/README.md", (src) => {
  src = swap(src, "<p class=\"mp-card__overline\">Case study</p>", "<p class=\"mp-card__overline\">Sample case</p>", "card sample label");
  src = swap(src, "How 3,000 educators co-designed their own assistant.", "A fictional program for testing collaborative AI-literacy workflows.", "card unsupported metric");
  return src;
});

await edit("examples/starter.html", (src) => {
  src = swap(src, ">Let's co-create</a>", ">Start a conversation</a>", "starter hero CTA");
  src = swap(src, "<h3 class=\"mp-card__title\"><a class=\"mp-card__link\" href=\"#contact\">Builders' Lab</a></h3>", "<h3 class=\"mp-card__title\"><a class=\"mp-card__link\" href=\"#contact\">Prototype Lab</a></h3>", "starter sample lab");
  src = swap(src, "<h2 class=\"type-h1\">Vamos cocriar?</h2>", "<h2 class=\"type-h1\">Start a conversation</h2>", "starter contact heading");
  return src;
});
await edit("examples/article.html", (src) => {
  src = swap(src, "<p class=\"mp-card__overline\">Case study</p>", "<p class=\"mp-card__overline\">Sample case</p>", "article sample label");
  src = swap(src, "How 3,000 educators co-designed their own assistant.", "A fictional program for testing collaborative AI-literacy workflows.", "article unsupported metric");
  return src;
});

await edit("scripts/build-components.mjs", (src) => {
  src = swap(
    src,
    nl("Rules for generating UI with this system:", "", "- Load"),
    nl(
      "Rules for generating UI with this system:",
      "",
      "- For claims about Isaac, read `PROFILE.md`; for writing behavior and register adaptation, read `VOICE.md`; for public brand expression, read `BRAND-VOICE.md`; for visual/UI behavior, read `DESIGN-SYSTEM.md`. Never infer biography from examples.",
      "- Load"
    ),
    "llms authority rule"
  );
  src = swap(
    src,
    nl(
      "- [Design system specification](DESIGN-SYSTEM.md): principles, color, type, spacing, motion, dark mode, accessibility",
      "- [Token source (DTCG JSON)](tokens/membrane.tokens.json): every token with descriptions; the only file with authority over values",
      "- [Brand voice](BRAND-VOICE.md): tone and vocabulary for any copy you write alongside the UI"
    ),
    nl(
      "- [Profile](PROFILE.md): factual identity and current biographical claims — authority for what is true about Isaac",
      "- [Voice](VOICE.md): observed writing behavior, evidence classes and register adaptation",
      "- [Brand voice](BRAND-VOICE.md): public-facing brand application",
      "- [Design system specification](DESIGN-SYSTEM.md): principles, color, type, spacing, motion, dark mode, accessibility and interface behavior",
      "- [Token source (DTCG JSON)](tokens/membrane.tokens.json): every token with descriptions; the only file with authority over values"
    ),
    "llms start-here list"
  );
  return src;
});

await edit("scripts/build-cloudflare-pages.mjs", (src) => {
  src = swap(
    src,
    "for (const file of [\"membrane.css\", \"llms.txt\", \"DESIGN-SYSTEM.md\", \"BRAND-VOICE.md\", \"CHANGELOG.md\"]) {",
    "for (const file of [\"membrane.css\", \"llms.txt\", \"PROFILE.md\", \"VOICE.md\", \"BRAND-VOICE.md\", \"DESIGN-SYSTEM.md\", \"CHANGELOG.md\"]) {",
    "dist authority docs"
  );
  src = swap(
    src,
    nl(
      "const sections = [",
      "  await readFile(path.join(root, \"llms.txt\"), \"utf8\"),",
      "  ...(await Promise.all(ordered.map((s) => readFile(path.join(root, \"components\", s, \"README.md\"), \"utf8\")))),",
      "  await readFile(path.join(root, \"DESIGN-SYSTEM.md\"), \"utf8\"),",
      "];"
    ),
    nl(
      "const sections = [",
      "  await readFile(path.join(root, \"llms.txt\"), \"utf8\"),",
      "  await readFile(path.join(root, \"PROFILE.md\"), \"utf8\"),",
      "  await readFile(path.join(root, \"VOICE.md\"), \"utf8\"),",
      "  await readFile(path.join(root, \"BRAND-VOICE.md\"), \"utf8\"),",
      "  ...(await Promise.all(ordered.map((s) => readFile(path.join(root, \"components\", s, \"README.md\"), \"utf8\")))),",
      "  await readFile(path.join(root, \"DESIGN-SYSTEM.md\"), \"utf8\"),",
      "];"
    ),
    "llms-full order"
  );
  return src;
});

await edit("README.md", (src) => {
  src = swapAll(src, "Builder energy. Fill/badge use only.", "Making energy. Fill/badge use only.", "README amber semantics");
  src = swap(
    src,
    "| [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) | **Specification.** Principles, color, type, spacing, components, dark mode, accessibility. |",
    nl(
      "| [`PROFILE.md`](PROFILE.md) | **Factual authority.** Current role, academic wording, public identity and explicit non-inferences. |",
      "| [`VOICE.md`](VOICE.md) | **Writing authority.** Observed voice, evidence classes and adaptive registers. |",
      "| [`BRAND-VOICE.md`](BRAND-VOICE.md) | **Brand application.** How the voice is expressed publicly without inventing biography. |",
      "| [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) | **Visual/UI specification.** Principles, color, type, spacing, components, dark mode, accessibility. |"
    ),
    "README authority table"
  );
  src = swap(
    src,
    "| [`BRAND-VOICE.md`](BRAND-VOICE.md) | Tone and vocabulary for any copy you write alongside the UI. |",
    nl(
      "| [`PROFILE.md`](PROFILE.md) | Facts about Isaac: current role, academic status and approved biographical claims. |",
      "| [`VOICE.md`](VOICE.md) | How Isaac naturally writes, including register adaptation and example evidence classes. |",
      "| [`BRAND-VOICE.md`](BRAND-VOICE.md) | How that voice is applied in public brand material. |"
    ),
    "README AI authority table"
  );
  src = swapAll(src, ">Let's co-create</button>", ">Join workshop</button>", "README button sample");
  return src;
});

await edit("CONTRIBUTING.md", (src) =>
  swap(
    src,
    "Interface copy follows `DESIGN-SYSTEM.md` §16 and `BRAND-VOICE.md`: verbs on buttons, errors that say how to fix, empty states that teach, no hype words.",
    "Interface copy follows `DESIGN-SYSTEM.md` §16 and `VOICE.md`; public-brand expression also uses `BRAND-VOICE.md`, and any personal claim must come from `PROFILE.md`. Buttons name actions, errors say how to fix the problem, and empty states teach the next step.",
    "CONTRIBUTING writing authority"
  )
);

if (failures.length) {
  console.error("Verbal System v2 migration could not prove its assumptions:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

if (changed.length) {
  console.log(`✓ Verbal System v2 migration updated ${changed.length} source files:`);
  for (const file of changed) console.log(`  - ${file}`);
} else {
  console.log("✓ Verbal System v2 migration already applied; no source changes needed");
}
