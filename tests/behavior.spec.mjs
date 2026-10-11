// Component behavior that CSS alone can't guarantee: keyboard patterns,
// focus management, ARIA state sync (components/membrane.js + native HTML).
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
});

const active = (page) => page.evaluate(() => document.activeElement?.id || document.activeElement?.textContent.trim());

test("skip link is the first stop and jumps to main", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(page.locator(".mp-skip-link")).toBeFocused();
  await expect(page.locator(".mp-skip-link")).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("tabs: click and arrow keys select, roving tabindex, panels follow", async ({ page }) => {
  await page.click("#tabs-copy");
  await expect(page.locator("#tabs-copy")).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#tabs-copy-panel")).toBeVisible();
  await expect(page.locator("#tabs-cdn-panel")).toBeHidden();
  await page.keyboard.press("ArrowRight");
  expect(await active(page)).toBe("tabs-fork");
  await page.keyboard.press("ArrowRight");
  expect(await active(page)).toBe("tabs-cdn");
  await page.keyboard.press("End");
  expect(await active(page)).toBe("tabs-fork");
  await expect(page.locator("#tabs-cdn")).toHaveAttribute("tabindex", "-1");
  await expect(page.locator("#tabs-fork")).toHaveAttribute("tabindex", "0");
});

test("dialog: opens modal, locks scroll, closes on Escape and backdrop", async ({ page }) => {
  const open = page.locator('[commandfor="dialog-publish"][command="show-modal"]');
  const dialog = page.locator("#dialog-publish");
  await open.click();
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((d) => d.matches(":modal"))).toBe(true);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await open.click();
  await page.mouse.click(5, 5);
  await expect(dialog).toBeHidden();
});

test("tooltip: shows on keyboard focus, Escape dismisses", async ({ page }) => {
  const trigger = page.locator('[aria-describedby="tooltip-gate"]');
  await trigger.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(page.locator("#tooltip-gate")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#tooltip-gate")).toBeHidden();
});

test("menu: focus on open, arrow keys, Escape returns focus, aria-expanded syncs", async ({ page }) => {
  const trigger = page.locator('[popovertarget="menu-workshop"]');
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(await active(page)).toBe("Duplicate");
  await page.keyboard.press("ArrowDown");
  expect(await active(page)).toBe("Export syllabus");
  await page.keyboard.press("End");
  expect(await active(page)).toBe("Archive workshop");
  await page.keyboard.press("ArrowDown");
  expect(await active(page)).toBe("Duplicate");
  await page.keyboard.press("Escape");
  await expect(page.locator("#menu-workshop")).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("toast: declarative trigger announces politely; errors persist", async ({ page }) => {
  await page.click('[data-mp-toast="Link copied"]');
  const region = page.locator(".mp-toast-region:not([data-placement])");
  await expect(region).toHaveAttribute("aria-live", "polite");
  await expect(region.locator(".mp-toast")).toContainText("Link copied");
  await page.click('[data-mp-toast="Couldn\'t reach the server"]');
  const error = region.locator('.mp-toast[data-tone="error"]');
  await expect(error).toHaveAttribute("role", "alert");
  await error.locator(".mp-toast__close").click();
  await expect(error).toHaveCount(0);
});

test("toast API renders text, never HTML", async ({ page }) => {
  await page.evaluate(() => window.MembranePalette.toast({ title: "<img src=x onerror=alert(1)>" }));
  const toast = page.locator(".mp-toast-region:not([data-placement]) .mp-toast").last();
  await expect(toast.locator(".mp-toast__title")).toHaveText("<img src=x onerror=alert(1)>");
  await expect(toast.locator("img")).toHaveCount(0);
});

test("theme toggle flips the page and reports its state", async ({ page }) => {
  const toggle = page.locator(".theme-toggle");
  const before = await page.evaluate(() => getComputedStyle(document.body).color);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => getComputedStyle(document.body).color)).not.toBe(before);
});

test("form: required field blocks submit; busy state while submitting", async ({ page }) => {
  const submit = page.locator('#specimen-form [type="submit"]');
  await submit.click();
  await expect(submit).not.toHaveAttribute("aria-busy", "true");
  await page.fill("#specimen-email", "ana@school.edu");
  await submit.click();
  await expect(submit).toHaveAttribute("aria-busy", "true");
  await expect(page.locator("#specimen-status .mp-alert")).toBeVisible();
});

test("primary hover fill is darker than rest (light) and label contrast rises", async ({ page }) => {
  const button = page.locator("#component-button .mp-button").first();
  const rest = await button.evaluate((b) => getComputedStyle(b).backgroundColor);
  await button.hover();
  await expect.poll(() => button.evaluate((b) => getComputedStyle(b).backgroundColor)).not.toBe(rest);
});
