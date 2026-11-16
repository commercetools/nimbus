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
};

const StackTable = ({
  label = "Sticky rows",
  stickyRows,
  // Tall enough that the rows in place at the top are clear of the bottom stack.
  maxHeight = "480px",
  rowCount = 40,
  apiRef,
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
