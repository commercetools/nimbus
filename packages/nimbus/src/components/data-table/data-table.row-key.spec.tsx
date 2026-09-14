import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, NimbusProvider } from "@commercetools/nimbus";
import type { DataTableColumnItem } from "./data-table.types";

type Row = { id: string; key: string; name: string };

const columns: DataTableColumnItem<Row>[] = [
  { id: "name", header: "Name", accessor: (row) => row.name },
  { id: "key", header: "Key", accessor: (row) => row.key },
];

const renderTable = (
  rows: Row[],
  props: Partial<React.ComponentProps<typeof DataTable<Row>>> = {}
) =>
  render(
    <NimbusProvider>
      <DataTable columns={columns} rows={rows} {...props} />
    </NimbusProvider>
  );

/**
 * Domain rows frequently carry a `key` field (customer groups, categories,
 * product types, ...). React Aria derives collection keys from
 * `item.key ?? item.id`, so such rows must be re-keyed by `id`, otherwise the
 * business key leaks into selection and can collide with column ids.
 */
describe("DataTable rows with a `key` field", () => {
  it("renders when a row's key equals a column id", async () => {
    renderTable([
      { id: "a1", key: "vip", name: "VIP" },
      { id: "b2", key: "key", name: "Key group" },
    ]);
    expect(await screen.findByText("Key group")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /^key$/i })
    ).toBeInTheDocument();
  });

  it("reports row ids, not business keys, in selection changes", async () => {
    const onSelectionChange = vi.fn();
    renderTable(
      [
        { id: "a1", key: "vip", name: "VIP" },
        { id: "b2", key: "gold", name: "Gold" },
      ],
      { selectionMode: "multiple", onSelectionChange }
    );
    await screen.findByText("Gold");
    const checkboxes = screen.getAllByRole("checkbox");
    await userEvent.click(checkboxes[checkboxes.length - 1]);
    await waitFor(() => expect(onSelectionChange).toHaveBeenCalled());
    expect(Array.from(onSelectionChange.mock.calls[0][0])).toEqual(["b2"]);
  });
});
