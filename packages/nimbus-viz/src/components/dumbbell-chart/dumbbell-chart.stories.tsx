import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { DumbbellChart, ResponsiveContainer, type DumbbellRow } from "../../";
import { duplicateLabels } from "../../stories/adversarial";
import type { BaseStory } from "../../stories/base-story";

const data = [
  { category: "Marketing", start: 40, end: 55 },
  { category: "Sales", start: 60, end: 58 },
  { category: "Support", start: 35, end: 50 },
  { category: "Engineering", start: 70, end: 82 },
  { category: "Product", start: 45, end: 47 },
];

const meta: Meta = {
  title: "Charts/DumbbellChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <DumbbellChart width={width} height={height} data={data} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

const duplicateLabelRows: DumbbellRow[] = duplicateLabels([
  { category: "Marketing", start: 40, end: 55 },
  { category: "Sales", start: 60, end: 58 },
  { category: "Support", start: 35, end: 50 },
]);

// BC-1 regression guard: all three rows now share one category. Position
// must come from row index (via `bandByIndex`), not from the category text,
// so the three connector lines still draw at distinct vertical positions
// instead of collapsing onto a single band.
export const EdgeCaseDuplicateLabels: BaseStory = {
  render: () => (
    <DumbbellChart
      width={480}
      height={320}
      data={duplicateLabelRows}
      ariaLabel="Dumbbell chart with duplicate category labels"
    />
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg");
    const connectors = svg!.querySelectorAll('line[stroke-linecap="round"]');
    expect(connectors).toHaveLength(duplicateLabelRows.length);
    const y1s = new Set(
      Array.from(connectors).map((l) => l.getAttribute("y1"))
    );
    expect(y1s.size).toBe(duplicateLabelRows.length);
  },
};
