import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { type Selection } from "react-aria-components";
import { within, expect, waitFor, userEvent, fn } from "storybook/test";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Select,
  Stack,
  Text,
  TextInput,
  DataTable,
} from "@/components";
import { useDragAndDrop, createArrayHandlers } from "@commercetools/nimbus";
import {
  columns,
  sortableColumns,
  rows,
  mcMockData,
  mcColumns,
  longTextData,
  truncationColumns,
  comprehensiveData,
  comprehensiveColumns,
  multilineHeadersColumns,
  multilineHeadersData,
  manyColumns,
  wideData,
  nestedComprehensiveTableColumns,
  alignDemoColumns,
  alignDemoRows,
  behaviourColumns,
} from "./data-table.test-data";
import type {
  DataTableRowItem,
  SortDescriptor,
  DataTableProps,
} from "./data-table.types";
import { DataTableWithModals } from "./utils/data-table.test-component";
import { toggleCheckbox, recordWarnings } from "./utils/data-table.test-utils";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<object> = {
  title: "Components/DataTable",
  component: DataTable,
  argTypes: {
    // `xl` is the deprecated default and deliberately not offered here.
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<DataTableProps>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  // VRT: the default grid - header, cell padding, row borders, last-row border removed.
  tags: ["vrt"],
  render: (args) => (
    <DataTableWithModals
      {...args}
      isProductDetailsTable
      onRowAction={() => {}}
    />
  ),
  args: {
    columns: mcColumns,
    rows: mcMockData,
    allowsSorting: true,
    isResizable: true,
    selectionMode: "multiple",
    onSelectionChange: fn(),
    defaultSortDescriptor: {
      column: "dateModified",
      direction: "ascending",
    },
  },
  parameters: {
    chromatic: { disableSnapshot: false },
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
  play: async ({ canvasElement, step, args }) => {
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

      // Assert the reported KEY, not just the checkbox state. Every row in
      // `mcMockData` carries both an `id` and a business `key` (e.g.
      // `{ id: "1", key: "65dc16dc18d" }`), so a DOM-only assertion passes
      // whichever of the two React Aria happens to key the collection by.
      // That is precisely how the row-keying bug reached production.
      const selectionSpy = args.onSelectionChange as unknown as {
        mock: { calls: [Set<string>][] };
      };
      const reported = selectionSpy.mock.calls.at(-1)?.[0] as Set<string>;
      const rowIds = new Set(mcMockData.map((row) => row.id));
      expect(reported.size).toBe(1);
      expect(rowIds.has([...reported][0])).toBe(true);
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

    (document.activeElement as HTMLElement | null)?.blur();
  },
};

export const CustomColumn: Story = {
  render: (args) => <DataTableWithModals {...args} onRowAction={() => {}} />,
  args: { columns, rows },
};

export const SearchAndHighlight: Story = {
  render: (args) => {
    const [search, setSearch] = useState("");
    return (
      <Stack gap={16}>
        <TextInput
          value={search}
          onChange={setSearch}
          placeholder="Search..."
          width="1/3"
          aria-label="search-rows"
          data-testid="search-input"
        />
        <DataTableWithModals
          {...args}
          search={search}
          onRowAction={() => {}}
          data-testid="search-table"
        />
      </Stack>
    );
  },
  args: { columns, rows },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Search input renders correctly", async () => {
      const searchInput = await canvas.findByTestId("search-input");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("placeholder", "Search...");
    });

    await step("Table displays all rows initially", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      const rows = canvas.getAllByRole("row");
      // 1 header row + 10 data rows from the test data
      expect(rows.length).toBe(11);
    });

    await step("Searching filters rows to matching results", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for "Alice"
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Alice");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // 1 header row + 1 matching data row
        expect(rows.length).toBe(2);
      });

      // Verify Alice row is visible
      expect(canvas.getByText("Alice")).toBeInTheDocument();

      // Verify other names are not visible
      expect(canvas.queryByText("Bob")).not.toBeInTheDocument();
      expect(canvas.queryByText("Carol")).not.toBeInTheDocument();
    });

    await step("Search is case-insensitive", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search with lowercase
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "alice");

      await waitFor(() => {
        expect(canvas.getByText("Alice")).toBeInTheDocument();
      });

      // Search with uppercase
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "ALICE");

      await waitFor(() => {
        expect(canvas.getByText("Alice")).toBeInTheDocument();
      });
    });

    await step("Search matches partial text", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for partial match "vel"
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "vel");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // Should match "Developer" role - Emma and Henry
        expect(rows.length).toBeGreaterThan(1);
      });

      // Verify at least one match is visible
      const cells = canvas.getAllByRole("rowheader");
      const hasDeveloperMatch = cells.some((cell) =>
        cell.textContent?.includes("Developer")
      );
      expect(hasDeveloperMatch).toBeTruthy();
    });

    await step("Search across multiple columns", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for age "30"
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "30");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // Should match rows with age 30
        expect(rows.length).toBeGreaterThan(1);
      });

      // Clear and search for role
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Manager");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // Should match Manager role
        expect(rows.length).toBeGreaterThan(1);
      });
    });

    await step("Clearing search shows all rows", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // First search
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Admin");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        expect(rows.length).toBeLessThan(11);
      });

      // Clear search
      await userEvent.clear(searchInput);

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // All rows should be visible again
        expect(rows.length).toBe(11);
      });
    });

    await step("Search with no matches shows empty table", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for something that doesn't exist
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "XYZ123NonExistent");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // Only header row should be present
        expect(rows.length).toBe(2);
      });

      // Verify empty state (no data rows)
      expect(canvas.getByText("No Data")).toBeInTheDocument();
    });

    await step("Highlighted text is present in search results", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for "Ali"
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Ali");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        expect(rows.length).toBe(2); // Header + Alice row
      });

      // Check that the highlighted text is wrapped in a <mark> element
      const highlightedText = canvas.getByText("Ali");
      expect(highlightedText).toBeInTheDocument();
      expect(highlightedText.tagName).toBe("MARK");

      // Verify the full name "Alice" is still accessible as combined text
      const aliceCell = highlightedText.closest("div");
      expect(aliceCell).toHaveTextContent("Alice");

      // Verify there's a mark element for the matched portion
      const markElements = canvas.getAllByText("Ali");
      expect(markElements.length).toBeGreaterThan(0);
      markElements.forEach((mark) => {
        expect(mark.tagName).toBe("MARK");
      });
    });

    await step("Multiple search terms narrow results", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Search for a specific combination
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Admin");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        const adminRowCount = rows.length;
        expect(adminRowCount).toBeGreaterThan(1);
      });

      // Now search for something more specific
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Alice");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        // Should be fewer rows than Admin search
        expect(rows.length).toBe(2); // Header + Alice row
      });
    });

    await step("Search persists across interactions", async () => {
      const searchInput = canvas.getByTestId("search-input");

      // Set search term
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "Developer");

      await waitFor(() => {
        const rows = canvas.getAllByRole("row");
        expect(rows.length).toBeGreaterThan(1);
      });

      // Click on a cell (interaction)
      const firstVisibleRow = canvas.getAllByRole("row")[1];
      const firstCell = within(firstVisibleRow).getAllByRole("gridcell")[0];
      await userEvent.click(firstCell);

      // Search should still be active
      await waitFor(() => {
        expect(searchInput).toHaveValue("Developer");
        const rows = canvas.getAllByRole("row");
        expect(rows.length).toBeGreaterThan(1);
      });
    });
  },
};

