import type { StoryObj } from "@storybook/react-vite";
import React from "react";
import { Stack, Heading, Text, Box } from "@/components";
import { flexibleNestedData } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const FlexibleNestedChildren: Story = {
  render: (args) => {
    return (
      <Stack gap="400">
        <Stack gap="300">
          <Heading size="md">Flexible Nested Children</Heading>
          <Text>
            Demonstrates the new flexible children system where nested content
            can be either:
          </Text>
          <Box as="ul" ml="500" lineHeight="1.6">
            <Box as="li">
              <Text as="span" fontWeight="bold">
                Table rows
              </Text>{" "}
              - Traditional nested table structure (Alice's projects)
            </Box>
            <Box as="li">
              <Text as="span" fontWeight="bold">
                React components
              </Text>{" "}
              - Rich interactive content like profile cards, forms, charts
            </Box>
            <Box as="li">
              <Text as="span" fontWeight="bold">
                Simple content
              </Text>{" "}
              - Text, alerts, or any other React elements
            </Box>
          </Box>
          <Text>
            Click the expand buttons to see different types of nested content.
          </Text>
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
        id: "age",
        header: "Age",
        accessor: (row) => row.age as React.ReactNode,
      },
      {
        id: "role",
        header: "Role",
        accessor: (row) => row.role as React.ReactNode,
      },
      {
        id: "class",
        header: "Level",
        accessor: (row) => row.class as React.ReactNode,
      },
    ],
    rows: flexibleNestedData,
    allowsSorting: true,
    isResizable: true,
    maxHeight: "400px",
    nestedKey: "children",
  },
};

