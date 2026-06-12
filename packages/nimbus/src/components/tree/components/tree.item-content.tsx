import {
  TreeItemContent as RaTreeItemContent,
  type TreeItemContentRenderProps,
} from "react-aria-components";
import { DragIndicator } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import { Checkbox } from "@/components/checkbox/checkbox";
import { IconButton } from "@/components/icon-button/icon-button";
import { TreeItemContentSlot } from "../tree.slots";
import type { TreeItemContentProps } from "../tree.types";

/**
 * Tree.ItemContent
 *
 * The content row of a tree item. Lays out, in leading order, an optional drag
 * handle (rendered automatically when the tree allows dragging), an optional
 * selection checkbox (rendered automatically in multiple-selection mode), the
 * expand/collapse indicator, and the item's label. Indentation by nesting level
 * is applied here.
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
      {({
        selectionMode,
        selectionBehavior,
        allowsDragging,
      }: TreeItemContentRenderProps) => {
        // In multiple-selection toggle mode React Aria wires a checkbox in the
        // `selection` slot to the row's selection state.
        const showSelectionCheckbox =
          selectionMode === "multiple" && selectionBehavior === "toggle";

        return (
          <TreeItemContentSlot ref={ref} {...styleProps} {...restProps}>
            {/* When the tree opts into drag-and-drop (`useTree({ dragAndDrop })`),
                React Aria sets `allowsDragging` on every row. We render the drag
                handle here so consumers get a consistent affordance for free —
                matching DraggableList. React Aria wires the `slot="drag"` button
                and localizes its accessible name (e.g. "Drag <item>"). */}
            {allowsDragging && (
              <IconButton
                slot="drag"
                size="2xs"
                variant="ghost"
                colorPalette="neutral"
              >
                <DragIndicator />
              </IconButton>
            )}
            {showSelectionCheckbox && <Checkbox slot="selection" />}
            {children}
          </TreeItemContentSlot>
        );
      }}
    </RaTreeItemContent>
  );
};

TreeItemContent.displayName = "Tree.ItemContent";
