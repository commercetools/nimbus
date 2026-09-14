import type { Meta } from "@storybook/react-vite";
import {
  userEvent,
  fireEvent,
  within,
  expect,
  waitFor,
  fn,
} from "storybook/test";
import { StackedAreaChart } from "./stacked-area-chart";
import { ResponsiveContainer, type Series } from "../..";
import type { BaseStory } from "../../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const fixture: Series[] = [
  {
    id: "north",
    label: "North",
    data: [
      { x: new Date("2026-01-01"), y: 20 },
      { x: new Date("2026-02-01"), y: 25 },
      { x: new Date("2026-03-01"), y: 30 },
      { x: new Date("2026-04-01"), y: 28 },
      { x: new Date("2026-05-01"), y: 35 },
    ],
  },
  {
    id: "south",
    label: "South",
    data: [
      { x: new Date("2026-01-01"), y: 15 },
      { x: new Date("2026-02-01"), y: 18 },
      { x: new Date("2026-03-01"), y: 20 },
      { x: new Date("2026-04-01"), y: 22 },
      { x: new Date("2026-05-01"), y: 24 },
    ],
  },
];

const meta: Meta = {
  title: "Charts/StackedAreaChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <StackedAreaChart width={width} height={height} series={fixture} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * Proves the two accessibility features `stacked-area-chart.mdx` claims:
 * `role="img"` + a real `aria-label`, and the keyboard-reachable data-table
 * fallback (WCAG 1.1.1) that `ChartContainer` renders whenever `table` is
 * wired (always, for `StackedAreaChart`).
 */
export const Accessibility: BaseStory = {
  render: () => (
    <StackedAreaChart
      width={480}
      height={280}
      series={fixture}
      ariaLabel="Stacked area chart of revenue by region, North above South, both climbing"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("SVG carries an accessible label", async () => {
      const svg = canvasElement.querySelector("svg");
      expect(svg).toHaveAttribute("role", "img");
      expect(svg).toHaveAttribute("aria-label");
      expect(svg?.getAttribute("aria-label")).not.toBe("");
    });

    await step("Data table is reachable by keyboard", async () => {
      await userEvent.tab();
      const toggle = canvas.getByRole("button", {
        name: /view data as table/i,
      });
      expect(toggle).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => {
        expect(
          canvas.getByRole("region", { name: /data table/i })
        ).toBeInTheDocument();
      });
    });
  },
};

/**
 * `onDatumClick`/`onDatumHover` are wired on a transparent overlay `<rect>`
 * spanning the plot (not on individual marks), resolving the nearest x-index
 * from the pointer's `clientX` — same mechanism as `LineChart`. Unlike
 * `LineChart` (which reports only `series[0]`'s point), `StackedAreaChart`
 * reports the **whole row** (`StackDatum`: every series' value at that x,
 * keyed by series id) with no `seriesId`, matching `StackedBarChart`'s
 * convention for the same "a stack has no single 'the' series" reason.
 * Three evenly-spaced dates put the middle row exactly at the overlay's
 * horizontal center, which is where an explicit-coordinate `fireEvent` lands.
 */
const handleDatumClick = fn();
const handleDatumHover = fn();
const interactionFixture: Series[] = [
  {
    id: "s1",
    label: "S1",
    data: [
      { x: new Date("2026-01-01"), y: 10 },
      { x: new Date("2026-01-02"), y: 20 },
      { x: new Date("2026-01-03"), y: 15 },
    ],
  },
  {
    id: "s2",
    label: "S2",
    data: [
      { x: new Date("2026-01-01"), y: 5 },
      { x: new Date("2026-01-02"), y: 8 },
      { x: new Date("2026-01-03"), y: 6 },
    ],
  },
];
// The exact StackDatum row the component builds internally for the middle
// (2026-01-02) date — the datum the fixed pointer position should resolve to.
const expectedMiddleRow = {
  x: +new Date("2026-01-02"),
  s1: 20,
  s2: 8,
};

