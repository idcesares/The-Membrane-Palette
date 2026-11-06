import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// serve redirects .html paths and drops their query strings.
const example = "/examples/form-journey";
const goal = "Compare two invented explanations of the water cycle.";
const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

async function fillPlan(page) {
  await page.locator("#learning-goal").fill(goal);
  await page.locator("#resource-format").selectOption("activity");
  await page.locator("#review-plan").click();
}

for (const language of ["en", "pt-BR"]) {
  test(`${language}: every form stage remains accessible in both themes`, async ({ page }) => {
    await page.goto(`${example}?lang=${language}`);
    await page.addScriptTag({ content: axeSource });
    const inspect = async (stage) => {
      for (const colorScheme of ["light", "dark"]) {
        await page.emulateMedia({ colorScheme });
        const violations = await page.evaluate(async () => (await window.axe.run(document)).violations.map((violation) => ({ id: violation.id, targets: violation.nodes.map((node) => node.target) })));
        expect(violations, `${language}/${stage}/${colorScheme}`).toEqual([]);
      }
    };
    await inspect("entry");
    await page.locator("#review-plan").click();
    await inspect("validation");
    await fillPlan(page);
    await inspect("review");
    await page.locator("#demo-options").click();
    await page.locator("#fail-next-confirmation").check();
    await page.locator("#confirm-plan").click();
    await expect(page.locator("#failure-message")).toBeVisible();
    await inspect("failure");
    await page.locator("#confirm-plan").click();
    await expect(page.locator("#confirmation-stage")).toBeVisible();
    await inspect("confirmation");
  });
}

