// DataTable stories for row activation (click and Enter), selection, disabled rows and drag and drop.
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry and the story ids stay the same.

import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { type Selection } from "react-aria-components";
import {
  within,
  expect,
  waitFor,
  userEvent,
  fireEvent,
  fn,
} from "storybook/test";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Link,
  MultilineTextInput,
  Select,
  Stack,
  Text,
  TextInput,
  DataTable,
} from "@/components";
import {
  columns,
  sortableColumns,
  rows,
  behaviourColumns,
  behaviourRows,
} from "./data-table.test-data";
import { useDragAndDrop, createArrayHandlers } from "@commercetools/nimbus";
import type {
  DataTableRowItem,
  DataTableColumnItem,
  DataTableProps,
} from "./data-table.types";
import { DataTableWithModals } from "./utils/data-table.test-component";
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

const DRAG_DELAY_MS = 50;

const wait = (ms: number = DRAG_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const ClickableRows: Story = {
  render: (args) => {
    const [isRowClickable, setIsRowClickable] = useState(true);
    return (
      <Stack gap="500" alignItems="flex-start">
        {/* This is supposed to set the sticky header from the top to the bottom of the table. */}
        <Checkbox isSelected={isRowClickable} onChange={setIsRowClickable}>
          Clickable Rows
        </Checkbox>
        <DataTableWithModals
          {...args}
          onRowAction={isRowClickable ? () => {} : undefined} // Just need to pass a function to enable the modal
          data-testid="clickable-rows-table"
        />
      </Stack>
    );
  },
  args: { columns, rows },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Table renders with clickable rows enabled", async () => {
      const table = await canvas.findByRole("grid");
      expect(table).toBeInTheDocument();

      const rows = canvas.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(1); // At least header + 1 data row
    });

    await step("Clicking a row opens the details modal", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1]; // Skip header row

      // Click on the row (not on a checkbox or interactive element)
      const cells = within(firstDataRow).getAllByRole("gridcell");
      const nonCheckboxCell = cells.find(
        (cell) => !within(cell).queryByRole("checkbox")
      );

      if (nonCheckboxCell) {
        await userEvent.click(nonCheckboxCell);

        // Wait for modal to appear (Dialog is rendered in a portal, so search in document)
        // Also account for the 300ms delay in the row click handler
        await waitFor(
          async () => {
            const dialog = await within(document.body).findByRole("dialog");
            expect(dialog).toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Verify modal title contains row information
        const dialogTitle = within(document.body).getByRole("heading", {
          level: 2,
        });
        expect(dialogTitle.textContent).toContain("Details");

        // Close the modal by clicking the Close button
        const closeButton = within(document.body).getByRole("button", {
          name: /close/i,
        });
        await userEvent.click(closeButton);

        // Wait for modal to close
        await waitFor(() => {
          expect(
            within(document.body).queryByRole("dialog")
          ).not.toBeInTheDocument();
        });
      }
    });

    await step(
      "Clicking on a checkbox does not trigger row click",
      async () => {
        const rows = canvas.getAllByRole("row");
        const secondDataRow = rows[2]; // Use second row

        // Find and click the checkbox
        const checkbox = within(secondDataRow).queryByRole("checkbox");

        if (checkbox) {
          await userEvent.click(checkbox);

          // Wait a bit to ensure no modal appears (account for 300ms delay)
          await new Promise((resolve) => setTimeout(resolve, 600));

          // Verify no modal opened
          expect(
            within(document.body).queryByRole("dialog")
          ).not.toBeInTheDocument();

          // Verify checkbox is checked (the click worked on the checkbox)
          await waitFor(() => {
            expect(checkbox).toBeChecked();
          });
        }
      }
    );

    await step(
      "Double-clicking text does not trigger onRowAction",
      async () => {
        const rows = canvas.getAllByRole("row");
        const firstDataRow = rows[1];
        const cells = within(firstDataRow).getAllByRole("gridcell");
        const textCell = cells.find(
          (cell) => !within(cell).queryByRole("checkbox")
        );
        expect(textCell).toBeTruthy();

        await userEvent.dblClick(textCell!);

        // Wait past the 300ms click timeout to confirm it was cancelled
        await new Promise((resolve) => setTimeout(resolve, 500));

        // No modal should have opened
        expect(
          within(document.body).queryByRole("dialog")
        ).not.toBeInTheDocument();
      }
    );

    await step("Disabling clickable rows prevents row clicks", async () => {
      // Uncheck the "Clickable Rows" checkbox
      const clickableCheckbox = canvas.getByRole("checkbox", {
        name: /clickable rows/i,
      });
      await userEvent.click(clickableCheckbox);

      // Wait for the state to update
      await waitFor(() => {
        expect(clickableCheckbox).not.toBeChecked();
      });

      // Try clicking a row
      const rows = canvas.getAllByRole("row");
      const thirdDataRow = rows[3]; // Use third row
      const cells = within(thirdDataRow).getAllByRole("gridcell");
      const nonCheckboxCell = cells.find(
        (cell) => !within(cell).queryByRole("checkbox")
      );

      if (nonCheckboxCell) {
        await userEvent.click(nonCheckboxCell);

        // Wait to ensure no modal appears (account for 300ms delay)
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Verify no modal opened
        expect(
          within(document.body).queryByRole("dialog")
        ).not.toBeInTheDocument();
      }

      // Re-enable clickable rows for subsequent tests
      await userEvent.click(clickableCheckbox);
      await waitFor(() => {
        expect(clickableCheckbox).toBeChecked();
      });
    });

    await step("Multiple row clicks open modals sequentially", async () => {
      const rows = canvas.getAllByRole("row");

      // Click first row
      const firstDataRow = rows[1];
      const firstCells = within(firstDataRow).getAllByRole("gridcell");
      const firstNonCheckboxCell = firstCells.find(
        (cell) => !within(cell).queryByRole("checkbox")
      );

      if (firstNonCheckboxCell) {
        await userEvent.click(firstNonCheckboxCell);

        // Wait for first modal
        await waitFor(
          async () => {
            const dialog = await within(document.body).findByRole("dialog");
            expect(dialog).toBeInTheDocument();
          },
          { timeout: 3000 }
        );

        // Close first modal
        const closeButton = within(document.body).getByRole("button", {
          name: /close/i,
        });
        await userEvent.click(closeButton);

        await waitFor(() => {
          expect(
            within(document.body).queryByRole("dialog")
          ).not.toBeInTheDocument();
        });

        // Click second row
        const secondDataRow = rows[2];
        const secondCells = within(secondDataRow).getAllByRole("gridcell");
        const secondNonCheckboxCell = secondCells.find(
          (cell) => !within(cell).queryByRole("checkbox")
        );

        if (secondNonCheckboxCell) {
          await userEvent.click(secondNonCheckboxCell);

          // Wait for second modal
          await waitFor(
            async () => {
              const dialog = await within(document.body).findByRole("dialog");
              expect(dialog).toBeInTheDocument();
            },
            { timeout: 3000 }
          );

          // Close second modal
          const closeButton2 = within(document.body).getByRole("button", {
            name: /close/i,
          });
          await userEvent.click(closeButton2);

          await waitFor(() => {
            expect(
              within(document.body).queryByRole("dialog")
            ).not.toBeInTheDocument();
          });
        }
      }
    });

    await step("Row remains accessible via keyboard navigation", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1];

      // Focus on the first cell
      const cells = within(firstDataRow).getAllByRole("gridcell");
      const firstCell = cells.find(
        (cell) => !within(cell).queryByRole("checkbox")
      );

      if (firstCell) {
        firstCell.focus();

        // Verify the cell or its parent can receive focus
        await waitFor(() => {
          expect(
            document.activeElement === firstCell ||
              firstCell.contains(document.activeElement)
          ).toBeTruthy();
        });
      }
    });
  },
};

