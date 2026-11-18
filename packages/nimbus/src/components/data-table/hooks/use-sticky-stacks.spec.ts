import { describe, it, expect, vi, afterEach } from "vitest";
import type { RefObject } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useStickyStacks } from "./use-sticky-stacks";
import type { DataTableRegistry } from "../utils/registry.types";

const ROW_HEIGHT = 50;
const HEADER_HEIGHT = 40;
const REACH = "--data-table-sticky-reach";

const FIREFOX =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:132.0) Gecko/20100101 Firefox/132.0";
const CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

/**
 * A root that scrolls, with a 40px sticky header and a body of 30 rows, 50px
 * high. The table starts at the top of the content, so row `n` starts at
 * `HEADER_HEIGHT + n * ROW_HEIGHT`.
 */
const setup = (stickyIndexes: number[]) => {
  const root = document.createElement("div");
  Object.defineProperty(root, "clientHeight", { value: 400 });
  root.getBoundingClientRect = () => ({ top: 0, height: 400 }) as DOMRect;

  const table = document.createElement("table");
  table.getBoundingClientRect = () =>
    ({ top: -root.scrollTop, height: 1540 }) as DOMRect;
  const header = table.createTHead();
  header.style.position = "sticky";
  header.getBoundingClientRect = () =>
    ({ top: 0, height: HEADER_HEIGHT }) as DOMRect;
  const body = table.createTBody();
  const rows = Array.from({ length: 30 }, (_, index) => {
    const row = body.insertRow();
    row.getBoundingClientRect = () => ({ height: ROW_HEIGHT }) as DOMRect;
    if (stickyIndexes.includes(index)) row.setAttribute("data-sticky-row", "");
    return row;
  });
  root.append(table);
  document.body.append(root);

  const registry: DataTableRegistry = {
    rowElements: new Map(),
    headerElement: header,
    tableState: null,
  };
  const rootRef = { current: root } as RefObject<HTMLDivElement | null>;
  const stickyRows = new Set(stickyIndexes.map(String));
  const { unmount } = renderHook(() =>
    useStickyStacks({
      rootRef,
      registry,
      isEnabled: true,
      stickyRows,
      sortedRows: rows,
    })
  );
  return {
    rows,
    unmount: () => {
      unmount();
      root.remove();
    },
  };
};

const pretendUserAgent = (userAgent: string) =>
  vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(userAgent);

describe("useStickyStacks: the reach of sticky rows in Firefox", () => {
  let current: ReturnType<typeof setup> | undefined;

  afterEach(() => {
    current?.unmount();
    current = undefined;
    vi.restoreAllMocks();
  });

  it("sets the natural distance from the top of the content on each sticky row", () => {
    pretendUserAgent(FIREFOX);
    current = setup([3, 25]);
    const { rows } = current;
    expect(rows[3].style.getPropertyValue(REACH)).toBe(
      `${HEADER_HEIGHT + 3 * ROW_HEIGHT}px`
    );
    expect(rows[25].style.getPropertyValue(REACH)).toBe(
      `${HEADER_HEIGHT + 25 * ROW_HEIGHT}px`
    );
    expect(rows[4].style.getPropertyValue(REACH)).toBe("");
  });

  it("removes it when a row stops being sticky, and on unmount", async () => {
    pretendUserAgent(FIREFOX);
    current = setup([3, 25]);
    const { rows } = current;
    rows[25].removeAttribute("data-sticky-row");
    await waitFor(() => {
      expect(rows[25].style.getPropertyValue(REACH)).toBe("");
    });
    expect(rows[3].style.getPropertyValue(REACH)).not.toBe("");

    current.unmount();
    current = undefined;
    expect(rows[3].style.getPropertyValue(REACH)).toBe("");
  });

  it("does not set it in other browsers", () => {
    pretendUserAgent(CHROME);
    current = setup([3, 25]);
    const { rows } = current;
    expect(rows[3].style.getPropertyValue("--data-table-sticky-top")).not.toBe(
      ""
    );
    expect(rows[3].style.getPropertyValue(REACH)).toBe("");
    expect(rows[25].style.getPropertyValue(REACH)).toBe("");
  });
});
