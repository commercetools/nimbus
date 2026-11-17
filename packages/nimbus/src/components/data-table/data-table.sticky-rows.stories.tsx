// DataTable stories for sticky rows (`stickyRows`).
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry.

import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { within, expect, waitFor, userEvent, fn, mocked } from "storybook/test";
import { Button, DataTable, Stack } from "@/components";
import { useDragAndDrop, createArrayHandlers } from "@commercetools/nimbus";
import type {
  DataTableApi,
  DataTableCellRenderProps,
  DataTableColumnItem,
  DataTableProps,
  DataTableRowItem,
  DataTableSize,
  SortDescriptor,
} from "./data-table.types";
import { recordWarnings } from "./utils/data-table.test-utils";

const meta: Meta<object> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;

type Story = StoryObj<DataTableProps>;

const nameColumn: DataTableColumnItem = {
  id: "name",
  header: "Name",
  accessor: (row: Record<string, unknown>) => row.name as ReactNode,
};

const nameColumns: DataTableColumnItem[] = [nameColumn];

/** Added to the name of a sticky row, so a reader can see which rows they are. */
const STICKY_MARK = " (sticky)";

/** A name column that marks the rows of a fixed set. */
const markedNameColumns = (stickyRows: Set<string>): DataTableColumnItem[] => [
  {
    ...nameColumn,
    accessor: (row: Record<string, unknown>) =>
      `${row.name as string}${stickyRows.has(row.id as string) ? STICKY_MARK : ""}`,
  },
];

const manyRows = (count: number): DataTableRowItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `row-${index + 1}`,
    name: `Row ${index + 1}`,
  }));

/** The element that scrolls: the table's root. */
const getRoot = (canvasElement: HTMLElement) => {
  const root = canvasElement
    .querySelector("table")
    ?.closest<HTMLElement>("[data-scroll-left]");
  if (!root) throw new Error("The DataTable root was not found");
  return root;
};

/** Waits for the browser to lay out and paint, and for animation frames. */
const nextFrames = (count = 2) =>
  new Promise<void>((resolve) => {
    const step = (remaining: number) =>
      remaining === 0
        ? resolve()
        : requestAnimationFrame(() => step(remaining - 1));
    step(count);
  });

/**
 * Scrolls the table's root to `top`. It waits until the content is taller than
 * the root first: without overflow there is nothing to scroll and nothing can
 * stick.
 */
const scrollRootTo = async (root: HTMLElement, top: number) => {
  await waitFor(() =>
    expect(root.scrollHeight).toBeGreaterThan(root.clientHeight)
  );
  // The browser clamps a position past the end of the scroll range.
  const target = Math.min(top, root.scrollHeight - root.clientHeight);
  root.scrollTop = target;
  await waitFor(() =>
    expect(Math.round(root.scrollTop)).toBe(Math.round(target))
  );
  await nextFrames();
};

/** The row of the table body whose first cell text is exactly `name`. */
const bodyRow = (canvasElement: HTMLElement, name: string) => {
  const found = Array.from(canvasElement.querySelectorAll("tbody tr")).find(
    (tr) =>
      Array.from(tr.querySelectorAll("td")).some(
        (td) => td.textContent?.replace(STICKY_MARK, "").trim() === name
      )
  );
  if (!found) throw new Error(`Row "${name}" was not found`);
  return found as HTMLElement;
};

const rowByName = (canvas: ReturnType<typeof within>, name: string) =>
  canvas.getByRole("row", {
    name: new RegExp(`^${name}(${STICKY_MARK.replace(/[()]/g, "\\$&")})?$`),
  });

/** Two stuck rows are within a pixel of each other: stacked without a gap. */
const expectTouching = (above: number, below: number) =>
  expect(Math.abs(below - above)).toBeLessThan(1);

/** The names of the rows in the order shown. Other cells and helper rows are skipped. */
const rowNames = (scope: ParentNode) =>
  Array.from(scope.querySelectorAll("tbody tr"))
    .map(
      (tr) =>
        Array.from(tr.querySelectorAll("td"))
          .map((td) => td.textContent?.trim() ?? "")
          .find((text) => /^Row \d+$/.test(text)) ?? ""
    )
    .filter(Boolean);

/** The bottom of the header, where the top stack starts. */
const headerBottom = (scope: ParentNode) =>
  (scope.querySelector("thead") as HTMLElement).getBoundingClientRect().bottom;

/** The bottom edge of the area that scrolls, inside its border. */
const rootBottom = (root: HTMLElement) =>
  root.getBoundingClientRect().top + root.clientTop + root.clientHeight;

const flagColumns: DataTableColumnItem[] = [
  nameColumn,
  {
    id: "flag",
    header: "isSticky",
    accessor: () => null,
  },
];

type FlagTableProps = {
  label: string;
  stickyRows?: Set<string>;
  /** The `maxHeight` prop. Rows only stick with it. */
  maxHeight?: string;
  /** Sizes the table with the `maxH` style prop, which is not `maxHeight`. */
  maxH?: string;
  rowCount?: number;
};

