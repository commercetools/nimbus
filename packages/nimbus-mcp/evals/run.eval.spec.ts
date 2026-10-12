import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { join } from "node:path";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { callTool, connectEvalClient, PACKAGE_ROOT } from "./client.js";
import { loadCaseFiles } from "./load-cases.js";
import { evaluateExpectations } from "./matchers.js";
import { buildScorecard, writeScorecard } from "./scorecard.js";
import type { EvalRecord } from "../src/types.js";

/**
 * Runs every case in evals/cases/*.json against the built server.
 *
 * Case files are loaded at collection time so each case becomes its own `it`
 * (re-run one with --testNamePattern). A malformed file throws here, before
 * any tool is called, and fails the whole run with the file/case/key.
 */

const MIN_CASES_PER_TOOL = 3;
const CASES_DIR = join(PACKAGE_ROOT, "evals/cases");
const REPORT_PATH = join(PACKAGE_ROOT, "evals/.report/scorecard.json");

const caseFiles = loadCaseFiles(CASES_DIR);
const records: EvalRecord[] = [];

let client: Client;
let close: () => Promise<void>;

beforeAll(async () => {
  ({ client, close } = await connectEvalClient());
});

afterAll(async () => {
  // close is unset when beforeAll threw (e.g. dist/ missing); keep that error alone.
  if (close) await close();
  writeScorecard(
    buildScorecard(records),
    REPORT_PATH,
    process.env.GITHUB_STEP_SUMMARY
  );
});

describe("coverage", () => {
  it("every case id is unique across all files", () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const f of caseFiles) {
      for (const c of f.cases) {
        const key = `${f.tool}/${c.id}`;
        if (seen.has(key))
          duplicates.push(`${key} (${seen.get(key)}, ${f.file})`);
        seen.set(key, f.file);
      }
    }
    expect(duplicates, "duplicate case ids").toEqual([]);
  });

  it(`every registered tool has at least ${MIN_CASES_PER_TOOL} cases`, async () => {
    const registered = (await client.listTools()).tools.map((t) => t.name);
    const counts = new Map(caseFiles.map((f) => [f.tool, f.cases.length]));
    const uncovered = registered
      .filter((tool) => (counts.get(tool) ?? 0) < MIN_CASES_PER_TOOL)
      .map((tool) => `${tool}: ${counts.get(tool) ?? 0} cases`);
    expect(uncovered, "tools below the minimum case count").toEqual([]);
  });

  it("every case file names a registered tool", async () => {
    const registered = new Set(
      (await client.listTools()).tools.map((t) => t.name)
    );
    const stale = caseFiles
      .filter((f) => !registered.has(f.tool))
      .map((f) => `${f.file} names unregistered tool "${f.tool}"`);
    expect(stale, "stale case files").toEqual([]);
  });
});

for (const file of caseFiles) {
  describe(file.tool, () => {
    for (const c of file.cases) {
      it(c.id, async () => {
        const started = performance.now();
        const response = await callTool(client, file.tool, c.input);
        const ms = Math.round(performance.now() - started);
        const results = evaluateExpectations(c.expect, response);
        const failed = results.filter((r) => !r.ok);
        records.push({
          tool: file.tool,
          id: c.id,
          pass: failed.length === 0,
          chars: response.text.length,
          ms,
        });
        if (failed.length > 0) {
          const detail = failed
            .map(
              (r) =>
                `  ${r.key}\n    expected: ${JSON.stringify(r.expected)}\n    actual:   ${JSON.stringify(r.actual)}`
            )
            .join("\n");
          throw new Error(
            `${file.tool} › ${c.id} (${file.file}) failed ${failed.length} expectation(s):\n${detail}`
          );
        }
      });
    }
  });
}
