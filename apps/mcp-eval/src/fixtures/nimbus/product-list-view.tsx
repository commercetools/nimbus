/**
 * Realistic Merchant Center "Product List" view built entirely with Nimbus.
 *
 * This is the Nimbus equivalent of ../uikit/product-list-view.tsx — the same
 * page, migrated. It demonstrates the trickiest migration patterns all in one
 * file, the way a real MC page would combine them:
 *
 * - Button (solid/outline/ghost variants) / IconButton (children instead of
 *   label, onPress instead of onClick)
 * - SearchInput / Select / DateRangePicker (native onChange/onSelectionChange
 *   value shapes instead of UIKit's `{ target: { value } }` event wrapper)
 * - DataTable with `{ id, header, accessor }` columns and native
 *   selectionMode/selectedKeys — no more hand-rolled selection column or
 *   DataTableManager wrapper
 * - Stack (with `direction="row"` for inline layouts) instead of
 *   Spacings.Stack/Spacings.Inline; `maxW` style prop instead of
 *   Constraints.Horizontal
 * - Accordion.Root / Accordion.Item / Accordion.Header / Accordion.Content
 *   (compound API) instead of CollapsiblePanel
 * - Badge / TagGroup+Tag / Avatar (style-props-enabled Nimbus components)
 * - Pagination
 * - FieldErrors / LoadingSpinner
 * - Icon imports from @commercetools/nimbus-icons, wrapped in <Icon>
 * - Text (with `as`/`textStyle` props) instead of Text.Body/Text.Headline/Label
 * - Switch instead of ToggleInput
 */

import { useCallback, useState } from "react";
import type { Key, Selection } from "react-aria-components";

import {
  Accordion,
  Avatar,
  Badge,
  Box,
  Button,
  DataTable,
  DateRangePicker,
  FieldErrors,
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
  type BadgeProps,
  type DataTableColumnItem,
  type DateValue,
  type RangeValue,
  type SortDescriptor,
} from "@commercetools/nimbus";
import {
  Add,
  Delete,
  Edit,
  FilterList,
  FileDownload,
  Refresh,
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

const STATUS_OPTIONS: { id: string; name: string }[] = [
  { id: "all", name: "All statuses" },
  { id: "published", name: "Published" },
  { id: "draft", name: "Draft" },
  { id: "modified", name: "Modified" },
];

const STATUS_BADGE_TONES: Record<
  Product["status"],
  BadgeProps["colorPalette"]
> = {
  published: "positive",
  draft: "warning",
  modified: "primary",
};

// ---------------------------------------------------------------------------
// DataTable columns — { id, header, accessor } instead of UIKit's
// { key, label, renderItem, isSortable, width }. Selection is handled by
// DataTable's own selectionMode/selectedKeys props, so the hand-rolled
// SelectionColumnCell/SelectionColumnLabel components UIKit needed are gone
// entirely (codeReduction).
// ---------------------------------------------------------------------------

const columns: DataTableColumnItem<Product>[] = [
  {
    id: "name",
    header: "Product Name",
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
      <Badge colorPalette={STATUS_BADGE_TONES[row.status]}>{row.status}</Badge>
    ),
  },
  {
    id: "price",
    header: "Price",
    accessor: (row) => row.price,
  },
  {
    id: "categories",
    header: "Categories",
    accessor: (row) => (
      <TagGroup.Root aria-label={`${row.name} categories`} size="sm">
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
    accessor: (row) => row.lastModified,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductListView() {
  // State
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Key>("all");
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(
    null
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Handlers — plain values instead of UIKit's synthetic/wrapped events
  const handleStatusChange = useCallback((key: Key | null) => {
    setStatusFilter(key ?? "all");
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const selectedCount =
    selectedKeys === "all" ? PRODUCTS.length : selectedKeys.size;

  const filteredProducts = PRODUCTS.filter((product) => {
    if (statusFilter !== "all" && product.status !== statusFilter) return false;
    if (
      searchValue &&
      !product.name.toLowerCase().includes(searchValue.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <Box maxW="1600px">
      <Stack gap="600">
        {/* Page header */}
        <Stack
          direction="row"
          gap="400"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" gap="200" alignItems="center">
            <Text as="h1" textStyle="headline-h1">
              Products
            </Text>
            <Badge>{`${filteredProducts.length} items`}</Badge>
          </Stack>

          <Stack direction="row" gap="200">
            <Button variant="outline" colorPalette="primary" onPress={() => {}}>
              <Icon as={FileDownload} />
              Export
            </Button>
            <Button variant="solid" colorPalette="primary" onPress={() => {}}>
              <Icon as={Add} />
              Add Product
            </Button>
          </Stack>
        </Stack>

        {/* Search and filter bar */}
        <Stack direction="row" gap="400" alignItems="flex-end">
          <Box maxW="400px">
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search products..."
              aria-label="Search products"
            />
          </Box>

          <Box maxW="240px">
            <Select.Root
              selectedKey={statusFilter}
              onSelectionChange={handleStatusChange}
              aria-label="Filter by status"
            >
              <Select.Options items={STATUS_OPTIONS}>
                {(item) => (
                  <Select.Option id={item.id}>{item.name}</Select.Option>
                )}
              </Select.Options>
            </Select.Root>
          </Box>

          <IconButton
            aria-label="Toggle filters"
            variant="outline"
            onPress={() => setIsAdvancedOpen((prev) => !prev)}
          >
            <Icon as={FilterList} />
          </IconButton>

          <Button
            variant="ghost"
            colorPalette="primary"
            onPress={handleRefresh}
          >
            <Icon as={Refresh} />
            Refresh
          </Button>
        </Stack>

        {/* Advanced filters — Accordion instead of CollapsiblePanel */}
        <Accordion.Root
          expandedKeys={isAdvancedOpen ? ["advanced-filters"] : []}
          onExpandedChange={(keys) =>
            setIsAdvancedOpen(Array.from(keys).includes("advanced-filters"))
          }
        >
          <Accordion.Item value="advanced-filters">
            <Accordion.Header>
              <Stack direction="row" gap="200" alignItems="center">
                <Icon as={FilterList} />
                <Text as="h4" textStyle="label-l">
                  Advanced Filters
                </Text>
              </Stack>
            </Accordion.Header>
            <Accordion.Content>
              <Stack gap="400">
                <Stack direction="row" gap="600" alignItems="flex-end">
                  <Box maxW="320px">
                    <Stack gap="100">
                      <Text as="label">Date Range</Text>
                      <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        aria-label="Date range"
                      />
                    </Stack>
                  </Box>

                  <Stack gap="100">
                    <Text as="label">Active only</Text>
                    <Switch
                      isSelected={showOnlyActive}
                      onChange={setShowOnlyActive}
                    />
                  </Stack>
                </Stack>

                {Object.keys(errors).length > 0 && (
                  <FieldErrors
                    id="advanced-filters-errors"
                    errors={errors}
                    isVisible
                  />
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
              <Icon as={Edit} />
              Edit selected
            </Button>
            <Button variant="ghost" colorPalette="critical" onPress={() => {}}>
              <Icon as={Delete} />
              Delete selected
            </Button>
          </Stack>
        )}

        {/* Data table — native columns/selection/sorting, no DataTableManager */}
        {isLoading ? (
          <Stack direction="row" justifyContent="center">
            <LoadingSpinner />
          </Stack>
        ) : (
          <DataTable
            columns={columns}
            rows={filteredProducts}
            maxHeight="600px"
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
        <Stack direction="row" justifyContent="flex-end">
          <Pagination
            totalItems={filteredProducts.length}
            currentPage={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
