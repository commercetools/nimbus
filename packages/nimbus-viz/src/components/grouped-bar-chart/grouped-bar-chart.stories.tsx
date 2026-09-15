import type { Meta } from "@storybook/react-vite";
import { userEvent, fireEvent, waitFor, expect } from "storybook/test";
import { GroupedBarChart } from "./grouped-bar-chart";
import type { StackRow } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

const meta: Meta = {
  title: "Charts/GroupedBarChart",
  render: () => <RegistryPreview base="GroupedBarChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * `showValues` draws each series bar's own formatted value directly above
 * (or below, negative segment) its outer end -- mirroring `bar-chart.tsx`'s
 * opt-in label. Proven the same way: the with-labels chart carries exactly
 * one extra `<text>` per bar segment over the without-labels chart.
 */
const showValuesFixture: StackRow[] = [
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
];

export const ShowValues: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 24 }}>
      <GroupedBarChart
        width={280}
        height={280}
        data={showValuesFixture}
        ariaLabel="Grouped bar chart without value labels"
      />
      <GroupedBarChart
        width={280}
        height={280}
        data={showValuesFixture}
        showValues
        ariaLabel="Grouped bar chart with value labels"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Scope to the two charts' own root <svg> (GroupedBarChart uses the
    // library default role="img" -- it has no keyboard-focusable marks).
    // Axis tick labels render their own nested <svg> (visx's positioning
    // trick), which would otherwise inflate this count too.
    const svgs = canvasElement.querySelectorAll('svg[role="img"]');
    expect(svgs).toHaveLength(2);
    const textCount = (svg: Element) => svg.querySelectorAll("text").length;
    const segmentCount = showValuesFixture.reduce(
      (sum, row) => sum + row.segments.length,
      0
    );
    expect(textCount(svgs[1])).toBe(textCount(svgs[0]) + segmentCount);
  },
};

/**
 * Hover/tooltip UX convergence: hovering a bar outlines every bar sharing
 * its series key across every category -- this chart's existing "highlight
 * that series" behavior (see the doc comment on the component) -- instead of
 * dimming the other series to a fixed opacity. A same-category,
 * different-series bar is a real sibling and stays un-outlined. The
 * tooltip's vertical position tracks the live pointer while it stays inside
 * the hovered bar.
 */
const hoverFixture: StackRow[] = [
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
];

