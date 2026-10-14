import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const changed = [];
const failures = [];

async function transform(file, fn) {
  const target = path.join(root, file);
  const before = await readFile(target, "utf8");
  const after = fn(before);
  if (after !== before) {
    await writeFile(target, after);
    changed.push(file);
  }
}

function replaceExpected(source, before, after, label) {
  if (source.includes(after)) return source;
  if (!source.includes(before)) {
    failures.push(`${label}: expected source text not found`);
    return source;
  }
  return source.replace(before, after);
}

function replaceAllExpected(source, before, after, label) {
  if (!source.includes(before)) {
    if (source.includes(after)) return source;
    failures.push(`${label}: expected source text not found`);
    return source;
  }
  return source.split(before).join(after);
}

// ---------------------------------------------------------------------------
// Design-system authority and verbal semantics
// ---------------------------------------------------------------------------
await transform("DESIGN-SYSTEM.md", (src) => {
  src = replaceExpected(
    src,
    "This design system is the **single source of truth** for every visual and interactive expression of the Isaac D'Césares brand — from the personal website to social media cards, presentation decks, GitHub profiles, institutional materials, and AI-generated content.",
    "This design system is the **visual and interactive authority** for the Isaac D'Césares brand — from the personal website to social media cards, presentation decks, GitHub profiles and institutional materials. Personal facts live in `PROFILE.md`; writing behavior lives in `VOICE.md`; public brand expression lives in `BRAND-VOICE.md`.",
    "DESIGN-SYSTEM authority"
  );
  src = replaceExpected(
    src,
    "**For AI agents:** Start from `llms.txt` and `components/manifest.json` — the manifest lists every component's classes, the only valid `data-*` values, the ARIA states it styles, and copyable HTML. Use this document as your style constraint: validate output against Section 1 (Principles), Section 2 (Color), Section 3 (Typography) and Section 6 (Components) at minimum, and §11.4 for a ready-made constraint block.",
    "**For AI agents:** Start from `llms.txt` and `components/manifest.json` for the UI API. Read `PROFILE.md` before making claims about Isaac, `VOICE.md` for writing behavior and register adaptation, and `BRAND-VOICE.md` for public-facing brand expression. Use this document as the visual/UI constraint: validate output against Section 1 (Principles), Section 2 (Color), Section 3 (Typography) and Section 6 (Components) at minimum, and §11.4 for a ready-made constraint block.",
    "DESIGN-SYSTEM agent entry"
  );
  src = replaceExpected(
    src,
    "**The test for any output:** Does it hold both the human register and the digital register simultaneously? Is it warm without being casual? Is it precise without being cold?",
    "**The test for visual output:** Is the chosen register meaningful for the content? When human and digital concerns meet, does the interface hold them coherently? Is it warm without being casual and precise without being cold? For factual and verbal output, use the authority hierarchy above rather than inferring from visual principles.",
    "DESIGN-SYSTEM output test"
  );
  src = replaceAllExpected(src, "Builder energy", "Making energy", "DESIGN-SYSTEM builder semantics");
  src = replaceExpected(
    src,
    `VOICE CONSTRAINTS (from Brand Essence):
- Articulate, warm, concrete, confident without arrogance
- Never hype-driven ("disrupting", "revolutionizing")
- Never credential-forward (titles follow impact)
- Always hold both human and digital registers
- Default CTA: "Let's co-create" / "Vamos cocriar?"`,
    `VERBAL AUTHORITY:
- PROFILE.md decides what is true about Isaac
- VOICE.md decides how Isaac naturally communicates and adapts by register
- BRAND-VOICE.md decides how that voice is expressed publicly
- Never infer biography from a writing or UI example

VOICE CONSTRAINTS:
- Human, reflective, precise, contextual and concrete
- Be as certain as the evidence allows; useful hedging is allowed
- Avoid hype, abstraction without a referent and credential inflation
- Adapt the register to the audience instead of forcing every text to sound branded
- Buttons normally name the concrete action; “Let's co-create” / “Vamos cocriar?” is optional campaign copy only when the action is genuinely collaborative`,
    "DESIGN-SYSTEM AI verbal block"
  );
  src = replaceExpected(
    src,
    "The components carry the visual brand; the words carry the voice. These rules translate `BRAND-VOICE.md` into interface copy.",
    "The components carry the visual brand; the words carry the voice. Interface copy follows `VOICE.md` for writing behavior, `BRAND-VOICE.md` for public-brand application, and `PROFILE.md` whenever copy makes a claim about Isaac.",
    "DESIGN-SYSTEM content authority"
  );
  src = replaceExpected(
    src,
    `| Buttons | A verb for what happens, ≤ 3 words. The primary CTA may use the signature phrase. | "Save draft", "Let's co-create" | "OK", "Submit", "Click here" |`,
    `| Buttons | A verb for what happens, ≤ 3 words. Name the concrete action; campaign language is exceptional. | "Save draft", "Start workshop" | "OK", "Submit", "Click here" |`,
    "DESIGN-SYSTEM button writing"
  );
  src = replaceExpected(
    src,
    "Never use the hype or credential-forward vocabulary listed in `BRAND-VOICE.md` §4 in UI copy either.",
    "Avoid hype, credential inflation and abstraction without a referent in UI copy. Ordinary professional vocabulary is valid when it names something specific; see `VOICE.md`.",
    "DESIGN-SYSTEM vocabulary rule"
  );
  src = replaceExpected(
    src,
    `> **Companion Documents:**
> - \`BRAND-VOICE.md\` — Complete voice and tone guide with writing samples, vocabulary, and audience adaptation rules.`,
    `> **Companion Documents:**
> - \`PROFILE.md\` — factual identity and current biographical claims.
> - \`VOICE.md\` — observed writing behavior, evidence classes and register adaptation.
> - \`BRAND-VOICE.md\` — public-brand application layer.`,
    "DESIGN-SYSTEM companion docs"
  );
  return src;
});

