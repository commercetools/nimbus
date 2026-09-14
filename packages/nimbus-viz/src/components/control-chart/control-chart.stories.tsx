import type { Meta } from "@storybook/react-vite";
import { ControlChart, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const series = [
  {
    id: "process",
    label: "Process A",
    data: [
      { x: 0, y: 50 },
      { x: 1, y: 52 },
      { x: 2, y: 49 },
      { x: 3, y: 51 },
      { x: 4, y: 53 },
      { x: 5, y: 48 },
      { x: 6, y: 61 },
      { x: 7, y: 50 },
      { x: 8, y: 52 },
    ],
  },
];

const meta: Meta = {
  title: "Charts/ControlChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <ControlChart width={width} height={height} series={series} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
