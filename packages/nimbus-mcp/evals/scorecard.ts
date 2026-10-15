import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type {
  EvalRecord,
  EvalScorecard,
  EvalStat,
  EvalToolScorecard,
} from "../src/types.js";

function stat(values: number[]): EvalStat {
  if (values.length === 0) return { p50: 0, max: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  // Lower middle for even counts: deterministic and never a fractional ms.
  const p50 = sorted[Math.ceil(sorted.length / 2) - 1];
  return { p50, max: sorted[sorted.length - 1] };
}

export function buildScorecard(records: EvalRecord[]): EvalScorecard {
  const byTool = new Map<string, EvalRecord[]>();
  for (const r of records) {
    const list = byTool.get(r.tool) ?? [];
    list.push(r);
    byTool.set(r.tool, list);
  }
  const tools: EvalToolScorecard[] = [...byTool.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([tool, list]) => ({
      tool,
      passed: list.filter((r) => r.pass).length,
      failed: list.filter((r) => !r.pass).length,
      chars: stat(list.map((r) => r.chars)),
      ms: stat(list.map((r) => r.ms)),
    }));
  return {
    generatedAt: new Date().toISOString(),
    totals: {
      passed: tools.reduce((n, t) => n + t.passed, 0),
      failed: tools.reduce((n, t) => n + t.failed, 0),
    },
    tools,
  };
}

export function renderScorecardMarkdown(card: EvalScorecard): string {
  const rows = card.tools.map(
    (t) =>
      `| ${t.tool} | ${t.passed} | ${t.failed} | ${t.chars.p50} | ${t.chars.max} | ${t.ms.p50} | ${t.ms.max} |`
  );
  return [
    "### Nimbus MCP tool evals",
    "",
    "| Tool | Passed | Failed | Chars p50 | Chars max | ms p50 | ms max |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...rows,
    "",
    `**${card.totals.passed} passed, ${card.totals.failed} failed**`,
    "",
  ].join("\n");
}

/**
 * Writes the JSON scorecard and, when `stepSummaryPath` is set (GitHub
 * Actions exports it as GITHUB_STEP_SUMMARY), appends the Markdown table.
 */
export function writeScorecard(
  card: EvalScorecard,
  jsonPath: string,
  stepSummaryPath?: string
): void {
  mkdirSync(dirname(jsonPath), { recursive: true });
  writeFileSync(jsonPath, JSON.stringify(card, null, 2) + "\n");
  if (stepSummaryPath) {
    appendFileSync(stepSummaryPath, renderScorecardMarkdown(card));
  }
}
