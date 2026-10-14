import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const version = "2.2.0";

async function json(file, mutate) {
  const target = path.join(root, file);
  const value = JSON.parse(await readFile(target, "utf8"));
  mutate(value);
  await writeFile(target, JSON.stringify(value, null, 2) + "\n");
}

async function text(file, mutate) {
  const target = path.join(root, file);
  const before = await readFile(target, "utf8");
  const after = mutate(before);
  if (after === before) return;
  await writeFile(target, after);
}

function swapOrAlready(source, before, after, label) {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label}: expected source text not found`);
  return source.replace(before, after);
}

await json("package.json", (pkg) => { pkg.version = version; });
await json("package-lock.json", (lock) => {
  lock.version = version;
  if (!lock.packages?.[""]) throw new Error("package-lock.json: root package entry missing");
  lock.packages[""].version = version;
});
await json("tokens/membrane.tokens.json", (tokens) => { tokens.$version = version; });

await text("README.md", (source) =>
  swapOrAlready(
    source,
    "https://img.shields.io/badge/version-2.1.0-B35530?style=flat-square\" alt=\"Version 2.1.0",
    "https://img.shields.io/badge/version-2.2.0-B35530?style=flat-square\" alt=\"Version 2.2.0",
    "README version badge"
  )
);

await text("DESIGN-SYSTEM.md", (source) =>
  swapOrAlready(
    source,
    "> **Version 2.1 · October 2026**",
    "> **Version 2.2 · October 2026**",
    "DESIGN-SYSTEM version header"
  )
);

await text("docs/RELEASING.md", (source) => {
  source = source.replace(/git tag -a v2\.1\.0 -m "v2\.1\.0"/g, 'git tag -a v2.2.0 -m "v2.2.0"');
  source = source.replace(/git push origin v2\.1\.0/g, "git push origin v2.2.0");
  source = source.replace(/The-Membrane-Palette@2\.1\.0\/membrane\.css/g, "The-Membrane-Palette@2.2.0/membrane.css");
  return source;
});

await text("CHANGELOG.md", (source) => {
  if (source.includes("## [2.2.0] — 2026-10-14")) return source;
  const old = `## [Unreleased]\n\n### Changed\n\n- **Brand marks in interfaces (\`DESIGN-SYSTEM.md\` §10.6, new).** The navbar brand on Isaac's own sites is now the \`dc\` monogram instead of the compact wordmark: it is the only mark that shows both registers, it matches the favicon, and it doesn't repeat the name the page title already gives. The compact wordmark moves to the footer sign-off and to co-branded headers. §10.6 also documents inlining the SVG with the action tokens so the monogram rethemes in dark mode, the accessible name on the link, and minimum sizes. §10.1–10.3 and §11.1 updated to match. Guidance only: no token, class or file changed.\n\n---`;
  const next = `## [Unreleased]\n\n---\n\n## [2.2.0] — 2026-10-14\n\n### Why\n\nThe visual and component system had matured faster than the verbal layer. Brand voice, mutable biography and interface guidance lived together, so outdated or illustrative copy could be interpreted by agents as factual identity. v2.2 separates those responsibilities and makes the boundary machine-checkable without changing the public component or token API.\n\n### Added\n\n- **Verbal System v2 authorities:** \`PROFILE.md\` for factual identity, \`VOICE.md\` for observed communication behavior and adaptive registers, and a reduced \`BRAND-VOICE.md\` for public-brand application.\n- **Writing-evidence classes:** \`OBSERVED\`, \`APPROVED\` and \`ILLUSTRATIVE\`, with an explicit rule that writing examples never become biographical evidence by inference.\n- **Automated verbal guard:** \`npm run check:verbal\` and CI enforcement for authority discovery, current role/academic wording, obsolete Builder semantics, unsupported biographical claims and misleading sample content.\n\n### Changed\n\n- **Public identity:** \`Researcher · Educator · Developer\` / \`Pesquisador · Educador · Desenvolvedor\`. \`Builder\` is no longer a personal identity label; technical/aesthetic uses are described as making, technical craft, code or development according to context.\n- **Stable voice, adaptive register:** institutional, academic, teaching, developer, social and informal writing now share one voice while adapting density, formality and vocabulary to the audience.\n- **Agent contract:** \`llms.txt\`, \`AGENTS.md\`, \`CLAUDE.md\`, the README and \`DESIGN-SYSTEM.md\` distinguish factual, verbal, brand and UI authority and explicitly prohibit inferring biography from examples.\n- **Interface copy:** buttons default to concrete action labels; \`Let's co-create\` / \`Vamos cocriar?\` remains optional campaign language rather than a universal CTA.\n- **Sample safety:** portfolio-like demo copy is explicitly fictional/neutral where no verified case exists; generated manifest/showcase content follows the source examples.\n- **Design semantics:** Amber's description is now \`Making energy\`; the code register is described as technical craft rather than Builder identity. No token name, component class or attribute changed.\n- **Brand marks in interfaces:** the navbar brand on Isaac's own sites uses the \`dc\` monogram; the compact wordmark signs the footer and co-branded headers. \`DESIGN-SYSTEM.md\` §10.6 documents theming, accessible naming and minimum sizes.\n\n### Fixed\n\n- Removed unsupported/outdated brand-copy claims that could imply a director-level Sesc title, a completed UFRJ master's degree, invented durations of AI specialization or fabricated first-person memories.\n- Corrected the coupling that allowed brand examples to act as de facto biography for AI agents.\n\n---`;
  if (!source.includes(old)) throw new Error("CHANGELOG.md: expected Unreleased section not found");
  return source.replace(old, next);
});

console.log(`✓ Prepared Verbal System v2 release metadata for ${version}`);