export const AdjustableColumns: Story = {
  // VRT: the column resizer and dividers at rest.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: (args) => {
    const [isResizable, setIsResizable] = useState(false);
    return (
      <Stack gap="400" alignItems="flex-start">
        <Checkbox isSelected={isResizable} onChange={setIsResizable}>
          Resizable Column
        </Checkbox>
        <DataTableWithModals
          {...args}
          isResizable={isResizable}
          onRowAction={() => {}}
        />
      </Stack>
    );
  },
  args: {
    columns,
    rows,
  },
};

export const Condensed: Story = {
  // VRT: `density: condensed`; the play ends in condensed mode.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
          onRowAction={() => {}}
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
      await toggleCheckbox(toggle);

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
        await toggleCheckbox(toggle);

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
          await toggleCheckbox(toggle);
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
        await toggleCheckbox(toggle);
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
      await toggleCheckbox(toggle);
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

    (document.activeElement as HTMLElement | null)?.blur();
  },
};

export const StickyHeader: Story = {
  // VRT: `[data-sticky]` header.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
          onRowAction={() => {}}
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
      await toggleCheckbox(toggle);

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
      await toggleCheckbox(toggle);

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
      await toggleCheckbox(toggle);
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
          await toggleCheckbox(toggle);
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

    (document.activeElement as HTMLElement | null)?.blur();
  },
};