/**
 * Regression test for a browser event-retargeting bug: when an element the
 * user pressed down on (e.g. a popover option) is removed from the DOM
 * before `mouseup`/`click` fire for that same gesture, the browser
 * retargets those trailing events to whatever is now underneath the
 * pointer - which can be a DataTable row rendered below the popover.
 * `DataTable.Row` guards against this by requiring its own `pointerdown`
 * capture listener to have fired before honoring a `mouseup`. This story
 * exercises that guard directly, without needing a real popover: it fires
 * a `mouseup` with no preceding `pointerdown` on the row (simulating the
 * retargeted event) and confirms `onRowAction` is not called, then performs
 * a normal click to confirm the row still responds to real presses.
 */
const retargetedMouseupGuardRowClick = fn();

export const RowClickIgnoresRetargetedMouseup: Story = {
  render: () => (
    <DataTable.Root
      columns={columns}
      rows={rows}
      selectionMode="none"
      onRowAction={retargetedMouseupGuardRowClick}
    >
      <DataTable.Table aria-label="Retargeted mouseup guard table">
        <DataTable.Header />
        <DataTable.Body />
      </DataTable.Table>
    </DataTable.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "A mouseup with no matching pointerdown on the row is ignored",
      async () => {
        const dataRow = canvas.getAllByRole("row")[1];
        const cell = dataRow.querySelector('[data-column-id="name"]');
        if (!cell) throw new Error("name cell not found");

        // No pointerdown is dispatched first - this is what a retargeted
        // mouseup looks like from the row's perspective.
        fireEvent.mouseUp(cell);

        // handleRowClick debounces by 300ms before calling onRowAction.
        await new Promise((resolve) => setTimeout(resolve, 400));
        await expect(retargetedMouseupGuardRowClick).not.toHaveBeenCalled();
      }
    );

    await step(
      "A normal click (pointerdown and mouseup on the row) still fires onRowAction",
      async () => {
        const dataRow = canvas.getAllByRole("row")[2];
        const cell = dataRow.querySelector('[data-column-id="name"]');
        if (!cell) throw new Error("name cell not found");

        await userEvent.click(cell);

        await waitFor(() => {
          expect(retargetedMouseupGuardRowClick).toHaveBeenCalled();
        });
      }
    );
  },
};

