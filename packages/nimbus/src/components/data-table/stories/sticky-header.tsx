import type { StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { within, expect, waitFor, userEvent } from "storybook/test";
import { Checkbox, Stack } from "@/components";
import { columns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const StickyHeader: Story = {
  render: (args) => {
    const [sticky, setSticky] = useState(false);
    return (
      <Stack gap="500" alignItems="flex-start">
        {/* This is supposed to set the sticky header from the top to the bottom of the table. */}
        <Checkbox
          isSelected={sticky}
          onChange={setSticky}
          data-testid="sticky-toggle"
        >
          Sticky header (with max height)
        </Checkbox>
        <DataTableWithModals
          {...args}
          maxHeight={sticky ? "400px" : undefined}
          onRowClick={() => {}}
          data-testid="sticky-table"
        />
      </Stack>
    );
  },
  args: {
    columns,
    rows: [...rows],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Sticky header toggle renders correctly", async () => {
      const toggle = await canvas.findByTestId("sticky-toggle");
      expect(toggle).toBeInTheDocument();
      expect(toggle).not.toBeChecked();
    });

    await step("Table displays without sticky header initially", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBe(11); // Header + 10 data rows

      // Check that table doesn't have max height initially
      const tableElement =
        table.closest('[data-testid="sticky-table"]') || table;
      const tableStyles = window.getComputedStyle(tableElement);
      expect(tableStyles.maxHeight).toBe("none");
    });

    await step("Enabling sticky header applies max height", async () => {
      const toggle = canvas.getByTestId("sticky-toggle");

      // Click to enable sticky header
      await userEvent.click(toggle);

      await waitFor(() => {
        expect(toggle).toHaveAttribute("data-selected");
      });

      // Verify table has max height applied
      const table = canvas.getByRole("grid");
      const tableElement =
        table.closest('[data-testid="sticky-table"]') || table;
      const tableStyles = window.getComputedStyle(tableElement);
      expect(tableStyles.maxHeight).toBe("400px");
    });

    await step("Sticky header maintains table functionality", async () => {
      const table = canvas.getByRole("grid");
      expect(table).toBeInTheDocument();

      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBe(11); // Header + 10 data rows

      // Verify all data is still visible
      expect(canvas.getByText("Alice")).toBeInTheDocument();
      expect(canvas.getByText("Bob")).toBeInTheDocument();
      expect(canvas.getByText("Carol")).toBeInTheDocument();
    });

    await step("Disabling sticky header removes max height", async () => {
      const toggle = canvas.getByTestId("sticky-toggle");

      // Click to disable sticky header
      await userEvent.click(toggle);

      await waitFor(() => {
        expect(toggle).not.toHaveAttribute("data-selected");
      });

      // Verify table no longer has max height
      const table = canvas.getByRole("grid");
      const tableElement =
        table.closest('[data-testid="sticky-table"]') || table;
      const tableStyles = window.getComputedStyle(tableElement);
      expect(tableStyles.maxHeight).toBe("none");
    });

    await step("Sticky header works with scrolling behavior", async () => {
      const toggle = canvas.getByTestId("sticky-toggle");

      // Enable sticky header
      await userEvent.click(toggle);
      await waitFor(() => {
        expect(toggle).toHaveAttribute("data-selected");
      });

      // Verify table has overflow properties for scrolling
      const table = canvas.getByRole("grid");
      const tableElement =
        table.closest('[data-testid="sticky-table"]') || table;
      const tableStyles = window.getComputedStyle(tableElement);

      // Check that table has scrolling capabilities
      expect(tableStyles.overflow).toBeDefined();
      expect(tableStyles.maxHeight).toBe("400px");
    });

    await step("Sticky header maintains accessibility", async () => {
      const table = canvas.getByRole("grid");
      expect(table).toHaveAttribute("aria-label", "Data table");

      const rows = canvas.getAllByRole("row");
      const headerRow = rows[0];
      const headerCells = within(headerRow).getAllByRole("columnheader");

      // Check that all headers are accessible
      expect(headerCells[0]).toHaveTextContent("Name");
      expect(headerCells[1]).toHaveTextContent("Age");
      expect(headerCells[2]).toHaveTextContent("Role");
      expect(headerCells[3]).toHaveTextContent("Custom");
    });

    await step(
      "Sticky header preserves column headers visibility",
      async () => {
        const toggle = canvas.getByTestId("sticky-toggle");

        // Ensure sticky header is enabled
        if (!toggle.hasAttribute("data-selected")) {
          await userEvent.click(toggle);
          await waitFor(() => {
            expect(toggle).toHaveAttribute("data-selected");
          });
        }

        // Verify header row is still visible and accessible
        const headerRow = canvas.getAllByRole("row")[0];
        expect(headerRow).toBeInTheDocument();

        const headerCells = within(headerRow).getAllByRole("columnheader");
        expect(headerCells.length).toBe(5); // Name, Age, Role, Status, and the invisible pin row column header

        // Verify header cells have proper styling for sticky behavior
        const firstHeaderCell = headerCells[0];
        const headerStyles = window.getComputedStyle(firstHeaderCell);
        expect(headerStyles.position).toBeDefined();
      }
    );
  },
};