export const WithSorting: Story = {
  // VRT: `[aria-sort]` weight on sortable headers, with no column sorted yet.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: (args) => {
    return (
      <Stack gap="500" alignItems="flex-start">
        <Stack gap="300">
          <Heading size="md">Sorting Example</Heading>
          <Text>
            Click on column headers to sort. The "Custom" column is not
            sortable.
          </Text>
        </Stack>
        <DataTableWithModals {...args} onRowAction={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    rows,
    allowsSorting: true,
    ["aria-label"]: "Sorting Example",
  },
};

export const ControlledSorting: Story = {
  // VRT: an active sort - icon revealed, rotated for `ascending`.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
          onRowAction={() => {}}
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

export const SortingWithSearch: Story = {
  render: (args) => {
    const [search, setSearch] = useState("");

    return (
      <Stack gap="500" alignItems="flex-start">
        <Stack gap="300">
          <Heading size="md">Sorting + Search Example</Heading>
          <Text>
            Combine search functionality with sorting. Search results are also
            sortable.
          </Text>
        </Stack>
        <TextInput
          value={search}
          onChange={setSearch}
          placeholder="Search and then sort..."
          width="1/3"
          aria-label="filter-rows"
        />
        <DataTableWithModals {...args} search={search} onRowAction={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    rows,
    allowsSorting: true,
  },
};

export const TextTruncation: Story = {
  // VRT: `truncated` ellipsis; the play re-enables it after testing the off state.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: (args) => {
    const [isTruncated, setIsTruncated] = useState(false);

    return (
      <Stack gap="500" alignItems="flex-start">
        <Checkbox
          isSelected={isTruncated}
          onChange={setIsTruncated}
          data-testid="truncation-checkbox"
        >
          Enable text truncation
        </Checkbox>
        <Box
          border="1px solid"
          borderColor="neutral.6"
          borderRadius="md"
          overflow="hidden"
          maxWidth="100%"
        >
          <DataTableWithModals
            {...args}
            isTruncated={isTruncated}
            onRowAction={() => {}}
          />
        </Box>
      </Stack>
    );
  },
  args: {
    columns: truncationColumns,
    rows: longTextData,
    allowsSorting: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Applies truncation styles to cells when truncation is enabled",
      async () => {
        const checkbox = canvas.getByTestId("truncation-checkbox");
        await toggleCheckbox(checkbox);

        const descriptionCell = canvas.getAllByRole("rowheader", {
          name: /description/i,
        });

        const innerDiv = descriptionCell[0].querySelector("div");
        // TODO: VRT would be a better assertion here.
        // Check if the inner div has the data-truncated attribute -
        // This is the best we can do for now since technically the dom has the full text, we cannot compare texts to see if it is truncated.
        expect(innerDiv).toHaveAttribute("data-truncated", "true");
      }
    );

    await step("Disables truncation when checkbox is unchecked", async () => {
      const checkbox = canvas.getByTestId("truncation-checkbox");
      await toggleCheckbox(checkbox);

      const descriptionCell = canvas.getAllByRole("rowheader", {
        name: /description/i,
      });

      const innerDiv = descriptionCell[0].querySelector("div");

      expect(innerDiv).toHaveAttribute("data-truncated", "false");
    });

    await step("Re-enables truncation", async () => {
      await toggleCheckbox(canvas.getByTestId("truncation-checkbox"));
      await waitFor(() => {
        const cell = canvas.getAllByRole("rowheader", {
          name: /description/i,
        })[0];
        expect(cell.querySelector("div")).toHaveAttribute(
          "data-truncated",
          "true"
        );
      });
    });

    (document.activeElement as HTMLElement | null)?.blur();
  },
};

export const MultilineHeaders: Story = {
  // VRT: the header's `[data-multiline-header]` 2-line clamp and ellipsis.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: (args) => <DataTableWithModals {...args} />,
  args: {
    columns: multilineHeadersColumns,
    rows: multilineHeadersData,
    allowsSorting: true,
    isResizable: true,
    onRowAction: () => {},
  },
};

export const WithFooter: Story = {
  // VRT: the footer slot - the only frame that renders one.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => {
    const footerContent = (
      <Stack
        direction="row"
        justify="space-between"
        align="center"
        gap="400"
        mt="400"
        p="400"
        bg="neutral.2"
        borderRadius="md"
        border="1px solid"
        borderColor="neutral.6"
        data-testid="footer-content"
      >
        <Text fontWeight="bold" data-testid="total-items">
          Total: {rows.length} items
        </Text>
        <Stack
          direction="row"
          gap="300"
          align="center"
          data-testid="pagination-controls"
        >
          <Button size="xs" variant="outline" data-testid="prev-button">
            Previous
          </Button>
          <Text px="300" data-testid="page-info">
            Page 1 of 1
          </Text>
          <Button size="xs" variant="outline" data-testid="next-button">
            Next
          </Button>
        </Stack>
      </Stack>
    );

    return (
      <Stack gap="500" alignItems="flex-start">
        <Stack gap="400">
          <Heading size="lg">📄 DataTable with Custom Footer</Heading>
          <Text color="neutral.11">
            This example shows how to add custom footer content like pagination,
            totals, or action buttons.
          </Text>
        </Stack>

        <DataTableWithModals
          columns={columns}
          rows={rows}
          allowsSorting={true}
          selectionMode="multiple"
          footer={footerContent}
          onRowAction={() => {}}
          data-testid="footer-table"
        />

        <Box mt="400" p="400" bg="neutral.2" borderRadius="md">
          <Heading size="sm" mb="300">
            Footer Features:
          </Heading>
          <Box as="ul" pl="500">
            <Box as="li">Custom content via the `footer` prop</Box>
            <Box as="li">Consistent styling with table theme</Box>
            <Box as="li">Perfect for pagination controls</Box>
            <Box as="li">Works with horizontal scrolling</Box>
            <Box as="li">Can contain any React component</Box>
          </Box>
        </Box>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Footer renders correctly", async () => {
      const table = await canvas.findByTestId("footer-table");
      expect(table).toBeInTheDocument();

      const footerContent = canvas.getByTestId("footer-content");
      expect(footerContent).toBeInTheDocument();
    });

    await step("Footer displays correct content", async () => {
      const totalItems = canvas.getByTestId("total-items");
      expect(totalItems).toHaveTextContent(`Total: ${rows.length} items`);

      const pageInfo = canvas.getByTestId("page-info");
      expect(pageInfo).toHaveTextContent("Page 1 of 1");

      const prevButton = canvas.getByTestId("prev-button");
      const nextButton = canvas.getByTestId("next-button");
      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });
  },
};

