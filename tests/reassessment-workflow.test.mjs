import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { load } from "js-yaml";

test("report and scope edits trigger reassessment validation in CI", () => {
  const source = new URL("../.github/workflows/tests.yml", import.meta.url);
  const workflow = load(readFileSync(source, "utf8"));
  assert.ok(Object.hasOwn(workflow.on, "pull_request"), "PRs must run validation");
  const trigger = workflow.on.pull_request ?? {};
  assert.equal(trigger["paths-ignore"], undefined, "report validation must not be excluded");
  if (trigger.paths) {
    assert.ok(trigger.paths.includes("reports/report/**"), "report changes must validate eligibility");
    assert.ok(trigger.paths.includes("reports/reassessment.json"), "scope changes must validate eligibility");
  }
});
