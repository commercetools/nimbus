import type { Meta } from "@storybook/react-vite";
import { userEvent, waitFor, expect } from "storybook/test";
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
