import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { PopulationPyramid } from "./population-pyramid";
import type { StackRow } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

const meta: Meta = {
  title: "Charts/PopulationPyramid",
  render: () => <RegistryPreview base="PopulationPyramid" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * BC-1 regression: `bandByIndex` positions each row's `y` band by row order,
 * not by the category label, so three bands sharing one label ("0-9" below,
 * after `duplicateLabels`) still render at three distinct heights instead of
 * collapsing onto a single band.
 */
const dupFixture: StackRow[] = duplicateLabels([
  {
    category: "0-9",
    segments: [
      { key: "Male", value: 50 },
      { key: "Female", value: 48 },
    ],
  },
  {
    category: "10-19",
    segments: [
      { key: "Male", value: 60 },
      { key: "Female", value: 58 },
    ],
  },
  {
    category: "20-29",
    segments: [
      { key: "Male", value: 55 },
      { key: "Female", value: 53 },
    ],
  },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <PopulationPyramid
      width={360}
      height={240}
      data={dupFixture}
      ariaLabel="Population pyramid with duplicate band labels"
    />
  ),
  play: async ({ canvasElement }) => {
    // Each band draws one left rect and one right rect.
    const rects = Array.from(canvasElement.querySelectorAll("rect"));
    expect(rects.length).toBe(dupFixture.length * 2);

    const leftYs = rects
      .filter((_, i) => i % 2 === 0)
      .map((r) => r.getAttribute("y"));
    expect(new Set(leftYs).size).toBe(dupFixture.length);
  },
};
