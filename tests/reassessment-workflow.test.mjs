import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { load } from "js-yaml";

test("report and scope edits trigger reassessment validation in CI", () => {
  const source = new URL("../.github/workflows/tests.yml", import.meta.url);
  const workflow = load(readFileSync(source, "utf8"));
  const trigger = workflow.on.pull_request;
  assert.ok(trigger, "PRs must run validation");
  assert.equal(trigger.paths, undefined, "report and scope edits must not be filtered out");
  assert.equal(trigger["paths-ignore"], undefined, "report and scope edits must not be filtered out");
});
