// Visual regression: every rendered example in the showcase gallery, in
// light and dark, compared with committed baselines. axe and the lints
// can't see a padding, radius or color drifting; this can.
//
// Runs as the "visual" project inside the canonical Playwright container
// (CI's `visual` job): pixels depend on the font rasterizer, so baselines
// recorded on another machine differ by a pixel per glyph. After an
// intended visual change CI uploads fresh baselines as the
// `visual-baselines` artifact: review the diff (`playwright-visual`), then
// commit them. Or record them yourself in the same image:
//   docker run --rm -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.56.1-noble sh -c "npm ci && npm run test:visual -- --update-snapshots"
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(new URL("../components/manifest.json", import.meta.url), "utf8"));

for (const { slug } of manifest.components) {
  for (const colorScheme of ["light", "dark"]) {
    test(`${slug} (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const stages = page.locator(`#component-${slug} .gallery-example__stage`);
      const count = await stages.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i += 1) {
        await expect(stages.nth(i)).toHaveScreenshot(`${slug}-${i + 1}-${colorScheme}.png`, {
          animations: "disabled",
          caret: "hide",
          maxDiffPixelRatio: 0.01,
        });
      }
    });
  }
}
