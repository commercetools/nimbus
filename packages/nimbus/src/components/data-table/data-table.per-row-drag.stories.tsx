// DataTable stories for per-row drag control (`draggableKeys`).
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useDragAndDrop as useReactAriaDragAndDrop } from "react-aria-components";
import { within, expect, waitFor, userEvent, fn, mocked } from "storybook/test";
import { Button, DataTable, Flex, Select, Stack, Text } from "@/components";
import { useDragAndDrop, createArrayHandlers } from "@commercetools/nimbus";
import type {
  DataTableCellRenderProps,
  DataTableColumnItem,
  DataTableProps,
  DataTableRowItem,
  DataTableSize,
} from "./data-table.types";
import { recordWarnings } from "./utils/data-table.test-utils";

const meta: Meta<object> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;

type Story = StoryObj<DataTableProps>;

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

const isDragging = (root: HTMLElement) =>
  root.querySelector("[data-dragging='true']") !== null;

/** Focuses the row's drag button with the keyboard and starts a keyboard drag. */
const startKeyboardDrag = async (root: HTMLElement, row: HTMLElement) => {
  row.focus();
  const handle = within(row).getByRole("button", { name: /drag to reorder/i });
  // React Aria reads its focus state when the key arrives, so a key sent right
  // after `focus()` can be lost. Send ArrowRight again until the handle has
  // focus, and only while the row still has it.
  await waitFor(async () => {
    if (document.activeElement === row)
      await userEvent.keyboard("{ArrowRight}");
    expect(handle).toHaveFocus();
  });
  await userEvent.keyboard("{Enter}");
  await waitFor(() => expect(isDragging(root)).toBe(true));
};

/** Presses a key and waits until focus moves to the next drop target. */
const moveDropTarget = async (key: string) => {
  const before = document.activeElement;
  await userEvent.keyboard(key);
  await waitFor(() => expect(document.activeElement).not.toBe(before));
};

/**
 * The minimal `DataTransfer` that React Aria's drag source and drop target
 * read. Chromium does not let a script build a real one (see the ListBox
 * stories), and a play cannot start a native drag with the pointer.
 */
const createDataTransfer = () => {
  const data = new Map<string, string>();
  return {
    effectAllowed: "all",
    dropEffect: "none",
    files: [] as File[],
    get types() {
      return [...data.keys()];
    },
    get items() {
      const items = [...data.keys()].map((type) => ({ kind: "string", type }));
      return Object.assign(items, {
        add: (value: string, type: string) => void data.set(type, value),
      });
    },
    setData: (type: string, value: string) => void data.set(type, value),
    getData: (type: string) => data.get(type) ?? "",
    setDragImage: () => {},
  };
};

/** Dispatches a native drag event at the vertical position inside `el`. */
const dispatchDrag = (
  el: Element,
  type: "dragstart" | "dragenter" | "dragover" | "drop" | "dragend",
  dataTransfer: ReturnType<typeof createDataTransfer>,
  fraction = 0.5
) => {
  const rect = el.getBoundingClientRect();
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
  Object.defineProperty(event, "clientX", {
    value: rect.left + rect.width / 2,
  });
  Object.defineProperty(event, "clientY", {
    value: rect.top + rect.height * fraction,
  });
  el.dispatchEvent(event);
};

/**
 * A pointer drag from `source` onto the `fraction` (0 top, 1 bottom) of
 * `target`, with mocked native drag events.
 */
const pointerDrag = async (
  root: HTMLElement,
  source: HTMLElement,
  target: HTMLElement,
  fraction: number
) => {
  const dataTransfer = createDataTransfer();
  dispatchDrag(source, "dragstart", dataTransfer);
  await waitFor(() => expect(isDragging(root)).toBe(true));
  dispatchDrag(target, "dragenter", dataTransfer, fraction);
  dispatchDrag(target, "dragover", dataTransfer, fraction);
  await waitFor(() =>
    expect(root.querySelector("[data-drop-target]")).not.toBeNull()
  );
  dispatchDrag(target, "drop", dataTransfer, fraction);
  dispatchDrag(source, "dragend", dataTransfer);
  await waitFor(() => expect(isDragging(root)).toBe(false));
};

