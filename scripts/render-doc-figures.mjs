/**
 * Renders the report figures (docs/figures/src/*.html, built from
 * membrane.css itself) to PNG at 2× in light and dark:
 * docs/figures/idcesares-figure-<name>-<light|dark>.png.
 * Markdown embeds both with <picture>, so GitHub shows the one that matches
 * the reader's theme.
 *
 * Not part of the build: run `npm run render:figures` after changing a
 * figure or anything it shows, and commit the PNGs.
 */
import { chromium } from "@playwright/test";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "docs", "figures", "src");
const OUT = path.join(root, "docs", "figures");
const only = process.argv.slice(2);

const pages = (await readdir(SRC)).filter((f) => f.endsWith(".html") && (!only.length || only.includes(f.replace(/\.html$/, ""))));
// file:// pages need this to load the self-hosted fonts beside membrane.css.
const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });

for (const file of pages) {
  const name = file.replace(/\.html$/, "");
  for (const colorScheme of ["light", "dark"]) {
    const page = await browser.newPage({ viewport: { width: 960, height: 800 }, deviceScaleFactor: 2, colorScheme });
    await page.goto(pathToFileURL(path.join(SRC, file)).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const out = path.join(OUT, `idcesares-figure-${name}-${colorScheme}.png`);
    await page.locator(".fig").screenshot({ path: out, omitBackground: true, animations: "disabled" });
    await page.close();
    console.log(`✓ ${path.relative(root, out)}`);
  }
}
await browser.close();
