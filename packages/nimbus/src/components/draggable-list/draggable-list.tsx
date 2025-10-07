import { DraggableListRoot } from "./components/draggable-list.root";
import { DraggableListItem } from "./components/draggable-list.item";

/**
 * DraggableList
 * ============================================================
 * TODO: documentation, modelled on jsdoc comments in dialog/dialog.tsx
 */

export const DraggableList = {
  Root: DraggableListRoot,
  Item: DraggableListItem,
};

// Internal exports for react-docgen
export {
  DraggableListRoot as _DraggableListRoot,
  DraggableListItem as _DraggableListItem,
};
