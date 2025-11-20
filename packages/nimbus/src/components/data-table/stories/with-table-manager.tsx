import type { StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { within, expect, waitFor, userEvent } from "storybook/test";
import { Box, Heading, Stack, Text, Flex } from "@/components";
import { DataTable } from "@/components";
import { UPDATE_ACTIONS } from "../constants";
import {
  initialVisibleColumns,
  initialHiddenColumns,
  managerRows,
} from "../test-data";
import type { DataTableProps, DataTableColumnItem } from "../data-table.types";

type Story = StoryObj<DataTableProps>;

/**
 * ## Table Settings Manager
 *
 * This story demonstrates the DataTable.Manager component that allows users to:
 * - Show/hide columns
 * - Reorder visible columns via drag and drop
 * - Reset columns to their default state
 *
 * The settings are opened via a gear icon button and displayed in a drawer.
 */
export const WithTableManager: Story = {
  render: () => {
    const initialColumnsState = [
      ...initialVisibleColumns,
      ...initialHiddenColumns,
    ];

    const [visibleColumns, setVisibleColumns] = useState<
      DataTableProps["columns"]
    >(initialVisibleColumns);
    const [isTruncated, setIsTruncated] = useState(false);
    const [density, setDensity] = useState<"default" | "condensed">("default");

    const handleColumnsChange = (updatedColumns: DataTableColumnItem[]) => {
      setVisibleColumns(updatedColumns);
    };

    const handleSettingsChange = (action: string | undefined) => {
      if (!action) {
        return;
      }
      switch (action) {
        case UPDATE_ACTIONS.TOGGLE_TEXT_VISIBILITY:
          setIsTruncated(!isTruncated);
          break;
        case UPDATE_ACTIONS.TOGGLE_ROW_DENSITY:
          setDensity(density === "condensed" ? "default" : "condensed");
          break;
      }
    };

    return (
      <>
        <Box>
          <Heading>Demo Table with Table Settings Manager</Heading>
        </Box>
        <Stack direction="column" gap="400">
          <DataTable.Root
            columns={initialColumnsState}
            rows={managerRows}
            visibleColumns={visibleColumns.map((col) => col.id)}
            allowsSorting={true}
            isTruncated={isTruncated}
            density={density}
            onColumnsChange={handleColumnsChange}
            onSettingsChange={handleSettingsChange}
          >
            <Flex
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Text>Table settings</Text>
              <Box p="200">
                <DataTable.Manager />
              </Box>
            </Flex>
            <DataTable.Table aria-label="Products table">
              <DataTable.Header aria-label="Products table header" />
              <DataTable.Body aria-label="Products table body" />
            </DataTable.Table>
          </DataTable.Root>
        </Stack>
      </>
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    // const canvas = within(canvasElement);
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step(
      "Settings button renders with correct accessibility",
      async () => {
        // Wait for the table to render
        await waitFor(() => {
          expect(canvas.getByText("Product name")).toBeInTheDocument();
        });

        const settingsButton = await canvas.findByRole("button", {
          name: /table settings/i,
        });
        expect(settingsButton).toBeInTheDocument();
        expect(settingsButton).toHaveAttribute("aria-label", "Table settings");
      }
    );

    await step("Initial visible columns render correctly", async () => {
      // Check that only visible columns appear in the table
      await waitFor(() => {
        expect(canvas.getByText("Product name")).toBeInTheDocument();
        expect(canvas.getByText("SKU")).toBeInTheDocument();
        expect(canvas.getByText("Status")).toBeInTheDocument();
        expect(canvas.getByText("Category")).toBeInTheDocument();
        expect(canvas.getByText("Inventory")).toBeInTheDocument();
      });

      // Check that hidden columns are not visible
      expect(canvas.queryByText("Price")).not.toBeInTheDocument();
      expect(canvas.queryByText("Store")).not.toBeInTheDocument();
    });

    await step(
      "Opening settings drawer displays correct structure",
      async () => {
        const settingsButton = await canvas.findByRole("button", {
          name: /table settings/i,
        });
        await userEvent.click(settingsButton);

        const dialog = canvas.getByRole("dialog");

        // Wait for drawer to appear
        await waitFor(() => {
          expect(dialog).toBeInTheDocument();
        });

        // Verify drawer title
        await waitFor(() => {
          expect(
            within(dialog).getByText("Table settings")
          ).toBeInTheDocument();
        });

        // Verify tabs are present
        const visibleColumnsTab = canvas.getByRole("tab", {
          name: /visible columns/i,
        });
        const layoutSettingsTab = canvas.getByRole("tab", {
          name: /layout settings/i,
        });

        expect(visibleColumnsTab).toBeInTheDocument();
        expect(layoutSettingsTab).toBeInTheDocument();
        expect(visibleColumnsTab).toHaveAttribute("aria-selected", "true");
      }
    );

    await step(
      "Visible columns tab displays correct initial state",
      async () => {
        // Wait for panel content to load
        await waitFor(() => {
          expect(
            canvas.getByRole("tab", { name: /visible columns/i })
          ).toBeInTheDocument();
          expect(canvas.getByText("Hidden columns")).toBeInTheDocument();
        });

        // Verify search input is present
        const searchInput = canvas.getByPlaceholderText(/Search.../i);
        expect(searchInput).toBeInTheDocument();

        // Verify reset button is present
        const resetButton = canvas.getByRole("button", {
          name: /reset columns/i,
        });
        expect(resetButton).toBeInTheDocument();
      }
    );

    await step("Search functionality filters hidden columns", async () => {
      // Get the dialog/drawer to scope our search
      const dialog = canvas.getByRole("dialog");

      // Find the search input specifically by its test ID within the drawer
      const searchField = await within(dialog).findByTestId(
        "search-hidden-columns"
      );
      const searchInput = within(searchField).getByRole("searchbox");

      // Type in search
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "price");

      await waitFor(() => {
        // Price should be visible in search results within the dialog
        expect(within(dialog).getByText("Price")).toBeInTheDocument();
      });

      // Clear search
      await userEvent.clear(searchInput);
    });

    await step(
      "Moving column from visible to hidden removes it from table",
      async () => {
        // Find a visible column and hide it
        const visibleList = await canvas.findByTestId("visible-columns-list");
        const inventoryItem = await within(visibleList).getByText("Inventory");
        expect(inventoryItem).toBeInTheDocument();

        inventoryItem.parentElement?.parentElement?.focus();

        await userEvent.keyboard("{ArrowRight}");
        await userEvent.keyboard("{ArrowRight}");
        await userEvent.keyboard("{Enter}");

        await waitFor(
          async () => {
            // Inventory should now be in hidden list
            const hiddenList = await canvas.findByTestId("hidden-columns-list");
            const hiddenInventory = within(hiddenList).queryByText("Inventory");
            expect(hiddenInventory).toBeInTheDocument();
          },
          { timeout: 3000 }
        );
      }
    );

    await step("Reset columns button restores initial state", async () => {
      const dialog = await canvas.getByRole("dialog");
      const tabPanel = within(dialog).getByRole("tab", {
        name: /visible columns/i,
      });
      await userEvent.click(tabPanel);
      const resetButton = canvas.getByRole("button", {
        name: /Reset columns/i,
      });
      await userEvent.click(resetButton);

      await waitFor(
        async () => {
          // Verify initial visible columns are back
          const visibleList = await canvas.findByTestId("visible-columns-list");
          expect(
            within(visibleList).getByText("Product name")
          ).toBeInTheDocument();
          expect(within(visibleList).getByText("SKU")).toBeInTheDocument();
          expect(within(visibleList).getByText("Status")).toBeInTheDocument();
          expect(within(visibleList).getByText("Category")).toBeInTheDocument();
          expect(
            within(visibleList).getByText("Inventory")
          ).toBeInTheDocument();

          // Price should be back in hidden
          const hiddenList = canvas.getByTestId("hidden-columns-list");
          expect(within(hiddenList).queryByText("Price")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    await step("Row density toggles render correctly", async () => {
      const dialog = await canvas.getByRole("dialog");
      const tabPanel = within(dialog).getByRole("tab", {
        name: /layout settings/i,
      });
      await userEvent.click(tabPanel);

      const comfortableButton = canvas.getByRole("radio", {
        name: /comfortable/i,
      });
      const compactButton = canvas.getByRole("radio", { name: /compact/i });

      expect(comfortableButton).toBeInTheDocument();
      expect(compactButton).toBeInTheDocument();

      // Comfortable should be selected by default
      expect(comfortableButton).toHaveAttribute("data-selected");
      expect(compactButton).not.toHaveAttribute("data-selected");

      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBe(6); // Header + 5 data rows

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

    await step("Row density toggle changes state", async () => {
      const dialog = canvas.getByRole("dialog");
      const tabPanel = within(dialog).getByRole("tab", {
        name: /layout settings/i,
      });
      await userEvent.click(tabPanel);

      const compactButton = canvas.getByRole("radio", { name: /compact/i });
      await userEvent.click(compactButton);

      await waitFor(() => {
        expect(compactButton).toHaveAttribute("data-selected");
      });

      const comfortableButton = canvas.getByRole("radio", {
        name: /comfortable/i,
      });
      userEvent.click(comfortableButton);

      // Check that padding has changed (condensed should have smaller padding)
      const newFirstDataRow = canvas.getAllByRole("row")[1];
      const newFirstCell = within(newFirstDataRow).getAllByRole("gridcell")[0];
      const newPadding = window.getComputedStyle(newFirstCell).padding;

      // Condensed mode should have different padding than default
      expect(newPadding).toBe("12px 24px");
    });

    await step("Text visibility toggle changes state", async () => {
      const dialog = canvas.getByRole("dialog");
      const tabPanel = within(dialog).getByRole("tab", {
        name: /layout settings/i,
      });
      await userEvent.click(tabPanel);

      const textPreviewsButton = canvas.getByRole("radio", {
        name: /Text previews/i,
      });
      await userEvent.click(textPreviewsButton);

      const fullTextButton = canvas.getByRole("radio", {
        name: /Full text/i,
      });
      expect(fullTextButton).not.toHaveAttribute("data-selected");

      await userEvent.click(fullTextButton);

      const closeButton = await canvas.findByLabelText(/close/i);
      await userEvent.click(closeButton);

      const descriptionCell = await canvas.getAllByRole("rowheader", {
        name: /Rustic Knit Merino/i,
      });

      const innerDiv = descriptionCell[0].querySelector("div");
      expect(innerDiv).toHaveAttribute("data-truncated", "false");
    });

    await step("Closing drawer works correctly", async () => {
      const closeButton = await canvas.findByLabelText(/close/i);
      await userEvent.click(closeButton);

      await waitFor(
        () => {
          const drawer = canvas.queryByRole("dialog");
          expect(drawer).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  },
};
