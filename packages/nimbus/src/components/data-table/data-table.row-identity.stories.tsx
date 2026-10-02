// DataTable stories for row and column identity: ids, business keys and development warnings.
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry and the story ids stay the same.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";
import { type Selection } from "react-aria-components";
import { within, expect, waitFor, userEvent, spyOn } from "storybook/test";
import { Stack, Text, DataTable } from "@/components";

import type {
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

/**
 * Domain rows frequently carry a business `key` field — customer groups,
 * categories, product types, channels and stores all do. React Aria derives
 * the collection key from `rendered.props.id ?? item.key ?? item.id`, so the
 * rendered row has to carry its `id` explicitly. Without that, the business
 * key wins: selection callbacks report it instead of the row id, and a row
 * whose `key` equals a column id collides in the collection and throws
 * "Cell count must match column count".
 */
const businessKeyColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row: Record<string, unknown>) => row.name as ReactNode,
  },
  {
    id: "key",
    header: "Key",
    accessor: (row: Record<string, unknown>) => row.key as ReactNode,
  },
];

const businessKeyRows: DataTableRowItem[] = [
  { id: "a1", key: "vip", name: "VIP" },
  { id: "b2", key: "key", name: "Key group" },
];

export const BusinessKeyRowKeyCollision: Story = {
  render: () => (
    <DataTable
      columns={businessKeyColumns}
      rows={businessKeyRows}
      aria-label="Rows carrying a business key field"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Table renders when a row's key equals a column id",
      async () => {
        expect(await canvas.findByText("Key group")).toBeInTheDocument();
        expect(canvas.getByText("VIP")).toBeInTheDocument();
      }
    );

    await step("Both columns render for every row", async () => {
      expect(
        canvas.getByRole("columnheader", { name: /name/i })
      ).toBeInTheDocument();
      expect(
        canvas.getByRole("columnheader", { name: /^key$/i })
      ).toBeInTheDocument();

      const dataRows = canvas.getAllByRole("row").slice(1);
      expect(dataRows.length).toBe(2);
      // The collision used to throw "Cell count must match column count", so
      // assert both of each row's values actually made it into the row.
      expect(within(dataRows[0]).getByText("VIP")).toBeInTheDocument();
      expect(within(dataRows[0]).getByText("vip")).toBeInTheDocument();
      expect(within(dataRows[1]).getByText("Key group")).toBeInTheDocument();
      expect(within(dataRows[1]).getByText("key")).toBeInTheDocument();
    });
  },
};

export const BusinessKeySelectionReportsRowIds: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    return (
      <Stack>
        <DataTable
          columns={businessKeyColumns}
          rows={businessKeyRows}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          aria-label="Selection keys for rows carrying a business key field"
        />
        <Text data-testid="selected-keys">
          {selectedKeys === "all"
            ? "all"
            : Array.from(selectedKeys).join(",") || "none"}
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Selecting a row reports its id, not its key", async () => {
      await canvas.findByText("Key group");
      const dataRows = canvas.getAllByRole("row").slice(1);
      const secondRowCheckbox = within(dataRows[1]).getByRole("checkbox");

      await userEvent.click(secondRowCheckbox);

      await waitFor(() => {
        expect(canvas.getByTestId("selected-keys")).toHaveTextContent("b2");
      });
    });

    await step("Every selected row reports an id, never a key", async () => {
      const dataRows = canvas.getAllByRole("row").slice(1);
      const firstRowCheckbox = within(dataRows[0]).getByRole("checkbox");

      await userEvent.click(firstRowCheckbox);

      await waitFor(() => {
        const reported = canvas
          .getByTestId("selected-keys")
          .textContent?.split(",")
          .sort();
        expect(reported).toEqual(["a1", "b2"]);
      });
      // "vip" / "key" are the rows' business keys — they must never appear.
      expect(canvas.getByTestId("selected-keys")).not.toHaveTextContent("vip");
      expect(canvas.getByTestId("selected-keys")).not.toHaveTextContent("key");
    });
  },
};

export const BusinessKeyCustomRowRenderer: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    return (
      <Stack>
        <DataTable.Root
          columns={businessKeyColumns}
          rows={businessKeyRows}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <DataTable.Table aria-label="Custom rows carrying a business key field">
            <DataTable.Header />
            <DataTable.Body>
              {(row, rowRenderProps) => (
                <DataTable.Row
                  row={row}
                  {...rowRenderProps}
                  data-testid={`business-key-row-${row.id}`}
                />
              )}
            </DataTable.Body>
          </DataTable.Table>
        </DataTable.Root>
        <Text data-testid="custom-selected-keys">
          {selectedKeys === "all"
            ? "all"
            : Array.from(selectedKeys).join(",") || "none"}
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("A custom row renderer is keyed by id too", async () => {
      expect(
        await canvas.findByTestId("business-key-row-b2")
      ).toBeInTheDocument();

      const checkbox = within(
        canvas.getByTestId("business-key-row-b2")
      ).getByRole("checkbox");

      await userEvent.click(checkbox);

      await waitFor(() => {
        expect(canvas.getByTestId("custom-selected-keys")).toHaveTextContent(
          "b2"
        );
      });
    });
  },
};

