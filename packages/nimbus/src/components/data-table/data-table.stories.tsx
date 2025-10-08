import type { Meta, StoryObj } from "@storybook/react-vite";
import React, {
  useState,
  isValidElement,
  type ReactNode,
  useEffect,
} from "react";
import { type Selection } from "react-aria-components";
import { within, expect, waitFor, userEvent } from "storybook/test";
import {
  Stack,
  TextInput,
  Dialog,
  Button,
  Checkbox,
  Heading,
  Text,
  Select,
  Box,
  Flex,
} from "@/components";
import { DataTable } from "./data-table";
import {
  columns,
  sortableColumns,
  data,
  mcMockData,
  mcColumns,
  longTextData,
  truncationColumns,
  comprehensiveData,
  comprehensiveColumns,
  flexibleNestedData,
  modifiedFetchedData,
  multilineHeadersColumns,
  multilineHeadersData,
  manyColumns,
  wideData,
  nestedComprehensiveTableColumns,
} from "./test-data";

import type {
  DataTableRowItem,
  SortDescriptor,
  DataTableProps,
} from "./data-table.types";

type ModalState = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;

  children: React.ReactNode;
};

const InfoModal = ({ isOpen, onClose, title, children }: ModalState) => (
  <Dialog.Root
    isOpen={isOpen}
    onOpenChange={(open) => !open && onClose && onClose()}
  >
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>{children}</Dialog.Body>
      <Dialog.Footer>
        <Button onPress={onClose}>Close</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
);

type DetailsModalItemProps = {
  label: string;
  value: ReactNode;
};

const DetailsModalItem = ({ label, value }: DetailsModalItemProps) =>
  label !== "children" &&
  !isValidElement(value) && (
    <Flex gap="200" as="li">
      <Text color="neutral.11" as="label" id={`${label}-${value}`}>
        {label}:
      </Text>
      <Text
        fontFamily={label === "ID" ? "mono" : undefined}
        aria-labelledby={`${label}-${value}`}
      >
        {value as string}
      </Text>
    </Flex>
  );

type ProductDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  row?: DataTableRowItem;
  onSave?: (updatedRow: DataTableRowItem) => void;
};

