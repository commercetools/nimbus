import { TreeItem as RaTreeItem } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { TreeItemSlot } from "../tree.slots";
import type { TreeItemProps } from "../tree.types";

/**
 * Tree.Item
 *
 * A single node in the tree (`role="row"`). Contains a `Tree.ItemContent`
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

  return (
    <TreeItemSlot ref={ref} {...styleProps} asChild>
      <RaTreeItem textValue={textValue} {...functionalProps}>
        {children}
      </RaTreeItem>
    </TreeItemSlot>
  );
};

TreeItem.displayName = "Tree.Item";