export const HorizontalScrolling: Story = {
  render: () => {
    return (
      <Stack gap="500">
        <Stack gap="300">
          <Heading size="lg">📊 Horizontal Scrolling DataTable</Heading>
          <Text color="neutral.11">
            This table has many columns with wide content to demonstrate
            horizontal scrolling. The header remains sticky during horizontal
            scrolling.
          </Text>
        </Stack>

        {/* Container with fixed width to force horizontal scrolling */}
        <DataTableWithModals
          columns={manyColumns}
          rows={wideData}
          isResizable={true}
          allowsSorting={true}
          maxHeight="400px"
          defaultSelectedKeys={new Set(["1", "3"])}
          onRowAction={() => {}}
          footer={
            <Stack
              direction="row"
              justify="space-between"
              align="center"
              gap="400"
            >
              <Text>Showing {wideData.length} employees</Text>
              <Text>Scroll horizontally to see all columns →</Text>
            </Stack>
          }
        />

        <Box mt="400" p="400" bg="neutral.2" borderRadius="md">
          <Heading size="sm" mb="300">
            Features Demonstrated:
          </Heading>
          <Box as="ul" pl="500">
            <Box as="li">
              Horizontal scrolling when columns exceed container width
            </Box>
            <Box as="li">
              Sticky header that remains visible during horizontal scroll
            </Box>
            <Box as="li">Column resizing with maintained scroll position</Box>
            <Box as="li">Row selection maintained during scrolling</Box>
            <Box as="li">Sorting functionality with horizontal scroll</Box>
            <Box as="li">
              Custom footer that scrolls horizontally with the table
            </Box>
          </Box>
        </Box>
      </Stack>
    );
  },
};

