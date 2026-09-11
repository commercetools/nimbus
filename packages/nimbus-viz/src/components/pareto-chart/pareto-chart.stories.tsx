import type { Meta } from "@storybook/react-vite";
import { ParetoChart, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const data = [
  { category: "Shipping delay", value: 42 },
  { category: "Wrong item", value: 28 },
  { category: "Damaged", value: 18 },
  { category: "Billing", value: 9 },
  { category: "Other", value: 5 },
];

const meta: Meta = {
  title: "Charts/ParetoChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <ParetoChart width={width} height={height} data={data} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
