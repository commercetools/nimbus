import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { DivergingStackedBar } from "./diverging-stacked-bar";
import type { StackRow } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

const meta: Meta = {
  title: "Charts/DivergingStackedBar",
  render: () => <RegistryPreview base="DivergingStackedBar" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * BC-1 regression: `bandByIndex` positions each row's `y` band by row order,
 * not by the category label, so three rows sharing one label ("Item A"
 * below, after `duplicateLabels`) still render at three distinct heights
 * instead of collapsing onto a single band.
 */
const dupFixture: StackRow[] = duplicateLabels([
  {
    category: "Item A",
    segments: [
      { key: "Disagree", value: 10 },
      { key: "Neutral", value: 5 },
      { key: "Agree", value: 15 },
    ],
  },
  {
    category: "Item B",
    segments: [
      { key: "Disagree", value: 8 },
      { key: "Neutral", value: 6 },
      { key: "Agree", value: 20 },
    ],
  },
  {
    category: "Item C",
    segments: [
      { key: "Disagree", value: 12 },
      { key: "Neutral", value: 4 },
      { key: "Agree", value: 18 },
    ],
  },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <DivergingStackedBar
      width={360}
      height={240}
      data={dupFixture}
      ariaLabel="Diverging stacked bar with duplicate category labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const segmentsPerRow = dupFixture[0].segments.length;
    const rects = Array.from(canvasElement.querySelectorAll("rect"));
    expect(rects.length).toBe(dupFixture.length * segmentsPerRow);

    // Every segment in a row shares that row's y; rows land at distinct ys.
    const rowYs = rects
      .filter((_, i) => i % segmentsPerRow === 0)
      .map((r) => r.getAttribute("y"));
    expect(new Set(rowYs).size).toBe(dupFixture.length);
  },
};
