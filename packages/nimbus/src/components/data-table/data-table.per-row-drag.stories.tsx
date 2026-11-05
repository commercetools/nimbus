// DataTable stories for per-row drag control (`draggableKeys`).
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ReactNode } from "react";
import { within, expect, waitFor, userEvent, fn } from "storybook/test";
import { Button, DataTable, Stack, Text } from "@/components";
import { useDragAndDrop, createArrayHandlers } from "@commercetools/nimbus";
import type {
  DataTableCellRenderProps,
  DataTableColumnItem,
  DataTableProps,
  DataTableRowItem,
} from "./data-table.types";

const meta: Meta<object> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;

type Story = StoryObj<DataTableProps>;

const wait = (ms: number = 50) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const dragColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row: Record<string, unknown>) => row.name as ReactNode,
  },
];

const makeRows = (): DataTableRowItem[] =>
  ["A", "B", "C", "D", "E"].map((id) => ({ id, name: `Row ${id}` }));

const dragButtons = (root: HTMLElement) =>
  within(root).queryAllByRole("button", { name: /drag to reorder/i });

const rowNamedExactly = (canvas: ReturnType<typeof within>, name: string) =>
  canvas.getByRole("row", { name: new RegExp(`^${name}$`) });

type PerRowDragTableProps = {
  draggableKeys?: Set<string>;
  disabledKeys?: DataTableProps["disabledKeys"];
  onRowAction: (row: DataTableRowItem) => void;
  onReorderKeys: (keys: string[], targetKey: string) => void;
  label: string;
};

const PerRowDragTable = ({
  draggableKeys,
  disabledKeys,
  onRowAction,
  onReorderKeys,
  label,
}: PerRowDragTableProps) => {
  const [tableRows, setTableRows] = useState<DataTableRowItem[]>(makeRows);
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
    <Stack gap="400">
      <DataTable
        columns={dragColumns}
        rows={tableRows}
        draggableKeys={draggableKeys}
        disabledKeys={disabledKeys}
        onRowAction={onRowAction}
        dragAndDropHooks={dragAndDropHooks}
        aria-label={label}
      />
      <Text data-testid="row-order">
        Order: {tableRows.map((r) => r.id).join(",")}
      </Text>
    </Stack>
  );
};

/**
 * One draggable row (C) among fixed rows. The fixed rows keep their place in
 * keyboard navigation, call `onRowAction`, and accept drops.
 */
export const PerRowDrag: Story = {
  render: () => {
    const onRowAction = fn().mockName("onRowAction");
    const onReorderKeys = fn().mockName("onReorderKeys");
    return (
      <PerRowDragTable
        label="Per-row drag"
        draggableKeys={new Set(["C"])}
        onRowAction={onRowAction}
        onReorderKeys={onReorderKeys}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Only the listed row renders a drag button", async () => {
      const buttons = dragButtons(canvasElement);
      expect(buttons).toHaveLength(1);
      expect(rowNamedExactly(canvas, "Row C")).toContainElement(buttons[0]);
      // The other rows keep an empty drag cell, so the column stays aligned.
      for (const id of ["A", "B", "D", "E"]) {
        const cell = rowNamedExactly(canvas, `Row ${id}`).querySelector(
          "[data-slot='drag']"
        );
        expect(cell).toBeInTheDocument();
        expect(cell!.children).toHaveLength(0);
      }
    });

    await step("ArrowDown and ArrowUp reach every row", async () => {
      const rowEls = canvas.getAllByRole("row").slice(1);
      rowEls[0].focus();
      for (let i = 1; i < rowEls.length; i++) {
        await userEvent.keyboard("{ArrowDown}");
        await waitFor(() => expect(rowEls[i]).toHaveFocus());
      }
      for (let i = rowEls.length - 2; i >= 0; i--) {
        await userEvent.keyboard("{ArrowUp}");
        await waitFor(() => expect(rowEls[i]).toHaveFocus());
      }
    });
  },
};

/**
 * Pointer and keyboard drags of the draggable row. `onReorder` receives only
 * keys from `draggableKeys`, and a fixed row is a valid drop target.
 */
