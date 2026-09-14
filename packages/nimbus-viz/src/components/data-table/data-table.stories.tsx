import type { Meta } from "@storybook/react-vite";
import { DataTable } from "../../";
import type { BaseStory } from "../../stories/base-story";

const columns = ["Product", "Units", "Revenue"];
const rows = [
  ["Widget A", 120, 3600],
  ["Widget B", 85, 2550],
  ["Widget C", 42, 1260],
  ["Widget D", 60, 1800],
];

const meta: Meta = {
  title: "Charts/DataTable",
  render: () => <DataTable columns={columns} rows={rows} />,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};
