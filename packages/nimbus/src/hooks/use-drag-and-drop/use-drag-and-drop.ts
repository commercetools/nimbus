import {
  useDragAndDrop as useRaDragAndDrop,
  isTextDropItem,
} from "react-aria-components";
import { processDropItems } from "./process-drop-items";
import type { UseDragAndDropOptions } from "./use-drag-and-drop.types";

const DRAG_FORMAT_BASE = "nimbus-collection-item";

/**
 * Shared drag-and-drop hook for Nimbus collection components.
 *
 * Wraps React Aria's `useDragAndDrop` with namespace isolation, external drop
 * support, outgoing format serialization, and auto-keying. Returns
 * `{ dragAndDropHooks }` to pass to any React Aria collection component.
 */
export function useDragAndDrop<T extends Record<string, unknown>>(
  options: UseDragAndDropOptions<T>
) {
  const {
    dataFormatBase = DRAG_FORMAT_BASE,
    dragNamespace,
    onExternalDrop,
    acceptExternalTypes,
    externalDropOperation = "copy",
    serializeDragItem,
    onInsertItems,
    onAppendItems,
    onReorder,
    onRemoveItems,
  } = options;

  const dataFormat = dragNamespace
    ? `${dataFormatBase}:${dragNamespace}`
    : dataFormatBase;

  const { dragAndDropHooks } = useRaDragAndDrop<T>({
    getItems(_, items) {
      return items.map((item) => ({
        [dataFormat]: JSON.stringify(item),
        ...(serializeDragItem?.(item) ?? {}),
      }));
    },

    acceptedDragTypes: onExternalDrop
      ? [dataFormat, ...(acceptExternalTypes ?? [])]
      : [dataFormat],

    getDropOperation: (_, types) => {
      if (types.has(dataFormat)) return "move";
      if (onExternalDrop) return externalDropOperation;
      return "cancel";
    },

    async onInsert(e) {
      if (!onInsertItems) return;
      const items = await processDropItems(e.items, dataFormat, onExternalDrop);
      if (items.length > 0) onInsertItems(items, e.target);
    },

    async onRootDrop(e) {
      if (!onAppendItems) return;
      const items = await processDropItems(e.items, dataFormat, onExternalDrop);
      if (items.length > 0) onAppendItems(items);
    },

    onReorder(e) {
      onReorder?.(e.keys, e.target);
    },

    async onDragEnd(e) {
      if (e.dropOperation === "move" && !e.isInternal) {
        onRemoveItems?.(e.keys);
      }
    },
  });

  return { dragAndDropHooks };
}
