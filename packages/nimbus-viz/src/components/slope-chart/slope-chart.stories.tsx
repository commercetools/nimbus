import type { Meta } from "@storybook/react-vite";
import { SlopeChart, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const data = [
  { id: "alpha", label: "Alpha", left: 30, right: 45 },
  { id: "beta", label: "Beta", left: 55, right: 40 },
  { id: "gamma", label: "Gamma", left: 20, right: 25 },
  { id: "delta", label: "Delta", left: 60, right: 58 },
  { id: "epsilon", label: "Epsilon", left: 35, right: 50 },
];

const meta: Meta = {
  title: "Charts/SlopeChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <SlopeChart
          width={width}
          height={height}
          data={data}
          leftLabel="Q1"
          rightLabel="Q2"
        />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
