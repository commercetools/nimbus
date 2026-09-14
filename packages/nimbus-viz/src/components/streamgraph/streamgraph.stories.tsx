import type { Meta } from "@storybook/react-vite";
import { ResponsiveContainer, Streamgraph } from "../../";
import type { BaseStory } from "../../stories/base-story";

const series = [
  {
    id: "north",
    label: "North",
    data: [
      { x: new Date("2026-01-01"), y: 20 },
      { x: new Date("2026-02-01"), y: 25 },
      { x: new Date("2026-03-01"), y: 18 },
      { x: new Date("2026-04-01"), y: 30 },
      { x: new Date("2026-05-01"), y: 22 },
      { x: new Date("2026-06-01"), y: 28 },
    ],
  },
  {
    id: "south",
    label: "South",
    data: [
      { x: new Date("2026-01-01"), y: 15 },
      { x: new Date("2026-02-01"), y: 20 },
      { x: new Date("2026-03-01"), y: 24 },
      { x: new Date("2026-04-01"), y: 18 },
      { x: new Date("2026-05-01"), y: 26 },
      { x: new Date("2026-06-01"), y: 21 },
    ],
  },
  {
    id: "east",
    label: "East",
    data: [
      { x: new Date("2026-01-01"), y: 10 },
      { x: new Date("2026-02-01"), y: 14 },
      { x: new Date("2026-03-01"), y: 12 },
      { x: new Date("2026-04-01"), y: 16 },
      { x: new Date("2026-05-01"), y: 13 },
      { x: new Date("2026-06-01"), y: 17 },
    ],
  },
];

const meta: Meta = {
  title: "Charts/Streamgraph",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <Streamgraph width={width} height={height} series={series} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