/** A table whose cells print the `isSticky` flag of their row. */
const FlagTable = ({
  label,
  stickyRows,
  maxHeight,
  maxH,
  rowCount = 30,
}: FlagTableProps) => {
  const [rows] = useState<DataTableRowItem[]>(() => manyRows(rowCount));
  const body = useMemo(
    () => (
      <DataTable.Body>
        {(row, rowRenderProps) => (
          <DataTable.Row row={row} {...rowRenderProps}>
            {({ columns: cols }) =>
              cols.map((col) => (
                <DataTable.Cell key={col.id}>
                  {col.id === "flag"
                    ? `isSticky: ${String(rowRenderProps.isSticky)}`
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
      columns={flagColumns}
      rows={rows}
      stickyRows={stickyRows}
      maxHeight={maxHeight}
      // An explicit `maxH={undefined}` would replace the one `maxHeight` sets.
      {...(maxH ? { maxH } : {})}
      size="md"
    >
      <DataTable.Table aria-label={label}>
        <DataTable.Header />
        {body}
      </DataTable.Table>
    </DataTable.Root>
  );
};

/** The `isSticky` flag each row of a table prints, by row name. */
const printedFlags = (table: HTMLElement) =>
  Object.fromEntries(
    Array.from(table.querySelectorAll("tbody tr")).map((tr) => {
      const [name, flag] = Array.from(tr.querySelectorAll("td")).map(
        (td) => td.textContent ?? ""
      );
      return [name, flag.replace("isSticky: ", "")];
    })
  );

const flagWarnings: string[] = [];

/**
 * Custom row render functions get `isSticky`: `true` for the rows in
 * `stickyRows`. The play scrolls the table, so the rows with `isSticky` `true`
 * stay in view under the header, and the rows with `false` scroll away. An id
 * that is not a row is ignored without an error.
 */
export const StickyRowsRenderProp: Story = {
  beforeEach: recordWarnings(flagWarnings),
  render: () => (
    <FlagTable
      label="Sticky rows"
      stickyRows={new Set(["row-3", "row-5", "unknown-id"])}
      maxHeight="320px"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);
    const header = canvasElement.querySelector("thead") as HTMLElement;

    await step("Only the rows in the set print isSticky true", async () => {
      const flags = printedFlags(canvasElement);
      expect(Object.keys(flags)).toHaveLength(30);
      expect(
        Object.entries(flags)
          .filter(([, flag]) => flag === "true")
          .map(([name]) => name)
      ).toEqual(["Row 3", "Row 5"]);
    });

    await step("An id that is not a row is ignored", async () => {
      expect(canvasElement.querySelectorAll("tbody tr")).toHaveLength(30);
    });

    await step(
      "Scrolled down, the rows with isSticky true stay under the header",
      async () => {
        await scrollRootTo(root, 600);
        const row3 = bodyRow(canvasElement, "Row 3");
        const row5 = bodyRow(canvasElement, "Row 5");
        expect(getComputedStyle(row3).position).toBe("sticky");
        expectTouching(
          header.getBoundingClientRect().bottom,
          row3.getBoundingClientRect().top
        );
        expectTouching(
          row3.getBoundingClientRect().bottom,
          row5.getBoundingClientRect().top
        );
      }
    );

    await step("A row with isSticky false scrolls out of view", async () => {
      const row4 = bodyRow(canvasElement, "Row 4").getBoundingClientRect();
      const stackBottom = bodyRow(
        canvasElement,
        "Row 5"
      ).getBoundingClientRect().bottom;
      expect(row4.bottom).toBeLessThanOrEqual(stackBottom);
      expect(
        getComputedStyle(bodyRow(canvasElement, "Row 4")).position
      ).not.toBe("sticky");
    });
  },
};

/**
 * Nothing is sticky without `maxHeight`, with an empty set or without
 * `stickyRows`. Each table is scrolled, and its rows leave the view like any
 * other row.
 */
export const StickyRowsInactive: Story = {
  render: () => (
    <Stack gap="400">
      <FlagTable
        label="Empty set"
        stickyRows={new Set()}
        maxHeight="200px"
        rowCount={12}
      />
      <FlagTable label="No stickyRows" maxHeight="200px" rowCount={12} />
      <FlagTable
        label="No maxHeight"
        stickyRows={new Set(["row-3"])}
        maxH="200px"
        rowCount={12}
      />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    for (const label of ["Empty set", "No stickyRows", "No maxHeight"]) {
      await step(`${label}: no row is sticky`, async () => {
        const table = canvas.getByRole("grid", { name: label });
        const root = table.closest<HTMLElement>("[data-scroll-left]")!;
        await scrollRootTo(root, root.scrollHeight);
        expect(table.querySelector("[data-sticky-row]")).toBeNull();
        expect(Object.values(printedFlags(table))).not.toContain("true");
        // Row 3 left the view with the scroll.
        const row3 = bodyRow(table, "Row 3").getBoundingClientRect();
        expect(row3.bottom).toBeLessThanOrEqual(
          root.getBoundingClientRect().top + 60
        );
      });
    }
  },
};

type RenderCountTableProps = {
  /** Called with the row id each time a row renders its cells. */
  onCellsRender: (rowId: string) => void;
};

const renderCountRows = manyRows(40);
const renderCountColumns = markedNameColumns(new Set(["row-3", "row-8"]));

const RenderCountTable = ({ onCellsRender }: RenderCountTableProps) => {
  const [stickyRows, setStickyRows] = useState(new Set(["row-3"]));
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
      <Button onPress={() => setStickyRows(new Set(["row-3", "row-8"]))}>
        Make row 8 sticky
      </Button>
      <DataTable.Root
        columns={renderCountColumns}
        rows={renderCountRows}
        stickyRows={stickyRows}
        maxHeight="300px"
        size="md"
      >
        <DataTable.Table aria-label="Render counts">
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

/**
 * Changing `stickyRows` re-renders only the rows whose flag changed. The table
 * is scrolled first, so the new sticky row is visibly stacked under row 3.
 */
export const StickyRowsRenderOnlyChangedRows: StoryObj<RenderCountTableProps> =
  {
    args: { onCellsRender: fn() },
    render: (args) => <RenderCountTable {...args} />,
    play: async ({ canvasElement, args, step }) => {
      const canvas = within(canvasElement);
      const root = getRoot(canvasElement);
      const header = canvasElement.querySelector("thead") as HTMLElement;
      const rect = (name: string) =>
        bodyRow(canvasElement, name).getBoundingClientRect();

      await step("Scrolled down, row 3 is stuck under the header", async () => {
        await scrollRootTo(root, 500);
        expectTouching(
          header.getBoundingClientRect().bottom,
          rect("Row 3").top
        );
      });

      await step("Adding row 8 renders only row 8", async () => {
        mocked(args.onCellsRender).mockClear();
        await userEvent.click(
          canvas.getByRole("button", { name: "Make row 8 sticky" })
        );
        await waitFor(() => {
          expect(
            bodyRow(canvasElement, "Row 8").hasAttribute("data-sticky-row")
          ).toBe(true);
        });
        const rendered = new Set(
          mocked(args.onCellsRender).mock.calls.map(([id]) => id)
        );
        expect([...rendered]).toEqual(["row-8"]);
      });

      await step("Row 8 is stacked under row 3", async () => {
        await waitFor(() => {
          expectTouching(rect("Row 3").bottom, rect("Row 8").top);
        });
      });
    },
  };

// ---------------------------------------------------------------------------
// Stacks: the layout of sticky rows in a scroll area
// ---------------------------------------------------------------------------

type StackTableProps = {
  label?: string;
  stickyRows: Set<string>;
  maxHeight?: string;
  rowCount?: number;
  apiRef?: Ref<DataTableApi>;
  footer?: ReactNode;
};

const StackTable = ({
  label = "Sticky rows",
  stickyRows,
  // Tall enough that the rows in place at the top are clear of the bottom stack.
  maxHeight = "480px",
  rowCount = 40,
  apiRef,
  footer,
}: StackTableProps) => {
  const [rows] = useState(() => manyRows(rowCount));
  const columns = useMemo(() => markedNameColumns(stickyRows), [stickyRows]);
  return (
    <DataTable
      aria-label={label}
      columns={columns}
      rows={rows}
      stickyRows={stickyRows}
      maxHeight={maxHeight}
      apiRef={apiRef}
      footer={footer}
      size="md"
    />
  );
};

const stackStickyRows = new Set(["row-3", "row-5", "row-38"]);

/**
 * Sticky rows stick at both edges and stack in row order without a gap. A
 * sticky row in its own place covers nothing, and the scroll padding follows
 * the rows that are stuck.
 */
export const StickyRowsStacks: Story = {
  render: () => <StackTable stickyRows={stackStickyRows} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);
    const rect = (name: string) =>
      rowByName(canvas, name).getBoundingClientRect();
    const headerBottom = () =>
      canvasElement.querySelector("thead")!.getBoundingClientRect().bottom;
    const clientBottom = () =>
      root.getBoundingClientRect().top + root.clientTop + root.clientHeight;
    const padding = () => ({
      top: parseFloat(root.style.scrollPaddingTop),
      bottom: parseFloat(root.style.scrollPaddingBottom),
    });

    await step(
      "At the top, rows 3 and 5 are in place and row 38 sticks at the bottom",
      async () => {
        await waitFor(() => {
          expectTouching(rect("Row 38").bottom, clientBottom());
        });
        // Row 3 is in its own place, below rows 1 and 2.
        expect(rect("Row 3").top).toBeGreaterThan(headerBottom() + 40);
        // Only row 38 is stuck, so only it is in the padding.
        await waitFor(() => {
          expect(padding().bottom).toBeCloseTo(rect("Row 38").height, 0);
        });
        // Stuck at the bottom edge, the last sticky row hides its divider: the
        // border of the scroll area is the line there. The border is only
        // transparent, so the row keeps its height.
        const row38 = rowByName(canvas, "Row 38");
        expect(row38.hasAttribute("data-sticky-bottom-edge")).toBe(true);
        const edgeCell = getComputedStyle(row38.querySelector("td") as Element);
        expect(edgeCell.borderBottomWidth).toBe("1px");
        expect(edgeCell.borderBottomColor).toBe("rgba(0, 0, 0, 0)");
        // Row 37 is far above, so nothing paints the divider on top of row 38.
        // The row draws it as a one pixel background, without a taller border.
        expect(row38.hasAttribute("data-sticky-bottom-start")).toBe(true);
        expect(edgeCell.borderTopWidth).toBe("0px");
        expect(edgeCell.backgroundImage).toContain("linear-gradient");
        expect(edgeCell.backgroundSize).toBe("100% 1px");
        // A row that is not at the bottom edge keeps its visible divider.
        expect(
          getComputedStyle(
            rowByName(canvas, "Row 3").querySelector("td") as Element
          ).borderBottomColor
        ).not.toBe("rgba(0, 0, 0, 0)");
        expect(padding().top).toBeCloseTo(
          headerBottom() - root.getBoundingClientRect().top - root.clientTop,
          0
        );
      }
    );

    await step(
      "Scrolled down, rows 3 and 5 stack below the header",
      async () => {
        root.scrollTop = 600;
        await nextFrames();
        expectTouching(headerBottom(), rect("Row 3").top);
        expectTouching(rect("Row 3").bottom, rect("Row 5").top);
        // The bottom stack did not move.
        expectTouching(rect("Row 38").bottom, clientBottom());
      }
    );

    await step(
      "The padding covers the header and both stuck rows",
      async () => {
        await waitFor(() => {
          const headerHeight =
            headerBottom() - root.getBoundingClientRect().top - root.clientTop;
          expect(padding().top).toBeCloseTo(
            headerHeight + rect("Row 3").height + rect("Row 5").height,
            0
          );
        });
        expect(padding().bottom).toBeCloseTo(rect("Row 38").height, 0);
      }
    );

    await step("At the end, row 38 is in its own place", async () => {
      root.scrollTop = root.scrollHeight;
      await nextFrames();
      // Row 38 is no longer stuck, so the bottom padding is 0. Rows 3 and 5
      // are still stuck at the top.
      await waitFor(() => expect(padding().bottom).toBe(0));
      // In its own place, row 38 has its divider again.
      const row38 = rowByName(canvas, "Row 38");
      expect(row38.hasAttribute("data-sticky-bottom-edge")).toBe(false);
      expect(
        getComputedStyle(row38.querySelector("td") as Element).borderBottomColor
      ).not.toBe("rgba(0, 0, 0, 0)");
      expectTouching(rect("Row 3").bottom, rect("Row 5").top);
    });
  },
};

// ---------------------------------------------------------------------------
// Keyboard focus
// ---------------------------------------------------------------------------

const keyboardStickyRows = new Set(["row-2", "row-3", "row-38", "row-39"]);

/**
 * Arrow keys through a table with a top and a bottom stack. A focused row never
 * stays behind the header or another sticky row: React Aria scrolls it into
 * view with the scroll padding, and the table corrects a row that a new stack
 * covers after that scroll.
 */
export const StickyRowsKeyboardFocus: Story = {
  render: () => (
    <StackTable
      label="Keyboard focus"
      stickyRows={keyboardStickyRows}
      maxHeight="360px"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const header = canvasElement.querySelector("thead") as HTMLElement;

    // More than one pixel of each box lies inside the other.
    const overlaps = (a: DOMRect, b: DOMRect) =>
      a.bottom - 1 > b.top && a.top + 1 < b.bottom;

    /** Names of the header and sticky rows that cover the focused row. */
    const coveringTheFocusedRow = () => {
      const row = document.activeElement as HTMLElement;
      const rowRect = row.getBoundingClientRect();
      const covers: string[] = [];
      if (overlaps(header.getBoundingClientRect(), rowRect)) {
        covers.push("header");
      }
      canvasElement
        .querySelectorAll<HTMLElement>("[data-sticky-row]")
        .forEach((sticky) => {
          if (
            sticky !== row &&
            overlaps(sticky.getBoundingClientRect(), rowRect)
          ) {
            covers.push(sticky.textContent ?? "?");
          }
        });
      return covers;
    };

    /** Presses a key, waits for the focus to move, then for the row to be clear. */
    const press = async (key: string) => {
      const before = document.activeElement;
      await userEvent.keyboard(key);
      await waitFor(() => expect(document.activeElement).not.toBe(before));
      await waitFor(() => expect(coveringTheFocusedRow()).toEqual([]));
    };

    await step("Focus the first row", async () => {
      rowByName(canvas, "Row 1").focus();
      expect(document.activeElement).toBe(rowByName(canvas, "Row 1"));
    });

    await step(
      "ArrowDown to the last row never hides the focused row",
      async () => {
        for (let index = 0; index < 39; index += 1) await press("{ArrowDown}");
        expect(document.activeElement).toBe(rowByName(canvas, "Row 40"));
      }
    );

    await step(
      "ArrowUp back to the first row never hides it either",
      async () => {
        for (let index = 0; index < 39; index += 1) await press("{ArrowUp}");
        expect(document.activeElement).toBe(rowByName(canvas, "Row 1"));
      }
    );
  },
};

// ---------------------------------------------------------------------------
// scrollToRow
// ---------------------------------------------------------------------------

const scrollApi: { current: DataTableApi | null } = { current: null };

/** A table where a button changes `stickyRows`, then calls `scrollToRow` from an effect. */
const ScrollAfterStickyChange = () => {
  const [stickyRows, setStickyRows] = useState(new Set(["row-3", "row-5"]));
  const [rows] = useState(() => manyRows(40));
  const [callCount, setCallCount] = useState(0);
  useEffect(() => {
    if (callCount === 0) return;
    void scrollApi.current?.scrollToRow("row-20", { align: "start" });
  }, [callCount]);
  return (
    <Stack gap="400">
      <Button
        onPress={() => {
          setStickyRows(new Set(["row-3", "row-5", "row-10"]));
          setCallCount((count) => count + 1);
        }}
      >
        Make row 10 sticky and scroll
      </Button>
      <DataTable
        aria-label="Scroll after change"
        columns={nameColumns}
        rows={rows}
        stickyRows={stickyRows}
        maxHeight="480px"
        apiRef={scrollApi}
        size="md"
      />
    </Stack>
  );
};

/**
 * `scrollToRow` knows the stacks of the destination: a sticky row that is in
 * place now but stuck once the table has scrolled counts, and one that is not
 * stuck there does not. A sticky row that is stuck is already in place.
 */
export const StickyRowsScrollToRow: Story = {
  render: () => <StackTable stickyRows={stackStickyRows} apiRef={scrollApi} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);
    const api = () => scrollApi.current as DataTableApi;
    const rect = (name: string) =>
      rowByName(canvas, name).getBoundingClientRect();
    const toTop = async () => {
      root.scrollTop = 0;
      await nextFrames();
    };
    /** Calls `scrollToRow` and says which call resolved `false`. */
    const go = async (key: string, align: "start" | "end" | "center") => {
      const result = await api().scrollToRow(key, { align });
      expect(
        result,
        `scrollToRow(${key}, ${align}) at scrollTop ${root.scrollTop}`
      ).toBe(true);
    };

    await step(
      "Rows 3 and 5 are in place now but stuck at the destination: the row goes below both",
      async () => {
        await toTop();
        await go("row-20", "start");
        await nextFrames();
        expectTouching(rect("Row 5").bottom, rect("Row 20").top);
        expectTouching(rect("Row 3").bottom, rect("Row 5").top);
      }
    );

    await step("The bottom stack is kept clear with align end", async () => {
      await expect(api().scrollToRow("row-30", { align: "end" })).resolves.toBe(
        true
      );
      await nextFrames();
      expectTouching(rect("Row 30").bottom, rect("Row 38").top);
    });

    await step(
      "A sticky row that is not stuck at the destination is not counted",
      async () => {
        await toTop();
        // Row 4 lies between rows 3 and 5. At the destination only row 3 is
        // stuck above it, and row 5 stays in its own place just below row 4.
        await go("row-4", "start");
        await nextFrames();
        expectTouching(rect("Row 3").bottom, rect("Row 4").top);
        expectTouching(rect("Row 4").bottom, rect("Row 5").top);
      }
    );

    await step("A sticky row that is stuck is already in place", async () => {
      root.scrollTop = 800;
      await nextFrames();
      const before = root.scrollTop;
      await go("row-3", "center");
      await nextFrames();
      expect(root.scrollTop).toBe(before);
    });
  },
};

/** A call from an effect right after `stickyRows` changed uses the new stacks. */
export const StickyRowsScrollToRowAfterChange: Story = {
  render: () => <ScrollAfterStickyChange />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const rect = (name: string) =>
      rowByName(canvas, name).getBoundingClientRect();

    await step("The row goes below the three rows of the new set", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Make row 10 sticky and scroll" })
      );
      await waitFor(() => {
        expectTouching(rect("Row 10").bottom, rect("Row 20").top);
      });
      expectTouching(rect("Row 5").bottom, rect("Row 10").top);
      expectTouching(rect("Row 3").bottom, rect("Row 5").top);
    });
  },
};

