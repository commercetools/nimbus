import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { chartRegistry } from "./registry";
import { resolve, resolveByName } from "./resolve";
import { ChartThemeProvider } from "../theme";
import type { ChartSize, DataKind, Intent } from "./types";

const SIZE: ChartSize = { width: 640, height: 400 };

/** Representative, constraint-satisfying data for each kind (2+ entities where
 *  a chart might need them). */
function dataForKind(kind: DataKind): unknown {
  switch (kind) {
    case "series":
      return ["East", "West"].map((label, s) => ({
        id: label.toLowerCase(),
        label,
        data: Array.from({ length: 6 }, (_, i) => ({
          x: new Date(2024, i, 1),
          y: 100 + i * 10 + s * 25,
        })),
      }));
    case "category":
      return ["A", "B", "C", "D"].map((category, i) => ({
        category,
        value: 40 - i * 8,
      }));
    case "stack-row":
      return ["Q1", "Q2", "Q3"].map((category, i) => ({
        category,
        segments: [
          { key: "New", value: 10 + i },
          { key: "Returning", value: 20 - i },
        ],
      }));
    case "scatter":
      return Array.from({ length: 8 }, (_, i) => ({ x: i, y: (i * 7) % 11 }));
    case "heat-row":
      return ["A", "B", "C"].map((label, r) => ({
        label,
        values: [1 + r, 2 + r, 3 + r, 4 + r],
      }));
    case "funnel":
      return [
        { stage: "Visit", value: 100 },
        { stage: "Cart", value: 60 },
        { stage: "Buy", value: 30 },
      ];
    case "slope-row":
      return [
        { id: "a", label: "A", left: 10, right: 20 },
        { id: "b", label: "B", left: 15, right: 8 },
      ];
    case "dumbbell-row":
      return [
        { category: "A", start: 10, end: 20 },
        { category: "B", start: 5, end: 15 },
      ];
    case "bubble":
      return [
        { x: 1, y: 2, size: 10, label: "A" },
        { x: 3, y: 4, size: 20, label: "B" },
      ];
    case "radar-series":
      return [
        { id: "a", label: "A", values: [1, 2, 3, 4] },
        { id: "b", label: "B", values: [4, 3, 2, 1] },
      ];
    case "parallel-row":
      return [
        { id: "a", values: { p: 1, q: 2, r: 3 } },
        { id: "b", values: { p: 3, q: 2, r: 1 } },
      ];
    case "calendar":
      return Array.from({ length: 40 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        value: (i * 3) % 7,
      }));
    case "rfm":
      return [
        { recency: 1, frequency: 2, count: 10 },
        { recency: 2, frequency: 3, count: 5 },
      ];
    case "samples":
      return Array.from({ length: 60 }, (_, i) => (i % 13) + 1);
    case "box-group":
      return ["A", "B"].map((label, i) => ({
        label,
        min: 1 + i,
        firstQuartile: 3 + i,
        median: 5 + i,
        thirdQuartile: 7 + i,
        max: 9 + i,
      }));
    case "delta-steps":
      return [
        { label: "Start", value: 100, isTotal: true },
        { label: "New", value: 30 },
        { label: "Churn", value: -20 },
        { label: "End", value: 110, isTotal: true },
      ];
    case "bullet-row":
      return [
        { label: "Revenue", measure: 80, target: 100 },
        { label: "NPS", measure: 55, target: 50 },
      ];
    case "flow-graph":
      return {
        nodes: [{ name: "A" }, { name: "B" }, { name: "C" }],
        links: [
          { source: 0, target: 1, value: 5 },
          { source: 1, target: 2, value: 3 },
        ],
      };
    case "hierarchy":
      return {
        name: "root",
        children: [
          { name: "a", value: 5 },
          { name: "b", value: 3 },
        ],
      };
    case "scalar":
      return 72;
    case "sample-groups":
      return ["A", "B"].map((label, i) => ({
        label,
        samples: Array.from({ length: 30 }, (_, k) => (k % 7) + i),
      }));
    case "ohlc":
      return Array.from({ length: 8 }, (_, i) => {
        const base = 100 + i;
        return {
          date: new Date(2024, 0, i + 1),
          open: base,
          high: base + 5,
          low: base - 4,
          close: base + (i % 2 ? 2 : -2),
        };
      });
    case "timeline-events":
      return [
        {
          label: "Design",
          start: new Date(2024, 0, 1),
          end: new Date(2024, 1, 1),
        },
        {
          label: "Build",
          start: new Date(2024, 1, 1),
          end: new Date(2024, 3, 1),
        },
        { label: "Launch", start: new Date(2024, 3, 1) },
      ];
    case "flow-matrix":
      return {
        labels: ["A", "B", "C"],
        matrix: [
          [0, 3, 1],
          [2, 0, 4],
          [1, 2, 0],
        ],
      };
    case "region-tiles":
      return [
        { id: "NW", row: 0, col: 0, value: 5 },
        { id: "NE", row: 0, col: 2, value: 9 },
        { id: "SW", row: 2, col: 0, value: 3 },
        { id: "SE", row: 2, col: 2, value: 7 },
      ];
    case "unknown":
      return [{ nope: true }];
  }
}

