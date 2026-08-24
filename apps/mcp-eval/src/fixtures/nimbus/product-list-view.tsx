/**
 * Realistic Merchant Center "Product List" view built entirely with Nimbus.
 *
 * This is the migrated counterpart of `fixtures/uikit/product-list-view.tsx`,
 * exercising the same set of tricky migration patterns:
 *
 * - Button (variant/colorPalette replacing PrimaryButton/SecondaryButton/FlatButton)
 * - IconButton (aria-label + icon children)
 * - SearchInput / Select / DateRangePicker (string/key/CalendarDate value shapes)
 * - DataTable with built-in `selectionMode="multiple"` (the old selection-column
 *   cell/label components are gone entirely — see the DataTable codeReduction note)
 * - Stack (replacing Spacings.Stack / Spacings.Inline) and maxW tokens
 *   (replacing Constraints.Horizontal)
 * - Accordion (compound composition replacing CollapsiblePanel)
 * - Badge / TagGroup / Avatar (style-props-enabled Nimbus targets)
 * - Pagination
 * - FieldErrors / LoadingSpinner
 * - Icon imports from @commercetools/nimbus-icons
 * - Text / Heading
 * - Switch
 */

import { useCallback, useMemo, useState } from "react";
import {
  Accordion,
  Avatar,
  Badge,
  Box,
  Button,
  DataTable,
  DateRangePicker,
  FieldErrors,
  Heading,
  Icon,
  IconButton,
  LoadingSpinner,
  Pagination,
  SearchInput,
  Select,
  Stack,
  Switch,
  TagGroup,
  Text,
  type DataTableColumnItem,
  type DataTableProps,
  type DateRangePickerProps,
  type SortDescriptor,
} from "@commercetools/nimbus";
import {
  Add,
  DeleteOutline,
  Edit,
  FileDownload,
  FilterAlt,
  Refresh,
} from "@commercetools/nimbus-icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Product {
  // Index signature required by DataTable's `DataTableRowItem<T>` contract.
  [key: string]: unknown;
  id: string;
  name: string;
  sku: string;
  status: "published" | "draft" | "modified";
  price: string;
  lastModified: string;
  createdBy: string;
  categories: string[];
}

type StatusColorPalette = "primary" | "positive" | "warning";

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

const STATUS_COLOR_PALETTES: Record<Product["status"], StatusColorPalette> = {
  published: "positive",
  draft: "warning",
  modified: "primary",
};