export const AllFeatures: Story = {
  render: () => {
    // Feature toggles
    const [search, setSearch] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["1"]));
    const [visibleColumns, setVisibleColumns] = useState([
      "name",
      "age",
      "role",
      "email",
      "status",
    ]);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
      column: "name",
      direction: "ascending",
    });

    // Settings
    const [isResizable, setIsResizable] = useState(true);
    const [allowsSorting, setAllowsSorting] = useState(true);
    const [isRowClickable, setIsRowClickable] = useState(true);
    const [stickyHeader, setStickyHeader] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const [density, setDensity] = useState<"default" | "condensed">("default");
    const [selectionMode, setSelectionMode] = useState<
      "none" | "single" | "multiple"
    >("multiple");
    const [disallowEmptySelection, setDisallowEmptySelection] = useState(true);

    const allColumns = comprehensiveColumns.map((col) => col.id);
    // Create nested table data with proper React components
    const modifiedComprehensiveData = comprehensiveData.map((item) => ({
      ...item,
      children: item.children && (
        <Box p="400">
          <Heading size="sm" mb="300" color="neutral.12">
            {item.name as React.ReactNode} Details
          </Heading>
          <DataTableWithModals
            columns={nestedComprehensiveTableColumns}
            rows={item.children as DataTableRowItem[]}
            allowsSorting={true}
            isResizable={true}
            onRowAction={() => {}}
          />
        </Box>
      ),
    }));

    const handleColumnToggle = (colId: string) => {
      setVisibleColumns((prev) =>
        prev.includes(colId)
          ? prev.filter((id) => id !== colId)
          : [...prev, colId]
      );
    };

    const selectedCount = Array.from(selectedKeys).length;

    return (
      <Stack gap="500">
        <Stack gap="300">
          <Heading size="lg">🚀 DataTable - All Features Showcase</Heading>
          <Text color="neutral.11" fontSize="400">
            Comprehensive demo showcasing all DataTable capabilities. Toggle
            features below to see how they work together.
          </Text>
        </Stack>

        {/* Controls Section */}
        <Box
          p="500"
          bg="neutral.2"
          borderRadius="200"
          border="1px solid"
          borderColor="neutral.6"
        >
          {/* Search */}
          <Box mb="500">
            <Heading size="sm" mb="200" fontSize="350" fontWeight="600">
              🔍 Search & Filter
            </Heading>
            <TextInput
              value={search}
              onChange={setSearch}
              placeholder="Filter table..."
              width="300px"
              aria-label="filter table"
            />
          </Box>

          {/* Column Visibility */}
          <Box mb="500">
            <Heading size="sm" mb="200" fontSize="350" fontWeight="600">
              👁️ Column Visibility
            </Heading>
            <Flex flexWrap="wrap" gap="300">
              {allColumns.map((colId) => (
                <Checkbox
                  key={colId}
                  isSelected={visibleColumns.includes(colId)}
                  onChange={() => handleColumnToggle(colId)}
                >
                  {colId.charAt(0).toUpperCase() + colId.slice(1)}
                </Checkbox>
              ))}
            </Flex>
          </Box>

          {/* Table Settings */}
          <Box marginBottom="500">
            <Heading
              size="lg"
              marginBottom="200"
              fontSize="350"
              fontWeight="600"
            >
              ⚙️ Table Settings
            </Heading>
            <Flex flexWrap="wrap" gap="400">
              <Checkbox isSelected={isResizable} onChange={setIsResizable}>
                Resizable Columns{" "}
              </Checkbox>
              <Checkbox isSelected={allowsSorting} onChange={setAllowsSorting}>
                Sorting
              </Checkbox>
              <Checkbox
                isSelected={isRowClickable}
                onChange={setIsRowClickable}
              >
                Clickable Rows
              </Checkbox>
              <Checkbox isSelected={stickyHeader} onChange={setStickyHeader}>
                Sticky Header
              </Checkbox>
              <Checkbox isSelected={isTruncated} onChange={setIsTruncated}>
                Text Truncation
              </Checkbox>
              <Checkbox
                isSelected={density === "condensed"}
                onChange={(checked) =>
                  setDensity(checked ? "condensed" : "default")
                }
              >
                Condensed Mode
              </Checkbox>
            </Flex>
          </Box>

          {/* Selection Settings */}
          <Box marginBottom="500">
            <Heading
              size="lg"
              marginBottom="200"
              fontSize="350"
              fontWeight="600"
            >
              ✅ Selection Settings
            </Heading>
            <Flex alignItems="center" gap="400" marginBottom="200">
              <Text as="label" fontSize="350" id="select-selection-mode">
                Selection Mode:
              </Text>
              <Select.Root
                selectedKey={selectionMode}
                onSelectionChange={(key) =>
                  setSelectionMode(key as "none" | "single" | "multiple")
                }
                size="sm"
                aria-labelledby="select-selection-mode"
              >
                <Select.Options>
                  <Select.Option id="none">None</Select.Option>
                  <Select.Option id="single">Single</Select.Option>
                  <Select.Option id="multiple">Multiple</Select.Option>
                </Select.Options>
              </Select.Root>
              {selectionMode !== "none" && (
                <Checkbox
                  isSelected={disallowEmptySelection}
                  onChange={setDisallowEmptySelection}
                >
                  Require Selection
                </Checkbox>
              )}
            </Flex>
            {selectionMode !== "none" && (
              <Text fontSize="350" color="neutral.11">
                <Text as="span" fontWeight="600">
                  Selected:
                </Text>{" "}
                {selectedCount} row(s) |{" "}
                <Text as="span" fontWeight="600">
                  IDs:
                </Text>{" "}
                {Array.from(selectedKeys).join(", ") || "None"}
              </Text>
            )}
          </Box>

          {/* Quick Actions */}
          <Box>
            <Heading
              size="lg"
              marginBottom="200"
              fontSize="350"
              fontWeight="600"
            >
              🎯 Quick Actions
            </Heading>
            <Flex gap="200" flexWrap="wrap">
              <Button
                onPress={() => setSelectedKeys(new Set())}
                isDisabled={selectionMode === "none"}
                size="xs"
                variant="outline"
              >
                Clear Selection
              </Button>
              <Button
                onPress={() => setVisibleColumns(allColumns)}
                size="xs"
                variant="outline"
              >
                Show All Columns
              </Button>
              <Button
                onPress={() => setVisibleColumns(["name", "role", "status"])}
                size="xs"
                variant="outline"
              >
                Minimal View
              </Button>
              <Button
                onPress={() => setSearch("Engineer")}
                size="xs"
                variant="outline"
              >
                Search "Engineer"
              </Button>
            </Flex>
          </Box>
        </Box>

        {/* Data Table */}
        <Box
          border="1px solid"
          borderColor="neutral.4"
          borderRadius="200"
          overflow="hidden"
          maxHeight={stickyHeader ? "400px" : "none"}
          // overflowY={stickyHeader ? "auto" : "visible"}
        >
          <DataTableWithModals
            columns={comprehensiveColumns}
            rows={modifiedComprehensiveData}
            visibleColumns={visibleColumns}
            search={search}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            selectionMode={selectionMode}
            disallowEmptySelection={disallowEmptySelection}
            isResizable={isResizable}
            allowsSorting={allowsSorting}
            maxHeight={stickyHeader ? "400px" : undefined}
            isTruncated={isTruncated}
            density={density}
            nestedKey="children"
            onRowAction={isRowClickable ? () => {} : undefined}
          />
        </Box>
        {/* Feature Information */}
        <Box
          p="400"
          bg="info.2"
          borderRadius="200"
          border="1px solid"
          borderColor="info.4"
          fontSize="350"
        >
          <Heading size="lg" marginBottom="300" fontSize="400" fontWeight="600">
            💡 Features Demonstrated
          </Heading>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gap="300"
          >
            <Box>
              <Text fontWeight="600">✨ Core Features:</Text>
              <Box as="ul" marginLeft="400" paddingLeft="0" marginTop="100">
                <Text as="li">Column visibility management</Text>
                <Text as="li">Resizable columns</Text>
                <Text as="li">Search with highlighting</Text>
                <Text as="li">Sorting (controlled)</Text>
              </Box>
            </Box>
            <Box>
              <Text fontWeight="600">🎯 Selection:</Text>
              <Box as="ul" marginLeft="400" paddingLeft="0" marginTop="100">
                <Text as="li">Single/Multiple selection modes</Text>
                <Text as="li">Required selection option</Text>
                <Text as="li">Programmatic selection control</Text>
              </Box>
            </Box>
            <Box>
              <Text fontWeight="600">🚀 Advanced:</Text>
              <Box as="ul" marginLeft="400" paddingLeft="0" marginTop="100">
                <Text as="li">Nested rows with expand/collapse</Text>
                <Text as="li">Custom cell rendering (Status badges)</Text>
                <Text as="li">Text truncation with hover</Text>
                <Text as="li">Sticky headers</Text>
                <Text as="li">Density options</Text>
                <Text as="li">Clickable rows</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    );
  },
  args: {},
};

