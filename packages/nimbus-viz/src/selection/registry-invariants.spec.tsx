/**
 * Registry-wide rendering invariants under adversarial input.
 *
 * Every chart component (one registry entry per `baseComponent`) is rendered
 * with its normal fixture and with each structure-preserving mutation from
 * `src/stories/adversarial.ts`. The assertions are the ones that hold for any
 * correct chart regardless of family:
 *
 * - INV-1 no geometry attribute contains NaN / Infinity / undefined / null;
 * - INV-2 no negative width / height / radius;
 * - INV-3 (duplicate-labels only) relabeling rows changes text, never geometry —
 *   the universal form of bug class BC-1;
 * - INV-4 no rendered text reads "NaN" / "Infinity" / "undefined".
 *
 * Charts with a known, not-yet-fixed gap are listed in `KNOWN_GAPS` with the
 * bug-class id from `docs/bug-classes.md` as the reason. Their tests run with
 * `it.fails`, so the suite stays green while the gap is open and turns red the
 * moment a sweep fixes the chart but forgets to remove the entry. The list is
 * meant to shrink.
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { chartRegistry } from "./registry";
import { resolveByName } from "./resolve";
import { ChartThemeProvider } from "../theme";
import { fixtureFor } from "../stories/fixtures";
import {
  MUTATIONS,
  mutateFixture,
  type MutationId,
} from "../stories/adversarial";
import type { ChartRegistryEntry, ChartSize } from "./types";

const SIZE: ChartSize = { width: 640, height: 400 };

const GEOMETRY_ATTRS = [
  "x",
  "y",
  "width",
  "height",
  "r",
  "rx",
  "ry",
  "cx",
  "cy",
  "x1",
  "x2",
  "y1",
  "y2",
  "d",
  "points",
  "transform",
  "dx",
  "dy",
] as const;
const SIZE_ATTRS = ["width", "height", "r", "rx", "ry"] as const;
const TEXT_TAGS = new Set(["text", "tspan", "title", "desc"]);
const INVALID = /NaN|Infinity|undefined|null/;

/**
 * Open gaps: `"<BaseComponent>:<mutation>": "<BC-id> reason"`.
 * Remove an entry when `/chart:sweep` fixes the chart; its `it.fails` test
 * flips red otherwise.
 */
const KNOWN_GAPS: Record<string, string> = {
  // BC-1 (band scale keyed by label text): fixed across all 14 charts by the
  // /chart:sweep BC-1 commit; no entries remain. INV-3 is the guard.
  // BC-2 — negative magnitude extrapolates past zero (negative <circle r>)
  "BubbleChart:negative-values": "BC-2 negative size -> negative r",
  // BC-3 — degenerate totals: every link 0 makes the sankey layout NaN
  "SankeyDiagram:all-zero": "BC-3 all-zero links -> NaN layout",
};

function firstEntryPerBase(
  registry: Map<string, ChartRegistryEntry>
): ChartRegistryEntry[] {
  const seen = new Set<string>();
  const out: ChartRegistryEntry[] = [];
  for (const entry of registry.values()) {
    const base = entry.metadata.baseComponent;
    if (seen.has(base)) continue;
    seen.add(base);
    out.push(entry);
  }
  return out;
}

function renderEntry(
  entry: ChartRegistryEntry,
  data: unknown,
  options?: unknown
) {
  const name = entry.metadata.name;
  const intent = entry.metadata.intents[0].intent;
  const result = resolveByName(
    name,
    { intent, data, options: options as Record<string, unknown> | undefined },
    SIZE
  );
  // A mutation must not change the detected kind; otherwise we would be
  // asserting invariants on the DataTable fallback, not on the chart.
  expect(
    result.name,
    "resolved chart (DataTable fallback = mutation changed the kind)"
  ).toBe(name);
  return render(
    <ChartThemeProvider mode="light">{result.render(SIZE)}</ChartThemeProvider>
  );
}

