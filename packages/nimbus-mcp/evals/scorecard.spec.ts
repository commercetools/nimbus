import { describe, it, expect } from "vitest";
import { buildScorecard, renderScorecardMarkdown } from "./scorecard.js";
import type { EvalRecord } from "../src/types.js";

const records: EvalRecord[] = [
  { tool: "search_docs", id: "a", pass: true, chars: 100, ms: 10 },
  { tool: "search_docs", id: "b", pass: false, chars: 300, ms: 30 },
  { tool: "search_docs", id: "c", pass: true, chars: 200, ms: 20 },
  { tool: "get_tokens", id: "d", pass: true, chars: 50, ms: 5 },
];

describe("buildScorecard", () => {
  it("aggregates pass/fail and p50/max per tool, sorted by tool name", () => {
    const card = buildScorecard(records);
    expect(card.tools.map((t) => t.tool)).toEqual([
      "get_tokens",
      "search_docs",
    ]);
    const sd = card.tools[1];
    expect(sd.passed).toBe(2);
    expect(sd.failed).toBe(1);
    expect(sd.chars).toEqual({ p50: 200, max: 300 });
    expect(sd.ms).toEqual({ p50: 20, max: 30 });
    expect(card.totals).toEqual({ passed: 3, failed: 1 });
  });

  it("uses the lower middle value for an even count", () => {
    const card = buildScorecard(records.filter((r) => r.id !== "c"));
    expect(card.tools[1].chars.p50).toBe(100);
  });
});

describe("renderScorecardMarkdown", () => {
  it("renders a table with one row per tool and a totals line", () => {
    const md = renderScorecardMarkdown(buildScorecard(records));
    expect(md).toContain("| Tool |");
    expect(md).toContain("| search_docs | 2 | 1 | 200 | 300 | 20 | 30 |");
    expect(md).toContain("| get_tokens | 1 | 0 | 50 | 50 | 5 | 5 |");
    expect(md).toContain("3 passed, 1 failed");
  });
});