export const SelectionShowcase: Story = {
  // VRT: `[data-selected]` row background.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
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
          onRowAction={isRowClickable ? () => {} : undefined}
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

    (document.activeElement as HTMLElement | null)?.blur();
  },
};

export const DisabledRowsShowcase: Story = {
  // VRT: `[data-disabled]` row opacity, alongside a selected row.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["2"]));
    const [disabledKeys, setDisabledKeys] = useState<Selection>(
      new Set(["3", "5", "7"])
    );
    const toggleDisabled = (rowId: string) => {
      setDisabledKeys((prev) => {
        if (prev === "all") return new Set([rowId]);
        const newSet = new Set(prev);
        if (newSet.has(rowId)) {
          newSet.delete(rowId);
        } else {
          newSet.add(rowId);
        }
        return newSet;
      });
    };

    return (
      <Stack gap="500">
        <Stack gap="300">
          <Heading size="lg">Disabled Rows Showcase</Heading>
          <Text color="neutral.11" fontSize="400">
            Demonstration of disabled row functionality. Disabled rows cannot be
            selected or activated.
          </Text>
        </Stack>

        {/* Controls */}
        <Box
          p="400"
          bg="neutral.2"
          borderRadius="200"
          border="1px solid"
          borderColor="neutral.4"
        >
          <Heading size="lg" marginBottom="300">
            Controls
          </Heading>
          <Flex gap="300" flexWrap="wrap">
            {rows.map((row) => (
              <Button
                key={row.id}
                onPress={() => toggleDisabled(row.id)}
                size="xs"
                variant="outline"
                bg={
                  disabledKeys !== "all" && disabledKeys.has(row.id)
                    ? "critical.3"
                    : "bg"
                }
              >
                {disabledKeys !== "all" && disabledKeys.has(row.id)
                  ? "Enable"
                  : "Disable"}{" "}
                {row.name as React.ReactNode}
              </Button>
            ))}
          </Flex>

          <Flex marginTop="300" gap="200">
            <Button
              onPress={() => setDisabledKeys("all")}
              size="xs"
              variant="outline"
              bg={disabledKeys === "all" ? "critical.3" : "bg"}
            >
              Disable All
            </Button>
            <Button
              onPress={() => setDisabledKeys(new Set())}
              size="xs"
              variant="outline"
            >
              Enable All
            </Button>
          </Flex>
        </Box>

        {/* DataTable */}
        <DataTableWithModals
          columns={sortableColumns}
          rows={rows}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          disabledKeys={disabledKeys}
          selectionMode="multiple"
          allowsSorting={true}
        />
      </Stack>
    );
  },
  args: {},
};

