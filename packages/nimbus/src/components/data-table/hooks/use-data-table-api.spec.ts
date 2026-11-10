import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  onTestFinished,
} from "vitest";
import { createRef, type RefObject } from "react";
import { renderHook } from "@testing-library/react";
import { useDataTableApi } from "./use-data-table-api";
import type {
  DataTableApi,
  DataTableRegistry,
  DataTableRowItem,
} from "../data-table.types";

const ROW_HEIGHT = 50;
const HEADER_HEIGHT = 40;

type Setup = {
  api: () => DataTableApi;
  container: HTMLDivElement;
  registry: DataTableRegistry;
  setFocusedKey: ReturnType<typeof vi.fn>;
  scrollTo: ReturnType<typeof vi.fn>;
  rowElement: (key: string) => HTMLElement;
  unmount: () => void;
  rerender: (props: Partial<HookProps>) => void;
};

type HookProps = {
  sortedRows: DataTableRowItem[];
  disabledKeys?: "all" | Set<string>;
};

/** Frames are faked, so a test moves time by hand. */
const nextFrame = () => vi.advanceTimersByTimeAsync(16);

/**
 * A scroll container 400px high with 2000px of content, a 40px header and rows
 * 50px high. Row `r<n>` sits at `HEADER_HEIGHT + n * ROW_HEIGHT` from the top of
 * the content.
 */
const setup = ({
  rows = Array.from({ length: 30 }, (_, n) => ({ id: `r${n}` })),
  disabledKeys,
  scrollTop = 0,
  registerTable = true,
}: {
  rows?: DataTableRowItem[];
  disabledKeys?: "all" | Set<string>;
  scrollTop?: number;
  registerTable?: boolean;
} = {}): Setup => {
  const container = document.createElement("div");
  Object.defineProperty(container, "clientHeight", { value: 400 });
  Object.defineProperty(container, "scrollHeight", { value: 2000 });
  container.getBoundingClientRect = () => ({ top: 0, height: 400 }) as DOMRect;
  container.scrollTop = scrollTop;
  const scrollTo = vi.fn((options: ScrollToOptions) => {
    container.scrollTop = options.top ?? 0;
  });
  container.scrollTo = scrollTo as unknown as typeof container.scrollTo;

  const setFocusedKey = vi.fn();
  const header = document.createElement("div");
  header.style.position = "sticky";
  header.getBoundingClientRect = () =>
    ({ top: 0, height: HEADER_HEIGHT }) as DOMRect;

  const registry: DataTableRegistry = {
    rowElements: new Map(),
    headerElement: header,
    tableState: registerTable
      ? ({
          selectionManager: { setFocusedKey },
        } as unknown as DataTableRegistry["tableState"])
      : null,
  };
  const elements = new Map<string, HTMLElement>();
  rows.forEach((row, n) => {
    const element = document.createElement("div");
    element.tabIndex = -1;
    // Rows are measured from the viewport, so subtract the scroll position.
    element.getBoundingClientRect = () =>
      ({
        top: HEADER_HEIGHT + n * ROW_HEIGHT - container.scrollTop,
        height: ROW_HEIGHT,
      }) as DOMRect;
    document.body.append(element);
    elements.set(String(row.id), element);
    registry.rowElements.set(String(row.id), element);
  });

  const apiRef = createRef<DataTableApi>() as RefObject<DataTableApi | null>;
  const rootRef = { current: container } as RefObject<HTMLDivElement | null>;
  const { unmount, rerender } = renderHook(
    (props: HookProps) =>
      useDataTableApi({
        apiRef,
        rootRef,
        registry,
        sortedRows: props.sortedRows,
        getRowKey: (row) => String(row.id),
        disabledKeys: props.disabledKeys,
      }),
    { initialProps: { sortedRows: rows, disabledKeys } as HookProps }
  );

  return {
    api: () => apiRef.current as DataTableApi,
    container,
    registry,
    setFocusedKey,
    scrollTo,
    rowElement: (key) => elements.get(key) as HTMLElement,
    unmount,
    rerender: (props) =>
      rerender({ sortedRows: rows, disabledKeys, ...props } as HookProps),
  };
};

/**
 * JSDOM has `onscrollend` on every element, as current browsers do. To act like
 * a browser without the event, take it off the prototype. Returns a function
 * that puts it back.
 */
const removeScrollEndSupport = () => {
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "onscrollend"
  );
  Reflect.deleteProperty(HTMLElement.prototype, "onscrollend");
  return () => {
    if (descriptor) {
      Object.defineProperty(HTMLElement.prototype, "onscrollend", descriptor);
    }
  };
};

/**
 * The unit tests share one JSDOM window across spec files (`isolate: false`),
 * so a replaced `window.matchMedia` must be put back after each test. Other
 * specs render `NimbusProvider`, and `next-themes` calls `addListener` on the
 * result.
 */
const originalMatchMedia = window.matchMedia;

const mockReducedMotion = (matches: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
};

