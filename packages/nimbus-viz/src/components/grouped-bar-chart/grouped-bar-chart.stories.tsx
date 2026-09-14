import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
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
