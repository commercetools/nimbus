import type { Meta } from "@storybook/react-vite";
import { BubbleChart, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const points = [
  { x: 10, y: 20, size: 30, group: "Sedan", label: "Alpha" },
  { x: 15, y: 35, size: 60, group: "Sedan", label: "Beta" },
  { x: 22, y: 18, size: 45, group: "SUV", label: "Gamma" },
  { x: 28, y: 42, size: 80, group: "SUV", label: "Delta" },
  { x: 35, y: 25, size: 20, group: "Sedan", label: "Epsilon" },
  { x: 40, y: 50, size: 55, group: "SUV", label: "Zeta" },
];

const meta: Meta = {
  title: "Charts/BubbleChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <BubbleChart width={width} height={height} points={points} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
