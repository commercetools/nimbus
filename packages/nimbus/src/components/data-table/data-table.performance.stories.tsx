// DataTable stories for render cost: which components re-render on an interaction.
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry and the story ids stay the same.

import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState, type ReactNode } from "react";
import { type Selection } from "react-aria-components";
import { within, expect, waitFor, userEvent } from "storybook/test";
import { DataTable } from "@/components";
import { useStableDataTableContext } from "./components/data-table.context";
import { columns, sortableColumns, rows } from "./data-table.test-data";
import type {
  DataTableCellRenderProps,
  DataTableRowItem,
  DataTableColumnItem,
  DataTableProps,
} from "./data-table.types";

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

// ---------------------------------------------------------------------------
// Performance regression stories
// ---------------------------------------------------------------------------

const generatePerfRows = (count: number): DataTableRowItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Product ${i + 1}`,
    category: `Category ${(i % 5) + 1}`,
  }));

const PinnedIdsProbe = () => {
  const ctx = DataTable.useDataTableContext();
  return (
    <div
      data-testid="pinned-ids-probe"
      data-pinned-row-ids={JSON.stringify(ctx.pinnedRowIds)}
    />
  );
};

const SelectionContextProbe = React.memo(function SelectionContextProbe() {
  useStableDataTableContext();
  const renderCount = React.useRef(0);
  renderCount.current++;
  return (
    <div data-testid="ctx-probe" data-render-count={renderCount.current} />
  );
});

export const PerfLargeDatasetResponsiveness: Story = {
  render: () => {
    const largeRows = React.useMemo(() => generatePerfRows(170), []);
    const renderCountsRef = React.useRef<Record<string, number>>({});

    // Instrument the Name column so each row stamps its own render count
    // onto a data attribute. The selection-toggle step asserts on these
    // counts instead of wall-clock time, which is too noisy on shared CI
    // runners to threshold reliably.
    const instrumentedColumns: DataTableColumnItem[] = React.useMemo(
      () => [
        {
          id: "name",
          header: "Name",
          accessor: (row: Record<string, unknown>) => row.name as ReactNode,
          isSortable: true,
          render: ({ row, value }) => {
            const rowId = (row as DataTableRowItem).id;
            renderCountsRef.current[rowId] =
              (renderCountsRef.current[rowId] || 0) + 1;
            return (
              <span
                data-testid={`perf-rc-${rowId}`}
                data-render-count={renderCountsRef.current[rowId]}
              >
                {value as string}
              </span>
            );
          },
        },
        {
          id: "category",
          header: "Category",
          accessor: (row: Record<string, unknown>) => row.category as ReactNode,
          isSortable: true,
        },
      ],
      []
    );

    return (
      <DataTable
        columns={instrumentedColumns}
        rows={largeRows}
        selectionMode="multiple"
        allowsSorting
      />
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Selection toggle with ~170 rows does not re-render unaffected rows",
      async () => {
        // Sample rows distributed across the dataset. If row memoization
        // regresses (e.g., a parent re-renders every row on each selection
        // change) these counts will increment when the first checkbox is
        // toggled.
        const sampleIds = ["50", "100", "150"];
        const initialCounts = sampleIds.map((id) =>
          Number(
            canvas
              .getByTestId(`perf-rc-${id}`)
              .getAttribute("data-render-count")
          )
        );

        const checkboxes = canvas.getAllByRole("checkbox");
        await userEvent.click(checkboxes[1]);

        await waitFor(() => {
          expect(checkboxes[1]).toBeChecked();
        });

        sampleIds.forEach((id, i) => {
          const afterCount = Number(
            canvas
              .getByTestId(`perf-rc-${id}`)
              .getAttribute("data-render-count")
          );
          expect(afterCount).toBe(initialCounts[i]);
        });
      }
    );

    await step("Sorting ~170 rows completes and sets aria-sort", async () => {
      // Sorting reorders rows, so a render-count assertion would not be
      // meaningful here. This step stays as a smoke test that the
      // interaction completes and the column header reflects sort state.
      const categoryHeader = canvas.getByText("Category");
      await userEvent.click(categoryHeader);

      await waitFor(() => {
        const header = categoryHeader.closest('[role="columnheader"]');
        expect(header).toHaveAttribute("aria-sort");
      });
    });
  },
};

export const PerfPinnedRowIdsComputation: Story = {
  render: () => {
    const [pinnedRows, setPinnedRows] = React.useState(new Set(["1", "3"]));

    const handlePinToggle = (rowId: string) => {
      setPinnedRows((prev) => {
        const next = new Set(prev);
        if (next.has(rowId)) {
          next.delete(rowId);
        } else {
          next.add(rowId);
        }
        return next;
      });
    };

    return (
      <DataTable.Root
        columns={sortableColumns}
        rows={rows}
        pinnedRows={pinnedRows}
        onPinToggle={handlePinToggle}
        allowsSorting
        selectionMode="multiple"
      >
        <PinnedIdsProbe />
        <DataTable.Table>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Root>
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "pinnedRowIds is pre-computed in context with correct order",
      async () => {
        const probe = canvas.getByTestId("pinned-ids-probe");
        const ids = JSON.parse(probe.getAttribute("data-pinned-row-ids")!);
        expect(ids).toEqual(["1", "3"]);
      }
    );
  },
};

export const PerfRowMemoization: Story = {
  render: () => {
    const renderCountsRef = React.useRef<Record<string, number>>({});
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    const trackedColumns: DataTableColumnItem[] = React.useMemo(
      () => [
        {
          id: "name",
          header: "Name",
          accessor: (row: Record<string, unknown>) => row.name as ReactNode,
          render: ({ row, value }) => {
            const rowId = (row as DataTableRowItem).id;
            renderCountsRef.current[rowId] =
              (renderCountsRef.current[rowId] || 0) + 1;
            return (
              <span
                data-testid={`rc-${rowId}`}
                data-render-count={renderCountsRef.current[rowId]}
              >
                {value as string}
              </span>
            );
          },
        },
        {
          id: "role",
          header: "Role",
          accessor: (row: Record<string, unknown>) => row.role as ReactNode,
        },
      ],
      []
    );

    return (
      <DataTable
        columns={trackedColumns}
        rows={rows.slice(0, 5)}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Selection toggle does not re-render unaffected rows",
      async () => {
        const row3 = canvas.getByTestId("rc-3");
        const initialCount = Number(row3.getAttribute("data-render-count"));

        const checkboxes = canvas.getAllByRole("checkbox");
        await userEvent.click(checkboxes[1]);

        await waitFor(() => {
          expect(checkboxes[1]).toBeChecked();
        });

        const afterCount = Number(
          canvas.getByTestId("rc-3").getAttribute("data-render-count")
        );
        expect(afterCount).toBe(initialCount);
      }
    );
  },
};

const stableFiveRows = rows.slice(0, 5);

export const PerfSelectionContextIsolation: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    return (
      <DataTable.Root
        columns={columns}
        rows={stableFiveRows}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <SelectionContextProbe />
        <DataTable.Table>
          <DataTable.Header />
          <DataTable.Body />
        </DataTable.Table>
      </DataTable.Root>
    );
  },
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Selection change does not re-render non-selection context consumers",
      async () => {
        const probe = canvas.getByTestId("ctx-probe");
        const initialCount = Number(probe.getAttribute("data-render-count"));
        expect(initialCount).toBe(1);

        const checkboxes = canvas.getAllByRole("checkbox");
        await userEvent.click(checkboxes[1]);

        await waitFor(() => {
          expect(checkboxes[1]).toBeChecked();
        });

        const afterCount = Number(
          canvas.getByTestId("ctx-probe").getAttribute("data-render-count")
        );
        expect(afterCount).toBe(initialCount);
      }
    );
  },
};

// Render counts for the stories below, read by their play functions.
const renderCounts: Record<string, number> = {};
const countRender = (id: string) => {
  renderCounts[id] = (renderCounts[id] ?? 0) + 1;
};
const resetRenderCounts = () => {
  for (const id of Object.keys(renderCounts)) delete renderCounts[id];
};

const countedColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row: Record<string, unknown>) => row.name as ReactNode,
  },
  {
    id: "role",
    header: "Role",
    accessor: (row: Record<string, unknown>) => row.role as ReactNode,
  },
];
const countedRows = rows.slice(0, 5);

// DataTable.Row calls its `children` on every render, so this counts the
// renders of each row. React Aria caches cells, so a column `render` function
// would not see a row render whose cells did not change. It is defined once,
// outside any component, so passing it does not itself defeat `memo`.
const CountedCells = ({
  columns: cols,
  row,
}: DataTableCellRenderProps<DataTableRowItem>) => {
  countRender(`row-${row.id}`);
  return cols.map((col) => (
    <DataTable.Cell key={col.id} data-column-id={col.id}>
      {col.accessor(row)}
    </DataTable.Cell>
  ));
};

const CountedBody = () => (
  <DataTable.Body>
    {(row, rowRenderProps) => (
      <DataTable.Row row={row} {...rowRenderProps}>
        {CountedCells}
      </DataTable.Row>
    )}
  </DataTable.Body>
);

// `React.Profiler` calls `onRender` for every commit that re-renders a
// component inside it.
const countCommit = (id: string) => countRender(id);

const renderNestedDetails = (row: DataTableRowItem) => `Details of ${row.name}`;

/**
 * Expanding or pinning a row re-renders that row and nothing else. The
 * header, the column headers and DataTable.Manager read only configuration,
 * which a row interaction does not change. The other rows receive the same
 * props as before, so `memo` skips them.
 */
export const RowInteractionsRenderOnlyThatRow: Story = {
  render: () => (
    <DataTable.Root
      columns={countedColumns}
      rows={countedRows}
      visibleColumns={["name", "role"]}
      renderNestedContent={renderNestedDetails}
    >
      <React.Profiler id="manager" onRender={countCommit}>
        <DataTable.Manager />
      </React.Profiler>
      <DataTable.Table aria-label="Render counts">
        <React.Profiler id="header" onRender={countCommit}>
          <DataTable.Header />
        </React.Profiler>
        <CountedBody />
      </DataTable.Table>
    </DataTable.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const rowOf = (name: string) =>
      canvas.getByRole("row", { name: new RegExp(name) });

    await step("Expanding a row renders only that row", async () => {
      resetRenderCounts();
      await userEvent.click(
        within(rowOf("Bob")).getByRole("button", { name: "Expand" })
      );
      await waitFor(() => {
        expect(canvas.getByText("Details of Bob")).toBeInTheDocument();
      });

      expect(renderCounts["row-2"]).toBeGreaterThan(0);
      for (const id of ["1", "3", "4", "5"]) {
        expect(renderCounts[`row-${id}`]).toBeUndefined();
      }
      expect(renderCounts.header).toBeUndefined();
      expect(renderCounts.manager).toBeUndefined();
    });

    await step("Pinning a row renders only that row", async () => {
      resetRenderCounts();
      await userEvent.click(
        within(rowOf("Carol")).getByRole("button", { name: "Pin row" })
      );
      await waitFor(() => {
        expect(
          within(rowOf("Carol")).getByRole("button", { name: "Unpin row" })
        ).toBeInTheDocument();
      });

      expect(renderCounts["row-3"]).toBeGreaterThan(0);
      for (const id of ["1", "2", "4", "5"]) {
        expect(renderCounts[`row-${id}`]).toBeUndefined();
      }
      expect(renderCounts.header).toBeUndefined();
      expect(renderCounts.manager).toBeUndefined();
    });
  },
};

const InlineArraysParent = () => {
  const [renders, setRenders] = useState(0);
  return (
    <>
      <button type="button" onClick={() => setRenders(renders + 1)}>
        Re-render parent ({renders})
      </button>
      {/* New arrays on every render, holding the same items. */}
      <DataTable.Root
        columns={[...countedColumns]}
        rows={countedRows.filter(() => true)}
        visibleColumns={["name", "role"]}
      >
        <DataTable.Table aria-label="Inline arrays">
          <DataTable.Header />
          <CountedBody />
        </DataTable.Table>
      </DataTable.Root>
    </>
  );
};

/**
 * `columns={[...]}`, `rows={data.filter(...)}` and `visibleColumns={[...]}`
 * give DataTable new arrays on every render. While they hold the same items,
 * no row re-renders.
 */
export const InlineArraysKeepRowsMemoized: Story = {
  render: () => <InlineArraysParent />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Re-rendering the parent renders no row", async () => {
      resetRenderCounts();
      await userEvent.click(
        canvas.getByRole("button", { name: /Re-render parent/ })
      );
      await waitFor(() => {
        expect(
          canvas.getByRole("button", { name: "Re-render parent (1)" })
        ).toBeInTheDocument();
      });

      for (const id of ["1", "2", "3", "4", "5"]) {
        expect(renderCounts[`row-${id}`]).toBeUndefined();
      }
    });
  },
};
