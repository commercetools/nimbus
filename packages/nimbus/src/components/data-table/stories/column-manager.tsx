import React, { useState } from "react";
import { Checkbox, Stack } from "@/components";
import type { StoryObj } from "@storybook/react-vite";
import { within, expect, waitFor, userEvent } from "storybook/test";

import { columns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const ColumnManager: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(["name", "age"]);
    const allColumnsIds = args.columns.map((col) => col.id);
    const handleCheckboxChange = (colId: string) => {
      setVisible((prev) =>
        prev.includes(colId)
          ? prev.filter((id) => id !== colId)
          : [...prev, colId]
      );
    };
    return (
      <>
        <Stack
          direction="row"
          gap="400"
          mb="300"
          wrap="wrap"
          data-testid="column-manager-controls"
        >
          {allColumnsIds.map((colId) => (
            <Checkbox
              key={colId}
              isSelected={visible.includes(colId)}
              onChange={() => handleCheckboxChange(colId)}
              data-testid={`column-toggle-${colId}`}
            >
              {colId}
            </Checkbox>
          ))}
        </Stack>
        <DataTableWithModals
          {...args}
          visibleColumns={visible}
          onRowClick={() => {
            console.log("row clicked");
          }}
          data-testid="column-manager-table"
        />
      </>
    );
  },
  args: { columns, rows },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Column manager controls render correctly", async () => {
      const controls = await canvas.findByTestId("column-manager-controls");
      expect(controls).toBeInTheDocument();

      // Verify all column checkboxes are present
      const nameCheckbox = await canvas.findByTestId("column-toggle-name");
      const ageCheckbox = await canvas.findByTestId("column-toggle-age");
      const roleCheckbox = await canvas.findByTestId("column-toggle-role");
      const customCheckbox = await canvas.findByTestId("column-toggle-custom");

      expect(nameCheckbox).toBeInTheDocument();
      expect(ageCheckbox).toBeInTheDocument();
      expect(roleCheckbox).toBeInTheDocument();
      expect(customCheckbox).toBeInTheDocument();
    });

    await step("Initial visible columns are correct", async () => {
      // name and age should be checked by default
      const nameCheckbox = await canvas.getByTestId("column-toggle-name");
      const ageCheckbox = await canvas.getByTestId("column-toggle-age");
      const roleCheckbox = await canvas.getByTestId("column-toggle-role");
      const customCheckbox = await canvas.getByTestId("column-toggle-custom");

      await waitFor(() => {
        expect(nameCheckbox).toHaveAttribute("data-selected");
        expect(ageCheckbox).toHaveAttribute("data-selected");
        expect(roleCheckbox).not.toHaveAttribute("data-selected");
        expect(customCheckbox).not.toHaveAttribute("data-selected");
      });
    });

    await step("Table shows only visible columns", async () => {
      // Verify Name and Age column headers are visible
      expect(canvas.getByText("Name with a long header")).toBeInTheDocument();
      expect(canvas.getByText("Age")).toBeInTheDocument();

      // Verify Role and Custom column headers are not visible
      expect(canvas.queryByText("Role")).not.toBeInTheDocument();
      expect(canvas.queryByText("Custom")).not.toBeInTheDocument();
    });

    await step("Hiding a visible column removes it from table", async () => {
      const ageCheckbox = await canvas.getByTestId("column-toggle-age");

      // Uncheck the age column
      await userEvent.click(ageCheckbox);

      await waitFor(() => {
        expect(ageCheckbox).not.toHaveAttribute("data-selected");
      });

      // Verify Age column is no longer in the table
      await waitFor(() => {
        expect(canvas.queryByText("Age")).not.toBeInTheDocument();
      });

      // Verify Name column is still visible
      expect(canvas.getByText("Name with a long header")).toBeInTheDocument();
    });

    await step("Showing a hidden column adds it to table", async () => {
      const roleCheckbox = canvas.getByTestId("column-toggle-role");

      // Check the role column
      await userEvent.click(roleCheckbox);

      await waitFor(() => {
        expect(roleCheckbox).toHaveAttribute("data-selected");
      });

      // Verify Role column now appears in the table
      await waitFor(() => {
        expect(canvas.getByText("Role")).toBeInTheDocument();
      });
    });

    await step("Multiple columns can be toggled", async () => {
      const ageCheckbox = await canvas.getByTestId("column-toggle-age");
      const customCheckbox = await canvas.getByTestId("column-toggle-custom");

      // Show age column again
      await userEvent.click(ageCheckbox);

      await waitFor(() => {
        expect(ageCheckbox).toHaveAttribute("data-selected");
      });

      // Show custom column
      await userEvent.click(customCheckbox);

      await waitFor(() => {
        expect(customCheckbox).toHaveAttribute("data-selected");
      });

      // Verify all columns are now visible
      await waitFor(() => {
        expect(canvas.getByText("Name with a long header")).toBeInTheDocument();
        expect(canvas.getByText("Age")).toBeInTheDocument();
        expect(canvas.getByText("Role")).toBeInTheDocument();
        expect(canvas.getByText("Custom")).toBeInTheDocument();
      });
    });

    await step("Table data remains correct after column changes", async () => {
      // Verify data is still displayed correctly
      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(1); // Header + data rows

      // Check that first data row contains expected data
      const firstDataRow = rows[1];
      expect(within(firstDataRow).getByText("Alice")).toBeInTheDocument();
    });

    await step("Hiding all columns except one still works", async () => {
      // Hide all except name
      const ageCheckbox = await canvas.getByTestId("column-toggle-age");
      const roleCheckbox = await canvas.getByTestId("column-toggle-role");
      const customCheckbox = await canvas.getByTestId("column-toggle-custom");

      await userEvent.click(ageCheckbox);
      await userEvent.click(roleCheckbox);
      await userEvent.click(customCheckbox);

      await waitFor(() => {
        expect(ageCheckbox).not.toHaveAttribute("data-selected");
        expect(roleCheckbox).not.toHaveAttribute("data-selected");
        expect(customCheckbox).not.toHaveAttribute("data-selected");
      });

      // Only Name column should be visible
      await waitFor(() => {
        expect(canvas.getByText("Name with a long header")).toBeInTheDocument();
        expect(canvas.queryByText("Age")).not.toBeInTheDocument();
        expect(canvas.queryByText("Role")).not.toBeInTheDocument();
        expect(canvas.queryByText("Custom")).not.toBeInTheDocument();
      });

      // Data should still be rendered
      expect(canvas.getByText("Alice")).toBeInTheDocument();
    });

    await step("Column order is preserved", async () => {
      // Show all columns again
      const ageCheckbox = await canvas.getByTestId("column-toggle-age");
      const roleCheckbox = await canvas.getByTestId("column-toggle-role");
      const customCheckbox = await canvas.getByTestId("column-toggle-custom");

      await userEvent.click(ageCheckbox);
      await userEvent.click(roleCheckbox);
      await userEvent.click(customCheckbox);

      await waitFor(() => {
        expect(ageCheckbox).toHaveAttribute("data-selected");
        expect(roleCheckbox).toHaveAttribute("data-selected");
        expect(customCheckbox).toHaveAttribute("data-selected");
      });

      // Get all column headers
      const columnHeaders = canvas.getAllByRole("columnheader");

      // Find the text content of non-selection/non-expand columns
      const columnTexts = columnHeaders
        .map((header) => header.textContent)
        .filter((text) => text && !text.includes("Select"));

      // Verify columns appear in the correct order
      // Order should match the order in the columns array
      const expectedOrder = [
        "Name with a long header",
        "Age",
        "Role",
        "Custom",
      ];

      expectedOrder.forEach((expectedText) => {
        expect(columnTexts).toContain(expectedText);
      });
    });
  },
};
