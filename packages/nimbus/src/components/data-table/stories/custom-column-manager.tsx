import React, { useState } from "react";
import { DataTable, Checkbox, Stack } from "@/components";
import type { StoryObj } from "@storybook/react-vite";
import { within, expect, waitFor, userEvent } from "storybook/test";
import type { DataTableProps } from "../data-table.types";
import {
  initialVisibleColumns,
  initialHiddenColumns,
  managerRows,
} from "../test-data";
import type { DataTableColumnItem } from "../data-table.types";
import { UPDATE_ACTIONS } from "../constants";
import { Box, Heading, Text, Flex } from "@/components";
import { Palette } from "@commercetools/nimbus-icons";

type Story = StoryObj<DataTableProps>;

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
 * const handleSettingsChange = (action: string | undefined) => {
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
export const CustomColumnManager: Story = {
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

    // Custom settings state that affect table appearance
    const [showBorders, setShowBorders] = useState(false);
    const [highlightHeaders, setHighlightHeaders] = useState(false);
    const [colorFirstColumn, setColorFirstColumn] = useState(false);
    const [disabledRowIds, setDisabledRowIds] = useState<Set<string>>(
      new Set()
    );

    const handleColumnsChange = (updatedColumns: DataTableColumnItem[]) => {
      setVisibleColumns(updatedColumns);
    };

    const handleToggleBorders = () => {
      setShowBorders(!showBorders);
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
    const handleSettingsChange = (action: string | undefined) => {
      if (!action) {
        return;
      }

      // Handle built-in actions
      switch (action) {
        case UPDATE_ACTIONS.TOGGLE_TEXT_VISIBILITY:
          setIsTruncated(!isTruncated);
          break;
        case UPDATE_ACTIONS.TOGGLE_ROW_DENSITY:
          setDensity(density === "condensed" ? "default" : "condensed");
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
            isSelected={showBorders}
            onChange={handleToggleBorders}
            data-testid="show-borders-checkbox"
          >
            <Box>
              <Text fontWeight="medium">Show cell borders</Text>
              <Text fontSize="sm" color="neutral.11">
                Add visible borders around all table cells
              </Text>
            </Box>
          </Checkbox>

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
            <br />• Cell borders: {showBorders ? "Enabled" : "Disabled"}
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
            density={density}
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
            <DataTable.Table
              aria-label="Products table with custom settings"
              borderWidth={showBorders ? "{sizes.25}" : "0"}
              borderColor={showBorders ? "neutral.7" : undefined}
              css={{
                "& td": showBorders
                  ? {
                      borderWidth: "{sizes.25}",
                      borderStyle: "solid",
                      borderColor: "neutral.7",
                    }
                  : undefined,
              }}
            >
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
        name: /show cell borders/i,
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