type PerRowDragTableProps = {
  draggableKeys?: Set<string>;
  disabledKeys?: DataTableProps["disabledKeys"];
  onRowAction: (row: DataTableRowItem) => void;
  onReorderKeys: (keys: string[], targetKey: string) => void;
  label: string;
  size?: DataTableSize;
  /** Initial rows. Defaults to rows A to E. */
  initialRows?: DataTableRowItem[];
};

type TableStory = StoryObj<PerRowDragTableProps>;

const PerRowDragTable = ({
  draggableKeys,
  disabledKeys,
  onRowAction,
  onReorderKeys,
  label,
  size = "md",
  initialRows,
}: PerRowDragTableProps) => {
  const [tableRows, setTableRows] = useState<DataTableRowItem[]>(
    () => initialRows ?? makeRows()
  );
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
        size={size}
      />
      <Text data-testid="row-order">
        Order: {tableRows.map((r) => r.id).join(",")}
      </Text>
    </Stack>
  );
};

// Sizes the selector offers. `xl` is the deprecated default, so it is left out,
// as in the `size` argType of data-table.stories.tsx.
const SIZE_OPTIONS: { id: Exclude<DataTableSize, "xl">; label: string }[] = [
  { id: "sm", label: "Small" },
  { id: "md", label: "Medium" },
  { id: "lg", label: "Large" },
];

// `PerRowDragTable` with a size selector above it.
const PerRowDragSizeTable = (props: Omit<PerRowDragTableProps, "size">) => {
  const [size, setSize] = useState<DataTableSize>("md");
  return (
    <Stack gap="400">
      <Flex alignItems="center" gap="400">
        <Text as="label" id="per-row-drag-size" fontSize="350">
          Size:
        </Text>
        <Select.Root
          selectedKey={size}
          onSelectionChange={(key) => setSize(key as DataTableSize)}
          size="sm"
          aria-labelledby="per-row-drag-size"
        >
          <Select.Options>
            {SIZE_OPTIONS.map((option) => (
              <Select.Option key={option.id} id={option.id}>
                {option.label}
              </Select.Option>
            ))}
          </Select.Options>
        </Select.Root>
      </Flex>
      <PerRowDragTable {...props} size={size} />
    </Stack>
  );
};

/**
 * One draggable row (C) among fixed rows. The fixed rows keep their place in
 * keyboard navigation, call `onRowAction`, and accept drops.
 */
export const PerRowDrag: TableStory = {
  args: {
    label: "Per-row drag",
    draggableKeys: new Set(["C"]),
    onRowAction: fn(),
    onReorderKeys: fn(),
  },
  render: (args) => <PerRowDragSizeTable {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Only the listed row renders an enabled drag button",
      async () => {
        const buttons = dragButtons(canvasElement);
        expect(buttons).toHaveLength(1);
        expect(rowNamedExactly(canvas, "Row C")).toContainElement(buttons[0]);
        // The other rows keep a disabled drag button in the DOM for React
        // Aria. It is visually hidden, so only screen readers find it.
        for (const id of ["A", "B", "D", "E"]) {
          const button = within(rowNamedExactly(canvas, `Row ${id}`)).getByRole(
            "button",
            { name: /cannot be reordered/i }
          );
          expect(button).toBeDisabled();
          // The VisuallyHidden wrapper is 1px wide and clips the button.
          expect(
            button.parentElement!.getBoundingClientRect().width
          ).toBeLessThanOrEqual(1);
        }
      }
    );

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

    await step(
      "Enter twice on a drag button keeps the row in place",
      async () => {
        await startKeyboardDrag(
          canvasElement,
          rowNamedExactly(canvas, "Row C")
        );
        await userEvent.keyboard("{Enter}");
        await waitFor(() => expect(isDragging(canvasElement)).toBe(false));
        expect(canvas.getByTestId("row-order")).toHaveTextContent(
          "Order: A,B,C,D,E"
        );
      }
    );
  },
};

/**
 * Pointer and keyboard drags of the draggable row. `onReorder` receives only
 * keys from `draggableKeys`, and a fixed row is a valid drop target.
 */
