import {
  isTextDropItem,
  isFileDropItem,
  isDirectoryDropItem,
  type DropItem,
} from "react-aria-components";
import type { DragAndDropItemData } from "./use-drag-and-drop.types";

/**
 * Extracts plain text items from a drop.
 * Items whose `types` set does not include `type` are silently skipped.
 * @param items - Raw drop items
 * @param type - The text MIME type to extract. @default "text/plain"
 */
export async function createItemsFromTextDrop(
  items: DropItem[],
  type: string = "text/plain"
): Promise<DragAndDropItemData[]> {
  return Promise.all(
    items
      .filter(isTextDropItem)
      .filter((item) => item.types.has(type))
      .map(async (item) => ({
        key: crypto.randomUUID(),
        label: await item.getText(type),
      }))
  );
}

/**
 * Extracts file items from a drop, resolving each to a File object.
 */
export async function createItemsFromFileDrop(
  items: DropItem[]
): Promise<DragAndDropItemData[]> {
  return Promise.all(
    items.filter(isFileDropItem).map(async (item) => ({
      key: crypto.randomUUID(),
      label: item.name,
      fileName: item.name,
      fileType: item.type,
      file: await item.getFile(),
    }))
  );
}

/**
 * Extracts files from dropped directories, flattening one level deep.
 * Nested directories are skipped.
 */
export async function createItemsFromDirectoryDrop(
  items: DropItem[]
): Promise<DragAndDropItemData[]> {
  const result: DragAndDropItemData[] = [];
  for (const item of items.filter(isDirectoryDropItem)) {
    for await (const entry of item.getEntries()) {
      if (isFileDropItem(entry)) {
        result.push({
          key: crypto.randomUUID(),
          label: entry.name,
          fileName: entry.name,
          fileType: entry.type,
          file: await entry.getFile(),
          directory: item.name,
        });
      }
    }
  }
  return result;
}

/**
 * Extracts and parses JSON text items from a drop.
 * Uses a `label` or `name` field from the parsed object if present.
 */
export async function createItemsFromJsonDrop(
  items: DropItem[]
): Promise<DragAndDropItemData[]> {
  const results: DragAndDropItemData[] = [];
  for (const item of items.filter(isTextDropItem)) {
    if (!item.types.has("application/json")) continue;
    const text = await item.getText("application/json");
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      continue;
    }
    const label =
      typeof data.label === "string"
        ? data.label
        : typeof data.name === "string"
          ? data.name
          : text.slice(0, 50);
    results.push({ key: crypto.randomUUID(), label, data });
  }
  return results;
}

/**
 * Extracts image files from a drop, creating object URLs for preview.
 * Consumers must call `URL.revokeObjectURL(item.objectUrl)` when items are removed.
 */
export async function createItemsFromImageDrop(
  items: DropItem[]
): Promise<DragAndDropItemData[]> {
  return Promise.all(
    items
      .filter(isFileDropItem)
      .filter((item) => item.type.startsWith("image/"))
      .map(async (item) => {
        const file = await item.getFile();
        return {
          key: crypto.randomUUID(),
          label: item.name,
          fileName: item.name,
          fileType: item.type,
          file,
          objectUrl: URL.createObjectURL(file),
        };
      })
  );
}

/**
 * Extracts CSV text items from a drop, parsing into rows.
 * The first row is treated as headers. Each subsequent row becomes one item
 * with `label` set to the first column value.
 *
 * **Limitation:** uses naive comma splitting — quoted fields containing commas
 * (e.g. `"Smith, John"`) are not handled. Use a dedicated CSV parser for
 * production data that may contain quoted fields.
 */
export async function createItemsFromCsvDrop(
  items: DropItem[]
): Promise<DragAndDropItemData[]> {
  const results: DragAndDropItemData[] = [];
  for (const item of items.filter(isTextDropItem)) {
    if (!item.types.has("text/csv")) continue;
    const text = await item.getText("text/csv");
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    if (lines.length < 2) continue;
    const headers = lines[0].split(",").map((h) => h.trim());
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] ?? "";
      });
      results.push({
        key: crypto.randomUUID(),
        label: values[0] ?? "",
        row,
        headers,
      });
    }
  }
  return results;
}