/**
 * Column definitions can carry a business `key` field too — UI Kit migrations
 * routinely produce them. React Aria derives a column's collection key the same
 * way it derives a row's, so without an explicit `id` the business key wins and
 * `onSortChange` reports it instead of the column id. Nothing then matches
 * `sortDescriptor.column === column.id`, and sorting silently stops working.
 */
const businessKeyColumnsWithKeyField = [
  {
    id: "name",
    key: "col-name",
    header: "Name",
    accessor: (row: Record<string, unknown>) => row.name as ReactNode,
    isSortable: true,
  },
  {
    id: "role",
    key: "col-role",
    header: "Role",
    accessor: (row: Record<string, unknown>) => row.role as ReactNode,
    isSortable: true,
  },
] as unknown as DataTableColumnItem[];

export const BusinessKeyColumnsReportColumnIds: Story = {
  render: () => {
    const [sortColumn, setSortColumn] = useState("none");

    return (
      <Stack>
        <DataTable
          columns={businessKeyColumnsWithKeyField}
          rows={[
            { id: "1", name: "Carol", role: "PM" },
            { id: "2", name: "Alice", role: "Eng" },
          ]}
          aria-label="Columns carrying a business key field"
          onSortChange={(descriptor) =>
            setSortColumn(String(descriptor.column))
          }
        />
        <Text data-testid="sort-column">{sortColumn}</Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Sorting reports the column id, not its key field", async () => {
      const header = await canvas.findByRole("columnheader", { name: /name/i });
      await userEvent.click(header);

      await waitFor(() => {
        // "col-name" is the column's business key — it must never surface here.
        expect(canvas.getByTestId("sort-column")).toHaveTextContent(/^name$/);
      });
    });
  },
};

/**
 * Two rows may legitimately share a business key while having distinct ids.
 * Because the collection key is now the row id, each row keeps its own React
 * identity: no duplicate-key warning, and reordering does not confuse the two.
 * Keying by the business key instead would give both rows the same React key.
 */
export const BusinessKeyDuplicateKeysStayDistinct: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    return (
      <Stack>
        <DataTable
          columns={businessKeyColumnsWithKeyField}
          rows={[
            { id: "a1", key: "dup", name: "First", role: "Alpha" },
            { id: "b2", key: "dup", name: "Second", role: "Beta" },
          ]}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          aria-label="Two rows sharing one business key"
        />
        <Text data-testid="dup-selected">
          {selectedKeys === "all"
            ? "all"
            : Array.from(selectedKeys).sort().join(",") || "none"}
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Each row keeps its own identity", async () => {
      await canvas.findByText("Second");
      const dataRows = canvas.getAllByRole("row").slice(1);
      expect(dataRows.length).toBe(2);
      expect(within(dataRows[0]).getByText("First")).toBeInTheDocument();
      expect(within(dataRows[1]).getByText("Second")).toBeInTheDocument();
    });

    await step("Selecting both reports two distinct ids", async () => {
      const dataRows = canvas.getAllByRole("row").slice(1);
      await userEvent.click(within(dataRows[0]).getByRole("checkbox"));
      await userEvent.click(within(dataRows[1]).getByRole("checkbox"));

      await waitFor(() => {
        expect(canvas.getByTestId("dup-selected")).toHaveTextContent(/^a1,b2$/);
      });
    });

    await step("Sorting does not merge the two rows", async () => {
      const header = canvas.getByRole("columnheader", { name: /name/i });
      await userEvent.click(header);

      await waitFor(() => {
        const dataRows = canvas.getAllByRole("row").slice(1);
        expect(dataRows.length).toBe(2);
        const text = dataRows.map((row) => row.textContent ?? "");
        expect(text.some((t) => t.includes("First"))).toBe(true);
        expect(text.some((t) => t.includes("Second"))).toBe(true);
      });
    });
  },
};

/**
 * `disabledKeys` holds row ids. Before rows were keyed by id, a row carrying a
 * business `key` was styled as disabled but stayed fully interactive, because
 * Nimbus checked `row.id` while React Aria matched the business key. It is now
 * genuinely disabled: not selectable, and skipped by keyboard navigation.
 */
