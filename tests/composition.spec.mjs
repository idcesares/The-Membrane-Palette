import { test, expect } from "@playwright/test";

test("composition gallery explains and opens each reference", async ({ page }) => {
  await page.goto("/");
  const gallery = page.getByRole("region", { name: "Complete compositions" });
  await expect(gallery.getByRole("article")).toHaveCount(6);
  for (const name of ["Workshop", "Research explainer", "Presentation", "Resource explorer", "Form journey", "Visual language"]) {
    const card = gallery.getByRole("article").filter({ has: page.getByRole("heading", { name, exact: true }) });
    await expect(card.getByRole("img")).toBeVisible();
    await expect(card.getByRole("link", { name: `View ${name.toLowerCase()}` })).toHaveAttribute("href", /examples\/.+\.html$/);
    await expect(card.getByRole("link", { name: `Source for ${name.toLowerCase()}` })).toHaveAttribute("href", /github\.com\/.+\/blob\/master\/examples\/.+\.html$/);
  }
  await gallery.getByRole("link", { name: "View workshop", exact: true }).click();
  await expect(page).toHaveURL(/\/examples\/workshop(?:\.html)?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Start with a question from your classroom.");
});

for (const scheme of ["light", "dark"]) {
  test(`gallery thumbnails follow the ${scheme} theme and manual override`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await page.goto("/");
    const gallery = page.getByRole("region", { name: "Complete compositions" });
    await gallery.scrollIntoViewIfNeeded();
    const images = gallery.getByRole("img");
    await expect(images).toHaveCount(6);
    for (const img of await images.all()) await expect(img).toHaveAttribute("src", new RegExp(`-${scheme}\\.png$`));
    await page.getByRole("button", { name: "Dark mode", exact: true }).click();
    const opposite = scheme === "light" ? "dark" : "light";
    await expect(images).toHaveCount(6);
    for (const img of await images.all()) await expect(img).toHaveAttribute("src", new RegExp(`-${opposite}\\.png$`));
  });
}

for (const name of ["workshop", "research-explainer"]) {
  test(`${name} respects the reader's A4 portrait print settings`, async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Playwright PDF output is Chromium-only");
    await page.goto(`/examples/${name}.html`);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".composition-header")).toBeVisible();
    const pdf = await page.pdf({ format: "A4", preferCSSPageSize: true });
    const boxes = [...pdf.toString("latin1").matchAll(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/g)];
    expect(boxes.length).toBeGreaterThan(0);
    for (const box of boxes) {
      // Chromium rounds physical paper dimensions to device units.
      expect(Math.abs(Number(box[1]) - 595.28)).toBeLessThan(2);
      expect(Math.abs(Number(box[2]) - 841.89)).toBeLessThan(2);
    }
  });
}

test("presentation links follow the complete six-canvas argument", async ({ page }) => {
  await page.goto("/examples/presentation.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Keep the question in view.");
  const slides = page.locator(".composition-slide");
  await expect(slides).toHaveCount(6);
  await page.getByRole("link", { name: "Read the question" }).click();
  await expect(page).toHaveURL(/#question$/);
  await page.getByRole("link", { name: "Return to the opening" }).click();
  await expect(page).toHaveURL(/#opening$/);
});

test("presentation reflows with enlarged text instead of clipping it", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/examples/presentation.html");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".composition-slide")).toHaveCount(6);
  const clipped = await page.locator(".composition-slide").evaluateAll((slides) => slides
    .filter((el) => el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight)
    .map((el) => el.id));
  expect(clipped).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

for (const name of ["workshop", "research-explainer"]) {
  test(`${name} stays readable at 360px with enlarged text`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto(`/examples/${name}.html`);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
}

test("presentation prints six complete landscape pages", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Playwright PDF output is Chromium-only");
  await page.goto("/examples/presentation.html");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".composition-slide")).toHaveCount(6);
  await page.emulateMedia({ media: "print" });
  const clipped = await page.locator(".composition-slide").evaluateAll((slides) => slides
    .filter((el) => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)
    .map((el) => el.id));
  expect(clipped).toEqual([]);
  const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
  expect(pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)).toHaveLength(6);
});
