// Link integrity: every same-origin link, stylesheet, script and image on the
// built site resolves, every #fragment points at a real id, and every
// relative link in the repo's Markdown points at a file that exists.
import { test, expect } from "@playwright/test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES } from "./pages.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const pagePath of PAGES) {
  test(`links resolve: ${pagePath}`, async ({ page, request, baseURL }) => {
    await page.goto(pagePath);
    const refs = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href], link[href], script[src], img[src], source[src]"), (el) => el.href || el.src)
    );
    const origin = new URL(baseURL).origin;
    const checked = new Map();
    const broken = [];

    for (const ref of new Set(refs)) {
      const url = new URL(ref);
      if (url.origin !== origin) continue;
      const target = url.origin + url.pathname;

      if (!checked.has(target)) {
        const res = await request.get(target);
        checked.set(target, { ok: res.ok(), html: res.ok() && (res.headers()["content-type"] || "").includes("html") ? await res.text() : "" });
      }
      const { ok, html } = checked.get(target);
      if (!ok) { broken.push(`${ref} → not found`); continue; }

      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) continue;
      const here = target === new URL(page.url()).origin + new URL(page.url()).pathname;
      const found = here
        ? await page.evaluate((id) => !!document.getElementById(id), id)
        : html.includes(`id="${id}"`);
      if (!found) broken.push(`${ref} → no element with id "${id}"`);
    }

    expect(broken, broken.join("\n")).toEqual([]);
  });
}

for (const pagePath of PAGES) {
  test(`self-contained: no third-party requests, fonts load: ${pagePath}`, async ({ page, baseURL }) => {
    const origin = new URL(baseURL).origin;
    const external = [];
    page.on("request", (req) => {
      const url = new URL(req.url());
      if (url.protocol.startsWith("http") && url.origin !== origin) external.push(req.url());
    });
    await page.goto(pagePath, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    expect(external, external.join("\n")).toEqual([]);
    const loaded = await page.evaluate(() =>
      [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/"/g, ""))
    );
    expect(loaded).toContain("Instrument Sans");
  });
}

test("missing paths get the 404 page", async ({ page }) => {
  const res = await page.goto("/no-such-page");
  expect(res.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page isn't here");
});

test("relative links in Markdown point at files that exist", () => {
  const files = [
    ...readdirSync(root).filter((f) => f.endsWith(".md")),
    ...readdirSync(path.join(root, "docs")).filter((f) => f.endsWith(".md")).map((f) => `docs/${f}`),
    ...["composition", "patterns", "accessibility", "visual-language"].flatMap((directory) => readdirSync(path.join(root, "docs", directory)).filter((f) => f.endsWith(".md")).map((f) => `docs/${directory}/${f}`)),
    ...readdirSync(path.join(root, "components"), { withFileTypes: true })
      .filter((d) => d.isDirectory() && existsSync(path.join(root, "components", d.name, "README.md")))
      .map((d) => `components/${d.name}/README.md`),
  ];
  const broken = [];
  for (const file of files) {
    // Drop fenced and inline code so example snippets aren't read as links.
    const text = readFileSync(path.join(root, file), "utf8").replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
    const refs = [
      ...[...text.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((m) => m[1]),
      ...[...text.matchAll(/\b(?:src|srcset)="([^"\s]+)/g)].map((m) => m[1]),
    ];
    for (const href of refs) {
      if (/^(?:[a-z]+:|#|\/\/)/i.test(href)) continue;
      const target = path.resolve(path.dirname(path.join(root, file)), decodeURIComponent(href.split("#")[0]));
      if (!existsSync(target)) broken.push(`${file}: ${href}`);
    }
  }
  expect(broken, broken.join("\n")).toEqual([]);
});

test("example references also resolve when served from the source checkout", () => {
  const broken = [];
  for (const pagePath of PAGES.filter((p) => p.startsWith("/examples/"))) {
    const file = path.join(root, pagePath.slice(1));
    for (const [, ref] of readFileSync(file, "utf8").matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(?:[a-z]+:|#|\/\/)/i.test(ref)) continue;
      const target = path.resolve(path.dirname(file), decodeURIComponent(ref.split("#")[0]));
      if (!existsSync(target)) broken.push(`${pagePath}: ${ref}`);
    }
  }
  expect(broken, broken.join("\n")).toEqual([]);
});

test("shipped task guides and accessibility evidence remain inspectable", async ({ request, baseURL }) => {
  const targets = new Set(["/docs/accessibility/evidence.json"]);
  for (const directory of ["patterns", "accessibility", "visual-language"]) {
    for (const file of readdirSync(path.join(root, "docs", directory)).filter((file) => file.endsWith(".md"))) {
      const pathname = `/docs/${directory}/${file}`;
      targets.add(pathname);
      const markdown = readFileSync(path.join(root, pathname), "utf8").replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
      for (const [, ref] of markdown.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
        if (/^(?:[a-z]+:|#|\/\/)/i.test(ref)) continue;
        targets.add(new URL(ref, new URL(pathname, baseURL)).pathname);
      }
    }
  }
  const evidence = JSON.parse(readFileSync(path.join(root, "docs/accessibility/evidence.json"), "utf8"));
  for (const area of evidence.areas) {
    targets.add(`/${area.reference}`);
    for (const file of area.automated.tests) targets.add(`/${file}`);
  }
  const broken = [];
  for (const target of targets) {
    const response = await request.get(target);
    if (!response.ok()) broken.push(`${target}: ${response.status()}`);
  }
  expect(broken).toEqual([]);
});
