import type { Dispatch, SetStateAction } from "react";
import type { Key, ItemDropTarget } from "react-aria-components";

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
 * @example
 * ```tsx
 * const [items, setItems] = useState(initialItems);
 * const { dragAndDropHooks } = useDragAndDrop({
 *   ...createArrayHandlers(setItems, (item) => item.key),
 * });
 * ```
 */
export function createArrayHandlers<T extends Record<string, unknown>>(
  setItems: Dispatch<SetStateAction<T[]>>,
  getKey: (item: T) => Key = (item) => (item.key as Key) ?? (item.id as Key)
): StateHandlers<T> {
  return {
    onInsertItems(items, target) {
      setItems((prev) => {
        const idx = prev.findIndex((i) => getKey(i) === target.key);
        if (idx === -1) return [...prev, ...items];
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
        if (idx === -1) return [...remaining, ...movedItems];
        const pos = target.dropPosition === "before" ? idx : idx + 1;
        return [
          ...remaining.slice(0, pos),
          ...movedItems,
          ...remaining.slice(pos),
        ];
      });
    },
    onRemoveItems(keys) {
      setItems((prev) => prev.filter((i) => !keys.has(getKey(i))));
    },
  };
}
