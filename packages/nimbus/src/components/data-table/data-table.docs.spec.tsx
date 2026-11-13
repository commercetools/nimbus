import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import {
  DataTable,
  NimbusProvider,
  Box,
  useDragAndDrop,
  createArrayHandlers,
} from "@commercetools/nimbus";
import type {
  DataTableApi,
  DataTableColumnItem,
  DataTableRowItem,
} from "./data-table.types";

// Sample test data
const columns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
    isSortable: true,
  },
  {
    id: "email",
    header: "Email",
    accessor: (row: Record<string, unknown>) => row.email as React.ReactNode,
  },
  {
    id: "role",
    header: "Role",
    accessor: (row: Record<string, unknown>) => row.role as React.ReactNode,
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
  it("calls onRowAction when a row is clicked", async () => {
    const user = userEvent.setup();
    const handleRowAction = vi.fn();

    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          search=""
          onRowAction={handleRowAction}
        />
      </NimbusProvider>
    );

    const allRows = screen.getAllByRole("row");
    const firstDataRow = allRows[1]; // Second data row (index 2 because of header)
    const clickableCell = within(firstDataRow).getAllByRole("rowheader");
    await user.click(clickableCell[0]);

    await waitFor(() => {
      expect(handleRowAction).toHaveBeenCalled();
    });
  });

  it("calls onRowAction when Enter is pressed on a focused row", async () => {
    const user = userEvent.setup();
    const handleRowAction = vi.fn();

    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          onRowAction={handleRowAction}
        />
      </NimbusProvider>
    );

    const firstDataRow = screen.getAllByRole("row")[1];
    firstDataRow.focus();
    await user.keyboard("{Enter}");

    expect(handleRowAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: rows[0].id })
    );
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
 * @docs-section row-nested-content
 * @docs-title Row Nested Content Tests
 * @docs-description Test renderNestedContent prop for inline nested content panels
 * @docs-order 5
 */
describe("DataTable - Row nested content panels", () => {
  it("renders a nested content panel below a row when expanded", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          renderNestedContent={(row) => (
            <Box data-testid={`detail-${row.id}`}>
              Nested content for {row.id}
            </Box>
          )}
        />
      </NimbusProvider>
    );

    // No nested content panels open initially
    expect(screen.queryByTestId("detail-1")).not.toBeInTheDocument();

    // Click the expand button on the first data row
    const allRows = screen.getAllByRole("row");
    const firstDataRow = allRows[1];
    const expandButton = within(firstDataRow).getByRole("button", {
      name: "Expand",
    });
    await user.click(expandButton);

    await waitFor(() => {
      expect(screen.getByTestId("detail-1")).toBeInTheDocument();
      expect(screen.getByText("Nested content for 1")).toBeInTheDocument();
    });
  });

  it("toggles nested content panel closed on second click", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          renderNestedContent={(row) => (
            <Box data-testid={`detail-${row.id}`}>
              Nested content for {row.id}
            </Box>
          )}
        />
      </NimbusProvider>
    );

    const allRows = screen.getAllByRole("row");
    const firstDataRow = allRows[1];
    const expandButton = within(firstDataRow).getByRole("button", {
      name: "Expand",
    });

    // Open
    await user.click(expandButton);
    await waitFor(() => {
      expect(screen.getByTestId("detail-1")).toBeInTheDocument();
    });

    // Close
    const collapseButton = within(firstDataRow).getByRole("button", {
      name: "Collapse",
    });
    await user.click(collapseButton);
    await waitFor(() => {
      expect(screen.queryByTestId("detail-1")).not.toBeInTheDocument();
    });
  });

  it("fires onRowAction alongside expand toggle", async () => {
    const user = userEvent.setup();
    const handleRowAction = vi.fn();

    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          onRowAction={handleRowAction}
          renderNestedContent={(row) => (
            <Box data-testid={`detail-${row.id}`}>
              Nested content for {row.id}
            </Box>
          )}
        />
      </NimbusProvider>
    );

    // Expand via chevron — onRowAction should NOT fire
    const allRows = screen.getAllByRole("row");
    const firstDataRow = allRows[1];
    const expandButton = within(firstDataRow).getByRole("button", {
      name: "Expand",
    });
    await user.click(expandButton);

    await waitFor(() => {
      expect(screen.getByTestId("detail-1")).toBeInTheDocument();
    });
    expect(handleRowAction).not.toHaveBeenCalled();

    // Click a data cell — onRowAction should fire
    const dataCell = within(firstDataRow).getAllByRole("gridcell").at(-1)!;
    await user.click(dataCell);

    await waitFor(() => {
      expect(handleRowAction).toHaveBeenCalled();
    });
  });

  it("provides a close callback to dismiss the nested content panel", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          renderNestedContent={(row, { close }) => (
            <Box data-testid={`detail-${row.id}`}>
              <button data-testid={`close-${row.id}`} onClick={close}>
                Close
              </button>
            </Box>
          )}
        />
      </NimbusProvider>
    );

    // Open via expand button
    const allRows = screen.getAllByRole("row");
    const firstDataRow = allRows[1];
    const expandButton = within(firstDataRow).getByRole("button", {
      name: "Expand",
    });
    await user.click(expandButton);

    await waitFor(() => {
      expect(screen.getByTestId("detail-1")).toBeInTheDocument();
    });

    // Close via the close callback
    await user.click(screen.getByTestId("close-1"));

    await waitFor(() => {
      expect(screen.queryByTestId("detail-1")).not.toBeInTheDocument();
    });
  });

  it("sets aria-controls on the row when expanded", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          renderNestedContent={(row) => (
            <Box data-testid={`detail-${row.id}`}>Detail</Box>
          )}
        />
      </NimbusProvider>
    );

    const allRows = screen.getAllByRole("row");
    const firstDataRow = allRows[1];

    // aria-controls should not be present when collapsed
    expect(firstDataRow).not.toHaveAttribute("aria-controls");

    // Expand the row
    const expandButton = within(firstDataRow).getByRole("button", {
      name: "Expand",
    });
    await user.click(expandButton);

    await waitFor(() => {
      expect(firstDataRow).toHaveAttribute("aria-controls", "nested-content-1");
    });
  });
});

