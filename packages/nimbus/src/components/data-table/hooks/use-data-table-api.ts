import {
  useEffect,
  useImperativeHandle,
  useRef,
  type Ref,
  type RefObject,
} from "react";
import type { Selection } from "react-aria-components";
import type {
  DataTableApi,
  DataTableRegistry,
  DataTableRowItem,
  DataTableScrollToRowOptions,
} from "../data-table.types";
import type { DataTableRowKeyResolver } from "../utils/row-keys.utils";
import { computeTargetScrollTop } from "../utils/scroll-to-row.utils";

type UseDataTableApiParams<T extends object> = {
  apiRef: Ref<DataTableApi> | undefined;
  /** The element that scrolls. */
  rootRef: RefObject<HTMLDivElement | null>;
  registry: DataTableRegistry;
  /** The rows on screen: sorted, with the search applied. */
  sortedRows: DataTableRowItem<T>[];
  getRowKey: DataTableRowKeyResolver<T>;
  disabledKeys?: Selection;
};

/** A call that has not settled yet. */
type PendingCall = { abort: (message: string) => void };

const isDevelopment = () => process.env.NODE_ENV !== "production";

/**
 * The parts of the scroll container that cover rows. A sticky header stays on
 * top while rows scroll under it, so it is the top inset. A header that is not
 * sticky (the table has no `maxHeight` prop) scrolls away with the rows and
 * covers nothing. Nothing covers the bottom. This is the one place that decides
 * what covers rows.
 */
const getScrollInsets = (registry: DataTableRegistry) => {
  const header = registry.headerElement;
  const isHeaderSticky =
    !!header && window.getComputedStyle(header).position === "sticky";
  return {
    topInset: isHeaderSticky ? header.getBoundingClientRect().height : 0,
    bottomInset: 0,
  };
};

/** Whether the browser fires `scrollend`. Older Safari versions do not. */
const hasScrollEndEvent = (element: Element): boolean =>
  "onscrollend" in element;

const prefersReducedMotion = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Fills `apiRef` with `scrollToRow` and `getScrollContainer`.
 *
 * The handle is created once. It reads the rows, the disabled keys and the
 * registry when a call runs, never when the handle was created: React Aria
 * gives the table a new state object on every render, and an old one does not
 * know about rows that were added after it was made.
 */
export const useDataTableApi = <T extends object>({
  apiRef,
  rootRef,
  registry,
  sortedRows,
  getRowKey,
  disabledKeys,
}: UseDataTableApiParams<T>) => {
  const latestRef = useRef({ sortedRows, getRowKey, disabledKeys });
  latestRef.current = { sortedRows, getRowKey, disabledKeys };

  const pendingRef = useRef<PendingCall | null>(null);

  useImperativeHandle(
    apiRef,
    () => ({
      getScrollContainer: () => rootRef.current,

      scrollToRow: (key: string, options: DataTableScrollToRowOptions = {}) =>
        new Promise<boolean>((resolve, reject) => {
          pendingRef.current?.abort("Replaced by a newer scrollToRow call");

          const cleanups: Array<() => void> = [];
          let isDone = false;
          const finish = (settle: () => void) => {
            if (isDone) return;
            isDone = true;
            cleanups.forEach((cleanup) => cleanup());
            if (pendingRef.current === call) pendingRef.current = null;
            settle();
          };
          const call: PendingCall = {
            abort: (message) =>
              finish(() => reject(new DOMException(message, "AbortError"))),
          };
          pendingRef.current = call;

          const onFrame = (callback: () => void) => {
            const id = requestAnimationFrame(callback);
            cleanups.push(() => cancelAnimationFrame(id));
          };
          const resolveWith = (value: boolean) => finish(() => resolve(value));

          // The consumer may call right after the rows changed, from an
          // effect. React Aria has not rendered the new rows at that moment,
          // so the first read waits one frame.
          onFrame(() => {
            const latest = latestRef.current;
            const row = latest.sortedRows.find(
              (item) => latest.getRowKey(item) === key
            );
            if (!row) return resolveWith(false);

            const container = rootRef.current;
            if (!registry.tableState) {
              if (isDevelopment()) {
                console.warn(
                  "[Nimbus] DataTable: scrollToRow needs DataTable.Table inside DataTable.Root. Render DataTable.Table, or use the DataTable component."
                );
              }
              return resolveWith(false);
            }
            const element = registry.rowElements.get(key);
            if (!container || !element) return resolveWith(false);

            const isDisabled =
              !!row.isDisabled ||
              latest.disabledKeys === "all" ||
              !!latest.disabledKeys?.has(key);

            const finalize = () => {
              if (isDisabled) {
                if (options.focus && isDevelopment()) {
                  console.warn(
                    `[Nimbus] DataTable: scrollToRow ignored focus: true for the disabled row "${key}". A disabled row cannot take focus.`
                  );
                }
              } else {
                registry.tableState?.selectionManager.setFocusedKey(key);
                if (options.focus) {
                  registry.rowElements.get(key)?.focus({ preventScroll: true });
                }
              }
              resolveWith(true);
            };

            const containerRect = container.getBoundingClientRect();
            const rowRect = element.getBoundingClientRect();
            const target = computeTargetScrollTop({
              rowTop:
                rowRect.top -
                containerRect.top -
                container.clientTop +
                container.scrollTop,
              rowHeight: rowRect.height,
              viewportHeight: container.clientHeight,
              scrollTop: container.scrollTop,
              scrollHeight: container.scrollHeight,
              ...getScrollInsets(registry),
              align: options.align,
            });

            if (target === null || target === container.scrollTop) {
              return finalize();
            }

            // "auto" would follow the CSS `scroll-behavior` of the table, so
            // an instant scroll is asked for by name.
            const behavior: ScrollBehavior =
              options.behavior === "smooth" && !prefersReducedMotion()
                ? "smooth"
                : "instant";
            if (typeof container.scrollTo === "function") {
              container.scrollTo({ top: target, behavior });
            } else {
              container.scrollTop = target;
            }

            if (behavior === "instant") return onFrame(finalize);

            if (hasScrollEndEvent(container)) {
              container.addEventListener("scrollend", finalize, { once: true });
              cleanups.push(() =>
                container.removeEventListener("scrollend", finalize)
              );
              return;
            }
            // No `scrollend` event: the scroll is over when the position has
            // not changed for two frames.
            let lastTop = container.scrollTop;
            let unchangedFrames = 0;
            const watch = () => {
              unchangedFrames =
                container.scrollTop === lastTop ? unchangedFrames + 1 : 0;
              lastTop = container.scrollTop;
              if (unchangedFrames >= 2) finalize();
              else onFrame(watch);
            };
            onFrame(watch);
          });
        }),
    }),
    [rootRef, registry]
  );

  useEffect(
    () => () => {
      // A call that is still running when the table goes away.
      pendingRef.current?.abort("The table was unmounted");
    },
    []
  );
};
