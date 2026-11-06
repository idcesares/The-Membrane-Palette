import { test, expect } from "@playwright/test";

test("visual specimen connects its examples to standalone asset downloads", async ({ page, request }) => {
  await page.goto("/examples/visual-language.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Leave room for the human.");
  for (const id of ["opening", "presentation-cover", "teaching-card", "arrangements", "asset-library"]) await expect(page.locator(`#${id}`)).toBeVisible();
  const response = await request.get("/brand/visuals/catalog.json");
  expect(response.ok()).toBe(true);
  const catalog = await response.json();
  for (const asset of catalog.assets) {
    for (const theme of ["light", "dark"]) {
      const href = `../brand/visuals/${asset.files[theme]}`;
      await expect(page.locator(`a[href="${href}"][download]`)).toHaveCount(1);
      const download = await request.get(`/brand/visuals/${asset.files[theme]}`);
      expect(download.ok()).toBe(true);
      expect(download.headers()["content-type"]).toContain("image/svg+xml");
    }
  }
  for (const img of await page.locator("main img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  }
});

test("visual art follows OS theme while the dark cover retains matching artwork", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/examples/visual-language.html");
  await expect.poll(() => page.locator("#opening-art").evaluate(img => img.currentSrc)).toMatch(/passage-light\.svg$/);
  await expect(page.locator("#cover-art")).toHaveAttribute("src", /confluence-dark\.svg$/);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect.poll(() => page.locator("#opening-art").evaluate(img => img.currentSrc)).toMatch(/passage-dark\.svg$/);
  await expect(page.locator("#cover-art")).toHaveAttribute("src", /confluence-dark\.svg$/);
});

test("printed cover retains its dark surface and matching artwork", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/examples/visual-language.html");
  const cover = page.locator(".composition-visual-cover");
  const screenBackground = await cover.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.emulateMedia({ media: "print" });
  await expect(cover).toHaveCSS("background-color", screenBackground);
  await expect(page.locator("#cover-art")).toHaveAttribute("src", /confluence-dark\.svg$/);
});

test("printed artwork matches the light paper surface even with a dark OS theme", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/examples/visual-language.html");
  await page.emulateMedia({ media: "print" });
  await expect.poll(() => page.locator("#opening-art").evaluate(img => img.currentSrc)).toMatch(/passage-light\.svg$/);
});

for (const colorScheme of ["light", "dark"]) {
  test(`visual specimen retains its content at 360px and 200% text (${colorScheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/examples/visual-language.html");
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    const clipped = await page.locator(".composition-visual-cover, .composition-teaching-card").evaluateAll(elements => elements.filter(el => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1).map(el => el.id));
    expect(clipped).toEqual([]);
    await expect(page.getByRole("link", { name: "Explore the visual vocabulary" })).toBeVisible();
  });
}
