import type { Meta } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { SlopeChart, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const data = [
  { id: "alpha", label: "Alpha", left: 30, right: 45 },
  { id: "beta", label: "Beta", left: 55, right: 40 },
  { id: "gamma", label: "Gamma", left: 20, right: 25 },
  { id: "delta", label: "Delta", left: 60, right: 58 },
  { id: "epsilon", label: "Epsilon", left: 35, right: 50 },
];

const meta: Meta = {
  title: "Charts/SlopeChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <SlopeChart
          width={width}
          height={height}
          data={data}
          leftLabel="Q1"
          rightLabel="Q2"
        />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * Hover/tooltip UX convergence with `bar-chart.tsx`: hovering a row's line
 * thickens it (`strokeWidth` 2 -> 3, the chart's existing bump mechanism)
 * and never dims the other rows' `opacity` (the old mechanism this
 * replaces). No tooltip-follows-pointer part here -- a diagonal line has no
 * wide mark to move a pointer within.
 */
export const HoverEmphasis: BaseStory = {
  render: () => (
    <SlopeChart
      width={480}
      height={320}
      data={data}
      leftLabel="Q1"
      rightLabel="Q2"
    />
  ),
  play: async ({ canvasElement }) => {
    const chart = canvasElement.querySelector<SVGElement>('svg[role="img"]');
    const lines = () =>
      Array.from(chart!.querySelectorAll<SVGLineElement>("line"));

    const firstLine = lines()[0];
    await userEvent.hover(firstLine);
    await waitFor(() =>
      expect(lines()[0]).toHaveAttribute("stroke-width", "3")
    );

    // No dimming: every row's <g> wrapper keeps full, unmodified opacity --
    // none carries an `opacity` attribute tied to hover (the old mechanism
    // this replaces).
    for (const g of Array.from(chart!.querySelectorAll("g"))) {
      expect(g).not.toHaveAttribute("opacity");
    }

    // Emphasis instead: only the hovered row's line thickens.
    expect(lines()[1]).toHaveAttribute("stroke-width", "2"); // sibling, unhovered
  },
};