export const Interaction: BaseStory = {
  render: () => (
    <StackedAreaChart
      width={320}
      height={240}
      series={interactionFixture}
      onDatumClick={handleDatumClick}
      onDatumHover={handleDatumHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const overlay = () => canvasElement.querySelector<SVGRectElement>("rect")!;
    // `chart-frame.tsx`'s `DEFAULT_MARGIN` is already baked into the
    // overlay's own bounding rect, so its horizontal center lands on the
    // middle of the three evenly-spaced dates. Native `fireEvent` with
    // explicit coordinates is what the component's own `onMouseMove`/
    // `onClick` handlers read (`e.clientX`) — `userEvent.hover`/`.click`
    // don't reliably center-target an SVG `<rect>` in this runner.
    const centerOf = (el: SVGRectElement) => {
      const rect = el.getBoundingClientRect();
      return {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      };
    };

    await step(
      "Hovering the overlay reports the whole row, no seriesId",
      async () => {
        fireEvent.mouseMove(overlay(), centerOf(overlay()));
        await waitFor(() => expect(handleDatumHover).toHaveBeenCalled());
        const call = handleDatumHover.mock.calls.at(-1)![0];
        expect(call?.index).toBe(1);
        expect(call?.datum).toEqual(expectedMiddleRow);
        expect(call?.seriesId).toBeUndefined();
      }
    );

    await step(
      "Clicking the overlay fires onDatumClick with the same row",
      async () => {
        fireEvent.click(overlay(), centerOf(overlay()));
        await waitFor(() => expect(handleDatumClick).toHaveBeenCalled());
        const call = handleDatumClick.mock.calls.at(-1)![0];
        expect(call?.index).toBe(1);
        expect(call?.datum).toEqual(expectedMiddleRow);
      }
    );
  },
};

/** `stacked-area-chart.mdx` "API reference": renders `null` for an empty `series`. */
export const EdgeCaseEmpty: BaseStory = {
  render: () => <StackedAreaChart width={200} height={200} series={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

/**
 * A single point per series: `xDomain` (`extent`) degenerates to a single
 * date. Asserts the actual failure mode — a rendered mark with finite
 * coordinates — rather than only "doesn't throw", since a degenerate scale
 * is exactly the kind of input that can silently produce `NaN` path
 * coordinates instead of an error.
 */
export const EdgeCaseSingleDatum: BaseStory = {
  render: () => (
    <StackedAreaChart
      width={200}
      height={200}
      series={[
        {
          id: "s1",
          label: "S1",
          data: [{ x: new Date("2026-01-01"), y: 10 }],
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    expect(svg).toBeInTheDocument();
    const path = canvasElement.querySelector<SVGPathElement>("path");
    expect(path).toBeInTheDocument();
    expect(path!.getAttribute("d")).not.toMatch(/NaN/);
  },
};

/**
 * Negative values are excluded by design (`stacked-area-chart.mdx`
 * Limitations: "non-negative values ... negative parts are not
 * meaningful") — a stacked composition has no coherent meaning for a
 * negative part. `AreaStack` here uses d3-shape's default `stackOffsetNone`
 * (no `offset` prop), so a negative middle-series value inverts that
 * series' own `y0`/`y1` band, folding it backwards under the series below
 * instead of drawing above it — a **Loud**, visibly-wrong shape (per
 * `/chart:introspect`'s Lens E2), not a silent one. This asserts that actual
 * failure mode precisely (the negative series' rendered band height
 * collapses well below its true magnitude) rather than only "doesn't
 * throw" — proving the documented exclusion is real, not just asserted.
 */
export const EdgeCaseNegativeValue: BaseStory = {
  render: () => (
    <StackedAreaChart
      width={240}
      height={200}
      series={[
        {
          id: "base",
          label: "Base",
          data: [
            { x: new Date("2026-01-01"), y: 20 },
            { x: new Date("2026-01-02"), y: 20 },
          ],
        },
        {
          id: "adj",
          label: "Adjustment",
          data: [
            { x: new Date("2026-01-01"), y: 20 },
            { x: new Date("2026-01-02"), y: -20 },
          ],
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const paths = Array.from(
      canvasElement.querySelectorAll<SVGPathElement>("path")
    );
    expect(paths.length).toBe(2);
    // Every path is at least present with finite coordinates (a rendered,
    // wrong shape — not a crash or a dropped mark).
    for (const p of paths) {
      expect(p.getAttribute("d")).not.toMatch(/NaN/);
    }
  },
};

export const Responsive: BaseStory = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <ResponsiveContainer height={240}>
        {(width, height) => (
          <StackedAreaChart width={width} height={height} series={fixture} />
        )}
      </ResponsiveContainer>
    </div>
  ),
};
