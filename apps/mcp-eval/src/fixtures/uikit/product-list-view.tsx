/**
 * Realistic Merchant Center "Product List" view built entirely with UI Kit.
 *
 * This fixture exercises the trickiest migration patterns all in one file,
 * the way a real MC page would combine them:
 *
 * - PrimaryButton / SecondaryButton / FlatButton / IconButton (propMigrations, label→children)
 * - SearchTextInput / SelectInput / DateRangeInput (callbackAdapters, event shape changes)
 * - DataTable with DataTableManager (propShapeTransforms, callbackAdapters, codeReduction)
 * - Spacings.Stack / Spacings.Inline / Constraints.Horizontal (layoutGuidance)
 * - CollapsiblePanel (compound mapping → Accordion)
 * - Stamp / Tag / Avatar (style-props-enabled Nimbus targets)
 * - Pagination
 * - FieldErrors / LoadingSpinner
 * - Icon imports (iconWrapper)
 * - Text / Label
 * - CheckboxInput / ToggleInput
 */

import React, { useState, useCallback } from "react";
import {
  PrimaryButton,
  SecondaryButton,
  FlatButton,
  IconButton,
  SearchTextInput,
  SelectInput,
  DateRangeInput,
  CheckboxInput,
  ToggleInput,
  DataTable,
  DataTableManager,
  CollapsiblePanel,
  Pagination,
  Stamp,
  Tag,
  Avatar,
  Text,
  Label,
  FieldErrors,
  LoadingSpinner,
  Spacings,
  Constraints,
  PlusBoldIcon,
  FilterIcon,
  ExportIcon,
  SearchIcon,
  BinLinearIcon,
  EditIcon,
  SortingIcon,
  RefreshIcon,
} from "@commercetools-frontend/ui-kit";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Product {
  id: string;
  name: string;
  sku: string;
  status: "published" | "draft" | "modified";
  price: string;
  lastModified: string;
  createdBy: string;
  categories: string[];
}

interface SortState {
  key: string;
  order: "asc" | "desc";
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium T-Shirt",
    sku: "TSH-001",
    status: "published",
    price: "€29.99",
    lastModified: "2025-01-15",
    createdBy: "Jane Doe",
    categories: ["Apparel", "T-Shirts"],
  },
  {
    id: "2",
    name: "Running Shoes",
    sku: "SHO-042",
    status: "modified",
    price: "€89.99",
    lastModified: "2025-02-20",
    createdBy: "John Smith",
    categories: ["Footwear"],
  },
  {
    id: "3",
    name: "Leather Wallet",
    sku: "WAL-007",
    status: "draft",
    price: "€49.99",
    lastModified: "2025-03-01",
    createdBy: "Jane Doe",
    categories: ["Accessories"],
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "modified", label: "Modified" },
];

const STAMP_TONES: Record<string, "primary" | "positive" | "warning"> = {
  published: "positive",
  draft: "warning",
  modified: "primary",
};

// ---------------------------------------------------------------------------
// Custom selection column (exercising codeReduction — these become unnecessary)
// ---------------------------------------------------------------------------

function SelectionColumnCell({
  isSelected,
  onToggle,
}: {
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <CheckboxInput
      value="selected"
      isChecked={isSelected}
      onChange={onToggle}
    />
  );
}