export const DragAndDropRows: Story = {
  render: () => {
    const DraggableTable = () => {
      const simpleColumns: DataTableColumnItem[] = [
        {
          id: "name",
          header: "Name",
          accessor: (row: Record<string, unknown>) =>
            row.name as React.ReactNode,
        },
        {
          id: "role",
          header: "Role",
          accessor: (row: Record<string, unknown>) =>
            row.role as React.ReactNode,
        },
      ];

      const [tableRows, setTableRows] = useState<DataTableRowItem[]>([
        { id: "1", name: "Alice", role: "Admin" },
        { id: "2", name: "Bob", role: "User" },
        { id: "3", name: "Carol", role: "Manager" },
      ]);

      const [clickedRow, setClickedRow] = useState<string | null>(null);

      const { dragAndDropHooks } = useDragAndDrop({
        ...createArrayHandlers(setTableRows, (row) => row.id),
      });

      return (
        <Stack gap="400">
          <DataTable
            columns={simpleColumns}
            rows={tableRows}
            selectionMode="multiple"
            onRowAction={(row) => setClickedRow(row.id)}
            dragAndDropHooks={dragAndDropHooks}
          />
          <Text data-testid="row-order">
            Order: {tableRows.map((r) => r.name).join(", ")}
          </Text>
          <Text data-testid="clicked-row">Clicked: {clickedRow ?? "none"}</Text>
        </Stack>
      );
    };

    return <DraggableTable />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Verify table renders with drag handles, selection, and row click",
      async () => {
        const table = canvas.getByRole("grid");
        const dataRows = within(table).getAllByRole("row");
        expect(dataRows.length).toBe(4);
        expect(canvas.getByTestId("row-order")).toHaveTextContent(
          "Order: Alice, Bob, Carol"
        );
        expect(canvas.getByTestId("clicked-row")).toHaveTextContent(
          "Clicked: none"
        );

        const firstDataRow = dataRows[1];
        expect(
          within(firstDataRow).getByRole("button", {
            name: /drag to reorder/i,
          })
        ).toBeInTheDocument();
      }
    );

    await step("Drag first row down one position via keyboard", async () => {
      const table = canvas.getByRole("grid");
      const rows = within(table).getAllByRole("row");

      // Focus the first data row, then navigate to drag handle
      rows[1].focus();
      await wait();
      await userEvent.keyboard("{ArrowRight}");
      await wait();
      await userEvent.keyboard("{Enter}");
      await wait();
      await userEvent.keyboard("{ArrowDown}");
      await wait();
      await userEvent.keyboard("{Enter}");

      await waitFor(() => {
        expect(canvas.getByTestId("row-order")).toHaveTextContent(
          "Order: Bob, Alice, Carol"
        );
      });
    });

    await step(
      "Double-click on cell text does not trigger row click",
      async () => {
        const table = canvas.getByRole("grid");
        const carolRow = within(table).getByRole("row", { name: /Carol/i });
        const carolCell = within(carolRow).getByText("Carol");

        await userEvent.dblClick(carolCell);
        await wait(400);

        expect(canvas.getByTestId("clicked-row")).toHaveTextContent(
          "Clicked: none"
        );
      }
    );
  },
};

const formatSelection = (keys: Selection) =>
  keys === "all" ? "all" : Array.from(keys).sort().join(",") || "none";

/**
 * `disabledKeys="all"` disables every row for React Aria too: the header
 * checkbox and the keyboard cannot select anything.
 */
export const AllRowsDisabled: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    return (
      <Stack>
        <DataTable
          columns={behaviourColumns}
          rows={behaviourRows}
          selectionMode="multiple"
          disabledKeys="all"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          aria-label="All rows disabled"
        />
        <Text data-testid="all-disabled-selected">
          {formatSelection(selectedKeys)}
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Every row is disabled", async () => {
      await canvas.findByText("Ada");
      const dataRows = canvas.getAllByRole("row").slice(1);
      for (const row of dataRows) {
        expect(row).toHaveAttribute("data-disabled");
      }
    });

    await step("Space on a focused row selects nothing", async () => {
      canvas.getByRole("row", { name: /Ada/ }).focus();
      await userEvent.keyboard(" ");
      await wait(100);
      expect(canvas.getByTestId("all-disabled-selected")).toHaveTextContent(
        /^none$/
      );
    });

    await step("The header checkbox is disabled", async () => {
      const headerRow = canvas.getAllByRole("row")[0];
      const headerCheckbox = within(headerRow).getByRole("checkbox");
      expect(headerCheckbox).toBeDisabled();
      await userEvent.click(headerCheckbox, { pointerEventsCheck: 0 });
      await wait(100);
      expect(canvas.getByTestId("all-disabled-selected")).toHaveTextContent(
        /^none$/
      );
    });
  },
};

/**
 * A row with `isDisabled: true` is disabled without `disabledKeys`.
 */
export const RowDisabledByData: Story = {
  render: () => (
    <DataTable
      columns={behaviourColumns}
      rows={[
        behaviourRows[0],
        { ...behaviourRows[1], isDisabled: true },
        behaviourRows[2],
      ]}
      selectionMode="multiple"
      aria-label="Row disabled by its data"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Only the row with isDisabled is disabled", async () => {
      await canvas.findByText("Grace");
      expect(canvas.getByRole("row", { name: /Grace/ })).toHaveAttribute(
        "data-disabled"
      );
      expect(canvas.getByRole("row", { name: /Ada/ })).not.toHaveAttribute(
        "data-disabled"
      );
      expect(
        within(canvas.getByRole("row", { name: /Grace/ })).getByRole("checkbox")
      ).toBeDisabled();
    });
  },
};

/**
 * Enter on a focused row activates it, like a click. Space keeps selecting.
 * Activation works while other rows are selected, and buttons inside the row
 * keep their own Enter behaviour.
 */
