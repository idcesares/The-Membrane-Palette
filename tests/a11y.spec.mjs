// Accessibility: axe-core on every page in both themes, plus layout checks
// that axe doesn't cover (horizontal overflow on a phone, console errors).
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");
const PAGES = ["/", "/examples/starter.html", "/examples/article.html", "/examples/dashboard.html", "/404.html"];

for (const path of PAGES) {
  for (const colorScheme of ["light", "dark"]) {
    test(`axe: ${path} (${colorScheme})`, async ({ page }) => {
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.emulateMedia({ colorScheme });
      await page.goto(path);
      await page.addScriptTag({ content: axeSource });
      const violations = await page.evaluate(async () =>
        (await window.axe.run(document, { resultTypes: ["violations"] })).violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
        }))
      );
      expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }

  test(`no horizontal overflow on a phone: ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
