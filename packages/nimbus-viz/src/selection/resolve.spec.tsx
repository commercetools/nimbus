import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { chartRegistry } from "./registry";
import { resolve, resolveByName } from "./resolve";
import { ChartThemeProvider } from "../theme";
import { fixtureFor } from "../stories/fixtures";
import type { ChartSize, DataKind, Intent } from "./types";

const SIZE: ChartSize = { width: 640, height: 400 };

/**
 * Data of a given kind, taken from the shared story fixtures (the same
 * generator Storybook and the registry invariant spec use) — one source of
 * shapes instead of a second hand-written copy here. The selection engine
 * classifies by structure, so any entry declaring the kind yields data that
 * detects as that kind.
 */
function dataForKind(kind: DataKind): unknown {
  for (const entry of chartRegistry.values()) {
    if (entry.dataKinds[0] === kind) return fixtureFor(entry).data;
  }
  throw new Error(`no registry entry declares data kind "${kind}"`);
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

  // Every registered chart, resolved by name with its own fixture, routes to
  // itself (not the table fallback) and renders visible output.
  for (const [name, entry] of chartRegistry) {
    it(`resolves and renders "${name}"`, () => {
      const intent = entry.metadata.intents[0].intent;
      const { data, options } = fixtureFor(entry);
      const result = resolveByName(name, { intent, data, options }, SIZE);
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
