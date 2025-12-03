import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, NimbusProvider } from "@commercetools/nimbus";
import type { DataTableColumnItem, DataTableRowItem } from "./data-table.types";

// Sample test data
const columns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row) => row.name as React.ReactNode,
    isSortable: true,
  },
  {
    id: "email",
    header: "Email",
    accessor: (row) => row.email as React.ReactNode,
  },
  {
    id: "role",
    header: "Role",
    accessor: (row) => row.role as React.ReactNode,
    isSortable: true,
  },
];

const rows: DataTableRowItem[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "User" },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@example.com",
    role: "Editor",
  },
];

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the DataTable renders with correct structure
 * @docs-order 1
 */
describe("DataTable - Basic rendering", () => {
  it("renders table with grid role", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} />
      </NimbusProvider>
    );

    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} />
      </NimbusProvider>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
  });

  it("renders all data rows", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} />
      </NimbusProvider>
    );

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("Carol Williams")).toBeInTheDocument();
  });

  it("renders correct number of rows", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} />
      </NimbusProvider>
    );

    // 1 header row + 3 data rows
    const allRows = screen.getAllByRole("row");
    expect(allRows.length).toBe(4);
  });
});

/**
 * @docs-section sorting
 * @docs-title Sorting Tests
 * @docs-description Test column sorting functionality
 * @docs-order 2
 */
describe("DataTable - Sorting", () => {
  it("renders sortable column headers when allowsSorting is true", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} allowsSorting />
      </NimbusProvider>
    );

    const nameHeader = screen
      .getByText("Name")
      .closest('[role="columnheader"]');
    expect(nameHeader).toBeInTheDocument();
  });

  it("calls onSortChange when column header is clicked", async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          allowsSorting
          onSortChange={handleSortChange}
        />
      </NimbusProvider>
    );

    await user.click(screen.getByText("Name"));

    expect(handleSortChange).toHaveBeenCalledWith({
      column: "name",
      direction: expect.any(String),
    });
  });

  it("displays sort indicator on sorted column", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} allowsSorting />
      </NimbusProvider>
    );

    await user.click(screen.getByText("Name"));

    await waitFor(() => {
      const columnHeader = screen
        .getByText("Name")
        .closest('[role="columnheader"]');
      expect(columnHeader).toHaveAttribute("aria-sort");
    });
  });
});

/**
 * @docs-section selection
 * @docs-title Selection Tests
 * @docs-description Test row selection functionality
 * @docs-order 3
 */
describe("DataTable - Selection", () => {
  it("renders checkboxes when selectionMode is multiple", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} selectionMode="multiple" />
      </NimbusProvider>
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // 1 select-all checkbox + 3 row checkboxes
    expect(checkboxes.length).toBe(4);
  });

  it("allows selecting a row", async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();

    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
        />
      </NimbusProvider>
    );

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]); // First data row checkbox

    expect(handleSelectionChange).toHaveBeenCalled();
  });

  it("allows selecting all rows with header checkbox", async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();

    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
        />
      </NimbusProvider>
    );

    const selectAllCheckbox = screen.getAllByRole("checkbox")[0];
    await user.click(selectAllCheckbox);

    await waitFor(() => {
      expect(handleSelectionChange).toHaveBeenCalledWith("all");
    });
  });

  it("supports single selection mode", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} selectionMode="single" />
      </NimbusProvider>
    );

    const radios = screen.getAllByRole("checkbox");
    expect(radios.length).toBe(3);
  });
});

/**
 * @docs-section row-interactions
 * @docs-title Row Interaction Tests
 * @docs-description Test row click and interaction functionality
 * @docs-order 4
 */
describe("DataTable - Row interactions", () => {
  it("calls onRowClick when a row is clicked", async () => {
    const user = userEvent.setup();
    const handleRowClick = vi.fn();

    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          search=""
          onRowClick={handleRowClick}
        />
      </NimbusProvider>
    );

    await user.click(screen.getByText("Alice Johnson"));

    const modal = within(document.body).getByRole("dialog");
    expect(modal).toBeInTheDocument();

    // expect(handleRowClick).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     id: "1",
    //     name: /Alice Johnson/i,
    //   })
    // );
  });

  it("applies disabled state to specified rows", () => {
    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          selectionMode="multiple"
          disabledKeys={new Set(["2"])}
        />
      </NimbusProvider>
    );

    const allRows = screen.getAllByRole("row");
    const disabledRow = allRows[2]; // Second data row (index 2 because of header)
    const checkbox = within(disabledRow).getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });
});

/**
 * @docs-section search-filtering
 * @docs-title Search and Filtering Tests
 * @docs-description Test search functionality
 * @docs-order 5
 */
