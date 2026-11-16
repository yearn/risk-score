import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { load } from "js-yaml";

test("report and scope edits trigger reassessment validation in CI", () => {
  const source = new URL("../.github/workflows/tests.yml", import.meta.url);
  const workflow = load(readFileSync(source, "utf8"));
  const paths = workflow.on.pull_request.paths;
  assert.ok(paths.includes("reports/report/**"), "report changes must validate eligibility");
  assert.ok(paths.includes("reports/reassessment.json"), "scope changes must validate eligibility");
});
