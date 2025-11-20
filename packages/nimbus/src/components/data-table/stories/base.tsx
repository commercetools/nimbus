import type { StoryObj } from "@storybook/react-vite";
import { within, expect, waitFor, userEvent } from "storybook/test";

import { mcMockData, mcColumns } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  render: (args) => (
    <DataTableWithModals
      {...args}
      isProductDetailsTable
      onRowClick={() => {}}
    />
  ),
  args: {
    columns: mcColumns,
    rows: mcMockData,
    allowsSorting: true,
    isResizable: true,
    selectionMode: "multiple",
    defaultSortDescriptor: {
      column: "dateModified",
      direction: "ascending",
    },
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast-apca-custom",
            enabled: false,
          },
          {
            id: "color-contrast",
            enabled: false,
          },
        ],
      },
    },
    docs: {
      description: {
        story:
          "Click on any row to open the product details modal. Edit the fields and click Save to see the changes reflected in the data table. Table is sorted by Date Modified (newest first) by default.",
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // 1. Initial Rendering Tests
    await step("DataTable (grid) renders with correct structure", async () => {
      const table = canvas.getByRole("grid");
      expect(table).toBeInTheDocument();

      expect(canvas.getByText("Product name")).toBeInTheDocument();
      expect(canvas.getByText("Category")).toBeInTheDocument();
      expect(canvas.getByText("Status")).toBeInTheDocument();
      expect(canvas.getByText("Stores")).toBeInTheDocument();
      expect(canvas.getByText("Date modified")).toBeInTheDocument();
    });

    await step("Data rows are rendered", async () => {
      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBe(9); // 1 header + 8 data rows
    });

    // 2. Selection Tests
    await step("Can select individual rows", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1];
      const checkbox = within(firstDataRow).getByRole("checkbox");

      await userEvent.click(checkbox);

      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });

    await step("Can select multiple rows", async () => {
      const rows = canvas.getAllByRole("row");
      const secondDataRow = rows[2];
      const thirdDataRow = rows[3];

      await userEvent.click(within(secondDataRow).getByRole("checkbox"));
      await userEvent.click(within(thirdDataRow).getByRole("checkbox"));

      await waitFor(() => {
        expect(within(secondDataRow).getByRole("checkbox")).toBeChecked();
        expect(within(thirdDataRow).getByRole("checkbox")).toBeChecked();
      });
    });

    await step("Select all checkbox works", async () => {
      const headerCheckboxes = canvas.getAllByRole("checkbox");
      const selectAllCheckbox = headerCheckboxes[0];

      await userEvent.click(selectAllCheckbox);

      await waitFor(() => {
        const allCheckboxes = canvas.getAllByRole("checkbox");
        const rowCheckboxes = allCheckboxes.slice(1);
        rowCheckboxes.forEach((checkbox) => {
          expect(checkbox).toBeChecked();
        });
      });
    });

    // 3. Sorting Tests
    await step("Can sort by clicking column header", async () => {
      const productNameHeader = canvas.getByText("Product name");
      await userEvent.click(productNameHeader);

      await waitFor(() => {
        const columnHeader = productNameHeader.closest('[role="columnheader"]');
        expect(columnHeader).toHaveAttribute("aria-sort");

        // Verify actual sort order - should be ascending alphabetically
        const rows = canvas.getAllByRole("row");
        const firstDataRow = rows[1];
        const firstProductNameCell =
          within(firstDataRow).getAllByRole("rowheader")[0];

        // "Coastal Breeze Linen Pants" should be first alphabetically
        expect(firstProductNameCell.textContent).toContain(
          "Coastal Breeze Linen Pants"
        );
      });
    });

    await step("Can toggle sort direction", async () => {
      const productNameHeader = canvas.getByText("Product name");
      await userEvent.click(productNameHeader);

      await waitFor(() => {
        const columnHeader = productNameHeader.closest('[role="columnheader"]');
        expect(columnHeader).toHaveAttribute("aria-sort");

        // Verify sort direction reversed - should be descending alphabetically
        const rows = canvas.getAllByRole("row");
        const firstDataRow = rows[1];
        const firstProductNameCell =
          within(firstDataRow).getAllByRole("rowheader")[0];

        // "Urban Canvas Denim" should be first in descending order
        expect(firstProductNameCell.textContent).toContain(
          "Urban Canvas Denim"
        );
      });
    });

    // 4. Row Click Tests
    await step("Clicking a row opens details modal", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1];

      // Click a cell in the row (not checkbox)
      const productNameCell = within(firstDataRow).getAllByRole("rowheader")[0];
      await userEvent.click(productNameCell); // Click product name cell

      await waitFor(() => {
        const modal = within(document.body).getByRole("dialog");
        expect(modal).toBeInTheDocument();
      });
    });

    await step("Modal displays correct product details", async () => {
      const modal = within(document.body).getByRole("dialog");
      expect(
        within(modal).getByText(/Product Information/i)
      ).toBeInTheDocument();
    });

    await step("Can close modal", async () => {
      const modal = within(document.body).getByRole("dialog");
      const cancelButton = within(modal).getByRole("button", {
        name: /cancel/i,
      });
      await userEvent.click(cancelButton);

      await waitFor(() => {
        expect(
          document.body.querySelector('[role="dialog"]')
        ).not.toBeInTheDocument();
      });
    });

    // 5. Keyboard Navigation Tests
    await step("Table is keyboard navigable", async () => {
      await userEvent.tab();

      // Tab order goes to the first interactive element in the table
      const focusedElement = document.activeElement as HTMLElement;
      expect(focusedElement).toBeTruthy();

      // Verify element is within the table
      const table = canvas.getByRole("grid");
      expect(table.contains(focusedElement)).toBe(true);
    });

    // 6. Custom Rendering Tests
    await step("Status column renders badges", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1];

      // Find status text (Published, Modified, or Unpublished)
      const statusCell = within(firstDataRow).getAllByRole("rowheader")[2]; // Status is 3rd data column
      expect(statusCell.textContent).toMatch(/Published|Modified|Unpublished/);
    });

    await step("Product name shows both name and Product ID", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1];

      const nameCell = within(firstDataRow).getAllByRole("rowheader")[0]; // Name is 1st data column
      expect(nameCell.textContent).toContain("Product ID:");
    });
  },
};