export const PerRowDragReorder: TableStory = {
  args: {
    label: "Per-row drag reorder",
    draggableKeys: new Set(["C"]),
    onRowAction: fn(),
    onReorderKeys: fn(),
  },
  render: (args) => <PerRowDragTable {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const order = () => canvas.getByTestId("row-order");

    await step("Click on a fixed row calls onRowAction once", async () => {
      await userEvent.click(
        within(rowNamedExactly(canvas, "Row B")).getByText("Row B")
      );
      await waitFor(() => expect(args.onRowAction).toHaveBeenCalledTimes(1));
      expect(mocked(args.onRowAction).mock.calls[0][0]).toMatchObject({
        id: "B",
      });
    });

    await step("Enter on a fixed row calls onRowAction once", async () => {
      mocked(args.onRowAction).mockClear();
      rowNamedExactly(canvas, "Row D").focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(args.onRowAction).toHaveBeenCalledTimes(1));
      expect(mocked(args.onRowAction).mock.calls[0][0]).toMatchObject({
        id: "D",
      });
    });

    await step("Keyboard drag of row C drops after fixed row D", async () => {
      await startKeyboardDrag(canvasElement, rowNamedExactly(canvas, "Row C"));
      await moveDropTarget("{ArrowDown}");
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(order()).toHaveTextContent("Order: A,B,D,C,E")
      );
      expect(args.onReorderKeys).toHaveBeenCalledTimes(1);
      expect(mocked(args.onReorderKeys).mock.calls[0][0]).toEqual(["C"]);
    });

    await step("No keyboard drag starts from a fixed row", async () => {
      mocked(args.onReorderKeys).mockClear();
      mocked(args.onRowAction).mockClear();
      const rowA = rowNamedExactly(canvas, "Row A");
      rowA.focus();
      // Enter activates the row. It does not pick it up.
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(args.onRowAction).toHaveBeenCalledTimes(1));
      expect(mocked(args.onRowAction).mock.calls[0][0]).toMatchObject({
        id: "A",
      });
      expect(isDragging(canvasElement)).toBe(false);
      // Not in drag mode: ArrowDown moves focus to the next row.
      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() =>
        expect(rowNamedExactly(canvas, "Row B")).toHaveFocus()
      );
      expect(args.onReorderKeys).not.toHaveBeenCalled();
      expect(order()).toHaveTextContent("Order: A,B,D,C,E");
    });

    await step("No pointer drag starts from a fixed row", async () => {
      const dataTransfer = createDataTransfer();
      dispatchDrag(rowNamedExactly(canvas, "Row A"), "dragstart", dataTransfer);
      // A row that can start a drag is not draggable here, so nothing is
      // written to the drag data and no row enters the dragging state.
      expect(dataTransfer.types).toHaveLength(0);
      expect(isDragging(canvasElement)).toBe(false);
    });

    await step("A pointer drag starts from the listed row", async () => {
      // The same events on row C start a drag, so the step above is a real
      // check and not an event that React Aria ignores anyway.
      const dataTransfer = createDataTransfer();
      const rowC = rowNamedExactly(canvas, "Row C");
      dispatchDrag(rowC, "dragstart", dataTransfer);
      await waitFor(() => expect(isDragging(canvasElement)).toBe(true));
      expect(dataTransfer.types.length).toBeGreaterThan(0);
      dispatchDrag(rowC, "dragend", dataTransfer);
      await waitFor(() => expect(isDragging(canvasElement)).toBe(false));
    });

    await step("A pointer press on the handle reaches the handle", async () => {
      // React Aria sets `pointer-events: none` on the handle. The row sets it
      // back to `auto` on an enabled handle, so a press lands on the handle.
      const handle = within(rowNamedExactly(canvas, "Row C")).getByRole(
        "button",
        { name: /drag to reorder/i }
      );
      const rect = handle.getBoundingClientRect();
      const hit = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      // The hit element is the handle or its icon, not the cell below.
      expect(hit).not.toBeNull();
      expect(handle.contains(hit)).toBe(true);
      // A drag that starts on the handle starts the row's drag.
      const dataTransfer = createDataTransfer();
      dispatchDrag(handle, "dragstart", dataTransfer);
      await waitFor(() => expect(isDragging(canvasElement)).toBe(true));
      dispatchDrag(handle, "dragend", dataTransfer);
      await waitFor(() => expect(isDragging(canvasElement)).toBe(false));
    });

    await step("A pointer drop before a fixed row reorders", async () => {
      mocked(args.onReorderKeys).mockClear();
      await pointerDrag(
        canvasElement,
        rowNamedExactly(canvas, "Row C"),
        rowNamedExactly(canvas, "Row A"),
        0.2
      );
      await waitFor(() =>
        expect(order()).toHaveTextContent("Order: C,A,B,D,E")
      );
      expect(args.onReorderKeys).toHaveBeenCalledTimes(1);
      expect(mocked(args.onReorderKeys).mock.calls[0]).toEqual([["C"], "A"]);
    });

    await step("A pointer drop after a fixed row reorders", async () => {
      mocked(args.onReorderKeys).mockClear();
      await pointerDrag(
        canvasElement,
        rowNamedExactly(canvas, "Row C"),
        rowNamedExactly(canvas, "Row E"),
        0.8
      );
      await waitFor(() =>
        expect(order()).toHaveTextContent("Order: A,B,D,E,C")
      );
      expect(args.onReorderKeys).toHaveBeenCalledTimes(1);
      expect(mocked(args.onReorderKeys).mock.calls[0]).toEqual([["C"], "E"]);
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

    await step(
      "empty set: every row has a hidden disabled drag button",
      async () => {
        const noRows = canvas.getByTestId("no-rows");
        expect(dragButtons(noRows)).toHaveLength(0);
        const disabled = within(noRows).getAllByRole("button", {
          name: /cannot be reordered/i,
        });
        expect(disabled).toHaveLength(5);
        disabled.forEach((button) => expect(button).toBeDisabled());
      }
    );
  },
};