export const BusinessKeyDisabledRowIsTrulyDisabled: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    return (
      <Stack>
        <DataTable
          columns={businessKeyColumns}
          rows={businessKeyRows}
          selectionMode="multiple"
          disabledKeys={new Set(["b2"])}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          aria-label="Disabled row carrying a business key field"
        />
        <Text data-testid="disabled-selected">
          {selectedKeys === "all"
            ? "all"
            : Array.from(selectedKeys).join(",") || "none"}
        </Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The disabled row is marked disabled", async () => {
      await canvas.findByText("Key group");
      const dataRows = canvas.getAllByRole("row").slice(1);
      expect(dataRows[1]).toHaveAttribute("data-disabled");
    });

    await step("Its checkbox cannot select it", async () => {
      const dataRows = canvas.getAllByRole("row").slice(1);
      const checkbox = within(dataRows[1]).getByRole("checkbox");
      expect(checkbox).toBeDisabled();

      await userEvent.click(checkbox, { pointerEventsCheck: 0 });

      await waitFor(() => {
        expect(canvas.getByTestId("disabled-selected")).toHaveTextContent(
          /^none$/
        );
      });
    });

    await step("The enabled row still selects normally", async () => {
      const dataRows = canvas.getAllByRole("row").slice(1);
      await userEvent.click(within(dataRows[0]).getByRole("checkbox"));

      await waitFor(() => {
        expect(canvas.getByTestId("disabled-selected")).toHaveTextContent(
          /^a1$/
        );
      });
    });
  },
};

/**
 * React Aria writes the collection key it resolved for each row and column onto
 * the DOM as `data-key`. That makes the keying contract directly observable, so
 * this story pins it without going through any callback: rows must expose their
 * `id`, and columns must expose theirs, even when both also carry a business
 * `key` field.
 */
export const BusinessKeyCollectionKeysAreIds: Story = {
  render: () => (
    <DataTable
      columns={businessKeyColumnsWithKeyField}
      rows={[
        { id: "a1", key: "vip", name: "First", role: "Alpha" },
        { id: "b2", key: "gold", name: "Second", role: "Beta" },
      ]}
      aria-label="Collection keys for rows and columns carrying key fields"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Rows expose their id as the collection key", async () => {
      await canvas.findByText("Second");
      const dataRows = canvas.getAllByRole("row").slice(1);
      // "vip" / "gold" are the rows' business keys and must never appear here.
      expect(dataRows.map((row) => row.getAttribute("data-key"))).toEqual([
        "a1",
        "b2",
      ]);
    });

    await step("Columns expose their id as the collection key", async () => {
      const keys = canvas
        .getAllByRole("columnheader")
        .map((header) => header.getAttribute("data-key"))
        .filter((key): key is string => key !== null);
      // "col-name" / "col-role" are the columns' business keys.
      expect(keys).toContain("name");
      expect(keys).toContain("role");
      expect(keys).not.toContain("col-name");
      expect(keys).not.toContain("col-role");
    });
  },
};

/**
 * A minimal two-column fixture for the row-key diagnostics below.
 */
const identityColumns: DataTableColumnItem[] = [
  {
    id: "sku",
    header: "SKU",
    accessor: (row: Record<string, unknown>) => row.sku as ReactNode,
  },
  {
    id: "name",
    header: "Name",
    accessor: (row: Record<string, unknown>) => row.name as ReactNode,
  },
];

/**
 * Records `console.warn` calls for a story and restores the original afterwards.
 * `beforeEach` returns the cleanup, so the console is restored even when an
 * assertion in `play` fails part-way.
 */
const recordWarnings = (warnings: string[]) => () => {
  const spy = spyOn(console, "warn").mockImplementation((...args) => {
    warnings.push(args.map(String).join(" "));
  });
  return () => {
    spy.mockRestore();
    warnings.length = 0;
  };
};

/**
 * A row's identity comes from its data. To identify rows by something other
 * than their database id — a SKU here — set `id` in the row data. Selection,
 * expansion and pinning then all agree on that one value, because every part
 * of the table reads identity from the same place.
 */
