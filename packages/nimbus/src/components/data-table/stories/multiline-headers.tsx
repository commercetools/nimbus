import type { StoryObj } from "@storybook/react-vite";
import { multilineHeadersColumns, multilineHeadersData } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const MultilineHeaders: Story = {
  render: (args) => <DataTableWithModals {...args} />,
  args: {
    columns: multilineHeadersColumns,
    rows: multilineHeadersData,
    allowsSorting: true,
    isResizable: true,
    onRowClick: () => {},
  },
};
