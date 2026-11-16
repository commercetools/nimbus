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
} from "./data-table.types";
import { recordWarnings } from "./utils/data-table.test-utils";

const meta: Meta<object> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;

type Story = StoryObj<DataTableProps>;

const stickyColumns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row: Record<string, unknown>) => row.name as ReactNode,
  },
  {
    id: "flag",
    header: "isSticky",
    accessor: () => null,
  },
];

const nameColumns: DataTableColumnItem[] = [stickyColumns[0]];

const makeRows = (): DataTableRowItem[] =>
  ["A", "B", "C", "D", "E"].map((id) => ({ id, name: `Row ${id}` }));

const rowNamedExactly = (canvas: ReturnType<typeof within>, name: string) =>
  canvas.getByRole("row", { name: new RegExp(`^${name}`) });

type FlagTableProps = {
  label: string;
  stickyRows?: Set<string>;
  /** The `maxHeight` prop. Rows only stick with it. */
  maxHeight?: string;
  /** Sizes the table with the `maxH` style prop, which is not `maxHeight`. */
  maxH?: string;
};

/** A table whose cells print the `isSticky` flag of their row. */
const FlagTable = ({ label, stickyRows, maxHeight, maxH }: FlagTableProps) => {
  const [rows] = useState<DataTableRowItem[]>(makeRows);
  const body = useMemo(
    () => (
      <DataTable.Body>
        {(row, rowRenderProps) => (
          <DataTable.Row row={row} {...rowRenderProps}>
            {({ columns: cols }) =>
              cols.map((col) => (
                <DataTable.Cell key={col.id}>
                  {col.id === "flag"
                    ? `${row.id}:${String(rowRenderProps.isSticky)}`
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
      columns={stickyColumns}
      rows={rows}
      stickyRows={stickyRows}
      maxHeight={maxHeight}
      maxH={maxH}
      size="md"
    >
      <DataTable.Table aria-label={label}>
        <DataTable.Header />
        {body}
      </DataTable.Table>
    </DataTable.Root>
  );
};

const ALL_IDS = ["A", "B", "C", "D", "E"];

/** Asserts which rows of a table print `isSticky` `true`. */
const expectStickyFlags = (table: HTMLElement, stickyIds: string[]) => {
  for (const id of ALL_IDS) {
    expect(
      within(table).getByText(`${id}:${String(stickyIds.includes(id))}`)
    ).toBeInTheDocument();
  }
};

const flagWarnings: string[] = [];

/**
 * Custom row render functions get `isSticky`. It is `true` only for rows in
 * `stickyRows`, and only while the table has `maxHeight`. An id that is not a
 * row is ignored without an error. An empty set and a missing `stickyRows`
 * make no row sticky.
 */
export const StickyRowsRenderProp: Story = {
  beforeEach: recordWarnings(flagWarnings),
  render: () => (
    <Stack gap="800">
      <div data-testid="sticky">
        <FlagTable
          label="Sticky rows"
          stickyRows={new Set(["B", "D", "unknown-id"])}
          maxHeight="300px"
        />
      </div>
      <div data-testid="empty">
        <FlagTable label="Empty set" stickyRows={new Set()} maxHeight="300px" />
      </div>
      <div data-testid="unset">
        <FlagTable label="No stickyRows" maxHeight="300px" />
      </div>
      <div data-testid="no-max-height">
        <FlagTable
          label="No maxHeight"
          stickyRows={new Set(["B", "D"])}
          maxH="300px"
        />
      </div>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Only rows in the set are sticky", async () => {
      expectStickyFlags(canvas.getByTestId("sticky"), ["B", "D"]);
    });

    await step("An id that is not a row is ignored", async () => {
      const table = within(canvas.getByTestId("sticky"));
      expect(table.queryByText(/unknown-id/)).not.toBeInTheDocument();
      expect(table.getAllByRole("row")).toHaveLength(ALL_IDS.length + 1);
    });

    await step("An empty set makes no row sticky", async () => {
      expectStickyFlags(canvas.getByTestId("empty"), []);
    });

    await step("Without stickyRows no row is sticky", async () => {
      expectStickyFlags(canvas.getByTestId("unset"), []);
    });

    await step("Without maxHeight no row is sticky", async () => {
      expectStickyFlags(canvas.getByTestId("no-max-height"), []);
    });

    await step("Only sticky rows get the sticky attribute", async () => {
      const stickyTable = canvas.getByTestId("sticky");
      expect(
        Array.from(stickyTable.querySelectorAll("[data-sticky-row]")).map(
          (row) => row.textContent?.match(/Row ([A-E])/)?.[1]
        )
      ).toEqual(["B", "D"]);
      expect(
        canvas.getByTestId("no-max-height").querySelector("[data-sticky-row]")
      ).toBeNull();
    });
  },
};

type RenderCountTableProps = {
  /** Called with the row id each time a row renders its cells. */
  onCellsRender: (rowId: string) => void;
};

const RenderCountTable = ({ onCellsRender }: RenderCountTableProps) => {
  const [stickyRows, setStickyRows] = useState(new Set(["C"]));
  // Created once: new row objects on every render would re-render every row.
  const [rows] = useState<DataTableRowItem[]>(makeRows);
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
      <Button onPress={() => setStickyRows(new Set(["C", "D"]))}>
        Make D sticky
      </Button>
      <DataTable.Root
        columns={nameColumns}
        rows={rows}
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

/** Changing `stickyRows` re-renders only the rows whose flag changed. */
export const StickyRowsRenderOnlyChangedRows: StoryObj<RenderCountTableProps> =
  {
    args: { onCellsRender: fn() },
    render: (args) => <RenderCountTable {...args} />,
    play: async ({ canvasElement, args, step }) => {
      const canvas = within(canvasElement);

      await step("Adding D to the set renders only row D", async () => {
        mocked(args.onCellsRender).mockClear();
        await userEvent.click(
          canvas.getByRole("button", { name: "Make D sticky" })
        );
        await waitFor(() => {
          expect(
            rowNamedExactly(canvas, "Row D").hasAttribute("data-sticky-row")
          ).toBe(true);
        });
        // Only row D changed, so only row D renders.
        const rendered = new Set(
          mocked(args.onCellsRender).mock.calls.map(([id]) => id)
        );
        expect([...rendered]).toEqual(["D"]);
      });
    },
  };

// ---------------------------------------------------------------------------
// Stacks: the layout of sticky rows in a scroll area
// ---------------------------------------------------------------------------

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

const rowByName = (canvas: ReturnType<typeof within>, name: string) =>
  canvas.getByRole("row", { name: new RegExp(`^${name}$`) });

/** Two stuck rows are within a pixel of each other: stacked without a gap. */
const expectTouching = (above: number, below: number) =>
  expect(Math.abs(below - above)).toBeLessThan(1);

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
  return (
    <DataTable
      aria-label={label}
      columns={nameColumns}
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

/** The row of the table body whose cell text is exactly `name`. */
const bodyRow = (canvasElement: HTMLElement, name: string) => {
  const found = Array.from(canvasElement.querySelectorAll("tbody tr")).find(
    (tr) =>
      Array.from(tr.querySelectorAll("td")).some(
        (td) => td.textContent?.trim() === name
      )
  );
  if (!found) throw new Error(`Row "${name}" was not found`);
  return found as HTMLElement;
};

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
 * when it is disabled, and draws its bottom line on its cells. The header is
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

    await step("The bottom line is drawn on the cells", async () => {
      const row3 = row("Row 3");
      expect(getComputedStyle(row3).borderBottomStyle).toBe("none");
      expect(
        getComputedStyle(row3.querySelector("td") as Element).boxShadow
      ).toContain("inset");
    });

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

/** Dispatches a native drag event on `el`. A play cannot start a real drag. */
const dispatchDragEvent = (
  el: Element,
  type: "dragstart" | "dragend",
  dataTransfer: ReturnType<typeof createDataTransfer>
) => {
  const rect = el.getBoundingClientRect();
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
  Object.defineProperty(event, "clientX", {
    value: rect.left + rect.width / 2,
  });
  Object.defineProperty(event, "clientY", {
    value: rect.top + rect.height / 2,
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
      stickyRows={new Set(["row-3"])}
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
