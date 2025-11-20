import type { StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { type Selection } from "react-aria-components";
import { Stack, Heading, Text, Button, Box, Flex } from "@/components";
import { sortableColumns, rows } from "../test-data";
import type { DataTableProps, DataTableRowItem } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const DisabledRowsShowcase: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["2"]));
    const [disabledKeys, setDisabledKeys] = useState<Selection>(
      new Set(["3", "5", "7"])
    );
    const [rowActionLog, setRowActionLog] = useState<string[]>([]);

    const handleRowAction = (
      row: DataTableRowItem,
      action: "click" | "select"
    ) => {
      const message = `${action.toUpperCase()} attempted on disabled row: ${row.name} (ID: ${row.id})`;
      setRowActionLog((prev) => [message, ...prev.slice(0, 4)]); // Keep last 5 messages
    };

    const toggleDisabled = (rowId: string) => {
      setDisabledKeys((prev) => {
        if (prev === "all") return new Set([rowId]);
        const newSet = new Set(prev);
        if (newSet.has(rowId)) {
          newSet.delete(rowId);
        } else {
          newSet.add(rowId);
        }
        return newSet;
      });
    };

    return (
      <Stack gap="500">
        <Stack gap="300">
          <Heading size="lg">Disabled Rows Showcase</Heading>
          <Text color="neutral.11" fontSize="400">
            Demonstration of disabled row functionality. Disabled rows cannot be
            selected or clicked, and show visual feedback when interactions are
            attempted.
          </Text>
        </Stack>

        {/* Controls */}
        <Box
          p="400"
          bg="neutral.2"
          borderRadius="200"
          border="1px solid"
          borderColor="neutral.4"
        >
          <Heading size="lg" marginBottom="300">
            Controls
          </Heading>
          <Flex gap="300" flexWrap="wrap">
            {rows.map((row) => (
              <Button
                key={row.id}
                onPress={() => toggleDisabled(row.id)}
                size="xs"
                variant="outline"
                bg={
                  disabledKeys !== "all" && disabledKeys.has(row.id)
                    ? "critical.3"
                    : "bg"
                }
              >
                {disabledKeys !== "all" && disabledKeys.has(row.id)
                  ? "Enable"
                  : "Disable"}{" "}
                {row.name as React.ReactNode}
              </Button>
            ))}
          </Flex>

          <Flex marginTop="300" gap="200">
            <Button
              onPress={() => setDisabledKeys("all")}
              size="xs"
              variant="outline"
              bg={disabledKeys === "all" ? "critical.3" : "bg"}
            >
              Disable All
            </Button>
            <Button
              onPress={() => setDisabledKeys(new Set())}
              size="xs"
              variant="outline"
            >
              Enable All
            </Button>
          </Flex>
        </Box>

        {/* Action Log */}
        {rowActionLog.length > 0 && (
          <Box
            p="300"
            bg="warning.2"
            border="1px solid"
            borderColor="warning.4"
            borderRadius="150"
          >
            <Heading as="h5" size="md" marginBottom="200" color="warning.11">
              🚫 Disabled Row Interactions Log
            </Heading>
            {rowActionLog.map((message, index) => (
              <Text key={index} fontSize="300" color="warning.11" marginY="50">
                {message}
              </Text>
            ))}
          </Box>
        )}

        {/* DataTable */}
        <DataTableWithModals
          columns={sortableColumns}
          rows={rows}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          disabledKeys={disabledKeys}
          onRowAction={handleRowAction}
          selectionMode="multiple"
          allowsSorting={true}
          onRowClick={() => {}}
        />
      </Stack>
    );
  },
  args: {},
};
