import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { load } from "js-yaml";

test("report and scope edits trigger reassessment validation in CI", () => {
  const source = new URL("../.github/workflows/tests.yml", import.meta.url);
  const workflow = load(readFileSync(source, "utf8"));
  assert.ok("pull_request" in workflow.on);
  assert.equal(workflow.on.pull_request?.paths, undefined, "every PR, report and scope edits included, runs tests");
});