const ProductDetailsModal = ({
  isOpen,
  onClose,
  row,
  onSave,
}: ProductDetailsModalProps) => {
  const [formData, setFormData] = useState<DataTableRowItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (row) {
      setFormData({ ...row });
    }
  }, [row]);

  if (!row || !formData) return null;

  const handleInputChange = (
    field: string,
    value: string | string[] | boolean
  ) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (formData && onSave) {
      setIsSaving(true);
      onSave(formData);
      // Brief delay to show saving state
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsSaving(false);
      // Don't call onClose here - let the parent handle it
    }
  };

  return (
    <Dialog.Root isOpen={isOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{formData.name as string}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Stack gap="400">
            {/* Product Information */}
            <Box>
              <Text as="h2" fontWeight="500" mb="200">
                Product Information
              </Text>
              <Stack gap="300">
                <Box>
                  <Text as="label" fontSize="sm" fontWeight="500" mb="100">
                    Product name
                  </Text>
                  <TextInput
                    value={formData.name as string}
                    onChange={(value) => handleInputChange("name", value)}
                    width="100%"
                  />
                </Box>

                <Box>
                  <Text as="label" fontSize="sm" fontWeight="500" mb="100">
                    Category
                  </Text>
                  <TextInput
                    value={formData.category as string}
                    onChange={(value) => handleInputChange("category", value)}
                    width="100%"
                  />
                </Box>

                <Box>
                  <Text as="label" fontSize="sm" fontWeight="500" mb="100">
                    Status
                  </Text>
                  <select
                    value={
                      formData.published && formData.hasStagedChanges
                        ? "Modified"
                        : formData.published
                          ? "Published"
                          : "Unpublished"
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "Published") {
                        handleInputChange("published", true);
                        handleInputChange("hasStagedChanges", false);
                      } else if (value === "Modified") {
                        handleInputChange("published", true);
                        handleInputChange("hasStagedChanges", true);
                      } else if (value === "Unpublished") {
                        handleInputChange("published", false);
                        handleInputChange("hasStagedChanges", false);
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  >
                    <option value="Published">Published</option>
                    <option value="Modified">Modified</option>
                    <option value="Unpublished">Unpublished</option>
                  </select>
                </Box>

                <Box>
                  <Text as="label" fontSize="sm" fontWeight="500" mb="100">
                    Stores
                  </Text>
                  <TextInput
                    value={(formData.stores as string[]).toString() || ""}
                    onChange={(value) => {
                      handleInputChange("stores", value.split(","));
                    }}
                    width="100%"
                    placeholder="Enter stores separated by commas"
                    aria-label="stores"
                  />
                </Box>
              </Stack>
            </Box>

            <Box>
              <Text as="h2" fontWeight="500" mb="200">
                Technical Details
              </Text>
              <Stack gap="300">
                <Box>
                  <Text as="label" fontSize="sm" fontWeight="500" mb="100">
                    Product ID
                  </Text>
                  <TextInput
                    value={formData.key as string}
                    isReadOnly
                    width="100%"
                    backgroundColor="neutral.2"
                    isDisabled
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            onPress={() => {
              console.log("Cancel button clicked");
              onClose();
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onPress={handleSave}
            colorPalette="primary"
            isDisabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

// Wrapper component that automatically handles modals for onRowClick
const DataTableWithModals = ({
  onRowClick,
  isProductDetailsTable,
  ...props
}: DataTableProps & {
  onRowClick?: (row: DataTableRowItem) => void;
  isProductDetailsTable?: boolean;
}) => {
  const [rowClickModalState, setRowClickModalState] = useState<{
    isOpen: boolean;
    row?: DataTableRowItem;
  }>({
    isOpen: false,
  });

  const [tableData, setTableData] = useState<DataTableRowItem[]>(
    props.data || []
  );
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    if (props.data) {
      setTableData(props.data);
      setDataVersion(0);
    }
  }, [props.data]);

  const handleRowClick = onRowClick
    ? (row: DataTableRowItem) => {
        setRowClickModalState({ isOpen: true, row });
        onRowClick?.(row);
      }
    : undefined;

  const handleSave = (updatedRow: DataTableRowItem) => {
    setTableData((prev) => {
      const newData = [
        ...prev.map((row) =>
          row.id === updatedRow.id ? { ...updatedRow } : { ...row }
        ),
      ];
      return newData;
    });

    setDataVersion((prev) => prev + 1);
    setRowClickModalState({ isOpen: false, row: undefined });
  };

  return (
    <>
      <DataTable
        {...props}
        data={tableData}
        onRowClick={handleRowClick}
        key={`table-v${dataVersion}`} // Force re-render when data changes
      />

      {/* Details Modal */}
      {onRowClick &&
        (isProductDetailsTable ? (
          <ProductDetailsModal
            isOpen={rowClickModalState.isOpen}
            onClose={() =>
              setRowClickModalState({ isOpen: false, row: undefined })
            }
            row={rowClickModalState?.row}
            onSave={handleSave}
          />
        ) : (
          <InfoModal
            isOpen={rowClickModalState.isOpen}
            onClose={() =>
              setRowClickModalState({ isOpen: false, row: undefined })
            }
            title={
              rowClickModalState.row?.name
                ? `${rowClickModalState?.row?.name}'s Details`
                : `Details for row ${rowClickModalState?.row?.id}`
            }
          >
            {rowClickModalState?.row && (
              <Stack as="ul" listStyle="none" gap="200">
                {Object.entries(rowClickModalState.row!)
                  .filter(([k]) => !["id", "children"].includes(k))
                  .map(([k, v]) => (
                    <DetailsModalItem
                      key={k}
                      label={k}
                      value={v as ReactNode}
                    />
                  ))}
              </Stack>
            )}
          </InfoModal>
        ))}
    </>
  );
};

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<object> = {
  title: "components/DataTable",
  component: DataTable,
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
  render: (args) => (
    <DataTableWithModals
      {...args}
      isProductDetailsTable
      onRowClick={() => {}}
    />
  ),
  args: {
    columns: mcColumns,
    data: mcMockData,
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
          onRowClick={() => {
            console.log("row clicked");
          }}
          data-testid="column-manager-table"
        />
      </>
    );
  },
  args: { columns, data },
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
      await userEvent.click(ageCheckbox);

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
      await userEvent.click(roleCheckbox);

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
      await userEvent.click(ageCheckbox);

      await waitFor(() => {
        expect(ageCheckbox).toHaveAttribute("data-selected");
      });

      // Show custom column
      await userEvent.click(customCheckbox);

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

      await userEvent.click(ageCheckbox);
      await userEvent.click(roleCheckbox);
      await userEvent.click(customCheckbox);

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

      await userEvent.click(ageCheckbox);
      await userEvent.click(roleCheckbox);
      await userEvent.click(customCheckbox);

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

export const CustomColumn: Story = {
  render: (args) => <DataTableWithModals {...args} onRowClick={() => {}} />,
  args: { columns, data },
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
        />
        <DataTableWithModals {...args} search={search} onRowClick={() => {}} />
      </Stack>
    );
  },
  args: { columns, data },
};

export const AdjustableColumns: Story = {
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
          onRowClick={() => {}}
        />
      </Stack>
    );
  },
  args: {
    columns,
    data,
  },
};

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
  args: { columns, data },
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
    data: [...data],
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
      expect(table).toHaveAttribute("aria-label", "Data Table");

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
          onRowClick={isRowClickable ? () => {} : undefined} // Just need to pass a function to enable the modal
          data-testid="clickable-rows-table"
        />
      </Stack>
    );
  },
  args: { columns, data },
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

