import type { Meta } from "@storybook/react-vite";
import { RfmGrid, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const data = [
  { recency: 1, frequency: 1, count: 120 },
  { recency: 1, frequency: 2, count: 80 },
  { recency: 1, frequency: 3, count: 55 },
  { recency: 2, frequency: 1, count: 95 },
  { recency: 2, frequency: 2, count: 60 },
  { recency: 2, frequency: 3, count: 35 },
  { recency: 3, frequency: 1, count: 40 },
  { recency: 3, frequency: 3, count: 25 },
];

const meta: Meta = {
  title: "Charts/RfmGrid",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => <RfmGrid width={width} height={height} data={data} />}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
