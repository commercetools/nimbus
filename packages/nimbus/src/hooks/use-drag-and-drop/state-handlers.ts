import type { Dispatch, SetStateAction } from "react";
import type { Key, ItemDropTarget } from "react-aria-components";

declare const process: { env: Record<string, string | undefined> } | undefined;

type ListData<T> = {
  insertBefore: (key: Key, ...items: T[]) => void;
  insertAfter: (key: Key, ...items: T[]) => void;
  append: (...items: T[]) => void;
  moveBefore: (key: Key, keys: Set<Key>) => void;
  moveAfter: (key: Key, keys: Set<Key>) => void;
  remove: (...keys: Key[]) => void;
};

type StateHandlers<T> = {
  onInsertItems: (items: T[], target: ItemDropTarget) => void;
  onAppendItems: (items: T[]) => void;
  onReorder: (keys: Set<Key>, target: ItemDropTarget) => void;
  onRemoveItems: (keys: Set<Key>) => void;
};

/**
 * Creates state mutation callbacks for use with React Aria's `useListData`.
 * Spread the result into `useDragAndDrop` options.
 *
 * @example
 * ```tsx
 * const list = useListData({ initialItems, getKey });
 * const { dragAndDropHooks } = useDragAndDrop({
 *   ...createListDataHandlers(list),
 * });
 * ```
 */
export function createListDataHandlers<T>(list: ListData<T>): StateHandlers<T> {
  return {
    onInsertItems(items, target) {
      if (target.dropPosition === "before") {
        list.insertBefore(target.key, ...items);
      } else if (target.dropPosition === "after") {
        list.insertAfter(target.key, ...items);
      }
    },
    onAppendItems(items) {
      list.append(...items);
    },
    onReorder(keys, target) {
      if (target.dropPosition === "before") {
        list.moveBefore(target.key, keys);
      } else if (target.dropPosition === "after") {
        list.moveAfter(target.key, keys);
      }
    },
    onRemoveItems(keys) {
      list.remove(...keys);
    },
  };
}

/**
 * Creates state mutation callbacks for use with plain `useState` arrays.
 * Spread the result into `useDragAndDrop` options.
 *
 * @param setItems - The state setter from `useState`
 * @param getKey - Function to extract a unique key from an item.
 *   Defaults to `(item) => item.key ?? item.id`.
 *
 *   Pass this explicitly for `DataTable`, which keys rows by `row.id`. Domain
 *   rows commonly also carry a business `key` field, which the default would
 *   prefer, and reordering would then match nothing.
 *
 * @example
 * ```tsx
 * // DataTable rows are keyed by `id` — always say so explicitly.
 * const { dragAndDropHooks } = useDragAndDrop({
 *   ...createArrayHandlers(setRows, (row) => row.id),
 * });
 * ```
 */
const defaultGetKey = <T extends Record<string, unknown>>(item: T): Key => {
  const key = (item.key as Key) ?? (item.id as Key);
  if (key == null) {
    throw new Error(
      "createArrayHandlers: item has no `key` or `id` field. Provide a custom `getKey` function."
    );
  }
  return key;
};

/**
 * Warns when a key handed over by React Aria matched no item.
 *
 * The common cause is a mismatch between how the collection is keyed and how
 * `getKey` reads the item. `DataTable` keys rows by `row.id`, but the default
 * `getKey` prefers a business `key` field, which domain objects (customer
 * groups, categories, product types, channels, stores) usually have. When that
 * is what happened, say so and name the fix rather than leaving the developer
 * with a drag that silently does nothing.
 */
function warnKeyMismatch<T extends Record<string, unknown>>(
  operation: string,
  items: T[],
  usesDefaultGetKey: boolean,
  matches: (item: T) => boolean
) {
  if (typeof process === "undefined" || process.env.NODE_ENV === "production") {
    return;
  }
  const looksLikeIdKeying =
    usesDefaultGetKey &&
    items.some((i) => i.key != null && i.id != null && matches(i));
  console.warn(
    looksLikeIdKeying
      ? `createArrayHandlers: ${operation} matched no item. Your items have ` +
          "both a `key` and an `id` field, so the default getKey used `key`, " +
          "but this collection is keyed by `id`. Pass an explicit getKey, " +
          "e.g. createArrayHandlers(setItems, (item) => item.id)."
      : `createArrayHandlers: ${operation} matched no item.`
  );
}

export function createArrayHandlers<T extends Record<string, unknown>>(
  setItems: Dispatch<SetStateAction<T[]>>,
  getKey: (item: T) => Key = defaultGetKey
): StateHandlers<T> {
  const usesDefaultGetKey = getKey === defaultGetKey;
  return {
    onInsertItems(items, target) {
      setItems((prev) => {
        const idx = prev.findIndex((i) => getKey(i) === target.key);
        if (idx === -1) {
          warnKeyMismatch(
            "the drop target",
            prev,
            usesDefaultGetKey,
            (i) => (i.id as Key) === target.key
          );
          return [...prev, ...items];
        }
        const pos = target.dropPosition === "before" ? idx : idx + 1;
        return [...prev.slice(0, pos), ...items, ...prev.slice(pos)];
      });
    },
    onAppendItems(items) {
      setItems((prev) => [...prev, ...items]);
    },
    onReorder(keys, target) {
      setItems((prev) => {
        const movedItems = prev.filter((i) => keys.has(getKey(i)));
        const remaining = prev.filter((i) => !keys.has(getKey(i)));
        const idx = remaining.findIndex((i) => getKey(i) === target.key);
        if (idx === -1) {
          warnKeyMismatch(
            "the reorder target",
            prev,
            usesDefaultGetKey,
            (i) => (i.id as Key) === target.key
          );
          return [...remaining, ...movedItems];
        }
        const pos = target.dropPosition === "before" ? idx : idx + 1;
        return [
          ...remaining.slice(0, pos),
          ...movedItems,
          ...remaining.slice(pos),
        ];
      });
    },
    onRemoveItems(keys) {
      setItems((prev) => {
        const next = prev.filter((i) => !keys.has(getKey(i)));
        if (next.length === prev.length && keys.size > 0) {
          warnKeyMismatch("the keys to remove", prev, usesDefaultGetKey, (i) =>
            keys.has(i.id as Key)
          );
        }
        return next;
      });
    },
  };
}