export const RowActionWithKeyboard: Story = {
  args: { onRowAction: fn() },
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    return (
      <Stack>
        <DataTable
          columns={behaviourColumns}
          rows={behaviourRows}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          onRowAction={args.onRowAction}
          aria-label="Row activation with the keyboard"
        />
        <Text data-testid="activation-selected">
          {formatSelection(selectedKeys)}
        </Text>
      </Stack>
    );
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const onRowAction = args.onRowAction as ReturnType<typeof fn>;
    await canvas.findByText("Ada");

    await step("Enter activates the row without selecting it", async () => {
      rowNamed(canvasElement, /Ada/).focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(onRowAction).toHaveBeenCalledWith(
          expect.objectContaining({ id: "r1" })
        )
      );
      expect(canvas.getByTestId("activation-selected")).toHaveTextContent(
        /^none$/
      );
    });

    await step("Space selects the row and does not activate it", async () => {
      onRowAction.mockClear();
      rowNamed(canvasElement, /Ada/).focus();
      await userEvent.keyboard(" ");
      await waitFor(() =>
        expect(canvas.getByTestId("activation-selected")).toHaveTextContent(
          /^r1$/
        )
      );
      await wait(400);
      expect(onRowAction).not.toHaveBeenCalled();
    });

    await step("Enter still activates while a row is selected", async () => {
      rowNamed(canvasElement, /Grace/).focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(onRowAction).toHaveBeenCalledWith(
          expect.objectContaining({ id: "r2" })
        )
      );
      expect(canvas.getByTestId("activation-selected")).toHaveTextContent(
        /^r1$/
      );
    });

    await step("Enter on the pin button pins, not activates", async () => {
      onRowAction.mockClear();
      const pinButton = within(rowNamed(canvasElement, /Linus/)).getByRole(
        "button",
        { pressed: false }
      );
      pinButton.focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(
          within(rowNamed(canvasElement, /Linus/)).getByRole("button", {
            pressed: true,
          })
        ).toBeInTheDocument()
      );
      await wait(400);
      expect(onRowAction).not.toHaveBeenCalled();
    });

    await step("A click activates the row", async () => {
      await userEvent.click(
        within(rowNamed(canvasElement, /Ada/)).getByText("Ada")
      );
      await waitFor(() =>
        expect(onRowAction).toHaveBeenCalledWith(
          expect.objectContaining({ id: "r1" })
        )
      );
    });
  },
};

/**
 * A table whose cells hold a link, a text field and a checkbox, for the
 * stories that check that these controls keep their own clicks and keys.
 */
const CellControlsTable = ({
  onRowAction,
  selectionMode,
  onSelectionChange,
  "aria-label": ariaLabel,
}: Pick<
  DataTableProps,
  "onRowAction" | "selectionMode" | "onSelectionChange"
> & { "aria-label": string }) => {
  const [linkClicks, setLinkClicks] = useState(0);
  const cellControlColumns: DataTableColumnItem[] = [
    ...behaviourColumns,
    {
      id: "profile",
      header: "Profile",
      accessor: (row: Record<string, unknown>) => (
        <Link
          href={`#profile-${row.id}`}
          onClick={(e) => {
            e.preventDefault();
            setLinkClicks((count) => count + 1);
          }}
        >
          {`Profile of ${row.name}`}
        </Link>
      ),
    },
    {
      id: "note",
      header: "Note",
      accessor: (row: Record<string, unknown>) => (
        <MultilineTextInput aria-label={`Note for ${row.name}`} rows={1} />
      ),
    },
    {
      id: "reviewed",
      header: "Reviewed",
      accessor: (row: Record<string, unknown>) => (
        <Checkbox>{`Reviewed ${row.name}`}</Checkbox>
      ),
    },
  ];
  return (
    <Stack>
      <DataTable
        columns={cellControlColumns}
        rows={behaviourRows}
        onRowAction={onRowAction}
        selectionMode={selectionMode}
        onSelectionChange={onSelectionChange}
        aria-label={ariaLabel}
      />
      <Text data-testid="link-clicks">{linkClicks}</Text>
    </Stack>
  );
};

/**
 * Enter on a link or a text field inside a cell goes to that element, not to
 * the row. The row is activated only when the row itself or one of its cells
 * has focus.
 */