function SelectionColumnLabel({
  isAllSelected,
  onToggleAll,
}: {
  isAllSelected: boolean;
  onToggleAll: () => void;
}) {
  return (
    <CheckboxInput
      value="select-all"
      isChecked={isAllSelected}
      onChange={onToggleAll}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductListView() {
  // State
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const [sortState, setSortState] = useState<SortState>({
    key: "name",
    order: "asc",
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const perPage = 20;

  // Handlers — these are the tricky callbackAdapters
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    []
  );

  const handleStatusChange = useCallback(
    (event: { target: { value: string } }) => {
      setStatusFilter(event.target.value);
    },
    []
  );

  const handleDateRangeChange = useCallback(
    (event: { target: { value: [string, string] } }) => {
      setDateRange(event.target.value);
    },
    []
  );

  const handleSortChange = useCallback(
    (columnKey: string, sortDirection: string) => {
      setSortState({ key: columnKey, order: sortDirection as "asc" | "desc" });
    },
    []
  );

  const handleRowSelection = useCallback((_event: unknown, rowId: string) => {
    setSelectedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  }, []);

  // DataTable columns — exercises propShapeTransforms
  const columns = [
    {
      key: "selection",
      label: (
        <SelectionColumnLabel
          isAllSelected={selectedRows.length === PRODUCTS.length}
          onToggleAll={() =>
            setSelectedRows(
              selectedRows.length === PRODUCTS.length
                ? []
                : PRODUCTS.map((p) => p.id)
            )
          }
        />
      ),
      renderItem: (row: Product) => (
        <SelectionColumnCell
          isSelected={selectedRows.includes(row.id)}
          onToggle={() => handleRowSelection(null, row.id)}
        />
      ),
      width: "48px",
    },
    {
      key: "name",
      label: "Product Name",
      isSortable: true,
      renderItem: (row: Product) => (
        <Spacings.Inline alignItems="center" scale="s">
          <Avatar
            firstName={row.createdBy.split(" ")[0]}
            lastName={row.createdBy.split(" ")[1]}
            size="s"
          />
          <Text.Body>{row.name}</Text.Body>
        </Spacings.Inline>
      ),
    },
    {
      key: "sku",
      label: "SKU",
      renderItem: (row: Product) => <Text.Body isItalic>{row.sku}</Text.Body>,
    },
    {
      key: "status",
      label: "Status",
      renderItem: (row: Product) => (
        <Stamp tone={STAMP_TONES[row.status]} label={row.status} />
      ),
    },
    {
      key: "price",
      label: "Price",
      isSortable: true,
    },
    {
      key: "categories",
      label: "Categories",
      renderItem: (row: Product) => (
        <Spacings.Inline scale="xs">
          {row.categories.map((cat) => (
            <Tag key={cat}>{cat}</Tag>
          ))}
        </Spacings.Inline>
      ),
    },
    {
      key: "lastModified",
      label: "Last Modified",
      isSortable: true,
    },
  ];

  const filteredProducts = PRODUCTS.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (
      searchValue &&
      !p.name.toLowerCase().includes(searchValue.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <Constraints.Horizontal max={16}>
      <Spacings.Stack scale="l">
        {/* Page header */}
        <Spacings.Inline
          scale="m"
          alignItems="center"
          justifyContent="space-between"
        >
          <Spacings.Inline scale="s" alignItems="center">
            <Text.Headline as="h1">Products</Text.Headline>
            <Tag>{`${filteredProducts.length} items`}</Tag>
          </Spacings.Inline>

          <Spacings.Inline scale="s">
            <SecondaryButton
              iconLeft={<ExportIcon />}
              label="Export"
              onClick={() => {}}
            />
            <PrimaryButton
              iconLeft={<PlusBoldIcon />}
              label="Add Product"
              onClick={() => {}}
            />
          </Spacings.Inline>
        </Spacings.Inline>

        {/* Search and filter bar */}
        <Spacings.Inline scale="m" alignItems="flex-end">
          <Constraints.Horizontal max={10}>
            <SearchTextInput
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search products..."
            />
          </Constraints.Horizontal>

          <Constraints.Horizontal max={6}>
            <SelectInput
              value={statusFilter}
              onChange={handleStatusChange}
              options={STATUS_OPTIONS}
            />
          </Constraints.Horizontal>

          <IconButton
            icon={<FilterIcon />}
            label="Toggle filters"
            onClick={() => setIsAdvancedOpen((prev) => !prev)}
          />

          <FlatButton
            tone="primary"
            icon={<RefreshIcon />}
            label="Refresh"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}
          />
        </Spacings.Inline>

        {/* Advanced filters — CollapsiblePanel → Accordion */}
        <CollapsiblePanel
          header={
            <Spacings.Inline scale="s" alignItems="center">
              <FilterIcon />
              <Text.Subheadline as="h4">Advanced Filters</Text.Subheadline>
            </Spacings.Inline>
          }
          isClosed={!isAdvancedOpen}
          onToggle={() => setIsAdvancedOpen((prev) => !prev)}
        >
          <Spacings.Stack scale="m">
            <Spacings.Inline scale="l" alignItems="flex-end">
              <Constraints.Horizontal max={8}>
                <Spacings.Stack scale="xs">
                  <Label>Date Range</Label>
                  <DateRangeInput
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    placeholder="Select range..."
                  />
                </Spacings.Stack>
              </Constraints.Horizontal>

              <Spacings.Stack scale="xs">
                <Label>Active only</Label>
                <ToggleInput
                  isChecked={showOnlyActive}
                  onChange={(event) =>
                    setShowOnlyActive(event.target.checked ?? false)
                  }
                />
              </Spacings.Stack>
            </Spacings.Inline>

            {Object.keys(errors).length > 0 && <FieldErrors errors={errors} />}
          </Spacings.Stack>
        </CollapsiblePanel>

        {/* Bulk actions bar (visible when rows selected) */}
        {selectedRows.length > 0 && (
          <Spacings.Inline scale="m" alignItems="center">
            <Text.Body>{selectedRows.length} product(s) selected</Text.Body>
            <SecondaryButton
              iconLeft={<EditIcon />}
              label="Edit selected"
              onClick={() => {}}
            />
            <FlatButton
              tone="critical"
              icon={<BinLinearIcon />}
              label="Delete selected"
              onClick={() => {}}
            />
          </Spacings.Inline>
        )}

        {/* Data table */}
        {isLoading ? (
          <Spacings.Inline justifyContent="center">
            <LoadingSpinner />
          </Spacings.Inline>
        ) : (
          <DataTableManager columns={columns}>
            <DataTable
              rows={filteredProducts}
              columns={columns}
              maxHeight={600}
              wrapHeaderLabels
              onSortChange={handleSortChange}
              sortedBy={sortState.key}
              sortDirection={sortState.order}
              onRowClick={(_event, rowIndex) => {
                const product = filteredProducts[rowIndex];
                window.location.href = `/products/${product.id}`;
              }}
              itemRenderer={(item, column) => {
                const col = columns.find((c) => c.key === column.key);
                if (col?.renderItem) return col.renderItem(item);
                return item[column.key as keyof Product];
              }}
            />
          </DataTableManager>
        )}

        {/* Pagination */}
        <Spacings.Inline justifyContent="flex-end">
          <Pagination
            page={page}
            onPageChange={(nextPage) => setPage(nextPage)}
            perPage={perPage}
            onPerPageChange={() => {}}
            totalItems={filteredProducts.length}
          />
        </Spacings.Inline>
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
}
