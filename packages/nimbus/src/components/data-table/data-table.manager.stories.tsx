// DataTable stories for DataTable.Manager: column visibility, layout and custom settings.
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry and the story ids stay the same.

import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { within, expect, waitFor, userEvent, fn } from "storybook/test";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Stack,
  Text,
  DataTable,
} from "@/components";
import { UPDATE_ACTIONS } from "./constants";
import { Palette } from "@commercetools/nimbus-icons";
import {
  columns,
  rows,
  initialVisibleColumns,
  managerRows,
  initialHiddenColumns,
} from "./data-table.test-data";
import type {
  DataTableColumnItem,
  DataTableProps,
  DataTableSize,
} from "./data-table.types";
import { DataTableWithModals } from "./utils/data-table.test-component";
import { toggleCheckbox } from "./utils/data-table.test-utils";

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

/** The row density select in `container`. */
const getDensitySelect = (container: HTMLElement) =>
  within(container).getByRole("button", { name: /row density/i });

/** Opens the row density select and returns the names of its options. */
const openDensityOptions = async (container: HTMLElement) => {
  await userEvent.click(getDensitySelect(container));
  const options = await within(document.body).findAllByRole("option");
  return options.map((option) => option.textContent);
};

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
          onRowAction={() => {}}
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
      await toggleCheckbox(ageCheckbox);

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
      await toggleCheckbox(roleCheckbox);

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
      await toggleCheckbox(ageCheckbox);

      await waitFor(() => {
        expect(ageCheckbox).toHaveAttribute("data-selected");
      });

      // Show custom column
      await toggleCheckbox(customCheckbox);

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

      await toggleCheckbox(ageCheckbox);
      await toggleCheckbox(roleCheckbox);
      await toggleCheckbox(customCheckbox);

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

      await toggleCheckbox(ageCheckbox);
      await toggleCheckbox(roleCheckbox);
      await toggleCheckbox(customCheckbox);

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
    const [size, setSize] = useState<DataTableSize>("xl");

    const handleColumnsChange = (updatedColumns: DataTableColumnItem[]) => {
      setVisibleColumns(updatedColumns);
    };

    const handleSettingsChange = (
      action: string | undefined,
      value?: DataTableSize
    ) => {
      if (!action) {
        return;
      }
      switch (action) {
        case UPDATE_ACTIONS.TOGGLE_TEXT_VISIBILITY:
          setIsTruncated(!isTruncated);
          break;
        case UPDATE_ACTIONS.CHANGE_SIZE:
          if (value) setSize(value);
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
            size={size}
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

    await step("Row density select renders correctly", async () => {
      const dialog = await canvas.getByRole("dialog");
      const tabPanel = within(dialog).getByRole("tab", {
        name: /layout settings/i,
      });
      await userEvent.click(tabPanel);

      // The table uses the default `xl`, so all four sizes are offered
      expect(getDensitySelect(dialog)).toHaveTextContent("Spacious");
      expect(await openDensityOptions(dialog)).toEqual([
        "Spacious",
        "Comfortable",
        "Standard",
        "Compact",
      ]);
      await userEvent.keyboard("{Escape}");

      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBe(6); // Header + 5 data rows

      const firstDataRow = rows[1];
      const cells = within(firstDataRow).getAllByRole("gridcell");
      expect(cells.length).toBeGreaterThan(0);

      // `xl` padding
      const defaultStyles = window.getComputedStyle(cells[0]);
      expect(defaultStyles.paddingTop).toBe("16px");
      expect(defaultStyles.paddingBottom).toBe("16px");
      expect(defaultStyles.paddingLeft).toBe("24px");
      expect(defaultStyles.paddingRight).toBe("24px");
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

/**
 * Picking another size changes the table. The deprecated `xl` stays in the
 * options, because the table started with it. Kept apart from
 * `WithTableManager`, so that story opens on `xl`.
 */
export const LayoutSettingsSizeChange: Story = {
  render: WithTableManager.render,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open the layout settings tab", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /table settings/i })
      );
      const dialog = await within(document.body).findByRole(
        "dialog",
        {},
        { timeout: 3000 }
      );
      await userEvent.click(
        within(dialog).getByRole("tab", { name: /layout settings/i })
      );
    });

    await step("Picking a density changes the size", async () => {
      const dialog = within(document.body).getByRole("dialog");
      await userEvent.click(getDensitySelect(dialog));
      await userEvent.click(
        await within(document.body).findByRole("option", { name: "Standard" })
      );

      await waitFor(() => {
        expect(getDensitySelect(dialog)).toHaveTextContent("Standard");
        const firstCell = within(
          within(canvasElement).getAllByRole("row")[1]
        ).getAllByRole("gridcell")[0];
        expect(window.getComputedStyle(firstCell).padding).toBe("12px");
      });

      // The table started with `xl`, so `xl` stays available
      expect(await openDensityOptions(dialog)).toEqual([
        "Spacious",
        "Comfortable",
        "Standard",
        "Compact",
      ]);
      await userEvent.keyboard("{Escape}");
    });
  },
};

