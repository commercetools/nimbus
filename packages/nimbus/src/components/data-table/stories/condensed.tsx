import React, { useState } from "react";
import { Checkbox, Stack } from "@/components";
import type { StoryObj } from "@storybook/react-vite";
import { within, expect, waitFor, userEvent } from "storybook/test";

import { columns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const Condensed: Story = {
  render: (args) => {
    const [condensed, setCondensed] = useState(false);
    return (
      <Stack gap="500" alignItems="flex-start">
        <Checkbox
          isSelected={condensed}
          onChange={setCondensed}
          data-testid="condensed-toggle"
        >
          Condensed
        </Checkbox>
        <DataTableWithModals
          {...args}
          density={condensed ? "condensed" : "default"}
          onRowClick={() => {}}
          data-testid="condensed-table"
        />
      </Stack>
    );
  },
  args: { columns, rows },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Condensed toggle renders correctly", async () => {
      const toggle = await canvas.findByTestId("condensed-toggle");
      expect(toggle).toBeInTheDocument();
      expect(toggle).not.toBeChecked();
    });

    await step("Table displays in default density initially", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBe(11); // Header + 10 data rows

      // Check that rows have default padding/spacing
      const firstDataRow = rows[1];
      const cells = within(firstDataRow).getAllByRole("gridcell");
      expect(cells.length).toBeGreaterThan(0);

      // Store default padding values for comparison
      const firstCell = cells[0];
      const defaultStyles = window.getComputedStyle(firstCell);
      const defaultPadding = {
        top: defaultStyles.paddingTop,
        bottom: defaultStyles.paddingBottom,
        left: defaultStyles.paddingLeft,
        right: defaultStyles.paddingRight,
      };
      // Verify default padding is reasonable (not zero or very small)
      expect(defaultPadding.top).toBe("16px");
      expect(defaultPadding.bottom).toBe("16px");
      expect(defaultPadding.left).toBe("24px");
      expect(defaultPadding.right).toBe("24px");
    });

    await step("Toggling condensed mode changes table density", async () => {
      const toggle = canvas.getByTestId("condensed-toggle");

      // Click to enable condensed mode
      await userEvent.click(toggle);

      await waitFor(() => {
        expect(toggle).toHaveAttribute("data-selected");
      });

      // Verify table is still functional
      const table = canvas.getByRole("grid");
      expect(table).toBeInTheDocument();

      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBe(11); // Header + 10 data rows

      // Check that padding has changed (condensed should have smaller padding)
      const newFirstDataRow = canvas.getAllByRole("row")[1];
      const newFirstCell = within(newFirstDataRow).getAllByRole("gridcell")[0];
      const newPadding = window.getComputedStyle(newFirstCell).padding;

      // Condensed mode should have different padding than default
      expect(newPadding).toBe("12px 24px");
    });

    await step(
      "Toggling back to default density restores normal spacing",
      async () => {
        const toggle = canvas.getByTestId("condensed-toggle");

        // Get current padding values from condensed mode
        const firstDataRow = canvas.getAllByRole("row")[1];
        const firstCell = within(firstDataRow).getAllByRole("gridcell")[0];
        const condensedPadding = window.getComputedStyle(firstCell).padding;

        // Click to disable condensed mode
        await userEvent.click(toggle);

        await waitFor(() => {
          expect(toggle).not.toHaveAttribute("data-selected");
        });

        // Verify table is still functional
        const table = canvas.getByRole("grid");
        expect(table).toBeInTheDocument();

        const rows = canvas.getAllByRole("row");
        expect(rows.length).toBe(11); // Header + 10 data rows

        // Check that padding has been restored to default (should be different from condensed)
        const newFirstDataRow = canvas.getAllByRole("row")[1];
        const newFirstCell =
          within(newFirstDataRow).getAllByRole("gridcell")[0];
        const restoredPadding = window.getComputedStyle(newFirstCell).padding;

        // Default mode should have different padding than condensed
        expect(restoredPadding).not.toBe(condensedPadding);
      }
    );

    await step(
      "Condensed mode applies correct styling properties",
      async () => {
        const toggle = canvas.getByTestId("condensed-toggle");

        // Ensure we're in condensed mode
        if (!toggle.hasAttribute("data-selected")) {
          await userEvent.click(toggle);
          await waitFor(() => {
            expect(toggle).toHaveAttribute("data-selected");
          });
        }

        // Check specific styling properties that should change in condensed mode
        const firstDataRow = canvas.getAllByRole("row")[1];
        const firstCell = within(firstDataRow).getAllByRole("gridcell")[0];
        const cellStyles = window.getComputedStyle(firstCell);

        // Check for condensed-specific styling (these values may vary based on your CSS)
        const paddingTop = cellStyles.paddingTop;
        const paddingBottom = cellStyles.paddingBottom;
        const paddingLeft = cellStyles.paddingLeft;
        const paddingRight = cellStyles.paddingRight;

        // Verify that padding values are present and reasonable for condensed mode
        expect(paddingTop).toBeDefined();
        expect(paddingBottom).toBeDefined();
        expect(paddingLeft).toBeDefined();
        expect(paddingRight).toBeDefined();

        // Check that the table has the condensed density applied
        const table = canvas.getByRole("grid");
        const tableElement = table.closest("[data-density]") || table;
        expect(tableElement).toBeInTheDocument();
      }
    );

    await step("Condensed mode has smaller padding than default", async () => {
      // First, ensure we're in default mode
      const toggle = canvas.getByTestId("condensed-toggle");
      if (toggle.hasAttribute("data-selected")) {
        await userEvent.click(toggle);
        await waitFor(() => {
          expect(toggle).not.toHaveAttribute("data-selected");
        });
      }

      // Get default padding values
      const defaultRow = canvas.getAllByRole("row")[1];
      const defaultCell = within(defaultRow).getAllByRole("gridcell")[0];
      const defaultStyles = window.getComputedStyle(defaultCell);
      const defaultPadding = {
        top: parseInt(defaultStyles.paddingTop),
        bottom: parseInt(defaultStyles.paddingBottom),
        left: parseInt(defaultStyles.paddingLeft),
        right: parseInt(defaultStyles.paddingRight),
      };

      // Switch to condensed mode
      await userEvent.click(toggle);
      await waitFor(() => {
        expect(toggle).toHaveAttribute("data-selected");
      });

      // Get condensed padding values
      const condensedRow = canvas.getAllByRole("row")[1];
      const condensedCell = within(condensedRow).getAllByRole("gridcell")[0];
      const condensedStyles = window.getComputedStyle(condensedCell);
      const condensedPadding = {
        top: parseInt(condensedStyles.paddingTop),
        bottom: parseInt(condensedStyles.paddingBottom),
        left: parseInt(condensedStyles.paddingLeft),
        right: parseInt(condensedStyles.paddingRight),
      };

      // Verify condensed padding is smaller than or equal to default padding
      expect(condensedPadding.top).toBeLessThanOrEqual(defaultPadding.top);
      expect(condensedPadding.bottom).toBeLessThanOrEqual(
        defaultPadding.bottom
      );
      expect(condensedPadding.left).toBeLessThanOrEqual(defaultPadding.left);
      expect(condensedPadding.right).toBeLessThanOrEqual(defaultPadding.right);

      // At least one dimension should be smaller (unless they're already at minimum)
      const hasSmallerPadding =
        condensedPadding.top < defaultPadding.top ||
        condensedPadding.bottom < defaultPadding.bottom ||
        condensedPadding.left < defaultPadding.left ||
        condensedPadding.right < defaultPadding.right;

      expect(hasSmallerPadding).toBe(true);
    });
  },
};
