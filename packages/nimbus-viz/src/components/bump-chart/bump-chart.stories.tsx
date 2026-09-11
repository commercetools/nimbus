import type { Meta } from "@storybook/react-vite";
import { BumpChart, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const series = [
  {
    id: "alpha",
    label: "Alpha",
    data: [
      { x: 0, y: 30 },
      { x: 1, y: 28 },
      { x: 2, y: 35 },
      { x: 3, y: 40 },
      { x: 4, y: 38 },
    ],
  },
  {
    id: "beta",
    label: "Beta",
    data: [
      { x: 0, y: 25 },
      { x: 1, y: 32 },
      { x: 2, y: 20 },
      { x: 3, y: 22 },
      { x: 4, y: 27 },
    ],
  },
  {
    id: "gamma",
    label: "Gamma",
    data: [
      { x: 0, y: 18 },
      { x: 1, y: 15 },
      { x: 2, y: 28 },
      { x: 3, y: 33 },
      { x: 4, y: 41 },
    ],
  },
];

const meta: Meta = {
  title: "Charts/BumpChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <BumpChart width={width} height={height} series={series} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