describe("useDataTableApi", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockReducedMotion(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    window.matchMedia = originalMatchMedia;
    document.body.replaceChildren();
  });

  describe("handle", () => {
    it("returns the scroll container", () => {
      const { api, container } = setup();
      expect(api().getScrollContainer()).toBe(container);
    });
  });

  describe("keys that are not shown", () => {
    it("resolves false for an unknown key without scrolling or focusing", async () => {
      const { api, scrollTo, setFocusedKey } = setup();
      const result = api().scrollToRow("nope");
      await nextFrame();
      await expect(result).resolves.toBe(false);
      expect(scrollTo).not.toHaveBeenCalled();
      expect(setFocusedKey).not.toHaveBeenCalled();
    });

    it("resolves false for a row that search removed from the shown rows", async () => {
      const { api, rerender, scrollTo } = setup();
      rerender({ sortedRows: [{ id: "r0" }] });
      const result = api().scrollToRow("r20");
      await nextFrame();
      await expect(result).resolves.toBe(false);
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("resolves false for a nested child row", async () => {
      const { api, scrollTo } = setup({
        rows: [{ id: "parent", children: [{ id: "child" }] }],
      });
      const result = api().scrollToRow("child");
      await nextFrame();
      await expect(result).resolves.toBe(false);
      expect(scrollTo).not.toHaveBeenCalled();
    });

    it("resolves false and warns in development when no Table registered", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { api } = setup({ registerTable: false });
      const result = api().scrollToRow("r5");
      await nextFrame();
      await expect(result).resolves.toBe(false);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("Table"));
    });
  });

  describe("scrolling", () => {
    it("scrolls instantly for behavior auto, below the header", async () => {
      const { api, scrollTo } = setup();
      const result = api().scrollToRow("r20", { align: "start" });
      await nextFrame();
      await nextFrame();
      await expect(result).resolves.toBe(true);
      // r20 is at 40 + 20 * 50 = 1040; the header is 40px high.
      expect(scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: "instant" });
    });

    it("does not scroll for a visible row with the default align", async () => {
      const { api, scrollTo, setFocusedKey } = setup();
      const result = api().scrollToRow("r2");
      await nextFrame();
      await nextFrame();
      await expect(result).resolves.toBe(true);
      expect(scrollTo).not.toHaveBeenCalled();
      expect(setFocusedKey).toHaveBeenCalledWith("r2");
    });

    it("does not leave room for a header that is not sticky", async () => {
      const { api, scrollTo, registry } = setup();
      (registry.headerElement as HTMLElement).style.position = "static";
      const result = api().scrollToRow("r20", { align: "start" });
      await nextFrame();
      await nextFrame();
      await expect(result).resolves.toBe(true);
      // r20 is at 1040 and nothing covers the top of the container.
      expect(scrollTo).toHaveBeenCalledWith({ top: 1040, behavior: "instant" });
    });

    it("stops at the end of the scroll range for a row near the end", async () => {
      // 40 rows: r39 starts at 40 + 39 * 50 = 1990, past the 1600 limit.
      const { api, scrollTo } = setup({
        rows: Array.from({ length: 40 }, (_, n) => ({ id: `r${n}` })),
      });
      const result = api().scrollToRow("r39", { align: "start" });
      await nextFrame();
      await nextFrame();
      await expect(result).resolves.toBe(true);
      expect(scrollTo).toHaveBeenCalledWith({ top: 1600, behavior: "instant" });
    });

    it("sets scrollTop when the container has no scrollTo", async () => {
      const { api, container } = setup();
      (container as { scrollTo?: unknown }).scrollTo = undefined;
      const result = api().scrollToRow("r20", { align: "start" });
      await nextFrame();
      await nextFrame();
      await expect(result).resolves.toBe(true);
      expect(container.scrollTop).toBe(1000);
    });
  });

  describe("smooth scrolling", () => {
    it("becomes instant when the user prefers reduced motion", async () => {
      mockReducedMotion(true);
      const { api, scrollTo } = setup();
      const result = api().scrollToRow("r20", {
        align: "start",
        behavior: "smooth",
      });
      await nextFrame();
      await nextFrame();
      await expect(result).resolves.toBe(true);
      expect(scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: "instant" });
    });

    it("resolves on scrollend when the browser has the event", async () => {
      const { api, container, scrollTo } = setup();
      (container as unknown as { onscrollend: null }).onscrollend = null;
      let settled = false;
      const result = api()
        .scrollToRow("r20", { align: "start", behavior: "smooth" })
        .then((value) => {
          settled = value;
          return value;
        });
      await nextFrame();
      expect(scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: "smooth" });
      // Frames pass without scrollend: still pending.
      await nextFrame();
      await nextFrame();
      await nextFrame();
      expect(settled).toBe(false);

      container.dispatchEvent(new Event("scrollend"));
      await expect(result).resolves.toBe(true);
    });

    it("resolves after two frames without movement when scrollend does not exist", async () => {
      const restoreScrollEnd = removeScrollEndSupport();
      onTestFinished(restoreScrollEnd);
      const { api, container } = setup();
      // Make the fake smooth scroll move in steps, then stop.
      container.scrollTo = vi.fn((options: ScrollToOptions) => {
        container.scrollTop = (options.top ?? 0) / 2;
      }) as never;
      let settled = false;
      const result = api()
        .scrollToRow("r20", { align: "start", behavior: "smooth" })
        .then((value) => {
          settled = true;
          return value;
        });
      await nextFrame(); // starts the scroll
      await nextFrame(); // first frame: position is new
      expect(settled).toBe(false);
      await nextFrame();
      await nextFrame();
      await expect(result).resolves.toBe(true);
    });

    it("resolves at once when the target is the current position", async () => {
      const { api, container, scrollTo } = setup({ scrollTop: 1000 });
      (container as unknown as { onscrollend: null }).onscrollend = null;
      const result = api().scrollToRow("r20", {
        align: "start",
        behavior: "smooth",
      });
      await nextFrame();
      await nextFrame();
      await expect(result).resolves.toBe(true);
      expect(scrollTo).not.toHaveBeenCalled();
    });
  });

  describe("focus", () => {
    it("sets the focused key without moving DOM focus by default", async () => {
      const { api, setFocusedKey, rowElement } = setup();
      const result = api().scrollToRow("r20", { align: "start" });
      await nextFrame();
      await nextFrame();
      await result;
      expect(setFocusedKey).toHaveBeenCalledWith("r20");
      expect(document.activeElement).not.toBe(rowElement("r20"));
    });

    it("moves DOM focus with focus true, without scrolling again", async () => {
      const { api, rowElement } = setup();
      const focus = vi.spyOn(rowElement("r20"), "focus");
      const result = api().scrollToRow("r20", { align: "start", focus: true });
      await nextFrame();
      await nextFrame();
      await result;
      expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    });

    it("scrolls to a disabled row but changes no focus", async () => {
      const { api, scrollTo, setFocusedKey, rowElement } = setup({
        disabledKeys: new Set(["r20"]),
      });
      const focus = vi.spyOn(rowElement("r20"), "focus");
      const result = api().scrollToRow("r20", { align: "start" });
      await nextFrame();
      await nextFrame();
      await expect(result).resolves.toBe(true);
      expect(scrollTo).toHaveBeenCalled();
      expect(setFocusedKey).not.toHaveBeenCalled();
      expect(focus).not.toHaveBeenCalled();
    });

    it("treats every row as disabled when disabledKeys is all", async () => {
      const { api, setFocusedKey } = setup({ disabledKeys: "all" });
      const result = api().scrollToRow("r3");
      await nextFrame();
      await nextFrame();
      await expect(result).resolves.toBe(true);
      expect(setFocusedKey).not.toHaveBeenCalled();
    });

    it("treats a row with isDisabled as disabled", async () => {
      const { api, setFocusedKey } = setup({
        rows: [{ id: "r0", isDisabled: true }],
      });
      const result = api().scrollToRow("r0");
      await nextFrame();
      await nextFrame();
      await expect(result).resolves.toBe(true);
      expect(setFocusedKey).not.toHaveBeenCalled();
    });

    it("warns in development when focus true is ignored for a disabled row", async () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { api } = setup({ disabledKeys: new Set(["r3"]) });
      const result = api().scrollToRow("r3", { focus: true });
      await nextFrame();
      await nextFrame();
      await result;
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("disabled"));
    });
  });

  describe("cancellation", () => {
    it("rejects the pending call with AbortError when a newer call starts", async () => {
      const { api } = setup();
      const first = api().scrollToRow("r10");
      const firstError = first.catch((error: unknown) => error);
      const second = api().scrollToRow("r20");
      const error = await firstError;
      expect(error).toBeInstanceOf(DOMException);
      expect((error as DOMException).name).toBe("AbortError");
      await nextFrame();
      await nextFrame();
      await expect(second).resolves.toBe(true);
    });

    it("rejects the pending call for any key of the newer call", async () => {
      const { api } = setup();
      const first = api().scrollToRow("r10");
      const firstError = first.catch((error: unknown) => error);
      const second = api().scrollToRow("unknown");
      await nextFrame();
      expect(((await firstError) as DOMException).name).toBe("AbortError");
      await expect(second).resolves.toBe(false);
    });

    it("rejects the pending call with AbortError on unmount", async () => {
      const { api, unmount } = setup();
      const pending = api().scrollToRow("r10", { align: "start" });
      const pendingError = pending.catch((error: unknown) => error);
      unmount();
      const error = await pendingError;
      expect((error as DOMException).name).toBe("AbortError");
    });

    it("does not scroll after the call was replaced", async () => {
      const { api, scrollTo } = setup();
      const first = api().scrollToRow("r10", { align: "start" });
      first.catch(() => {});
      const second = api().scrollToRow("r20", { align: "start" });
      await nextFrame();
      await nextFrame();
      await second;
      expect(scrollTo).toHaveBeenCalledTimes(1);
      expect(scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: "instant" });
    });
  });
});
