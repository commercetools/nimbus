import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable } from "./data-table";
import { Stack } from "./../stack";
import type { DataTableColumn, DataTableRow, SortDescriptor } from "./data-table.types";
import { useState } from "react";
import { TextInput } from "./../text-input";
import { Slider } from "@chakra-ui/react";

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
    data: [
      ...data,
    ],
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
          <p>Click on column headers to sort. The "Custom" column is not sortable.</p>
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
      direction: "ascending" 
    });

    return (
      <Stack gap={16}>
        <div>
          <h3>Controlled Sorting Example</h3>
          <p>
            Current sort: <strong>{sortDescriptor.column}</strong> ({sortDescriptor.direction})
          </p>
          <p>The sorting state is controlled externally and can be programmatically changed.</p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button 
            onClick={() => setSortDescriptor({ column: "name", direction: "ascending" })}
            style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            Sort by Name (A-Z)
          </button>
          <button 
            onClick={() => setSortDescriptor({ column: "age", direction: "descending" })}
            style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            Sort by Age (High-Low)
          </button>
          <button 
            onClick={() => setSortDescriptor({ column: "role", direction: "ascending" })}
            style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px" }}
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
          <p>Combine search functionality with sorting. Search results are also sortable.</p>
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
          <p><strong>Features demonstrated:</strong></p>
          <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
            <li>• Visual sort indicators (arrows show current sort direction)</li>
            <li>• Mixed sortable and non-sortable columns</li>
            <li>• String sorting (Name, Role) - case insensitive</li>
            <li>• Numeric sorting (Age) - proper number comparison</li>
            <li>• Active column highlighting</li>
            <li>• Hover effects on sortable headers</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            <strong>Try it:</strong> Click on "Name", "Age", or "Role" column headers to sort. 
            Notice the "Custom" column is not sortable and doesn't show indicators.
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