export const WithSorting: Story = {
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
        <DataTableWithModals {...args} onRowClick={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    data,
    allowsSorting: true,
    ["aria-label"]: "Sorting Example",
  },
};

export const ControlledSorting: Story = {
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
          onRowClick={() => {}}
        />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    data,
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
        <DataTableWithModals {...args} search={search} onRowClick={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    data,
    allowsSorting: true,
  },
};

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
          data={data}
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
      await userEvent.click(button!);
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
      expect(table).toHaveAttribute("aria-label", "Data Table");

      const checkboxes = canvas.getAllByRole("rowgroup")[1];
      const dataRows = within(checkboxes).getAllByRole("row");
      const dataCheckboxes = dataRows.map((row) =>
        within(row).getByRole("checkbox")
      );

      // const checkboxes = canvas.getAllByRole("checkbox");
      dataCheckboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute("aria-label");
      });
    });
  },
};

export const TextTruncation: Story = {
  render: (args) => {
    const [isTruncated, setIsTruncated] = useState(false);

    return (
      <Stack gap="500" alignItems="flex-start">
        <Checkbox isSelected={isTruncated} onChange={setIsTruncated}>
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
            onRowClick={() => {}}
          />
        </Box>
      </Stack>
    );
  },
  args: {
    columns: truncationColumns,
    data: longTextData,
    allowsSorting: true,
  },
};

export const MultilineHeaders: Story = {
  render: (args) => <DataTableWithModals {...args} />,
  args: {
    columns: multilineHeadersColumns,
    data: multilineHeadersData,
    allowsSorting: true,
    isResizable: true,
    onRowClick: () => {},
  },
};

