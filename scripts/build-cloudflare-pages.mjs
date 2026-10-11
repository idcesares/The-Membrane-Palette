import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const siteUrl = "https://membrane-palette.dcesares.dev/";

// Always regenerate tokens and components before building so dist is never stale.
console.log("Building tokens and components from source…");
execSync("node scripts/build-tokens.mjs", { cwd: root, stdio: "inherit" });
execSync("node scripts/build-components.mjs", { cwd: root, stdio: "inherit" });

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

// The showcase links one level up (../tokens/, ../components/…) so it works
// straight from the repo; in dist those folders sit beside index.html.
const showcaseHtml = await readFile(path.join(root, "showcase", "index.html"), "utf8");
const deployedHtml = showcaseHtml.replace(/(href|src)="\.\.\//g, '$1="');
await writeFile(path.join(dist, "index.html"), deployedHtml);

for (const dir of ["tokens", "components", "examples"]) {
  await cp(path.join(root, dir), path.join(dist, dir), { recursive: true });
}
for (const file of ["membrane.css", "llms.txt", "DESIGN-SYSTEM.md", "BRAND-VOICE.md", "CHANGELOG.md"]) {
  await cp(path.join(root, file), path.join(dist, file));
}

// llms-full.txt: the index plus every doc an agent needs, inlined, so a model
// can load the whole system in one fetch (https://llmstxt.org).
const componentDirs = (await readdir(path.join(root, "components"), { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);
const manifest = JSON.parse(await readFile(path.join(root, "components", "manifest.json"), "utf8"));
const ordered = manifest.components.map((c) => c.slug).filter((s) => componentDirs.includes(s));
const sections = [
  await readFile(path.join(root, "llms.txt"), "utf8"),
  ...(await Promise.all(ordered.map((s) => readFile(path.join(root, "components", s, "README.md"), "utf8")))),
  await readFile(path.join(root, "DESIGN-SYSTEM.md"), "utf8"),
];
await writeFile(path.join(dist, "llms-full.txt"), sections.join("\n\n---\n\n"));

await writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`
);
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}</loc>\n  </url>\n</urlset>\n`
);
console.log("✓ Assembled dist/ (showcase, tokens, components, examples, membrane.css, llms.txt, llms-full.txt)");
