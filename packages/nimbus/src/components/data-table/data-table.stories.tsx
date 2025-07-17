import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable } from "./data-table";
import { Stack } from "./../stack";
import type {
  DataTableColumn,
  DataTableRow,
  SortDescriptor,
} from "./data-table.types";
import { useState } from "react";
import { TextInput } from "./../text-input";
import { Slider } from "@chakra-ui/react";
import type { Selection } from "react-aria-components";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof DataTable> = {
  title: "components/DataTable",
  component: DataTable,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof DataTable>;

// Sample data and columns
const columns: DataTableColumn[] = [
  { id: "name", header: "Name", accessor: (row) => row.name },
  { id: "age", header: "Age", accessor: (row) => row.age },
  { id: "role", header: "Role", accessor: (row) => row.role },
  {
    id: "custom",
    header: "Custom",
    accessor: (row) => row.class,
    render: ({ value }) => <span style={{ color: "tomato" }}>{value}</span>,
  },
];

// Sortable columns - same as above but with explicit sortable configuration
const sortableColumns: DataTableColumn[] = [
  { id: "name", header: "Name", accessor: (row) => row.name, isSortable: true },
  { id: "age", header: "Age", accessor: (row) => row.age, isSortable: true },
  { id: "role", header: "Role", accessor: (row) => row.role, isSortable: true },
  {
    id: "custom",
    header: "Custom (Not Sortable)",
    accessor: (row) => row.class,
    render: ({ value }) => <span style={{ color: "tomato" }}>{value}</span>,
    isSortable: false, // This column is not sortable
  },
];

const data: DataTableRow[] = [
  { id: "1", name: "Alice", age: 30, role: "Admin", class: "special" },
  { id: "2", name: "Bob", age: 25, role: "User", class: "rare" },
  { id: "3", name: "Carol", age: 28, role: "User", class: "common" },
  { id: "4", name: "David", age: 32, role: "Manager", class: "premium" },
  { id: "5", name: "Emma", age: 27, role: "Developer", class: "special" },
  { id: "6", name: "Frank", age: 29, role: "Designer", class: "rare" },
  { id: "7", name: "Grace", age: 31, role: "Analyst", class: "common" },
  { id: "8", name: "Henry", age: 26, role: "Developer", class: "special" },
  { id: "9", name: "Ivy", age: 33, role: "Manager", class: "premium" },
  { id: "10", name: "Jack", age: 24, role: "Intern", class: "junior" },
];

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    columns,
    data,
    allowsSorting: true,
    width: 200,
    minWidth: 200,
    isAdjustable: true,
    isRowClickable: true,
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
        <div style={{ marginBottom: 12 }}>
          {allColumns.map((colId) => (
            <label key={colId} style={{ marginRight: 12 }}>
              <input
                type="checkbox"
                checked={visible.includes(colId)}
                onChange={() => handleCheckboxChange(colId)}
              />
              {colId}
            </label>
          ))}
        </div>
        <DataTable {...args} visibleColumns={visible} />
      </>
    );
  },
  args: { columns, data },
};

export const CustomColumn: Story = {
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
        />
        <DataTable {...args} search={search} />
      </Stack>
    );
  },
  args: { columns, data },
};

