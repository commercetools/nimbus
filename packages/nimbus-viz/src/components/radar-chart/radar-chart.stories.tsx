import type { Meta } from "@storybook/react-vite";
import { RadarChart, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const axes = ["Speed", "Reliability", "Comfort", "Efficiency", "Safety"];

const data = [
  { id: "model-a", label: "Model A", values: [8, 6, 7, 9, 8] },
  { id: "model-b", label: "Model B", values: [6, 9, 8, 5, 7] },
];

const meta: Meta = {
  title: "Charts/RadarChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <RadarChart width={width} height={height} axes={axes} data={data} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
