/** Manual previews of the live exemplars; not visual regression baselines. */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "docs", "composition", "previews");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
try {
  for (const name of ["workshop", "research-explainer", "presentation", "resource-explorer", "form-journey", "visual-language"]) {
    for (const colorScheme of ["light", "dark"]) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme });
      try {
        await page.goto(pathToFileURL(path.join(root, "examples", `${name}.html`)).href, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        // Full-page previews include below-the-fold artwork, including lazy images.
        await page.evaluate(async () => {
          const images = [...document.images];
          for (const img of images) img.loading = "eager";
          await Promise.all(images.map(img => img.decode()));
        });
        if (name === "presentation") {
          const slides = page.locator(".composition-slide");
          for (let i = 0; i < await slides.count(); i++) {
            await slides.nth(i).screenshot({ path: path.join(output, `${name}-${i + 1}-${colorScheme}.png`), animations: "disabled" });
          }
          await slides.first().screenshot({ path: path.join(output, `${name}-${colorScheme}.png`), animations: "disabled" });
        } else {
          await page.screenshot({ path: path.join(output, `${name}-${colorScheme}.png`), animations: "disabled" });
        }
        await page.setViewportSize({ width: 360, height: 780 });
        await page.screenshot({ path: path.join(output, `${name}-phone-${colorScheme}.png`), fullPage: true, animations: "disabled" });
        console.log(`✓ ${name} (${colorScheme}): desktop + phone`);
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
