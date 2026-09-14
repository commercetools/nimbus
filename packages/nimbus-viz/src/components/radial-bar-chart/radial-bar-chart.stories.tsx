import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { RadialBarChart } from "./radial-bar-chart";
import type { CategoryDatum } from "../..";
import { RegistryPreview, type BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

const meta: Meta = {
  title: "Charts/RadialBarChart",
  render: () => <RegistryPreview base="RadialBarChart" />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * BC-1 (`docs/bug-classes.md`): a band scale keyed by category TEXT collapses
 * rows that share a label onto one angular slot, drawing their sectors on top
 * of each other with no error. `RadialBarChart` keys its angular band by row
 * INDEX instead, so three same-labeled rows still get three distinct sectors.
 * Asserts the fixed behavior directly: one `<path>` per row, each with a
 * distinct `d` (no two sectors drawn at the same angle).
 */
const duplicateLabelFixture: CategoryDatum[] = duplicateLabels([
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <RadialBarChart
      width={320}
      height={320}
      data={duplicateLabelFixture}
      ariaLabel="Radial bar chart of 3 categories sharing one label"
    />
  ),
  play: async ({ canvasElement }) => {
    const sectors = canvasElement.querySelectorAll("path");
    expect(sectors).toHaveLength(duplicateLabelFixture.length);
    const shapes = Array.from(sectors).map((p) => p.getAttribute("d"));
    expect(new Set(shapes).size).toBe(duplicateLabelFixture.length);
  },
};
