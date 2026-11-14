import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { appendFile, cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
let fixture;
before(async () => {
  fixture = await mkdtemp(path.join(tmpdir(), "membrane-gates-"));
  for (const file of ["scripts", "tokens", "components", "fonts", "showcase", "examples", "package.json", "README.md", "DESIGN-SYSTEM.md"]) {
    await cp(path.join(root, file), path.join(fixture, file), { recursive: true });
  }
});
after(async () => { if (fixture) await rm(fixture, { recursive: true, force: true }); });

const build = () => {
  const result = spawnSync(process.execPath, ["scripts/build-components.mjs"], { cwd: fixture, encoding: "utf8" });
  return { status: result.status, output: result.stdout + result.stderr };
};

/** Append CSS to a fixture file for one build, then restore it. */
async function withAppended(file, css, check) {
  const target = path.join(fixture, file);
  const source = await readFile(target, "utf8");
  try {
    await appendFile(target, `\n${css}\n`);
    check(build());
  } finally {
    await writeFile(target, source);
  }
}

test("component-token gate rejects a variant that reassigns a knob below its minimum", () =>
  withAppended("components/tag/tag.css", `.mp-tag[data-tone="human"] { --mp-tag-fg: var(--color-bg-tertiary); }`, ({ status, output }) => {
    assert.notEqual(status, 0);
    assert.match(output, /components\/tag\/tag\.css: (light|dark) \.mp-tag\[data-tone="human"\]: --mp-tag-fg on --mp-tag-bg .* needs 4\.5:1/);
  }));

test("component-token gate follows a knob that points at another knob", () =>
  // --mp-button-fg-hover defaults to var(--mp-button-fg): breaking fg must fail the hover pair too.
  withAppended("components/button/button.css", `.mp-button[data-size="sm"] { --mp-button-fg: var(--color-action-primary); }`, ({ status, output }) => {
    assert.notEqual(status, 0);
    assert.match(output, /--mp-button-fg-hover on --mp-button-bg-hover/);
  }));

test("component-token gate reports a knob value it cannot resolve", () =>
  withAppended("components/badge/badge.css", `.mp-badge[data-tone="info"] { --mp-badge-bg: color-mix(in oklab, var(--color-info-bg), var(--color-bg-primary)); }`, ({ status, output }) => {
    assert.notEqual(status, 0);
    assert.match(output, /--mp-badge-bg: color-mix\(.*is not a single var\(\) the gate can resolve/);
  }));

test("breakpoint lint rejects an @media width off the scale", () =>
  withAppended("examples/composition.css", `@media (max-width: 900px) { .composition-fixture { gap: var(--space-2); } }`, ({ status, output }) => {
    assert.notEqual(status, 0);
    assert.match(output, /examples\/composition\.css: @media \(max-width: 900px\) uses 900px, which is not on the breakpoint scale/);
  }));

test("breakpoint lint accepts scale steps in px, rem and range syntax, and ignores container queries", () =>
  withAppended("examples/composition.css", `
    @media (min-width: 640px) { .composition-fixture { gap: var(--space-2); } }
    @media (48rem <= width < 64rem) { .composition-fixture { gap: var(--space-3); } }
    @container (max-width: 28rem) { .composition-fixture { gap: var(--space-4); } }
  `, ({ status, output }) => assert.equal(status, 0, output)));