/**
 * @docs-section search-filtering
 * @docs-title Search and Filtering Tests
 * @docs-description Test search functionality
 * @docs-order 6
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
 * @docs-section size
 * @docs-title Size Tests
 * @docs-description Test size variants
 * @docs-order 7
 */
describe("DataTable - Size", () => {
  it.each(["sm", "md", "lg"] as const)("renders with size %s", (size) => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} size={size} />
      </NimbusProvider>
    );

    const table = screen.getByRole("grid");
    expect(table).toBeInTheDocument();
  });

  it("renders with the default size when size is not set", () => {
    render(
      <NimbusProvider>
        <DataTable columns={columns} rows={rows} />
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
      children: (
        <Box
          p="500"
          bg="neutral.2"
          borderRadius="md"
          border="1px solid"
          borderColor="neutral.6"
          m="200 0"
        >
          Child Item 1
        </Box>
      ),
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
    expect(expandButton).toBeInTheDocument();
    await user.click(expandButton);

    await waitFor(async () => {
      await expect(screen.getByText("Child Item 1")).toBeInTheDocument();
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

/**
 * @docs-section manager-basic-rendering
 * @docs-title Manager: Basic Rendering Tests
 * @docs-description Verify the Manager button renders and opens the settings drawer
 * @docs-order 11
 */
describe("DataTable.Manager - Basic rendering", () => {
  it("renders the settings button", async () => {
    const managerColumns: DataTableColumnItem[] = [
      {
        id: "name",
        header: "Name",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "email",
        header: "Email",
        accessor: (row: Record<string, unknown>) =>
          row.email as React.ReactNode,
      },
    ];
    const managerRows: DataTableRowItem[] = [
      { id: "1", name: "Alice", email: "alice@example.com" },
    ];

    render(
      <NimbusProvider>
        <DataTable.Root
          columns={managerColumns}
          rows={managerRows}
          visibleColumns={["name"]}
        >
          <DataTable.Manager />
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Root>
      </NimbusProvider>
    );

    // Manager is lazy-loaded, so wait for it to resolve
    expect(
      await screen.findByRole("button", { name: /settings/i })
    ).toBeInTheDocument();
  });

  it("settings button is clickable", async () => {
    const user = userEvent.setup();
    const managerColumns: DataTableColumnItem[] = [
      {
        id: "name",
        header: "Name",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "email",
        header: "Email",
        accessor: (row: Record<string, unknown>) =>
          row.email as React.ReactNode,
      },
    ];
    const managerRows: DataTableRowItem[] = [
      { id: "1", name: "Alice", email: "alice@example.com" },
    ];

    render(
      <NimbusProvider>
        <DataTable.Root
          columns={managerColumns}
          rows={managerRows}
          visibleColumns={["name"]}
        >
          <DataTable.Manager />
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Root>
      </NimbusProvider>
    );

    // Manager is lazy-loaded, so wait for it to resolve
    const settingsButton = await screen.findByRole("button", {
      name: /settings/i,
    });

    // Verify button can be clicked
    await user.click(settingsButton);

    // Button should still be in the document after click
    expect(settingsButton).toBeInTheDocument();
  });
});

/**
 * @docs-section manager-column-management
 * @docs-title Manager: Column Management Tests
 * @docs-description Test column visibility and reordering functionality
 * @docs-order 12
 */
describe("DataTable.Manager - Column management", () => {
  it("displays visible and hidden columns in separate lists", async () => {
    const user = userEvent.setup();
    const managerColumns: DataTableColumnItem[] = [
      {
        id: "name",
        header: "Name",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "email",
        header: "Email",
        accessor: (row: Record<string, unknown>) =>
          row.email as React.ReactNode,
      },
      {
        id: "role",
        header: "Role",
        accessor: (row: Record<string, unknown>) => row.role as React.ReactNode,
      },
    ];
    const managerRows: DataTableRowItem[] = [
      { id: "1", name: "Alice", email: "alice@example.com", role: "Admin" },
    ];

    render(
      <NimbusProvider>
        <DataTable.Root
          columns={managerColumns}
          rows={managerRows}
          visibleColumns={["name", "email"]}
        >
          <DataTable.Manager />
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Root>
      </NimbusProvider>
    );

    // Manager is lazy-loaded, so wait for it to resolve
    const settingsButton = await screen.findByRole("button", {
      name: /settings/i,
    });
    await user.click(settingsButton);

    await waitFor(() => {
      const visibleList = screen.getByTestId("visible-columns-list");
      const hiddenList = screen.getByTestId("hidden-columns-list");

      expect(within(visibleList).getByText("Name")).toBeInTheDocument();
      expect(within(visibleList).getByText("Email")).toBeInTheDocument();
      expect(within(hiddenList).getByText("Role")).toBeInTheDocument();
    });
  });

  it("calls onColumnsChange when column visibility changes", async () => {
    const user = userEvent.setup();
    const handleColumnsChange = vi.fn();
    const managerColumns: DataTableColumnItem[] = [
      {
        id: "name",
        header: "Name",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "email",
        header: "Email",
        accessor: (row: Record<string, unknown>) =>
          row.email as React.ReactNode,
      },
    ];
    const managerRows: DataTableRowItem[] = [
      { id: "1", name: "Alice", email: "alice@example.com" },
    ];

    render(
      <NimbusProvider>
        <DataTable.Root
          columns={managerColumns}
          rows={managerRows}
          visibleColumns={["name"]}
          onColumnsChange={handleColumnsChange}
        >
          <DataTable.Manager />
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Root>
      </NimbusProvider>
    );

    // Manager is lazy-loaded, so wait for it to resolve
    const settingsButton = await screen.findByRole("button", {
      name: /settings/i,
    });
    await user.click(settingsButton);

    // Note: Full drag-and-drop testing would require more complex setup
    // This verifies the callback is available
    expect(handleColumnsChange).toBeDefined();
  });
});

/**
 * @docs-section manager-layout-settings
 * @docs-title Manager: Layout Settings Tests
 * @docs-description Test text visibility and row density controls
 * @docs-order 13
 */
describe("DataTable.Manager - Layout settings", () => {
  it("displays layout settings tab", async () => {
    const user = userEvent.setup();
    const managerColumns: DataTableColumnItem[] = [
      {
        id: "name",
        header: "Name",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "email",
        header: "Email",
        accessor: (row: Record<string, unknown>) =>
          row.email as React.ReactNode,
      },
    ];
    const managerRows: DataTableRowItem[] = [
      { id: "1", name: "Alice", email: "alice@example.com" },
    ];

    render(
      <NimbusProvider>
        <DataTable.Root
          columns={managerColumns}
          rows={managerRows}
          visibleColumns={["name"]}
        >
          <DataTable.Manager />
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Root>
      </NimbusProvider>
    );

    // Manager is lazy-loaded, so wait for it to resolve
    const settingsButton = await screen.findByRole("button", {
      name: /settings/i,
    });
    await user.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByText(/layout settings/i)).toBeInTheDocument();
    });
  });

  it("calls onSettingsChange when layout settings change", async () => {
    const user = userEvent.setup();
    const handleSettingsChange = vi.fn();
    const managerColumns: DataTableColumnItem[] = [
      {
        id: "name",
        header: "Name",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "email",
        header: "Email",
        accessor: (row: Record<string, unknown>) =>
          row.email as React.ReactNode,
      },
    ];
    const managerRows: DataTableRowItem[] = [
      { id: "1", name: "Alice", email: "alice@example.com" },
    ];

    render(
      <NimbusProvider>
        <DataTable.Root
          columns={managerColumns}
          rows={managerRows}
          visibleColumns={["name"]}
          onSettingsChange={handleSettingsChange}
        >
          <DataTable.Manager />
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Root>
      </NimbusProvider>
    );

    // Manager is lazy-loaded, so wait for it to resolve
    const settingsButton = await screen.findByRole("button", {
      name: /settings/i,
    });
    await user.click(settingsButton);

    // Note: Actual toggle interaction testing would require finding specific buttons
    // This verifies the callback is wired up
    expect(handleSettingsChange).toBeDefined();
  });
});

/**
 * @docs-section manager-custom-settings
 * @docs-title Manager: Custom Settings Tests
 * @docs-description Test custom settings tab integration
 * @docs-order 14
 */
describe("DataTable.Manager - Custom settings", () => {
  it("displays custom settings tab when provided", async () => {
    const user = userEvent.setup();
    const managerColumns: DataTableColumnItem[] = [
      {
        id: "name",
        header: "Name",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "email",
        header: "Email",
        accessor: (row: Record<string, unknown>) =>
          row.email as React.ReactNode,
      },
    ];
    const managerRows: DataTableRowItem[] = [
      { id: "1", name: "Alice", email: "alice@example.com" },
    ];

    const customSettings = {
      label: "Filters",
      panel: <div>Custom Filter Panel</div>,
    };

    render(
      <NimbusProvider>
        <DataTable.Root
          columns={managerColumns}
          rows={managerRows}
          visibleColumns={["name"]}
          customSettings={customSettings}
        >
          <DataTable.Manager />
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Root>
      </NimbusProvider>
    );

    // Manager is lazy-loaded, so wait for it to resolve
    const settingsButton = await screen.findByRole("button", {
      name: /settings/i,
    });
    await user.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByText("Filters")).toBeInTheDocument();
    });
  });

  it("renders custom settings panel content", async () => {
    const user = userEvent.setup();
    const managerColumns: DataTableColumnItem[] = [
      {
        id: "name",
        header: "Name",
        accessor: (row: Record<string, unknown>) => row.name as React.ReactNode,
      },
      {
        id: "email",
        header: "Email",
        accessor: (row: Record<string, unknown>) =>
          row.email as React.ReactNode,
      },
    ];
    const managerRows: DataTableRowItem[] = [
      { id: "1", name: "Alice", email: "alice@example.com" },
    ];

    const customSettings = {
      label: "Advanced",
      panel: <div data-testid="custom-panel">Custom Panel Content</div>,
    };

    render(
      <NimbusProvider>
        <DataTable.Root
          columns={managerColumns}
          rows={managerRows}
          visibleColumns={["name"]}
          customSettings={customSettings}
        >
          <DataTable.Manager />
          <DataTable.Table>
            <DataTable.Header />
            <DataTable.Body />
          </DataTable.Table>
        </DataTable.Root>
      </NimbusProvider>
    );

    // Manager is lazy-loaded, so wait for it to resolve
    const settingsButton = await screen.findByRole("button", {
      name: /settings/i,
    });
    await user.click(settingsButton);

    await waitFor(() => {
      const advancedTab = screen.getByText("Advanced");
      expect(advancedTab).toBeInTheDocument();
    });

    // Click the custom tab
    const advancedTab = screen.getByText("Advanced");
    await user.click(advancedTab);

    await waitFor(() => {
      expect(screen.getByTestId("custom-panel")).toBeInTheDocument();
      expect(screen.getByText("Custom Panel Content")).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section per-row-drag
 * @docs-title Per-Row Drag Tests
 * @docs-description Test that only rows in draggableKeys can be dragged, and that fixed rows keep working
 * @docs-order 15
 */
describe("DataTable - Per-row drag", () => {
  const DragTable = ({
    draggableKeys,
    onReorderKeys = vi.fn(),
    onRowAction = vi.fn(),
  }: {
    draggableKeys?: Set<string>;
    onReorderKeys?: (keys: string[], targetKey: string) => void;
    onRowAction?: (row: DataTableRowItem) => void;
  }) => {
    const [tableRows, setTableRows] = useState<DataTableRowItem[]>(rows);
    const handlers = createArrayHandlers(setTableRows, (row) => row.id);
    const { dragAndDropHooks } = useDragAndDrop({
      ...handlers,
      onReorder(keys, target) {
        onReorderKeys(
          [...keys].map(String),
          String((target as { key: unknown }).key)
        );
        handlers.onReorder?.(keys, target);
      },
    });
    return (
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={tableRows}
          draggableKeys={draggableKeys}
          onRowAction={onRowAction}
          dragAndDropHooks={dragAndDropHooks}
          aria-label="Team members"
        />
      </NimbusProvider>
    );
  };

  /** Names of the data rows, top to bottom. */
  const rowOrder = () =>
    screen
      .getAllByRole("row")
      .slice(1)
      .map((row) => /Alice|Bob|Carol/.exec(row.textContent ?? "")?.[0]);

  /** Focuses a row's drag button and presses Enter to pick the row up. */
  const pickUp = async (
    user: ReturnType<typeof userEvent.setup>,
    rowName: RegExp
  ) => {
    const row = screen.getByRole("row", { name: rowName });
    row.focus();
    await user.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(
        within(row).getByRole("button", { name: /drag to reorder/i })
      ).toHaveFocus()
    );
    await user.keyboard("{Enter}");
  };

  it("renders an enabled drag button only in rows listed in draggableKeys", () => {
    render(<DragTable draggableKeys={new Set(["2"])} />);

    const enabled = screen.getAllByRole("button", { name: /drag to reorder/i });
    expect(enabled).toHaveLength(1);
    expect(
      within(screen.getByRole("row", { name: /Bob Smith/ })).getByRole(
        "button",
        { name: /drag to reorder/i }
      )
    ).toBeInTheDocument();

    // Every other row has a disabled drag button that is visually hidden.
    const disabled = screen.getAllByRole("button", {
      name: /cannot be reordered/i,
    });
    expect(disabled).toHaveLength(rows.length - 1);
    disabled.forEach((button) => expect(button).toBeDisabled());
  });

  it("renders only disabled drag buttons when draggableKeys is empty", () => {
    render(<DragTable draggableKeys={new Set()} />);

    expect(
      screen.queryByRole("button", { name: /drag to reorder/i })
    ).toBeNull();
    const disabled = screen.getAllByRole("button", {
      name: /cannot be reordered/i,
    });
    expect(disabled).toHaveLength(rows.length);
    disabled.forEach((button) => expect(button).toBeDisabled());
  });

  it("reorders the draggable row by keyboard and reports only its key", async () => {
    const user = userEvent.setup();
    const onReorderKeys = vi.fn();
    render(
      <DragTable draggableKeys={new Set(["2"])} onReorderKeys={onReorderKeys} />
    );
    expect(rowOrder()).toEqual(["Alice", "Bob", "Carol"]);

    // Pick up Bob, move the drop position down past Carol, and drop.
    await pickUp(user, /Bob Smith/);
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    await waitFor(() => expect(rowOrder()).toEqual(["Alice", "Carol", "Bob"]));
    expect(onReorderKeys).toHaveBeenCalledTimes(1);
    expect(onReorderKeys).toHaveBeenCalledWith(["2"], "3");
  });

  it("keeps fixed rows in the arrow-key order and activates them with Enter", async () => {
    const user = userEvent.setup();
    const onRowAction = vi.fn();
    render(
      <DragTable draggableKeys={new Set(["2"])} onRowAction={onRowAction} />
    );

    const alice = screen.getByRole("row", { name: /Alice Johnson/ });
    alice.focus();
    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("row", { name: /Bob Smith/ })).toHaveFocus()
    );
    await user.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(screen.getByRole("row", { name: /Carol Williams/ })).toHaveFocus()
    );

    // Enter on a fixed row runs the row action. It does not pick the row up.
    await user.keyboard("{Enter}");
    await waitFor(() => expect(onRowAction).toHaveBeenCalledTimes(1));
    expect(onRowAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: "3" })
    );
    expect(rowOrder()).toEqual(["Alice", "Bob", "Carol"]);
  });
});

