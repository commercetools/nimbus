import type {
  Key,
  DropItem,
  DropOperation,
  ItemDropTarget,
} from "react-aria-components";

/**
 * Base item shape for drag-and-drop helpers.
 * Helpers return items conforming to this shape; consumers can extend it.
 */
export type DragAndDropItemData = {
  key: string;
  label: string;
} & Record<string, unknown>;

/**
 * Consumer-facing props for configuring drag-and-drop behavior.
 * Intended to be intersected into component prop types (e.g. DraggableListRootProps).
 */
export type DragAndDropProps<T> = {
  /**
   * Isolate drag-and-drop to collections sharing the same namespace.
   * When set, only collections with a matching `dragNamespace` can exchange items.
   */
  dragNamespace?: string;
  /**
   * Convert external drops (text, files, directories) into collection items.
   * When provided, the collection accepts drops of the types specified in `acceptExternalTypes`.
   */
  onExternalDrop?: (items: DropItem[]) => T[] | Promise<T[]>;
  /**
   * Drag types to accept from external sources.
   * Supports MIME types (`"text/plain"`), custom strings, or `DIRECTORY_DRAG_TYPE` (symbol).
   * Only effective when `onExternalDrop` is provided.
   */
  acceptExternalTypes?: Array<string | symbol>;
  /**
   * Drop operation for items from external sources.
   * Internal reorders always use `"move"`. Returns `"cancel"` when the
   * source does not include this operation in its `allowedOperations`.
   * @default "copy"
   */
  externalDropOperation?: Exclude<DropOperation, "cancel">;
  /**
   * Additional format representations for outgoing drags.
   * Each key/value pair is added alongside the internal format when items are dragged out.
   */
  serializeDragItem?: (item: T) => Record<string, string>;
};

/**
 * Full configuration for the `useDragAndDrop` hook.
 * Extends consumer-facing props with component-specific state mutation callbacks.
 */
export type UseDragAndDropOptions<T> = DragAndDropProps<T> & {
  /**
   * Override the base data format string used for internal serialization.
   * Defaults to `"nimbus-collection-item"`. DraggableList passes its own
   * value for backward compatibility.
   */
  dataFormatBase?: string;
  /** Insert items at a target position (before/after an existing item). */
  onInsertItems?: (items: T[], target: ItemDropTarget) => void;
  /** Append items (drop on root / empty collection). */
  onAppendItems?: (items: T[]) => void;
  /** Reorder items within the collection. */
  onReorder?: (keys: Set<Key>, target: ItemDropTarget) => void;
  /** Remove items from this collection after a successful external move. */
  onRemoveItems?: (keys: Set<Key>) => void;
};