// ---------------------------------------------------------------------------
// Look and stacking order
// ---------------------------------------------------------------------------

const backgroundOf = (element: Element) =>
  getComputedStyle(element).backgroundColor;

const TRANSPARENT = "rgba(0, 0, 0, 0)";

/** A serialized color without an alpha channel is fully opaque. */
const expectOpaque = (color: string) => {
  expect(color).not.toBe(TRANSPARENT);
  expect(color).not.toMatch(/rgba|\//);
};

const lookStickyRows = new Set(["row-3", "row-5", "row-7"]);

const LookTable = () => {
  const [rows] = useState(() => manyRows(40));
  return (
    <DataTable
      aria-label="Look"
      columns={nameColumns}
      rows={rows}
      stickyRows={lookStickyRows}
      selectionMode="multiple"
      defaultSelectedKeys={new Set(["row-5"])}
      disabledKeys={new Set(["row-7"])}
      maxHeight="480px"
      size="md"
    />
  );
};

/**
 * A sticky row has a highlight, and its frozen cells show the same background.
 * Selected wins over it. A stuck row is opaque in every state, also
 * when it is disabled, and draws its divider as an outline. The header is
 * above the stuck rows.
 */
export const StickyRowsLook: Story = {
  render: () => <LookTable />,
  play: async ({ canvasElement, step }) => {
    const row = (name: string) => bodyRow(canvasElement, name);
    const root = getRoot(canvasElement);

    await step(
      "A sticky row has a highlight, a normal row has none",
      async () => {
        expect(backgroundOf(row("Row 8"))).toBe(TRANSPARENT);
        expectOpaque(backgroundOf(row("Row 3")));
      }
    );

    await step("Its frozen cells show the same background", async () => {
      const row3 = row("Row 3");
      const frozen = row3.querySelectorAll<HTMLElement>(
        "td.data-table-sticky-cell"
      );
      expect(frozen.length).toBeGreaterThan(0);
      frozen.forEach((cell) =>
        expect(backgroundOf(cell)).toBe(backgroundOf(row3))
      );
    });

    // Hover is not tested here: `userEvent.hover` sends synthetic events, which
    // never turn on the CSS `:hover` state. The hover rule is far more specific
    // than the highlight (a plain attribute selector, see the recipe), so it wins.
    await step("Selected wins over the highlight", async () => {
      // Row 5 is selected, and sticky.
      expect(backgroundOf(row("Row 5"))).not.toBe(backgroundOf(row("Row 3")));
    });

    await step(
      "A stuck row is opaque, also when disabled or selected",
      async () => {
        root.scrollTop = 800;
        await nextFrames();
        for (const name of ["Row 3", "Row 5", "Row 7"]) {
          expectOpaque(backgroundOf(row(name)));
          // The row itself is not translucent. A disabled row dims its content.
          expect(getComputedStyle(row(name)).opacity).toBe("1");
        }
        const disabledContent = row("Row 7").querySelector("td > *") as Element;
        expect(getComputedStyle(disabledContent).opacity).toBe("0.5");
      }
    );

    await step(
      "The divider of a sticky row is a cell border, like any other row",
      async () => {
        // In a collapsed-border table the one-pixel line between two rows
        // belongs to the table, no cell paints it, and the rows under a stuck
        // row would show through it. A table with sticky rows uses separate
        // borders, so the divider is a border of the cells and moves with the
        // row. A play cannot read pixels: the seam was measured with
        // screenshots (see design.md).
        const table = canvasElement.querySelector("table") as Element;
        expect(getComputedStyle(table).borderCollapse).toBe("separate");
        const normalCell = getComputedStyle(
          row("Row 8").querySelector("td") as Element
        );
        expect(normalCell.borderBottomWidth).toBe("1px");
        for (const name of ["Row 3", "Row 5", "Row 7"]) {
          const stuck = row(name);
          const cell = getComputedStyle(stuck.querySelector("td") as Element);
          expect(cell.borderBottomWidth).toBe("1px");
          expect(cell.borderBottomStyle).toBe("solid");
          expect(cell.borderBottomColor).toBe(normalCell.borderBottomColor);
          // No second line on the row itself.
          expect(getComputedStyle(stuck).outlineStyle).toBe("none");
        }
      }
    );

    await step("A stuck row hides what scrolls under it", async () => {
      for (const name of ["Row 3", "Row 5", "Row 7"]) {
        const rect = row(name).getBoundingClientRect();
        const topmost = document.elementFromPoint(
          root.getBoundingClientRect().left + 40,
          rect.top + rect.height / 2
        );
        expect(topmost?.closest("tr")).toBe(row(name));
      }
    });

    await step("The header is above the stuck rows", async () => {
      const header = canvasElement.querySelector("thead") as Element;
      expect(Number(getComputedStyle(header).zIndex)).toBeGreaterThan(
        Number(getComputedStyle(row("Row 3")).zIndex)
      );
    });
  },
};

// ---------------------------------------------------------------------------
// Changes over time
// ---------------------------------------------------------------------------

type ChangingTableProps = {
  /** Called with the row id each time a row renders its cells. */
  onCellsRender: (rowId: string) => void;
};

const ChangingTable = ({ onCellsRender }: ChangingTableProps) => {
  const [stickyRows, setStickyRows] = useState(
    new Set(["row-3", "row-5", "row-38"])
  );
  const [rows] = useState(() => manyRows(40));
  const [isReversed, setIsReversed] = useState(false);
  const [search, setSearch] = useState("");
  const shownRows = useMemo(
    () => (isReversed ? [...rows].reverse() : rows),
    [rows, isReversed]
  );
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
      <Button
        onPress={() => setStickyRows((set) => new Set([...set, "row-7"]))}
      >
        Make row 7 sticky
      </Button>
      <Button
        onPress={() =>
          setStickyRows((set) => {
            const next = new Set(set);
            next.delete("row-3");
            return next;
          })
        }
      >
        Remove row 3
      </Button>
      <Button onPress={() => setIsReversed((value) => !value)}>
        Reverse the rows
      </Button>
      <Button onPress={() => setSearch("Row 9")}>Search for row 9</Button>
      <Button onPress={() => setSearch("")}>Clear the search</Button>
      <DataTable.Root
        columns={nameColumns}
        rows={shownRows}
        stickyRows={stickyRows}
        search={search}
        maxHeight="480px"
        size="md"
      >
        <DataTable.Table aria-label="Changes">
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

/**
 * The stacks follow the set, the row order and `search`. Sorting, a drag and
 * drop reorder and pinning all change the order the same way: the rows keep
 * their heights and move.
 */
export const StickyRowsChanges: StoryObj<ChangingTableProps> = {
  args: { onCellsRender: fn() },
  render: (args) => <ChangingTable {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = getRoot(canvasElement);
    const rect = (name: string) =>
      rowByName(canvas, name).getBoundingClientRect();
    const headerBottom = () =>
      canvasElement.querySelector("thead")!.getBoundingClientRect().bottom;
    const clientBottom = () =>
      root.getBoundingClientRect().top + root.clientTop + root.clientHeight;
    const click = (name: string) =>
      userEvent.click(canvas.getByRole("button", { name }));

    await step(
      "Scrolled down, rows 3 and 5 are stacked at the top",
      async () => {
        root.scrollTop = 600;
        await nextFrames();
        expectTouching(headerBottom(), rect("Row 3").top);
        expectTouching(rect("Row 3").bottom, rect("Row 5").top);
      }
    );

    await step("Adding a row to the set adds it to the stack", async () => {
      await click("Make row 7 sticky");
      await waitFor(() => {
        expectTouching(rect("Row 5").bottom, rect("Row 7").top);
      });
    });

    await step("Removing a row from the set closes the gap", async () => {
      await click("Remove row 3");
      await waitFor(() => {
        expectTouching(headerBottom(), rect("Row 5").top);
      });
      expectTouching(rect("Row 5").bottom, rect("Row 7").top);
    });

    await step("A new row order gives a new stack order", async () => {
      await click("Reverse the rows");
      // Reversed, row 38 comes first and is above the viewport; rows 7 and 5
      // are below it, in that order.
      await waitFor(() => {
        expectTouching(headerBottom(), rect("Row 38").top);
      });
      expectTouching(rect("Row 5").bottom, clientBottom());
      expectTouching(rect("Row 7").bottom, rect("Row 5").top);
    });

    await step(
      "Rows hidden by search leave no stack and no padding",
      async () => {
        await click("Search for row 9");
        await waitFor(() => {
          expect(canvas.queryByRole("row", { name: /^Row 5$/ })).toBeNull();
        });
        expect(canvas.queryByRole("row", { name: /^Row 7$/ })).toBeNull();
        expect(canvas.queryByRole("row", { name: /^Row 38$/ })).toBeNull();
        await waitFor(() => {
          expect(root.style.scrollPaddingTop).toBe("");
          expect(root.style.scrollPaddingBottom).toBe("");
        });
      }
    );

    await step("Clearing the search brings the stacks back", async () => {
      await click("Clear the search");
      await waitFor(() => {
        expect(canvas.queryByRole("row", { name: /^Row 5$/ })).not.toBeNull();
      });
      await scrollRootTo(root, 600);
      // Reversed, rows 7 and 5 are below the view and stack at the bottom.
      expectTouching(rect("Row 5").bottom, clientBottom());
      expectTouching(rect("Row 7").bottom, rect("Row 5").top);
      await waitFor(() => {
        expect(parseFloat(root.style.scrollPaddingBottom)).toBeGreaterThan(0);
      });
    });
  },
};

const longRows = (): DataTableRowItem[] =>
  Array.from({ length: 40 }, (_, index) => ({
    id: `row-${index + 1}`,
    name: `Row ${index + 1} ${"some text that wraps ".repeat(5)}`.trim(),
  }));

const wrappingColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "A header with enough words to wrap in a narrow table",
    accessor: (row: Record<string, unknown>) => row.name as ReactNode,
  },
];

