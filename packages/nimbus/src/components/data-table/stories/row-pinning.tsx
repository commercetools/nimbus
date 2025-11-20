import type { StoryObj } from "@storybook/react-vite";
import React from "react";
import { within, expect, waitFor, userEvent } from "storybook/test";
import { Stack, Heading, Text } from "@/components";
import { DataTable } from "@/components";
import { sortableColumns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";

type Story = StoryObj<DataTableProps>;

export const RowPinning: Story = {
  render: () => {
    const [pinnedRows, setPinnedRows] = React.useState<Set<string>>(new Set());

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
          Row Pinning Feature Demo
        </Heading>
        <Text>
          Hover over rows to see the pin button appear in the last column.
          Pinned rows will always stay at the top and are excluded from sorting.
        </Text>
        <DataTable
          columns={sortableColumns}
          rows={rows}
          pinnedRows={pinnedRows}
          onPinToggle={handlePinToggle}
          allowsSorting={true}
          selectionMode="multiple"
          onRowClick={() => {}}
          data-testid="pinning-data-table"
        />
      </Stack>
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Pin buttons exist but have CSS class that hides them",
      async () => {
        const rows = canvas.getAllByRole("row");
        const firstDataRow = rows[1]; // Skip header row

        // Pin button should exist in DOM but be hidden via CSS
        const pinButton = within(firstDataRow).getByLabelText(/pin row/i);
        expect(pinButton).toBeInTheDocument();

        // Check the wrapper element has the correct data-slot attribute
        const pinButtonWrapper = pinButton.parentElement;
        expect(pinButtonWrapper).toHaveAttribute(
          "data-slot",
          "nimbus-table-cell-pin-button"
        );
        expect(pinButtonWrapper).not.toHaveAttribute(
          "data-slot",
          "nimbus-table-cell-pin-button-pinned"
        );
      }
    );

    await step("Pin button is accessible on row hover", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1]; // Skip header row

      await userEvent.hover(firstDataRow);
      await waitFor(async () => {
        const pinButton = within(firstDataRow).getByLabelText(/pin row/i);
        // Button should be accessible (focusable) when row is hovered
        expect(pinButton).toBeInTheDocument();
        expect(pinButton).not.toBeDisabled();
      });
    });

    await step("Can pin a row by clicking pin button", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1]; // Skip header row

      await userEvent.hover(firstDataRow);
      const pinButton = within(firstDataRow).getByLabelText(/pin row/i);
      await userEvent.click(pinButton);

      await waitFor(async () => {
        // Row should now have pinned styling
        expect(firstDataRow).toHaveClass("data-table-row-pinned");
        // Pin button should show "unpin" state and have pinned data-slot
        const unpinButton = within(firstDataRow).getByLabelText(/unpin row/i);
        expect(unpinButton).toBeInTheDocument();

        // Check the wrapper element has the pinned data-slot attribute
        const unpinButtonWrapper = unpinButton.parentElement;
        expect(unpinButtonWrapper).toHaveAttribute(
          "data-slot",
          "nimbus-table-cell-pin-button-pinned"
        );
      });
    });

    await step("Pinned row has correct styling", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1];

      // Should have pinned row class with single pinned styling
      expect(firstDataRow).toHaveClass("data-table-row-pinned");
      expect(firstDataRow).toHaveClass("data-table-row-pinned-single");

      // Pin button should be visible with pinned data-slot attribute
      const pinButton = within(firstDataRow).getByLabelText(/unpin row/i);
      const pinButtonWrapper = pinButton.parentElement;
      expect(pinButtonWrapper).toHaveAttribute(
        "data-slot",
        "nimbus-table-cell-pin-button-pinned"
      );
    });

    await step("Can pin multiple rows", async () => {
      const rows = canvas.getAllByRole("row");
      const secondDataRow = rows[2]; // Skip header row

      await userEvent.hover(secondDataRow);
      const pinButton = within(secondDataRow).getByLabelText(/pin row/i);
      await userEvent.click(pinButton);

      await waitFor(async () => {
        // Both rows should be pinned
        expect(rows[1]).toHaveClass("data-table-row-pinned");
        expect(rows[2]).toHaveClass("data-table-row-pinned");

        // First pinned row should have "first" class, second should have "last" class
        expect(rows[1]).toHaveClass("data-table-row-pinned-first");
        expect(rows[2]).toHaveClass("data-table-row-pinned-last");

        // Neither should have "single" class anymore
        expect(rows[1]).not.toHaveClass("data-table-row-pinned-single");
        expect(rows[2]).not.toHaveClass("data-table-row-pinned-single");
      });
    });

    await step("Can unpin a row", async () => {
      const rows = canvas.getAllByRole("row");
      const secondDataRow = rows[2];

      await userEvent.hover(secondDataRow);
      const unpinButton = within(secondDataRow).getByLabelText(/unpin row/i);
      await userEvent.click(unpinButton);

      await waitFor(() => {
        // Second row should no longer be pinned
        expect(secondDataRow).not.toHaveClass("data-table-row-pinned");

        // First row should now be single pinned again
        expect(rows[1]).toHaveClass("data-table-row-pinned-single");
        expect(rows[1]).not.toHaveClass("data-table-row-pinned-first");
      });
    });

    await step("Pinned rows stay at the top when sorting", async () => {
      // First, ensure we have a pinned row
      const rows = canvas.getAllByRole("row");
      const pinnedRow = rows[1];
      const pinnedRowId = pinnedRow.getAttribute("id");

      // Find a sortable column header and click it
      const nameColumnHeader = canvas.getByText("Name");
      await userEvent.click(nameColumnHeader);

      await waitFor(async () => {
        // After sorting, the pinned row should still be first
        const updatedRows = canvas.getAllByRole("row");
        const firstDataRowAfterSort = updatedRows[1];
        expect(firstDataRowAfterSort.getAttribute("id")).toBe(pinnedRowId);
        expect(firstDataRowAfterSort).toHaveClass("data-table-row-pinned");
      });
    });
  },
};
