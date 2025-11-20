import type { StoryObj } from "@storybook/react-vite";
import React from "react";
import { Stack, Heading, Text, Box } from "@/components";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const NoNestedContent: Story = {
  render: (args) => {
    return (
      <Stack gap="400">
        <Stack gap="300">
          <Heading size="md">No Nested Content (Default Behavior)</Heading>
          <Text>
            When no <Text as="code">nestedKey</Text> is provided, the component
            ignores any nested properties and only renders parent rows. This is
            the new default behavior.
          </Text>
          <Box
            p="300"
            bg="warning.2"
            border="1px solid"
            borderColor="warning.6"
            borderRadius="150"
            fontSize="350"
          >
            <Text>
              <Text as="strong">Note:</Text> The data below contains "children"
              properties, but they won't be rendered without explicitly setting{" "}
              <Text as="code">nestedKey="children"</Text>.
            </Text>
          </Box>
        </Stack>
        <DataTableWithModals {...args} onRowClick={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: [
      {
        id: "name",
        header: "Name",
        accessor: (row) => row.name as React.ReactNode,
      },
      {
        id: "type",
        header: "Type",
        accessor: (row) => row.type as React.ReactNode,
      },
      {
        id: "status",
        header: "Status",
        accessor: (row) => row.status as React.ReactNode,
      },
    ],
    rows: [
      {
        id: "parent-1",
        name: "Parent Item 1",
        type: "Parent",
        status: "Active",
        // This children property will be ignored without nestedKey
        children: [
          {
            id: "child-1",
            name: "Child Item 1",
            type: "Child",
            status: "Hidden",
          },
          {
            id: "child-2",
            name: "Child Item 2",
            type: "Child",
            status: "Hidden",
          },
        ],
      },
      {
        id: "parent-2",
        name: "Parent Item 2",
        type: "Parent",
        status: "Active",
        // This children property will also be ignored
        children: (
          <div>This React content won't be shown without nestedKey</div>
        ),
      },
      {
        id: "parent-3",
        name: "Parent Item 3",
        type: "Parent",
        status: "Active",
        // No children property at all
      },
    ],
    allowsSorting: true,
    isResizable: true,
    // Notice: no nestedKey prop, so no nested content will be rendered
  },
};