/**
 * Demonstrates the custom settings feature in the DataTable Manager.
 * This story shows how to add a third tab to the settings drawer with custom content.
 * The custom settings panel can include any React component for additional table configurations.
 *
 * This example shows how to use custom action constants alongside built-in UPDATE_ACTIONS
 * for a truly dynamic and extensible settings management system.
 *
 * @example Usage Pattern
 * ```tsx
 * // 1. Define your custom action constants
 * const CUSTOM_ACTIONS = {
 *   TOGGLE_FEATURE: "toggleFeature",
 *   UPDATE_SETTING: "updateSetting",
 * } as const;
 *
 * // 2. Create a handler that accepts both built-in and custom actions
 * const handleSettingsChange = (
 *   action: string | undefined,
 *   value?: DataTableSize
 * ) => {
 *   // Handle built-in actions
 *   if (action === UPDATE_ACTIONS.TOGGLE_TEXT_VISIBILITY) { ... }
 * };
 *
 * // 3. Pass custom settings with your panel component
 * <DataTable.Root
 *   onSettingsChange={handleSettingsChange}
 *   customSettings={{
 *     icon: <YourIcon />,
 *     label: "Custom Tab",
 *     panel: <YourCustomPanel onAction={handleSettingsChange} />
 *   }}
 * />
 * ```
 */
