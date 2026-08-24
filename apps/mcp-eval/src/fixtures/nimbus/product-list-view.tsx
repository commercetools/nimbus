/**
 * Realistic Merchant Center "Product List" view — Nimbus migration of the
 * UI Kit fixture at `../uikit/product-list-view.tsx`.
 *
 * Migration notes (see `migrate_from_uikit` output for the source file):
 *
 * - PrimaryButton/SecondaryButton/FlatButton → Button (variant + colorPalette
 *   set explicitly to preserve the previous default blue appearance;
 *   iconLeft/icon props become children).
 * - IconButton → IconButton (label → aria-label, icon → children).
 * - SearchTextInput → SearchInput (onChange receives the string directly).
 * - SelectInput → Select.Root/Select.Options/Select.Option (onSelectionChange
 *   receives the selected key directly).
 * - DateRangeInput → DateRangePicker ({ start, end } CalendarDate value).
 * - CheckboxInput (custom selection column) → removed entirely. Nimbus
 *   DataTable's own `selectionMode="multiple"` replaces the hand-rolled
 *   selection column cell/label (see `codeReduction.selection-model-collapse`
 *   in the migration data).
 * - ToggleInput → Switch (isChecked → isSelected, boolean onChange).
 * - DataTable → DataTable (columns: key→id, label→header, renderItem merged
 *   into `accessor`; onSortChange receives a descriptor object;
 *   onSelectionChange receives `"all" | Set<Key>`).
 * - DataTableManager → no dedicated Nimbus export; DataTable's own
 *   density/customSettings/onColumnsChange props already cover column
 *   management, so the wrapper is dropped rather than imported unused.
 * - CollapsiblePanel → Accordion.Root/Item/Header/Content (isClosed/onToggle →
 *   expandedKeys/onExpandedChange).
 * - Pagination → Pagination (onPageChange receives the page number directly).
 * - Stamp → Badge (tone → colorPalette, isCondensed → size="sm").
 * - Tag → TagGroup.Root/TagGroup.TagList/TagGroup.Tag.
 * - Avatar → Avatar (direct replacement).
 * - Text.Body/Text.Headline/Text.Subheadline → Text/Heading.
 * - Label → Text as="label".
 * - FieldErrors/LoadingSpinner → direct replacements.
 * - Spacings.Stack/Spacings.Inline → Stack (direction="column"/"row").
 * - Constraints.Horizontal → Box with a maxWidth style prop.
 * - FilterIcon/EditIcon/RefreshIcon/etc. → Icon (as={...}) from
 *   "@commercetools/nimbus", wrapping icon components imported from
 *   "@commercetools/nimbus-icons".
 */

import { useCallback, useState } from "react";
import {
  Accordion,
  Avatar,
  Badge,
  Box,
  Button,
  DataTable,
  DateRangePicker,
  type DateRangePickerProps,
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
} from "@commercetools/nimbus";
import {
  Add,
  Delete,
  Download,
  Edit,
  FilterAlt,
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
  // DataTable's `DataTableRowItem<T>` requires an index signature.
  [key: string]: unknown;
}

interface SortState {
  key: string;
  order: "asc" | "desc";
}

// Mirrors React Aria's `Selection` type (`"all" | Set<Key>`, where
// `Key = string | number`) without pulling in a react-aria-components import
// for a single type alias.
type RowSelection = "all" | Set<string | number>;

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

// Stamp tone -> Badge colorPalette (positive/warning/primary all keep the
// same name in the Nimbus semantic palette).
const STATUS_COLOR_PALETTES: Record<
  Product["status"],
  "primary" | "positive" | "warning"
