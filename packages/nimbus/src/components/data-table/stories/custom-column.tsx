import type { StoryObj } from "@storybook/react-vite";

import { columns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const CustomColumn: Story = {
  render: (args) => <DataTableWithModals {...args} onRowClick={() => {}} />,
  args: { columns, rows },
};