const rowsWithDisabledB = (): DataTableRowItem[] =>
  makeRows().map((row) =>
    row.id === "B" ? { ...row, isDisabled: true } : row
  );

type DisabledRowStoryArgs = {
  /** Called by the table that disables row B with `disabledKeys`. */
  onReorderByKeys: (keys: string[], targetKey: string) => void;
  /** Called by the table that disables row B with `isDisabled` row data. */
  onReorderByData: (keys: string[], targetKey: string) => void;
};

/**
 * A disabled row is never draggable, even when its key is in the set, and it
 * accepts pointer drops before and after it. Both ways to disable a row are
 * covered: `disabledKeys` and `isDisabled` in the row data.
 */
export const PerRowDragDisabledRow: StoryObj<DisabledRowStoryArgs> = {
  args: { onReorderByKeys: fn(), onReorderByData: fn() },
  render: (args) => (
    <Stack gap="800">
      <div data-testid="disabled-keys">
        <PerRowDragTable
          label="Disabled by key"
          draggableKeys={new Set(["B", "C"])}
          disabledKeys={new Set(["B"])}
          onRowAction={fn()}
          onReorderKeys={args.onReorderByKeys}
        />
      </div>
      <div data-testid="disabled-data">
        <PerRowDragTable
          label="Disabled by row data"
          draggableKeys={new Set(["B", "C"])}
          initialRows={rowsWithDisabledB()}
          onRowAction={fn()}
          onReorderKeys={args.onReorderByData}
        />
      </div>
    </Stack>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);

    for (const [testId, how, spy] of [
      ["disabled-keys", "disabledKeys", args.onReorderByKeys],
      ["disabled-data", "isDisabled row data", args.onReorderByData],
    ] as const) {
      const container = canvas.getByTestId(testId);
      const table = within(container);
      const order = () => table.getByTestId("row-order");

      await step(
        `${how}: the disabled row's drag button is disabled`,
        async () => {
          const button = within(rowNamedExactly(table, "Row B")).getByRole(
            "button",
            { name: /drag to reorder/i }
          );
          expect(button).toBeDisabled();
        }
      );

      await step(`${how}: the enabled listed row stays draggable`, async () => {
        const button = within(rowNamedExactly(table, "Row C")).getByRole(
          "button",
          { name: /drag to reorder/i }
        );
        expect(button).not.toBeDisabled();
      });

      await step(
        `${how}: no pointer drag starts from the disabled row`,
        async () => {
          const dataTransfer = createDataTransfer();
          dispatchDrag(
            rowNamedExactly(table, "Row B"),
            "dragstart",
            dataTransfer
          );
          expect(dataTransfer.types).toHaveLength(0);
          expect(isDragging(container)).toBe(false);
        }
      );

      await step(`${how}: a pointer drop before the disabled row`, async () => {
        await pointerDrag(
          container,
          rowNamedExactly(table, "Row C"),
          rowNamedExactly(table, "Row B"),
          0.2
        );
        await waitFor(() =>
          expect(order()).toHaveTextContent("Order: A,C,B,D,E")
        );
      });

      await step(`${how}: a pointer drop after the disabled row`, async () => {
        await pointerDrag(
          container,
          rowNamedExactly(table, "Row C"),
          rowNamedExactly(table, "Row B"),
          0.8
        );
        await waitFor(() =>
          expect(order()).toHaveTextContent("Order: A,B,C,D,E")
        );
      });

      await step(`${how}: onReorder received only permitted keys`, async () => {
        // React Aria names the neighbour that ends the gap as the target, so
        // only the moved keys are compared.
        const movedKeys = mocked(spy).mock.calls.map(([keys]) => keys);
        expect(movedKeys).toEqual([["C"], ["C"]]);
      });
    }
  },
};

