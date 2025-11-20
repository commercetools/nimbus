import type { StoryObj } from "@storybook/react-vite";
import { Stack, Heading, Text } from "@/components";
import { sortableColumns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const WithSorting: Story = {
  render: (args) => {
    return (
      <Stack gap="500" alignItems="flex-start">
        <Stack gap="300">
          <Heading size="md">Sorting Example</Heading>
          <Text>
            Click on column headers to sort. The "Custom" column is not
            sortable.
          </Text>
        </Stack>
        <DataTableWithModals {...args} onRowClick={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    rows,
    allowsSorting: true,
    ["aria-label"]: "Sorting Example",
  },
};
