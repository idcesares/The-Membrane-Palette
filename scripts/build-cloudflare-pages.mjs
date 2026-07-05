import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const siteUrl = "https://membrane-palette.dcesares.dev/";

// Always regenerate tokens before building so dist is never stale.
console.log("Building tokens from source…");
execSync("node scripts/build-tokens.mjs", { cwd: root, stdio: "inherit" });

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const showcaseHtml = await readFile(path.join(root, "showcase", "index.html"), "utf8");
const deployedHtml = showcaseHtml
  .replaceAll("../tokens/", "tokens/")
  .replaceAll("../DESIGN-SYSTEM.md", "DESIGN-SYSTEM.md");

await writeFile(path.join(dist, "index.html"), deployedHtml);
// Copy the full tokens/ folder — includes both generated CSS files and the JSON source.
await cp(path.join(root, "tokens"), path.join(dist, "tokens"), { recursive: true });
await cp(path.join(root, "DESIGN-SYSTEM.md"), path.join(dist, "DESIGN-SYSTEM.md"));
await writeFile(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`
);
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}</loc>\n  </url>\n</urlset>\n`
);
