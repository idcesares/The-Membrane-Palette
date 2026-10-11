// Visual regression: every rendered example in the showcase gallery, in
// light and dark, compared with committed baselines. axe and the lints
// can't see a padding, radius or color drifting; this can.
//
// Chromium only (see playwright.config.mjs). After an intended visual
// change, review the diff in the HTML report, then refresh the baselines:
//   npx playwright test tests/visual.spec.mjs --update-snapshots
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
