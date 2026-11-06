import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
let fixture;
before(async () => {
  fixture = await mkdtemp(path.join(tmpdir(), "membrane-css-"));
  for (const file of ["scripts", "tokens", "components", "fonts", "showcase", "examples", "package.json", "README.md", "DESIGN-SYSTEM.md"]) {
    await cp(path.join(root, file), path.join(fixture, file), { recursive: true });
  }
});
after(async () => { if (fixture) await rm(fixture, { recursive: true, force: true }); });

const cases = [
  ["hex colors", "color: #fff", /raw hex/],
  ["color functions", "color: rgb(1 2 3)", /raw color function/],
  ["named colors", "background: white", /named color/],
  ["other named colors", "border-color: rebeccapurple", /named color/],
  ["unknown tokens", "color: var(--color-does-not-exist)", /neither a design token/],
  ["whitespace around unknown tokens", "color: var( --color-does-not-exist )", /neither a design token/],
  ["palette primitives", "color: var(--color-terracotta)", /Tier 1 primitive/],
  ["deprecated tokens", "font-size: var(--text-sm)", /deprecated/],
  ["token redefinitions", "--color-text-primary: var(--color-text-secondary)", /design tokens are only defined/],
];

for (const [name, declaration, diagnostic] of cases) {
  test(`component build rejects example CSS with ${name}`, async () => {
    await writeFile(path.join(fixture, "examples", "fixture.css"), `.composition-fixture { ${declaration}; }`);
    const result = spawnSync(process.execPath, ["scripts/build-components.mjs"], { cwd: fixture, encoding: "utf8" });
    assert.notEqual(result.status, 0, "invalid example CSS must stop the actual build");
    assert.match(result.stdout + result.stderr, /examples\/fixture\.css/);
    assert.match(result.stdout + result.stderr, diagnostic);
  });
}

test("component build accepts semantic tokens, geometry and declared local knobs", async () => {
  await writeFile(path.join(fixture, "examples", "fixture.css"), `
    /* Comments may describe #fff, rgb() or deprecated var(--text-sm). */
    .composition-fixture {
      --composition-ink: var(--color-text-primary);
      --mp-card-padding: var(--space-6);
      color: var(--composition-ink);
      content: "red is a word here";
      gap: var( --space-6 );
      aspect-ratio: 16 / 9;
    }
  `);
  const result = spawnSync(process.execPath, ["scripts/build-components.mjs"], { cwd: fixture, encoding: "utf8" });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test("a rootless component keeps its actionable build diagnostic", async () => {
  const file = path.join(fixture, "components", "button", "button.css");
  const source = await readFile(file, "utf8");
  try {
    await writeFile(file, ".unrelated { color: var(--color-text-primary); }");
    const result = spawnSync(process.execPath, ["scripts/build-components.mjs"], { cwd: fixture, encoding: "utf8" });
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /components\/button\/button\.css: declares no \.mp-\* root class/);
    assert.doesNotMatch(result.stdout + result.stderr, /ReferenceError/);
  } finally {
    await writeFile(file, source);
  }
});

test("accepted CSS syntax stays represented in the generated component API", async () => {
  const file = path.join(fixture, "components", "button", "button.css");
  const source = await readFile(file, "utf8");
  try {
    await writeFile(file, `${source}\n.mp-button { --mp-button-fixture-gap: var( --space-32 ) }\n.mp-button { gap: var( --mp-button-fixture-gap ) }\n`);
    const result = spawnSync(process.execPath, ["scripts/build-components.mjs"], { cwd: fixture, encoding: "utf8" });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const manifest = JSON.parse(await readFile(path.join(fixture, "components", "manifest.json"), "utf8"));
    const button = manifest.components.find((component) => component.slug === "button");
    assert.equal(button.componentTokens["--mp-button-fixture-gap"], "var( --space-32 )");
    assert.ok(button.tokensUsed.includes("--space-32"), "accepted token references must remain discoverable");
    const readme = await readFile(path.join(fixture, "components", "button", "README.md"), "utf8");
    assert.match(readme, /--mp-button-fixture-gap/);
  } finally {
    await writeFile(file, source);
  }
});
