import type { DropOperation } from "react-aria-components";
import { useDragAndDrop as useRaDragAndDrop } from "react-aria-components";
import { processDropItems } from "./process-drop-items";
import type { UseDragAndDropOptions } from "./use-drag-and-drop.types";

const DRAG_FORMAT_BASE = "nimbus-collection-item";

export function resolveDropOperation(
  types: { has(type: string | symbol): boolean },
  allowedOperations: DropOperation[],
  dataFormat: string,
  opts: {
    onExternalDrop?: unknown;
    acceptExternalTypes?: Array<string | symbol>;
    externalDropOperation: Exclude<DropOperation, "cancel">;
  }
): DropOperation {
  if (types.has(dataFormat)) {
    return allowedOperations.includes("move") ? "move" : "cancel";
  }
  if (opts.onExternalDrop) {
    const accepted = opts.acceptExternalTypes ?? [];
    const hasAcceptedType = accepted.some((t) => types.has(t));
    if (!hasAcceptedType) return "cancel";
    return allowedOperations.includes(opts.externalDropOperation)
      ? opts.externalDropOperation
      : "cancel";
  }
  return "cancel";
}

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
    getItems(_keys, items) {
      return items.map((item) => ({
        [dataFormat]: JSON.stringify(item),
        ...(serializeDragItem?.(item) ?? {}),
      }));
    },

    acceptedDragTypes: onExternalDrop
      ? [dataFormat, ...(acceptExternalTypes ?? [])]
      : [dataFormat],

    getDropOperation: (_target, types, allowedOperations) =>
      resolveDropOperation(types, allowedOperations, dataFormat, {
        onExternalDrop,
        acceptExternalTypes,
        externalDropOperation,
      }),

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
