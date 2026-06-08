import {
  TreeItemContent as RaTreeItemContent,
  type TreeItemContentRenderProps,
} from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { Checkbox } from "@/components/checkbox/checkbox";
import { TreeItemContentSlot } from "../tree.slots";
import type { TreeItemContentProps } from "../tree.types";

/**
 * Tree.ItemContent
 *
 * The content row of a tree item. Lays out the expand/collapse indicator, an
 * optional selection checkbox (rendered automatically in multiple-selection
 * mode), and the item's label. Indentation by nesting level is applied here.
 *
 * @supportsStyleProps
 */
export const TreeItemContent = ({
  children,
  ref,
  ...props
}: TreeItemContentProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <RaTreeItemContent>
      {({ selectionMode, selectionBehavior }: TreeItemContentRenderProps) => {
        // In multiple-selection toggle mode React Aria wires a checkbox in the
        // `selection` slot to the row's selection state.
        const showSelectionCheckbox =
          selectionMode === "multiple" && selectionBehavior === "toggle";

        return (
          <TreeItemContentSlot ref={ref} {...styleProps} {...restProps}>
            {showSelectionCheckbox && <Checkbox slot="selection" />}
            {children}
          </TreeItemContentSlot>
        );
      }}
    </RaTreeItemContent>
  );
};

TreeItemContent.displayName = "Tree.ItemContent";
