/**
 * Renders the 1200×630 social preview (og:image) from the live tokens and
 * components, so the card always matches the system. Not part of the build:
 * run `npm run render:social` after a visual change and commit the PNG.
 */
import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "showcase", "assets", "idcesares-social-design-system-og.png");
const css = await readFile(path.join(root, "membrane.css"), "utf8");
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

const swatches = ["--color-terracotta", "--color-amber", "--color-burgundy", "--color-neutral-300", "--color-teal", "--color-charcoal"];

const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Instrument+Sans:wght@400;600&family=JetBrains+Mono:wght@500&display=block" rel="stylesheet">
<style>${css}</style>
<style>
  html, body { width: 1200px; height: 630px; margin: 0; }
  body { display: grid; grid-template-rows: 1fr auto; padding: 72px 80px 64px; box-sizing: border-box;
         background: var(--color-bg-primary); }
  .kicker { font: 500 22px/1 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-accent); margin: 0 0 28px; }
  h1 { font: 700 96px/1.02 var(--font-serif); letter-spacing: -0.02em; margin: 0 0 28px; color: var(--color-text-primary); }
  h1 span { color: var(--color-action-primary); }
  .lede { font: 400 30px/1.4 var(--font-sans); color: var(--color-text-secondary); margin: 0; max-width: 30ch; }
  .foot { display: flex; align-items: center; justify-content: space-between; }
  .swatches { display: flex; }
  .swatches i { width: 56px; height: 56px; border-radius: 50%; margin-inline-end: -12px; border: 3px solid var(--color-bg-primary); }
  .meta { font: 500 22px/1 var(--font-mono); color: var(--color-text-secondary); }
</style>
</head>
<body>
  <div>
    <p class="kicker">Design system · v${pkg.version}</p>
    <h1>The Membrane <span>Palette</span></h1>
    <p class="lede">Tokens and a framework-free CSS component library where human warmth meets digital precision.</p>
  </div>
  <div class="foot">
    <div class="swatches">${swatches.map((v) => `<i style="background: var(${v})"></i>`).join("")}</div>
    <p class="meta">membrane-palette.dcesares.dev</p>
  </div>
</body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await writeFile(OUT, await page.screenshot({ type: "png" }));
await browser.close();
console.log(`✓ Wrote ${path.relative(root, OUT)}`);