export const RowActionLeavesEnterToCellContent: Story = {
  args: { onRowAction: fn() },
  render: (args) => (
    <CellControlsTable
      onRowAction={args.onRowAction}
      aria-label="Enter on cell content"
    />
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const onRowAction = args.onRowAction as ReturnType<typeof fn>;
    await canvas.findByText("Ada");

    await step("Enter on a link opens the link, not the row", async () => {
      rowNamed(canvasElement, /Ada/).focus();
      // Row, then the Name, Role and Profile cells; a cell with a link
      // passes focus on to the link.
      await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
      expect(
        canvas.getByRole("link", { name: "Profile of Ada" })
      ).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(canvas.getByTestId("link-clicks")).not.toHaveTextContent(/^0$/)
      );
      expect(onRowAction).not.toHaveBeenCalled();
    });

    await step("Enter in a text field adds a line break", async () => {
      await userEvent.keyboard("{ArrowRight}");
      const note = canvas.getByRole("textbox", { name: "Note for Ada" });
      expect(note).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      expect(note).toHaveValue("\n");
      expect(onRowAction).not.toHaveBeenCalled();
    });

    await step("Enter on a focused cell still activates the row", async () => {
      rowNamed(canvasElement, /Grace/).focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(
        canvas
          .getByText("Grace")
          .closest('[role="gridcell"], [role="rowheader"]')
      ).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(onRowAction).toHaveBeenCalledWith(
          expect.objectContaining({ id: "r2" })
        )
      );
    });
  },
};

/**
 * A click on a link, a text field or a checkbox label inside a cell goes to
 * that control and does not activate the row. A click anywhere else in the
 * row still does.
 */
export const RowActionIgnoresClicksOnCellControls: Story = {
  args: { onRowAction: fn() },
  render: (args) => (
    <CellControlsTable
      onRowAction={args.onRowAction}
      aria-label="Clicks on cell controls"
    />
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const onRowAction = args.onRowAction as ReturnType<typeof fn>;
    await canvas.findByText("Ada");

    await step("A click on a link opens the link, not the row", async () => {
      await userEvent.click(
        canvas.getByRole("link", { name: "Profile of Ada" })
      );
      await waitFor(() =>
        expect(canvas.getByTestId("link-clicks")).not.toHaveTextContent(/^0$/)
      );
      await wait(400);
      expect(onRowAction).not.toHaveBeenCalled();
    });

    await step("A click in a text field focuses it", async () => {
      const note = canvas.getByRole("textbox", { name: "Note for Ada" });
      await userEvent.click(note);
      expect(note).toHaveFocus();
      await wait(400);
      expect(onRowAction).not.toHaveBeenCalled();
    });

    await step("A click on a checkbox label checks the box", async () => {
      await userEvent.click(canvas.getByText("Reviewed Ada"));
      await waitFor(() =>
        expect(
          canvas.getByRole("checkbox", { name: "Reviewed Ada" })
        ).toBeChecked()
      );
      await wait(400);
      expect(onRowAction).not.toHaveBeenCalled();
    });

    await step("A click on plain cell text activates the row", async () => {
      await userEvent.click(canvas.getByText("Grace"));
      await waitFor(() =>
        expect(onRowAction).toHaveBeenCalledWith(
          expect.objectContaining({ id: "r2" })
        )
      );
    });
  },
};

/**
 * In a table with selection, a click on a link, a text field or a checkbox
 * label inside a cell leaves the row's selection unchanged. Only the row's
 * own checkbox selects it.
 */
export const RowSelectionIgnoresClicksOnCellControls: Story = {
  args: { onSelectionChange: fn() },
  render: (args) => (
    <CellControlsTable
      selectionMode="multiple"
      onSelectionChange={args.onSelectionChange}
      aria-label="Selection and cell controls"
    />
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const onSelectionChange = args.onSelectionChange as ReturnType<typeof fn>;
    await canvas.findByText("Ada");
    const adaRow = rowNamed(canvasElement, /Ada/);

    await step("A click on a link does not select the row", async () => {
      await userEvent.click(
        canvas.getByRole("link", { name: "Profile of Ada" })
      );
      await waitFor(() =>
        expect(canvas.getByTestId("link-clicks")).not.toHaveTextContent(/^0$/)
      );
      expect(onSelectionChange).not.toHaveBeenCalled();
      expect(adaRow).toHaveAttribute("aria-selected", "false");
    });

    await step(
      "A click in a text field keeps focus there and does not select the row",
      async () => {
        const note = canvas.getByRole("textbox", { name: "Note for Ada" });
        await userEvent.click(note);
        expect(note).toHaveFocus();
        expect(onSelectionChange).not.toHaveBeenCalled();
        expect(adaRow).toHaveAttribute("aria-selected", "false");
      }
    );

    await step(
      "A click on a checkbox label checks the box and does not select the row",
      async () => {
        await userEvent.click(canvas.getByText("Reviewed Ada"));
        await waitFor(() =>
          expect(
            canvas.getByRole("checkbox", { name: "Reviewed Ada" })
          ).toBeChecked()
        );
        expect(onSelectionChange).not.toHaveBeenCalled();
        expect(adaRow).toHaveAttribute("aria-selected", "false");
      }
    );

    await step("The row's own checkbox still selects it", async () => {
      const selectionCell = adaRow.querySelector(
        '[data-slot="selection"]'
      ) as HTMLElement;
      await userEvent.click(within(selectionCell).getByRole("checkbox"));
      await waitFor(() =>
        expect(adaRow).toHaveAttribute("aria-selected", "true")
      );
      expect(onSelectionChange).toHaveBeenCalledTimes(1);
    });
  },
};

