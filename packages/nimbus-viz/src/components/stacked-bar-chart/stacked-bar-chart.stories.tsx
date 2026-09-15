import type { Meta } from "@storybook/react-vite";
import {
  userEvent,
  fireEvent,
  within,
  expect,
  waitFor,
  fn,
} from "storybook/test";
import { StackedBarChart } from "./stacked-bar-chart";
import { ResponsiveContainer, type StackRow } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const meta: Meta = {
  title: "Charts/StackedBarChart",
  render: () => <RegistryPreview base="StackedBarChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

const fixture: StackRow[] = [
  {
    category: "Q1",
    segments: [
      { key: "New", value: 120 },
      { key: "Returning", value: 80 },
      { key: "Wholesale", value: 40 },
    ],
  },
  {
    category: "Q2",
    segments: [
      { key: "New", value: 140 },
      { key: "Returning", value: 96 },
      { key: "Wholesale", value: 52 },
    ],
  },
];

export const Base: BaseStory = {};

/**
 * Hover/tooltip UX convergence: hovering a stack outlines every segment in
 * that ONE stack (`stroke`/`strokeWidth`) and never dims the other stacks --
 * replacing the "dim everyone else to a fixed opacity" pattern this chart
 * (and 30 others) used to hand-roll independently. The tooltip's vertical
 * position tracks the live pointer while it stays inside the hovered stack.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <StackedBarChart width={480} height={280} data={fixture} />,
  play: async ({ canvasElement }) => {
    // Every row's non-topmost segment renders as a plain <rect>; the
    // topmost as BarRounded (a <path class="visx-bar-rounded">) -- in DOM
    // order, per row: New (rect), Returning (rect), Wholesale (path).
    const marks = () =>
      Array.from(
        canvasElement.querySelectorAll<SVGGraphicsElement>(
          "rect, path.visx-bar-rounded"
        )
      );
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');
    const tooltipTop = () => {
      const g = tooltipGroup();
      const match = g?.getAttribute("transform")?.match(/,\s*([\d.-]+)\)/);
      return match ? Number(match[1]) : null;
    };

    const [q1New, q1Returning, q1Wholesale, q2New, q2Returning, q2Wholesale] =
      marks();
    await userEvent.hover(q1New);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every segment keeps a full, unmodified fill -- none
    // carries an `opacity` attribute at all (the old mechanism this
    // replaces).
    for (const mark of marks()) {
      expect(mark).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: every segment of the hovered stack (Q1) gets a real
    // outline; the other stack (Q2) does not.
    expect(q1New).toHaveAttribute("stroke-width", "1.5");
    expect(q1Returning).toHaveAttribute("stroke-width", "1.5");
    expect(q1Wholesale).toHaveAttribute("stroke-width", "1.5");
    expect(q2New).toHaveAttribute("stroke-width", "0");
    expect(q2Returning).toHaveAttribute("stroke-width", "0");
    expect(q2Wholesale).toHaveAttribute("stroke-width", "0");

    // Tooltip follows the pointer: two mousemoves at different heights
    // within the SAME stack move the tooltip to two different positions.
    const rect = q1New.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    fireEvent.mouseMove(q1New, {
      clientX: cx,
      clientY: rect.top + rect.height * 0.25,
    });
    const topNearTop = await waitFor(() => {
      const t = tooltipTop();
      expect(t).not.toBeNull();
      return t;
    });
    fireEvent.mouseMove(q1New, {
      clientX: cx,
      clientY: rect.top + rect.height * 0.75,
    });
    await waitFor(() => expect(tooltipTop()).not.toBe(topNearTop));
  },
};

/**
 * `chart/svg-tooltip.tsx`'s new colored-line feature (Phase G): each
 * per-segment tooltip row carries a dot swatch matching that segment's own
 * fill color, so a row can be tied back to its mark without cross-checking
 * the legend -- mirroring shadcn's `ChartTooltipContent` `indicator="dot"`.
 * The header and "Total" line stay plain (no swatch), unchanged.
 */
export const TooltipColorIndicators: BaseStory = {
  render: () => <StackedBarChart width={480} height={280} data={fixture} />,
  play: async ({ canvasElement }) => {
    const marks = () =>
      Array.from(
        canvasElement.querySelectorAll<SVGGraphicsElement>(
          "rect, path.visx-bar-rounded"
        )
      );
    const [q1New, q1Returning, q1Wholesale] = marks();
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');

    await userEvent.hover(q1New);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    const dots = () =>
      Array.from(tooltipGroup()!.querySelectorAll<SVGCircleElement>("circle"));
    await waitFor(() => expect(dots()).toHaveLength(3)); // one per segment key

    // Each dot's color matches its own segment's mark fill exactly --
    // proving the swatch is really tied to that row's series, not a
    // decorative default.
    expect(dots()[0]).toHaveAttribute("fill", q1New.getAttribute("fill"));
    expect(dots()[1]).toHaveAttribute("fill", q1Returning.getAttribute("fill"));
    expect(dots()[2]).toHaveAttribute("fill", q1Wholesale.getAttribute("fill"));
  },
};

/**
 * Proves the two accessibility features `stacked-bar-chart.mdx` claims:
 * `role="img"` + a real `aria-label`, and the keyboard-reachable data-table
 * fallback (WCAG 1.1.1) that `ChartContainer` renders whenever `table` is
 * wired (always, for `StackedBarChart`).
 */
export const Accessibility: BaseStory = {
  render: () => (
    <StackedBarChart
      width={480}
      height={280}
      data={fixture}
      ariaLabel="Stacked bar chart of orders by quarter, split into New, Returning, and Wholesale"
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
 * `onDatumClick`/`onDatumHover` are wired on each row's own `<g>` (a
 * discrete hit target, unlike `LineChart`/`StackedAreaChart`'s continuous
 * overlay `<rect>`) — same direct-mark-wiring pattern as `BarChart`. Both
 * report the **whole row** (`StackRow`), not one segment — the doc's own
 * "Row-level interaction" Limitation.
 */
const handleDatumClick = fn();
const handleDatumHover = fn();

export const Interaction: BaseStory = {
  render: () => (
    <StackedBarChart
      width={480}
      height={280}
      data={fixture}
      onDatumClick={handleDatumClick}
      onDatumHover={handleDatumHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    // The first row's non-topmost segments render as plain <rect>; hovering
    // any mark inside a row's <g> fires that row's handlers.
    const firstSegment = () =>
      canvasElement.querySelector<SVGRectElement>("rect");

    await step(
      "Hovering the first row reports its whole StackRow",
      async () => {
        await userEvent.hover(firstSegment()!);
        await waitFor(() => expect(handleDatumHover).toHaveBeenCalled());
        const call = handleDatumHover.mock.calls.at(-1)![0];
        expect(call?.datum).toEqual(fixture[0]);
        expect(call?.index).toBe(0);
      }
    );

    await step(
      "Clicking the first row fires onDatumClick with the same row",
      async () => {
        await userEvent.click(firstSegment()!);
        await waitFor(() => expect(handleDatumClick).toHaveBeenCalled());
        const call = handleDatumClick.mock.calls.at(-1)![0];
        expect(call?.datum).toEqual(fixture[0]);
        expect(call?.index).toBe(0);
      }
    );
  },
};

/** `stacked-bar-chart.mdx` "API reference": renders `null` for empty `data`. */
export const EdgeCaseEmpty: BaseStory = {
  render: () => <StackedBarChart width={200} height={200} data={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

/**
 * A row with a single segment: `lastIdx` (`segments.length - 1`) is `0`, so
 * that one segment is both the first and the last — it takes the
 * `BarRounded`/`top` path unconditionally rather than the plain `<rect>`
 * path most segments use. Asserts the actual rendered shape (a finite,
 * non-`NaN` path), not just "doesn't throw".
 */
export const EdgeCaseSingleSegment: BaseStory = {
  render: () => (
    <StackedBarChart
      width={200}
      height={200}
      data={[{ category: "Q1", segments: [{ key: "Total", value: 100 }] }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const path = canvasElement.querySelector<SVGPathElement>("path");
    expect(path).toBeInTheDocument();
    expect(path!.getAttribute("d")).not.toMatch(/NaN/);
  },
};

/**
 * Found while introspecting this chart: the topmost segment always renders
 * as `BarRounded` (`stacked-bar-chart.tsx`'s `h = Math.max(0, y0 - y1 - 2)`),
 * and a zero-value topmost segment collapses `h` to exactly `0`. Traced
 * through `@visx/shape`'s `BarRounded` source: its radius clamp is
 * `Math.max(1, Math.min(radius, Math.min(width, height) / 2))`, which floors
 * to `1` even when `height` is `0` — the generated path's height terms don't
 * agree, producing a degenerate (self-overlapping) path rather than a clean
 * empty rect. Visually near-imperceptible (sub-2px), but this asserts the
 * actual failure mode (a still-finite, non-`NaN` path) rather than only "no
 * crash" — proving the degenerate case doesn't escalate into something
 * worse (an invalid/`NaN` path) even though the geometry itself is a known,
 * accepted rough edge.
 */
export const EdgeCaseZeroTopmostSegment: BaseStory = {
  render: () => (
    <StackedBarChart
      width={240}
      height={200}
      data={[
        {
          category: "Q1",
          segments: [
            { key: "Base", value: 100 },
            { key: "Extra", value: 0 },
          ],
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const path = canvasElement.querySelector<SVGPathElement>("path");
    expect(path).toBeInTheDocument();
    expect(path!.getAttribute("d")).not.toMatch(/NaN/);
  },
};

/**
 * BC-1 regression: `bandByIndex` positions each row's band by row order, not
 * by the category label, so three rows sharing one label ("Q1" below, after
 * `duplicateLabels`) still render at three distinct x positions instead of
 * collapsing onto a single band.
 */
const dupFixture: StackRow[] = duplicateLabels([
  {
    category: "Q1",
    segments: [
      { key: "New", value: 120 },
      { key: "Returning", value: 80 },
    ],
  },
  {
    category: "Q2",
    segments: [
      { key: "New", value: 140 },
      { key: "Returning", value: 96 },
    ],
  },
  {
    category: "Q3",
    segments: [
      { key: "New", value: 90 },
      { key: "Returning", value: 60 },
    ],
  },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <StackedBarChart
      width={360}
      height={240}
      data={dupFixture}
      ariaLabel="Stacked bar chart with duplicate category labels"
    />
  ),
  play: async ({ canvasElement }) => {
    // Every row's non-topmost segment renders as a plain <rect>; the
    // topmost renders as BarRounded (a <path>).
    const rects = canvasElement.querySelectorAll("rect");
    const paths = canvasElement.querySelectorAll("path");
    expect(rects.length + paths.length).toBe(
      dupFixture.length * dupFixture[0].segments.length
    );
    expect(
      new Set(Array.from(rects).map((r) => r.getAttribute("x"))).size
    ).toBe(dupFixture.length);
  },
};

/**
 * A stack can encode a signed composition via a diverging offset: positive
 * segments stack upward from 0, negative segments (a return, a write-off)
 * stack downward from 0 -- not a clamp. `Refunds` is the only negative
 * segment, so it alone occupies the negative side and its top edge should
 * meet `Sales`' bottom edge exactly at the zero baseline, with both bars a
 * real, non-zero size (previously: negative segments clamped to a zero-height
 * rect; see `docs/bug-classes.md` BC-2 history).
 */
const negFixture: StackRow[] = [
  {
    category: "Q1",
    segments: [
      { key: "Refunds", value: -30 },
      { key: "Sales", value: 140 },
    ],
  },
];

export const EdgeCaseNegativeValues: BaseStory = {
  render: () => (
    <StackedBarChart
      width={240}
      height={240}
      data={negFixture}
      ariaLabel="Stacked bar chart with a negative refunds segment"
    />
  ),
  play: async ({ canvasElement }) => {
    // Both segments are the sole occupant of their side (positive/negative),
    // so both get a rounded outer corner and render as BarRounded's <path>,
    // in the same order as the input array: Refunds (negative) first.
    const marks = Array.from(
      canvasElement.querySelectorAll<SVGGraphicsElement>(
        "path.visx-bar-rounded"
      )
    );
    expect(marks.length).toBe(2);
    const [refunds, sales] = marks.map((m) => m.getBBox());
    expect(refunds.height).toBeGreaterThan(0);
    expect(sales.height).toBeGreaterThan(0);
    // Refunds (below the baseline) starts at or just past where Sales
    // (above it) ends -- never above it, never far below it. Both bars carry
    // the chart's usual 2px cosmetic inset from the boundary they touch, so
    // this is a small gap, not an exact meeting point.
    const gap = refunds.y - (sales.y + sales.height);
    expect(gap).toBeGreaterThanOrEqual(-0.5);
    expect(gap).toBeLessThan(10);
    for (const m of marks) {
      expect(m.getAttribute("d")).not.toMatch(/NaN/);
    }
  },
};

export const Responsive: BaseStory = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <ResponsiveContainer height={240}>
        {(width, height) => (
          <StackedBarChart width={width} height={height} data={fixture} />
        )}
      </ResponsiveContainer>
    </div>
  ),
};

/**
 * `D2`: `texture` fills each segment with a per-key SVG pattern (in addition
 * to color) so segments stay distinguishable without color. Proven
 * directly: every segment's `fill` is a `url(#...)` pattern reference, and
 * `<defs>` has one `<pattern>` per segment key.
 */
export const Texture: BaseStory = {
  render: () => (
    <StackedBarChart
      width={360}
      height={240}
      data={fixture}
      texture
      ariaLabel="Stacked bar chart with per-segment textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const keyCount = fixture[0].segments.length;
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(keyCount);
    const marks = Array.from(
      canvasElement.querySelectorAll("rect, path.visx-bar-rounded")
    ).filter((el) => el.getAttribute("fill")?.startsWith("url(#"));
    expect(marks.length).toBe(fixture.length * keyCount);
  },
};
