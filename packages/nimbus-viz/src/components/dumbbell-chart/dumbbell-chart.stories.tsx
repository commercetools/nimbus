import type { Meta } from "@storybook/react-vite";
import { DumbbellChart, ResponsiveContainer } from "../../";
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
