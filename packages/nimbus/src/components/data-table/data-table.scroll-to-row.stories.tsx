// DataTable stories for scrolling to a row (`apiRef.scrollToRow`).
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry. They test behavior only. No story in this file
// carries a Chromatic snapshot: the recipe is unchanged and
// data-table.stories.tsx owns the visuals.

import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createRef,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { within, expect, waitFor, userEvent, spyOn } from "storybook/test";
import { Button, DataTable, Stack, Text } from "@/components";
import type {
  DataTableApi,
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

type ApiRef = RefObject<DataTableApi | null>;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const columns: DataTableColumnItem[] = [
  {
    id: "name",
    header: "Name",
    accessor: (row: Record<string, unknown>) => row.name as ReactNode,
  },
];

const makeRows = (count = 60): DataTableRowItem[] =>
  Array.from({ length: count }, (_, n) => ({ id: `r${n}`, name: `Row ${n}` }));

const disabledRow30 = new Set(["r30"]);

/** The table, 400px high so that 60 rows need scrolling. */
const ScrollTable = ({
  apiRef,
  ...props
}: Partial<DataTableProps> & { apiRef: ApiRef }) => {
  const rows = useMemo(() => makeRows(), []);
  return (
    <DataTable
      columns={columns}
      rows={rows}
      maxHeight="400px"
      apiRef={apiRef}
      {...props}
    />
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getApi = (apiRef: ApiRef) =>
  waitFor(() => {
    expect(apiRef.current).not.toBeNull();
    return apiRef.current as DataTableApi;
  });

const containerOf = (api: DataTableApi) =>
  api.getScrollContainer() as HTMLDivElement;

const rowOf = (container: HTMLElement, name: string) =>
  within(container).getByRole("row", { name: new RegExp(`^${name}$`) });

/** Bottom edge of the sticky header, in viewport coordinates. */
const headerBottom = (container: HTMLElement) =>
  (
    container.querySelector(".data-table-header") as HTMLElement
  ).getBoundingClientRect().bottom;

/** Bottom edge of the visible area, in viewport coordinates. */
const areaBottom = (container: HTMLElement) =>
  container.getBoundingClientRect().top +
  container.clientTop +
  container.clientHeight;

const expectWithin1px = (actual: number, expected: number) =>
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1);

const expectFullyVisible = (container: HTMLElement, row: HTMLElement) => {
  const rect = row.getBoundingClientRect();
  expect(rect.top).toBeGreaterThanOrEqual(headerBottom(container) - 1);
  expect(rect.bottom).toBeLessThanOrEqual(areaBottom(container) + 1);
};

/** What a call settles with, so a rejection never goes unhandled. */
const outcomeOf = (promise: Promise<boolean>) =>
  promise.then(
    (value) => String(value),
    (error: Error) => error.name
  );

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

// ---------------------------------------------------------------------------
// Alignment
// ---------------------------------------------------------------------------

const alignApi: ApiRef = createRef<DataTableApi | null>();
const alignRootRef = createRef<HTMLDivElement>();

/**
 * `align` puts the row where it asks, below the sticky header. `"nearest"` is
 * the default and scrolls only as far as it has to. The first and last rows
 * stop at the edges. `getScrollContainer()` returns the element of `ref`.
 */
export const ScrollToRowAlign: Story = {
  render: () => <ScrollTable apiRef={alignApi} ref={alignRootRef} />,
  play: async ({ step }) => {
    const api = await getApi(alignApi);
    const container = containerOf(api);

    await step("getScrollContainer returns the element of ref", async () => {
      expect(api.getScrollContainer()).toBe(alignRootRef.current);
      expect(getComputedStyle(container).overflowY).toBe("auto");
    });

    await step("start puts the row right below the header", async () => {
      await expect(api.scrollToRow("r30", { align: "start" })).resolves.toBe(
        true
      );
      const rect = rowOf(container, "Row 30").getBoundingClientRect();
      expectWithin1px(rect.top, headerBottom(container));
    });

    await step("end puts the row at the bottom edge", async () => {
      container.scrollTo({ top: 0, behavior: "instant" });
      await expect(api.scrollToRow("r40", { align: "end" })).resolves.toBe(
        true
      );
      const rect = rowOf(container, "Row 40").getBoundingClientRect();
      expectWithin1px(rect.bottom, areaBottom(container));
    });

    await step(
      "center puts the row in the middle of the visible area",
      async () => {
        container.scrollTo({ top: 0, behavior: "instant" });
        await expect(api.scrollToRow("r25", { align: "center" })).resolves.toBe(
          true
        );
        const rect = rowOf(container, "Row 25").getBoundingClientRect();
        const middle = (headerBottom(container) + areaBottom(container)) / 2;
        expectWithin1px(rect.top + rect.height / 2, middle);
      }
    );

    await step("nearest: a visible row does not scroll", async () => {
      container.scrollTo({ top: 0, behavior: "instant" });
      const before = container.scrollTop;
      await expect(api.scrollToRow("r2")).resolves.toBe(true);
      expect(container.scrollTop).toBe(before);
    });

    await step(
      "nearest: a row below scrolls until its bottom edge shows",
      async () => {
        await expect(api.scrollToRow("r30")).resolves.toBe(true);
        const rect = rowOf(container, "Row 30").getBoundingClientRect();
        expectWithin1px(rect.bottom, areaBottom(container));
      }
    );

    await step(
      "nearest: a row above scrolls until it is below the header",
      async () => {
        await expect(api.scrollToRow("r20")).resolves.toBe(true);
        const rect = rowOf(container, "Row 20").getBoundingClientRect();
        expectWithin1px(rect.top, headerBottom(container));
      }
    );

    await step(
      "nearest: a row that is now fully visible does not scroll",
      async () => {
        const before = container.scrollTop;
        await expect(api.scrollToRow("r21")).resolves.toBe(true);
        expect(container.scrollTop).toBe(before);
      }
    );

    await step(
      "the last row stops at the end of the scroll range",
      async () => {
        await expect(api.scrollToRow("r59", { align: "start" })).resolves.toBe(
          true
        );
        expectWithin1px(
          container.scrollTop,
          container.scrollHeight - container.clientHeight
        );
        expectFullyVisible(container, rowOf(container, "Row 59"));
      }
    );

    await step("the first row stops at the start", async () => {
      await expect(api.scrollToRow("r0", { align: "end" })).resolves.toBe(true);
      expect(container.scrollTop).toBe(0);
      expectFullyVisible(container, rowOf(container, "Row 0"));
    });
  },
};

const unstickyApi: ApiRef = createRef<DataTableApi | null>();

/**
 * The header is sticky only with the `maxHeight` prop. When the table is sized
 * with a style prop instead, the header scrolls away with the rows, so it
 * covers nothing and the row goes to the very top.
 */
export const ScrollToRowHeaderNotSticky: Story = {
  render: () => (
    <ScrollTable apiRef={unstickyApi} maxHeight={undefined} maxH="400px" />
  ),
  play: async () => {
    const api = await getApi(unstickyApi);
    const container = containerOf(api);
    await expect(api.scrollToRow("r30", { align: "start" })).resolves.toBe(
      true
    );
    const rect = rowOf(container, "Row 30").getBoundingClientRect();
    // The inner top edge of the container, inside its border.
    expectWithin1px(
      rect.top,
      container.getBoundingClientRect().top + container.clientTop
    );
  },
};

// ---------------------------------------------------------------------------
// Keys that are not shown
// ---------------------------------------------------------------------------

const keysApi: ApiRef = createRef<DataTableApi | null>();

const KeysNotShownTable = () => {
  const [search, setSearch] = useState<string | undefined>();
  const rows = useMemo(
    () => [
      ...makeRows(),
      {
        id: "parent",
        name: "Parent",
        children: [{ id: "child", name: "Child" }],
      },
    ],
    []
  );
  return (
    <Stack>
      <Button onPress={() => setSearch("Row 5")}>Search for Row 5</Button>
      <DataTable
        columns={columns}
        rows={rows}
        nestedKey="children"
        search={search}
        maxHeight="400px"
        apiRef={keysApi}
      />
    </Stack>
  );
};

/**
 * A key that is not a shown row resolves `false`, without scrolling or
 * changing focus: an unknown key, a nested child row, and a row that `search`
 * hides.
 */
export const ScrollToRowKeysNotShown: Story = {
  render: () => <KeysNotShownTable />,
  play: async ({ canvasElement, step }) => {
    const api = await getApi(keysApi);
    const container = containerOf(api);
    const before = document.activeElement;

    await step("an unknown key resolves false", async () => {
      await expect(api.scrollToRow("nope")).resolves.toBe(false);
      expect(container.scrollTop).toBe(0);
      expect(document.activeElement).toBe(before);
    });

    await step(
      "a nested child row resolves false, its parent true",
      async () => {
        await expect(api.scrollToRow("child")).resolves.toBe(false);
        expect(container.scrollTop).toBe(0);
        await expect(api.scrollToRow("parent")).resolves.toBe(true);
      }
    );

    await step("a row hidden by search resolves false", async () => {
      container.scrollTo({ top: 0, behavior: "instant" });
      await userEvent.click(
        within(canvasElement).getByRole("button", { name: "Search for Row 5" })
      );
      await waitFor(() =>
        expect(
          within(container).queryByRole("row", { name: /^Row 20$/ })
        ).toBeNull()
      );
      await expect(api.scrollToRow("r20")).resolves.toBe(false);
      expect(container.scrollTop).toBe(0);
      await expect(api.scrollToRow("r5")).resolves.toBe(true);
    });
  },
};

const rootOnlyApi: ApiRef = createRef<DataTableApi | null>();
const rootOnlyWarnings: string[] = [];

/** `DataTable.Root` without `DataTable.Table` resolves `false` and warns. */
export const ScrollToRowWithoutTable: Story = {
  beforeEach: recordWarnings(rootOnlyWarnings),
  render: () => (
    <DataTable.Root columns={columns} rows={makeRows(5)} apiRef={rootOnlyApi}>
      <Text>No table here</Text>
    </DataTable.Root>
  ),
  play: async () => {
    const api = await getApi(rootOnlyApi);
    await expect(api.scrollToRow("r1")).resolves.toBe(false);
    expect(rootOnlyWarnings.some((message) => message.includes("Table"))).toBe(
      true
    );
  },
};

// ---------------------------------------------------------------------------
// Focus
// ---------------------------------------------------------------------------

const focusApi: ApiRef = createRef<DataTableApi | null>();
const focusWarnings: string[] = [];

/**
 * React Aria's focused row is always set. DOM focus moves only with
 * `focus: true`, and it keeps the chosen alignment. A disabled row is scrolled
 * to, but focus does not change, and `focus: true` is ignored with a
 * development warning.
 */
export const ScrollToRowFocus: Story = {
  beforeEach: recordWarnings(focusWarnings),
  render: () => (
    <Stack>
      <Button>Before the table</Button>
      <ScrollTable apiRef={focusApi} disabledKeys={disabledRow30} />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const api = await getApi(focusApi);
    const container = containerOf(api);
    const outside = within(canvasElement).getByRole("button", {
      name: "Before the table",
    });
    outside.focus();

    await step("sets the focused row without moving DOM focus", async () => {
      await expect(api.scrollToRow("r20", { align: "start" })).resolves.toBe(
        true
      );
      await waitFor(() => expect(rowOf(container, "Row 20").tabIndex).toBe(0));
      expect(outside).toHaveFocus();
    });

    await step(
      "moves DOM focus with focus true, keeping the alignment",
      async () => {
        await expect(
          api.scrollToRow("r45", { align: "start", focus: true })
        ).resolves.toBe(true);
        const row = rowOf(container, "Row 45");
        await waitFor(() => expect(row).toHaveFocus());
        await nextFrame();
        expectWithin1px(
          row.getBoundingClientRect().top,
          headerBottom(container)
        );
      }
    );

    await step(
      "a disabled row scrolls but takes no focus, and warns",
      async () => {
        await expect(
          api.scrollToRow("r30", { align: "start", focus: true })
        ).resolves.toBe(true);
        expectWithin1px(
          rowOf(container, "Row 30").getBoundingClientRect().top,
          headerBottom(container)
        );
        expect(rowOf(container, "Row 45")).toHaveFocus();
        expect(rowOf(container, "Row 30").tabIndex).not.toBe(0);
        expect(
          focusWarnings.some((message) => message.includes("disabled"))
        ).toBe(true);
      }
    );
  },
};

// ---------------------------------------------------------------------------
// Behavior
// ---------------------------------------------------------------------------

const behaviorApi: ApiRef = createRef<DataTableApi | null>();

/**
 * `"smooth"` resolves only after scrolling has stopped, and becomes instant
 * when the user prefers reduced motion.
 */
export const ScrollToRowBehavior: Story = {
  render: () => <ScrollTable apiRef={behaviorApi} />,
  play: async ({ step }) => {
    const api = await getApi(behaviorApi);
    const container = containerOf(api);

    await step("smooth resolves after scrolling has stopped", async () => {
      await expect(
        api.scrollToRow("r50", { align: "start", behavior: "smooth" })
      ).resolves.toBe(true);
      const settledAt = container.scrollTop;
      await nextFrame();
      await nextFrame();
      expect(container.scrollTop).toBe(settledAt);
      expectWithin1px(
        rowOf(container, "Row 50").getBoundingClientRect().top,
        headerBottom(container)
      );
    });

    await step("smooth is instant with reduced motion", async () => {
      const scrollTo = spyOn(container, "scrollTo");
      const original = window.matchMedia;
      window.matchMedia = ((query: string) =>
        query.includes("prefers-reduced-motion")
          ? ({ matches: true, media: query } as MediaQueryList)
          : original.call(window, query)) as typeof window.matchMedia;

      try {
        await expect(
          api.scrollToRow("r10", { align: "start", behavior: "smooth" })
        ).resolves.toBe(true);
        expect(scrollTo).toHaveBeenCalledWith(
          expect.objectContaining({ behavior: "instant" })
        );
        expectWithin1px(
          rowOf(container, "Row 10").getBoundingClientRect().top,
          headerBottom(container)
        );
      } finally {
        window.matchMedia = original;
        scrollTo.mockRestore();
      }
    });
  },
};

// ---------------------------------------------------------------------------
// Rows that change
// ---------------------------------------------------------------------------

type ChangingRowsProps = { apiRef: ApiRef; onSettled: (value: string) => void };

/**
 * Calls `scrollToRow` from an effect, right after the rows changed. "Reverse
 * rows" moves a row that already exists; "Add row" adds a row the table has
 * not seen before.
 */
const ChangingRows = ({ apiRef, onSettled }: ChangingRowsProps) => {
  const [reversed, setReversed] = useState(false);
  const [extra, setExtra] = useState(false);

  const rows = useMemo(() => {
    const base = makeRows();
    if (reversed) base.reverse();
    if (extra) base.push({ id: "added", name: "Added row" });
    return base;
  }, [reversed, extra]);

  useEffect(() => {
    const key = extra ? "added" : reversed ? "r0" : undefined;
    if (!key) return;
    apiRef.current
      ?.scrollToRow(key, { align: "end" })
      .then((value) => onSettled(String(value)))
      .catch((error: Error) => onSettled(error.name));
  }, [reversed, extra, apiRef, onSettled]);

  return (
    <Stack>
      <Button onPress={() => setReversed(true)}>Reverse rows</Button>
      <Button onPress={() => setExtra(true)}>Add row</Button>
      <DataTable
        columns={columns}
        rows={rows}
        maxHeight="400px"
        apiRef={apiRef}
      />
    </Stack>
  );
};

const changingApi: ApiRef = createRef<DataTableApi | null>();
const changingResult = { value: "" };

/**
 * A call from an effect right after the rows changed resolves `true`. This
 * covers a row that moved (the sort order changed) and a row that was just
 * added, which becomes React Aria's focused row.
 */
export const ScrollToRowAfterRowsChange: Story = {
  render: () => (
    <ChangingRows
      apiRef={changingApi}
      onSettled={(value) => (changingResult.value = value)}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const api = await getApi(changingApi);
    const container = containerOf(api);

    await step("a row that moved resolves true and is in view", async () => {
      changingResult.value = "";
      await userEvent.click(
        canvas.getByRole("button", { name: "Reverse rows" })
      );
      await waitFor(() => expect(changingResult.value).toBe("true"));
      // Row 0 is now the last row, and the call has brought it into view.
      expectFullyVisible(container, rowOf(container, "Row 0"));
    });

    await step(
      "a row that was just added resolves true and is focused",
      async () => {
        changingResult.value = "";
        await userEvent.click(canvas.getByRole("button", { name: "Add row" }));
        await waitFor(() => expect(changingResult.value).toBe("true"));
        const row = rowOf(container, "Added row");
        expectFullyVisible(container, row);
        await waitFor(() => expect(row.tabIndex).toBe(0));
      }
    );
  },
};

// ---------------------------------------------------------------------------
// Cancellation
// ---------------------------------------------------------------------------

const cancelApi: ApiRef = createRef<DataTableApi | null>();

const CancellableTable = () => {
  const [isShown, setIsShown] = useState(true);
  return (
    <Stack>
      <Button onPress={() => setIsShown(false)}>Remove table</Button>
      {isShown && <ScrollTable apiRef={cancelApi} />}
    </Stack>
  );
};

/**
 * A pending call rejects with an `AbortError` when a newer call replaces it
 * (for any key), and when the table is removed.
 */
export const ScrollToRowCancellation: Story = {
  render: () => <CancellableTable />,
  play: async ({ canvasElement, step }) => {
    const api = await getApi(cancelApi);
    const container = containerOf(api);

    await step("a newer call replaces a pending call", async () => {
      // The handler goes on when the call starts: the older call rejects as
      // soon as the newer one starts.
      const first = outcomeOf(api.scrollToRow("r10", { align: "start" }));
      const second = api.scrollToRow("r40", { align: "start" });
      expect(await first).toBe("AbortError");
      await expect(second).resolves.toBe(true);
      expectWithin1px(
        rowOf(container, "Row 40").getBoundingClientRect().top,
        headerBottom(container)
      );
    });

    await step("removing the table rejects a pending call", async () => {
      // Start the call and remove the table in the same tick. The call has not
      // had a frame yet, so it is pending whatever the speed of the machine.
      const pending = outcomeOf(
        api.scrollToRow("r40", { align: "start", behavior: "smooth" })
      );
      within(canvasElement)
        .getByRole("button", { name: "Remove table" })
        .click();
      expect(await pending).toBe("AbortError");
    });
  },
};