const plainCellContentColumns: DataTableColumnItem[] = [
  ...behaviourColumns,
  {
    id: "content",
    header: "Content",
    accessor: (row: Record<string, unknown>) => (
      <>
        <a href={`#details-${row.id}`} onClick={(e) => e.preventDefault()}>
          <span>{`Details of ${row.name}`}</span>
        </a>{" "}
        <label>
          <input type="checkbox" /> {`Archived ${row.name}`}
        </label>{" "}
        <span tabIndex={-1}>{`Note on ${row.name}`}</span>
      </>
    ),
  },
];

/**
 * Plain HTML in a cell leaves the row's selection unchanged too: a click on
 * an element inside a link, on a label, or on an element with
 * `tabindex="-1"`. React Aria does not ignore these presses itself.
 */
export const RowSelectionIgnoresClicksOnPlainCellContent: Story = {
  args: { onSelectionChange: fn() },
  render: (args) => (
    <DataTable
      columns={plainCellContentColumns}
      rows={behaviourRows}
      selectionMode="multiple"
      onSelectionChange={args.onSelectionChange}
      aria-label="Selection and plain cell content"
    />
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const onSelectionChange = args.onSelectionChange as ReturnType<typeof fn>;
    await canvas.findByText("Ada");
    const adaRow = rowNamed(canvasElement, /Ada/);

    await step(
      "A click on text inside a link does not select the row",
      async () => {
        await userEvent.click(canvas.getByText("Details of Ada"));
        expect(onSelectionChange).not.toHaveBeenCalled();
        expect(adaRow).toHaveAttribute("aria-selected", "false");
      }
    );

    await step(
      "A click on a label checks its box and does not select the row",
      async () => {
        await userEvent.click(canvas.getByText("Archived Ada"));
        await waitFor(() =>
          expect(
            canvas.getByRole("checkbox", { name: "Archived Ada" })
          ).toBeChecked()
        );
        expect(onSelectionChange).not.toHaveBeenCalled();
        expect(adaRow).toHaveAttribute("aria-selected", "false");
      }
    );

    await step(
      'A click on an element with tabindex="-1" does not select the row',
      async () => {
        await userEvent.click(canvas.getByText("Note on Ada"));
        expect(onSelectionChange).not.toHaveBeenCalled();
        expect(adaRow).toHaveAttribute("aria-selected", "false");
      }
    );
  },
};

/**
 * Disabled rows are never activated.
 */
export const RowActionSkipsDisabledRows: Story = {
  args: { onRowAction: fn() },
  render: (args) => (
    <DataTable
      columns={behaviourColumns}
      rows={behaviourRows}
      disabledKeys={new Set(["r2"])}
      onRowAction={args.onRowAction}
      aria-label="Disabled rows are not activated"
    />
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const onRowAction = args.onRowAction as ReturnType<typeof fn>;
    await canvas.findByText("Grace");

    await step("Clicking a disabled row calls nothing", async () => {
      await userEvent.click(canvas.getByText("Grace"), {
        pointerEventsCheck: 0,
      });
      await wait(500);
      expect(onRowAction).not.toHaveBeenCalled();
    });

    await step("Clicking an enabled row still activates it", async () => {
      await userEvent.click(canvas.getByText("Ada"));
      await waitFor(() => expect(onRowAction).toHaveBeenCalledTimes(1));
      expect(onRowAction).toHaveBeenCalledWith(
        expect.objectContaining({ id: "r1" })
      );
    });
  },
};

/**
 * The deprecated `onRowClick` keeps working, including for Enter.
 */
export const DeprecatedOnRowClick: Story = {
  args: { onRowClick: fn() },
  render: (args) => (
    <DataTable
      columns={behaviourColumns}
      rows={behaviourRows}
      onRowClick={args.onRowClick}
      aria-label="Deprecated onRowClick"
    />
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    const onRowClick = args.onRowClick as ReturnType<typeof fn>;
    await canvas.findByText("Ada");

    await step("A click calls onRowClick", async () => {
      await userEvent.click(canvas.getByText("Ada"));
      await waitFor(() =>
        expect(onRowClick).toHaveBeenCalledWith(
          expect.objectContaining({ id: "r1" })
        )
      );
    });

    await step("Enter calls onRowClick", async () => {
      onRowClick.mockClear();
      rowNamed(canvasElement, /Grace/).focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(onRowClick).toHaveBeenCalledWith(
          expect.objectContaining({ id: "r2" })
        )
      );
    });
  },
};