export const ColumnAlignment: Story = {
  render: () => {
    return <DataTable columns={alignDemoColumns} rows={alignDemoRows} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Table renders with aligned columns", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      expect(canvas.getByText("Widget A")).toBeInTheDocument();
      expect(canvas.getByText("$12.99")).toBeInTheDocument();
    });

    await step(
      "Right-aligned numeric cells have text-align: end on the cell",
      async () => {
        const priceCell = canvas.getByText("$12.99");
        const cell = priceCell.closest("td") as HTMLElement;
        const style = window.getComputedStyle(cell);
        expect(style.textAlign).toBe("end");
      }
    );

    await step(
      "Right-aligned column headers also have text-align: end",
      async () => {
        const priceHeader = canvas.getByText("Unit Price");
        const th = priceHeader.closest("th") as HTMLElement;
        const style = window.getComputedStyle(th);
        expect(style.textAlign).toBe("end");
      }
    );

    await step(
      "Center-aligned cells have text-align: center on the cell",
      async () => {
        const statusCells = canvas.getAllByText("Active");
        const cell = statusCells[0].closest("td") as HTMLElement;
        const style = window.getComputedStyle(cell);
        expect(style.textAlign).toBe("center");
      }
    );

    await step(
      "Center-aligned column header also has text-align: center",
      async () => {
        const statusHeader = canvas.getByText("Status");
        const th = statusHeader.closest("th") as HTMLElement;
        const style = window.getComputedStyle(th);
        expect(style.textAlign).toBe("center");
      }
    );

    await step(
      "Stretch-aligned cells have display: block and width: 100%",
      async () => {
        const progressBars = canvasElement.querySelectorAll("[data-truncated]");
        const stretchWrapper = Array.from(progressBars).find((el) => {
          const style = window.getComputedStyle(el as HTMLElement);
          return style.display === "block";
        }) as HTMLElement;
        expect(stretchWrapper).toBeTruthy();
        const style = window.getComputedStyle(stretchWrapper);
        expect(style.width).not.toBe("0px");
      }
    );

    await step("Stretch cells still support truncation class", async () => {
      const stretchCells = canvasElement.querySelectorAll("[data-truncated]");
      const stretchBlock = Array.from(stretchCells).find((el) => {
        const s = window.getComputedStyle(el as HTMLElement);
        return s.display === "block";
      }) as HTMLElement;
      expect(stretchBlock).toBeTruthy();
      expect(
        stretchBlock.style.overflow ||
          window.getComputedStyle(stretchBlock).overflow
      ).not.toBe("visible");
    });
  },
};

/**
 * `renderEmptyState` replaces the built-in empty message.
 */
export const CustomEmptyState: Story = {
  render: () => (
    <DataTable
      columns={behaviourColumns}
      rows={[]}
      renderEmptyState={() => "Nothing matches your filters"}
      aria-label="Empty table with custom empty state"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The consumer's empty state renders", async () => {
      expect(
        await canvas.findByText("Nothing matches your filters")
      ).toBeInTheDocument();
      expect(canvas.queryByText("No Data")).not.toBeInTheDocument();
    });
  },
};

// ============================================================
// SIZE
// ============================================================

/** First data cell (not an internal column) of the first body row. */
const firstDataCell = (container: HTMLElement) =>
  container.querySelector("tbody td[data-column-id]") as HTMLElement;

/** The sizes consumers choose. `xl` is the deprecated default. */
const documentedSizes = ["sm", "md", "lg"] as const;

/**
 * Expected values per size. `sm`, `md` and `lg` match `Table`'s sizes;
 * `xl` is the pre-`size` appearance.
 */
const expectedSizeStyles = {
  sm: { padX: "8px", padY: "8px", fontSize: "14px", padded: 40 },
  md: { padX: "12px", padY: "12px", fontSize: "14px", padded: 48 },
  lg: { padX: "16px", padY: "12px", fontSize: "16px", padded: 56 },
  xl: { padX: "24px", padY: "16px", fontSize: undefined, padded: 72 },
} as const;

