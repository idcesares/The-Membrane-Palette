// Browser tests for the built site (dist/). `npm test` builds first.
//
// `npm test` runs the functional projects: Chromium runs everything,
// Firefox and WebKit run the accessibility, behavior, link and motion
// suites. Several features are progressive enhancements there (anchor
// positioning, ::details-content, @starting-style, view transitions), and
// the tests check that the fallbacks work.
//
// The "visual" project compares pixels, which depend on the machine's font
// rasterizer, so its baselines belong to one canonical environment: the
// Playwright container that CI runs (`npm run test:visual`; see ci.yml).
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: "http://localhost:4173",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, testIgnore: /visual\.spec/ },
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, testIgnore: /visual\.spec/ },
    { name: "webkit", use: { ...devices["Desktop Safari"] }, testIgnore: /visual\.spec/ },
    { name: "visual", use: { ...devices["Desktop Chrome"] }, testMatch: /visual\.spec/ },
  ],
  webServer: {
    command: "npx serve dist -l 4173 --no-clipboard",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