const WrappingTable = ({ onCellsRender }: ChangingTableProps) => {
  const [rows] = useState(longRows);
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
    <div data-testid="wrapper" style={{ width: "900px" }}>
      <DataTable.Root
        columns={wrappingColumns}
        rows={rows}
        stickyRows={new Set(["row-3", "row-5"])}
        maxHeight="480px"
        size="md"
      >
        <DataTable.Table aria-label="Wrapping">
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
    </div>
  );
};

/**
 * When the table gets narrower, rows and the header wrap and grow. The stack
 * follows without a gap, and nothing re-renders: the sizes are measured and
 * written to the DOM, not kept in state.
 */
export const StickyRowsHeightChanges: StoryObj<ChangingTableProps> = {
  args: { onCellsRender: fn() },
  render: (args) => <WrappingTable {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const root = getRoot(canvasElement);
    const wrapper = canvasElement.querySelector(
      "[data-testid='wrapper']"
    ) as HTMLElement;
    const header = canvasElement.querySelector("thead") as HTMLElement;
    const stickyRow = (id: string) =>
      Array.from(
        canvasElement.querySelectorAll<HTMLElement>("[data-sticky-row]")
      ).find((element) => element.textContent?.startsWith(id)) as HTMLElement;

    let wideHeights: { header: number; row3: number };

    await step(
      "Scrolled down, rows 3 and 5 are stacked below the header",
      async () => {
        root.scrollTop = 700;
        await nextFrames();
        wideHeights = {
          header: header.getBoundingClientRect().height,
          row3: stickyRow("Row 3").getBoundingClientRect().height,
        };
        expectTouching(
          header.getBoundingClientRect().bottom,
          stickyRow("Row 3").getBoundingClientRect().top
        );
        expectTouching(
          stickyRow("Row 3").getBoundingClientRect().bottom,
          stickyRow("Row 5").getBoundingClientRect().top
        );
      }
    );

    await step(
      "A narrower table makes rows and header taller, and the stack follows",
      async () => {
        mocked(args.onCellsRender).mockClear();
        wrapper.style.width = "260px";
        await waitFor(() => {
          expect(
            stickyRow("Row 3").getBoundingClientRect().height
          ).toBeGreaterThan(wideHeights.row3);
        });
        await nextFrames();
        expectTouching(
          header.getBoundingClientRect().bottom,
          stickyRow("Row 3").getBoundingClientRect().top
        );
        expectTouching(
          stickyRow("Row 3").getBoundingClientRect().bottom,
          stickyRow("Row 5").getBoundingClientRect().top
        );
      }
    );

    await step("Nothing re-rendered because of the new sizes", async () => {
      expect(args.onCellsRender).not.toHaveBeenCalled();
    });
  },
};

