// DataTable stories for scrolling to a row (`apiRef.scrollToRow`).
// They share the title of data-table.stories.tsx, so Storybook lists them
// under one DataTable entry. They test behavior only and carry no Chromatic
// snapshot.

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
// No story in this file carries a Chromatic snapshot: the recipe is unchanged
// and data-table.stories.tsx owns the visuals.

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

const expectAbortError = (promise: Promise<unknown>) =>
  expect(promise).rejects.toMatchObject({ name: "AbortError" });

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

// ---------------------------------------------------------------------------
// Alignment
// ---------------------------------------------------------------------------

const alignApi: ApiRef = createRef<DataTableApi | null>();

/**
 * `align` puts the row at the top, middle or bottom of the visible area. The
 * visible area starts below the sticky header, so the header never covers the
 * row.
 */
export const ScrollToRowAlign: Story = {
  render: () => <ScrollTable apiRef={alignApi} />,
  play: async ({ step }) => {
    const api = await getApi(alignApi);
    const container = containerOf(api);

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
  },
};

const nearestApi: ApiRef = createRef<DataTableApi | null>();

/** `"nearest"` is the default. It scrolls only as far as it has to. */
export const ScrollToRowNearest: Story = {
  render: () => <ScrollTable apiRef={nearestApi} />,
  play: async ({ step }) => {
    const api = await getApi(nearestApi);
    const container = containerOf(api);

    await step("a visible row does not scroll", async () => {
      const before = container.scrollTop;
      await expect(api.scrollToRow("r2")).resolves.toBe(true);
      expect(container.scrollTop).toBe(before);
    });

    await step("a row below scrolls until its bottom edge shows", async () => {
      await expect(api.scrollToRow("r30")).resolves.toBe(true);
      const rect = rowOf(container, "Row 30").getBoundingClientRect();
      expectWithin1px(rect.bottom, areaBottom(container));
    });

    await step("a row above scrolls until it is below the header", async () => {
      await expect(api.scrollToRow("r20")).resolves.toBe(true);
      const rect = rowOf(container, "Row 20").getBoundingClientRect();
      expectWithin1px(rect.top, headerBottom(container));
    });

    await step("a row now fully visible does not scroll", async () => {
      const before = container.scrollTop;
      await expect(api.scrollToRow("r21")).resolves.toBe(true);
      expect(container.scrollTop).toBe(before);
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
    expectWithin1px(rect.top, container.getBoundingClientRect().top);
  },
};

const clampApi: ApiRef = createRef<DataTableApi | null>();

/** The first and last rows stop at the edges of the scroll range. */
export const ScrollToRowClampsAtEdges: Story = {
  render: () => <ScrollTable apiRef={clampApi} />,
  play: async ({ step }) => {
    const api = await getApi(clampApi);
    const container = containerOf(api);

    await step("the last row stops at the end", async () => {
      await expect(api.scrollToRow("r59", { align: "start" })).resolves.toBe(
        true
      );
      expectWithin1px(
        container.scrollTop,
        container.scrollHeight - container.clientHeight
      );
      expectFullyVisible(container, rowOf(container, "Row 59"));
    });

    await step("the first row stops at the start", async () => {
      await expect(api.scrollToRow("r0", { align: "end" })).resolves.toBe(true);
      expect(container.scrollTop).toBe(0);
      expectFullyVisible(container, rowOf(container, "Row 0"));
    });
  },
};

// ---------------------------------------------------------------------------
// Keys that are not shown
// ---------------------------------------------------------------------------

const unknownApi: ApiRef = createRef<DataTableApi | null>();

/** An unknown key resolves `false`, without scrolling or changing focus. */
export const ScrollToRowUnknownKey: Story = {
  render: () => <ScrollTable apiRef={unknownApi} />,
  play: async () => {
    const api = await getApi(unknownApi);
    const container = containerOf(api);
    const before = document.activeElement;
    await expect(api.scrollToRow("nope")).resolves.toBe(false);
    expect(container.scrollTop).toBe(0);
    expect(document.activeElement).toBe(before);
  },
};

const searchApi: ApiRef = createRef<DataTableApi | null>();

/** A row that `search` hides is not a shown row. */
export const ScrollToRowHiddenBySearch: Story = {
  render: () => <ScrollTable apiRef={searchApi} search="Row 5" />,
  play: async () => {
    const api = await getApi(searchApi);
    await expect(api.scrollToRow("r20")).resolves.toBe(false);
    await expect(api.scrollToRow("r5")).resolves.toBe(true);
  },
};

const nestedApi: ApiRef = createRef<DataTableApi | null>();

const nestedRows: DataTableRowItem[] = [
  {
    id: "parent",
    name: "Parent",
    children: [{ id: "child", name: "Child" }],
  },
];

/** A nested child row is shown only as a count, so it is not a shown row. */
export const ScrollToRowNestedChild: Story = {
  render: () => (
    <ScrollTable apiRef={nestedApi} rows={nestedRows} nestedKey="children" />
  ),
  play: async () => {
    const api = await getApi(nestedApi);
    await expect(api.scrollToRow("child")).resolves.toBe(false);
    await expect(api.scrollToRow("parent")).resolves.toBe(true);
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

/**
 * React Aria's focused key is always set. DOM focus moves only with
 * `focus: true`, and it keeps the chosen alignment.
 */
export const ScrollToRowFocus: Story = {
  render: () => (
    <Stack>
      <Button>Before the table</Button>
      <ScrollTable apiRef={focusApi} />
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const api = await getApi(focusApi);
    const container = containerOf(api);
    const outside = within(canvasElement).getByRole("button", {
      name: "Before the table",
    });
    outside.focus();

    await step("sets the focused key without moving DOM focus", async () => {
      await expect(api.scrollToRow("r30", { align: "start" })).resolves.toBe(
        true
      );
      await waitFor(() => expect(rowOf(container, "Row 30").tabIndex).toBe(0));
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
  },
};

const disabledApi: ApiRef = createRef<DataTableApi | null>();
const disabledWarnings: string[] = [];

/**
 * A disabled row is scrolled to, but focus does not change. `focus: true` is
 * ignored with a development warning.
 */
export const ScrollToRowDisabledRow: Story = {
  beforeEach: recordWarnings(disabledWarnings),
  render: () => (
    <Stack>
      <Button>Before the table</Button>
      <ScrollTable apiRef={disabledApi} disabledKeys={disabledRow30} />
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const api = await getApi(disabledApi);
    const container = containerOf(api);
    const outside = within(canvasElement).getByRole("button", {
      name: "Before the table",
    });
    outside.focus();

    await expect(
      api.scrollToRow("r30", { align: "start", focus: true })
    ).resolves.toBe(true);

    expectWithin1px(
      rowOf(container, "Row 30").getBoundingClientRect().top,
      headerBottom(container)
    );
    expect(outside).toHaveFocus();
    expect(rowOf(container, "Row 30").tabIndex).not.toBe(0);
    expect(
      disabledWarnings.some((message) => message.includes("disabled"))
    ).toBe(true);
  },
};

// ---------------------------------------------------------------------------
// Behavior
// ---------------------------------------------------------------------------

const motionApi: ApiRef = createRef<DataTableApi | null>();

/** `"smooth"` becomes instant when the user prefers reduced motion. */
export const ScrollToRowReducedMotion: Story = {
  render: () => <ScrollTable apiRef={motionApi} />,
  play: async () => {
    const api = await getApi(motionApi);
    const container = containerOf(api);
    const scrollTo = spyOn(container, "scrollTo");
    const original = window.matchMedia;
    window.matchMedia = ((query: string) =>
      query.includes("prefers-reduced-motion")
        ? ({ matches: true, media: query } as MediaQueryList)
        : original.call(window, query)) as typeof window.matchMedia;

    try {
      await expect(
        api.scrollToRow("r40", { align: "start", behavior: "smooth" })
      ).resolves.toBe(true);
      expect(scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: "instant" })
      );
      expectWithin1px(
        rowOf(container, "Row 40").getBoundingClientRect().top,
        headerBottom(container)
      );
    } finally {
      window.matchMedia = original;
      scrollTo.mockRestore();
    }
  },
};

const smoothApi: ApiRef = createRef<DataTableApi | null>();

/** A smooth scroll resolves only after scrolling has stopped. */
export const ScrollToRowSmooth: Story = {
  render: () => <ScrollTable apiRef={smoothApi} />,
  play: async () => {
    const api = await getApi(smoothApi);
    const container = containerOf(api);
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
  },
};

const containerApi: ApiRef = createRef<DataTableApi | null>();
const containerRootRef = createRef<HTMLDivElement>();

/** `getScrollContainer()` returns the element that `ref` points to. */
export const GetScrollContainer: Story = {
  render: () => <ScrollTable apiRef={containerApi} ref={containerRootRef} />,
  play: async () => {
    const api = await getApi(containerApi);
    const container = api.getScrollContainer();
    expect(container).toBe(containerRootRef.current);
    expect(getComputedStyle(container as HTMLElement).overflowY).toBe("auto");
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

/** A call from an effect after the sort order changed resolves `true`. */
export const ScrollToRowAfterReorder: Story = {
  render: () => (
    <ChangingRows
      apiRef={changingApi}
      onSettled={(value) => (changingResult.value = value)}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const api = await getApi(changingApi);
    changingResult.value = "";
    await userEvent.click(canvas.getByRole("button", { name: "Reverse rows" }));
    await waitFor(() => expect(changingResult.value).toBe("true"));
    const container = containerOf(api);
    // Row 0 is now the last row, and the call has brought it into view.
    expectFullyVisible(container, rowOf(container, "Row 0"));
  },
};

const addedApi: ApiRef = createRef<DataTableApi | null>();
const addedResult = { value: "" };

/**
 * A call from an effect right after a row was added resolves `true`, and the
 * new row becomes React Aria's focused key.
 */
export const ScrollToRowAfterRowAdded: Story = {
  render: () => (
    <ChangingRows
      apiRef={addedApi}
      onSettled={(value) => (addedResult.value = value)}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const api = await getApi(addedApi);
    addedResult.value = "";
    await userEvent.click(canvas.getByRole("button", { name: "Add row" }));
    await waitFor(() => expect(addedResult.value).toBe("true"));
    const container = containerOf(api);
    const row = rowOf(container, "Added row");
    expectFullyVisible(container, row);
    await waitFor(() => expect(row.tabIndex).toBe(0));
  },
};

// ---------------------------------------------------------------------------
// Cancellation
// ---------------------------------------------------------------------------

const abortApi: ApiRef = createRef<DataTableApi | null>();

/** A newer call replaces a pending call, for any key. */
export const ScrollToRowReplacedByNewerCall: Story = {
  render: () => <ScrollTable apiRef={abortApi} />,
  play: async () => {
    const api = await getApi(abortApi);
    const container = containerOf(api);
    const first = api.scrollToRow("r10", { align: "start" });
    const second = api.scrollToRow("r40", { align: "start" });
    await expectAbortError(first);
    await expect(second).resolves.toBe(true);
    expectWithin1px(
      rowOf(container, "Row 40").getBoundingClientRect().top,
      headerBottom(container)
    );
  },
};

const unmountApi: ApiRef = createRef<DataTableApi | null>();

const UnmountableTable = () => {
  const [isShown, setIsShown] = useState(true);
  return (
    <Stack>
      <Button onPress={() => setIsShown(false)}>Remove table</Button>
      {isShown && <ScrollTable apiRef={unmountApi} />}
    </Stack>
  );
};

/** Removing the table rejects a pending call. */
export const ScrollToRowUnmount: Story = {
  render: () => <UnmountableTable />,
  play: async ({ canvasElement }) => {
    const api = await getApi(unmountApi);
    // The rejection happens during the click, so the handler goes on first.
    const outcome = api
      .scrollToRow("r40", { align: "start", behavior: "smooth" })
      .then(
        () => "resolved",
        (error: Error) => error.name
      );
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Remove table" })
    );
    expect(await outcome).toBe("AbortError");
  },
};
