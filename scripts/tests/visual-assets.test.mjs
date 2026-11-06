import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, readdir, rm, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
let fixture;
before(async () => {
  fixture = await mkdtemp(path.join(tmpdir(), "membrane-visuals-"));
  await mkdir(path.join(fixture, "scripts"));
  await mkdir(path.join(fixture, "tokens"));
  if (existsSync(path.join(root, "scripts/render-visual-assets.mjs"))) await cp(path.join(root, "scripts/render-visual-assets.mjs"), path.join(fixture, "scripts/render-visual-assets.mjs"));
  const tokens = JSON.parse(await readFile(path.join(root, "tokens/tokens.resolved.json"), "utf8"));
  tokens.modes.light["--color-human-text"] = "#123456";
  tokens.modes.light["--color-digital-text"] = "#abcdef";
  tokens.modes.dark["--color-human-text"] = "#fedcba";
  tokens.modes.dark["--color-digital-text"] = "#654321";
  await writeFile(path.join(fixture, "tokens/tokens.resolved.json"), JSON.stringify(tokens));
});
after(async () => { if (fixture) await rm(fixture, { recursive: true, force: true }); });

function render() {
  const run = spawnSync(process.execPath, ["scripts/render-visual-assets.mjs"], { cwd: fixture, encoding: "utf8" });
  assert.equal(run.status, 0, run.stdout + run.stderr);
}

test("standalone visual assets resolve each theme from semantic tokens", async () => {
  render();
  const directory = path.join(fixture, "brand/visuals");
  const catalog = JSON.parse(await readFile(path.join(directory, "catalog.json"), "utf8"));
  assert.ok(catalog.assets.length >= 2);
  const referenced = [];
  for (const asset of catalog.assets) {
    for (const [theme, colors] of [["light", ["#123456", "#abcdef"]], ["dark", ["#fedcba", "#654321"]]]) {
      const file = asset.files[theme];
      assert.equal(path.basename(file), file, "downloads stay beside the catalog");
      referenced.push(file);
      const svg = await readFile(path.join(directory, file), "utf8");
      assert.match(svg, /<svg[^>]+xmlns="http:\/\/www.w3.org\/2000\/svg"/);
      assert.match(svg, /viewBox="0 0 \d+ \d+"/);
      assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
      assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/);
      for (const color of colors) assert.ok(svg.includes(color), `${file} must resolve ${color}`);
      assert.doesNotMatch(svg, /<script|<foreignObject|<text\b|@import|var\(|(?:href|src)="(?!#)|url\((?!#)/i, "assets must render independently of page fonts, CSS or remote files");
    }
  }
  assert.deepEqual((await readdir(directory)).filter(f => f.endsWith(".svg")).sort(), referenced.sort());
});

test("visual asset generation is repeatable without random geometry", async () => {
  render();
  const directory = path.join(fixture, "brand/visuals");
  const snapshot = await Promise.all((await readdir(directory)).sort().map(async file => [file, await readFile(path.join(directory, file), "utf8")]));
  render();
  for (const [file, contents] of snapshot) assert.equal(await readFile(path.join(directory, file), "utf8"), contents, file);
});
