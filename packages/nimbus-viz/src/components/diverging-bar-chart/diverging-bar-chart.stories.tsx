import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
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