function renderNode(node: React.ReactNode) {
  return render(<ChartThemeProvider mode="light">{node}</ChartThemeProvider>);
}

describe("registry coverage", () => {
  it("registers a unique render + metadata for every entry", () => {
    expect(chartRegistry.size).toBeGreaterThan(0);
    for (const [name, entry] of chartRegistry) {
      expect(entry.metadata.name).toBe(name);
      expect(typeof entry.render).toBe("function");
      expect(entry.dataKinds.length).toBeGreaterThan(0);
    }
  });

  // Every registered chart, resolved by name with data of its declared kind,
  // routes to itself (not the table fallback) and renders visible output.
  for (const [name, entry] of chartRegistry) {
    it(`resolves and renders "${name}"`, () => {
      const intent = entry.metadata.intents[0].intent;
      const data = dataForKind(entry.dataKinds[0]);
      const result = resolveByName(name, { intent, data }, SIZE);
      expect(result.name).toBe(name);

      const { container, unmount } = renderNode(result.render(SIZE));
      // Charts emit an <svg>; StatCard/DataTable emit HTML — either way,
      // something rendered.
      expect(
        container.textContent!.length + container.childElementCount
      ).toBeGreaterThan(0);
      unmount();
    });
  }
});

describe("intent routing (the new registrations)", () => {
  const cases: Array<[Intent, DataKind, string]> = [
    ["DIST", "samples", "histogram"],
    ["DIST", "box-group", "box-plot"],
    ["DELTA", "delta-steps", "waterfall-chart"],
    ["TARGET", "bullet-row", "bullet-chart"],
    ["FLOW", "flow-graph", "sankey-diagram"],
    ["PART-WHOLE", "hierarchy", "treemap"],
    ["TARGET", "scalar", "gauge"],
    ["VALUE", "scalar", "stat-card"],
    ["COMPARE", "stack-row", "grouped-bar-chart"],
    // Visual-vocabulary additions with a new (intent × kind) region.
    ["DELTA", "category", "diverging-bar-chart"],
    ["DIST", "sample-groups", "violin-plot"],
    ["TREND", "ohlc", "candlestick-chart"],
    ["TREND", "timeline-events", "gantt-chart"],
    ["FLOW", "flow-matrix", "chord-diagram"],
    ["GEO", "region-tiles", "tile-grid-map"],
  ];

  for (const [intent, kind, expected] of cases) {
    it(`${intent} + ${kind} → ${expected}`, () => {
      const result = resolve({ intent, data: dataForKind(kind) }, SIZE);
      expect(result.name).toBe(expected);
    });
  }
});

describe("fallback", () => {
  it("falls back to the DataTable for unrecognized data", () => {
    const result = resolve({ intent: "TREND", data: [{ nope: true }] }, SIZE);
    expect(result.name).toBeNull();
    const { container, unmount } = renderNode(result.render(SIZE));
    expect(container.querySelector("table")).toBeTruthy();
    unmount();
  });
});