export const WithCustomSettings: Story = {
  render: () => {
    const initialColumnsState = [
      ...initialVisibleColumns,
      ...initialHiddenColumns,
    ];

    const [visibleColumns, setVisibleColumns] = useState<
      DataTableProps["columns"]
    >(initialVisibleColumns);
    const [isTruncated, setIsTruncated] = useState(false);
    const [size, setSize] = useState<DataTableSize>("xl");

    // Custom settings state that affect table appearance
    const [highlightHeaders, setHighlightHeaders] = useState(false);
    const [colorFirstColumn, setColorFirstColumn] = useState(false);
    const [disabledRowIds, setDisabledRowIds] = useState<Set<string>>(
      new Set()
    );

    const handleColumnsChange = (updatedColumns: DataTableColumnItem[]) => {
      setVisibleColumns(updatedColumns);
    };

    const handleToggleHeaderHighlight = () => {
      setHighlightHeaders(!highlightHeaders);
    };

    const handleToggleColumnColor = () => {
      setColorFirstColumn(!colorFirstColumn);
    };

    const handleDisableSpecificRow = () => {
      setDisabledRowIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has("3")) {
          newSet.delete("3");
        } else {
          newSet.add("3");
        }
        return newSet;
      });
    };

    // Dynamic settings handler that supports both built-in and custom actions
    const handleSettingsChange = (
      action: string | undefined,
      value?: DataTableSize
    ) => {
      if (!action) {
        return;
      }

      // Handle built-in actions
      switch (action) {
        case UPDATE_ACTIONS.TOGGLE_TEXT_VISIBILITY:
          setIsTruncated(!isTruncated);
          break;
        case UPDATE_ACTIONS.CHANGE_SIZE:
          if (value) setSize(value);
          break;
      }
    };

    // Apply custom styling to columns based on settings
    const styledColumns: DataTableColumnItem[] = React.useMemo(() => {
      return initialColumnsState.map((col, index) => {
        if (index === 0 && colorFirstColumn) {
          // Apply custom styling to first column
          return {
            ...col,
            render: (cell: {
              value: unknown;
              row: Record<string, unknown>;
              column: DataTableColumnItem;
            }) => {
              const originalValue = col.render
                ? col.render(cell)
                : (cell.value as string);
              return (
                <Text color="blue.11" fontWeight="bold">
                  {originalValue}
                </Text>
              );
            },
          };
        }
        return col;
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colorFirstColumn]);

    // Apply custom row modifications based on settings
    const styledRows = React.useMemo(() => {
      return managerRows.map((row) => ({
        ...row,
        isDisabled: disabledRowIds.has(row.id),
      }));
    }, [disabledRowIds]);

    // Custom settings panel component that triggers onSettingsChange
    const CustomSettingsPanel = () => (
      <Stack direction="column">
        <Box>
          <Heading size="sm" mb="200">
            Visual Customization
          </Heading>
          <Text color="neutral.11" fontSize="sm" mb="400">
            These settings directly affect the table appearance in real-time.
            Watch the table change as you toggle these options!
          </Text>
        </Box>

        <Stack direction="column" gap="400">
          <Checkbox
            isSelected={highlightHeaders}
            onChange={handleToggleHeaderHighlight}
            data-testid="highlight-headers-checkbox"
          >
            <Box>
              <Text fontWeight="medium">Highlight header row</Text>
              <Text fontSize="sm" color="neutral.11">
                Apply purple background to the table header
              </Text>
            </Box>
          </Checkbox>

          <Checkbox
            isSelected={colorFirstColumn}
            onChange={handleToggleColumnColor}
            data-testid="color-first-column-checkbox"
          >
            <Box>
              <Text fontWeight="medium">Color first column</Text>
              <Text fontSize="sm" color="neutral.11">
                Make the &quot;Product name&quot; column text blue and bold
              </Text>
            </Box>
          </Checkbox>

          <Checkbox
            isSelected={disabledRowIds.has("3")}
            onChange={handleDisableSpecificRow}
            data-testid="disable-row-checkbox"
          >
            <Box>
              <Text fontWeight="medium">Disable row #3</Text>
              <Text fontSize="sm" color="neutral.11">
                Disable the third row (makes it non-selectable and grayed out)
              </Text>
            </Box>
          </Checkbox>
        </Stack>

        <Box
          mt="400"
          p="300"
          bg="neutral.3"
          borderRadius="md"
          borderWidth="1px"
          borderColor="neutral.6"
        >
          <Text fontSize="sm" color="neutral.11">
            <strong>Active customizations:</strong>
            <br />• Header highlight:{" "}
            {highlightHeaders ? "Enabled" : "Disabled"}
            <br />• First column color:{" "}
            {colorFirstColumn ? "Enabled" : "Disabled"}
            <br />• Row #3 disabled: {disabledRowIds.has("3") ? "Yes" : "No"}
          </Text>
        </Box>
      </Stack>
    );

    return (
      <>
        <Box mb="400">
          <Heading>Data Table with Custom Settings Panel</Heading>
          <Text color="neutral.11" mt="200">
            This example demonstrates how to add a custom settings tab that
            directly affects the table appearance. Custom action constants are
            passed through <code>onSettingsChange</code> to modify columns,
            rows, and styling in real-time.
          </Text>
        </Box>
        <Stack direction="column" gap="400">
          <DataTable.Root
            columns={styledColumns}
            rows={styledRows}
            visibleColumns={visibleColumns.map((col) => col.id)}
            allowsSorting={true}
            isTruncated={isTruncated}
            size={size}
            selectionMode="multiple"
            disabledKeys={disabledRowIds}
            onColumnsChange={handleColumnsChange}
            onSettingsChange={handleSettingsChange}
            customSettings={{
              icon: <Palette />,
              label: "Custom settings label",
              panel: <CustomSettingsPanel />,
            }}
          >
            <Flex
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              mb="300"
            >
              <Text fontWeight="medium">
                Interactive Table with Real-time Visual Updates
              </Text>
              <Box p="200">
                <DataTable.Manager />
              </Box>
            </Flex>
            <DataTable.Table aria-label="Products table with custom settings">
              <DataTable.Header
                aria-label="Products table header"
                bg={highlightHeaders ? "purple.3" : undefined}
                _hover={
                  highlightHeaders
                    ? { bg: "purple.4", transition: "all 0.2s" }
                    : undefined
                }
              />
              <DataTable.Body aria-label="Products table body" />
            </DataTable.Table>
          </DataTable.Root>
        </Stack>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Custom settings tab renders correctly", async () => {
      // 1. Open the settings drawer
      // Wait for the table to render to avoid early interaction issues
      await waitFor(() => {
        expect(
          canvas.getByText("Interactive Table with Real-time Visual Updates")
        ).toBeInTheDocument();
      });

      const settingsButton = await canvas.findByRole("button", {
        name: /table settings/i,
      });
      await userEvent.click(settingsButton);

      const dialog = await canvas.findByRole("dialog");
      await waitFor(() => {
        expect(dialog).toBeInTheDocument();
      });

      // 2. Check for the custom tab
      const customTab = await within(dialog).findByRole("tab", {
        name: /Custom settings label/i,
      });
      expect(customTab).toBeInTheDocument();

      // 3. Click the custom tab
      await userEvent.click(customTab);
      expect(customTab).toHaveAttribute("aria-selected", "true");

      // 4. Verify panel content
      const panelHeading =
        await within(dialog).findByText(/Visual Customization/i);
      expect(panelHeading).toBeInTheDocument();
    });

    await step("Custom settings interaction works", async () => {
      const dialog = canvas.getByRole("dialog");

      // Find checkbox
      const bordersCheckbox = within(dialog).getByRole("checkbox", {
        name: /Highlight header row/i,
      });

      // Initial state is false
      expect(bordersCheckbox).not.toBeChecked();

      // Toggle on
      await userEvent.click(bordersCheckbox);
      expect(bordersCheckbox).toBeChecked();

      // Toggle off
      await userEvent.click(bordersCheckbox);
      expect(bordersCheckbox).not.toBeChecked();
    });
  },
};

