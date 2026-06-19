import { useDragAndDrop, type Key } from "react-aria-components";
import { useTreeData, type TreeOptions, type TreeData } from "react-stately";
import type { TreeRootProps } from "../tree.types";

/**
 * Order a drag's keys by tree position. React Aria delivers `e.keys` in
 * selection order, not document order.
 */
function keysInTreeOrder<T extends object>(
  items: TreeData<T>["items"],
  keys: Set<Key>
): Key[] {
  const ordered: Key[] = [];
  const walk = (nodes: TreeData<T>["items"]) => {
    for (const node of nodes) {
      if (keys.has(node.key)) ordered.push(node.key);
      if (node.children) walk(node.children);
    }
  };
  walk(items);
  return ordered;
}

/**
 * Tree.Root configuration that `useTree` accepts and echoes back so the whole
 * result can be spread onto `Tree.Root`.
 */
type ForwardableRootProps<T extends object> = Pick<
  TreeRootProps<T>,
  | "selectionMode"
  | "disabledKeys"
  | "defaultExpandedKeys"
  | "expandedKeys"
  | "onExpandedChange"
  | "defaultSelectedKeys"
  | "selectedKeys"
  | "onSelectionChange"
>;

/** Imperative tree-data operations exposed on the `useTree` result. */
type TreeController<T extends object> = Pick<
  TreeData<T>,
  | "getItem"
  | "insert"
  | "insertBefore"
  | "insertAfter"
  | "append"
  | "prepend"
  | "remove"
  | "move"
  | "moveBefore"
  | "moveAfter"
  | "update"
>;

/** Options for opting into drag-and-drop on a tree. */
export type UseTreeDragAndDropOptions = {
  /**
   * Build the drag data for the dragged keys. Defaults to a `text/plain`
   * representation of each key.
   */
  getItems?: (keys: Set<Key>) => Array<Record<string, string>>;
  /** Drag types accepted from external sources. */
  acceptedDragTypes?: Array<string | symbol>;
};

/**
 * Options for {@link useTree}. Combines React Stately's tree-data options with
 * the `Tree.Root` configuration you want forwarded and opt-in drag-and-drop.
 */
export type UseTreeOptions<T extends object> = TreeOptions<T> &
  ForwardableRootProps<T> & {
    /**
     * Enable drag-and-drop. `true` wires sensible reorder + re-parent handlers;
     * pass an object to customize the drag data or accepted external types.
     */
    dragAndDrop?: boolean | UseTreeDragAndDropOptions;
  };

/**
 * The value returned by {@link useTree}. Spread it onto `Tree.Root` to wire up
 * items, drag-and-drop, and selection/expansion config; the imperative
 * controller methods are available on the same object for programmatic edits.
 */
export type UseTreeResult<T extends object> = ForwardableRootProps<T> &
  TreeController<T> & {
    /** The current root nodes — pass to `Tree.Root`'s `items`. */
    items: TreeData<T>["items"];
    /** Drag-and-drop hooks for `Tree.Root` (present only when enabled). */
    dragAndDropHooks?: TreeRootProps<T>["dragAndDropHooks"];
  };

/**
 * `useTree` — the single entry point for a data-driven, optionally draggable
 * Nimbus tree. It owns the hierarchical state (via React Stately's
 * `useTreeData`) and, when enabled, drag-and-drop (reorder between siblings and
 * re-parent by dropping onto a group). The result is designed to be spread
 * straight onto `Tree.Root`, so consumers never import from
 * `react-aria-components` or `react-stately` themselves.
 *
 * @example
 * ```tsx
 * const tree = useTree({
 *   initialItems: data,
 *   getKey: (item) => item.id,
 *   getChildren: (item) => item.children ?? [],
 *   selectionMode: "multiple",
 *   dragAndDrop: true,
 * });
 *
 * return <Tree.Root aria-label="Files" {...tree}>{renderItem}</Tree.Root>;
 * ```
 */
export function useTree<T extends object>(
  options: UseTreeOptions<T>
): UseTreeResult<T> {
  const {
    initialItems,
    initialSelectedKeys,
    getKey,
    getChildren,
    dragAndDrop,
    ...rootProps
  } = options;

  const tree = useTreeData<T>({
    initialItems,
    initialSelectedKeys,
    getKey,
    getChildren,
  });

  const dndConfig = typeof dragAndDrop === "object" ? dragAndDrop : {};

  const { dragAndDropHooks } = useDragAndDrop({
    getItems:
      dndConfig.getItems ??
      ((keys) => [...keys].map((key) => ({ "text/plain": String(key) }))),
    acceptedDragTypes: dndConfig.acceptedDragTypes,
    onMove(e) {
      if (e.target.dropPosition === "before") {
        tree.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        tree.moveAfter(e.target.key, e.keys);
      } else if (e.target.dropPosition === "on") {
        // Re-parent: append into the target group. `tree` is a render snapshot
        // whose child count doesn't update mid-loop, so offset by `i` rather
        // than re-reading the length per key.
        const targetIndex = tree.getItem(e.target.key)?.children?.length ?? 0;
        keysInTreeOrder(tree.items, e.keys).forEach((key, i) => {
          tree.move(key, e.target.key, targetIndex + i);
        });
      }
    },
  });

  return {
    ...(rootProps as ForwardableRootProps<T>),
    items: tree.items,
    ...(dragAndDrop ? { dragAndDropHooks } : {}),
    getItem: tree.getItem,
    insert: tree.insert,
    insertBefore: tree.insertBefore,
    insertAfter: tree.insertAfter,
    append: tree.append,
    prepend: tree.prepend,
    remove: tree.remove,
    move: tree.move,
    moveBefore: tree.moveBefore,
    moveAfter: tree.moveAfter,
    update: tree.update,
  };
}
