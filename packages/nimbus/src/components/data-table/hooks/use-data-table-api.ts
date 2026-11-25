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
  DataTableRowItem,
  DataTableScrollToRowOptions,
} from "../data-table.types";
import type { DataTableRegistry } from "../utils/registry.types";
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

/** How far, in pixels, the final `scrollTop` may be from the target. */
const SCROLL_TOLERANCE = 1;

/**
 * How long a smooth scroll may stand still before the call gives up. A
 * container that cannot scroll (for example `overflow: clip`) never moves and
 * never fires `scrollend`. Not used without `scrollend`: then two frames
 * without movement end the scroll.
 */
const SCROLL_STALL_MS = 500;

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
          // Set while a smooth scroll of this call is running.
          let stopSmoothScroll: (() => void) | null = null;
          let isDone = false;
          const finish = (settle: () => void) => {
            if (isDone) return;
            isDone = true;
            cleanups.forEach((cleanup) => cleanup());
            if (pendingRef.current === call) pendingRef.current = null;
            settle();
          };
          const call: PendingCall = {
            abort: (message) => {
              // The browser keeps a smooth scroll going after the call is over.
              stopSmoothScroll?.();
              finish(() => reject(new DOMException(message, "AbortError")));
            },
          };
          pendingRef.current = call;

          const onFrame = (callback: (time: number) => void) => {
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
                // React Aria moves DOM focus to a row when it becomes the
                // focused key while the table has focus. Without `focus: true`
                // that must not happen, so a table that has focus keeps its
                // focused row.
                const manager = registry.tableState?.selectionManager;
                if (manager && (options.focus || !manager.isFocused)) {
                  manager.setFocusedKey(key);
                }
                if (options.focus) {
                  registry.rowElements.get(key)?.focus({ preventScroll: true });
                }
              }
              resolveWith(true);
            };

            /**
             * The new `scrollTop` for the row as it is now, `null` when no
             * scroll is needed, `undefined` when the row has gone.
             */
            const measureTarget = () => {
              const rowElement = registry.rowElements.get(key);
              if (!rowElement) return undefined;
              const containerRect = container.getBoundingClientRect();
              const rowRect = rowElement.getBoundingClientRect();
              return computeTargetScrollTop({
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
            };

            const target = measureTarget();
            if (target === undefined) return resolveWith(false);

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

            // The scroll can end somewhere else: the user scrolled during a
            // smooth scroll, the container does not scroll, or rows changed
            // while it ran. So the row is measured again. If it is not in
            // place, or it has gone, the call resolves false and moves no
            // focus.
            const settle = () => {
              const latest = latestRef.current;
              const isShown = latest.sortedRows.some(
                (item) => latest.getRowKey(item) === key
              );
              const finalTarget = isShown ? measureTarget() : undefined;
              if (
                finalTarget === undefined ||
                (finalTarget !== null &&
                  Math.abs(container.scrollTop - finalTarget) >
                    SCROLL_TOLERANCE)
              ) {
                return resolveWith(false);
              }
              finalize();
            };

            if (behavior === "instant") return onFrame(settle);

            stopSmoothScroll = () =>
              container.scrollTo?.({
                top: container.scrollTop,
                behavior: "instant",
              });

            // `scrollend` ends the scroll when the browser has the event. The
            // watcher below also ends it when the position stands still: for
            // two frames without `scrollend`, for SCROLL_STALL_MS with it.
            const hasScrollEnd = hasScrollEndEvent(container);
            if (hasScrollEnd) {
              container.addEventListener("scrollend", settle, { once: true });
              cleanups.push(() =>
                container.removeEventListener("scrollend", settle)
              );
            }
            let lastTop = container.scrollTop;
            let lastMoveTime: number | null = null;
            let unchangedFrames = 0;
            const watch = (time: number) => {
              lastMoveTime ??= time;
              if (container.scrollTop === lastTop) {
                unchangedFrames += 1;
              } else {
                unchangedFrames = 0;
                lastMoveTime = time;
                lastTop = container.scrollTop;
              }
              const isStalled = hasScrollEnd
                ? time - lastMoveTime >= SCROLL_STALL_MS
                : unchangedFrames >= 2;
              if (isStalled) settle();
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
