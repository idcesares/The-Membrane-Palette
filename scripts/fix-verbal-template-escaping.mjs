import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "scripts", "build-components.mjs");
let source = await readFile(file, "utf8");

const plain = "- For claims about Isaac, read `PROFILE.md`; for writing behavior and register adaptation, read `VOICE.md`; for public brand expression, read `BRAND-VOICE.md`; for visual/UI behavior, read `DESIGN-SYSTEM.md`. Never infer biography from examples.";
const escaped = "- For claims about Isaac, read \\`PROFILE.md\\`; for writing behavior and register adaptation, read \\`VOICE.md\\`; for public brand expression, read \\`BRAND-VOICE.md\\`; for visual/UI behavior, read \\`DESIGN-SYSTEM.md\\`. Never infer biography from examples.";

if (source.includes(escaped)) {
  console.log("✓ llms template authority filenames already escaped");
} else if (source.includes(plain)) {
  source = source.replace(plain, escaped);
  await writeFile(file, source);
  console.log("✓ Escaped authority filenames inside llms template literal");
} else {
  console.error("Expected verbal authority line not found in scripts/build-components.mjs");
  process.exit(1);
}