// ---------------------------------------------------------------------------
// Pinned and expanded rows
// ---------------------------------------------------------------------------

const PinnedAndNestedTable = () => {
  const [rows] = useState(() => manyRows(40));
  return (
    <DataTable
      aria-label="Pinned and nested"
      columns={nameColumns}
      rows={rows}
      stickyRows={new Set(["row-20", "row-3"])}
      pinnedRows={new Set(["row-20"])}
      expandedRows={new Set(["row-3"])}
      renderNestedContent={() => (
        <div style={{ height: 120 }}>Nested panel</div>
      )}
      maxHeight="480px"
      size="md"
    />
  );
};

/**
 * A row that is pinned and sticky is first in the top stack, because pinned
 * rows come first in the row order. The nested panel of an expanded sticky row
 * is not sticky: it scrolls with the other rows.
 */
export const StickyRowsPinnedAndNested: Story = {
  render: () => <PinnedAndNestedTable />,
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);
    const row = (name: string) => bodyRow(canvasElement, name);
    const headerBottom = () =>
      canvasElement.querySelector("thead")!.getBoundingClientRect().bottom;

    await step(
      "Scrolled down, the pinned sticky row is first in the stack",
      async () => {
        root.scrollTop = 800;
        await nextFrames();
        expectTouching(
          headerBottom(),
          row("Row 20").getBoundingClientRect().top
        );
        expectTouching(
          row("Row 20").getBoundingClientRect().bottom,
          row("Row 3").getBoundingClientRect().top
        );
      }
    );

    await step("The nested panel is not sticky and scrolls away", async () => {
      const panel = canvasElement.querySelector(
        "[data-nested-row-expanded]"
      ) as HTMLElement;
      expect(panel).not.toBeNull();
      expect(getComputedStyle(panel).position).not.toBe("sticky");
      expect(panel.hasAttribute("data-sticky-row")).toBe(false);
      // At the top of the table it is visible under row 3, and it leaves with
      // the scroll instead of staying in the stack.
      expect(panel.getBoundingClientRect().bottom).toBeLessThan(
        headerBottom() + 1
      );
    });
  },
};

// ---------------------------------------------------------------------------
// Interaction: focus ring, frozen cells, drag
// ---------------------------------------------------------------------------

const wideColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    width: 200,
    accessor: (row: Record<string, unknown>) => row.name as ReactNode,
  },
  ...["a", "b", "c", "d", "e", "f"].map((id): DataTableColumnItem => ({
    id,
    header: id.toUpperCase(),
    width: 300,
    accessor: (row: Record<string, unknown>) => `${row.name} ${id}`,
  })),
];

type InteractionTableProps = {
  onRowAction: (row: DataTableRowItem) => void;
};

const InteractionTable = ({ onRowAction }: InteractionTableProps) => {
  const [rows] = useState(() => manyRows(40));
  return (
    <DataTable
      aria-label="Interaction"
      columns={wideColumns}
      rows={rows}
      stickyRows={new Set(["row-3"])}
      maxHeight="400px"
      onRowAction={onRowAction}
      size="md"
    />
  );
};

/**
 * A stuck row shows its whole focus ring, and a click on its frozen cell, after
 * the table has been scrolled sideways, reaches that row and not a row under it.
 */
export const StickyRowsFocusAndClick: StoryObj<InteractionTableProps> = {
  args: { onRowAction: fn() },
  render: (args) => <InteractionTable {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const root = getRoot(canvasElement);
    const row3 = () => bodyRow(canvasElement, "Row 3");

    await step("Scroll down and sideways, so row 3 is stuck", async () => {
      root.scrollTop = 600;
      root.scrollLeft = 300;
      await nextFrames();
      expect(row3().getBoundingClientRect().top).toBeLessThan(
        root.getBoundingClientRect().top + 100
      );
    });

    await step("The stuck row shows its focus ring", async () => {
      // A key press makes React Aria treat the next focus as keyboard focus.
      await userEvent.keyboard("{Shift}");
      row3().focus();
      await waitFor(() => expect(row3().matches(":focus-visible")).toBe(true));
      const ring = getComputedStyle(row3(), "::after");
      expect(ring.position).toBe("absolute");
      expect(ring.outlineStyle).not.toBe("none");
      // No other element covers the corners of the row, so the whole ring is
      // visible.
      const rect = row3().getBoundingClientRect();
      const left = root.getBoundingClientRect().left + 30;
      for (const y of [rect.top + 3, rect.bottom - 3]) {
        expect(document.elementFromPoint(left, y)?.closest("tr")).toBe(row3());
      }
    });

    await step("A click on the frozen cell reaches the stuck row", async () => {
      const pinCell = row3().querySelector(
        "td[data-slot='pin-row-cell']"
      ) as HTMLElement;
      const cell = pinCell.getBoundingClientRect();
      const atCorner = document.elementFromPoint(cell.left + 3, cell.top + 3);
      expect(atCorner?.closest("tr")).toBe(row3());
      await userEvent.click(atCorner as Element);
      await waitFor(() => expect(args.onRowAction).toHaveBeenCalledTimes(1), {
        timeout: 2000,
      });
      expect(mocked(args.onRowAction).mock.calls[0][0].id).toBe("row-3");
    });
  },
};

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

/**
 * Dispatches a native drag event on `el`, at `fraction` (0 top, 1 bottom) of its
 * height. A play cannot start a real drag.
 */