/**
 * `size` controls cell padding, header padding and text size. `sm`, `md` and
 * `lg` share their values with `Table`. Header height follows the padding.
 */
export const Sizes: Story = {
  render: () => (
    <Stack gap="800">
      {documentedSizes.map((size) => (
        <Stack key={size} gap="200">
          <Heading size="sm">size=&quot;{size}&quot;</Heading>
          <DataTable
            columns={columns}
            rows={rows.slice(0, 3)}
            size={size}
            allowsPinning={false}
            aria-label={`Table size ${size}`}
            data-testid={`size-${size}`}
          />
        </Stack>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    for (const size of documentedSizes) {
      await step(`size="${size}" applies the Table values`, async () => {
        const expected = expectedSizeStyles[size];
        const table = await canvas.findByTestId(`size-${size}`);

        const cell = firstDataCell(table);
        const cellStyles = window.getComputedStyle(cell);
        expect(cellStyles.paddingLeft).toBe(expected.padX);
        expect(cellStyles.paddingRight).toBe(expected.padX);
        expect(cellStyles.paddingTop).toBe(expected.padY);
        expect(cellStyles.paddingBottom).toBe(expected.padY);
        expect(cellStyles.fontSize).toBe(expected.fontSize);

        const header = within(table).getAllByRole("columnheader")[0];
        const container = header.querySelector(
          ".nimbus-data-table__column-container"
        ) as HTMLElement;
        const headerStyles = window.getComputedStyle(container);
        expect(headerStyles.paddingLeft).toBe(expected.padX);
        expect(headerStyles.paddingTop).toBe(expected.padY);
        expect(headerStyles.fontSize).toBe(expected.fontSize);
      });
    }

    await step("Header height follows padding, not a fixed 40px", async () => {
      const heights = documentedSizes.map((size) =>
        Math.round(
          canvas
            .getByTestId(`size-${size}`)
            .querySelector("thead")!
            .getBoundingClientRect().height
        )
      );
      // sm has the least padding, so the shortest header
      expect(heights[0]).toBeLessThan(heights[1]);
    });

    await step("Cell content without own text style inherits", async () => {
      const table = canvas.getByTestId("size-lg");
      const cell = firstDataCell(table);
      const content = (cell.firstElementChild as HTMLElement) ?? cell;
      expect(window.getComputedStyle(content).fontSize).toBe("16px");
    });
  },
};

const sizeScrollRows = wideData.slice(0, 4);

const InternalColumnsTable = ({ size }: { size: DataTableProps["size"] }) => {
  const [tableRows, setTableRows] =
    useState<DataTableRowItem[]>(sizeScrollRows);
  const { dragAndDropHooks } = useDragAndDrop({
    ...createArrayHandlers(setTableRows, (row) => row.id),
  });
  return (
    <Box maxW="600px">
      <DataTable
        columns={manyColumns}
        rows={tableRows}
        size={size}
        selectionMode="multiple"
        dragAndDropHooks={dragAndDropHooks}
        renderNestedContent={(row) => <Text>Details for {row.id}</Text>}
        aria-label={`Internal columns size ${size ?? "default"}`}
        data-testid={`internal-${size ?? "default"}`}
      />
    </Box>
  );
};

/**
 * The drag, selection, expand and pin columns scale with the size: controls
 * stay 24×24px (WCAG 2.5.8), the padding around them follows the cell
 * padding. Sticky columns stay flush while scrolling horizontally.
 */
export const SizeInternalColumns: Story = {
  render: () => (
    <Stack gap="800">
      {[...documentedSizes, undefined].map((size) => (
        <InternalColumnsTable key={size ?? "default"} size={size} />
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const width = (el: Element) => Math.round(el.getBoundingClientRect().width);

    for (const size of [...documentedSizes, "xl" as const]) {
      const testId = size === "xl" ? "internal-default" : `internal-${size}`;
      const expected = expectedSizeStyles[size];

      await step(`${size}: internal column widths`, async () => {
        const table = await canvas.findByTestId(testId);
        const thead = table.querySelector("thead")!;
        expect(width(thead.querySelector(".drag-column-header")!)).toBe(24);
        expect(width(thead.querySelector(".selection-column-header")!)).toBe(
          expected.padded
        );
        expect(width(thead.querySelector(".expand-column-header")!)).toBe(24);
        expect(width(thead.querySelector(".pin-rows-column-header")!)).toBe(
          expected.padded
        );
      });

      await step(`${size}: sticky columns stay flush on scroll`, async () => {
        const table = canvas.getByTestId(testId);
        table.scrollLeft = 400;
        await waitFor(() => expect(table.scrollLeft).toBeGreaterThan(0));

        const row = within(table).getAllByRole("row")[1];
        const drag = row.querySelector("[data-slot='drag']")!;
        const selection = row.querySelector("[data-slot='selection']")!;
        const expand = row.querySelector("[data-slot='expand']")!;
        const edge = (el: Element, side: "left" | "right") =>
          Math.round(el.getBoundingClientRect()[side]);

        expect(edge(selection, "left")).toBe(edge(drag, "right"));
        expect(edge(expand, "left")).toBe(edge(selection, "right"));
        table.scrollLeft = 0;
      });
    }

    await step("sm: controls keep a 24×24px target", async () => {
      const table = canvas.getByTestId("internal-sm");
      const row = within(table).getAllByRole("row")[1];
      const targets = [
        row.querySelector("[data-slot='drag'] button")!,
        row.querySelector("[data-slot='expand'] button")!,
        row.querySelector("[data-slot='pin-row-cell'] button")!,
      ];
      for (const target of targets) {
        const rect = target.getBoundingClientRect();
        expect(Math.round(rect.width)).toBeGreaterThanOrEqual(24);
        expect(Math.round(rect.height)).toBeGreaterThanOrEqual(24);
      }
      // The checkbox indicator is 16px; its hit area is a 24px ::after.
      const indicator = row.querySelector(
        "[data-slot='selection'] .nimbus-checkbox__indicator"
      )!;
      const hitArea = window.getComputedStyle(indicator, "::after");
      expect(hitArea.width).toBe("24px");
      expect(hitArea.height).toBe("24px");
    });
  },
};

const explicitXlWarnings: string[] = [];

/** Passing `size="xl"` explicitly warns in development: it is deprecated. */
export const ExplicitXlSizeWarns: Story = {
  beforeEach: recordWarnings(explicitXlWarnings),
  render: () => (
    <DataTable
      columns={columns}
      rows={rows.slice(0, 2)}
      size="xl"
      aria-label="Explicit xl"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("grid");
    await waitFor(() =>
      expect(
        explicitXlWarnings.filter((w) => w.includes('size="xl"'))
      ).toHaveLength(1)
    );
  },
};

const defaultSizeWarnings: string[] = [];

/** The default size is `xl` too, but not passing `size` never warns. */
export const DefaultSizeDoesNotWarn: Story = {
  beforeEach: recordWarnings(defaultSizeWarnings),
  render: () => (
    <DataTable
      columns={columns}
      rows={rows.slice(0, 2)}
      aria-label="Default size"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("grid");
    const cell = firstDataCell(canvasElement);
    expect(window.getComputedStyle(cell).paddingLeft).toBe("24px");
    expect(window.getComputedStyle(cell).paddingTop).toBe("16px");
    expect(
      defaultSizeWarnings.filter(
        (w) => w.includes("size=") || w.includes("density")
      )
    ).toEqual([]);
  },
};

const sizeAndDensityWarnings: string[] = [];

/** With both props set, `size` wins, `density` is ignored, and it warns. */
export const SizeWinsOverDensity: Story = {
  beforeEach: recordWarnings(sizeAndDensityWarnings),
  render: () => (
    <DataTable
      columns={columns}
      rows={rows.slice(0, 2)}
      size="md"
      density="condensed"
      aria-label="Size and density"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("grid");
    const cell = firstDataCell(canvasElement);
    expect(window.getComputedStyle(cell).paddingTop).toBe("12px");
    expect(window.getComputedStyle(cell).paddingLeft).toBe("12px");
    await waitFor(() =>
      expect(
        sizeAndDensityWarnings.filter((w) => w.includes("`density`"))
      ).toHaveLength(1)
    );
  },
};

/**
 * The text in a body cell has the same space above and below it. A wrapper
 * with `overflow: hidden` aligned to the text baseline used to add the font's
 * descender space under the content, so rows were taller than their padding
 * and line height.
 */
export const CellTextIsCenteredVertically: Story = {
  render: () => (
    <DataTable
      columns={columns}
      rows={rows.slice(0, 3)}
      size="md"
      allowsPinning={false}
      aria-label="Cell spacing"
      data-testid="cell-spacing-table"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Space above and below the cell text is equal", async () => {
      const table = canvas.getByTestId("cell-spacing-table");
      const cells = Array.from(
        table.querySelectorAll<HTMLElement>("tbody td[data-column-id]")
      );
      expect(cells.length).toBeGreaterThan(0);
      for (const cell of cells) {
        const range = document.createRange();
        range.selectNodeContents(cell);
        const text = range.getBoundingClientRect();
        const box = cell.getBoundingClientRect();
        expect(
          Math.abs(text.top - box.top - (box.bottom - text.bottom))
        ).toBeLessThan(1.5);
      }
    });

    await step("Row height is padding plus one line plus border", async () => {
      const cell = canvas
        .getByTestId("cell-spacing-table")
        .querySelector<HTMLElement>("tbody td[data-column-id]")!;
      const style = window.getComputedStyle(cell);
      const expected =
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom) +
        parseFloat(style.lineHeight) +
        parseFloat(style.borderBottomWidth);
      expect(
        Math.abs(cell.getBoundingClientRect().height - expected)
      ).toBeLessThan(1.5);
    });
  },
};
