import type { Meta } from "@storybook/react-vite";
import { CalendarHeatmap, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const data = [
  { date: "2026-01-05", value: 3 },
  { date: "2026-01-06", value: 5 },
  { date: "2026-01-07", value: 0 },
  { date: "2026-01-08", value: 8 },
  { date: "2026-01-09", value: 2 },
  { date: "2026-01-12", value: 6 },
  { date: "2026-01-13", value: 9 },
  { date: "2026-01-14", value: 4 },
  { date: "2026-01-15", value: 7 },
  { date: "2026-01-16", value: 1 },
];

const meta: Meta = {
  title: "Charts/CalendarHeatmap",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <CalendarHeatmap width={width} height={height} data={data} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
