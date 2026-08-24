/**
 * Realistic Merchant Center "Product List" view built entirely with Nimbus.
 *
 * This is the migrated counterpart of `fixtures/uikit/product-list-view.tsx`.
 * It exercises the trickiest migration patterns all in one file, the way a
 * real MC page would combine them:
 *
 * - Button (variant + colorPalette, icon as children) / IconButton
 * - SearchInput / Select / DateRangePicker (callback shape changes)
 * - DataTable with DataTableManager (columns: id/header/accessor, built-in
 *   selectionMode="multiple" — the old selection-column-cell/label helper
 *   components are deleted entirely, per codeReduction)
 * - Stack (direction="row" | "column") replacing Spacings.Inline/Stack
 * - maxW style props replacing Constraints.Horizontal wrappers
 * - Accordion (compound, size="sm") replacing CollapsiblePanel
 * - Badge / TagGroup / Avatar (style-props-enabled Nimbus targets)
 * - Pagination
 * - FieldErrors / LoadingSpinner
 * - Icon wrapping for standalone icons (FilterAlt); raw icon children for
 *   Button/IconButton
 * - Text / Heading
 * - Switch (label passed as children instead of a separate Label + toggle)
 */

import { useState, useCallback } from "react";
import {
  Button,
  IconButton,
  SearchInput,
  Select,
  DateRangePicker,
  type DateRangePickerProps,
  Switch,
  DataTable,
  type DataTableColumnItem,
  Accordion,
  Pagination,
  Badge,
  TagGroup,
  Avatar,
  Text,
  Heading,
  FieldErrors,
  LoadingSpinner,
  Stack,
  Icon,
} from "@commercetools/nimbus";
import {
  Add,
  Download,
  Delete,
  Edit,
  Refresh,
  FilterAlt,
} from "@commercetools/nimbus-icons";

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

type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};

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

const STATUS_COLOR_PALETTES: Record<
  Product["status"],
  "positive" | "warning" | "primary"
> = {
  published: "positive",
  draft: "warning",
  modified: "primary",
};

// ---------------------------------------------------------------------------
// DataTable columns — id/header/accessor shape. The old UIKit selection
// column (SelectionColumnCell/SelectionColumnLabel) is gone entirely: Nimbus
// DataTable renders its own selection column via selectionMode="multiple".
// ---------------------------------------------------------------------------

