import type { Meta } from "@storybook/react-vite";
import {
  userEvent,
  fireEvent,
  within,
  expect,
  waitFor,
  fn,
} from "storybook/test";
import { LineChart } from "./line-chart";
import { ResponsiveContainer, type Series } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const meta: Meta = {
  title: "Charts/LineChart",
  render: () => <RegistryPreview base="LineChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

const fixture: Series[] = [
  {
    id: "eu",
    label: "EU",
    data: [
      { x: new Date("2026-01-01"), y: 120 },
      { x: new Date("2026-02-01"), y: 148 },
      { x: new Date("2026-03-01"), y: 136 },
      { x: new Date("2026-04-01"), y: 172 },
    ],
  },
  {
    id: "us",
    label: "US",
    data: [
      { x: new Date("2026-01-01"), y: 90 },
      { x: new Date("2026-02-01"), y: 104 },
      { x: new Date("2026-03-01"), y: 128 },
      { x: new Date("2026-04-01"), y: 119 },
    ],
  },
];

export const Base: BaseStory = {};

/**
 * Proves the two accessibility features `line-chart.mdx` claims: `role="img"`
 * + a real `aria-label`, and the keyboard-reachable data-table fallback (WCAG
 * 1.1.1) that `ChartContainer` renders whenever `table` is wired (always, for
 * `LineChart`).
 */
export const Accessibility: BaseStory = {
  render: () => (
    <LineChart
      width={480}
      height={280}
      series={fixture}
      ariaLabel="Line chart of sessions by region, where EU stays above US and both climb"
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
 * `variant`: `"line"` (default, `LinePath`) vs `"area"` (`AreaClosed`, filled
 * at 0.16 opacity). Two instances of the same data on one page collide on the
 * auto-generated default `ariaLabel` and trip axe's `landmark-unique`
 * (`writing-chart-stories/SKILL.md`'s own documented pitfall) — each gets a
 * distinct, explicit `ariaLabel` here.
 */
export const Variant: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <LineChart
          width={320}
          height={240}
          series={fixture}
          ariaLabel="Line chart of sessions by region, line variant"
        />
      </div>
      <div style={{ flex: 1 }}>
        <LineChart
          width={320}
          height={240}
          series={fixture}
          variant="area"
          ariaLabel="Line chart of sessions by region, area variant"
        />
      </div>
    </div>
  ),
};

/**
 * `onDatumClick`/`onDatumHover` are wired on a transparent overlay `<rect>`
 * spanning the plot (not on individual marks — `LinePath`/`AreaClosed`
 * strokes/fills carry no accessible role or their own handlers), resolving
 * the nearest x-index from the pointer's `clientX`. Three evenly-spaced dates
 * put the middle point exactly at the overlay's horizontal center, which is
 * where `userEvent.hover`/`.click` land without explicit coordinates.
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
];

export const Interaction: BaseStory = {
  render: () => (
    <LineChart
      width={320}
      height={240}
      series={interactionFixture}
      onDatumClick={handleDatumClick}
      onDatumHover={handleDatumHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const overlay = () => canvasElement.querySelector<SVGRectElement>("rect")!;
    // The overlay's own bounding rect already accounts for the plot's
    // margin translation (`chart-frame.tsx`'s `DEFAULT_MARGIN`), so its
    // horizontal center lands on the middle of the three evenly-spaced
    // dates. `userEvent.hover`/`.click` don't reliably center-target an SVG
    // `<rect>` in this runner, so fire the native events with explicit
    // coordinates instead — this is exactly what the component's own
    // `onMouseMove`/`onClick` handlers read (`e.clientX`).
    const centerOf = (el: SVGRectElement) => {
      const rect = el.getBoundingClientRect();
      return {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      };
    };

    await step("Hovering the overlay reports the nearest datum", async () => {
      fireEvent.mouseMove(overlay(), centerOf(overlay()));
      await waitFor(() => expect(handleDatumHover).toHaveBeenCalled());
      const call = handleDatumHover.mock.calls.at(-1)![0];
      expect(call?.index).toBe(1);
      expect(call?.datum).toEqual(interactionFixture[0].data[1]);
      expect(call?.seriesId).toBe("s1");
    });

    await step(
      "Clicking the overlay fires onDatumClick with the same datum",
      async () => {
        fireEvent.click(overlay(), centerOf(overlay()));
        await waitFor(() => expect(handleDatumClick).toHaveBeenCalled());
        const call = handleDatumClick.mock.calls.at(-1)![0];
        expect(call?.index).toBe(1);
        expect(call?.datum).toEqual(interactionFixture[0].data[1]);
      }
    );
  },
};

/** `line-chart.mdx` "API reference": renders `null` for an empty `series`. */
export const EdgeCaseEmpty: BaseStory = {
  render: () => <LineChart width={200} height={200} series={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

/**
 * A single point per series: `xDomain` (`extent`) degenerates to a single
 * date, so the time scale's domain has zero width. Asserts the actual
 * failure mode — a rendered mark with finite coordinates — rather than only
 * "doesn't throw", since a degenerate scale is exactly the kind of input
 * that can silently produce `NaN` path coordinates instead of an error.
 */
export const EdgeCaseSingleDatum: BaseStory = {
  render: () => (
    <LineChart
      width={200}
      height={200}
      series={[
        { id: "s1", label: "S1", data: [{ x: new Date("2026-01-01"), y: 10 }] },
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
 * Negative values used to render off-scale: the y-domain was hardcoded to
 * `[0, yMax]`, so a negative point mapped below `innerHeight` (past the
 * plot's own bounds — `chart-frame.tsx` applies no clip). Fixed by widening
 * the domain to `[Math.min(0, yMin), Math.max(0, yMax)]`. `getBBox()` reports
 * true geometric extent in the plot's local coordinate system (independent
 * of any ancestor clipping), so asserting the line's bottom edge stays within
 * `innerHeight` (`height - margin.top - margin.bottom`, `chart-frame.tsx`'s
 * `DEFAULT_MARGIN`) directly proves the fix — it fails against the old
 * hardcoded domain for this fixture (value `-10` would map to local y ≈ 240,
 * well past `innerHeight = 160`).
 */
export const EdgeCaseNegativeValue: BaseStory = {
  render: () => (
    <LineChart
      width={240}
      height={200}
      series={[
        {
          id: "pnl",
          label: "P&L",
          data: [
            { x: new Date("2026-01-01"), y: 20 },
            { x: new Date("2026-01-02"), y: -10 },
            { x: new Date("2026-01-03"), y: 15 },
          ],
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const innerHeight = 200 - 12 - 28; // height - DEFAULT_MARGIN.top - .bottom
    const path = canvasElement.querySelector<SVGPathElement>("path")!;
    const bbox = path.getBBox();
    expect(bbox.y + bbox.height).toBeLessThanOrEqual(innerHeight + 1);
  },
};

/**
 * An all-negative series doesn't just draw off-scale — before the fix it
 * inverted (domain resolved to `[0, -5]` against `range: [innerHeight, 0]`).
 * The `variant="area"` fill has a second, distinct bug on top of the domain:
 * `AreaClosed`'s default baseline is `yScale.range()[0]` (a fixed pixel row),
 * not `yScale(0)` (the value-zero row) — the two only coincided by accident
 * under the old hardcoded `[0, yMax]` domain. Fixed with an explicit
 * `y0={() => yScale(0)}`. This fixture's domain is `[-20, 0]`, so `yScale(0)`
 * sits at local y ≈ 0 — the very top of the plot — but no *line* point ever
 * reaches that high (the closest value, -5, only gets to y ≈ 40). So the
 * fill's bounding-box top (`getBBox().y`) is a clean discriminator: ≈ 0 only
 * if the baseline is actually tracking zero (every baseline point shares
 * that one constant y); under the old bug the baseline sat at the fixed
 * bottom row instead, and the box top would be whatever the line trace's own
 * closest-to-zero point reached (y ≈ 40) — never the true top.
 */
export const EdgeCaseNegativeArea: BaseStory = {
  render: () => (
    <LineChart
      width={240}
      height={200}
      variant="area"
      series={[
        {
          id: "loss",
          label: "Loss",
          data: [
            { x: new Date("2026-01-01"), y: -10 },
            { x: new Date("2026-01-02"), y: -5 },
            { x: new Date("2026-01-03"), y: -20 },
          ],
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const path = canvasElement.querySelector<SVGPathElement>("path")!;
    const bbox = path.getBBox();
    expect(bbox.y).toBeLessThan(3); // ≈ yScale(0), not the line's own ≈40 top
  },
};

export const Responsive: BaseStory = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <ResponsiveContainer height={240}>
        {(width, height) => (
          <LineChart width={width} height={height} series={fixture} />
        )}
      </ResponsiveContainer>
    </div>
  ),
};
