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

/**
 * `showValues`: labels each band with its own value, once, at the chart's
 * right edge -- the composition equivalent of what `BarChart`'s `showValues`
 * draws at each bar's end. Default `false`; omitting the prop renders exactly
 * as before this existed. Two instances side by side (each its own distinct
 * `ariaLabel`, this file's own established multi-instance convention) prove
 * the causal link directly: turning the prop on adds exactly one new `<text>`
 * per series, not a guessed formatted string.
 */
export const ShowValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <StackedAreaChart
        width={280}
        height={280}
        series={fixture}
        ariaLabel="Stacked area chart without value labels"
      />
      <StackedAreaChart
        width={280}
        height={280}
        series={fixture}
        showValues
        ariaLabel="Stacked area chart with value labels"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Scope to the two charts' own root <svg> (StackedAreaChart uses the
    // library's default role="img" -- unlike BarChart's roving-tabindex
    // "graphics-document" -- so this is the role that actually identifies
    // each chart's own outer SVG here).
    const svgs = canvasElement.querySelectorAll('svg[role="img"]');
    expect(svgs).toHaveLength(2);
    const textCount = (svg: Element) => svg.querySelectorAll("text").length;
    expect(textCount(svgs[1])).toBe(textCount(svgs[0]) + fixture.length);
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
 * A stack can encode a signed composition via a diverging offset
 * (`AreaStack`'s `offset="diverging"`, wrapping d3-shape's
 * `stackOffsetDiverging`): positive series values stack upward from 0,
 * negative values (a return, a write-off) stack downward from 0. "Base" stays
 * positive throughout ([0, 20] in value space, never below the baseline);
 * "Adjustment" goes from +20 (stacked above Base) to -20 (stacked below the
 * baseline) at the second point. Proven on the rendered path's bounding
 * box: Adjustment's bottom edge must sit meaningfully below Base's bottom
 * edge, which never leaves the positive side.
 */
export const EdgeCaseNegativeValue: BaseStory = {
  render: () => (
    <StackedAreaChart
      width={280}
      height={220}
      ariaLabel="Stacked area with a negative adjustment value"
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
    for (const p of paths) {
      expect(p.getAttribute("d")).not.toMatch(/NaN/);
    }
    // Draw order follows `keys` = series order: "base" then "adj".
    const [baseBox, adjBox] = paths.map((p) => p.getBBox());
    const baseBottom = baseBox.y + baseBox.height;
    const adjBottom = adjBox.y + adjBox.height;
    expect(adjBottom).toBeGreaterThan(baseBottom + 5);
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

/**
 * `D2`: `texture` fills each series' area with a per-series SVG pattern (in
 * addition to color) so layers stay distinguishable without color. Proven
 * directly: every layer's `fill` is a `url(#...)` pattern reference, and
 * `<defs>` has one `<pattern>` per series.
 */
export const Texture: BaseStory = {
  render: () => (
    <StackedAreaChart
      width={480}
      height={280}
      series={fixture}
      texture
      ariaLabel="Stacked area chart with per-series textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(fixture.length);
    const layers = Array.from(canvasElement.querySelectorAll("path")).filter(
      (p) => p.getAttribute("fill")?.startsWith("url(#")
    );
    expect(layers.length).toBe(fixture.length);
  },
};

// `E5`: a 500-row dense series (both keys), well past a 40-row
// decimateThreshold -- same fixture-density convention as line-chart's own
// `Decimated` story.
const denseFixture: Series[] = [
  {
    id: "north",
    label: "North",
    data: Array.from({ length: 500 }, (_, i) => ({
      x: new Date(2026, 0, 1 + i),
      y: 20 + 15 * Math.sin(i / 12) + (i === 250 ? 30 : 0), // one sharp spike
    })),
  },
  {
    id: "south",
    label: "South",
    data: Array.from({ length: 500 }, (_, i) => ({
      x: new Date(2026, 0, 1 + i),
      y: 15 + 10 * Math.cos(i / 10),
    })),
  },
];

/**
 * `decimateThreshold` downsamples the DRAWN stack via LTTB (run against each
 * row's stacked total), well past its threshold here (500 rows -> ~40) --
 * proving each layer's path shrinks to a fraction of what 500 undecimated
 * rows would produce, while the axis domain still reflects the full series
 * (the spike at day 250 stays in the visible y-range).
 */
export const Decimated: BaseStory = {
  render: () => (
    <StackedAreaChart
      width={480}
      height={280}
      series={denseFixture}
      decimateThreshold={40}
      ariaLabel="Dense stacked area drawn with LTTB decimation"
    />
  ),
  play: async ({ canvasElement }) => {
    const paths = canvasElement.querySelectorAll<SVGPathElement>("path");
    expect(paths.length).toBe(denseFixture.length);
    for (const path of Array.from(paths)) {
      const d = path.getAttribute("d") ?? "";
      // An AreaStack path traces forward along the top edge then back along
      // the bottom (curveMonotoneX emits one "C" per point on each edge), so
      // 500 undecimated rows would produce roughly 1000 "C" commands; a
      // ~40-row decimation should land far below that, but still draw a
      // real shape, not a degenerate sliver.
      const commands = d.match(/[MLC]/g) ?? [];
      expect(commands.length).toBeLessThan(250);
      expect(commands.length).toBeGreaterThan(20);
      expect(d).not.toMatch(/NaN/);
    }
  },
};