const columns: DataTableColumnItem<Product>[] = [
  {
    id: "name",
    header: "Product Name",
    isSortable: true,
    accessor: (row) => (
      <Stack direction="row" gap="200" alignItems="center">
        <Avatar
          firstName={row.createdBy.split(" ")[0]}
          lastName={row.createdBy.split(" ")[1]}
          size="2xs"
        />
        <Text>{row.name}</Text>
      </Stack>
    ),
  },
  {
    id: "sku",
    header: "SKU",
    accessor: (row) => <Text fontStyle="italic">{row.sku}</Text>,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => (
      <Badge size="sm" colorPalette={STATUS_COLOR_PALETTES[row.status]}>
        {row.status}
      </Badge>
    ),
  },
  {
    id: "price",
    header: "Price",
    isSortable: true,
    accessor: (row) => row.price,
  },
  {
    id: "categories",
    header: "Categories",
    accessor: (row) => (
      <TagGroup.Root aria-label={`Categories for ${row.name}`} size="sm">
        <TagGroup.TagList>
          {row.categories.map((category) => (
            <TagGroup.Tag key={category}>{category}</TagGroup.Tag>
          ))}
        </TagGroup.TagList>
      </TagGroup.Root>
    ),
  },
  {
    id: "lastModified",
    header: "Last Modified",
    isSortable: true,
    accessor: (row) => row.lastModified,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductListView() {
  // State
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] =
    useState<DateRangePickerProps["value"]>(null);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  // Selection is 'all' | Set<Key> — both branches must be handled explicitly,
  // since missing the 'all' branch silently drops select-all clicks.
  const [selectedKeys, setSelectedKeys] = useState<"all" | Set<string>>(
    new Set()
  );
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filteredProducts = PRODUCTS.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (
      searchValue &&
      !p.name.toLowerCase().includes(searchValue.toLowerCase())
    )
      return false;
    return true;
  });

  const selectedCount =
    selectedKeys === "all" ? filteredProducts.length : selectedKeys.size;

  // Handlers
  const handleStatusChange = useCallback((key: string | number | null) => {
    setStatusFilter((key as string) ?? "all");
  }, []);

  const handleDateRangeChange = useCallback(
    (value: DateRangePickerProps["value"]) => {
      setDateRange(value);
    },
    []
  );

  return (
    <Stack direction="column" gap="600" maxW="3xl">
      {/* Page header */}
      <Stack
        direction="row"
        gap="400"
        alignItems="center"
        justify="space-between"
      >
        <Stack direction="row" gap="200" alignItems="center">
          <Heading as="h1" size="lg">
            Products
          </Heading>
          <TagGroup.Root aria-label="Result count">
            <TagGroup.TagList>
              <TagGroup.Tag>{`${filteredProducts.length} items`}</TagGroup.Tag>
            </TagGroup.TagList>
          </TagGroup.Root>
        </Stack>

        <Stack direction="row" gap="200">
          <Button variant="outline" colorPalette="primary" onPress={() => {}}>
            <Download />
            Export
          </Button>
          <Button variant="solid" colorPalette="primary" onPress={() => {}}>
            <Add />
            Add Product
          </Button>
        </Stack>
      </Stack>

      {/* Search and filter bar */}
      <Stack direction="row" gap="400" alignItems="flex-end">
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Search products..."
          aria-label="Search products"
          flex="1"
        />

        <Select.Root
          selectedKey={statusFilter}
          onSelectionChange={handleStatusChange}
          aria-label="Filter by status"
          maxW="xs"
        >
          <Select.Options>
            {STATUS_OPTIONS.map((option) => (
              <Select.Option key={option.value} id={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.Options>
        </Select.Root>

        <IconButton
          aria-label="Toggle filters"
          onPress={() => setIsAdvancedOpen((prev) => !prev)}
        >
          <FilterAlt />
        </IconButton>

        <Button
          variant="ghost"
          colorPalette="primary"
          onPress={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        >
          <Refresh />
          Refresh
        </Button>
      </Stack>

      {/* Advanced filters — CollapsiblePanel → Accordion */}
      <Accordion.Root
        size="sm"
        expandedKeys={isAdvancedOpen ? ["advanced-filters"] : []}
        onExpandedChange={(keys) => setIsAdvancedOpen(keys.size > 0)}
      >
        <Accordion.Item value="advanced-filters">
          <Accordion.Header>
            <Icon as={FilterAlt} size="2xs" color="neutral.11" />
            <Heading as="h4" size="xs" fontWeight="medium">
              Advanced Filters
            </Heading>
          </Accordion.Header>
          <Accordion.Content>
            <Stack direction="column" gap="400">
              <Stack direction="row" gap="600" alignItems="flex-end">
                <Stack direction="column" gap="100" maxW="sm">
                  <Text as="label" size="sm" fontWeight="medium">
                    Date Range
                  </Text>
                  <DateRangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  />
                </Stack>

                <Switch
                  isSelected={showOnlyActive}
                  onChange={setShowOnlyActive}
                >
                  Active only
                </Switch>
              </Stack>

              {Object.keys(errors).length > 0 && (
                <FieldErrors errors={errors} />
              )}
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      {/* Bulk actions bar (visible when rows selected) */}
      {selectedCount > 0 && (
        <Stack direction="row" gap="400" alignItems="center">
          <Text>{selectedCount} product(s) selected</Text>
          <Button variant="outline" colorPalette="primary" onPress={() => {}}>
            <Edit />
            Edit selected
          </Button>
          <Button variant="ghost" colorPalette="critical" onPress={() => {}}>
            <Delete />
            Delete selected
          </Button>
        </Stack>
      )}

      {/* Data table */}
      {isLoading ? (
        <Stack direction="row" justify="center">
          <LoadingSpinner aria-label="Loading products" />
        </Stack>
      ) : (
        <DataTable
          columns={columns}
          rows={filteredProducts}
          maxH="600px"
          allowsSorting
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          onRowClick={(row) => {
            window.location.href = `/products/${row.id}`;
          }}
        />
      )}

      {/* Pagination */}
      <Stack direction="row" justify="flex-end">
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          pageSize={perPage}
          totalItems={filteredProducts.length}
        />
      </Stack>
    </Stack>
  );
}