export const RowIdentityComesFromRowData: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    const [pinnedId, setPinnedId] = useState("none");
    const variants = [
      { databaseId: "a1", sku: "SKU-RED", name: "Red" },
      { databaseId: "b2", sku: "SKU-BLUE", name: "Blue" },
    ];

    return (
      <Stack>
        <DataTable
          columns={identityColumns}
          rows={variants.map((variant) => ({ ...variant, id: variant.sku }))}
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          allowsPinning
          onPinToggle={(rowId) => setPinnedId(rowId)}
          renderNestedContent={(row) => <Text>Details for {row.id}</Text>}
          aria-label="Rows identified by SKU"
        />
        <Text data-testid="data-id-selected">
          {selectedKeys === "all"
            ? "all"
            : Array.from(selectedKeys).join(",") || "none"}
        </Text>
        <Text data-testid="data-id-pinned">{pinnedId}</Text>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const firstRow = () => canvas.getAllByRole("row")[1];

    await step("Selection reports the id from the data", async () => {
      await canvas.findByText("Red");
      await userEvent.click(within(firstRow()).getByRole("checkbox"));

      await waitFor(() => {
        expect(canvas.getByTestId("data-id-selected")).toHaveTextContent(
          /^SKU-RED$/
        );
      });
    });

    await step("Expansion opens that same row", async () => {
      await userEvent.click(
        within(firstRow()).getByRole("button", { name: /expand/i })
      );

      expect(
        await canvas.findByText("Details for SKU-RED")
      ).toBeInTheDocument();
    });

    await step("Pinning reports the same id as selection", async () => {
      await userEvent.click(
        within(firstRow()).getByRole("button", { name: /pin row/i })
      );

      await waitFor(() => {
        expect(canvas.getByTestId("data-id-pinned")).toHaveTextContent(
          /^SKU-RED$/
        );
      });
    });
  },
};

/**
 * Setting a different `id` on `DataTable.Row` from a custom renderer is not
 * supported: React Aria would key selection by it, while expansion, pinning and
 * `disabledKeys` keep using `row.id`. The table must keep working on `row.id` —
 * a row that expands and pins, not one that silently ignores clicks — and warn
 * in development, pointing at the row data as the place to set identity.
 */
const customRowIdWarnings: string[] = [];

export const CustomRowIdOnElementWarns: Story = {
  beforeEach: recordWarnings(customRowIdWarnings),
  render: () => (
    <DataTable.Root
      columns={businessKeyColumns}
      rows={businessKeyRows}
      allowsPinning
      renderNestedContent={(row) => <Text>Details for {row.id}</Text>}
    >
      <DataTable.Table aria-label="Rows rendered with a custom element id">
        <DataTable.Header />
        <DataTable.Body>
          {(row, rowRenderProps) => (
            <DataTable.Row
              row={row}
              {...rowRenderProps}
              id={`custom-${row.id}`}
            />
          )}
        </DataTable.Body>
      </DataTable.Table>
    </DataTable.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const firstRow = () => canvas.getAllByRole("row")[1];

    await step("A development warning names both ids", async () => {
      await canvas.findByText("Key group");
      await waitFor(() => {
        expect(
          customRowIdWarnings.some(
            (w) => w.includes('"a1"') && w.includes('"custom-a1"')
          ),
          `warnings seen: ${JSON.stringify(customRowIdWarnings)}`
        ).toBe(true);
      });
    });

    await step("Expanding the row still opens it", async () => {
      await userEvent.click(
        within(firstRow()).getByRole("button", { name: /expand/i })
      );

      expect(await canvas.findByText("Details for a1")).toBeInTheDocument();
    });

    await step("Pinning the row still pins it", async () => {
      await userEvent.hover(firstRow());
      await userEvent.click(
        within(firstRow()).getByRole("button", { name: /pin row/i })
      );

      await waitFor(() => {
        expect(firstRow()).toHaveClass("data-table-row-pinned");
      });
    });
  },
};

/**
 * Rows rendered through the default body never trigger the custom-id warning:
 * the body sets the row's own id, so the two always match.
 */
const defaultRowIdWarnings: string[] = [];

export const DefaultRowIdDoesNotWarn: Story = {
  beforeEach: recordWarnings(defaultRowIdWarnings),
  render: () => (
    <DataTable
      columns={businessKeyColumns}
      rows={businessKeyRows}
      aria-label="Rows with default ids"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText("Key group");

    expect(
      defaultRowIdWarnings.filter((w) => w.includes("different id"))
    ).toEqual([]);
  },
};

/**
 * Duplicate row keys otherwise surface only as React Aria's opaque "Cell count
 * must match column count", which names neither the row nor the cause.
 * `DataTable` warns in development instead.
 */
const duplicateKeyWarnings: string[] = [];

export const DuplicateRowKeysWarnInDevelopment: Story = {
  beforeEach: recordWarnings(duplicateKeyWarnings),
  render: () => (
    <DataTable
      columns={identityColumns}
      rows={[
        { id: "SAME", sku: "A", name: "First" },
        { id: "SAME", sku: "B", name: "Second" },
      ]}
      aria-label="Rows with duplicate ids"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The table still renders", async () => {
      expect(await canvas.findByText("Second")).toBeInTheDocument();
    });

    await step("A development warning names the duplicate", async () => {
      await waitFor(() => {
        expect(
          duplicateKeyWarnings.some(
            (w) => w.includes("SAME") && w.includes("unique")
          ),
          `warnings seen: ${JSON.stringify(duplicateKeyWarnings)}`
        ).toBe(true);
      });
    });
  },
};
