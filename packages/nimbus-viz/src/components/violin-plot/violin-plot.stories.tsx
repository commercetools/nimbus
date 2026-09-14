import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ViolinPlot, type SampleGroup } from "../../";
import { duplicateLabels } from "../../stories/adversarial";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/ViolinPlot",
  render: () => <RegistryPreview base="ViolinPlot" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const duplicateLabelGroups: SampleGroup[] = duplicateLabels([
  { label: "Alpha", samples: [10, 12, 14, 16, 18] },
  { label: "Beta", samples: [20, 22, 24, 26, 28] },
  { label: "Gamma", samples: [30, 32, 34, 36, 38] },
]);

// BC-1 regression guard: all three groups now share one label. Position must
// come from row index (via `bandByIndex`), not from the label text, so the
// three violins still draw at distinct horizontal positions instead of
// collapsing onto a single band.
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <ViolinPlot
      width={480}
      height={320}
      groups={duplicateLabelGroups}
      ariaLabel="Violin plot with duplicate group labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    const violins = svg!.querySelectorAll("path");
    expect(violins).toHaveLength(duplicateLabelGroups.length);
    const ds = new Set(Array.from(violins).map((p) => p.getAttribute("d")));
    expect(ds.size).toBe(duplicateLabelGroups.length);
  },
};
