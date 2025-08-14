import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, isValidElement, type ReactNode } from "react";
import { type Selection, useLocale } from "react-aria-components";
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
    open={isOpen}
    onOpenChange={({ open }) => !open && onClose && onClose()}
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
};

const ProductDetailsModal = ({
  isOpen,
  onClose,
  row,
}: ProductDetailsModalProps) => {
  if (!row) return null;
  const { locale } = useLocale();
  console.log(locale);
  // Extract product data from commercetools structure
  const productName = row.name || "Unknown Product";
  const productSlug = row.slug || "";
  const productType = row.productType || "";
  const createdAt = row.createdAt || "";
  const lastModifiedAt = row.lastModifiedAt || "";

  const version = row.version || "";
  // put ct data into array to reduce repetition of components in render
  const detailItems: DetailsModalItemProps[] = [
    { label: "Name", value: productName as string },
    { label: "Slug", value: productSlug as string },
    { label: "Type", value: productType as string },
    { label: "Version", value: version as string },
    { label: "Created", value: createdAt as string },
    { label: "Modified", value: lastModifiedAt as string },
  ];
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => !open && onClose && onClose()}
    >
      <Dialog.Content maxWidth="600px">
        <Dialog.Header>
          <Dialog.Title>{productName as string} - Product Details</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Stack gap="400">
            {/* Product Information */}
            <Box>
              <Text as="h2" fontWeight="500" mb="200">
                Product Information
              </Text>
              <Stack as="ul" listStyle="none" gap="200">
                {detailItems.map((item) => (
                  <DetailsModalItem key={item.label} {...item} />
                ))}
              </Stack>
            </Box>

            {/* Product ID */}
            <Box>
              <Text as="h2" fontWeight="500" mb="200">
                Technical Details
              </Text>
              <Stack as="ul" listStyle="none" gap="200">
                <DetailsModalItem label={"ID"} value={row.id as string} />
              </Stack>
            </Box>
          </Stack>
        </Dialog.Body>
        <Dialog.Footer>
          <Button onPress={onClose} variant="outline">
            Close
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