await transform("tokens/membrane.tokens.json", (src) =>
  replaceAllExpected(src, "Builder energy. Fill/badge use only", "Making energy. Fill/badge use only", "amber token semantics")
);

// ---------------------------------------------------------------------------
// Component documentation and safe sample content
// ---------------------------------------------------------------------------
await transform("components/code/README.md", (src) =>
  replaceExpected(src, "The builder register.", "The technical-craft register.", "code register")
);
await transform("components/prose/README.md", (src) =>
  replaceExpected(src, "keeps the builder register visible", "keeps the code register visible", "prose register")
);
await transform("components/button/README.md", (src) => {
  src = replaceExpected(src, `<button class="mp-button" type="button">Let's co-create</button>`, `<button class="mp-button" type="button">Save draft</button>`, "button primary example");
  src = replaceExpected(src, "<h3 class=\"mp-card__title\">Builders' Lab</h3>", "<h3 class=\"mp-card__title\">Prototype Lab</h3>", "button sample lab");
  src = replaceExpected(src, `- **Do** write labels as verbs in the brand voice: "Let's co-create", "Save draft".`, `- **Do** name the action with a short verb phrase: "Save draft", "Start workshop".`, "button writing rule");
  return src;
});
await transform("components/navbar/README.md", (src) =>
  replaceAllExpected(src, "Let's co-create", "See the work", "navbar CTA")
);
await transform("components/input/README.md", (src) =>
  replaceAllExpected(src, "Vamos cocriar?", "Tell us what you want to explore.", "input sample")
);
for (const file of ["components/tag/README.md", "components/choice/README.md", "components/table/README.md", "components/chart/README.md"]) {
  await transform(file, (src) => src.replace(/\bBuilders\b/g, "Developers"));
}
await transform("components/card/README.md", (src) => {
  src = replaceExpected(src, "<p class=\"mp-card__overline\">Case study</p>", "<p class=\"mp-card__overline\">Sample case</p>", "card sample label");
  src = replaceExpected(src, "How 3,000 educators co-designed their own assistant.", "A fictional program for testing collaborative AI-literacy workflows.", "card unsupported metric");
  return src;
});

await transform("examples/starter.html", (src) => {
  src = replaceExpected(src, `>Let's co-create</a>`, `>Start a conversation</a>`, "starter hero CTA");
  src = replaceExpected(src, "<h3 class=\"mp-card__title\"><a class=\"mp-card__link\" href=\"#contact\">Builders' Lab</a></h3>", "<h3 class=\"mp-card__title\"><a class=\"mp-card__link\" href=\"#contact\">Prototype Lab</a></h3>", "starter sample lab");
  src = replaceExpected(src, `<h2 class="type-h1">Vamos cocriar?</h2>`, `<h2 class="type-h1">Start a conversation</h2>`, "starter contact heading");
  return src;
});
await transform("examples/article.html", (src) => {
  src = replaceExpected(src, `<p class="mp-card__overline">Case study</p>`, `<p class="mp-card__overline">Sample case</p>`, "article sample label");
  src = replaceExpected(src, "How 3,000 educators co-designed their own assistant.", "A fictional program for testing collaborative AI-literacy workflows.", "article unsupported metric");
  return src;
});

