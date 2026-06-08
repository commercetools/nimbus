import { isTextDropItem, type DropItem } from "react-aria-components";

/**
 * Splits drop items into internal (Nimbus-serialized) and external,
 * processes externals via the consumer callback, and auto-keys any
 * items missing both `key` and `id`.
 */
export async function processDropItems<T extends Record<string, unknown>>(
  rawItems: DropItem[],
  dataFormat: string,
  onExternalDrop?: (items: DropItem[]) => T[] | Promise<T[]>
): Promise<T[]> {
  const internalItems: T[] = [];
  const externalItems: DropItem[] = [];

  for (const item of rawItems) {
    if (isTextDropItem(item) && item.types.has(dataFormat)) {
      try {
        internalItems.push(JSON.parse(await item.getText(dataFormat)));
      } catch {
        // Skip items with invalid JSON (corrupted drag data)
      }
    } else {
      externalItems.push(item);
    }
  }

  const converted =
    externalItems.length > 0 && onExternalDrop
      ? await onExternalDrop(externalItems)
      : [];

  return [...internalItems, ...converted].map((item) =>
    item.key == null && item.id == null
      ? { ...item, key: crypto.randomUUID() }
      : item
  );
}