// Wrapper component that automatically handles modals for onDetailsClick and onRowClick
const DataTableWithModals = ({
  onDetailsClick,
  onRowClick,
  isProductDetailsTable,
  ...props
}: DataTableProps & {
  onDetailsClick?: (row: DataTableRowItem) => void;
  onRowClick?: (row: DataTableRowItem) => void;
  isProductDetailsTable?: boolean;
}) => {
  const [detailsModalState, setDetailsModalState] = useState<{
    isOpen: boolean;
    row?: DataTableRowItem;
  }>({
    isOpen: false,
  });

  const [rowClickModalState, setRowClickModalState] = useState<{
    isOpen: boolean;
    row?: DataTableRowItem;
  }>({
    isOpen: false,
  });

  const handleDetailsClick = onDetailsClick
    ? (row: DataTableRowItem) => {
        setDetailsModalState({ isOpen: true, row });
        onDetailsClick?.(row);
      }
    : undefined;

  const handleRowClick = onRowClick
    ? (row: DataTableRowItem) => {
        setRowClickModalState({ isOpen: true, row });
        onRowClick?.(row);
      }
    : undefined;

  return (
    <>
      <DataTable
        {...props}
        onDetailsClick={handleDetailsClick}
        onRowClick={handleRowClick}
      />

      {/* Details Modal */}
      {onDetailsClick &&
        (isProductDetailsTable ? (
          <ProductDetailsModal
            isOpen={detailsModalState.isOpen}
            onClose={() =>
              setDetailsModalState({ isOpen: false, row: undefined })
            }
            row={detailsModalState?.row}
          />
        ) : (
          <InfoModal
            isOpen={detailsModalState.isOpen}
            onClose={() =>
              setDetailsModalState({ isOpen: false, row: undefined })
            }
            title={`${detailsModalState?.row?.name}'s Details`}
          >
            {detailsModalState?.row && (
              <Stack as="ul" listStyle="none" gap="200">
                {Object.entries(detailsModalState.row!)
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

      {/* Row Click Modal */}
      {onRowClick && (
        <InfoModal
          isOpen={rowClickModalState.isOpen}
          onClose={() =>
            setRowClickModalState({ isOpen: false, row: undefined })
          }
          title={`🎉 You Clicked ${rowClickModalState?.row?.name}'s Row 🎉`}
        >
          <div>Row clicked successfully!</div>
        </InfoModal>
      )}
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
      onDetailsClick={() => {}}
    />
  ),
  args: {
    columns: mcColumns,
    data: mcMockData,
    allowsSorting: true,
    isResizable: true,
    isRowClickable: true,
    density: "condensed",
    selectionMode: "multiple",
  },
};

/**
 * Details Button Story
 * Demonstrates the details button functionality that's always present in the second column
 */
export const WithDetailsButton: Story = {
  render: (args) => (
    <DataTableWithModals
      {...args}
      onDetailsClick={() => {}} // Just need to pass a function to enable the modal
    />
  ),
  args: {
    columns,
    data,
    allowsSorting: true,
    isResizable: true,
  },
};

export const ColumnManager: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(["name", "age"]);
    const allColumns = args.columns.map((col) => col.id);
    const handleCheckboxChange = (colId: string) => {
      setVisible((prev) =>
        prev.includes(colId)
          ? prev.filter((id) => id !== colId)
          : [...prev, colId]
      );
    };
    return (
      <>
        <Stack direction="row" gap="400" mb="300" wrap="wrap">
          {allColumns.map((colId) => (
            <Checkbox
              key={colId}
              isSelected={visible.includes(colId)}
              onChange={() => handleCheckboxChange(colId)}
            >
              {colId}
            </Checkbox>
          ))}
        </Stack>
        <DataTableWithModals
          {...args}
          visibleColumns={visible}
          onDetailsClick={() => {}}
        />
      </>
    );
  },
  args: { columns, data },
};

export const CustomColumn: Story = {
  render: (args) => <DataTableWithModals {...args} onDetailsClick={() => {}} />,
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
        <DataTableWithModals
          {...args}
          search={search}
          onDetailsClick={() => {}}
        />
      </Stack>
    );
  },
  args: { columns, data },
};

export const AdjustableColumns: Story = {
  render: (args) => {
    const [isResizable, setisResizable] = useState(false);
    return (
      <Stack gap="400" alignItems="flex-start">
        <Checkbox isSelected={isResizable} onChange={setisResizable}>
          Resizable Column
        </Checkbox>
        <DataTableWithModals
          {...args}
          isResizable={isResizable}
          onDetailsClick={() => {}}
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
        <Checkbox isSelected={condensed} onChange={setCondensed}>
          Condensed
        </Checkbox>
        <DataTableWithModals
          {...args}
          density={condensed ? "condensed" : "default"}
          onDetailsClick={() => {}}
        />
      </Stack>
    );
  },
  args: { columns, data },
};

export const StickyHeader: Story = {
  render: (args) => {
    const [sticky, setSticky] = useState(false);
    return (
      <Stack gap="500" alignItems="flex-start">
        {/* This is supposed to set the sticky header from the top to the bottom of the table. */}
        <Checkbox isSelected={sticky} onChange={setSticky}>
          Sticky header (with max height)
        </Checkbox>
        <DataTableWithModals
          {...args}
          maxHeight={sticky ? "400px" : undefined}
          onDetailsClick={() => {}}
        />
      </Stack>
    );
  },
  args: {
    columns,
    data: [...data],
  },
};

export const ClickableRows: Story = {
  render: (args) => (
    <DataTableWithModals
      {...args}
      isRowClickable
      onRowClick={() => {}} // Just need to pass a function to enable the modal
      onDetailsClick={() => {}}
    />
  ),
  args: { columns, data },
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
        <DataTableWithModals {...args} onDetailsClick={() => {}} />
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
          onDetailsClick={() => {}}
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
        <DataTableWithModals
          {...args}
          search={search}
          onDetailsClick={() => {}}
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

export const SelectionShowcase: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    const [search, setSearch] = useState("");
    const [selectionMode, setSelectionMode] = useState<
      "none" | "single" | "multiple"
    >("multiple");
    const [disallowEmptySelection, setDisallowEmptySelection] = useState(false);
    const [isRowClickable, setIsRowClickable] = useState(false);

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

              {selectionMode !== "none" && (
                <Stack gap="100" direction="row">
                  <Checkbox
                    isSelected={disallowEmptySelection}
                    onChange={setDisallowEmptySelection}
                  >
                    Require Selection
                  </Checkbox>
                  <Checkbox
                    isSelected={isRowClickable}
                    onChange={setIsRowClickable}
                  >
                    Clickable Rows
                  </Checkbox>
                </Stack>
              )}
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
        <DataTable
          columns={sortableColumns}
          data={data}
          search={search}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          selectionMode={selectionMode}
          disallowEmptySelection={disallowEmptySelection}
          allowsSorting={true}
          isRowClickable={isRowClickable}
          onRowClick={
            isRowClickable
              ? (row) => {
                  if (selectionMode === "single") {
                    setSelectedKeys(new Set([row.id]));
                  } else if (selectionMode === "multiple") {
                    const newSelection = new Set(selectedKeys);
                    if (newSelection.has(row.id)) {
                      if (!disallowEmptySelection || newSelection.size > 1) {
                        newSelection.delete(row.id);
                      }
                    } else {
                      newSelection.add(row.id);
                    }
                    setSelectedKeys(newSelection);
                  }
                }
              : undefined
          }
          onDetailsClick={() => {}}
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
            onDetailsClick={() => {}}
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

export const SingleRowSelection: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    return (
      <Stack gap={16}>
        <div>
          <h3>Single Row Selection</h3>
          <p>
            Select one row at a time. Click on checkboxes or rows to select.
          </p>
          <p>
            <strong>Selected:</strong>{" "}
            {Array.from(selectedKeys).join(", ") || "None"}
          </p>
        </div>
        <DataTable
          {...args}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    data,
    selectionMode: "single",
    allowsSorting: true,
  },
};

export const MultipleRowSelection: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    return (
      <Stack gap={16}>
        <div>
          <h3>Multiple Row Selection</h3>
          <p>
            Select multiple rows using checkboxes. Use the header checkbox to
            select/deselect all.
          </p>
          <p>
            <strong>Selected count:</strong> {Array.from(selectedKeys).length}
          </p>
          <p>
            <strong>Selected IDs:</strong>{" "}
            {Array.from(selectedKeys).join(", ") || "None"}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <button
            onClick={() => setSelectedKeys(new Set())}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            Clear Selection
          </button>
          <button
            onClick={() => setSelectedKeys(new Set(["1", "3", "5"]))}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            Select Odd Rows
          </button>
          <button
            onClick={() => setSelectedKeys("all")}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            Select All
          </button>
        </div>
        <DataTable
          {...args}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    data,
    selectionMode: "multiple",
    allowsSorting: true,
  },
};

export const SelectionWithSortingAndSearch: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    const [search, setSearch] = useState("");
    const [selectionMode, setSelectionMode] = useState<
      "none" | "single" | "multiple"
    >("multiple");
    const [disallowEmptySelection, setDisallowEmptySelection] = useState(false);
    const [isRowClickable, setIsRowClickable] = useState(false);

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
      <Stack gap={20}>
        <div>
          <h3>Row Selection Showcase</h3>
          <p>
            Comprehensive demonstration of all row selection capabilities. Use
            the controls below to test different selection modes, behaviors, and
            interactions.
          </p>
        </div>

        {/* Controls Section */}
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          {/* Search */}
          <div style={{ marginBottom: "16px" }}>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              🔍 Search & Filter
            </h3>
            <TextInput
              value={search}
              onChange={setSearch}
              placeholder="Search to filter rows..."
              width="300px"
            />
          </div>

          {/* Selection Settings */}
          <div style={{ marginBottom: "16px" }}>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              ✅ Selection Mode
            </h4>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "8px",
              }}
            >
              <label
                htmlFor="selection-mode-select"
                style={{ fontSize: "14px" }}
              >
                Mode:
              </label>
              <select
                id="selection-mode-select"
                value={selectionMode}
                onChange={(e) =>
                  handleSelectionModeChange(
                    e.target.value as "none" | "single" | "multiple"
                  )
                }
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value="none">None (No Selection)</option>
                <option value="single">Single Row</option>
                <option value="multiple">Multiple Rows</option>
              </select>

              {selectionMode !== "none" && (
                <>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={disallowEmptySelection}
                      onChange={(e) =>
                        setDisallowEmptySelection(e.target.checked)
                      }
                      style={{ marginRight: "6px" }}
                    />
                    Require Selection
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isRowClickable}
                      onChange={(e) => setIsRowClickable(e.target.checked)}
                      style={{ marginRight: "6px" }}
                    />
                    Clickable Rows
                  </label>
                </>
              )}
            </div>

            {selectionMode !== "none" && (
              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "12px",
                }}
              >
                <strong>Selected:</strong> {selectedCount} row(s) |
                <strong> IDs:</strong>{" "}
                {Array.from(selectedKeys).join(", ") || "None"}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {selectionMode !== "none" && (
            <div>
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                🎯 Quick Actions
              </h4>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setSelectedKeys(new Set())}
                  disabled={disallowEmptySelection && selectedCount <= 1}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    cursor:
                      disallowEmptySelection && selectedCount <= 1
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      disallowEmptySelection && selectedCount <= 1 ? 0.5 : 1,
                  }}
                >
                  Clear Selection
                </button>

                {selectionMode === "multiple" && (
                  <>
                    <button
                      onClick={() => setSelectedKeys(new Set(["1", "3", "5"]))}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Select Odd Rows
                    </button>
                    <button
                      onClick={() => setSelectedKeys(new Set(["2", "4", "6"]))}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Select Even Rows
                    </button>
                    <button
                      onClick={() => setSelectedKeys("all")}
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      Select All
                    </button>
                  </>
                )}

                {selectionMode === "single" && (
                  <button
                    onClick={() => setSelectedKeys(new Set(["1"]))}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Select First Row
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Feature Explanation */}
        <div
          style={{
            padding: "12px",
            backgroundColor: "#eff6ff",
            border: "1px solid #93c5fd",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          <strong>Features Demonstrated:</strong>
          <ul style={{ margin: "8px 0 0 20px", lineHeight: "1.5" }}>
            <li>
              <strong>None Mode:</strong> No selection checkboxes or
              functionality
            </li>
            <li>
              <strong>Single Mode:</strong> Radio-button behavior, one row at a
              time
            </li>
            <li>
              <strong>Multiple Mode:</strong> Checkboxes with select all/none in
              header
            </li>
            <li>
              <strong>Search Integration:</strong> Selection works with filtered
              results
            </li>
            <li>
              <strong>Required Selection:</strong> Prevent deselecting when
              enabled
            </li>
            <li>
              <strong>Row Clicking:</strong> Click entire row to select
              (optional)
            </li>
            <li>
              <strong>Programmatic Control:</strong> Buttons to demonstrate
              selection API
            </li>
          </ul>
        </div>

        <DataTable
          columns={sortableColumns}
          data={data}
          search={search}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          selectionMode={selectionMode}
          disallowEmptySelection={disallowEmptySelection}
          allowsSorting={true}
          isRowClickable={isRowClickable}
          onRowClick={
            isRowClickable
              ? (row) => {
                  if (selectionMode === "single") {
                    setSelectedKeys(new Set([row.id]));
                  } else if (selectionMode === "multiple") {
                    const newSelection = new Set(selectedKeys);
                    if (newSelection.has(row.id)) {
                      if (!disallowEmptySelection || newSelection.size > 1) {
                        newSelection.delete(row.id);
                      }
                    } else {
                      newSelection.add(row.id);
                    }
                    setSelectedKeys(newSelection);
                  }
                }
              : undefined
          }
        />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    data,
    selectionMode: "multiple",
    allowsSorting: true,
  },
};

export const DisallowEmptySelection: Story = {
  render: (args) => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["1"]));

    return (
      <Stack gap={16}>
        <div>
          <h3>Disallow Empty Selection</h3>
          <p>
            At least one row must always be selected. Try to deselect all rows.
          </p>
          <p>
            <strong>Selected:</strong> {Array.from(selectedKeys).join(", ")}
          </p>
        </div>
        <DataTable
          {...args}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    data,
    selectionMode: "multiple",
    disallowEmptySelection: true,
    allowsSorting: true,
  },
};

export const MultilineHeaders: Story = {
  args: {
    columns: multilineHeadersColumns,
    data: multilineHeadersData,
    allowsSorting: true,
    isResizable: true,
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
          onDetailsClick={() => {}}
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
          onDetailsClick={() => {}}
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
        <DataTableWithModals {...args} onDetailsClick={() => {}} />
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
        <DataTableWithModals {...args} onDetailsClick={() => {}} />
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
        <DataTableWithModals {...args} onDetailsClick={() => {}} />
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
    const [isResizable, setisResizable] = useState(true);
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
            onDetailsClick={() => {}}
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
              placeholder="Fliter table..."
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
              <Checkbox isSelected={isResizable} onChange={setisResizable}>
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
              <Text fontSize="350" color="neutral.12">
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
          overflowY={stickyHeader ? "auto" : "visible"}
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
            isRowClickable={true}
            maxHeight={stickyHeader ? "400px" : undefined}
            isTruncated={isTruncated}
            density={density}
            nestedKey="children"
            onRowClick={() => {
              console.log("row clicked");
            }}
            onDetailsClick={() => {
              console.log("details clicked");
            }}
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
          isRowClickable={true}
          onRowClick={() => {}}
        />
      </Stack>
    );
  },
  args: {},
};