export const WithFooter: Story = {
  render: () => {
    const footerContent = (
      <Stack
        direction="row"
        justify="space-between"
        align="center"
        gap="400"
        mt="400"
      >
        <Text fontWeight="bold">Total: {data.length} items</Text>
        <Stack direction="row" gap="300" align="center">
          <Button size="xs" variant="outline">
            Previous
          </Button>
          <Text px="300">Page 1 of 1</Text>
          <Button size="xs" variant="outline">
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
          data={data}
          allowsSorting={true}
          selectionMode="multiple"
          footer={footerContent}
          onRowClick={() => {}}
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
          data={wideData}
          isResizable={true}
          allowsSorting={true}
          maxHeight="400px"
          defaultSelectedKeys={new Set(["1", "3"])}
          onRowClick={() => {}}
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

export const FlexibleNestedChildren: Story = {
  render: (args) => {
    return (
      <Stack gap="400">
        <Stack gap="300">
          <Heading size="md">Flexible Nested Children</Heading>
          <Text>
            Demonstrates the new flexible children system where nested content
            can be either:
          </Text>
          <Box as="ul" ml="500" lineHeight="1.6">
            <Box as="li">
              <Text as="span" fontWeight="bold">
                Table rows
              </Text>{" "}
              - Traditional nested table structure (Alice's projects)
            </Box>
            <Box as="li">
              <Text as="span" fontWeight="bold">
                React components
              </Text>{" "}
              - Rich interactive content like profile cards, forms, charts
            </Box>
            <Box as="li">
              <Text as="span" fontWeight="bold">
                Simple content
              </Text>{" "}
              - Text, alerts, or any other React elements
            </Box>
          </Box>
          <Text>
            Click the expand buttons to see different types of nested content.
          </Text>
        </Stack>
        <DataTableWithModals {...args} onRowClick={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: [
      {
        id: "name",
        header: "Name",
        accessor: (row) => row.name as React.ReactNode,
      },
      {
        id: "age",
        header: "Age",
        accessor: (row) => row.age as React.ReactNode,
      },
      {
        id: "role",
        header: "Role",
        accessor: (row) => row.role as React.ReactNode,
      },
      {
        id: "class",
        header: "Level",
        accessor: (row) => row.class as React.ReactNode,
      },
    ],
    data: flexibleNestedData,
    allowsSorting: true,
    isResizable: true,
    maxHeight: "400px",
    nestedKey: "children",
  },
};

export const NoNestedContent: Story = {
  render: (args) => {
    return (
      <Stack gap="400">
        <Stack gap="300">
          <Heading size="md">No Nested Content (Default Behavior)</Heading>
          <Text>
            When no <Text as="code">nestedKey</Text> is provided, the component
            ignores any nested properties and only renders parent rows. This is
            the new default behavior.
          </Text>
          <Box
            p="300"
            bg="warning.2"
            border="1px solid"
            borderColor="warning.6"
            borderRadius="150"
            fontSize="350"
          >
            <Text>
              <Text as="strong">Note:</Text> The data below contains "children"
              properties, but they won't be rendered without explicitly setting{" "}
              <Text as="code">nestedKey="children"</Text>.
            </Text>
          </Box>
        </Stack>
        <DataTableWithModals {...args} onRowClick={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: [
      {
        id: "name",
        header: "Name",
        accessor: (row) => row.name as React.ReactNode,
      },
      {
        id: "type",
        header: "Type",
        accessor: (row) => row.type as React.ReactNode,
      },
      {
        id: "status",
        header: "Status",
        accessor: (row) => row.status as React.ReactNode,
      },
    ],
    data: [
      {
        id: "parent-1",
        name: "Parent Item 1",
        type: "Parent",
        status: "Active",
        // This children property will be ignored without nestedKey
        children: [
          {
            id: "child-1",
            name: "Child Item 1",
            type: "Child",
            status: "Hidden",
          },
          {
            id: "child-2",
            name: "Child Item 2",
            type: "Child",
            status: "Hidden",
          },
        ],
      },
      {
        id: "parent-2",
        name: "Parent Item 2",
        type: "Parent",
        status: "Active",
        // This children property will also be ignored
        children: (
          <div>This React content won't be shown without nestedKey</div>
        ),
      },
      {
        id: "parent-3",
        name: "Parent Item 3",
        type: "Parent",
        status: "Active",
        // No children property at all
      },
    ],
    allowsSorting: true,
    isResizable: true,
    // Notice: no nestedKey prop, so no nested content will be rendered
  },
};

export const NestedTable: Story = {
  render: (args) => {
    return (
      <Stack gap="400">
        <Stack gap="300">
          <Heading size="md">Tables Within Tables</Heading>
          <Text>
            This example demonstrates nested DataTable components where each
            parent row can expand to show a complete DataTable with its own
            data, columns, and functionality.
          </Text>
          <Box
            p="300"
            bg="info.2"
            border="1px solid"
            borderColor="info.6"
            borderRadius="150"
            fontSize="350"
          >
            <Text>
              <Text as="strong">Usage:</Text> Nest DataTable components as React
              content using custom nestedKey
            </Text>
          </Box>
        </Stack>
        <DataTableWithModals {...args} onRowClick={() => {}} />
      </Stack>
    );
  },
  args: {
    columns: [
      {
        id: "name",
        header: "Galaxy/Object",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "type",
        header: "Type",
        accessor: (row: Record<string, unknown>) => row.type as React.ReactNode,
      },
      {
        id: "distance",
        header: "Distance",
        accessor: (row: Record<string, unknown>) =>
          row.distance as React.ReactNode,
      },
    ],
    data: modifiedFetchedData,
    nestedKey: "sky", // Custom nested key
    allowsSorting: true,
    isResizable: true,
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
            data={item.children as DataTableRowItem[]}
            allowsSorting={true}
            isResizable={true}
            onRowClick={() => {}}
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
            data={modifiedComprehensiveData}
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
            onRowClick={isRowClickable ? () => {} : undefined}
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

export const DisabledRowsShowcase: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["2"]));
    const [disabledKeys, setDisabledKeys] = useState<Selection>(
      new Set(["3", "5", "7"])
    );
    const [rowActionLog, setRowActionLog] = useState<string[]>([]);

    const handleRowAction = (
      row: DataTableRowItem,
      action: "click" | "select"
    ) => {
      const message = `${action.toUpperCase()} attempted on disabled row: ${row.name} (ID: ${row.id})`;
      setRowActionLog((prev) => [message, ...prev.slice(0, 4)]); // Keep last 5 messages
    };

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
            selected or clicked, and show visual feedback when interactions are
            attempted.
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
            {data.map((row) => (
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

        {/* Action Log */}
        {rowActionLog.length > 0 && (
          <Box
            p="300"
            bg="warning.2"
            border="1px solid"
            borderColor="warning.4"
            borderRadius="150"
          >
            <Heading as="h5" size="md" marginBottom="200" color="warning.11">
              🚫 Disabled Row Interactions Log
            </Heading>
            {rowActionLog.map((message, index) => (
              <Text key={index} fontSize="300" color="warning.11" marginY="50">
                {message}
              </Text>
            ))}
          </Box>
        )}

        {/* DataTable */}
        <DataTableWithModals
          columns={sortableColumns}
          data={data}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          disabledKeys={disabledKeys}
          onRowAction={handleRowAction}
          selectionMode="multiple"
          allowsSorting={true}
          onRowClick={() => {}}
        />
      </Stack>
    );
  },
  args: {},
};

export const RowPinning: Story = {
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
          data={data}
          pinnedRows={pinnedRows}
          onPinToggle={handlePinToggle}
          allowsSorting={true}
          selectionMode="multiple"
          onRowClick={() => {}}
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
          data={data.slice(0, 5)} // Use smaller dataset for edge case testing
          pinnedRows={pinnedRows}
          onPinToggle={handlePinToggle}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          allowsSorting={true}
          selectionMode="multiple"
          onRowClick={() => {}}
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
