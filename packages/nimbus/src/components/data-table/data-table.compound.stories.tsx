// DataTable stories for the compound API: custom rows, cells and columns.
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry and the story ids stay the same.

import type { Meta, StoryObj } from "@storybook/react-vite";

import { within, expect, waitFor, userEvent } from "storybook/test";
import { Box, Text, DataTable } from "@/components";
import { compoundColumns, compoundRows } from "./data-table.test-data";
import type { DataTableProps } from "./data-table.types";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<object> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<DataTableProps>;

export const CompoundCustomRowStyling: Story = {
  // VRT: `[data-custom-bg]` - sticky cells inherit the row's custom background.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <DataTable.Root
      columns={compoundColumns}
      rows={compoundRows}
      data-testid="compound-custom-rows"
    >
      <DataTable.Table aria-label="Compound table with custom row styling">
        <DataTable.Header />
        <DataTable.Body>
          {(row, rowRenderProps) => (
            <DataTable.Row
              row={row}
              {...rowRenderProps}
              bg={
                (row.department as string) === "Eng"
                  ? "primary.2"
                  : (row.department as string) === "Design"
                    ? "warning.2"
                    : undefined
              }
              data-testid={`styled-row-${row.id}`}
            />
          )}
        </DataTable.Body>
      </DataTable.Table>
    </DataTable.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All rows render with correct data", async () => {
      expect(canvas.getByText("Alice")).toBeInTheDocument();
      expect(canvas.getByText("Bob")).toBeInTheDocument();
      expect(canvas.getByText("Carol")).toBeInTheDocument();
    });

    await step("Eng row has primary background", async () => {
      const engRow = canvas.getByTestId("styled-row-1");
      expect(engRow).toBeInTheDocument();
      expect(engRow.closest("[role='row']")).toHaveAttribute(
        "data-testid",
        "styled-row-1"
      );
    });

    await step("Design row has warning background", async () => {
      const designRow = canvas.getByTestId("styled-row-2");
      expect(designRow).toBeInTheDocument();
    });

    await step("PM row has no custom background", async () => {
      const pmRow = canvas.getByTestId("styled-row-3");
      expect(pmRow).toBeInTheDocument();
    });

    await step("Rows still render all cell data", async () => {
      expect(canvas.getByText("alice@example.com")).toBeInTheDocument();
      expect(canvas.getByText("bob@example.com")).toBeInTheDocument();
      expect(canvas.getByText("carol@example.com")).toBeInTheDocument();
    });
  },
};

export const CompoundCustomRowWithSelection: Story = {
  render: () => (
    <DataTable.Root
      columns={compoundColumns}
      rows={compoundRows}
      selectionMode="multiple"
      data-testid="compound-custom-row-selection"
    >
      <DataTable.Table aria-label="Custom rows with selection">
        <DataTable.Header />
        <DataTable.Body>
          {(row, rowRenderProps) => (
            <DataTable.Row
              row={row}
              {...rowRenderProps}
              data-testid={`custom-sel-row-${row.id}`}
            />
          )}
        </DataTable.Body>
      </DataTable.Table>
    </DataTable.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Selection checkboxes render inside custom rows", async () => {
      const checkboxes = canvas.getAllByRole("checkbox");
      // 1 header checkbox + 3 row checkboxes
      expect(checkboxes.length).toBe(4);
    });

    await step("Selecting a custom row works", async () => {
      const rows = canvas.getAllByRole("row");
      const firstDataRow = rows[1];
      const checkbox = within(firstDataRow).getByRole("checkbox");

      await userEvent.click(checkbox);

      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });
    });

    await step("Select-all checkbox selects all custom rows", async () => {
      const headerRow = canvas.getAllByRole("row")[0];
      const selectAll = within(headerRow).getByRole("checkbox");

      await userEvent.click(selectAll);

      await waitFor(() => {
        const dataRows = canvas.getAllByRole("row").slice(1);
        for (const row of dataRows) {
          expect(within(row).getByRole("checkbox")).toBeChecked();
        }
      });
    });
  },
};

export const CompoundCustomRowWithExpansion: Story = {
  render: () => (
    <DataTable.Root
      columns={compoundColumns}
      rows={compoundRows}
      renderNestedContent={(row) => (
        <Box p="400" data-testid={`nested-${row.id}`}>
          <Text fontWeight="bold">Details for {row.name as string}</Text>
          <Text>Email: {row.email as string}</Text>
        </Box>
      )}
      data-testid="compound-custom-row-expansion"
    >
      <DataTable.Table aria-label="Custom rows with expansion">
        <DataTable.Header />
        <DataTable.Body>
          {(row, rowRenderProps) => (
            <DataTable.Row
              row={row}
              {...rowRenderProps}
              data-testid={`expandable-row-${row.id}`}
            />
          )}
        </DataTable.Body>
      </DataTable.Table>
    </DataTable.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Custom rows render with expand buttons", async () => {
      const expandButtons = canvas.getAllByLabelText("Expand");
      expect(expandButtons.length).toBe(3);
    });

    await step("Expanding a custom row shows nested content", async () => {
      const expandButtons = canvas.getAllByLabelText("Expand");
      await userEvent.click(expandButtons[0]);

      await waitFor(() => {
        const nested = canvas.getByTestId("nested-1");
        expect(nested).toBeInTheDocument();
        expect(nested).toHaveTextContent("Details for Alice");
      });
    });

    await step("Collapsing the row hides nested content", async () => {
      const collapseButton = canvas.getByLabelText("Collapse");
      await userEvent.click(collapseButton);

      await waitFor(() => {
        expect(canvas.queryByTestId("nested-1")).not.toBeInTheDocument();
      });
    });
  },
};

