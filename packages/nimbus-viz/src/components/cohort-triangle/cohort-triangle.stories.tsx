import type { Meta } from "@storybook/react-vite";
import { CohortTriangle, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const rows = [
  { label: "Jan", values: [100, 80, 65, 50] },
  { label: "Feb", values: [120, 95, 70] },
  { label: "Mar", values: [110, 90] },
  { label: "Apr", values: [130] },
];

const periodLabels = ["Jan", "Feb", "Mar", "Apr"];

const meta: Meta = {
  title: "Charts/CohortTriangle",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <CohortTriangle
          width={width}
          height={height}
          rows={rows}
          periodLabels={periodLabels}
        />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
