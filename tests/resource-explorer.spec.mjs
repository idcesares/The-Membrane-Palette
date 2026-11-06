import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const axe = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

test("search and topic filters keep the selected resource understandable", async ({ page }) => {
  await page.goto("/examples/resource-explorer.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find a resource. Keep the context.");
  await expect(page.locator("#resource-list > li")).toHaveCount(6);
  await page.getByLabel("Topic", { exact: true }).selectOption("research");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator("#resource-list > li")).toHaveCount(2);
  await page.getByRole("button", { name: "Interpreting a learning trace", exact: true }).click();
  await expect(page.locator("#detail-title")).toHaveText("Interpreting a learning trace");
  await expect(page.locator("#open-resource")).toHaveAttribute("href", "research-explainer.html");
});

test("Portuguese search and language switching preserve filters and selection", async ({ page }) => {
  await page.goto("/examples/resource-explorer?lang=pt-BR");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await page.getByLabel("Buscar recursos", { exact: true }).fill("interpretação");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(page.locator("#resource-list > li")).toHaveCount(1);
  await page.getByRole("button", { name: "Interpretar um registro de aprendizagem", exact: true }).click();
  await page.getByLabel("Idioma / Language").selectOption("en");
  await expect(page.locator("#search-query")).toHaveValue("interpretação");
  await expect(page.locator("#resource-list > li")).toHaveCount(1);
  await expect(page.locator("#detail-title")).toHaveText("Interpreting a learning trace");
});

test("no results and empty collections offer different recovery actions", async ({ page }) => {
  await page.goto("/examples/resource-explorer.html");
  await page.getByLabel("Search resources", { exact: true }).fill("not-a-resource");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator("#empty-title")).toHaveText("No resources match these filters");
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(page.locator("#resource-list > li")).toHaveCount(6);
  await page.getByText("Explore example states", { exact: true }).click();
  await page.getByLabel("Example condition").selectOption("empty");
  await page.getByRole("button", { name: "Load selected sample", exact: true }).click();
  await expect(page.locator("#empty-title")).toHaveText("This sample collection is empty");
  await page.getByRole("button", { name: "Use populated sample", exact: true }).click();
  await expect(page.locator("#resource-list > li")).toHaveCount(6);
});

test("failed refresh preserves results and retry restores the complete sample", async ({ page }) => {
  await page.goto("/examples/resource-explorer.html");
  await page.getByLabel("Topic", { exact: true }).selectOption("teaching");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator("#resource-list > li")).toHaveCount(1);
  await page.getByText("Explore example states", { exact: true }).click();
  await page.getByLabel("Example condition").selectOption("error");
  await page.getByRole("button", { name: "Load selected sample", exact: true }).click();
  await expect(page.locator("#load-error")).toBeVisible();
  await expect(page.locator("#resource-list > li")).toHaveCount(1);
  await page.getByRole("button", { name: "Retry loading", exact: true }).click();
  await expect(page.locator("#load-error")).toBeHidden();
  await expect(page.getByLabel("Topic", { exact: true })).toHaveValue("teaching");
  await expect(page.locator("#resource-list > li")).toHaveCount(1);
});

test("canceling a load prevents a late failure from replacing the previous state", async ({ page }) => {
  await page.goto("/examples/resource-explorer.html");
  await page.clock.install();
  await page.getByText("Explore example states", { exact: true }).click();
  await page.getByLabel("Example condition").selectOption("error");
  await page.getByRole("button", { name: "Load selected sample", exact: true }).click();
  await expect(page.locator("#resource-results")).toHaveAttribute("aria-busy", "true");
  await page.getByRole("button", { name: "Cancel loading", exact: true }).click();
  await page.clock.runFor(1000);
  await expect(page.locator("#load-error")).toBeHidden();
  await expect(page.locator("#resource-list > li")).toHaveCount(6);
  await expect(page.locator("#resource-results")).toHaveAttribute("aria-busy", "false");
});

