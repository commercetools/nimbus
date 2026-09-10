import type { Meta } from "@storybook/react-vite";
import { ResponsiveContainer, StackedAreaChart } from "../../";
import type { BaseStory } from "../../stories/base-story";

const series = [
  {
    id: "north",
    label: "North",
    data: [
      { x: new Date("2026-01-01"), y: 20 },
      { x: new Date("2026-02-01"), y: 25 },
      { x: new Date("2026-03-01"), y: 30 },
      { x: new Date("2026-04-01"), y: 28 },
      { x: new Date("2026-05-01"), y: 35 },
    ],
  },
  {
    id: "south",
    label: "South",
    data: [
      { x: new Date("2026-01-01"), y: 15 },
      { x: new Date("2026-02-01"), y: 18 },
      { x: new Date("2026-03-01"), y: 20 },
      { x: new Date("2026-04-01"), y: 22 },
      { x: new Date("2026-05-01"), y: 24 },
    ],
  },
];

const meta: Meta = {
  title: "Charts/StackedAreaChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <StackedAreaChart width={width} height={height} series={series} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