const dispatchDragEvent = (
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

const DragTable = () => {
  const [rows, setRows] = useState(() => manyRows(40));
  const { dragAndDropHooks } = useDragAndDrop({
    ...createArrayHandlers(setRows, (row) => row.id),
  });
  return (
    <DataTable
      aria-label="Drag"
      columns={nameColumns}
      rows={rows}
      stickyRows={new Set(["row-3", "row-38"])}
      dragAndDropHooks={dragAndDropHooks}
      maxHeight="400px"
      size="md"
    />
  );
};

/** A drag starts from a stuck row, with the pointer and with the keyboard. */
export const StickyRowsDrag: Story = {
  render: () => <DragTable />,
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);
    const row3 = () => bodyRow(canvasElement, "Row 3");
    const isDragging = () =>
      canvasElement.querySelector("[data-dragging='true']") !== null;

    await step("Scroll down, so row 3 is stuck", async () => {
      root.scrollTop = 600;
      await nextFrames();
    });

    await step(
      "The drag column has the dividers of the other columns",
      async () => {
        const dragCell = (name: string) =>
          bodyRow(canvasElement, name).querySelector(
            "[data-slot='drag']"
          ) as HTMLElement;
        const textCell = (name: string) =>
          Array.from(bodyRow(canvasElement, name).querySelectorAll("td")).find(
            (td) => td.textContent === name
          ) as HTMLElement;
        // A row between the stacks has the divider under it, like its text cell.
        expect(getComputedStyle(dragCell("Row 8")).borderBottomWidth).toBe(
          getComputedStyle(textCell("Row 8")).borderBottomWidth
        );
        expect(getComputedStyle(dragCell("Row 8")).borderBottomWidth).toBe(
          "1px"
        );
        // The first row of the bottom stack draws the line on its top.
        const start = bodyRow(canvasElement, "Row 38");
        expect(start.hasAttribute("data-sticky-bottom-start")).toBe(true);
        expect(getComputedStyle(dragCell("Row 38")).backgroundImage).toContain(
          "linear-gradient"
        );
        expect(getComputedStyle(dragCell("Row 38")).backgroundSize).toBe(
          "100% 1px"
        );
      }
    );

    await step("A pointer drag starts from the stuck row", async () => {
      const dataTransfer = createDataTransfer();
      dispatchDragEvent(row3(), "dragstart", dataTransfer);
      await waitFor(() => expect(isDragging()).toBe(true));
      dispatchDragEvent(row3(), "dragend", dataTransfer);
      await waitFor(() => expect(isDragging()).toBe(false));
    });

    await step("A keyboard drag starts from the stuck row", async () => {
      row3().focus();
      const handle = within(row3()).getByRole("button", {
        name: /drag to reorder/i,
      });
      // React Aria reads its focus state when the key arrives, so a key sent
      // right after `focus()` can be lost. Send it again until the handle has
      // focus, and only while the row still has it.
      await waitFor(async () => {
        if (document.activeElement === row3()) {
          await userEvent.keyboard("{ArrowRight}");
        }
        expect(handle).toHaveFocus();
      });
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(isDragging()).toBe(true));
      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(isDragging()).toBe(false));
    });
  },
};

// ---------------------------------------------------------------------------
// Product example: placing a new discount in a list of discounts
// ---------------------------------------------------------------------------

const discountNames = [
  "Welcome 10%",
  "Free shipping",
  "Back to school",
  "Black Friday",
  "Cyber Monday",
  "Loyalty 5%",
  "Bundle and save",
  "Spring clearance",
  "Student discount",
  "Newsletter signup",
  "Refer a friend",
  "Flash sale",
  "Birthday offer",
  "Winter warm-up",
  "Holiday gift",
  "Outlet 30%",
  "Summer sale",
  "VIP early access",
  "Gift card bonus",
  "Clearance 50%",
  "Weekend deal",
  "Member price",
  "First order",
  "Cart rescue",
];

const discountValues = ["10 % off", "Free shipping", "15 % off", "5 EUR off"];

const NEW_DISCOUNT_ID = "new-discount";

/**
 * The columns of the discounts. The first one shows the position of the row in
 * the current order, counted from 1. It is derived from `rows`, so it follows a
 * drop.
 */
const discountColumns = (rows: DataTableRowItem[]): DataTableColumnItem[] => [
  {
    id: "position",
    header: "#",
    // Pinned narrow: a `width` alone is a hint, and the table stretches columns.
    width: 56,
    minWidth: 56,
    maxWidth: 56,
    accessor: (row: Record<string, unknown>) => (
      <span data-position>
        {rows.findIndex((item) => item.id === row.id) + 1}
      </span>
    ),
  },
  nameColumn,
  {
    id: "value",
    header: "Discount",
    accessor: (row: Record<string, unknown>) => row.value as ReactNode,
  },
  {
    id: "status",
    header: "Status",
    accessor: (row: Record<string, unknown>) => row.status as ReactNode,
  },
];

/** The position the `#` column shows for the row called `name`. */
const positionOf = (canvasElement: HTMLElement, name: string) =>
  bodyRow(canvasElement, name).querySelector("[data-position]")?.textContent;

/**
 * The draft discount and the discounts around it, `rowCount` rows in total. The
 * first discounts have names, the rest are numbered.
 */
const discountRows = (
  newAt: "start" | "end",
  rowCount: number
): DataTableRowItem[] => {
  const existing = Array.from({ length: rowCount - 1 }, (_, index) => ({
    id: `discount-${index + 1}`,
    name: discountNames[index] ?? `Discount ${index + 1}`,
    value: discountValues[index % discountValues.length],
    status: "Active",
  }));
  const created = {
    id: NEW_DISCOUNT_ID,
    name: "New discount",
    value: "15 % off",
    status: "Draft",
  };
  return newAt === "start" ? [created, ...existing] : [...existing, created];
};

const newDiscountOnly = new Set([NEW_DISCOUNT_ID]);

/**
 * A list of discounts, with a draft discount that is placed in the list by
 * dragging. The draft is sticky, so it stays in reach at the top or bottom edge
 * while the list scrolls, and it is the only row that can be dragged.
 */
const DiscountsTable = ({
  newAt,
  rowCount = discountNames.length + 1,
}: {
  newAt: "start" | "end";
  rowCount?: number;
}) => {
  const [rows, setRows] = useState(() => discountRows(newAt, rowCount));
  const { dragAndDropHooks } = useDragAndDrop({
    ...createArrayHandlers(setRows, (row) => row.id),
  });
  const columns = useMemo(() => discountColumns(rows), [rows]);
  return (
    <DataTable
      aria-label="Discounts"
      columns={columns}
      rows={rows}
      stickyRows={newDiscountOnly}
      draggableKeys={newDiscountOnly}
      dragAndDropHooks={dragAndDropHooks}
      maxHeight="400px"
      size="md"
    />
  );
};

/** Drops the draft discount after `targetName` with mocked pointer drag events. */
const dropDraftAfter = async (
  canvasElement: HTMLElement,
  targetName: string
) => {
  const draft = bodyRow(canvasElement, "New discount");
  const dataTransfer = createDataTransfer();
  dispatchDragEvent(draft, "dragstart", dataTransfer);
  await waitFor(() =>
    expect(canvasElement.querySelector("[data-dragging='true']")).not.toBeNull()
  );
  const target = bodyRow(canvasElement, targetName);
  dispatchDragEvent(target, "dragenter", dataTransfer, 0.9);
  dispatchDragEvent(target, "dragover", dataTransfer, 0.9);
  await waitFor(() =>
    expect(canvasElement.querySelector("[data-drop-target]")).not.toBeNull()
  );
  dispatchDragEvent(target, "drop", dataTransfer, 0.9);
  dispatchDragEvent(draft, "dragend", dataTransfer);
  await waitFor(() =>
    expect(canvasElement.querySelector("[data-dragging='true']")).toBeNull()
  );
};

/** Only the draft discount has a drag handle. */
const expectOnlyDraftDraggable = (canvasElement: HTMLElement) => {
  const handles = within(canvasElement).getAllByRole("button", {
    name: /drag to reorder/i,
  });
  expect(handles).toHaveLength(1);
  expect(bodyRow(canvasElement, "New discount").contains(handles[0])).toBe(
    true
  );
};

/**
 * The draft discount starts first in a list of 100 rows. The list is scrolled
 * to the place where the discount belongs: the draft stays stuck under the header, and
 * is dropped between two discounts that are in view. Only the draft can be
 * dragged.
 */