/**
 * Rows B and D are disabled and only row C is draggable. The play moves C above
 * B, then back between B and D, so drops next to two disabled rows are checked.
 */
export const PerRowDragBetweenDisabledRows: TableStory = {
  args: {
    label: "Between disabled rows",
    draggableKeys: new Set(["C"]),
    disabledKeys: new Set(["B", "D"]),
    onRowAction: fn(),
    onReorderKeys: fn(),
  },
  render: (args) => <PerRowDragTable {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const order = () => canvas.getByTestId("row-order");

    await step("Move C above disabled row B", async () => {
      await startKeyboardDrag(canvasElement, rowNamedExactly(canvas, "Row C"));
      await moveDropTarget("{ArrowUp}");
      await moveDropTarget("{ArrowUp}");
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(order()).toHaveTextContent("Order: A,C,B,D,E")
      );
    });

    await step("Move C back between disabled rows B and D", async () => {
      await startKeyboardDrag(canvasElement, rowNamedExactly(canvas, "Row C"));
      await moveDropTarget("{ArrowDown}");
      await userEvent.keyboard("{Enter}");
      await waitFor(() =>
        expect(order()).toHaveTextContent("Order: A,B,C,D,E")
      );
    });

    await step("A pointer drop above disabled row B", async () => {
      mocked(args.onReorderKeys).mockClear();
      await pointerDrag(
        canvasElement,
        rowNamedExactly(canvas, "Row C"),
        rowNamedExactly(canvas, "Row B"),
        0.2
      );
      await waitFor(() =>
        expect(order()).toHaveTextContent("Order: A,C,B,D,E")
      );
    });

    await step("A pointer drop below disabled row D", async () => {
      await pointerDrag(
        canvasElement,
        rowNamedExactly(canvas, "Row C"),
        rowNamedExactly(canvas, "Row D"),
        0.8
      );
      await waitFor(() =>
        expect(order()).toHaveTextContent("Order: A,B,D,C,E")
      );
      // Only the draggable row is ever reported as moved.
      expect(
        mocked(args.onReorderKeys).mock.calls.map(([keys]) => keys)
      ).toEqual([["C"], ["C"]]);
    });
  },
};

const RejectingDropsTable = ({
  onReorderKeys,
}: Pick<PerRowDragTableProps, "onReorderKeys">) => {
  const [rows, setRows] = useState<DataTableRowItem[]>(makeRows);
  const handlers = createArrayHandlers(setRows, (row) => row.id);
  // React Aria's own hook: it accepts `getDropOperation`, which Nimbus's
  // `useDragAndDrop` does not pass through.
  const { dragAndDropHooks } = useReactAriaDragAndDrop({
    getItems: (_keys, items) =>
      (items as DataTableRowItem[]).map((item) => ({
        "text/plain": String(item.name),
      })),
    // Dropping next to the last row (row E) is not allowed.
    getDropOperation: (target) =>
      target.type === "item" && target.key === "E" ? "cancel" : "move",
    onReorder(e) {
      onReorderKeys([...e.keys].map(String), String(e.target.key));
      handlers.onReorder?.(e.keys, e.target);
    },
  });
  return (
    <Stack gap="400">
      <DataTable
        columns={dragColumns}
        rows={rows}
        draggableKeys={new Set(["C"])}
        dragAndDropHooks={dragAndDropHooks}
        aria-label="Rejecting drops"
        size="md"
      />
      <Text data-testid="row-order">
        Order: {rows.map((r) => r.id).join(",")}
      </Text>
    </Stack>
  );
};

