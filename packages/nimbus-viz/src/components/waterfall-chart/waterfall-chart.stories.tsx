import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { WaterfallChart, type WaterfallStep } from "../../";
import { duplicateLabels } from "../../stories/adversarial";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";

const meta: Meta = {
  title: "Charts/WaterfallChart",
  render: () => <RegistryPreview base="WaterfallChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const duplicateLabelSteps: WaterfallStep[] = duplicateLabels([
  { label: "Start", value: 100 },
  { label: "Adjustment", value: 40 },
  { label: "End", value: -20 },
]);

// BC-1 regression guard: all three steps now share one label. Position must
// come from row index (via `bandByIndex`), not from the label text, so the
// three bars still draw at distinct horizontal positions instead of
// collapsing onto a single band. Bars render as `BarRounded` (an SVG
// `path`), so distinctness is asserted on its `d` attribute, not a raw `x`.
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <WaterfallChart
      width={480}
      height={320}
      data={duplicateLabelSteps}
      ariaLabel="Waterfall chart with duplicate step labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    const bars = svg!.querySelectorAll("path.visx-bar-rounded");
    expect(bars).toHaveLength(duplicateLabelSteps.length);
    const ds = new Set(Array.from(bars).map((p) => p.getAttribute("d")));
    expect(ds.size).toBe(duplicateLabelSteps.length);
  },
};
