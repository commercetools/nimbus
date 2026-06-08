import { TreeItem as RaTreeItem } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { TreeItemSlot } from "../tree.slots";
import type { TreeItemProps } from "../tree.types";

/**
 * Tree.Item
 *
 * A single node in the tree (`role="treeitem"`). Contains a `Tree.ItemContent`
 * and, optionally, nested `Tree.Item` elements (or a React Aria `Collection`
 * for dynamic children).
 *
 * @supportsStyleProps
 */
export const TreeItem = <T extends object>({
  children,
  textValue,
  ref,
  ...props
}: TreeItemProps<T>) => {
  const [styleProps, functionalProps] = extractStyleProps(props);

  // Derive a textValue for type-ahead from string content when not provided.
  const derivedTextValue =
    textValue ?? (typeof children === "string" ? children : "");

  return (
    <TreeItemSlot ref={ref} {...styleProps} asChild>
      <RaTreeItem textValue={derivedTextValue} {...functionalProps}>
        {children}
      </RaTreeItem>
    </TreeItemSlot>
  );
};

TreeItem.displayName = "Tree.Item";