for (const language of ["en", "pt-BR"]) {
  test(`${language}: validation links to required fields and preserves entered values`, async ({ page }) => {
    await page.goto(`${example}?lang=${language}&context=example`);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await page.locator("#review-plan").click();
    const summary = page.locator("#error-summary");
    await expect(summary).toBeFocused();
    await expect(summary.getByRole("link")).toHaveCount(2);
    await expect(summary).toContainText(language === "en" ? "Enter a learning goal" : "Escreva um objetivo de aprendizagem");
    await expect(page.locator("#learning-goal")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#learning-goal")).toHaveAttribute("aria-describedby", /goal-hint.*goal-error/);
    await summary.getByRole("link").first().click();
    await expect(page.locator("#learning-goal")).toBeFocused();
    await page.locator("#learning-goal").fill(goal);
    await page.locator("#review-plan").click();
    await expect(summary).toBeFocused();
    await expect(summary.getByRole("link")).toHaveCount(1);
    await expect(page.locator("#learning-goal")).toHaveValue(goal);
    await expect(page.locator("#learning-goal")).not.toHaveAttribute("aria-invalid", "true");
    await summary.getByRole("link").click();
    await expect(page.locator("#resource-format")).toBeFocused();
    await page.locator("#resource-format").selectOption("activity");
    await page.locator("#review-plan").click();
    await expect(page.locator("#review-title")).toBeFocused();
    await expect(page.locator("#review-goal")).toHaveText(goal);
    await expect(page.locator("#review-format")).toHaveText(language === "en" ? "Activity" : "Atividade");
    await page.locator("#edit-goal").click();
    await expect(page.locator("#learning-goal")).toBeFocused();
    await expect(page.locator("#learning-goal")).toHaveValue(goal);
    await expect(page.locator("#resource-format")).toHaveValue("activity");
  });
}

test("language changes retain validation, values, stage, focus and other query parameters", async ({ page }) => {
  await page.goto(`${example}?context=example`);
  await page.locator("#learning-goal").fill(goal);
  await page.locator("#review-plan").click();
  await page.locator("#journey-language").focus();
  await page.locator("#journey-language").selectOption("pt-BR");
  await expect(page.locator("#journey-language")).toBeFocused();
  await expect(page.locator("#format-error")).toHaveText("Escolha um formato para o recurso.");
  await expect(page.locator("#error-summary")).toBeVisible();
  await expect(page.locator("#learning-goal")).toHaveValue(goal);
  await expect(page).toHaveURL(/context=example.*lang=pt-BR/);
  await expect(page).toHaveTitle(/Planeje um recurso de aprendizagem/);
  await page.locator("#resource-format").selectOption("checklist");
  await page.locator("#review-plan").click();
  await page.locator("#journey-language").focus();
  await page.locator("#journey-language").selectOption("en");
  await expect(page.locator("#journey-language")).toBeFocused();
  await expect(page.locator("#review-stage")).toBeVisible();
  await expect(page.locator("#review-format")).toHaveText("Checklist");
  await expect(page.locator("#review-goal")).toHaveText(goal);
  await page.locator("#edit-format").click();
  await expect(page.locator("#resource-format")).toBeFocused();
  await expect(page.locator("#resource-format")).toHaveValue("checklist");
});

test("local failure retains the review, retry completes once, and no information leaves the tab", async ({ page }) => {
  const externalRequests = [];
  const submissionRequests = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://localhost:4173") externalRequests.push(request.url());
    if (["fetch", "xhr"].includes(request.resourceType()) || request.method() !== "GET") submissionRequests.push(request.url());
  });
  await page.goto(example);
  await page.locator("#demo-options").click();
  await page.locator("#fail-next-confirmation").check();
  await fillPlan(page);
  await page.locator("#confirm-plan").click();
  await expect(page.locator("#confirm-plan")).toHaveAttribute("aria-busy", "true");
  await expect(page.locator("#journey-status")).toContainText("Simulating confirmation");
  await page.locator("#confirm-plan").evaluate((button) => { button.click(); button.click(); });
  await page.locator("#journey-language").focus();
  await page.locator("#journey-language").selectOption("pt-BR");
  await expect(page.locator("#failure-message")).toBeVisible();
  await expect(page.locator("#failure-message")).toContainText("A simulação foi interrompida");
  await expect(page.locator("#journey-language")).toBeFocused();
  await expect(page.locator("#review-goal")).toHaveText(goal);
  await expect(page.locator("#confirm-plan")).toHaveText("Tentar novamente");
  await page.locator("#confirm-plan").click();
  await page.locator("#confirm-plan").evaluate((button) => { button.click(); button.click(); });
  await expect(page.locator("#confirmation-title")).toBeFocused();
  await expect(page.locator("#confirmation-stage")).toBeVisible();
  await expect(page.locator("#confirmation-goal")).toHaveText(goal);
  await expect(page.locator("#confirmation-note")).toContainText("Nenhuma informação foi enviada");
  await page.locator("#journey-language").focus();
  await page.locator("#journey-language").selectOption("en");
  await expect(page.locator("#journey-language")).toBeFocused();
  await expect(page.locator("#confirmation-title")).toHaveText("Example plan confirmed in this tab");
  await expect(page.locator("#confirmation-stage")).toBeVisible();
  await expect(page.locator("#review-stage")).toBeHidden();
  await expect(page.locator("#confirmation-stage")).toHaveCount(1);
  expect(externalRequests).toEqual([]);
  expect(submissionRequests).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});

for (const colorScheme of ["light", "dark"]) {
  test(`${colorScheme}: validation summary keeps readable error links`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto(example);
    await page.locator("#review-plan").click();
    await page.addScriptTag({ content: axeSource });
    const violations = await page.evaluate(async () =>
      (await window.axe.run(document, { runOnly: ["color-contrast"], resultTypes: ["violations"] }))
        .violations.map((violation) => ({ id: violation.id, targets: violation.nodes.map((node) => node.target) }))
    );
    expect(violations).toEqual([]);
  });

  test(`${colorScheme}: keyboard journey reflows at 360px and 200% text`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
    await page.goto(`${example}?lang=pt-BR`);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await page.locator("#learning-goal").focus();
    await page.keyboard.type(goal);
    await page.keyboard.press("Tab");
    await expect(page.locator("#resource-format")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Tab");
    await expect(page.locator("#review-plan")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#review-title")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator("#edit-goal")).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await page.locator("#confirm-plan").click();
    await expect(page.locator("#confirmation-title")).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
}
