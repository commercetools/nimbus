import { describe, it, expect } from "vitest";
import { detectKind, deriveFacts } from "./derive-facts";
import type { DataKind } from "./types";

/** Minimal, valid data for each kind — mirrors the component input shapes. */
const SAMPLES: Record<DataKind, unknown> = {
  series: [{ id: "a", label: "A", data: [{ x: new Date(2024, 0, 1), y: 1 }] }],
  category: [{ category: "A", value: 1 }],
  "stack-row": [{ category: "A", segments: [{ key: "x", value: 1 }] }],
  scatter: [
    { x: 1, y: 2 },
    { x: 3, y: 4 },
  ],
  "heat-row": [{ label: "A", values: [1, 2, 3] }],
  funnel: [{ stage: "Visit", value: 100 }],
  "slope-row": [{ id: "a", label: "A", left: 1, right: 2 }],
  "dumbbell-row": [{ category: "A", start: 1, end: 2 }],
  bubble: [{ x: 1, y: 2, size: 3, label: "A" }],
  "radar-series": [{ id: "a", label: "A", values: [1, 2, 3, 4] }],
  "parallel-row": [{ id: "a", values: { p: 1, q: 2, r: 3 } }],
  calendar: [{ date: new Date(2024, 0, 1), value: 5 }],
  rfm: [{ recency: 1, frequency: 2, count: 10 }],
  samples: [1, 2, 3, 4, 5, 6],
  "box-group": [
    {
      label: "A",
      min: 1,
      firstQuartile: 3,
      median: 5,
      thirdQuartile: 7,
      max: 9,
    },
  ],
  "delta-steps": [
    { label: "Start", value: 100, isTotal: true },
    { label: "New", value: 20 },
  ],
  "bullet-row": [{ label: "Rev", measure: 80, target: 100 }],
  "flow-graph": {
    nodes: [{ name: "A" }, { name: "B" }],
    links: [{ source: 0, target: 1, value: 5 }],
  },
  hierarchy: {
    name: "root",
    children: [
      { name: "a", value: 5 },
      { name: "b", value: 3 },
    ],
  },
  scalar: 42,
  "sample-groups": [
    { label: "A", samples: [1, 2, 3, 4, 5] },
    { label: "B", samples: [2, 3, 4] },
  ],
  ohlc: [
    { date: new Date(2024, 0, 1), open: 10, high: 12, low: 9, close: 11 },
    { date: new Date(2024, 0, 2), open: 11, high: 13, low: 10, close: 10 },
  ],
  "timeline-events": [
    { label: "Launch", start: new Date(2024, 0, 1), end: new Date(2024, 2, 1) },
  ],
  "flow-matrix": {
    labels: ["A", "B", "C"],
    matrix: [
      [0, 1, 2],
      [1, 0, 1],
      [2, 1, 0],
    ],
  },
  "region-tiles": [
    { id: "CA", row: 0, col: 0, value: 5 },
    { id: "TX", row: 1, col: 2, value: 8 },
  ],
  unknown: [{ nope: true }],
};

describe("detectKind", () => {
  // Every kind's representative sample classifies back to that kind. This is
  // the guard that the ordering of detectKind's branches stays unambiguous.
  for (const kind of Object.keys(SAMPLES) as DataKind[]) {
    it(`classifies ${kind}`, () => {
      expect(detectKind(SAMPLES[kind])).toBe(kind);
    });
  }

  it("treats empty / null / primitives-that-aren't-numbers as unknown", () => {
    expect(detectKind([])).toBe("unknown");
    expect(detectKind(null)).toBe("unknown");
    expect(detectKind("nope")).toBe("unknown");
    expect(detectKind({})).toBe("unknown");
  });

  it("recognizes a bare number as a scalar", () => {
    expect(detectKind(0)).toBe("scalar");
    expect(detectKind(1234.5)).toBe("scalar");
  });
});

describe("deriveFacts", () => {
  it("accepts the non-array scalar / flow-graph / hierarchy shapes", () => {
    expect(deriveFacts({ intent: "VALUE", data: 42 }).malformed).toBe(false);
    expect(
      deriveFacts({ intent: "FLOW", data: SAMPLES["flow-graph"] }).malformed
    ).toBe(false);
    expect(
      deriveFacts({ intent: "PART-WHOLE", data: SAMPLES.hierarchy }).malformed
    ).toBe(false);
  });

  it("counts hierarchy leaves as cardinality", () => {
    const facts = deriveFacts({
      intent: "PART-WHOLE",
      data: SAMPLES.hierarchy,
    });
    expect(facts.kind).toBe("hierarchy");
    expect(facts.cardinality).toBe(2);
  });

  it("flags genuinely unusable data as malformed", () => {
    expect(deriveFacts({ intent: "TREND", data: null }).malformed).toBe(true);
    expect(deriveFacts({ intent: "TREND", data: [] }).malformed).toBe(true);
  });
});