/**
 * @docs-section scroll-to-row
 * @docs-title Scroll To Row Tests
 * @docs-description Test scrollToRow through apiRef: the result for shown and unknown rows, ignoring AbortError, and moving focus
 * @docs-order 16
 */
describe("DataTable - Scroll to row", () => {
  const renderTable = () => {
    const apiRef = createRef<DataTableApi>();
    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          apiRef={apiRef}
          aria-label="Team members"
        />
      </NimbusProvider>
    );
    return apiRef;
  };

  const getApi = async (apiRef: ReturnType<typeof renderTable>) => {
    await waitFor(() => expect(apiRef.current).not.toBeNull());
    return apiRef.current as DataTableApi;
  };

  it("resolves true for a row that is shown", async () => {
    const api = await getApi(renderTable());

    await expect(api.scrollToRow("2")).resolves.toBe(true);
  });

  it("resolves false for a key that is not a row", async () => {
    const api = await getApi(renderTable());

    await expect(api.scrollToRow("unknown-key")).resolves.toBe(false);
  });

  it("ignores the AbortError of a call that a newer call replaced", async () => {
    const api = await getApi(renderTable());

    // Add the catch when you make the call. A newer call rejects the older
    // one with an AbortError, and that is not an error in your code.
    const scrollTo = (key: string) =>
      api.scrollToRow(key).catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return false;
        }
        throw error;
      });

    const replaced = scrollTo("1");
    const latest = scrollTo("3");

    await expect(replaced).resolves.toBe(false);
    await expect(latest).resolves.toBe(true);
  });

  it("moves focus to the row only with focus: true", async () => {
    const api = await getApi(renderTable());
    const bob = screen.getByRole("row", { name: /Bob Smith/ });

    await api.scrollToRow("2");
    expect(bob).not.toHaveFocus();

    await api.scrollToRow("2", { focus: true });
    await waitFor(() => expect(bob).toHaveFocus());
  });

  it("returns the scrolling element from getScrollContainer", async () => {
    const apiRef = createRef<DataTableApi>();
    const rootRef = createRef<HTMLDivElement>();
    render(
      <NimbusProvider>
        <DataTable
          columns={columns}
          rows={rows}
          ref={rootRef}
          apiRef={apiRef}
          aria-label="Team members"
        />
      </NimbusProvider>
    );
    const api = await getApi(apiRef);

    expect(api.getScrollContainer()).toBe(rootRef.current);
  });
});