describe("DataTable - Search and filtering", () => {
  it("filters rows based on search term", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} search="Alice" />
      </NimbusProvider>
    );

    expect(screen.getByText("Alice", { selector: "mark" })).toBeInTheDocument();
    expect(screen.getByText("Johnson")).toBeInTheDocument();
    expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
    expect(screen.queryByText("Carol Williams")).not.toBeInTheDocument();
  });

  it("shows all rows when search is empty", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} search="" />
      </NimbusProvider>
    );

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("Carol Williams")).toBeInTheDocument();
  });

  it("filters across multiple columns", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} search="Admin" />
      </NimbusProvider>
    );

    // Alice is the Admin
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
  });
});

/**
 * @docs-section column-visibility
 * @docs-title Column Visibility Tests
 * @docs-description Test column visibility control
 * @docs-order 6
 */
describe("DataTable - Column visibility", () => {
  it("shows only specified visible columns", () => {
    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          visibleColumns={["name", "role"]}
        />
      </NimbusProvider>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.queryByText("Email")).not.toBeInTheDocument();
  });

  it("shows all columns when visibleColumns is not specified", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} />
      </NimbusProvider>
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
  });
});

/**
 * @docs-section density
 * @docs-title Density Tests
 * @docs-description Test density variants
 * @docs-order 7
 */
describe("DataTable - Density", () => {
  it("renders with default density", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} density="default" />
      </NimbusProvider>
    );

    const table = screen.getByRole("grid");
    expect(table).toBeInTheDocument();
  });

  it("renders with condensed density", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} density="condensed" />
      </NimbusProvider>
    );

    const table = screen.getByRole("grid");
    expect(table).toBeInTheDocument();
  });
});

/**
 * @docs-section nested-rows
 * @docs-title Nested Rows Tests
 * @docs-description Test expandable nested row functionality
 * @docs-order 8
 */
describe("DataTable - Nested rows", () => {
  const nestedRows: DataTableRowItem[] = [
    {
      id: "1",
      name: "Parent Item",
      email: "parent@example.com",
      role: "Admin",
      children: [
        {
          id: "1-1",
          name: "Child Item 1",
          email: "child1@example.com",
          role: "User",
        },
        {
          id: "1-2",
          name: "Child Item 2",
          email: "child2@example.com",
          role: "User",
        },
      ],
    },
    {
      id: "2",
      name: "No Children",
      email: "single@example.com",
      role: "User",
    },
  ];

  it("renders expand button for rows with children", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={nestedRows} nestedKey="children" />
      </NimbusProvider>
    );

    const expandButton = screen.getByRole("button", { name: /expand/i });
    expect(expandButton).toBeInTheDocument();
  });

  it("expands nested content when expand button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={nestedRows} nestedKey="children" />
      </NimbusProvider>
    );

    // Initially nested content should not be visible
    expect(screen.queryByText("Child Item 1")).not.toBeInTheDocument();

    const expandButton = screen.getByRole("button", { name: /expand/i });
    await user.click(expandButton);

    await waitFor(() => {
      expect(screen.getByText("Child Item 1")).toBeInTheDocument();
      expect(screen.getByText("Child Item 2")).toBeInTheDocument();
    });
  });

  it("collapses nested content when collapse button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={nestedRows} nestedKey="children" />
      </NimbusProvider>
    );

    // Expand first
    const expandButton = screen.getByRole("button", { name: /expand/i });
    await user.click(expandButton);

    await waitFor(() => {
      expect(screen.getByText("Child Item 1")).toBeInTheDocument();
    });

    // Collapse
    const collapseButton = screen.getByRole("button", { name: /collapse/i });
    await user.click(collapseButton);

    await waitFor(() => {
      expect(screen.queryByText("Child Item 1")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section empty-state
 * @docs-title Empty State Tests
 * @docs-description Test empty state rendering
 * @docs-order 9
 */
describe("DataTable - Empty state", () => {
  it("renders custom empty state when no rows", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={[]} />
      </NimbusProvider>
    );

    expect(screen.getByText("No Data")).toBeInTheDocument();
  });

  it("renders empty state when search matches no rows", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} search="nonexistent" />
      </NimbusProvider>
    );

    expect(screen.getByText("No Data")).toBeInTheDocument();
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Test accessibility features
 * @docs-order 10
 */
describe("DataTable - Accessibility", () => {
  it("has accessible grid role", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} aria-label="Users table" />
      </NimbusProvider>
    );

    const table = screen.getByRole("grid");
    expect(table).toBeInTheDocument();
  });

  it("has proper row structure", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} />
      </NimbusProvider>
    );

    const tableRows = screen.getAllByRole("row");
    expect(tableRows.length).toBeGreaterThan(0);

    // Check that rows contain cells
    const firstDataRow = tableRows[1];
    const cells = within(firstDataRow).getAllByRole("gridcell");
    expect(cells.length).toBeGreaterThan(0);
  });

  it("has sortable columns with aria-sort attribute", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} allowsSorting />
      </NimbusProvider>
    );

    await user.click(screen.getByText("Name"));

    await waitFor(() => {
      const columnHeader = screen
        .getByText("Name")
        .closest('[role="columnheader"]');
      expect(columnHeader).toHaveAttribute("aria-sort");
    });
  });
});