> = {
  published: "positive",
  draft: "warning",
  modified: "primary",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductListView() {
  // State
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] =
    useState<DateRangePickerProps["value"]>(null);
  const [sortState, setSortState] = useState<SortState>({
    key: "name",
    order: "asc",
  });
  const [selectedRows, setSelectedRows] = useState<RowSelection>(
    new Set<string>()
  );
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const perPage = 20;

  // Handlers
  const handleStatusChange = useCallback((key: string | number | null) => {
    setStatusFilter(key ? String(key) : "all");
  }, []);

  const handleSortChange = useCallback(
    (descriptor: { column: string; direction: "ascending" | "descending" }) => {
      setSortState({
        key: descriptor.column,
        order: descriptor.direction === "ascending" ? "asc" : "desc",
      });
    },
    []
  );

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
    selectedRows === "all" ? filteredProducts.length : selectedRows.size;

  // DataTable columns: key -> id, label -> header, renderItem merged into
  // `accessor` (returns either plain text or JSX per the Nimbus DataTable
  // contract). The old selection column is gone — DataTable's own
  // `selectionMode="multiple"` provides the header/row checkboxes.
  const columns: DataTableColumnItem<Product>[] = [
    {
      id: "name",
      header: "Product Name",
      isSortable: true,
      accessor: (row) => (
        <Stack direction="row" gap="200" align="center">
          <Avatar
            firstName={row.createdBy.split(" ")[0]}
            lastName={row.createdBy.split(" ")[1]}
            size="sm"
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
        <TagGroup.Root aria-label={`${row.name} categories`} size="sm">
          <TagGroup.TagList>
            {row.categories.map((cat) => (
              <TagGroup.Tag key={cat}>{cat}</TagGroup.Tag>
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

  return (
    // Constraints.Horizontal max={16} ~= 784px; no exact Nimbus size token
    // matched this value, so it's applied as a plain maxWidth style prop.
    <Box maxWidth="784px">
      <Stack direction="column" gap="600">
        {/* Page header */}
        <Stack direction="row" gap="400" align="center" justify="space-between">
          <Stack direction="row" gap="200" align="center">
            <Heading as="h1" size="lg">
              Products
            </Heading>
            <TagGroup.Root aria-label="Item count">
              <TagGroup.TagList>
                <TagGroup.Tag>{`${filteredProducts.length} items`}</TagGroup.Tag>
              </TagGroup.TagList>
            </TagGroup.Root>
          </Stack>

          <Stack direction="row" gap="200">
            <Button variant="outline" colorPalette="primary">
              <Icon as={Download} />
              Export
            </Button>
            <Button variant="solid" colorPalette="primary">
              <Icon as={Add} />
              Add Product
            </Button>
          </Stack>
        </Stack>

        {/* Search and filter bar */}
        <Stack direction="row" gap="400" align="flex-end">
          {/* Constraints.Horizontal max={10} ~= 484px */}
          <Box maxWidth="484px">
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search products..."
              aria-label="Search products"
            />
          </Box>

          {/* Constraints.Horizontal max={6} ~= 284px */}
          <Box maxWidth="284px">
            <Select.Root
              aria-label="Filter by status"
              selectedKey={statusFilter}
              onSelectionChange={handleStatusChange}
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

          <IconButton
            aria-label="Toggle filters"
            onPress={() => setIsAdvancedOpen((prev) => !prev)}
          >
            <Icon as={FilterAlt} />
          </IconButton>

          <Button
            variant="ghost"
            colorPalette="primary"
            onPress={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}
          >
            <Icon as={Refresh} />
            Refresh
          </Button>
        </Stack>

        {/* Advanced filters — CollapsiblePanel -> Accordion */}
        <Accordion.Root
          size="sm"
          expandedKeys={isAdvancedOpen ? ["advanced-filters"] : []}
          onExpandedChange={(keys) => setIsAdvancedOpen(keys.size > 0)}
        >
          <Accordion.Item value="advanced-filters">
            <Accordion.Header>
              <Icon as={FilterAlt} size="sm" />
              Advanced Filters
            </Accordion.Header>
            <Accordion.Content>
              <Stack direction="column" gap="400">
                <Stack direction="row" gap="600" align="flex-end">
                  {/* Constraints.Horizontal max={8} ~= 384px = size.9600 */}
                  <Box maxWidth="9600">
                    <Stack direction="column" gap="100">
                      <Text as="label" fontSize="sm" fontWeight="medium">
                        Date Range
                      </Text>
                      <DateRangePicker
                        aria-label="Select date range"
                        value={dateRange}
                        onChange={setDateRange}
                      />
                    </Stack>
                  </Box>

                  <Switch
                    isSelected={showOnlyActive}
                    onChange={setShowOnlyActive}
                  >
                    Active only
                  </Switch>
                </Stack>

                {Object.values(errors).some(Boolean) && (
                  <FieldErrors errors={errors} isVisible />
                )}
              </Stack>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        {/* Bulk actions bar (visible when rows selected) */}
        {selectedCount > 0 && (
          <Stack direction="row" gap="400" align="center">
            <Text>{selectedCount} product(s) selected</Text>
            <Button variant="outline" colorPalette="primary">
              <Icon as={Edit} />
              Edit selected
            </Button>
            <Button variant="ghost" colorPalette="critical">
              <Icon as={Delete} />
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
            maxHeight="600px"
            selectionMode="multiple"
            selectedKeys={selectedRows}
            onSelectionChange={setSelectedRows}
            sortDescriptor={{
              column: sortState.key,
              direction: sortState.order === "asc" ? "ascending" : "descending",
            }}
            onSortChange={handleSortChange}
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
            onPageSizeChange={() => {}}
            totalItems={filteredProducts.length}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
