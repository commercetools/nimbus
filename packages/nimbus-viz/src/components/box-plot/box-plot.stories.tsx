import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { BoxPlot, type BoxPlotGroupStats } from "../../";
import { duplicateLabels } from "../../stories/adversarial";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/BoxPlot",
  render: () => <RegistryPreview base="BoxPlot" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const duplicateLabelGroups: BoxPlotGroupStats[] = duplicateLabels([
  {
    label: "Alpha",
    min: 10,
    firstQuartile: 20,
    median: 30,
    thirdQuartile: 40,
    max: 50,
  },
  {
    label: "Beta",
    min: 15,
    firstQuartile: 25,
    median: 35,
    thirdQuartile: 45,
    max: 55,
  },
  {
    label: "Gamma",
    min: 5,
    firstQuartile: 18,
    median: 28,
    thirdQuartile: 38,
    max: 48,
  },
]);

// BC-1 regression guard: all three groups now share one label. Position must
// come from row index (via `bandByIndex`), not from the label text, so the
// three boxes still draw at distinct x positions instead of collapsing onto
// a single band.
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <BoxPlot
      width={480}
      height={320}
      groups={duplicateLabelGroups}
      ariaLabel="Box plot with duplicate group labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    const boxes = svg!.querySelectorAll("rect.visx-boxplot-box");
    expect(boxes).toHaveLength(duplicateLabelGroups.length);
    const xs = new Set(Array.from(boxes).map((b) => b.getAttribute("x")));
    expect(xs.size).toBe(duplicateLabelGroups.length);
  },
};
