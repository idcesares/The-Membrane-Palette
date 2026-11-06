import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../../", import.meta.url));
const evidence = JSON.parse(readFileSync(path.join(root, "docs/accessibility/evidence.json"), "utf8"));
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

test("evidence links to actual coverage and does not promise browser versions", () => {
  assert.equal(evidence.automationBaseline.version, pkg.devDependencies["@playwright/test"]);
  assert.equal(evidence.automationBaseline.supportedBrowserVersionPromise, false);
  assert.deepEqual(evidence.areas.map((area) => area.id).sort(), ["dialog", "combobox", "menu", "tabs", "toast", "resource-explorer", "form-journey"].sort());
  for (const area of evidence.areas) {
    assert.ok(existsSync(path.join(root, area.reference)), area.reference);
    assert.ok(area.automated.tests.length > 0);
    for (const file of area.automated.tests) assert.ok(existsSync(path.join(root, file)), file);
    if (area.automated.result !== null) {
      assert.match(area.automated.lastVerified, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(area.automated.runEvidence.length > 0, "a run result needs inspectable evidence");
      for (const report of area.automated.runEvidence) assert.ok(existsSync(path.join(root, "docs/accessibility", report)), report);
    }
  }
});

test("manual accessibility claims require a real dated scenario and environment", () => {
  for (const area of evidence.areas) {
    for (const [kind, record] of Object.entries(area.manual)) {
      assert.ok(["not-tested", "passed", "failed", "partial"].includes(record.status));
      if (record.status === "not-tested") {
        assert.equal(record.lastTested, null);
        assert.deepEqual(record.results, []);
        continue;
      }
      assert.match(record.lastTested, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(record.results.length > 0, `${area.id}/${kind}: missing session`);
      for (const session of record.results) {
        assert.match(session.testedAt, /^\d{4}-\d{2}-\d{2}/);
        for (const key of ["revision", "tester", "scenario", "expected", "observed", "outcome"]) assert.ok(session[key], `${area.id}/${kind}: ${key}`);
        for (const key of ["os", "browser", "browserVersion", "inputMethod"]) assert.ok(session.environment[key], `${area.id}/${kind}: ${key}`);
        if (kind === "screenReader") {
          assert.ok(session.environment.screenReader);
          assert.ok(session.environment.screenReaderVersion);
        }
        assert.ok(session.evidence.length > 0);
      }
    }
  }
});
