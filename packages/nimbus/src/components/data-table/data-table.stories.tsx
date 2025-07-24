import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable } from "./data-table";
import { Stack } from "./../stack";
import type {
  DataTableColumn,
  DataTableRow,
  SortDescriptor,
  DataTableProps,
} from "./data-table.types";
import { useState } from "react";
import { TextInput } from "./../text-input";
import { Slider } from "@chakra-ui/react";
import type { Selection } from "react-aria-components";
import { Info } from "@commercetools/nimbus-icons";
import { IconButton } from "../icon-button";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<DataTableProps> = {
  title: "components/DataTable",
  component: DataTable,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<DataTableProps>;

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
  {
    id: "name",
    header: "Name",
    accessor: (row) => row.name,
    isSortable: true,
    headerIcon: (
      <IconButton
        aria-label="Custom Column Information"
        size="sm"
        colorPalette="primary"
        style={{
          boxShadow: "none",
        }}
        onPress={(e) => {
          alert(
            "Check how the `headerIcon` property was used to display this info button."
          );
        }}
      >
        <Info />
      </IconButton>
    ),
  },
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
          Sticky header (with max height)
        </label>
        <DataTable {...args} maxHeight={sticky ? "400px" : undefined} />
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

export const SelectionShowcase: Story = {
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
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              🔍 Search & Filter
            </h4>
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
              <label style={{ fontSize: "14px" }}>Mode:</label>
              <select
                value={selectionMode}
                onChange={(e) =>
                  handleSelectionModeChange(e.target.value as any)
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
  args: {},
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
        <label
          style={{ display: "block", marginBottom: 12, alignContent: "center" }}
        >
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

// Enhanced data with nested rows for comprehensive demo
const comprehensiveData: DataTableRow[] = [
  {
    id: "1",
    name: "Alice Johnson",
    age: 30,
    role: "Senior Software Engineer",
    class:
      "This is a very long description that should be truncated when the truncation feature is enabled. It contains multiple words and should demonstrate how the truncation works with ellipsis and hover to show full content.",
    email: "alice.johnson@company.com",
    department: "Engineering",
    status: "Active",
    children: [
      {
        id: "1-1",
        name: "Project Alpha",
        age: 2,
        role: "Frontend Project",
        class: "React-based dashboard application",
        email: "project.alpha@company.com",
        department: "Engineering",
        status: "In Progress",
      },
      {
        id: "1-2",
        name: "Project Beta",
        age: 1,
        role: "Backend Project",
        class: "Node.js API service",
        email: "project.beta@company.com",
        department: "Engineering",
        status: "Planning",
      },
    ],
  },
  {
    id: "2",
    name: "Bob Smith",
    age: 25,
    role: "Frontend Developer",
    class:
      "Another lengthy description that will showcase the truncation functionality. This text is intentionally long to demonstrate how the component handles overflow text with truncation enabled.",
    email: "bob.smith@company.com",
    department: "Engineering",
    status: "Active",
  },
  {
    id: "3",
    name: "Carol Williams",
    age: 28,
    role: "UX Designer",
    class:
      "A comprehensive description that exceeds the normal cell width and needs truncation. When truncated, users can hover to see the full content in a tooltip-like display.",
    email: "carol.williams@company.com",
    department: "Design",
    status: "Active",
    children: [
      {
        id: "3-1",
        name: "Design System",
        age: 3,
        role: "Component Library",
        class: "Comprehensive design system with tokens",
        email: "design.system@company.com",
        department: "Design",
        status: "Active",
      },
    ],
  },
  {
    id: "4",
    name: "David Brown",
    age: 32,
    role: "Product Manager",
    class:
      "Extended text content that demonstrates the importance of truncation in data tables where space is limited but full content access is still needed via hover interaction.",
    email: "david.brown@company.com",
    department: "Product",
    status: "Active",
  },
  {
    id: "5",
    name: "Emma Davis",
    age: 27,
    role: "DevOps Engineer",
    class: "Infrastructure and deployment specialist",
    email: "emma.davis@company.com",
    department: "Engineering",
    status: "On Leave",
  },
  {
    id: "6",
    name: "Frank Wilson",
    age: 35,
    role: "Senior Designer",
    class: "Creative director for visual design",
    email: "frank.wilson@company.com",
    department: "Design",
    status: "Active",
  },
];

// Comprehensive columns with all features
const comprehensiveColumns: DataTableColumn[] = [
  { id: "name", header: "Name", accessor: (row) => row.name, isSortable: true },
  { id: "age", header: "Age", accessor: (row) => row.age, isSortable: true },
  { id: "role", header: "Role", accessor: (row) => row.role, isSortable: true },
  {
    id: "email",
    header: "Email",
    accessor: (row) => row.email,
    isSortable: true,
  },
  {
    id: "department",
    header: "Department",
    accessor: (row) => row.department,
    isSortable: true,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row) => row.status,
    isSortable: true,
    render: ({ value }) => (
      <span
        style={{
          padding: "4px 8px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "500",
          backgroundColor:
            value === "Active"
              ? "#e6f7ff"
              : value === "In Progress"
                ? "#fff7e6"
                : value === "Planning"
                  ? "#f6ffed"
                  : "#f5f5f5",
          color:
            value === "Active"
              ? "#1890ff"
              : value === "In Progress"
                ? "#fa8c16"
                : value === "Planning"
                  ? "#52c41a"
                  : "#8c8c8c",
        }}
      >
        {value}
      </span>
    ),
  },
  {
    id: "description",
    header: "Description",
    accessor: (row) => row.class,
    isSortable: false,
  },
];

export const WithFooter: Story = {
  render: (args) => {
    const footerContent = (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        <div>
          <strong>Total: {data.length} items</strong>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            Previous
          </button>
          <span style={{ padding: "8px 12px" }}>Page 1 of 1</span>
          <button
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
    );

    return (
      <Stack gap={20}>
        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            📄 DataTable with Custom Footer
          </h2>
          <p style={{ marginBottom: "16px", color: "#666" }}>
            This example shows how to add custom footer content like pagination,
            totals, or action buttons.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={data}
          allowsSorting={true}
          selectionMode="multiple"
          footer={footerContent}
        />

        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}
          >
            Footer Features:
          </h3>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li>Custom content via the `footer` prop</li>
            <li>Consistent styling with table theme</li>
            <li>Perfect for pagination controls</li>
            <li>Works with horizontal scrolling</li>
            <li>Can contain any React component</li>
          </ul>
        </div>
      </Stack>
    );
  },
};

export const HorizontalScrolling: Story = {
  render: (args) => {
    // Create many columns to force horizontal scrolling
    const manyColumns: DataTableColumn[] = [
      {
        id: "name",
        header: "Full Name",
        accessor: (row) => row.name,
        minWidth: 150,
      },
      { id: "age", header: "Age", accessor: (row) => row.age, minWidth: 80 },
      {
        id: "role",
        header: "Role/Position",
        accessor: (row) => row.role,
        minWidth: 120,
      },
      {
        id: "email",
        header: "Email Address",
        accessor: (row) => row.email || "user@example.com",
        minWidth: 200,
      },
      {
        id: "department",
        header: "Department",
        accessor: (row) => row.department || "Engineering",
        minWidth: 150,
      },
      {
        id: "location",
        header: "Office Location",
        accessor: (row) => row.location || "San Francisco, CA",
        minWidth: 180,
      },
      {
        id: "phone",
        header: "Phone Number",
        accessor: (row) => row.phone || "+1 (555) 123-4567",
        minWidth: 150,
      },
      {
        id: "salary",
        header: "Annual Salary",
        accessor: (row) => row.salary || "$95,000",
        minWidth: 120,
      },
      {
        id: "startDate",
        header: "Start Date",
        accessor: (row) => row.startDate || "2023-01-15",
        minWidth: 120,
      },
      {
        id: "manager",
        header: "Reporting Manager",
        accessor: (row) => row.manager || "John Smith",
        minWidth: 150,
      },
      {
        id: "projects",
        header: "Active Projects",
        accessor: (row) => row.projects || "Project Alpha, Beta",
        minWidth: 200,
      },
      {
        id: "skills",
        header: "Technical Skills",
        accessor: (row) => row.skills || "React, TypeScript, Node.js",
        minWidth: 250,
      },
    ];

    // Create data with wide content
    const wideData: DataTableRow[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Employee Name ${i + 1}`,
      age: 25 + (i % 15),
      role: `Senior ${["Developer", "Designer", "Manager", "Analyst"][i % 4]}`,
      email: `employee${i + 1}@company.com`,
      department: ["Engineering", "Design", "Marketing", "Sales"][i % 4],
      location: [
        "San Francisco, CA",
        "New York, NY",
        "London, UK",
        "Berlin, Germany",
      ][i % 4],
      phone: `+1 (555) ${String(123 + i).padStart(3, "0")}-${String(4567 + i).padStart(4, "0")}`,
      salary: `$${(80000 + i * 5000).toLocaleString()}`,
      startDate: `202${2 + (i % 2)}-${String((i % 12) + 1).padStart(2, "0")}-15`,
      manager: ["Alice Johnson", "Bob Smith", "Carol Williams", "David Brown"][
        i % 4
      ],
      projects: [
        `Project ${String.fromCharCode(65 + (i % 3))}`,
        `Initiative ${String.fromCharCode(88 + (i % 3))}`,
      ].join(", "),
      skills: [
        "React, TypeScript, Node.js",
        "Figma, Sketch, Adobe Creative Suite",
        "Python, Django, PostgreSQL",
        "Salesforce, HubSpot, Analytics",
      ][i % 4],
    }));

    return (
      <Stack gap={20}>
        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            📊 Horizontal Scrolling DataTable
          </h2>
          <p style={{ marginBottom: "16px", color: "#666" }}>
            This table has many columns with wide content to demonstrate
            horizontal scrolling. The header remains sticky during horizontal
            scrolling.
          </p>
        </div>

        {/* Container with fixed width to force horizontal scrolling */}
        <DataTable
          columns={manyColumns}
          data={wideData}
          isAdjustable={true}
          allowsSorting={true}
          maxHeight="400px"
          defaultSelectedKeys={new Set(["1", "3"])}
          footer={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
              }}
            >
              <span>Showing {wideData.length} employees</span>
              <span>Scroll horizontally to see all columns →</span>
            </div>
          }
        />

        <div
          style={{
            marginTop: "16px",
            padding: "16px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}
          >
            Features Demonstrated:
          </h3>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li>Horizontal scrolling when columns exceed container width</li>
            <li>Sticky header that remains visible during horizontal scroll</li>
            <li>Column resizing with maintained scroll position</li>
            <li>Row selection maintained during scrolling</li>
            <li>Sorting functionality with horizontal scroll</li>
            <li>Custom footer that scrolls horizontally with the table</li>
          </ul>
        </div>
      </Stack>
    );
  },
};

export const AllFeatures: Story = {
  render: (args) => {
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
    const [isAdjustable, setIsAdjustable] = useState(true);
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

    const handleColumnToggle = (colId: string) => {
      setVisibleColumns((prev) =>
        prev.includes(colId)
          ? prev.filter((id) => id !== colId)
          : [...prev, colId]
      );
    };

    const selectedCount = Array.from(selectedKeys).length;
    const buttonStyle = {
      padding: "6px 12px",
      fontSize: "12px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#fff",
    };

    return (
      <Stack gap={20}>
        <div>
          <h2
            style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "600" }}
          >
            🚀 DataTable - All Features Showcase
          </h2>
          <p style={{ margin: "0 0 16px 0", color: "#666", fontSize: "16px" }}>
            Comprehensive demo showcasing all DataTable capabilities. Toggle
            features below to see how they work together.
          </p>
        </div>

        {/* Controls Section */}
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          {/* Search */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              🔍 Search & Filter
            </h4>
            <TextInput
              value={search}
              onChange={setSearch}
              placeholder="Search across all columns..."
              width="300px"
            />
          </div>

          {/* Column Visibility */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              👁️ Column Visibility
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {allColumns.map((colId) => (
                <label
                  key={colId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(colId)}
                    onChange={() => handleColumnToggle(colId)}
                    style={{ marginRight: "6px" }}
                  />
                  {colId.charAt(0).toUpperCase() + colId.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Table Settings */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              ⚙️ Table Settings
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                <input
                  type="checkbox"
                  checked={isAdjustable}
                  onChange={(e) => setIsAdjustable(e.target.checked)}
                  style={{ marginRight: "6px" }}
                />
                Resizable Columns
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
                  checked={allowsSorting}
                  onChange={(e) => setAllowsSorting(e.target.checked)}
                  style={{ marginRight: "6px" }}
                />
                Sorting
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
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "14px",
                }}
              >
                <input
                  type="checkbox"
                  checked={stickyHeader}
                  onChange={(e) => setStickyHeader(e.target.checked)}
                  style={{ marginRight: "6px" }}
                />
                Sticky Header
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
                  checked={isTruncated}
                  onChange={(e) => setIsTruncated(e.target.checked)}
                  style={{ marginRight: "6px" }}
                />
                Text Truncation
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
                  checked={density === "condensed"}
                  onChange={(e) =>
                    setDensity(e.target.checked ? "condensed" : "default")
                  }
                  style={{ marginRight: "6px" }}
                />
                Condensed Mode
              </label>
            </div>
          </div>

          {/* Selection Settings */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              ✅ Selection Settings
            </h4>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "8px",
              }}
            >
              <label style={{ fontSize: "14px" }}>Selection Mode:</label>
              <select
                value={selectionMode}
                onChange={(e) => setSelectionMode(e.target.value as any)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="none">None</option>
                <option value="single">Single</option>
                <option value="multiple">Multiple</option>
              </select>
              {selectionMode !== "none" && (
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
              )}
            </div>
            {selectionMode !== "none" && (
              <div style={{ fontSize: "14px", color: "#666" }}>
                <strong>Selected:</strong> {selectedCount} row(s) |
                <strong> IDs:</strong>{" "}
                {Array.from(selectedKeys).join(", ") || "None"}
              </div>
            )}
          </div>

          {/* Quick Actions */}
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
                disabled={selectionMode === "none"}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                  cursor: selectionMode === "none" ? "not-allowed" : "pointer",
                  opacity: selectionMode === "none" ? 0.5 : 1,
                }}
              >
                Clear Selection
              </button>
              <button
                onClick={() => setVisibleColumns(allColumns)}
                style={{
                  ...buttonStyle,
                  cursor: "pointer",
                }}
              >
                Show All Columns
              </button>
              <button
                onClick={() => setVisibleColumns(["name", "role", "status"])}
                style={{
                  ...buttonStyle,
                  cursor: "pointer",
                }}
              >
                Minimal View
              </button>
              <button
                onClick={() => setSearch("Engineer")}
                style={{
                  ...buttonStyle,
                  cursor: "pointer",
                }}
              >
                Search "Engineer"
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            overflow: "hidden",
            maxHeight: stickyHeader ? "400px" : "none",
            overflowY: stickyHeader ? "auto" : "visible",
          }}
        >
          <DataTable
            columns={comprehensiveColumns}
            data={comprehensiveData}
            visibleColumns={visibleColumns}
            search={search}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            selectionMode={selectionMode}
            disallowEmptySelection={disallowEmptySelection}
            isAdjustable={isAdjustable}
            allowsSorting={allowsSorting}
            isRowClickable={isRowClickable}
            maxHeight={stickyHeader ? "400px" : undefined}
            isTruncated={isTruncated}
            density={density}
            nestedKey="children"
            onRowClick={(row) => {
              if (isRowClickable) {
                alert(`Clicked row: ${row.name} (${row.role})`);
              }
            }}
          />
        </div>

        {/* Feature Information */}
        <div
          style={{
            padding: "16px",
            backgroundColor: "#f0f8ff",
            borderRadius: "8px",
            border: "1px solid #b3d9ff",
            fontSize: "14px",
          }}
        >
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            💡 Features Demonstrated
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "12px",
            }}
          >
            <div>
              <strong>✨ Core Features:</strong>
              <ul style={{ margin: "4px 0 0 16px", paddingLeft: 0 }}>
                <li>Column visibility management</li>
                <li>Resizable columns</li>
                <li>Search with highlighting</li>
                <li>Sorting (controlled)</li>
              </ul>
            </div>
            <div>
              <strong>🎯 Selection:</strong>
              <ul style={{ margin: "4px 0 0 16px", paddingLeft: 0 }}>
                <li>Single/Multiple selection modes</li>
                <li>Required selection option</li>
                <li>Programmatic selection control</li>
              </ul>
            </div>
            <div>
              <strong>🚀 Advanced:</strong>
              <ul style={{ margin: "4px 0 0 16px", paddingLeft: 0 }}>
                <li>Nested rows with expand/collapse</li>
                <li>Custom cell rendering (Status badges)</li>
                <li>Text truncation with hover</li>
                <li>Sticky headers</li>
                <li>Density options</li>
                <li>Clickable rows</li>
              </ul>
            </div>
          </div>
        </div>
      </Stack>
    );
  },
  args: {},
};

// Data with flexible nested children - mix of table rows and React content
const flexibleNestedData: DataTableRow[] = [
  {
    id: "user-1",
    name: "Alice Johnson",
    age: 30,
    role: "Team Lead",
    class: "senior",
    // Traditional nested table rows
    children: [
      {
        id: "user-1-project-1",
        name: "Project Alpha",
        age: 6,
        role: "Web App",
        class: "active",
      },
      {
        id: "user-1-project-2",
        name: "Project Beta",
        age: 3,
        role: "Mobile App",
        class: "planning",
      },
    ],
  },
  {
    id: "user-2",
    name: "Bob Smith",
    age: 28,
    role: "Developer",
    class: "mid-level",
    // React content as children - a detailed profile card
    children: (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          margin: "8px 0",
        }}
      >
        <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#3b82f6",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            BS
          </div>
          <div>
            <h4 style={{ margin: "0 0 4px 0", color: "#1e293b" }}>
              Bob Smith - Developer Profile
            </h4>
            <p style={{ margin: "0", color: "#64748b", fontSize: "14px" }}>
              Specializes in React, TypeScript, and Node.js development
            </p>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <div>
            <strong style={{ color: "#374151" }}>Skills:</strong>
            <div
              style={{
                marginTop: "4px",
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
              }}
            >
              {["React", "TypeScript", "Node.js", "GraphQL"].map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "2px 8px",
                    backgroundColor: "#dbeafe",
                    color: "#1e40af",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <strong style={{ color: "#374151" }}>Contact:</strong>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              📧 bob.smith@company.com
              <br />
              📱 +1 (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "user-3",
    name: "Carol Williams",
    age: 35,
    role: "Designer",
    class: "senior",
    // Interactive form as children
    children: (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fefefe",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          margin: "8px 0",
        }}
      >
        <h4 style={{ margin: "0 0 16px 0", color: "#111827" }}>
          Update Designer Settings
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Design Tool Preference:
            </label>
            <select
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor: "white",
              }}
            >
              <option>Figma</option>
              <option>Sketch</option>
              <option>Adobe XD</option>
            </select>
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Availability:
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "14px",
                }}
              >
                <input
                  type="radio"
                  name="availability"
                  value="full-time"
                  defaultChecked
                />
                Full-time
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "14px",
                }}
              >
                <input type="radio" name="availability" value="part-time" />
                Part-time
              </label>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Save Changes
          </button>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "transparent",
              color: "#6b7280",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "user-4",
    name: "David Chen",
    age: 29,
    role: "Data Analyst",
    class: "mid-level",
    // Chart/visualization as children
    children: (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          margin: "8px 0",
        }}
      >
        <h4 style={{ margin: "0 0 16px 0", color: "#111827" }}>
          Data Analytics Dashboard
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "16px",
              backgroundColor: "white",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#059669" }}
            >
              847
            </div>
            <div
              style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}
            >
              Reports Generated
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "white",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626" }}
            >
              23
            </div>
            <div
              style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}
            >
              Data Issues Found
            </div>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "white",
              borderRadius: "6px",
              border: "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}
            >
              156
            </div>
            <div
              style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}
            >
              Active Datasets
            </div>
          </div>
        </div>
        <div style={{ marginTop: "16px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "8px",
              color: "#374151",
            }}
          >
            Recent Activity:
          </div>
          <div
            style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.5" }}
          >
            • Completed quarterly sales analysis
            <br />
            • Updated customer segmentation model
            <br />
            • Fixed data pipeline for user metrics
            <br />• Created executive dashboard for Q4 review
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "user-5",
    name: "Emma Rodriguez",
    age: 26,
    role: "QA Engineer",
    class: "junior",
    // Simple text content
    children: (
      <div
        style={{
          padding: "16px",
          backgroundColor: "#fff7ed",
          border: "1px solid #fed7aa",
          borderRadius: "6px",
          margin: "8px 0",
        }}
      >
        <p style={{ margin: "0", color: "#9a3412", fontSize: "14px" }}>
          🧪 <strong>Testing Focus:</strong> Currently working on automated
          testing for the new checkout flow. Planning to implement end-to-end
          tests using Playwright and enhance unit test coverage for payment
          components.
        </p>
      </div>
    ),
  },
];

export const FlexibleNestedChildren: Story = {
  render: (args) => {
    return (
      <Stack gap={16}>
        <div>
          <h3>Flexible Nested Children</h3>
          <p>
            Demonstrates the new flexible children system where nested content
            can be either:
          </p>
          <ul style={{ marginLeft: "20px", lineHeight: "1.6" }}>
            <li>
              <strong>Table rows</strong> - Traditional nested table structure
              (Alice's projects)
            </li>
            <li>
              <strong>React components</strong> - Rich interactive content like
              profile cards, forms, charts
            </li>
            <li>
              <strong>Simple content</strong> - Text, alerts, or any other React
              elements
            </li>
          </ul>
          <p>
            Click the expand buttons to see different types of nested content.
          </p>
        </div>
        <DataTable {...args} />
      </Stack>
    );
  },
  args: {
    columns: [
      { id: "name", header: "Name", accessor: (row) => row.name },
      { id: "age", header: "Age", accessor: (row) => row.age },
      { id: "role", header: "Role", accessor: (row) => row.role },
      { id: "class", header: "Level", accessor: (row) => row.class },
    ],
    data: flexibleNestedData,
    allowsSorting: true,
    isAdjustable: true,
    maxHeight: "400px",
    nestedKey: "children",
  },
};

export const NoNestedContent: Story = {
  render: (args) => {
    return (
      <Stack gap={16}>
        <div>
          <h3>No Nested Content (Default Behavior)</h3>
          <p>
            When no <code>nestedKey</code> is provided, the component ignores
            any nested properties and only renders parent rows. This is the new
            default behavior.
          </p>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fef3c7",
              border: "1px solid #fbbf24",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            <strong>Note:</strong> The data below contains "children"
            properties, but they won't be rendered without explicitly setting{" "}
            <code>nestedKey="children"</code>.
          </div>
        </div>
        <DataTable {...args} />
      </Stack>
    );
  },
  args: {
    columns: [
      { id: "name", header: "Name", accessor: (row) => row.name },
      { id: "type", header: "Type", accessor: (row) => row.type },
      { id: "status", header: "Status", accessor: (row) => row.status },
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
    isAdjustable: true,
    // Notice: no nestedKey prop, so no nested content will be rendered
  },
};

// Data demonstrating flexible nestedKey usage
const fetchData = [
  {
    id: "galaxy-1",
    name: "Milky Way",
    type: "Spiral Galaxy",
    distance: "0 ly",
    // Using "sky" as the nested key
    sky: [
      {
        id: "star-1",
        species: "Alpha Centauri",
        genus: "Star System",
        distance: "4.37 ly",
        area: 12.5,
      },
      {
        id: "star-2",
        species: "Proxima Centauri",
        genus: "Red Dwarf",
        distance: "4.24 ly",
        area: 240,
      },
      {
        id: "star-3",
        species: "Barnard's Star",
        genus: "Red Dwarf",
        distance: "5.96 ly",
        area: 17.5,
      },
    ],
  },
  {
    id: "galaxy-2",
    name: "Andromeda",
    type: "Spiral Galaxy",
    distance: "2.537M ly",
    // Using "sky" as the nested key with React content
    sky: [
      {
        id: "star-1",
        species: "Alpha Centauri",
        genus: "Star System",
        distance: "4.37 ly",
        area: 20.45,
      },
      {
        id: "star-2",
        species: "Proxima Centauri",
        genus: "Red Dwarf",
        distance: "4.24 ly",
        area: 400.05,
      },
      {
        id: "star-3",
        species: "Barnard's Star",
        genus: "Red Dwarf",
        distance: "5.96 ly",
        area: 102.0,
      },
    ],
  },
];

const fundamentalData = [
  {
    id: "physics-1",
    name: "Quantum Mechanics",
    field: "Physics",
    complexity: "High",
    // Using "fundamental" as the nested key
    fundamental: [
      {
        id: "principle-1",
        name: "Wave-Particle Duality",
        field: "Principle",
        complexity: "Medium",
      },
      {
        id: "principle-2",
        name: "Uncertainty Principle",
        field: "Principle",
        complexity: "Medium",
      },
      {
        id: "principle-3",
        name: "Quantum Entanglement",
        field: "Phenomenon",
        complexity: "High",
      },
    ],
  },
  {
    id: "math-1",
    name: "Calculus",
    field: "Mathematics",
    complexity: "Medium",
    // Using "fundamental" as the nested key with custom content
    fundamental: (
      <div
        style={{
          padding: "16px",
          backgroundColor: "#f0f9ff",
          border: "1px solid #7dd3fc",
          borderRadius: "8px",
          margin: "8px 0",
        }}
      >
        <h4 style={{ margin: "0 0 12px 0", color: "#0c4a6e" }}>
          📐 Calculus Applications
        </h4>
        <div style={{ fontSize: "14px", lineHeight: "1.6", color: "#075985" }}>
          <strong>Differential Calculus:</strong> rates of change, slopes,
          optimization
          <br />
          <strong>Integral Calculus:</strong> areas, volumes, accumulation
          <br />
          <strong>Real-world uses:</strong> physics, engineering, economics,
          biology
        </div>
      </div>
    ),
  },
];

// Define columns for the nested table
const nestedTableColumns: DataTableColumn[] = [
  { id: "species", header: "Species", accessor: (row: any) => row.species },
  { id: "genus", header: "Genus", accessor: (row: any) => row.genus },
  { id: "distance", header: "Distance", accessor: (row: any) => row.distance },
  { id: "area", header: "Area", accessor: (row: any) => row.area },
];

// Create nested table data with proper React components
const customNestedKeyData = fetchData.map((item) => ({
  ...item,
  sky: (
    <div style={{ padding: "16px" }}>
      <h4 style={{ margin: "0 0 12px 0", color: "#374151" }}>
        {item.name} Details
      </h4>
      <DataTable
        columns={nestedTableColumns}
        data={item.sky}
        allowsSorting={true}
        isAdjustable={true}
        // No nestedKey needed for this inner table since sky data doesn't have further nesting
      />
    </div>
  ),
}));

export const TableInATable: Story = {
  render: (args) => {
    return (
      <Stack gap={16}>
        <div>
          <h3>Tables Within Tables</h3>
          <p>
            This example demonstrates nested DataTable components where each
            parent row can expand to show a complete DataTable with its own
            data, columns, and functionality.
          </p>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#eff6ff",
              border: "1px solid #93c5fd",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            <strong>Usage:</strong> Nest DataTable components as React content
            using custom nestedKey
          </div>
        </div>
        <DataTable {...args} />
      </Stack>
    );
  },
  args: {
    columns: [
      {
        id: "name",
        header: "Galaxy/Object",
        accessor: (row: any) => row.name,
      },
      { id: "type", header: "Type", accessor: (row: any) => row.type },
      {
        id: "distance",
        header: "Distance",
        accessor: (row: any) => row.distance,
      },
    ],
    data: customNestedKeyData,
    nestedKey: "sky", // Custom nested key
    allowsSorting: true,
    isAdjustable: true,
  },
};