/**
 * With React Aria's `useDragAndDrop`, `getDropOperation` rejects drop
 * positions. Here, no row can be dropped next to row E.
 */
export const PerRowDragRejectDrops: StoryObj<
  Pick<PerRowDragTableProps, "onReorderKeys">
> = {
  args: { onReorderKeys: fn() },
  render: (args) => <RejectingDropsTable {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const order = () => canvas.getByTestId("row-order");

    await step("A drop at an allowed position reorders", async () => {
      await pointerDrag(
        canvasElement,
        rowNamedExactly(canvas, "Row C"),
        rowNamedExactly(canvas, "Row A"),
        0.2
      );
      await waitFor(() =>
        expect(order()).toHaveTextContent("Order: C,A,B,D,E")
      );
      expect(args.onReorderKeys).toHaveBeenCalledTimes(1);
    });

    await step("A drop next to row E is rejected", async () => {
      mocked(args.onReorderKeys).mockClear();
      const dataTransfer = createDataTransfer();
      const rowC = rowNamedExactly(canvas, "Row C");
      const rowD = rowNamedExactly(canvas, "Row D");
      const rowE = rowNamedExactly(canvas, "Row E");
      const dropTarget = () =>
        canvasElement.querySelector("[data-drop-target]");
      dispatchDrag(rowC, "dragstart", dataTransfer);
      await waitFor(() => expect(isDragging(canvasElement)).toBe(true));
      // Hover an allowed position first, so a missing drop target below shows
      // that the position was rejected and not that React Aria had not
      // processed the event yet.
      dispatchDrag(rowD, "dragenter", dataTransfer, 0.2);
      dispatchDrag(rowD, "dragover", dataTransfer, 0.2);
      await waitFor(() => expect(dropTarget()).not.toBeNull());
      dispatchDrag(rowE, "dragover", dataTransfer, 0.8);
      await waitFor(() => expect(dropTarget()).toBeNull());
      dispatchDrag(rowE, "drop", dataTransfer, 0.8);
      dispatchDrag(rowC, "dragend", dataTransfer);
      await waitFor(() => expect(isDragging(canvasElement)).toBe(false));
      expect(order()).toHaveTextContent("Order: C,A,B,D,E");
      expect(args.onReorderKeys).not.toHaveBeenCalled();
    });
  },
};

type RenderCountTableProps = {
  /** Called with the row id each time a row renders its cells. */
  onCellsRender: (rowId: string) => void;
};

const RenderCountTable = ({ onCellsRender }: RenderCountTableProps) => {
  const [draggableKeys, setDraggableKeys] = useState(new Set(["C"]));
  // Created once: new row objects on every render would re-render every row.
  const [rows, setRows] = useState<DataTableRowItem[]>(makeRows);
  const { dragAndDropHooks } = useDragAndDrop({
    ...createArrayHandlers(setRows, (row) => row.id),
  });
  // A stable function: a new one would make every row render again.
  const renderCells = useCallback(
    ({ columns: cols, row }: DataTableCellRenderProps<DataTableRowItem>) => {
      onCellsRender(row.id);
      return cols.map((col) => (
        <DataTable.Cell key={col.id}>{col.accessor(row)}</DataTable.Cell>
      ));
    },
    [onCellsRender]
  );

  return (
    <Stack gap="400">
      <Button onPress={() => setDraggableKeys(new Set(["C", "D"]))}>
        Make D draggable
      </Button>
      <DataTable.Root
        columns={dragColumns}
        rows={rows}
        draggableKeys={draggableKeys}
        size="md"
      >
        <DataTable.Table
          aria-label="Render counts"
          dragAndDropHooks={dragAndDropHooks}
        >
          <DataTable.Header />
          <DataTable.Body>
            {(row, rowRenderProps) => (
              <DataTable.Row row={row} {...rowRenderProps}>
                {renderCells}
              </DataTable.Row>
            )}
          </DataTable.Body>
        </DataTable.Table>
      </DataTable.Root>
    </Stack>
  );
};

