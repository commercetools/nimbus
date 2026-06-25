import { type ReactNode } from "react";
import { Collection } from "react-aria-components";
import type { TreeSubTreeProps } from "../tree.types";

/**
 * Tree.SubTree
 *
 * Renders an item's nested children. Supports both static composition (nested
 * `Tree.Item` elements as `children`) and dynamic collections (an `items` array
 * plus a render function). Internally wraps React Aria's `Collection` so
 * consumers never import it from `react-aria-components` directly.
 *
 * Renders nothing when `items` is an empty iterable, so callers don't need a
 * `children?.length` guard.
 */
export function TreeSubTree<T extends object>({
  items,
  children,
}: TreeSubTreeProps<T>) {
  // Mirror ComboBox.Section / Select.OptionGroup: a render function is required
  // whenever dynamic `items` are provided.
  if (items && typeof children !== "function") {
    throw new Error(
      'Tree.SubTree: When "items" is provided, "children" must be a function'
    );
  }

  if (items) {
    return (
      <Collection items={items}>
        {(item: T) => (typeof children === "function" ? children(item) : null)}
      </Collection>
    );
  }

  // Static composition. A render function with no `items` (e.g. a leaf node in
  // a recursive render) renders nothing rather than leaking the function.
  return typeof children === "function" ? null : (children as ReactNode);
}

TreeSubTree.displayName = "Tree.SubTree";