test("mobile detail navigation and resizing preserve selection and focus", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/examples/resource-explorer.html");
  await page.getByRole("button", { name: "Start from a classroom question", exact: true }).click();
  await expect(page.locator("#resource-browser")).toBeHidden();
  await expect(page.locator("#detail-title")).toBeFocused();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator("#resource-browser")).toBeVisible();
  await expect(page.locator("#detail-title")).toHaveText("Start from a classroom question");
  await page.setViewportSize({ width: 360, height: 780 });
  await page.getByRole("button", { name: "Back to results", exact: true }).click();
  await expect(page.locator("#resource-teaching")).toBeFocused();
  await expect(page.locator("#resource-browser")).toBeVisible();
});

for (const language of ["en", "pt-BR"]) {
  test(`explorer reflows with enlarged ${language} text`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto(`/examples/resource-explorer?lang=${language}`);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await page.locator("#states-summary").click();
    await page.locator("#sample-condition").selectOption("partial");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
}

test("loading remains visible and cancelable while a mobile detail is open", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/examples/resource-explorer.html");
  await page.getByRole("button", { name: "Start from a classroom question", exact: true }).click();
  await page.locator("#states-summary").click();
  await expect(page.locator("#condition-loading")).toHaveText("Loading until canceled");
  await page.locator("#sample-condition").selectOption("loading");
  await page.locator("#load-sample").click();
  await expect(page.locator("#results-status")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel loading", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Cancel loading", exact: true }).click();
  await expect(page.locator("#detail-title")).toHaveText("Start from a classroom question");
  await expect(page.locator("#resource-results")).toHaveAttribute("aria-busy", "false");
});

test("mobile detail keeps failure recovery reachable without losing selection", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/examples/resource-explorer.html");
  await page.locator("#resource-teaching").click();
  await page.locator("#states-summary").click();
  await page.locator("#sample-condition").selectOption("error");
  await page.locator("#load-sample").click();
  await expect(page.locator("#resource-results")).toHaveAttribute("aria-busy", "false");
  await expect(page.locator("#retry-loading")).toBeVisible();
  await page.locator("#retry-loading").click();
  await expect(page.locator("#load-error")).toBeHidden();
  await expect(page.locator("#detail-title")).toHaveText("Start from a classroom question");
  await expect(page.locator("#resource-browser")).toBeHidden();
});

test("keyboard loading preserves its action focus and restores it after cancellation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/examples/resource-explorer.html");
  await page.clock.install({ time: new Date("2026-11-06T12:00:00Z") });
  await page.clock.pauseAt(new Date("2026-11-06T12:00:00Z"));
  await page.locator("#search-button").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#resource-results")).toHaveAttribute("aria-busy", "true");
  await expect(page.locator("#search-button")).toBeFocused();
  await page.clock.runFor(1000);
  await expect(page.locator("#resource-results")).toHaveAttribute("aria-busy", "false");
  await expect(page.locator("#search-button")).toBeFocused();
  await page.locator("#states-summary").click();
  await page.locator("#sample-condition").selectOption("loading");
  await page.locator("#load-sample").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#cancel-loading")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#load-sample")).toBeFocused();
  await expect(page.locator("#resource-results")).toHaveAttribute("aria-busy", "false");
});

for (const [language, colorScheme] of [["en", "light"], ["pt-BR", "dark"]]) {
for (const mode of ["ready", "loading", "partial", "empty", "error"]) {
  test(`explorer ${mode} (${language}, ${colorScheme}) stays accessible`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto(`/examples/resource-explorer?lang=${language}`);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await page.locator("#states-summary").click();
    await page.locator("#sample-condition").selectOption(mode);
    await page.locator("#load-sample").click();
    await expect(page.locator("#resource-results")).toHaveAttribute("aria-busy", String(mode === "loading"));
    if (mode === "partial") await expect(page.locator("#partial-notice")).toBeVisible();
    if (mode === "empty") await expect(page.locator("#empty-state")).toBeVisible();
    if (mode === "error") await expect(page.locator("#load-error")).toBeVisible();
    await page.addScriptTag({ content: axe });
    expect(await page.evaluate(async () => (await window.axe.run(document)).violations.map((v) => v.id))).toEqual([]);
  });
}
}