/** Changing `draggableKeys` re-renders only the rows whose flag changed. */
export const PerRowDragRenderOnlyChangedRows: StoryObj<RenderCountTableProps> =
  {
    args: { onCellsRender: fn() },
    render: (args) => <RenderCountTable {...args} />,
    play: async ({ canvasElement, args, step }) => {
      const canvas = within(canvasElement);

      await step("Adding D to the set renders only row D", async () => {
        mocked(args.onCellsRender).mockClear();
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
        const rendered = new Set(
          mocked(args.onCellsRender).mock.calls.map(([id]) => id)
        );
        expect([...rendered]).toEqual(["D"]);
      });
    },
  };

const renderProbeColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row: Record<string, unknown>) => row.name as ReactNode,
  },
  {
    id: "flag",
    header: "isDragDisabled",
    accessor: () => null,
  },
];

/** A table whose cells print the `isDragDisabled` flag of their row. */
const FlagTable = ({
  label,
  draggableKeys,
  withDragAndDrop,
}: {
  label: string;
  draggableKeys: Set<string>;
  withDragAndDrop: boolean;
}) => {
  const [rows, setRows] = useState<DataTableRowItem[]>(makeRows);
  const { dragAndDropHooks } = useDragAndDrop({
    ...createArrayHandlers(setRows, (row) => row.id),
  });
  const body = useMemo(
    () => (
      <DataTable.Body>
        {(row, rowRenderProps) => (
          <DataTable.Row row={row} {...rowRenderProps}>
            {({ columns: cols }) =>
              cols.map((col) => (
                <DataTable.Cell key={col.id}>
                  {col.id === "flag"
                    ? `${row.id}:${String(rowRenderProps.isDragDisabled)}`
                    : col.accessor(row)}
                </DataTable.Cell>
              ))
            }
          </DataTable.Row>
        )}
      </DataTable.Body>
    ),
    []
  );
  return (
    <DataTable.Root
      columns={renderProbeColumns}
      rows={rows}
      draggableKeys={draggableKeys}
      size="md"
    >
      <DataTable.Table
        aria-label={label}
        dragAndDropHooks={withDragAndDrop ? dragAndDropHooks : undefined}
      >
        <DataTable.Header />
        {body}
      </DataTable.Table>
    </DataTable.Root>
  );
};

const flagWarnings: string[] = [];

/**
 * Custom row render functions get `isDragDisabled`. It is `true` for rows
 * outside `draggableKeys`, and `false` for every row when drag and drop is off,
 * because `draggableKeys` has no effect then (and a warning says so).
 */
export const PerRowDragRenderProp: Story = {
  beforeEach: recordWarnings(flagWarnings),
  render: () => (
    <Stack gap="800">
      <div data-testid="with-dnd">
        <FlagTable
          label="With drag and drop"
          draggableKeys={new Set(["C"])}
          withDragAndDrop
        />
      </div>
      <div data-testid="without-dnd">
        <FlagTable
          label="Without drag and drop"
          draggableKeys={new Set(["C"])}
          withDragAndDrop={false}
        />
      </div>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Rows outside the set get isDragDisabled true", async () => {
      const table = within(canvas.getByTestId("with-dnd"));
      for (const id of ["A", "B", "D", "E"]) {
        expect(table.getByText(`${id}:true`)).toBeInTheDocument();
      }
      expect(table.getByText("C:false")).toBeInTheDocument();
    });

    await step("Without drag and drop, no row is drag disabled", async () => {
      const table = within(canvas.getByTestId("without-dnd"));
      for (const id of ["A", "B", "C", "D", "E"]) {
        expect(table.getByText(`${id}:false`)).toBeInTheDocument();
      }
      expect(dragButtons(canvas.getByTestId("without-dnd"))).toHaveLength(0);
    });

    await step("draggableKeys without drag and drop warns", async () => {
      await waitFor(() =>
        expect(
          flagWarnings.filter((w) =>
            w.includes("`draggableKeys` has no effect")
          )
        ).toHaveLength(1)
      );
    });
  },
};

const unsupportedWarnings: string[] = [];