export const StickyRowsNewDiscountFromTop: Story = {
  render: () => <DiscountsTable newAt="start" rowCount={100} />,
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);
    const header = canvasElement.querySelector("thead") as HTMLElement;
    const rect = (name: string) =>
      bodyRow(canvasElement, name).getBoundingClientRect();

    await step("Only the draft discount can be dragged", async () => {
      expectOnlyDraftDraggable(canvasElement);
    });

    await step("The draft starts at position 1", async () => {
      expect(positionOf(canvasElement, "New discount")).toBe("1");
    });

    await step(
      "Scrolled to the place for it, the draft stays under the header",
      async () => {
        const rowHeight = bodyRow(canvasElement, "New discount").offsetHeight;
        await scrollRootTo(root, rowHeight * 8);
        expectTouching(
          header.getBoundingClientRect().bottom,
          rect("New discount").top
        );
        expect(rect("Flash sale").top).toBeGreaterThan(
          rect("New discount").bottom
        );
      }
    );

    await step(
      "Dropped between two discounts, the draft is placed there",
      async () => {
        await dropDraftAfter(canvasElement, "Flash sale");
        await waitFor(() => {
          expect(
            bodyRow(canvasElement, "New discount").previousElementSibling
          ).toBe(bodyRow(canvasElement, "Flash sale"));
        });
        expect(bodyRow(canvasElement, "New discount").nextElementSibling).toBe(
          bodyRow(canvasElement, "Birthday offer")
        );
      }
    );

    await step("The position column follows the drop", async () => {
      // Flash sale was the 12th discount. The draft left position 1, so the
      // discounts moved up by one, and the draft is now 13th.
      await waitFor(() => {
        expect(positionOf(canvasElement, "New discount")).toBe("13");
      });
      expect(positionOf(canvasElement, "Flash sale")).toBe("12");
      expect(positionOf(canvasElement, "Birthday offer")).toBe("14");
    });
  },
};

/**
 * The draft discount starts last in the list, so it is stuck at the bottom
 * edge. It is dropped between two discounts at the top of the list, without
 * scrolling. Only the draft can be dragged.
 */
export const StickyRowsNewDiscountFromBottom: Story = {
  render: () => <DiscountsTable newAt="end" />,
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);

    await step("Only the draft discount can be dragged", async () => {
      expectOnlyDraftDraggable(canvasElement);
    });

    await step("The draft starts at position 25", async () => {
      expect(positionOf(canvasElement, "New discount")).toBe("25");
    });

    await step(
      "At the top of the list, the draft is stuck at the bottom",
      async () => {
        await scrollRootTo(root, 0);
        const bottom =
          root.getBoundingClientRect().top + root.clientTop + root.clientHeight;
        expectTouching(
          bodyRow(canvasElement, "New discount").getBoundingClientRect().bottom,
          bottom
        );
      }
    );

    await step(
      "Dropped between two discounts, the draft is placed there",
      async () => {
        await dropDraftAfter(canvasElement, "Back to school");
        await waitFor(() => {
          expect(
            bodyRow(canvasElement, "New discount").previousElementSibling
          ).toBe(bodyRow(canvasElement, "Back to school"));
        });
        expect(bodyRow(canvasElement, "New discount").nextElementSibling).toBe(
          bodyRow(canvasElement, "Black Friday")
        );
      }
    );

    await step("The position column follows the drop", async () => {
      // "Back to school" is the 3rd discount, so the draft is now 4th, and the
      // discounts after it moved down by one.
      await waitFor(() => {
        expect(positionOf(canvasElement, "New discount")).toBe("4");
      });
      expect(positionOf(canvasElement, "Back to school")).toBe("3");
      expect(positionOf(canvasElement, "Black Friday")).toBe("5");
    });
  },
};

// ---------------------------------------------------------------------------
// Warnings and the footer
// ---------------------------------------------------------------------------

const stickyWarnings: string[] = [];

/**
 * In development, `stickyRows` without `maxHeight` warns, and so do sticky rows
 * that are together taller than half of the table. A fitting set is quiet.
 */
export const StickyRowsWarnings: Story = {
  beforeEach: recordWarnings(stickyWarnings),
  render: () => (
    <Stack gap="800">
      <FlagTable
        label="No maxHeight"
        stickyRows={new Set(["row-2"])}
        maxH="300px"
      />
      <StackTable
        label="Tall stack"
        stickyRows={new Set(["row-2", "row-3", "row-4"])}
        maxHeight="240px"
      />
      <StackTable label="Fits" stickyRows={new Set(["row-2"])} />
    </Stack>
  ),
  play: async ({ step }) => {
    await step("stickyRows without maxHeight warns once", async () => {
      await waitFor(() =>
        expect(
          stickyWarnings.filter((warning) =>
            warning.includes("`stickyRows` has no effect without `maxHeight`")
          )
        ).toHaveLength(1)
      );
    });

    await step(
      "Sticky rows taller than half of the table warn once",
      async () => {
        await waitFor(() =>
          expect(
            stickyWarnings.filter((warning) =>
              warning.includes("taller together than half")
            )
          ).toHaveLength(1)
        );
      }
    );

    await step("Nothing else warns", async () => {
      expect(
        stickyWarnings.filter((warning) => warning.includes("[Nimbus]"))
      ).toHaveLength(2);
    });
  },
};

/** At the end of the scroll range, a footer is not covered by a stuck row. */
export const StickyRowsFooter: Story = {
  render: () => (
    <StackTable
      stickyRows={new Set(["row-2", "row-38", "row-39"])}
      footer={<div data-testid="footer">Footer</div>}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);
    const footer = () => canvasElement.querySelector("[data-testid='footer']")!;

    await step("At the end the footer is visible and uncovered", async () => {
      root.scrollTop = root.scrollHeight;
      await nextFrames();
      const footerRect = footer().getBoundingClientRect();
      const viewBottom =
        root.getBoundingClientRect().top + root.clientTop + root.clientHeight;
      expect(footerRect.bottom).toBeLessThanOrEqual(viewBottom + 1);
      canvasElement
        .querySelectorAll<HTMLElement>("[data-sticky-row]")
        .forEach((row) => {
          const rect = row.getBoundingClientRect();
          // The sticky row may touch the footer, but not cover it.
          expect(rect.bottom - 1).toBeLessThanOrEqual(footerRect.top);
        });
    });
  },
};

// ---------------------------------------------------------------------------
// Visual regression (Chromatic)
// ---------------------------------------------------------------------------

/**
 * Two sticky rows stuck at the top edge, below the header. The play scrolls
 * far enough, derived from the row height, and waits for the stack to settle,
 * so Chromatic captures the stuck state.
 */
export const StickyRowsStuckAtTop: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <StackTable
      label="Stuck at the top"
      stickyRows={new Set(["row-3", "row-5"])}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = getRoot(canvasElement);
    const header = canvasElement.querySelector("thead") as HTMLElement;
    await waitFor(() =>
      expect(canvasElement.querySelector("tbody tr")).not.toBeNull()
    );
    const rowHeight = (canvasElement.querySelector("tbody tr") as HTMLElement)
      .offsetHeight;
    await scrollRootTo(root, rowHeight * 12);
    await waitFor(() => {
      expectTouching(
        header.getBoundingClientRect().bottom,
        bodyRow(canvasElement, "Row 3").getBoundingClientRect().top
      );
    });
  },
};

/**
 * Two sticky rows stuck at the bottom edge. The table rests at the top, so both
 * rows are stuck at the bottom. The play waits for the stack to settle, so
 * Chromatic captures the stuck state.
 */
export const StickyRowsStuckAtBottom: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <StackTable
      label="Stuck at the bottom"
      stickyRows={new Set(["row-38", "row-39"])}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = getRoot(canvasElement);
    await waitFor(() =>
      expect(root.scrollHeight).toBeGreaterThan(root.clientHeight)
    );
    await waitFor(() => {
      const bottom =
        root.getBoundingClientRect().top + root.clientTop + root.clientHeight;
      expectTouching(
        bodyRow(canvasElement, "Row 39").getBoundingClientRect().bottom,
        bottom
      );
    });
  },
};

// ---------------------------------------------------------------------------
// Combined with other features: sorting, the frozen checkbox column, sizes
// ---------------------------------------------------------------------------

const SortStickyTable = () => {
  const [rows] = useState(() => manyRows(40));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  return (
    <DataTable
      aria-label="Sticky rows and sorting"
      columns={[{ ...nameColumn, isSortable: true }]}
      rows={rows}
      allowsSorting
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      stickyRows={new Set(["row-3"])}
      maxHeight="400px"
      size="md"
    />
  );
};

/**
 * Expected: the sticky row is a row id, not a position, so after a sort it is
 * still sticky and sticks where it now belongs.
 */
