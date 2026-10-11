// Motion contract: enter/exit asymmetry, reduced motion that reduces
// (loaders keep signalling, surfaces stop moving), and hover effects that
// only exist where a pointer can hover.
import { test, expect } from "@playwright/test";

const EASE_OUT = "cubic-bezier(0, 0, 0.2, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
const style = (locator, prop, pseudo = null) =>
  locator.evaluate((el, [p, ps]) => getComputedStyle(el, ps).getPropertyValue(p), [prop, pseudo]);

test.describe("full motion", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
  });

  test("dialog enters with ease-out and leaves faster with ease-in", async ({ page }) => {
    const dialog = page.locator("#dialog-publish");
    expect(await style(dialog, "transition-timing-function")).toContain(EASE_IN);
    expect(await style(dialog, "transition-duration")).toContain("0.15s");
    await page.click('[commandfor="dialog-publish"][command="show-modal"]');
    expect(await style(dialog, "transition-timing-function")).toContain(EASE_OUT);
    expect(await style(dialog, "transition-duration")).toContain("0.25s");
  });

  test("menu enters with ease-out", async ({ page }) => {
    await page.click('[popovertarget="menu-workshop"]');
    expect(await style(page.locator("#menu-workshop"), "transition-timing-function")).toContain(EASE_OUT);
  });

  test("loaders loop on the --duration-loop token", async ({ page }) => {
    expect(await style(page.locator(".mp-spinner").first(), "animation-name")).toBe("mp-spinner-rotate");
    expect(await style(page.locator(".mp-spinner").first(), "animation-duration")).toBe("0.8s");
    expect(await style(page.locator(".mp-skeleton").first(), "animation-duration")).toBe("1.6s");
  });

  test("dismissed toast plays its exit, then leaves the DOM", async ({ page }) => {
    await page.click('[data-mp-toast="Link copied"]');
    const toast = page.locator(".mp-toast-region:not([data-placement]) .mp-toast");
    await expect(toast).toBeVisible();
    await toast.locator(".mp-toast__close").click();
    await expect(toast).toHaveAttribute("data-leaving", "");
    await expect(toast).toHaveCount(0);
  });

  test("clickable card lifts on hover", async ({ page }) => {
    test.skip(!(await page.evaluate(() => matchMedia("(hover: hover)").matches)), "no hover-capable pointer in this browser");
    const card = page.locator("#component-card .mp-card:has(.mp-card__link)").first();
    await card.hover();
    await expect.poll(() => style(card, "transform")).not.toBe("none");
  });
});

test.describe("reduced motion", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
  });

  test("component transitions are instant", async ({ page }) => {
    expect(await style(page.locator(".mp-button").first(), "transition-duration")).toMatch(/^0s/);
    expect(await style(page.locator("#dialog-publish"), "transition-duration")).toMatch(/^0s/);
  });

  test("loaders pulse instead of moving — never a frozen frame", async ({ page }) => {
    expect(await style(page.locator(".mp-spinner").first(), "animation-name")).toBe("mp-progress-pulse");
    expect(await style(page.locator(".mp-skeleton").first(), "animation-name")).toBe("mp-skeleton-pulse");
    expect(await style(page.locator(".mp-progress:indeterminate").first(), "animation-name")).toBe("mp-progress-pulse");
    expect(await style(page.locator(".mp-spinner").first(), "animation-iteration-count")).toBe("infinite");
  });

  test("surfaces don't lift", async ({ page }) => {
    const card = page.locator("#component-card .mp-card:has(.mp-card__link)").first();
    await card.hover();
    expect(await style(card, "transform")).toBe("none");
  });

  test("the base.css safety net still stops non-library animation", async ({ page }) => {
    const duration = await page.evaluate(() => {
      const el = document.createElement("div");
      el.style.animation = "spin 2s linear infinite";
      document.body.append(el);
      const d = getComputedStyle(el).animationDuration;
      el.remove();
      return d;
    });
    expect(parseFloat(duration)).toBeLessThan(0.001);
  });
});

test.describe("touch screens", () => {
  test.skip(({ browserName }) => browserName === "firefox", "Playwright has no mobile emulation for Firefox");
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test("a tap doesn't leave a hover fill stuck on the button", async ({ page }) => {
    await page.goto("/");
    const button = page.locator("#component-button .mp-button").first();
    const rest = await style(button, "background-color");
    await button.tap();
    expect(await style(button, "background-color")).toBe(rest);
  });

  test("compact buttons grow to the 44px touch target", async ({ page }) => {
    await page.goto("/");
    const small = page.getByRole("button", { name: "Small", exact: true }).first();
    await small.scrollIntoViewIfNeeded();
    const box = await small.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
  });
});