/**
 * When both are passed, only `onRowAction` is called.
 */
export const OnRowActionWinsOverOnRowClick: Story = {
  args: { onRowAction: fn(), onRowClick: fn() },
  render: (args) => (
    <DataTable
      columns={behaviourColumns}
      rows={behaviourRows}
      onRowAction={args.onRowAction}
      onRowClick={args.onRowClick}
      aria-label="Both activation callbacks"
    />
  ),
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Ada");

    await step("Only onRowAction is called", async () => {
      await userEvent.click(canvas.getByText("Ada"));
      await waitFor(() => expect(args.onRowAction).toHaveBeenCalledTimes(1));
      expect(args.onRowClick).not.toHaveBeenCalled();
    });
  },
};

/**
 * Without an expand column and without `onRowAction`, only rows with nested
 * content are activated. On a row without children, Enter selects the row, as
 * it does in a table without nested content.
 */
export const EnterSelectsRowWithoutChildren: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    return (
      <Stack>
        <DataTable
          columns={behaviourColumns}
          rows={[
            { ...behaviourRows[0], children: [{ id: "c1" }] },
            ...behaviourRows.slice(1),
          ]}
          nestedKey="children"
          allowsExpandColumn={false}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          aria-label="Enter on rows without children"
        />
        <Text data-testid="leaf-selected">{formatSelection(selectedKeys)}</Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Grace");

    await step("Enter selects a row without children", async () => {
      rowNamed(canvasElement, /Grace/).focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(canvas.getByTestId("leaf-selected")).toHaveTextContent(/^r2$/)
      );
    });

    await step("Enter still expands a row with children", async () => {
      rowNamed(canvasElement, /Ada/).focus();
      await userEvent.keyboard("{Enter}");
      expect(await canvas.findByText("Nested items: 1")).toBeInTheDocument();
      expect(canvas.getByTestId("leaf-selected")).toHaveTextContent(/^r2$/);
    });

    await step("Only the row with children looks clickable", async () => {
      expect(rowNamed(canvasElement, /Ada/)).toHaveAttribute(
        "data-clickable",
        "true"
      );
      expect(rowNamed(canvasElement, /Grace/)).not.toHaveAttribute(
        "data-clickable",
        "true"
      );
    });
  },
};

/**
 * Disabled rows use the shared `disabled` layer style, like disabled rows in
 * Tree, ListBox and DraggableList, and give no hover feedback.
 */
export const DisabledRowStyle: Story = {
  render: () => (
    <DataTable
      columns={behaviourColumns}
      rows={[behaviourRows[0], { ...behaviourRows[1], isDisabled: true }]}
      aria-label="Disabled row style"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Grace");
    const disabledRow = rowNamed(canvasElement, /Grace/);
    const enabledRow = rowNamed(canvasElement, /Ada/);

    await step("A disabled row uses the disabled layer style", async () => {
      expect(getComputedStyle(disabledRow).opacity).toBe("0.5");
      expect(getComputedStyle(disabledRow).cursor).toBe("not-allowed");
      expect(getComputedStyle(enabledRow).opacity).toBe("1");
    });

    // CSS :hover needs a real pointer. Simulated events from storybook/test
    // do not trigger it, so this step runs only under the Vitest browser
    // runner (see isVitestBrowser in checkbox.stories.tsx).
    const isVitestBrowser = Boolean(
      (globalThis as { __vitest_browser__?: boolean }).__vitest_browser__
    );
    if (isVitestBrowser) {
      const { userEvent: realUserEvent } = await import("vitest/browser");
      await step("Hovering a disabled row does not highlight it", async () => {
        const restingBg = getComputedStyle(disabledRow).backgroundColor;
        await realUserEvent.hover(within(disabledRow).getByText("Grace"));
        await wait(400);
        expect(getComputedStyle(disabledRow).backgroundColor).toBe(restingBg);
      });

      await step("Hovering an enabled row still highlights it", async () => {
        const restingBg = getComputedStyle(enabledRow).backgroundColor;
        await realUserEvent.hover(within(enabledRow).getByText("Ada"));
        await wait(400);
        expect(getComputedStyle(enabledRow).backgroundColor).not.toBe(
          restingBg
        );
      });
    }
  },
};
