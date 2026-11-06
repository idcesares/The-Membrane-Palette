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
execSync("node scripts/render-visual-assets.mjs", { cwd: root, stdio: "inherit" });
execSync("node scripts/build-components.mjs", { cwd: root, stdio: "inherit" });

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

// The showcase links one level up (../tokens/, ../components/…) so it works
// straight from the repo; in dist those folders sit beside index.html.
const showcaseHtml = await readFile(path.join(root, "showcase", "index.html"), "utf8");
const deployedHtml = showcaseHtml.replace(/(href|src)="\.\.\//g, '$1="');
await writeFile(path.join(dist, "index.html"), deployedHtml);

// Served for any missing path, so its links must be root-relative.
const notFoundHtml = await readFile(path.join(root, "showcase", "404.html"), "utf8");
await writeFile(path.join(dist, "404.html"), notFoundHtml.replace(/(href|src)="\.\.\//g, '$1="/'));
await cp(path.join(root, "showcase", "_headers"), path.join(dist, "_headers"));
await cp(path.join(root, "showcase", "assets"), path.join(dist, "assets"), { recursive: true });

for (const dir of ["tokens", "components", "examples", "fonts", "brand"]) {
  await cp(path.join(root, dir), path.join(dist, dir), { recursive: true });
}
for (const directory of ["composition", "patterns", "accessibility", "visual-language"]) {
  await cp(path.join(root, "docs", directory), path.join(dist, "docs", directory), { recursive: true });
}
// Public test sources make the coverage inventory inspectable without bundling snapshots.
await mkdir(path.join(dist, "tests"), { recursive: true });
for (const file of (await readdir(path.join(root, "tests"))).filter((file) => file.endsWith(".mjs"))) {
  await cp(path.join(root, "tests", file), path.join(dist, "tests", file));
}
for (const file of ["membrane.css", "llms.txt", "PROFILE.md", "VOICE.md", "BRAND-VOICE.md", "DESIGN-SYSTEM.md", "CHANGELOG.md", "CONTRIBUTING.md"]) {
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
  await readFile(path.join(root, "PROFILE.md"), "utf8"),
  await readFile(path.join(root, "VOICE.md"), "utf8"),
  await readFile(path.join(root, "BRAND-VOICE.md"), "utf8"),
  ...(await Promise.all(["README.md", "creative-latitude.md", "rubric.md"].map((file) => readFile(path.join(root, "docs", "composition", file), "utf8")))),
  ...(await Promise.all((await readdir(path.join(root, "docs", "patterns"))).filter((file) => file.endsWith(".md")).sort().map((file) => readFile(path.join(root, "docs", "patterns", file), "utf8")))),
  await readFile(path.join(root, "docs", "accessibility", "README.md"), "utf8"),
  await readFile(path.join(root, "docs", "visual-language", "README.md"), "utf8"),
  ...(await Promise.all(ordered.map((s) => readFile(path.join(root, "components", s, "README.md"), "utf8")))),
  await readFile(path.join(root, "DESIGN-SYSTEM.md"), "utf8"),
];
await writeFile(path.join(dist, "llms-full.txt"), sections.join("\n\n---\n\n"));

await writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`
);
const examplePages = (await readdir(path.join(root, "examples"))).filter((f) => f.endsWith(".html")).sort();
// Source examples point to showcase/index.html; deployment lifts it to /index.html.
for (const file of examplePages) {
  const html = await readFile(path.join(root, "examples", file), "utf8");
  await writeFile(path.join(dist, "examples", file), html.replace(/href="\.\.\/showcase\//g, 'href="../'));
}
const urls = [siteUrl, ...examplePages.map((f) => `${siteUrl}examples/${f}`)];
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>\n`).join("")}</urlset>\n`
);
console.log("✓ Assembled dist/ (showcase, 404, _headers, assets, tokens, components, examples, membrane.css, llms.txt, llms-full.txt)");