// ---------------------------------------------------------------------------
// Agent indexes, deployment and human-facing docs
// ---------------------------------------------------------------------------
await transform("scripts/build-components.mjs", (src) => {
  src = replaceExpected(
    src,
    `Rules for generating UI with this system:\n\n- Load`,
    `Rules for generating UI with this system:\n\n- For claims about Isaac, read \\`PROFILE.md\\`; for writing behavior and register adaptation, read \\`VOICE.md\\`; for public brand expression, read \\`BRAND-VOICE.md\\`; for visual/UI behavior, read \\`DESIGN-SYSTEM.md\\`. Never infer biography from examples.\n- Load`,
    "llms authority rule"
  );
  src = replaceExpected(
    src,
    `- [Design system specification](DESIGN-SYSTEM.md): principles, color, type, spacing, motion, dark mode, accessibility\n- [Token source (DTCG JSON)](tokens/membrane.tokens.json): every token with descriptions; the only file with authority over values\n- [Brand voice](BRAND-VOICE.md): tone and vocabulary for any copy you write alongside the UI`,
    `- [Profile](PROFILE.md): factual identity and current biographical claims — authority for what is true about Isaac\n- [Voice](VOICE.md): observed writing behavior, evidence classes and register adaptation\n- [Brand voice](BRAND-VOICE.md): public-facing brand application\n- [Design system specification](DESIGN-SYSTEM.md): principles, color, type, spacing, motion, dark mode, accessibility and interface behavior\n- [Token source (DTCG JSON)](tokens/membrane.tokens.json): every token with descriptions; the only file with authority over values`,
    "llms start-here authority list"
  );
  return src;
});

await transform("scripts/build-cloudflare-pages.mjs", (src) => {
  src = replaceExpected(
    src,
    `for (const file of ["membrane.css", "llms.txt", "DESIGN-SYSTEM.md", "BRAND-VOICE.md", "CHANGELOG.md"]) {`,
    `for (const file of ["membrane.css", "llms.txt", "PROFILE.md", "VOICE.md", "BRAND-VOICE.md", "DESIGN-SYSTEM.md", "CHANGELOG.md"]) {`,
    "dist authority docs"
  );
  src = replaceExpected(
    src,
    `const sections = [\n  await readFile(path.join(root, "llms.txt"), "utf8"),\n  ...(await Promise.all(ordered.map((s) => readFile(path.join(root, "components", s, "README.md"), "utf8")))),\n  await readFile(path.join(root, "DESIGN-SYSTEM.md"), "utf8"),\n];`,
    `const sections = [\n  await readFile(path.join(root, "llms.txt"), "utf8"),\n  await readFile(path.join(root, "PROFILE.md"), "utf8"),\n  await readFile(path.join(root, "VOICE.md"), "utf8"),\n  await readFile(path.join(root, "BRAND-VOICE.md"), "utf8"),\n  ...(await Promise.all(ordered.map((s) => readFile(path.join(root, "components", s, "README.md"), "utf8")))),\n  await readFile(path.join(root, "DESIGN-SYSTEM.md"), "utf8"),\n];`,
    "llms-full authority order"
  );
  return src;
});

await transform("README.md", (src) => {
  src = replaceAllExpected(src, "Builder energy. Fill/badge use only.", "Making energy. Fill/badge use only.", "README amber semantics");
  src = replaceExpected(
    src,
    `| [\`DESIGN-SYSTEM.md\`](DESIGN-SYSTEM.md) | **Specification.** Principles, color, type, spacing, components, dark mode, accessibility. |`,
    `| [\`PROFILE.md\`](PROFILE.md) | **Factual authority.** Current role, academic wording, public identity and explicit non-inferences. |\n| [\`VOICE.md\`](VOICE.md) | **Writing authority.** Observed voice, evidence classes and adaptive registers. |\n| [\`BRAND-VOICE.md\`](BRAND-VOICE.md) | **Brand application.** How the voice is expressed publicly without inventing biography. |\n| [\`DESIGN-SYSTEM.md\`](DESIGN-SYSTEM.md) | **Visual/UI specification.** Principles, color, type, spacing, components, dark mode, accessibility. |`,
    "README authority file table"
  );
  src = replaceExpected(
    src,
    `| [\`BRAND-VOICE.md\`](BRAND-VOICE.md) | Tone and vocabulary for any copy you write alongside the UI. |`,
    `| [\`PROFILE.md\`](PROFILE.md) | Facts about Isaac: current role, academic status and approved biographical claims. |\n| [\`VOICE.md\`](VOICE.md) | How Isaac naturally writes, including register adaptation and example evidence classes. |\n| [\`BRAND-VOICE.md\`](BRAND-VOICE.md) | How that voice is applied in public brand material. |`,
    "README AI authority table"
  );
  src = replaceAllExpected(src, `>Let's co-create</button>`, `>Join workshop</button>`, "README button sample");
  return src;
});

await transform("CONTRIBUTING.md", (src) =>
  replaceExpected(
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