const ADVANCED_FILTERS_KEY = "advanced-filters";

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
  const [selectedKeys, setSelectedKeys] = useState<
    DataTableProps<Product>["selectedKeys"]
  >(new Set());
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const isAdvancedOpen = expandedKeys.has(ADVANCED_FILTERS_KEY);

  const toggleAdvancedFilters = useCallback(() => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(ADVANCED_FILTERS_KEY)) {
        next.delete(ADVANCED_FILTERS_KEY);
      } else {
        next.add(ADVANCED_FILTERS_KEY);
      }
      return next;
    });
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        if (statusFilter !== "all" && p.status !== statusFilter) return false;
        if (
          searchValue &&
          !p.name.toLowerCase().includes(searchValue.toLowerCase())
        )
          return false;
        return true;
      }),
    [statusFilter, searchValue]
  );

  const selectedCount =
    selectedKeys === "all"
      ? filteredProducts.length
      : (selectedKeys?.size ?? 0);

  // DataTable columns — the old selection column (SelectionColumnCell /
  // SelectionColumnLabel) is gone: `selectionMode="multiple"` below provides
  // built-in row selection, so those helper components are unnecessary.
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
            size="xs"
          />
          <Button
            variant="link"
            colorPalette="primary"
            onPress={() => {
              window.location.href = `/products/${row.id}`;
            }}
          >
            {row.name}
          </Button>
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
        <Badge colorPalette={STATUS_COLOR_PALETTES[row.status]} size="sm">
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
          <TagGroup.TagList
            items={row.categories.map((category) => ({
              id: category,
              name: category,
            }))}
          >
            {(item) => <TagGroup.Tag>{item.name}</TagGroup.Tag>}
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

  return (
    <Box maxW="3xl">
      <Stack direction="column" gap="600">
        {/* Page header */}
        <Stack
          direction="row"
          gap="400"
          alignItems="center"
          justifyContent="space-between"
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

          <Stack direction="row" gap="200" flexWrap="wrap">
            <Button variant="outline" colorPalette="primary">
              <FileDownload />
              Export
            </Button>
            <Button variant="solid" colorPalette="primary">
              <Add />
              Add Product
            </Button>
          </Stack>
        </Stack>

        {/* Search and filter bar */}
        <Stack direction="row" gap="400" alignItems="flex-end" flexWrap="wrap">
          <Stack direction="row" gap="400" maxW="3xl" flex="1" flexWrap="wrap">
            <Box flex="2">
              <SearchInput
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search products..."
                aria-label="Search products"
              />
            </Box>
            <Box flex="1">
              <Select.Root
                selectedKey={statusFilter}
                onSelectionChange={(key) =>
                  setStatusFilter(key ? String(key) : "all")
                }
                aria-label="Filter by status"
              >
                <Select.Options>
                  {STATUS_OPTIONS.map((option) => (
                    <Select.Option key={option.value} id={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select.Options>
              </Select.Root>
            </Box>
          </Stack>

          <IconButton
            aria-label="Toggle filters"
            onPress={toggleAdvancedFilters}
          >
            <FilterAlt />
          </IconButton>

          <Button
            variant="ghost"
            colorPalette="primary"
            onPress={handleRefresh}
          >
            <Refresh />
            Refresh
          </Button>
        </Stack>

        {/* Advanced filters — CollapsiblePanel → Accordion */}
        <Accordion.Root
          size="sm"
          expandedKeys={expandedKeys}
          onExpandedChange={(keys) =>
            setExpandedKeys(new Set(Array.from(keys, String)))
          }
        >
          <Accordion.Item value={ADVANCED_FILTERS_KEY}>
            <Accordion.Header>
              <Stack direction="row" gap="200" alignItems="center">
                <Icon as={FilterAlt} size="2xs" color="neutral.11" />
                <Heading as="h4" size="xs" fontWeight="medium">
                  Advanced Filters
                </Heading>
              </Stack>
            </Accordion.Header>
            <Accordion.Content>
              <Stack direction="column" gap="400">
                <Stack
                  direction="row"
                  gap="600"
                  alignItems="flex-end"
                  flexWrap="wrap"
                >
                  <Stack direction="column" gap="100" maxW="sm">
                    <Text
                      id="product-list-date-range-label"
                      as="label"
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      Date Range
                    </Text>
                    <DateRangePicker
                      id="product-list-date-range"
                      aria-labelledby="product-list-date-range-label"
                      value={dateRange}
                      onChange={setDateRange}
                    />
                  </Stack>

                  <Switch
                    isSelected={showOnlyActive}
                    onChange={setShowOnlyActive}
                  >
                    Active only
                  </Switch>
                </Stack>

                {isAdvancedOpen && Object.keys(errors).length > 0 && (
                  <FieldErrors errors={errors} />
                )}
              </Stack>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        {/* Bulk actions bar (visible when rows selected) */}
        {selectedCount > 0 && (
          <Stack direction="row" gap="400" alignItems="center" flexWrap="wrap">
            <Text>{selectedCount} product(s) selected</Text>
            <Button variant="outline" colorPalette="primary">
              <Edit />
              Edit selected
            </Button>
            <Button variant="ghost" colorPalette="critical">
              <DeleteOutline />
              Delete selected
            </Button>
          </Stack>
        )}

        {/* Data table */}
        {isLoading ? (
          <Stack direction="row" justifyContent="center">
            <LoadingSpinner aria-label="Loading products" />
          </Stack>
        ) : (
          <DataTable
            columns={columns}
            rows={filteredProducts}
            maxHeight="600px"
            allowsPinning={false}
            allowsSorting
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          />
        )}

        {/* Pagination */}
        <Stack direction="row" justifyContent="flex-end">
          <Pagination
            currentPage={page}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            totalItems={filteredProducts.length}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
