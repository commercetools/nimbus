import type { StoryObj } from "@storybook/react-vite";
import React from "react";
import { type Selection } from "react-aria-components";
import { within, expect, userEvent } from "storybook/test";
import { Stack, Heading, Text } from "@/components";
import { DataTable } from "@/components";
import { sortableColumns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";

type Story = StoryObj<DataTableProps>;

export const RowPinningEdgeCases: Story = {
  render: () => {
    const [pinnedRows, setPinnedRows] = React.useState<Set<string>>(
      new Set(["1", "3"]) // Pre-pin some rows
    );
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
      new Set(["2"])
    );

    const handlePinToggle = (rowId: string) => {
      setPinnedRows((prev) => {
        const newPinnedRows = new Set(prev);
        if (newPinnedRows.has(rowId)) {
          newPinnedRows.delete(rowId);
        } else {
          newPinnedRows.add(rowId);
        }
        return newPinnedRows;
      });
    };

    return (
      <Stack direction="column" gap="400">
        <Heading as="h3" size="lg">
          Row Pinning Edge Cases
        </Heading>
        <Text>
          Testing edge cases: pre-pinned rows, interaction with selection, and
          pin state with filtering/searching.
        </Text>
        <DataTable
          columns={sortableColumns}
          rows={rows.slice(0, 5)} // Use smaller dataset for edge case testing
          pinnedRows={pinnedRows}
          onPinToggle={handlePinToggle}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          allowsSorting={true}
          selectionMode="multiple"
          onRowClick={() => {}}
          data-testid="edge-cases-data-table"
        />
      </Stack>
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Pre-pinned rows are displayed correctly", async () => {
      const rows = canvas.getAllByRole("row");

      // Both should have pinned styling
      expect(rows[1]).toHaveClass("data-table-row-pinned");
      expect(rows[2]).toHaveClass("data-table-row-pinned");

      // First should have "first" class, second should have "last" class
      expect(rows[1]).toHaveClass("data-table-row-pinned-first");
      expect(rows[2]).toHaveClass("data-table-row-pinned-last");
    });

    await step("Pin button has correct accessibility attributes", async () => {
      const rows = canvas.getAllByRole("row");
      const unpinnedRow = rows[3]; // Should be an unpinned row

      await userEvent.hover(unpinnedRow);
      const pinButton = within(unpinnedRow).getByLabelText(/pin row/i);

      // Check ARIA attributes
      expect(pinButton).toHaveAttribute("aria-label", "Pin row");
      expect(pinButton.tagName).toBe("BUTTON");
    });
  },
};
