import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable } from "./data-table";
import { Stack } from "./../stack";
import type { DataTableColumn, DataTableRow } from "./data-table.types";
import { useState } from "react";
import { TextInput } from "./../text-input";

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
  { id: "name", header: "Name", accessor: row => row.name },
  { id: "age", header: "Age", accessor: row => row.age },
  { id: "role", header: "Role", accessor: row => row.role },
  {
    id: "custom",
    header: "Custom",
    accessor: row => row.class,
    render: ({ value }) => <span style={{ color: "tomato" }}>{value}</span>,
  },
];
const data: DataTableRow[] = [
  { id: "1", name: "Alice", age: 30, role: "Admin", class: "special" },
  { id: "2", name: "Bob", age: 25, role: "User", class: "rare" },
  { id: "3", name: "Carol", age: 28, role: "User", class: "common" },
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
  },
};

export const ColumnManager: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(["name", "age"]);
    const allColumns = args.columns.map(col => col.id);
    const handleCheckboxChange = (colId: string) => {
      setVisible(prev =>
        prev.includes(colId)
          ? prev.filter(id => id !== colId)
          : [...prev, colId]
      );
    };
    return (
      <>
        <div style={{ marginBottom: 12 }}>
          {allColumns.map(colId => (
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
        <TextInput value={search} onChange={setSearch} placeholder="Search..." width="1/3" />
        <DataTable {...args} search={search} />
      </Stack>
    );
  },
  args: { columns, data },
};

export const AdjustableColumns: Story = {
  args: { columns, data, isAdjustable: true },
};

export const Condensed: Story = {
  render: (args) => {
    const [condensed, setCondensed] = useState(false);
    return (
      <>
        <label style={{ display: 'block', marginBottom: 12 }}>
          <input
            type="checkbox"
            checked={condensed}
            onChange={e => setCondensed(e.target.checked)}
          />
          Condensed
        </label>
        <DataTable {...args} density={condensed ? 'condensed' : 'default'} />
      </>
    );
  },
  args: { columns, data },
};

export const StickyHeader: Story = {
  args: { columns, data },
};

export const ClickableRows: Story = {
  render: (args) => (
    <DataTable
      {...args}
      isRowClickable
      onRowClick={row => alert(`Clicked row: ${row.name}`)}
    />
  ),
  args: { columns, data },
};

export const MoreDetails: Story = {
  render: (args) => (
    <DataTable
      {...args}
      onDetailsClick={row => alert(`Details for: ${row.name}`)}
      renderDetails={row => <div>More info about {row.name}</div>}
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
          { id: "1-1", name: "Alice Jr.", age: 5, role: "Child", class: "junior" },
        ],
      },
      { id: "2", name: "Bob", age: 25, role: "User", class: "rare" },
    ],
  },
};
