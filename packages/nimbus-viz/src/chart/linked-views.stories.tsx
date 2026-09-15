import type { Meta } from "@storybook/react-vite";
import { fireEvent, userEvent, within, expect, waitFor } from "storybook/test";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { extent } from "d3-array";
import { SelectionProvider, useLinkedSelection } from "./selection-provider";
import { Brush } from "./brush";
import { ChartScaleProvider } from "./scale-context";
import { useChartTheme } from "../theme";
import { LineChart } from "../components/line-chart/line-chart";
import type { Series } from "./types";
import type { BaseStory } from "../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const meta: Meta = {
  title: "Primitives/LinkedViews",
  parameters: { layout: "fullscreen" },
};
export default meta;

/* -------------------------------------------------------------------------- */
/* LinkedLegendSelection -- entity-set broadcast, on a real chart component   */
/* -------------------------------------------------------------------------- */

// Same series ids in both fixtures -- the whole point: `#20`'s "highlighted
// entity-set on ENTITY_ID_ACCESSOR" means the SAME id space links two charts
// of different data, not just two instances of the same data.
const revenueFixture: Series[] = [
  {
    id: "eu",
    label: "EU revenue",
    data: [
      { x: new Date("2026-01-01"), y: 120 },
      { x: new Date("2026-02-01"), y: 148 },
      { x: new Date("2026-03-01"), y: 136 },
    ],
  },
  {
    id: "us",
    label: "US revenue",
    data: [
      { x: new Date("2026-01-01"), y: 90 },
      { x: new Date("2026-02-01"), y: 104 },
      { x: new Date("2026-03-01"), y: 128 },
    ],
  },
];
const ordersFixture: Series[] = [
  {
    id: "eu",
    label: "EU orders",
    data: [
      { x: new Date("2026-01-01"), y: 900 },
      { x: new Date("2026-02-01"), y: 1100 },
      { x: new Date("2026-03-01"), y: 1050 },
    ],
  },
  {
    id: "us",
    label: "US orders",
    data: [
      { x: new Date("2026-01-01"), y: 700 },
      { x: new Date("2026-02-01"), y: 820 },
      { x: new Date("2026-03-01"), y: 990 },
    ],
  },
];

/** Reads/writes the shared `selected` set as `LineChart`'s own controlled
 * `selection`/`onSelectionChange` props -- no new per-chart wiring needed,
 * `A3`'s existing contract IS the linking mechanism. */
function LinkedLineChart({
  series,
  ariaLabel,
}: {
  series: Series[];
  ariaLabel: string;
}) {
  const { selected, setSelected } = useLinkedSelection();
  return (
    <LineChart
      width={320}
      height={220}
      series={series}
      ariaLabel={ariaLabel}
      selection={selected}
      onSelectionChange={setSelected}
    />
  );
}

/**
 * `#20`'s entity-linking half: two `LineChart`s -- different metrics, same
 * series ids -- mounted under one `SelectionProvider`. Toggling a series in
 * either chart's legend (`A3`) filters BOTH, because both read/write the
 * SAME shared `selected` set through `useLinkedSelection`, not independent
 * internal state. This is a real, working crossfilter, composed entirely
 * from existing per-chart props -- `SelectionProvider` only lifts the state
 * one level so two components can share it.
 */
export const LinkedLegendSelection: BaseStory = {
  render: () => (
    <SelectionProvider>
      <div style={{ display: "flex", gap: 24 }}>
        <LinkedLineChart
          series={revenueFixture}
          ariaLabel="Revenue by region, linked to the orders chart"
        />
        <LinkedLineChart
          series={ordersFixture}
          ariaLabel="Orders by region, linked to the revenue chart"
        />
      </div>
    </SelectionProvider>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const opacityOf = (el: SVGPathElement) => {
      const a = el.getAttribute("opacity");
      return a == null ? 1 : Number(a);
    };
    // Each chart draws EU's path before US's (series array order) -- so
    // path[0]/path[2] are EU (revenue, orders) and path[1]/path[3] are US.
    const paths = () =>
      Array.from(canvasElement.querySelectorAll<SVGPathElement>("path"));

    await step("At rest, every series in both charts is visible", async () => {
      const ps = paths();
      expect(ps).toHaveLength(4);
      for (const p of ps) expect(opacityOf(p)).toBe(1);
    });

    await step(
      "Toggling US in the revenue chart's legend also filters the orders chart",
      async () => {
        // Two "US" legend buttons exist (one per chart); click the first
        // (revenue chart)'s.
        const usButtons = canvas.getAllByRole("button", { name: /US/i });
        await userEvent.click(usButtons[0]);
        const [euRevenue, usRevenue, euOrders, usOrders] = paths();
        expect(opacityOf(euRevenue)).toBe(0); // filtered out (not selected)
        expect(opacityOf(usRevenue)).toBe(1); // selected
        expect(opacityOf(euOrders)).toBe(0); // SAME shared selection
        expect(opacityOf(usOrders)).toBe(1);
      }
    );

    await step("Clearing the selection restores both charts", async () => {
      const usButtons = canvas.getAllByRole("button", { name: /US/i });
      await userEvent.click(usButtons[0]); // toggle off -> selection empty again
      for (const p of paths()) expect(opacityOf(p)).toBe(1);
    });
  },
};

/* -------------------------------------------------------------------------- */
/* BrushToZoom -- brushed-domain broadcast, hand-rolled overview + detail     */
/* -------------------------------------------------------------------------- */