export const AdjustableColumns: Story = {
  render: (args) => {
    const [isAdjustable, setIsAdjustable] = useState(false);
    return (
      <Stack gap={16}>
        <label style={{ display: "block", marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={isAdjustable}
            onChange={(e) => setIsAdjustable(e.target.checked)}
            style={{ marginRight: 12 }}
          />
          Resizable Column
        </label>
        <DataTable {...args} isAdjustable={isAdjustable} />
      </Stack>
    );
  },
  args: {
    columns,
    data,
    width: 180,
    minWidth: 150,
  },
};

export const Condensed: Story = {
  render: (args) => {
    const [condensed, setCondensed] = useState(false);
    return (
      <>
        <label style={{ display: "block", marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={condensed}
            onChange={(e) => setCondensed(e.target.checked)}
            style={{ marginRight: 12 }}
          />
          Condensed
        </label>
        <DataTable {...args} density={condensed ? "condensed" : "default"} />
      </>
    );
  },
  args: { columns, data },
};

export const StickyHeader: Story = {
  render: (args) => {
    const [sticky, setSticky] = useState(false);
    return (
      <>
        <label style={{ display: "block", marginBottom: 12 }}>
          {/* This is supposed to set the sticky header from the top to the bottom of the table. */}
          <input
            type="checkbox"
            checked={sticky}
            onChange={(e) => setSticky(e.target.checked)}
            style={{ marginRight: 12 }}
          />
          Sticky header
        </label>
        <DataTable {...args} stickyHeader={sticky} />
      </>
    );
  },
  args: {
    columns,
    data: [...data],
  },
};

export const ClickableRows: Story = {
  render: (args) => (
    <DataTable
      {...args}
      isRowClickable
      onRowClick={(row) => alert(`Clicked row: ${row.name}`)}
    />
  ),
  args: { columns, data },
};

export const NestedRows: Story = {
  args: {
    columns,
    data: [
      {
        id: "1",
        name: "Alice",
        age: 30,
        role: "Admin",
        class: "special",
        children: [
          {
            id: "1-1",
            name: "Alice Jr.",
            age: 5,
            role: "Child",
            class: "junior",
          },
        ],
      },
      { id: "2", name: "Bob", age: 25, role: "User", class: "rare" },
    ],
  },
};

export const WithSorting: Story = {
  render: (args) => {
    return (
      <Stack gap={16}>
        <div>
          <h3>Sorting Example</h3>
          <p>
            Click on column headers to sort. The "Custom" column is not
            sortable.
          </p>
        </div>
        <DataTable {...args} />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    data,
    allowsSorting: true,
  },
};

export const ControlledSorting: Story = {
  render: (args) => {
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
      column: "name",
      direction: "ascending",
    });

    return (
      <Stack gap={16}>
        <div>
          <h3>Controlled Sorting Example</h3>
          <p>
            Current sort: <strong>{sortDescriptor.column}</strong> (
            {sortDescriptor.direction})
          </p>
          <p>
            The sorting state is controlled externally and can be
            programmatically changed.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() =>
              setSortDescriptor({ column: "name", direction: "ascending" })
            }
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            Sort by Name (A-Z)
          </button>
          <button
            onClick={() =>
              setSortDescriptor({ column: "age", direction: "descending" })
            }
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            Sort by Age (High-Low)
          </button>
          <button
            onClick={() =>
              setSortDescriptor({ column: "role", direction: "ascending" })
            }
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            Sort by Role (A-Z)
          </button>
        </div>
        <DataTable
          {...args}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
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
      <Stack gap={16}>
        <div>
          <h3>Sorting + Search Example</h3>
          <p>
            Combine search functionality with sorting. Search results are also
            sortable.
          </p>
        </div>
        <TextInput
          value={search}
          onChange={setSearch}
          placeholder="Search and then sort..."
          width="1/3"
        />
        <DataTable {...args} search={search} />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    data,
    allowsSorting: true,
  },
};

export const SortingShowcase: Story = {
  render: (args) => {
    return (
      <Stack gap={16}>
        <div>
          <h3>Complete Sorting Showcase</h3>
          <p>
            <strong>Features demonstrated:</strong>
          </p>
          <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
            <li>
              • Visual sort indicators (arrows show current sort direction)
            </li>
            <li>• Mixed sortable and non-sortable columns</li>
            <li>• String sorting (Name, Role) - case insensitive</li>
            <li>• Numeric sorting (Age) - proper number comparison</li>
            <li>• Active column highlighting</li>
            <li>• Hover effects on sortable headers</li>
          </ul>
          <p style={{ marginTop: "12px" }}>
            <strong>Try it:</strong> Click on "Name", "Age", or "Role" column
            headers to sort. Notice the "Custom" column is not sortable and
            doesn't show indicators.
          </p>
        </div>
        <DataTable {...args} />
      </Stack>
    );
  },
  args: {
    columns: sortableColumns,
    data,
    allowsSorting: true,
    isAdjustable: true,
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

    return (
      <Stack gap={16}>
        <div>
          <h3>Selection + Sorting + Search</h3>
          <p>Combine all features: search, sort, and select multiple rows.</p>
          <p>
            <strong>Selected:</strong> {Array.from(selectedKeys).length} row(s)
          </p>
        </div>
        <TextInput
          value={search}
          onChange={setSearch}
          placeholder="Search..."
          width="1/3"
        />
        <DataTable
          {...args}
          search={search}
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
          isRowClickable
          onRowClick={(row) => alert(`Clicked row: ${row.name}`)}
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

// Sample data with longer text for truncation demonstration
const longTextData: DataTableRow[] = [
  {
    id: "1",
    name: "Alice Johnson",
    age: 30,
    role: "Senior Software Engineer",
    class:
      "This is a very long description that should be truncated when the truncation feature is enabled. It contains multiple words and should demonstrate how the truncation works with ellipsis and hover to show full content.",
    email: "alice.johnson@company.com",
  },
  {
    id: "2",
    name: "Bob Smith",
    age: 25,
    role: "Frontend Developer",
    class:
      "Another lengthy description that will showcase the truncation functionality. This text is intentionally long to demonstrate how the component handles overflow text with truncation enabled.",
    email: "bob.smith@company.com",
  },
  {
    id: "3",
    name: "Carol Williams",
    age: 28,
    role: "UX Designer",
    class:
      "A comprehensive description that exceeds the normal cell width and needs truncation. When truncated, users can hover to see the full content in a tooltip-like display.",
    email: "carol.williams@company.com",
  },
  {
    id: "4",
    name: "David Brown",
    age: 32,
    role: "Product Manager",
    class:
      "Extended text content that demonstrates the importance of truncation in data tables where space is limited but full content access is still needed via hover interaction.",
    email: "david.brown@company.com",
  },
];

// Columns for truncation demo with longer content
const truncationColumns: DataTableColumn[] = [
  { id: "name", header: "Name", accessor: (row) => row.name },
  { id: "age", header: "Age", accessor: (row) => row.age },
  { id: "role", header: "Role", accessor: (row) => row.role },
  { id: "email", header: "Email", accessor: (row) => row.email },
  {
    id: "description",
    header: "Description",
    accessor: (row) => row.class,
  },
];

export const TextTruncation: Story = {
  render: (args) => {
    const [isTruncated, setIsTruncated] = useState(false);

    return (
      <Stack gap={16}>
        <label style={{ display: "block", marginBottom: 12, alignContent: 'center' }}>
          <input
            type="checkbox"
            checked={isTruncated}
            onChange={(e) => setIsTruncated(e.target.checked)}
            style={{ marginRight: 12 }}
          />
          Enable text truncation
        </label>
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            overflow: "hidden",
            maxWidth: "100%",
          }}
        >
          <DataTable {...args} isTruncated={isTruncated} />
        </div>
      </Stack>
    );
  },
  args: {
    columns: truncationColumns,
    data: longTextData,
    allowsSorting: true,
  },
};