export const StickyRowsSorting: Story = {
  render: () => <SortStickyTable />,
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(root.scrollHeight).toBeGreaterThan(root.clientHeight)
    );
    const before = rowNames(canvasElement).indexOf("Row 3");

    await step("Sort by name, in the other direction", async () => {
      await userEvent.click(
        canvas.getByRole("columnheader", { name: /name/i })
      );
      await waitFor(() =>
        expect(rowNames(canvasElement).indexOf("Row 3")).not.toBe(before)
      );
    });

    await step("The row is still the sticky row", async () => {
      expect(bodyRow(canvasElement, "Row 3")).toHaveAttribute(
        "data-sticky-row"
      );
      expect(canvasElement.querySelectorAll("[data-sticky-row]")).toHaveLength(
        1
      );
    });

    await step("It sticks at the edge that its new place needs", async () => {
      const index = rowNames(canvasElement).indexOf("Row 3");
      // After the sort the row sits far below, so at the top it is stuck at
      // the bottom edge. If it sits above, it is in view or stuck at the top.
      root.scrollTop = 0;
      await nextFrames();
      const rect = bodyRow(canvasElement, "Row 3").getBoundingClientRect();
      if (index > 8) expectTouching(rect.bottom, rootBottom(root));
      else
        expect(rect.top).toBeGreaterThanOrEqual(
          headerBottom(canvasElement) - 1
        );
    });
  },
};

const FrozenColumnTable = () => {
  const [rows] = useState(() => manyRows(40));
  return (
    <DataTable
      aria-label="Frozen column and sticky rows"
      columns={wideColumns}
      selectionMode="multiple"
      rows={rows}
      stickyRows={new Set(["row-3"])}
      maxHeight="400px"
      size="md"
    />
  );
};

/**
 * Expected: scrolled down and sideways, the stuck row keeps its frozen checkbox
 * cell at the left edge, and that cell hides the cells that scroll under it.
 */
export const StickyRowsFrozenColumn: Story = {
  render: () => <FrozenColumnTable />,
  play: async ({ canvasElement }) => {
    const root = getRoot(canvasElement);
    await waitFor(() =>
      expect(root.scrollHeight).toBeGreaterThan(root.clientHeight)
    );
    root.scrollTop = 600;
    root.scrollLeft = 350;
    await nextFrames(3);

    const cell = bodyRow(canvasElement, "Row 3").querySelector(
      "td"
    ) as HTMLElement;
    const rect = cell.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();

    // The row is stuck under the header, and its first cell is at the left edge.
    expectTouching(headerBottom(canvasElement), rect.top);
    expect(
      Math.abs(rect.left - (rootRect.left + root.clientLeft))
    ).toBeLessThan(2);
    // Whatever is at the middle of that cell is that cell, so no other cell
    // is painted over it, and the cell is opaque.
    const hit = document.elementFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );
    expect(cell.contains(hit)).toBe(true);
    expect(getComputedStyle(cell).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
  },
};

const sizes: DataTableSize[] = ["sm", "md", "lg", "xl"];

const SizesStickyTable = () => (
  <Stack gap="600">
    {sizes.map((size) => (
      <DataTable
        key={size}
        aria-label={`Size ${size}`}
        data-size={size}
        columns={[nameColumn]}
        rows={manyRows(60)}
        stickyRows={new Set(["row-3", "row-4", "row-58", "row-59"])}
        maxHeight="320px"
        size={size}
      />
    ))}
  </Stack>
);

/**
 * Expected: at every size, two rows stick under the header and two at the
 * bottom edge, and they touch without a gap.
 */
export const StickyRowsSizes: Story = {
  render: () => <SizesStickyTable />,
  play: async ({ canvasElement }) => {
    const roots = Array.from(
      canvasElement.querySelectorAll<HTMLElement>("[data-scroll-left]")
    );
    expect(roots).toHaveLength(sizes.length);
    for (const root of roots) {
      await waitFor(() =>
        expect(root.scrollHeight).toBeGreaterThan(root.clientHeight)
      );
      // In the middle, rows 3 and 4 are stuck at the top, 58 and 59 at the bottom.
      root.scrollTop = root.scrollHeight / 2;
      await nextFrames(3);
      expectTouching(
        headerBottom(root),
        bodyRow(root, "Row 3").getBoundingClientRect().top
      );
      expectTouching(
        bodyRow(root, "Row 3").getBoundingClientRect().bottom,
        bodyRow(root, "Row 4").getBoundingClientRect().top
      );
      expectTouching(
        bodyRow(root, "Row 58").getBoundingClientRect().bottom,
        bodyRow(root, "Row 59").getBoundingClientRect().top
      );
      expectTouching(
        bodyRow(root, "Row 59").getBoundingClientRect().bottom,
        rootBottom(root)
      );
    }
  },
};

// ---------------------------------------------------------------------------
// Disabled sticky row with a custom cell of bare text
// ---------------------------------------------------------------------------

const TextCellsTable = () => {
  const [rows] = useState(() => manyRows(40));
  const body = useMemo(
    () => (
      <DataTable.Body>
        {(row, rowRenderProps) => (
          <DataTable.Row row={row} {...rowRenderProps}>
            {({ columns: cols }) =>
              cols.map((col) => (
                // A string child: the cell has no element inside.
                <DataTable.Cell key={col.id}>
                  {col.accessor(row)}
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
      columns={nameColumns}
      rows={rows}
      stickyRows={new Set(["row-3"])}
      disabledKeys={new Set(["row-3", "row-6"])}
      maxHeight="320px"
      size="md"
    >
      <DataTable.Table aria-label="Text cells">
        <DataTable.Header />
        {body}
      </DataTable.Table>
    </DataTable.Root>
  );
};

/**
 * A disabled sticky row stays opaque and dims its content. A custom cell that
 * holds bare text has no element to dim, so its text colour is faded.
 */
export const StickyRowsDisabledText: Story = {
  render: () => <TextCellsTable />,
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);
    const textColor = (name: string) =>
      getComputedStyle(
        bodyRow(canvasElement, name).querySelector("td") as Element
      ).color;

    await step("The cells hold bare text", async () => {
      const cell = bodyRow(canvasElement, "Row 3").querySelector("td")!;
      expect(cell.children).toHaveLength(0);
    });

    await step(
      "A disabled sticky row is opaque and its text is faded",
      async () => {
        await scrollRootTo(root, 600);
        const sticky = bodyRow(canvasElement, "Row 3");
        expect(getComputedStyle(sticky).opacity).toBe("1");
        expect(textColor("Row 3")).not.toBe(textColor("Row 4"));
      }
    );

    await step("The text is half transparent", async () => {
      // A disabled row that is not sticky fades through the opacity of its row.
      expect(textColor("Row 3")).toContain("/ 0.5");
      expect(getComputedStyle(bodyRow(canvasElement, "Row 6")).opacity).toBe(
        "0.5"
      );
    });
  },
};

// ---------------------------------------------------------------------------
// Keyboard focus in an expanded panel taller than the table
// ---------------------------------------------------------------------------

const TallPanelTable = () => {
  const [rows] = useState(() => manyRows(40));
  return (
    <DataTable
      aria-label="Tall panel"
      columns={nameColumns}
      rows={rows}
      stickyRows={new Set(["row-3"])}
      expandedRows={new Set(["row-3"])}
      renderNestedContent={() => (
        <div
          style={{
            height: 900,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <button type="button">First control</button>
          <button type="button">Last control</button>
        </div>
      )}
      maxHeight="480px"
      size="md"
    />
  );
};

/**
 * A control at the bottom of an expanded panel that is taller than the table
 * stays in view when the keyboard focuses it. The correction for rows behind
 * the stacks looks at the focused control then, and does not scroll the top of
 * the oversized panel into view.
 */
export const StickyRowsTallPanelFocus: Story = {
  render: () => <TallPanelTable />,
  play: async ({ canvasElement, step }) => {
    const root = getRoot(canvasElement);
    const canvas = within(canvasElement);

    await step("Focus the last control with the keyboard", async () => {
      await waitFor(() =>
        expect(root.scrollHeight).toBeGreaterThan(root.clientHeight)
      );
      // A key press first, so the focus counts as keyboard focus.
      await userEvent.keyboard("{Shift}");
      canvas.getByRole("button", { name: "Last control" }).focus();
      await nextFrames(8);
    });

    await step("It is still in view, below the stuck row", async () => {
      const control = canvas
        .getByRole("button", { name: "Last control" })
        .getBoundingClientRect();
      const stackBottom = bodyRow(
        canvasElement,
        "Row 3"
      ).getBoundingClientRect().bottom;
      expect(control.top).toBeGreaterThanOrEqual(stackBottom - 1);
      expect(control.bottom).toBeLessThanOrEqual(rootBottom(root) + 1);
    });
  },
};
