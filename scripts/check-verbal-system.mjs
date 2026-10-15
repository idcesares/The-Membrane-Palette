import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

const load = async (file) => {
  try {
    return await readFile(path.join(root, file), "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      errors.push(`${file}: required Verbal System v2 file is missing`);
      return "";
    }
    throw error;
  }
};

const tracked = [
  "PROFILE.md",
  "VOICE.md",
  "BRAND-VOICE.md",
  "DESIGN-SYSTEM.md",
  "AGENTS.md",
  "CLAUDE.md",
  "llms.txt",
  "tokens/membrane.tokens.json",
  "components/button/README.md",
  "components/card/README.md",
  "examples/article.html",
];

const files = Object.fromEntries(
  await Promise.all(tracked.map(async (file) => [file, await load(file)]))
);

const requireText = (file, text) => {
  if (!files[file]?.includes(text)) errors.push(`${file}: missing required text: ${text}`);
};

const forbid = (file, pattern, description) => {
  if (pattern.test(files[file] ?? "")) errors.push(`${file}: ${description}`);
};

requireText("PROFILE.md", "Coordenador de Tecnologias Educacionais no Departamento Nacional do Sesc");
requireText("PROFILE.md", "Educational Technology Coordinator at Sesc's National Department");
requireText("PROFILE.md", "pesquisador (mestrando)");
requireText("PROFILE.md", "researcher and master's candidate at UFRJ");

requireText("VOICE.md", "Stable voice, adaptive register");
requireText("VOICE.md", "OBSERVED");
requireText("VOICE.md", "APPROVED");
requireText("VOICE.md", "ILLUSTRATIVE");

requireText("BRAND-VOICE.md", "Researcher · Educator · Developer");
requireText("BRAND-VOICE.md", "PROFILE.md");
requireText("BRAND-VOICE.md", "VOICE.md");
requireText("BRAND-VOICE.md", "optional campaign language");

for (const file of ["AGENTS.md", "CLAUDE.md", "llms.txt"]) {
  requireText(file, "PROFILE.md");
  requireText(file, "VOICE.md");
  requireText(file, "BRAND-VOICE.md");
  requireText(file, "DESIGN-SYSTEM.md");
  requireText(file, "Never infer biography from examples");
}
for (const file of ["AGENTS.md", "CLAUDE.md"]) {
  forbid(file, /builder\/code register/i, "obsolete builder/code register remains");
}

forbid("BRAND-VOICE.md", /Director of Digital Transformation/i, "unsupported current title remains");
forbid("BRAND-VOICE.md", /I have a Master's from UFRJ/i, "completed Master's claim remains");
forbid("BRAND-VOICE.md", /research(?:ing)? AI in learning for eight years/i, "unsupported eight-year AI claim remains");
forbid("BRAND-VOICE.md", /three years building AI systems/i, "unsupported three-year AI systems claim remains");
forbid("BRAND-VOICE.md", /Researcher[^\n]{0,20}Educator[^\n]{0,20}Builder/i, "Builder remains in Isaac's compressed identity");
forbid("BRAND-VOICE.md", /I remember sitting with a teacher in Rio/i, "fabricated first-person memory remains");

forbid("DESIGN-SYSTEM.md", /Builder energy/i, "obsolete Builder energy semantics remain");
forbid("DESIGN-SYSTEM.md", /builder\/code register/i, "obsolete builder/code register remains");
forbid("DESIGN-SYSTEM.md", /Default CTA:\s*["“]?Let's co-create/i, "co-create remains documented as a default CTA");
forbid("tokens/membrane.tokens.json", /Builder energy/i, "obsolete Builder energy token description remains");

for (const file of ["components/card/README.md", "examples/article.html"]) {
  forbid(file, /How 3,000 educators co-designed their own assistant\./i, "unsupported portfolio-like metric remains in sample content");
}
forbid("components/button/README.md", /Builders' Lab/i, "obsolete Builder sample identity remains");
forbid("components/button/README.md", /write labels as verbs in the brand voice:\s*["“]?Let's co-create/i, "co-create remains privileged as a generic button example");

if (errors.length) {
  console.error("Verbal System v2 guard failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("✓ Verbal System v2 authority, factuality and sample-safety guard passed");
