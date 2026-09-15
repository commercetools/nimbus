import type { Meta } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { DumbbellChart, ResponsiveContainer, type DumbbellRow } from "../../";
import { duplicateLabels } from "../../stories/adversarial";
import type { BaseStory } from "../../stories/base-story";

const data = [
  { category: "Marketing", start: 40, end: 55 },
  { category: "Sales", start: 60, end: 58 },
  { category: "Support", start: 35, end: 50 },
  { category: "Engineering", start: 70, end: 82 },
  { category: "Product", start: 45, end: 47 },
];

const meta: Meta = {
  title: "Charts/DumbbellChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <DumbbellChart width={width} height={height} data={data} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * Hover/tooltip UX convergence with `bar-chart.tsx`: hovering a row outlines
 * both its dots (`chart/marks.ts`'s `ACTIVE_STROKE_WIDTH`) and never dims
 * the other rows' `opacity` (the old mechanism this replaces). No
 * tooltip-follows-pointer part here -- the connecting line and its
 * fixed-radius (r=5) dots have no wide mark to move a pointer within.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <DumbbellChart width={480} height={320} data={data} />,
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    const connectors = () =>
      Array.from(
        svg!.querySelectorAll<SVGLineElement>('line[stroke-linecap="round"]')
      );
    const circles = () =>
      Array.from(svg!.querySelectorAll<SVGCircleElement>("circle"));

    const firstConnector = connectors()[0];
    await userEvent.hover(firstConnector);
    await waitFor(() =>
      expect(circles()[0]).toHaveAttribute("stroke-width", "1.5")
    );

    // No dimming: every row's <g> wrapper keeps full, unmodified opacity --
    // none carries an `opacity` attribute tied to hover (the old mechanism
    // this replaces).
    for (const g of Array.from(svg!.querySelectorAll("g"))) {
      expect(g).not.toHaveAttribute("opacity");
    }

    // Emphasis instead: only the hovered row's two dots get a real outline.
    expect(circles()[0]).toHaveAttribute("stroke-width", "1.5");
    expect(circles()[1]).toHaveAttribute("stroke-width", "1.5");
    expect(circles()[2]).toHaveAttribute("stroke-width", "1"); // sibling row, unhovered
    expect(circles()[3]).toHaveAttribute("stroke-width", "1");
  },
};

const duplicateLabelRows: DumbbellRow[] = duplicateLabels([
  { category: "Marketing", start: 40, end: 55 },
  { category: "Sales", start: 60, end: 58 },
  { category: "Support", start: 35, end: 50 },
]);

// BC-1 regression guard: all three rows now share one category. Position
// must come from row index (via `bandByIndex`), not from the category text,
// so the three connector lines still draw at distinct vertical positions
// instead of collapsing onto a single band.
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <DumbbellChart
      width={480}
      height={320}
      data={duplicateLabelRows}
      ariaLabel="Dumbbell chart with duplicate category labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    const connectors = svg!.querySelectorAll('line[stroke-linecap="round"]');
    expect(connectors).toHaveLength(duplicateLabelRows.length);
    const y1s = new Set(
      Array.from(connectors).map((l) => l.getAttribute("y1"))
    );
    expect(y1s.size).toBe(duplicateLabelRows.length);
  },
};