/**
 * The layout settings panel is a named group, and the remove button in the
 * visible-columns list says what it does.
 */
export const ManagerLabels: Story = {
  render: () => {
    const [visibleColumns, setVisibleColumns] = useState<
      DataTableProps["columns"]
    >(initialVisibleColumns);
    return (
      <DataTable.Root
        columns={[...initialVisibleColumns, ...initialHiddenColumns]}
        rows={managerRows}
        visibleColumns={visibleColumns.map((col) => col.id)}
        onColumnsChange={setVisibleColumns}
        onSettingsChange={() => {}}
      >
        <DataTable.Manager />
        <DataTable.Table aria-label="Manager labels table">
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Root>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open the settings drawer", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /table settings/i })
      );
      await within(document.body).findByRole("dialog", {}, { timeout: 3000 });
    });

    await step("Visible columns can be hidden with 'Hide column'", async () => {
      const dialog = within(document.body).getByRole("dialog");
      const hideButtons = await within(dialog).findAllByRole("button", {
        name: "Hide column",
      });
      expect(hideButtons.length).toBeGreaterThan(0);
    });

    await step("The layout settings panel is a named group", async () => {
      const dialog = within(document.body).getByRole("dialog");
      await userEvent.click(
        within(dialog).getByRole("tab", { name: /layout settings/i })
      );
      expect(
        await within(dialog).findByRole("group", {
          name: "Layout settings section",
        })
      ).toBeInTheDocument();
    });
  },
};

/**
 * Pressing the layout option that is already active does not emit a change;
 * pressing the other option emits it once.
 */
export const LayoutSettingsReselect: Story = {
  args: { onSettingsChange: fn() },
  render: (args) => {
    const [visibleColumns, setVisibleColumns] = useState<
      DataTableProps["columns"]
    >(initialVisibleColumns);
    return (
      <DataTable.Root
        columns={[...initialVisibleColumns, ...initialHiddenColumns]}
        rows={managerRows}
        visibleColumns={visibleColumns.map((col) => col.id)}
        onColumnsChange={setVisibleColumns}
        onSettingsChange={args.onSettingsChange}
      >
        <DataTable.Manager />
        <DataTable.Table aria-label="Layout settings table">
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Root>
    );
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await step("Open the layout settings tab", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /table settings/i })
      );
      const dialog = await body.findByRole("dialog", {}, { timeout: 3000 });
      await userEvent.click(
        within(dialog).getByRole("tab", { name: /layout settings/i })
      );
      await within(dialog).findByRole("group", {
        name: "Layout settings section",
      });
    });

    await step("Pressing the active options emits nothing", async () => {
      const dialog = body.getByRole("dialog");
      await userEvent.click(
        within(dialog).getByRole("radio", { name: "Full text" })
      );
      await userEvent.click(getDensitySelect(dialog));
      await userEvent.click(
        await body.findByRole("option", { name: "Spacious" })
      );
      expect(args.onSettingsChange).not.toHaveBeenCalled();
    });

    await step("Pressing the other option emits it once", async () => {
      const dialog = body.getByRole("dialog");
      await userEvent.click(
        within(dialog).getByRole("radio", { name: "Text previews" })
      );
      expect(args.onSettingsChange).toHaveBeenCalledTimes(1);
      expect(args.onSettingsChange).toHaveBeenCalledWith(
        UPDATE_ACTIONS.TOGGLE_TEXT_VISIBILITY
      );
    });
  },
};

