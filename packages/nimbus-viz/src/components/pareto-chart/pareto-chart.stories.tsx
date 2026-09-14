import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ParetoChart, ResponsiveContainer } from "../../";
import type { CategoryDatum } from "../../";
import type { BaseStory } from "../../stories/base-story";
import { duplicateLabels } from "../../stories/adversarial";

const data = [
  { category: "Shipping delay", value: 42 },
  { category: "Wrong item", value: 28 },
  { category: "Damaged", value: 18 },
  { category: "Billing", value: 9 },
  { category: "Other", value: 5 },
];

const meta: Meta = {
  title: "Charts/ParetoChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <ParetoChart width={width} height={height} data={data} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * BC-1 (`docs/bug-classes.md`): a band scale keyed by category TEXT collapses
 * rows that share a label onto one band, drawing their bars (and cumulative
 * markers) on top of each other with no error. `ParetoChart` keys its x-band
 * by row INDEX instead, so four same-labeled rows still land on four
 * distinct positions. Asserts the fixed behavior directly on the cumulative
 * line's per-row markers (one `<circle>` per row, no legend swatches are SVG
 * circles): distinct `cx` for every row.
 */
const duplicateLabelFixture: CategoryDatum[] = duplicateLabels([
  { category: "Shipping delay", value: 42 },
  { category: "Wrong item", value: 28 },
  { category: "Damaged", value: 18 },
  { category: "Billing", value: 9 },
]);

export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <ParetoChart
      width={480}
      height={280}
      data={duplicateLabelFixture}
      ariaLabel="Pareto chart of 4 categories sharing one label"
    />
  ),
  play: async ({ canvasElement }) => {
    const markers = canvasElement.querySelectorAll("circle");
    expect(markers).toHaveLength(duplicateLabelFixture.length);
    const positions = Array.from(markers).map((c) => c.getAttribute("cx"));
    expect(new Set(positions).size).toBe(duplicateLabelFixture.length);
  },
};