/**
 * `draggableKeys` together with selection or with expandable rows is not
 * supported. Each combination warns once in development.
 */
export const PerRowDragUnsupportedCombinationsWarn: Story = {
  beforeEach: recordWarnings(unsupportedWarnings),
  render: () => {
    const Tables = () => {
      const [rows] = useState<DataTableRowItem[]>(makeRows);
      const [nestedRows] = useState<DataTableRowItem[]>(() =>
        makeRows().map((row, i) =>
          i === 0 ? { ...row, children: [{ id: "A1", name: "Row A1" }] } : row
        )
      );
      const { dragAndDropHooks } = useDragAndDrop({
        ...createArrayHandlers(
          () => {},
          (row) => String(row.id)
        ),
      });
      return (
        <Stack gap="800">
          <DataTable
            columns={dragColumns}
            rows={rows}
            selectionMode="multiple"
            draggableKeys={new Set(["C"])}
            dragAndDropHooks={dragAndDropHooks}
            aria-label="Selection and draggableKeys"
            size="md"
          />
          <DataTable
            columns={dragColumns}
            rows={nestedRows}
            nestedKey="children"
            draggableKeys={new Set(["C"])}
            dragAndDropHooks={dragAndDropHooks}
            aria-label="Expandable rows and draggableKeys"
            size="md"
          />
        </Stack>
      );
    };
    return <Tables />;
  },
  play: async ({ step }) => {
    await step("Selection with draggableKeys warns once", async () => {
      await waitFor(() =>
        expect(
          unsupportedWarnings.filter((w) => w.includes("`selectionMode`"))
        ).toHaveLength(1)
      );
    });

    await step("Expandable rows with draggableKeys warn once", async () => {
      await waitFor(() =>
        expect(
          unsupportedWarnings.filter((w) => w.includes("expandable rows"))
        ).toHaveLength(1)
      );
    });
  },
};

const showcaseSizes: DataTableSize[] = ["sm", "md", "lg"];

/**
 * One draggable row (C) among fixed rows at every size. The fixed rows have no
 * visible drag handle, and their empty drag cell lines up with the header and
 * the draggable row.
 */
export const PerRowDragSizes: Story = {
  // VRT: the hidden handles of fixed rows, and the drag column at each size.
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Stack gap="800">
      {showcaseSizes.map((size) => (
        <PerRowDragTable
          key={size}
          label={`Per-row drag, size ${size}`}
          size={size}
          draggableKeys={new Set(["C"])}
          onRowAction={fn()}
          onReorderKeys={fn()}
        />
      ))}
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The frame is only worth capturing once every table has rendered.
    await waitFor(() => expect(canvas.getAllByRole("grid")).toHaveLength(3));
    expect(dragButtons(canvasElement)).toHaveLength(3);
  },
};

/**
 * A keyboard drag of the draggable row, left in progress. The drop indicator
 * shows between two fixed rows, over the sticky drag column.
 */
export const PerRowDragDropIndicator: TableStory = {
  // VRT: the drop indicator in the middle of a drag. The play ends mid-drag,
  // so the snapshot has the indicator.
  tags: ["vrt"],
  parameters: {
    chromatic: { disableSnapshot: false },
    // While a drag is in progress, React Aria renders its drop indicators as
    // rows with `aria-level` in a `grid`, which axe rejects. The rule is off
    // for this story only: the indicators exist only mid-drag.
    a11y: {
      config: {
        rules: [{ id: "aria-conditional-attr", enabled: false }],
      },
    },
  },
  args: {
    label: "Per-row drag, drop indicator",
    draggableKeys: new Set(["C"]),
    onRowAction: fn(),
    onReorderKeys: fn(),
  },
  render: (args) => <PerRowDragTable {...args} />,
  // The play ends mid-drag. React Aria's drag manager is global: while a
  // keyboard drag is active it cancels every keydown, including Tab. Stories
  // in all test files share one browser page, so end the drag when this story
  // ends, or a later story that presses Tab never moves focus.
  beforeEach: () => async () => {
    await userEvent.keyboard("{Escape}");
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await startKeyboardDrag(canvasElement, rowNamedExactly(canvas, "Row C"));
    await moveDropTarget("{ArrowUp}");
    await moveDropTarget("{ArrowUp}");
  },
};