// No chart component accepts an external domain override or exposes an
// invertible scale to `children` (`useChartScales()` is forward-only --
// `scale-context.tsx`'s own doc comment; the same gap `#18`'s FacetGrid
// stories already documented for a different reason). So, like those
// stories, this demo draws its overview/detail panes directly with the raw
// `@visx/scale` this module already depends on, rather than pretending a
// real chart supports domain injection it does not.
const dense = Array.from({ length: 40 }, (_, i) => ({
  x: new Date(2026, 0, 1 + i),
  y: 50 + 30 * Math.sin(i / 4) + i * 2,
}));
const fullDomain = extent(dense, (d) => d.x) as [Date, Date];

// Local-time `YYYY-MM-DD`, not `toISOString` -- the fixture dates are built
// with the local-time `Date(y, m, d)` constructor, and `toISOString` renders
// in UTC, which shifts the displayed day whenever the test runner's zone
// isn't UTC (off by one to either side depending on the offset's sign).
const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

function Overview({ width, height }: { width: number; height: number }) {
  const theme = useChartTheme();
  const { setBrushedDomain } = useLinkedSelection();
  const x = scaleTime({ domain: fullDomain, range: [0, width] });
  const y = scaleLinear({
    domain: extent(dense, (d) => d.y) as [number, number],
    range: [height, 0],
    nice: true,
  });
  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Overview -- drag to select a range"
    >
      <ChartScaleProvider
        value={{
          yScale: (v) => y(v),
          xScale: (v) => x(v instanceof Date ? v : new Date(v)),
          xBandwidth: 0,
          innerWidth: width,
          innerHeight: height,
        }}
      >
        <LinePath
          data={dense}
          x={(d) => x(d.x)}
          y={(d) => y(d.y)}
          curve={curveMonotoneX}
          stroke={theme.accent}
          strokeWidth={2}
        />
        <Brush
          onBrushEnd={(range) => {
            if (!range) {
              setBrushedDomain(null);
              return;
            }
            setBrushedDomain([
              x.invert(range[0]).getTime(),
              x.invert(range[1]).getTime(),
            ]);
          }}
        />
      </ChartScaleProvider>
    </svg>
  );
}

function Detail({ width, height }: { width: number; height: number }) {
  const theme = useChartTheme();
  const { brushedDomain } = useLinkedSelection();
  const domain: [Date, Date] = brushedDomain
    ? [new Date(brushedDomain[0]), new Date(brushedDomain[1])]
    : fullDomain;
  const visible = dense.filter((d) => d.x >= domain[0] && d.x <= domain[1]);
  const x = scaleTime({ domain, range: [0, width] });
  const y = scaleLinear({
    domain: extent(visible.length ? visible : dense, (d) => d.y) as [
      number,
      number,
    ],
    range: [height, 0],
    nice: true,
  });
  return (
    <div>
      <div data-testid="detail-domain">
        {fmtDate(domain[0])} – {fmtDate(domain[1])}
      </div>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label="Detail, zoomed to the brushed range"
      >
        <LinePath
          data={visible}
          x={(d) => x(d.x)}
          y={(d) => y(d.y)}
          curve={curveMonotoneX}
          stroke={theme.positive}
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}

/**
 * `#20`'s brush-linking half: dragging across the overview publishes a
 * brushed x-domain (inverted from pixels via the overview's OWN raw
 * `scaleTime`, per `Brush`'s doc comment -- the shared `ChartScaleProvider`
 * context only has forward accessors) into `SelectionProvider`; the detail
 * pane reads it and narrows its own domain to match, with the full range as
 * the `null` (uncleared) default. Deliberately not attempted: an actual
 * zoom *gesture* (pinch/scroll-wheel) on the detail pane -- `TODO.md`'s own
 * text for this item already flags that as needing `@visx/zoom`, a separate
 * capability from "a drag selects a range."
 */
export const BrushToZoom: BaseStory = {
  render: () => (
    <SelectionProvider>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Overview width={480} height={140} />
        <Detail width={480} height={180} />
      </div>
    </SelectionProvider>
  ),
  play: async ({ canvasElement, step }) => {
    await step("Detail starts at the full range (no brush yet)", async () => {
      const label = canvasElement.querySelector(
        '[data-testid="detail-domain"]'
      );
      expect(label?.textContent).toBe("2026-01-01 – 2026-02-09");
    });

    await step(
      "Dragging across the overview narrows the detail pane",
      async () => {
        const captureRect = canvasElement.querySelector<SVGRectElement>(
          'svg[aria-label^="Overview"] rect'
        )!;
        const box = captureRect.getBoundingClientRect();
        const y = box.top + box.height / 2;
        // Drag the left quarter of the overview -- well past `minPixels`.
        fireEvent.mouseDown(captureRect, {
          clientX: box.left + 20,
          clientY: y,
        });
        fireEvent.mouseMove(captureRect, {
          clientX: box.left + box.width * 0.25,
          clientY: y,
        });
        fireEvent.mouseUp(captureRect, {
          clientX: box.left + box.width * 0.25,
          clientY: y,
        });

        await waitFor(() => {
          const label = canvasElement.querySelector(
            '[data-testid="detail-domain"]'
          );
          expect(label?.textContent).not.toBe("2026-01-01 – 2026-02-09");
        });
        // Narrowed FROM the full 40-day range -- the exact bounds depend on
        // the overview's measured pixel width, so assert the shape of the
        // change (still starts at day 1, now ends well before day 40) rather
        // than an exact date.
        const label = canvasElement.querySelector(
          '[data-testid="detail-domain"]'
        );
        expect(label?.textContent).toMatch(/^2026-01-0[1-9]/);
        expect(label?.textContent).not.toContain("02-09");
      }
    );
  },
};