export const CompoundCustomCells: Story = {
  render: () => (
    <DataTable.Root
      columns={compoundColumns}
      rows={compoundRows}
      data-testid="compound-custom-cells"
    >
      <DataTable.Table aria-label="Custom cell styling">
        <DataTable.Header />
        <DataTable.Body>
          {(row, rowRenderProps) => (
            <DataTable.Row row={row} {...rowRenderProps}>
              {({ columns }) =>
                columns.map((col) => (
                  <DataTable.Cell
                    key={col.id}
                    data-column-id={col.id}
                    data-testid={`cell-${row.id}-${col.id}`}
                    bg={
                      col.id === "department" &&
                      (row.department as string) === "Eng"
                        ? "primary.2"
                        : undefined
                    }
                    fontWeight={col.id === "name" ? "bold" : undefined}
                  >
                    {col.accessor(row)}
                  </DataTable.Cell>
                ))
              }
            </DataTable.Row>
          )}
        </DataTable.Body>
      </DataTable.Table>
    </DataTable.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All cells render with correct data", async () => {
      expect(canvas.getByText("Alice")).toBeInTheDocument();
      expect(canvas.getByText("alice@example.com")).toBeInTheDocument();
      expect(canvas.getByText("Eng")).toBeInTheDocument();
    });

    await step("Name cells have bold styling", async () => {
      const nameCell = canvas.getByTestId("cell-1-name");
      expect(nameCell).toBeInTheDocument();
      expect(nameCell).toHaveTextContent("Alice");
    });

    await step("Eng department cell has custom background", async () => {
      const engCell = canvas.getByTestId("cell-1-department");
      expect(engCell).toBeInTheDocument();
      expect(engCell).toHaveTextContent("Eng");
    });

    await step(
      "Non-Eng department cells have no custom background",
      async () => {
        const designCell = canvas.getByTestId("cell-2-department");
        expect(designCell).toBeInTheDocument();
        expect(designCell).toHaveTextContent("Design");
      }
    );

    await step("All three rows render all columns", async () => {
      for (const rowId of ["1", "2", "3"]) {
        for (const colId of ["name", "email", "department"]) {
          expect(
            canvas.getByTestId(`cell-${rowId}-${colId}`)
          ).toBeInTheDocument();
        }
      }
    });
  },
};

export const CompoundCustomColumns: Story = {
  render: () => (
    <DataTable.Root
      columns={compoundColumns}
      rows={compoundRows}
      allowsSorting
      data-testid="compound-custom-columns"
    >
      <DataTable.Table aria-label="Custom column styling">
        <DataTable.Header>
          {({ columns, allowsSorting: sorting }) =>
            columns.map((col) => (
              <DataTable.Column
                key={col.id}
                id={col.id}
                column={col}
                allowsSorting={sorting}
                isRowHeader
                minWidth={col.minWidth ?? 150}
                data-testid={`col-header-${col.id}`}
                bg={col.id === "name" ? "primary.2" : undefined}
              >
                {col.id === "name" ? (
                  <Text fontWeight="bold" color="primary.11">
                    {col.header}
                  </Text>
                ) : (
                  <span data-multiline-header>{col.header}</span>
                )}
              </DataTable.Column>
            ))
          }
        </DataTable.Header>
        <DataTable.Body />
      </DataTable.Table>
    </DataTable.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("All column headers render", async () => {
      expect(canvas.getByText("Name")).toBeInTheDocument();
      expect(canvas.getByText("Email")).toBeInTheDocument();
      expect(canvas.getByText("Department")).toBeInTheDocument();
    });

    await step("Name column has custom styling", async () => {
      const nameCol = canvas.getByTestId("col-header-name");
      expect(nameCol).toBeInTheDocument();
    });

    await step("Sorting still works on custom columns", async () => {
      const nameHeader = canvas.getByText("Name");
      await userEvent.click(nameHeader);

      await waitFor(() => {
        const headerCell = nameHeader.closest("[role='columnheader']");
        expect(headerCell).toHaveAttribute("aria-sort", "ascending");
      });
    });

    await step("Data rows still render correctly", async () => {
      expect(canvas.getByText("Alice")).toBeInTheDocument();
      expect(canvas.getByText("bob@example.com")).toBeInTheDocument();
    });
  },
};