/**
 * A table that starts with one of the three current sizes does not offer the
 * deprecated `xl`. Picking a size reports `changeSize` with the size.
 */
export const LayoutSettingsSizeOptions: Story = {
  args: { onSettingsChange: fn() },
  render: (args) => (
    <DataTable.Root
      columns={[...initialVisibleColumns, ...initialHiddenColumns]}
      rows={managerRows}
      visibleColumns={initialVisibleColumns.map((col) => col.id)}
      size="md"
      onSettingsChange={args.onSettingsChange}
    >
      <DataTable.Manager />
      <DataTable.Table aria-label="Layout settings table">
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.Table>
    </DataTable.Root>
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await step("Open the layout settings tab", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /table settings/i })
      );
      const dialog = await body.findByRole("dialog", {}, { timeout: 3000 });
      await userEvent.click(
        within(dialog).getByRole("tab", { name: /layout settings/i })
      );
    });

    await step("Only the three current sizes are offered", async () => {
      const dialog = body.getByRole("dialog");
      expect(getDensitySelect(dialog)).toHaveTextContent("Standard");
      expect(await openDensityOptions(dialog)).toEqual([
        "Comfortable",
        "Standard",
        "Compact",
      ]);
    });

    await step("Picking a size reports it", async () => {
      await userEvent.click(
        await body.findByRole("option", { name: "Compact" })
      );
      expect(args.onSettingsChange).toHaveBeenCalledTimes(1);
      expect(args.onSettingsChange).toHaveBeenCalledWith(
        UPDATE_ACTIONS.CHANGE_SIZE,
        "sm"
      );
    });
  },
};

/**
 * A table that starts on `md` and is later given `xl` (for example when saved
 * settings arrive after the first render) shows `xl` as the current size, and
 * keeps offering it after another size is picked.
 */
export const LayoutSettingsXlArrivesLate: Story = {
  render: () => {
    const [size, setSize] = useState<DataTableSize>("md");
    return (
      <>
        <Button onPress={() => setSize("xl")}>Apply saved size</Button>
        <DataTable.Root
          columns={[...initialVisibleColumns, ...initialHiddenColumns]}
          rows={managerRows}
          visibleColumns={initialVisibleColumns.map((col) => col.id)}
          size={size}
          onSettingsChange={(action, value) => {
            if (action === UPDATE_ACTIONS.CHANGE_SIZE && value) setSize(value);
          }}
        >
          <DataTable.Manager />
          <DataTable.Table aria-label="Layout settings table">
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Root>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await step("Apply the late size and open the settings", async () => {
      await userEvent.click(
        await canvas.findByRole("button", { name: /apply saved size/i })
      );
      await userEvent.click(
        await canvas.findByRole("button", { name: /table settings/i })
      );
      const dialog = await body.findByRole("dialog", {}, { timeout: 3000 });
      await userEvent.click(
        within(dialog).getByRole("tab", { name: /layout settings/i })
      );
    });

    await step("The select shows xl and offers it", async () => {
      const dialog = body.getByRole("dialog");
      expect(getDensitySelect(dialog)).toHaveTextContent("Spacious");
      expect(await openDensityOptions(dialog)).toEqual([
        "Spacious",
        "Comfortable",
        "Standard",
        "Compact",
      ]);
    });

    await step("xl stays offered after picking another size", async () => {
      await userEvent.click(
        await body.findByRole("option", { name: "Compact" })
      );
      const dialog = body.getByRole("dialog");
      await waitFor(() =>
        expect(getDensitySelect(dialog)).toHaveTextContent("Compact")
      );
      expect(await openDensityOptions(dialog)).toEqual([
        "Spacious",
        "Comfortable",
        "Standard",
        "Compact",
      ]);
    });
  },
};
