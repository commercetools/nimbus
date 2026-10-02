// DataTable stories for row pinning and the pin column.
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry and the story ids stay the same.

import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { type Selection } from "react-aria-components";
import { within, expect, waitFor, userEvent } from "storybook/test";
import { Heading, Stack, Text, DataTable } from "@/components";
import {
  columns,
  sortableColumns,
  rows,
  behaviourColumns,
  behaviourRows,
} from "./data-table.test-data";
import type { DataTableProps } from "./data-table.types";
import { rowNamed } from "./utils/data-table.test-utils";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<object> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<DataTableProps>;

export const RowPinning: Story = {
  // VRT: the pin-row-cell pinned to the right edge.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
          onRowAction={() => {}}
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

      await waitFor(async () => {
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

    (document.activeElement as HTMLElement | null)?.blur();
  },
};

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
          onRowAction={() => {}}
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

    // TODO: Add keyboard navigation tests
    // await step("Pin functionality works with keyboard navigation", async () => {
    //   const rows = canvas.getAllByRole("row");
    //   const unpinnedRow = rows[3]; // Use an unpinned row

    //   await userEvent.hover(unpinnedRow);
    //   const pinButton = within(unpinnedRow).getByLabelText(/pin row/i);

    //   // Focus the pin button and press Enter
    //   pinButton.focus();
    //   await userEvent.keyboard("{Enter}");

    //   await waitFor(async () => {
    //     expect(unpinnedRow).toHaveClass("data-table-row-pinned");
    //   });
    // });
  },
};

export const HiddenPinColumn: Story = {
  render: () => {
    return (
      <DataTable
        columns={sortableColumns}
        rows={rows}
        allowsPinning={false}
        allowsSorting={true}
        data-testid="no-pin-table"
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Pin column header is not rendered", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      const pinHeader = canvas.queryByRole("columnheader", {
        name: /pin rows/i,
      });
      expect(pinHeader).not.toBeInTheDocument();
    });

    await step("Pin buttons are not rendered in any row", async () => {
      const pinButtons = canvas.queryAllByRole("button", {
        name: /pin row|unpin row/i,
      });
      expect(pinButtons.length).toBe(0);
    });

    await step("Data columns still render correctly", async () => {
      expect(canvas.getByText("Name")).toBeInTheDocument();
      const dataRows = canvas.getAllByRole("row");
      expect(dataRows.length).toBeGreaterThan(1);
    });
  },
};

/**
 * The pin button's name and tooltip come from the message catalog.
 */
export const PinButtonName: Story = {
  render: () => (
    <DataTable
      columns={behaviourColumns}
      rows={behaviourRows}
      aria-label="Pin button name"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Ada");

    await step("An unpinned row offers 'Pin row'", async () => {
      const row = rowNamed(canvasElement, /Ada/);
      const pin = within(row).getByRole("button", { name: "Pin row" });
      expect(pin.closest("[title]")).toHaveAttribute("title", "Pin row");
      await userEvent.click(pin);
    });

    await step("A pinned row offers 'Unpin row'", async () => {
      const row = await waitFor(() => rowNamed(canvasElement, /Ada/));
      const unpin = await within(row).findByRole("button", {
        name: "Unpin row",
      });
      expect(unpin.closest("[title]")).toHaveAttribute("title", "Unpin row");
    });
  },
};

/**
 * The pin button is revealed on hover for mouse users. A keyboard user who
 * moves focus into the row sees it too, instead of focusing an invisible
 * button.
 */
export const PinButtonVisibleOnKeyboardFocus: Story = {
  render: () => (
    <DataTable
      columns={behaviourColumns}
      rows={behaviourRows}
      aria-label="Pin button focus"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Grace");
    const effectiveOpacity = (el: Element) => {
      let o = 1;
      for (let n: Element | null = el; n; n = n.parentElement) {
        o *= parseFloat(getComputedStyle(n).opacity);
      }
      return o;
    };

    await step(
      "The row's pin button shows when the row has focus",
      async () => {
        rowNamed(canvasElement, /Grace/).focus();
        await userEvent.keyboard("{ArrowLeft}");
        const pin = within(rowNamed(canvasElement, /Grace/)).getByRole(
          "button",
          { name: "Pin row" }
        );
        await waitFor(() => expect(document.activeElement).toBe(pin));
        expect(effectiveOpacity(pin)).toBe(1);
      }
    );
  },
};

/**
 * The outline of the pinned rows follows the rows on screen. When the search
 * hides the first pinned row, the next pinned row draws the top edge of the
 * outline; before, it was treated as the last of two pinned rows and had no
 * top edge.
 */
export const PinnedRowOutlineFollowsSearch: Story = {
  render: () => (
    <DataTable
      columns={columns}
      rows={rows}
      defaultPinnedRows={new Set(["1", "2"])}
      search="Bob"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "The only pinned row on screen is outlined on every side",
      async () => {
        const row = canvas.getByRole("row", { name: /Bob/ });
        expect(row).toHaveClass("data-table-row-pinned-single");
        expect(row).not.toHaveClass("data-table-row-pinned-last");
      }
    );
  },
};
