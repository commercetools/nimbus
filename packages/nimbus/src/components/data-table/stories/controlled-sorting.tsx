import React, { useState } from "react";
import { Button, Heading, Stack, Text } from "@/components";
import type { StoryObj } from "@storybook/react-vite";

import { sortableColumns, rows } from "../test-data";
import type { SortDescriptor, DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const ControlledSorting: Story = {
  render: (args) => {
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
      column: "name",
      direction: "ascending",
    });

    return (
      <Stack gap="500" alignItems="flex-start">
        <Stack gap="300">
          <Heading size="md">Controlled Sorting Example</Heading>
          <Text>
            Current sort:{" "}
            <Text as="span" fontWeight="bold">
              {sortDescriptor.column}
            </Text>{" "}
            ({sortDescriptor.direction})
          </Text>
          <Text>
            The sorting state is controlled externally and can be
            programmatically changed.
          </Text>
        </Stack>
        <Stack direction="row" gap="300" wrap="wrap">
          <Button
            onPress={() =>
              setSortDescriptor({ column: "name", direction: "ascending" })
            }
            variant="outline"
            data-testid="sort-by-name-button"
          >
            Sort by Name (A-Z)
          </Button>
          <Button
            onPress={() =>
              setSortDescriptor({ column: "age", direction: "descending" })
            }
            variant="outline"
          >
            Sort by Age (High-Low)
          </Button>
          <Button
            onPress={() =>
              setSortDescriptor({ column: "role", direction: "ascending" })
            }
            variant="outline"
          >
            Sort by Role (A-Z)
          </Button>
        </Stack>
        <DataTableWithModals
          {...args}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          onRowClick={() => {}}
        />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    rows,
    allowsSorting: true,
  },
};