export const PerRowDragReorder: Story = {
  render: () => {
    const onRowAction = fn().mockName("onRowAction");
    const onReorderKeys = fn().mockName("onReorderKeys");
    (window as unknown as Record<string, unknown>).__perRowDrag = {
      onRowAction,
      onReorderKeys,
    };
    return (
      <PerRowDragTable
        label="Per-row drag reorder"
        draggableKeys={new Set(["C"])}
        onRowAction={onRowAction}
        onReorderKeys={onReorderKeys}
      />
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const spies = (window as unknown as Record<string, unknown>)
      .__perRowDrag as {
      onRowAction: ReturnType<typeof fn>;
      onReorderKeys: ReturnType<typeof fn>;
    };

    await step("Click on a fixed row calls onRowAction once", async () => {
      await userEvent.click(
        within(rowNamedExactly(canvas, "Row B")).getByText("Row B")
      );
      await waitFor(() => expect(spies.onRowAction).toHaveBeenCalledTimes(1));
      expect(spies.onRowAction.mock.calls[0][0]).toMatchObject({ id: "B" });
    });

    await step("Enter on a fixed row calls onRowAction once", async () => {
      spies.onRowAction.mockClear();
      rowNamedExactly(canvas, "Row D").focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(spies.onRowAction).toHaveBeenCalledTimes(1));
      expect(spies.onRowAction.mock.calls[0][0]).toMatchObject({ id: "D" });
    });

    await step("Keyboard drag of row C drops after fixed row D", async () => {
      rowNamedExactly(canvas, "Row C").focus();
      await wait();
      await userEvent.keyboard("{ArrowRight}");
      await wait();
      await userEvent.keyboard("{Enter}");
      await wait();
      await userEvent.keyboard("{ArrowDown}");
      await wait();
      await userEvent.keyboard("{Enter}");

      await waitFor(() => {
        expect(canvas.getByTestId("row-order")).toHaveTextContent(
          "Order: A,B,D,C,E"
        );
      });
      expect(spies.onReorderKeys).toHaveBeenCalledTimes(1);
      expect(spies.onReorderKeys.mock.calls[0][0]).toEqual(["C"]);
    });

    await step("No drag starts from a fixed row", async () => {
      spies.onReorderKeys.mockClear();
      const row = rowNamedExactly(canvas, "Row A");
      row.focus();
      await wait();
      await userEvent.keyboard("{ArrowRight}");
      await userEvent.keyboard("{Enter}");
      await wait();
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{Enter}");
      await wait(100);
      expect(canvas.getByTestId("row-order")).toHaveTextContent(
        "Order: A,B,D,C,E"
      );
      expect(spies.onReorderKeys).not.toHaveBeenCalled();
    });
  },
};

/** `undefined` keeps every row draggable; an empty set makes none draggable. */
export const PerRowDragUndefinedAndEmpty: Story = {
  render: () => (
    <Stack gap="800">
      <div data-testid="all-rows">
        <PerRowDragTable
          label="All rows draggable"
          onRowAction={fn()}
          onReorderKeys={fn()}
        />
      </div>
      <div data-testid="no-rows">
        <PerRowDragTable
          label="No row draggable"
          draggableKeys={new Set()}
          onRowAction={fn()}
          onReorderKeys={fn()}
        />
      </div>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("undefined: every row has a drag button", async () => {
      expect(dragButtons(canvas.getByTestId("all-rows"))).toHaveLength(5);
    });

    await step("empty set: no row has a drag button", async () => {
      expect(dragButtons(canvas.getByTestId("no-rows"))).toHaveLength(0);
    });
  },
};

/** A disabled row is never draggable, even when its key is in the set. */
export const PerRowDragDisabledRow: Story = {
  render: () => (
    <PerRowDragTable
      label="Disabled row"
      draggableKeys={new Set(["B", "C"])}
      disabledKeys={new Set(["B"])}
      onRowAction={fn()}
      onReorderKeys={fn()}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("The disabled row's drag button is disabled", async () => {
      const button = within(rowNamedExactly(canvas, "Row B")).queryByRole(
        "button",
        { name: /drag to reorder/i }
      );
      const isInert =
        button === null ||
        button.hasAttribute("disabled") ||
        button.getAttribute("aria-disabled") === "true";
      expect(isInert).toBe(true);
    });

    await step("The enabled listed row stays draggable", async () => {
      const button = within(rowNamedExactly(canvas, "Row C")).getByRole(
        "button",
        { name: /drag to reorder/i }
      );
      expect(button).not.toBeDisabled();
    });
  },
};

// Render counts, read by the play function below.
const renderCounts: Record<string, number> = {};

const CountedCells = ({
  columns: cols,
  row,
}: DataTableCellRenderProps<DataTableRowItem>) => {
  renderCounts[row.id as string] = (renderCounts[row.id as string] ?? 0) + 1;
  return cols.map((col) => (
    <DataTable.Cell key={col.id}>{col.accessor(row)}</DataTable.Cell>
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

// Created once: new row objects on every render would re-render every row.
const countedRows = makeRows();

const RenderCountTable = () => {
  const [draggableKeys, setDraggableKeys] = useState(new Set(["C"]));
  const [, setRows] = useState<DataTableRowItem[]>(makeRows);
  const { dragAndDropHooks } = useDragAndDrop({
    ...createArrayHandlers(setRows, (row) => row.id),
  });

  return (
    <Stack gap="400">
      <Button onPress={() => setDraggableKeys(new Set(["C", "D"]))}>
        Make D draggable
      </Button>
      <DataTable.Root
        columns={dragColumns}
        rows={countedRows}
        draggableKeys={draggableKeys}
      >
        <DataTable.Table
          aria-label="Render counts"
          dragAndDropHooks={dragAndDropHooks}
        >
          <DataTable.Header />
          <CountedBody />
        </DataTable.Table>
      </DataTable.Root>
    </Stack>
  );
};

/** Changing `draggableKeys` re-renders only the rows whose flag changed. */
export const PerRowDragRenderOnlyChangedRows: Story = {
  render: () => <RenderCountTable />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Adding D to the set renders only row D", async () => {
      for (const id of Object.keys(renderCounts)) delete renderCounts[id];
      await userEvent.click(
        canvas.getByRole("button", { name: "Make D draggable" })
      );
      await waitFor(() => {
        expect(
          within(rowNamedExactly(canvas, "Row D")).getByRole("button", {
            name: /drag to reorder/i,
          })
        ).toBeInTheDocument();
      });
      // Only row D changed, so only row D renders.
      expect(renderCounts).toEqual({ D: expect.any(Number) });
    });
  },
};
