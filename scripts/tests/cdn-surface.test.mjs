// The CDN surface: jsDelivr serves files straight from the git tag, so a
// file that exists locally but is not tracked works in every local test and
// 404s for consumers. These checks read the repository as jsDelivr will:
// only files git tracks, at the paths the docs and stylesheets point to.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const tracked = new Set(execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0").filter(Boolean));
const read = (file) => readFileSync(path.join(root, file), "utf8");

const CDN = /cdn\.jsdelivr\.net\/gh\/idcesares\/The-Membrane-Palette@([^/"'\s)]+)\/([^"'\s)<>`\\]*)/g;
// Files that tell consumers how to install: docs, generated indexes, examples.
const sources = [...tracked].filter((f) =>
  /\.(md|html|txt|json|d\.ts)$/.test(f) && !f.startsWith("tests/") && !f.startsWith("docs/superpowers/") && f !== "package-lock.json"
);

test("every CDN link is pinned to the package version and names a tracked file", () => {
  const problems = [];
  let count = 0;
  for (const file of sources) {
    for (const [url, version, target] of read(file).matchAll(CDN)) {
      count += 1;
      if (version !== pkg.version) problems.push(`${file}: ${url} is pinned to ${version}, package.json is ${pkg.version}`);
      if (target && !tracked.has(target)) problems.push(`${file}: ${url} → ${target} is not tracked by git, so jsDelivr cannot serve it`);
    }
  }
  assert.ok(count > 0, "expected CDN install snippets in the docs");
  assert.deepEqual(problems, []);
});

test("the pinned version has a release tag, or a changelog entry while it awaits one", (t) => {
  // jsDelivr resolves @2.2.0 to the v2.2.0 tag. Shallow CI clones carry no
  // tags, so the check runs only where tags were fetched.
  const tags = execFileSync("git", ["tag", "--list"], { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean);
  if (tags.length === 0) return t.skip("no tags in this clone");
  const tagged = tags.includes(`v${pkg.version}`) || tags.includes(pkg.version);
  assert.ok(tagged || read("CHANGELOG.md").includes(`## [${pkg.version}]`), `no tag v${pkg.version} and no changelog entry for it`);
});

test("every url() in the shipped stylesheets resolves to a tracked file", () => {
  const problems = [];
  const sheets = ["membrane.css", "fonts/fonts.css", "tokens/design-tokens.css", "tokens/base.css", "components/membrane-components.css", "tokens/membrane-tailwind.css"];
  let count = 0;
  for (const sheet of sheets) {
    for (const [, ref] of read(sheet).matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      if (/^(data:|https?:|#)/.test(ref)) continue;
      count += 1;
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(sheet), ref.split(/[?#]/)[0]));
      if (!tracked.has(target)) problems.push(`${sheet}: url(${ref}) → ${target} is not tracked`);
    }
  }
  assert.ok(count > 0, "expected font url()s in the stylesheets");
  assert.deepEqual(problems, []);
});

test("every package export and listed file is tracked", () => {
  const problems = [];
  const targets = (value) => (typeof value === "string" ? [value] : Object.values(value).flatMap(targets));
  for (const [entry, value] of Object.entries(pkg.exports)) {
    for (const target of targets(value)) {
      const file = target.replace(/^\.\//, "");
      if (!tracked.has(file)) problems.push(`exports["${entry}"] → ${file} is not tracked`);
    }
  }
  for (const entry of pkg.files) {
    const ok = entry.endsWith("/") ? [...tracked].some((f) => f.startsWith(entry)) : tracked.has(entry);
    if (!ok) problems.push(`files: ${entry} is not tracked`);
  }
  const types = pkg.types.replace(/^\.\//, "");
  if (!tracked.has(types)) problems.push(`types → ${types} is not tracked`);
  assert.deepEqual(problems, []);
});

test("llms.txt links point at tracked files", () => {
  const problems = [];
  for (const [, href] of read("llms.txt").matchAll(/\]\(([^)]+)\)/g)) {
    if (/^https?:/.test(href)) continue;
    const file = href.split("#")[0];
    if (!tracked.has(file)) problems.push(`llms.txt → ${href} is not tracked`);
  }
  assert.deepEqual(problems, []);
});
