// Browser tests for the built site (dist/). `npm test` builds first.
//
// Chromium runs everything. Firefox and WebKit run the accessibility,
// behavior, link and motion suites. Several features are progressive
// enhancements there (anchor positioning, ::details-content, @starting-style,
// view transitions), and the tests assert the fallbacks work. Visual
// baselines are Chromium-only: pixel output differs per engine by design.
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
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, testIgnore: /visual\.spec/ },
    { name: "webkit", use: { ...devices["Desktop Safari"] }, testIgnore: /visual\.spec/ },
  ],
  webServer: {
    command: "npx serve dist -l 4173 --no-clipboard",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
