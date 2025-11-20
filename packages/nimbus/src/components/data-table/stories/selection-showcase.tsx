import type { StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { type Selection } from "react-aria-components";
import { within, expect, waitFor, userEvent } from "storybook/test";
import {
  Stack,
  Heading,
  Text,
  TextInput,
  Select,
  Checkbox,
  Button,
  Box,
} from "@/components";
import { sortableColumns, rows } from "../test-data";
import type { DataTableProps } from "../data-table.types";
import { DataTableWithModals } from "./utils";

type Story = StoryObj<DataTableProps>;

export const SelectionShowcase: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    const [search, setSearch] = useState("");
    const [selectionMode, setSelectionMode] = useState<
      "none" | "single" | "multiple"
    >("multiple");
    const [disallowEmptySelection, setDisallowEmptySelection] = useState(false);
    const [isRowClickable, setIsRowClickable] = useState(true);

    const selectedCount = Array.from(selectedKeys).length;

    // Reset selection when mode changes
    const handleSelectionModeChange = (
      newMode: "none" | "single" | "multiple"
    ) => {
      setSelectionMode(newMode);
      if (newMode === "none") {
        setSelectedKeys(new Set());
      } else if (newMode === "single" && selectedCount > 1) {
        // Keep only first selected item when switching to single mode
        const firstSelected = Array.from(selectedKeys)[0];
        setSelectedKeys(firstSelected ? new Set([firstSelected]) : new Set());
      }
    };

    return (
      <Stack gap="300" alignItems="flex-start">
        <Stack gap="100">
          <Heading size="md">Row Selection Showcase</Heading>
          <Text>
            Comprehensive demonstration of all row selection capabilities. Use
            the controls below to test different selection modes, behaviors, and
            interactions.
          </Text>
        </Stack>

        {/* Controls Section */}
        <Stack
          gap="300"
          p="500"
          bg="neutral.2"
          borderRadius="100"
          border="1px solid"
          borderColor="neutral.5"
        >
          {/* Search */}
          <Stack gap="100" mb="200">
            <Heading size="sm">🔍 Search & Filter</Heading>
            <TextInput
              value={search}
              onChange={setSearch}
              placeholder="Search to filter rows..."
              width="300px"
              aria-label="filter-rows"
            />
          </Stack>

          {/* Selection Settings */}
          <Stack gap="100" mb="200">
            <Heading size="sm">✅ Selection Mode</Heading>
            <Stack direction="row" gap="300" alignItems="center">
              <Text as="label" fontSize="sm" id="select-selection-mode">
                Mode:
              </Text>
              <Select.Root
                data-testid="selection-mode-select"
                selectedKey={selectionMode}
                onSelectionChange={(key) =>
                  handleSelectionModeChange(
                    key as "none" | "single" | "multiple"
                  )
                }
                width="200px"
                aria-labelledby="select-selection-mode"
              >
                <Select.Options>
                  <Select.Option id="none">None (No Selection)</Select.Option>
                  <Select.Option id="single">Single Row</Select.Option>
                  <Select.Option id="multiple">Multiple Rows</Select.Option>
                </Select.Options>
              </Select.Root>

              <Stack gap="300" direction="row">
                <Checkbox
                  isSelected={isRowClickable}
                  onChange={setIsRowClickable}
                >
                  Clickable Rows
                </Checkbox>
                {selectionMode !== "none" && (
                  <Checkbox
                    isSelected={disallowEmptySelection}
                    onChange={setDisallowEmptySelection}
                  >
                    Require Selection
                  </Checkbox>
                )}
              </Stack>
            </Stack>
            {selectionMode !== "none" && (
              <Text fontSize="350" color="neutral.12">
                <strong>Selected:</strong> {selectedCount} row(s) |{" "}
                <strong>IDs:</strong>{" "}
                {Array.from(selectedKeys).join(", ") || "None"}
              </Text>
            )}
          </Stack>

          {/* Quick Actions */}
          {selectionMode !== "none" && (
            <Stack gap="100">
              <Heading size="sm">🎯 Quick Actions</Heading>
              <Stack direction="row" gap="300" wrap="wrap">
                <Button
                  onPress={() => setSelectedKeys(new Set())}
                  isDisabled={disallowEmptySelection && selectedCount <= 1}
                  size="xs"
                  variant="outline"
                >
                  Clear Selection
                </Button>

                {selectionMode === "multiple" && (
                  <>
                    <Button
                      onPress={() => setSelectedKeys(new Set(["1", "3", "5"]))}
                      size="xs"
                      variant="outline"
                    >
                      Select Odd Rows
                    </Button>
                    <Button
                      onPress={() => setSelectedKeys(new Set(["2", "4", "6"]))}
                      size="xs"
                      variant="outline"
                    >
                      Select Even Rows
                    </Button>
                    <Button
                      onPress={() => setSelectedKeys("all")}
                      size="xs"
                      variant="outline"
                    >
                      Select All
                    </Button>
                  </>
                )}

                {selectionMode === "single" && (
                  <Button
                    onPress={() => setSelectedKeys(new Set(["1"]))}
                    size="xs"
                    variant="outline"
                  >
                    Select First Row
                  </Button>
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
        <DataTableWithModals
          columns={sortableColumns}
          rows={rows}
          search={search}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          selectionMode={selectionMode}
          disallowEmptySelection={disallowEmptySelection}
          allowsSorting={true}
          onRowClick={isRowClickable ? () => {} : undefined}
        />
        {/* Feature Explanation */}
        <Box
          p="400"
          bg="blue.5"
          border="1px solid"
          borderColor="blue.9"
          borderRadius="100"
        >
          <Stack gap="100">
            <Text fontWeight="bold" fontSize="300">
              Features Demonstrated:
            </Text>
            <Box as="ul" pl="500" lineHeight="1.5" fontSize="300">
              <Box as="li">
                <Text as="span" fontWeight="bold" fontSize="300">
                  None Mode:
                </Text>{" "}
                <Text as="span" fontSize="300">
                  No selection checkboxes or functionality
                </Text>
              </Box>
              <Box as="li">
                <Text as="span" fontWeight="bold" fontSize="300">
                  Single Mode:
                </Text>{" "}
                <Text as="span" fontSize="300">
                  Radio-button behavior, one row at a time
                </Text>
              </Box>
              <Box as="li">
                <Text as="span" fontWeight="bold" fontSize="300">
                  Multiple Mode:
                </Text>{" "}
                <Text as="span" fontSize="300">
                  Checkboxes with select all/none in header
                </Text>
              </Box>
              <Box as="li">
                <Text as="span" fontWeight="bold" fontSize="300">
                  Search Integration:
                </Text>{" "}
                <Text as="span" fontSize="300">
                  Selection works with filtered results
                </Text>
              </Box>
              <Box as="li">
                <Text as="span" fontWeight="bold" fontSize="300">
                  Required Selection:
                </Text>{" "}
                <Text as="span" fontSize="300">
                  Prevent deselecting when enabled
                </Text>
              </Box>
              <Box as="li">
                <Text as="span" fontWeight="bold" fontSize="300">
                  Row Clicking:
                </Text>{" "}
                <Text as="span" fontSize="300">
                  Click entire row to select (optional)
                </Text>
              </Box>
              <Box as="li">
                <Text as="span" fontWeight="bold" fontSize="300">
                  Programmatic Control:
                </Text>{" "}
                <Text as="span" fontSize="300">
                  Buttons to demonstrate selection API
                </Text>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Stack>
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Data table renders with selection capabilities", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBe(11); // Header + 10 data rows

      // Check that checkboxes are present for row selection
      const checkboxes = canvas.getAllByRole("checkbox");
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    await step("Single row selection mode works correctly", async () => {
      // Switch to single selection mode
      const select = canvas.getByTestId("selection-mode-select");
      const button = select.querySelector("button");
      await userEvent.click(button as HTMLButtonElement);
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).toBeInTheDocument();

      const options = document.querySelectorAll('[role="option"]');
      await userEvent.click(options[1]);

      await expect(button).toHaveTextContent("Single Row");

      const firstRowCheckbox = canvas.getAllByRole("checkbox")[2]; // First data row checkbox
      await userEvent.click(firstRowCheckbox);

      await waitFor(() => {
        expect(firstRowCheckbox).toBeChecked();
      });

      const secondRowCheckbox = await canvas.getAllByRole("checkbox")[5];
      await userEvent.click(secondRowCheckbox);

      await waitFor(() => {
        expect(firstRowCheckbox).not.toBeChecked();
      });

      await expect(secondRowCheckbox).toBeChecked();
    });

    await step("Multiple row selection works correctly", async () => {
      // Switch to multiple selection mode
      const select = canvas.getByTestId("selection-mode-select");
      const button = select.querySelector("button");
      await userEvent.click(button!);
      const listbox = document.querySelector('[role="listbox"]');
      await expect(listbox).toBeInTheDocument();

      const options = document.querySelectorAll('[role="option"]');
      await userEvent.click(options[2]);

      await expect(button).toHaveTextContent("Multiple Rows");

      const firstRowCheckbox = canvas.getAllByRole("checkbox")[3];
      await userEvent.click(firstRowCheckbox);

      await waitFor(() => {
        expect(firstRowCheckbox).toBeChecked();
      });

      const secondRowCheckbox = await canvas.getAllByRole("checkbox")[5];
      await userEvent.click(secondRowCheckbox);

      await waitFor(() => {
        // two checkboxes can be checked at the same time
        expect(firstRowCheckbox).toBeChecked();
      });

      await expect(secondRowCheckbox).toBeChecked();
    });

    await step("Toggle Select all functionality works", async () => {
      const selectAllCheckboxRow = await canvas.getAllByRole("rowgroup")[0];
      const headerRow = within(selectAllCheckboxRow).getByRole("row");
      const selectAllCheckbox = within(headerRow).getByRole("checkbox");

      await userEvent.click(selectAllCheckbox);

      const checkboxes = canvas.getAllByRole("rowgroup")[1];
      const dataRows = within(checkboxes).getAllByRole("row");
      const dataCheckboxes = dataRows.map((row) =>
        within(row).getByRole("checkbox")
      );
      await Promise.all(
        dataCheckboxes.map(async (checkbox) => {
          return waitFor(() => expect(checkbox).toBeChecked());
        })
      );

      // await userEvent.click(selectAllCheckbox);
    });

    await step("Require selection toggle works", async () => {
      const requireSelectionCheckbox = canvas.getByRole("checkbox", {
        name: "Require Selection",
      });

      // Enable require selection
      await userEvent.click(requireSelectionCheckbox);

      await waitFor(() => {
        expect(requireSelectionCheckbox).toBeChecked();
      });

      // All checkboxes, once checked should not be unchecked
      const selectAllCheckboxRow = await canvas.getAllByRole("rowgroup")[0];
      const headerRow = within(selectAllCheckboxRow).getByRole("row");
      const selectAllCheckbox = within(headerRow).getByRole("checkbox");

      await userEvent.click(selectAllCheckbox);
      await waitFor(() => {
        expect(selectAllCheckbox).toBeChecked();
      });
      // Uncheck all checkboxes should not be unchecked
      await userEvent.click(selectAllCheckbox);
      await waitFor(() => {
        expect(selectAllCheckbox).toBeChecked();
      });
    });

    await step("Clickable rows toggle works", async () => {
      const clickableRowsCheckbox = canvas.getByRole("checkbox", {
        name: "Clickable Rows",
      });

      // Disable clickable rows
      await userEvent.click(clickableRowsCheckbox);

      await waitFor(() => {
        expect(clickableRowsCheckbox).not.toBeChecked();
      });

      // Re-enable clickable rows
      await userEvent.click(clickableRowsCheckbox);

      await waitFor(() => {
        expect(clickableRowsCheckbox).toBeChecked();
      });
    });

    await step("Selection maintains accessibility", async () => {
      const table = canvas.getByRole("grid");
      expect(table).toHaveAttribute("aria-label", "Data table");

      const checkboxes = canvas.getAllByRole("rowgroup")[1];
      const dataRows = within(checkboxes).getAllByRole("row");
      const dataCheckboxes = dataRows.map((row) =>
        within(row).getByRole("checkbox")
      );

      dataCheckboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute("aria-label");
      });
    });
  },
};
