import type { Meta } from "@storybook/react-vite";
import { userEvent, expect, waitFor } from "storybook/test";
import { DivergingBarChart, type CategoryDatum } from "../../";
import { duplicateLabels } from "../../stories/adversarial";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/DivergingBarChart",
  render: () => <RegistryPreview base="DivergingBarChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const fixture: CategoryDatum[] = [
  { category: "Grocery", value: 32 },
  { category: "Electronics", value: -18 },
  { category: "Apparel", value: 9 },
];

/**
 * Hover/tooltip UX convergence: hovering a bar outlines that ONE bar
 * (`stroke`/`strokeWidth`) and never dims its siblings -- replacing the
 * "dim everyone else to a fixed opacity" pattern this chart (and 30 others)
 * used to hand-roll independently. There is no floating tooltip here (values
 * are drawn directly on the plot as always-visible labels), so there is no
 * pointer-follow behavior to prove.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <DivergingBarChart width={480} height={280} data={fixture} />,
  play: async ({ canvasElement }) => {
    const bars = () =>
      Array.from(
        canvasElement.querySelectorAll<SVGPathElement>("path.visx-bar-rounded")
      );

    const firstBar = bars()[0];
    await userEvent.hover(firstBar);
    await waitFor(() =>
      expect(firstBar).toHaveAttribute("stroke-width", "1.5")
    );

    // No dimming: every bar keeps a full, unmodified fill -- none carries
    // an `opacity` attribute at all (the old mechanism this replaces).
    for (const bar of bars()) {
      expect(bar).not.toHaveAttribute("opacity");
    }
    // Emphasis instead: only the hovered bar gets a real outline.
    expect(bars()[1]).toHaveAttribute("stroke-width", "0");
  },
};

const duplicateLabelRows: CategoryDatum[] = duplicateLabels([
  { category: "Grocery", value: 32 },
  { category: "Electronics", value: -18 },
  { category: "Apparel", value: 9 },
]);

// BC-1 regression guard: all three rows now share one category. Position
// must come from row index (via `bandByIndex`), not from the category text,
// so the three bars still draw at distinct vertical positions instead of
// collapsing onto a single band. Bars render as `BarRounded` (an SVG
// `path`), so distinctness is asserted on its `d` attribute, not a raw `y`.
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <DivergingBarChart
      width={480}
      height={320}
      data={duplicateLabelRows}
      ariaLabel="Diverging bar chart with duplicate category labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    const bars = svg!.querySelectorAll("path.visx-bar-rounded");
    expect(bars).toHaveLength(duplicateLabelRows.length);
    const ds = new Set(Array.from(bars).map((p) => p.getAttribute("d")));
    expect(ds.size).toBe(duplicateLabelRows.length);
  },
};