function svgElements(container: HTMLElement): Element[] {
  return Array.from(container.querySelectorAll("svg *"));
}

function expectNoInvalidGeometry(container: HTMLElement) {
  const bad: string[] = [];
  for (const el of svgElements(container)) {
    for (const attr of GEOMETRY_ATTRS) {
      const v = el.getAttribute(attr);
      if (v != null && INVALID.test(v)) {
        bad.push(`<${el.tagName.toLowerCase()} ${attr}="${v.slice(0, 40)}">`);
      }
    }
  }
  expect(bad, "INV-1 invalid geometry").toEqual([]);
}

function expectNoNegativeSizes(container: HTMLElement) {
  const bad: string[] = [];
  for (const el of svgElements(container)) {
    for (const attr of SIZE_ATTRS) {
      const v = el.getAttribute(attr);
      if (v == null || v.includes("%")) continue;
      const n = Number(v);
      if (Number.isFinite(n) && n < 0) {
        bad.push(`<${el.tagName.toLowerCase()} ${attr}="${v}">`);
      }
    }
  }
  expect(bad, "INV-2 negative size").toEqual([]);
}

function expectNoInvalidText(container: HTMLElement) {
  const bad: string[] = [];
  for (const el of svgElements(container)) {
    if (!TEXT_TAGS.has(el.tagName.toLowerCase())) continue;
    const t = el.textContent ?? "";
    if (INVALID.test(t)) bad.push(`<${el.tagName.toLowerCase()}>${t}`);
  }
  expect(bad, "INV-4 invalid text").toEqual([]);
}

/** Tag + geometry attributes of every non-text SVG element, in document order. */
function geometryOf(container: HTMLElement): string[] {
  const out: string[] = [];
  for (const el of svgElements(container)) {
    const tag = el.tagName.toLowerCase();
    if (TEXT_TAGS.has(tag)) continue;
    const parts = [tag];
    for (const attr of GEOMETRY_ATTRS) {
      const v = el.getAttribute(attr);
      if (v != null) parts.push(`${attr}=${v}`);
    }
    if (parts.length > 1) out.push(parts.join(" "));
  }
  return out;
}

describe("registry invariants under adversarial input", () => {
  const entries = firstEntryPerBase(chartRegistry);

  it("covers every base component in the registry", () => {
    expect(entries.length).toBeGreaterThan(40);
  });

  for (const entry of entries) {
    const base = entry.metadata.baseComponent;
    const kind = entry.dataKinds[0];
    const fixture = fixtureFor(entry);

    describe(`${base} (${entry.metadata.name}, ${kind})`, () => {
      it("renders its fixture without invalid geometry", () => {
        const { container, unmount } = renderEntry(
          entry,
          fixture.data,
          fixture.options
        );
        expectNoInvalidGeometry(container);
        expectNoNegativeSizes(container);
        expectNoInvalidText(container);
        unmount();
      });

      for (const mutation of MUTATIONS as readonly MutationId[]) {
        const mutated = mutateFixture(kind, fixture, mutation);
        if (!mutated) continue;
        const gap = KNOWN_GAPS[`${base}:${mutation}`];
        const test = gap ? it.fails : it;
        test(`survives ${mutation}${gap ? ` (known gap: ${gap})` : ""}`, () => {
          const { container, unmount } = renderEntry(
            entry,
            mutated.data,
            mutated.options
          );
          try {
            expectNoInvalidGeometry(container);
            expectNoNegativeSizes(container);
            expectNoInvalidText(container);
            if (mutation === "duplicate-labels") {
              const baseline = renderEntry(
                entry,
                fixture.data,
                fixture.options
              );
              try {
                expect(
                  geometryOf(container),
                  "INV-3 relabeling rows must not move marks"
                ).toEqual(geometryOf(baseline.container));
              } finally {
                baseline.unmount();
              }
            }
          } finally {
            unmount();
          }
        });
      }
    });
  }
});