export const HoverEmphasis: BaseStory = {
  render: () => (
    <GroupedBarChart width={480} height={280} data={hoverFixture} />
  ),
  play: async ({ canvasElement }) => {
    const bars = () =>
      Array.from(canvasElement.querySelectorAll<SVGPathElement>("path"));
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');
    const tooltipTop = () => {
      const g = tooltipGroup();
      const match = g?.getAttribute("transform")?.match(/,\s*([\d.-]+)\)/);
      return match ? Number(match[1]) : null;
    };

    // DOM order follows data order: Q1/New, Q1/Returning, Q2/New, Q2/Returning.
    const [q1New, q1Returning, q2New, q2Returning] = bars();
    await userEvent.hover(q1New);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every bar keeps a full, unmodified fill -- none carries
    // an `opacity` attribute at all (the old mechanism this replaces).
    for (const bar of bars()) {
      expect(bar).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: the hovered bar AND every other-category bar
    // sharing its series key ("New") get a real outline; a same-category,
    // different-series sibling ("Returning") does not.
    expect(q1New).toHaveAttribute("stroke-width", "1.5");
    expect(q2New).toHaveAttribute("stroke-width", "1.5");
    expect(q1Returning).toHaveAttribute("stroke-width", "0");
    expect(q2Returning).toHaveAttribute("stroke-width", "0");

    // Tooltip follows the pointer: two mousemoves at different heights
    // within the SAME bar move the tooltip to two different positions.
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
 * BC-1 regression: `bandByIndex` positions the outer band by row order, not
 * by the category label, so rows sharing one label ("Q1" below, after
 * `duplicateLabels`) still render as three distinct groups instead of
 * collapsing onto a single band.
 */
const dupFixture: StackRow[] = duplicateLabels([
  {
    category: "Q1",
    segments: [
      { key: "New", value: 10 },
      { key: "Returning", value: 5 },
    ],
  },
  {
    category: "Q2",
    segments: [
      { key: "New", value: 14 },
      { key: "Returning", value: 9 },
    ],
  },
  {
    category: "Q3",
    segments: [
      { key: "New", value: 8 },
      { key: "Returning", value: 12 },
    ],
  },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <GroupedBarChart
      width={360}
      height={240}
      data={dupFixture}
      ariaLabel="Grouped bar chart with duplicate category labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const segmentsPerRow = dupFixture[0].segments.length;
    const bars = Array.from(canvasElement.querySelectorAll("path"));
    expect(bars.length).toBe(dupFixture.length * segmentsPerRow);

    // Each row's first bar's path starts at a different x, even though every
    // row shares the same category label.
    const firstBarXs = bars
      .filter((_, i) => i % segmentsPerRow === 0)
      .map((p) => p.getAttribute("d")?.match(/^M([\d.-]+),/)?.[1]);
    expect(new Set(firstBarXs).size).toBe(dupFixture.length);
  },
};

/**
 * BC-2 (`docs/bug-classes.md`): a `[0, max]` value domain draws a negative
 * segment beyond the plot instead of on the other side of the zero
 * baseline. Segments are per-series deltas (a cohort can churn negative), so
 * `GroupedBarChart` must draw them from a shared zero baseline like the bar
 * chart does. `negateEveryOther` only negates a flat `value` field and can't
 * reach the nested `segments` array here, so this fixture is hand-built:
 * Q2's segments are negative, flanked by all-positive Q1 and Q3.
 */
const negativeFixture: StackRow[] = [
  {
    category: "Q1",
    segments: [
      { key: "New", value: 10 },
      { key: "Returning", value: 5 },
    ],
  },
  {
    category: "Q2",
    segments: [
      { key: "New", value: -8 },
      { key: "Returning", value: -4 },
    ],
  },
  {
    category: "Q3",
    segments: [
      { key: "New", value: 12 },
      { key: "Returning", value: 6 },
    ],
  },
];

export const EdgeCaseNegativeValues: BaseStory = {
  render: () => (
    <GroupedBarChart
      width={360}
      height={240}
      data={negativeFixture}
      ariaLabel="Grouped bar chart of orders by quarter with a churned Q2"
    />
  ),
  play: async ({ canvasElement }) => {
    const segmentsPerRow = negativeFixture[0].segments.length;
    const bars = Array.from(
      canvasElement.querySelectorAll<SVGPathElement>("path")
    );
    expect(bars).toHaveLength(negativeFixture.length * segmentsPerRow);

    // Row order follows `data` order: Q1 (positive) bars 0-1, Q2 (negative)
    // bars 2-3, Q3 (positive) bars 4-5. Every positive bar grows up from the
    // same zero baseline, so its bottom edge is that baseline.
    const positiveBars = [bars[0], bars[1], bars[4], bars[5]];
    const negativeBars = [bars[2], bars[3]];
    const baseline = Math.min(
      ...positiveBars.map((b) => b.getBoundingClientRect().bottom)
    );

    for (const bar of negativeBars) {
      const rect = bar.getBoundingClientRect();
      expect(rect.height).toBeGreaterThan(1);
      // A negative bar hangs down from the baseline instead of extrapolating
      // past it, so its top edge sits at or below the positive bars' bottom.
      expect(rect.top).toBeGreaterThanOrEqual(baseline - 1);
    }
  },
};

/**
 * C2: `renderTooltip` and `renderLegendItem` are the escape hatches for a
 * fully custom hover readout / legend item, replacing (not augmenting) the
 * default two-line tooltip and swatch+label legend row.
 */
const customFixture: StackRow[] = [
  {
    category: "Q1",
    segments: [
      { key: "New", value: 10 },
      { key: "Returning", value: 5 },
    ],
  },
  {
    category: "Q2",
    segments: [
      { key: "New", value: 14 },
      { key: "Returning", value: 9 },
    ],
  },
];

export const CustomTooltipAndLegend: BaseStory = {
  render: () => (
    <GroupedBarChart
      width={360}
      height={240}
      data={customFixture}
      ariaLabel="Grouped bar chart with a custom tooltip and legend"
      renderTooltip={(seg) => (
        <text data-testid="custom-tooltip">{`${seg.key} = ${seg.value} units`}</text>
      )}
      renderLegendItem={(item) => <em>{`Series: ${item.label}`}</em>}
    />
  ),
  play: async ({ canvasElement }) => {
    // The custom legend render replaces the default swatch + bare label.
    expect(canvasElement.textContent).toContain("Series: New");
    expect(canvasElement.textContent).toContain("Series: Returning");

    // Hovering the first bar shows the custom tooltip content, not the
    // default "Q1 / New: 10" two-line readout.
    const firstBar = canvasElement.querySelector<SVGPathElement>("path");
    await userEvent.hover(firstBar!);
    await waitFor(() => {
      expect(
        canvasElement.querySelector('[data-testid="custom-tooltip"]')
      ).toBeTruthy();
    });
    expect(canvasElement.textContent).toContain("New = 10 units");
  },
};

/**
 * `D2`: `texture` fills each series' bar with a per-key SVG pattern (in
 * addition to color) so series stay distinguishable without color. Proven
 * directly: every bar's `fill` is a `url(#...)` pattern reference, and
 * `<defs>` has one `<pattern>` per series key.
 */
const textureFixture: StackRow[] = [
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
];

export const Texture: BaseStory = {
  render: () => (
    <GroupedBarChart
      width={360}
      height={240}
      data={textureFixture}
      texture
      ariaLabel="Grouped bar chart with per-series textures"
    />
  ),
  play: async ({ canvasElement }) => {
    const keyCount = textureFixture[0].segments.length;
    const patterns = canvasElement.querySelectorAll("defs > pattern");
    expect(patterns).toHaveLength(keyCount);
    const marks = Array.from(
      canvasElement.querySelectorAll("path.visx-bar-rounded")
    ).filter((el) => el.getAttribute("fill")?.startsWith("url(#"));
    expect(marks.length).toBe(textureFixture.length * keyCount);
  },
};
