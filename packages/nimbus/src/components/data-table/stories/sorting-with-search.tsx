import type { StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Stack, Heading, Text, TextInput } from "@/components";
import { sortableColumns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const SortingWithSearch: Story = {
  render: (args) => {
    const [search, setSearch] = useState("");

    return (
      <Stack gap="500" alignItems="flex-start">
        <Stack gap="300">
          <Heading size="md">Sorting + Search Example</Heading>
          <Text>
            Combine search functionality with sorting. Search results are also
            sortable.
          </Text>
        </Stack>
        <TextInput
          value={search}
          onChange={setSearch}
          placeholder="Search and then sort..."
          width="1/3"
          aria-label="filter-rows"
        />
        <DataTableWithModals {...args} search={search} onRowClick={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    rows,
    allowsSorting: true,
  },
};
