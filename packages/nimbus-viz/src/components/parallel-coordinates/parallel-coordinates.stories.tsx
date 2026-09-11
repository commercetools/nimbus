import type { Meta } from "@storybook/react-vite";
import { ParallelCoordinates, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const dimensions = [
  { key: "price", label: "Price" },
  { key: "mpg", label: "MPG" },
  { key: "hp", label: "Horsepower" },
];

const data = [
  { id: "car-1", group: "Sedan", values: { price: 22000, mpg: 34, hp: 150 } },
  { id: "car-2", group: "Sedan", values: { price: 26000, mpg: 30, hp: 180 } },
  { id: "car-3", group: "SUV", values: { price: 35000, mpg: 24, hp: 240 } },
  { id: "car-4", group: "SUV", values: { price: 40000, mpg: 21, hp: 280 } },
  { id: "car-5", group: "Truck", values: { price: 45000, mpg: 18, hp: 320 } },
];

const meta: Meta = {
  title: "Charts/ParallelCoordinates",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <ParallelCoordinates
          width={width}
          height={height}
          dimensions={dimensions}
          data={data}
        />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
