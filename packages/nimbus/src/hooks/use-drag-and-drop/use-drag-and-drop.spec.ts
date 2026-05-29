import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  DropItem,
  TextDropItem,
  FileDropItem,
  DirectoryDropItem,
  ItemDropTarget,
} from "react-aria-components";
import { createArrayHandlers, createListDataHandlers } from "./state-handlers";
import { processDropItems } from "./process-drop-items";
import { resolveDropOperation } from "./use-drag-and-drop";
import {
  createItemsFromTextDrop,
  createItemsFromFileDrop,
  createItemsFromJsonDrop,
  createItemsFromCsvDrop,
  createItemsFromImageDrop,
  createItemsFromDirectoryDrop,
} from "./external-drop-helpers";

function makeTextDropItem(
  texts: Record<string, string>
): TextDropItem & DropItem {
  return {
    kind: "text" as const,
    types: new Set(Object.keys(texts)),
    getText: vi.fn(async (type: string) => texts[type] ?? ""),
  };
}

function makeFileDropItem(
  name: string,
  type: string,
  content = new Uint8Array()
): FileDropItem & DropItem {
  return {
    kind: "file" as const,
    type,
    name,
    getFile: vi.fn(async () => new File([content], name, { type })),
    getText: vi.fn(async () => new TextDecoder().decode(content)),
  };
}

function makeDirectoryDropItem(
  name: string,
  entries: (FileDropItem & DropItem)[]
): DirectoryDropItem & DropItem {
  return {
    kind: "directory" as const,
    name,
    async *getEntries() {
      for (const entry of entries) {
        yield entry;
      }
    },
  };
}

function beforeTarget(key: string): ItemDropTarget {
  return { type: "item", key, dropPosition: "before" };
}

function afterTarget(key: string): ItemDropTarget {
  return { type: "item", key, dropPosition: "after" };
}

// ============================================================
// createArrayHandlers
// ============================================================

describe("createArrayHandlers", () => {
  type Item = { key: string; label: string };
  const a: Item = { key: "a", label: "Apple" };
  const b: Item = { key: "b", label: "Banana" };
  const c: Item = { key: "c", label: "Cherry" };
  const x: Item = { key: "x", label: "Xtra" };
  const y: Item = { key: "y", label: "Yellow" };

  let items: Item[];
  const setItems = (fn: Item[] | ((prev: Item[]) => Item[])) => {
    items = typeof fn === "function" ? fn(items) : fn;
  };

  beforeEach(() => {
    items = [a, b, c];
  });

  it("inserts items before a target", () => {
    const h = createArrayHandlers(setItems, (i) => i.key);
    h.onInsertItems([x, y], beforeTarget("b"));
    expect(items).toEqual([a, x, y, b, c]);
  });

  it("inserts items after a target", () => {
    const h = createArrayHandlers(setItems, (i) => i.key);
    h.onInsertItems([x], afterTarget("b"));
    expect(items).toEqual([a, b, x, c]);
  });

  it("appends to end when insert target is not found", () => {
    const h = createArrayHandlers(setItems, (i) => i.key);
    h.onInsertItems([x], beforeTarget("missing"));
    expect(items).toEqual([a, b, c, x]);
  });

  it("appends items", () => {
    const h = createArrayHandlers(setItems, (i) => i.key);
    h.onAppendItems([x, y]);
    expect(items).toEqual([a, b, c, x, y]);
  });

  it("reorders items before a target", () => {
    const h = createArrayHandlers(setItems, (i) => i.key);
    h.onReorder(new Set(["c"]), beforeTarget("a"));
    expect(items).toEqual([c, a, b]);
  });

  it("reorders items after a target", () => {
    const h = createArrayHandlers(setItems, (i) => i.key);
    h.onReorder(new Set(["a"]), afterTarget("b"));
    expect(items).toEqual([b, a, c]);
  });

  it("reorders multiple items at once", () => {
    const h = createArrayHandlers(setItems, (i) => i.key);
    h.onReorder(new Set(["a", "c"]), beforeTarget("b"));
    expect(items).toEqual([a, c, b]);
  });

  it("appends moved items when reorder target is not found", () => {
    const h = createArrayHandlers(setItems, (i) => i.key);
    h.onReorder(new Set(["a"]), afterTarget("missing"));
    expect(items).toEqual([b, c, a]);
  });

  it("removes items by key", () => {
    const h = createArrayHandlers(setItems, (i) => i.key);
    h.onRemoveItems(new Set(["a", "c"]));
    expect(items).toEqual([b]);
  });

  it("defaults getKey to item.key", () => {
    const h = createArrayHandlers(setItems);
    h.onRemoveItems(new Set(["b"]));
    expect(items).toEqual([a, c]);
  });

  it("defaults getKey to item.id when key is absent", () => {
    type IdItem = { id: string; name: string };
    let idItems: IdItem[] = [
      { id: "1", name: "One" },
      { id: "2", name: "Two" },
    ];
    const setId = (fn: IdItem[] | ((prev: IdItem[]) => IdItem[])) => {
      idItems = typeof fn === "function" ? fn(idItems) : fn;
    };
    const h = createArrayHandlers(setId);
    h.onRemoveItems(new Set(["1"]));
    expect(idItems).toEqual([{ id: "2", name: "Two" }]);
  });

  it("throws when item has no key or id and no custom getKey", () => {
    type NoKeyItem = { name: string };
    let noKeyItems: NoKeyItem[] = [{ name: "Orphan" }];
    const setNoKey = (
      fn: NoKeyItem[] | ((prev: NoKeyItem[]) => NoKeyItem[])
    ) => {
      noKeyItems = typeof fn === "function" ? fn(noKeyItems) : fn;
    };
    const h = createArrayHandlers(setNoKey);
    expect(() => h.onRemoveItems(new Set(["x"]))).toThrow(
      "createArrayHandlers: item has no `key` or `id` field"
    );
  });
});

// ============================================================
// createListDataHandlers
// ============================================================

describe("createListDataHandlers", () => {
  it("delegates insertBefore for before targets", () => {
    const list = {
      insertBefore: vi.fn(),
      insertAfter: vi.fn(),
      append: vi.fn(),
      moveBefore: vi.fn(),
      moveAfter: vi.fn(),
      remove: vi.fn(),
    };
    const h = createListDataHandlers(list);

    h.onInsertItems(["a", "b"], beforeTarget("k"));
    expect(list.insertBefore).toHaveBeenCalledWith("k", "a", "b");
    expect(list.insertAfter).not.toHaveBeenCalled();
  });

  it("delegates insertAfter for after targets", () => {
    const list = {
      insertBefore: vi.fn(),
      insertAfter: vi.fn(),
      append: vi.fn(),
      moveBefore: vi.fn(),
      moveAfter: vi.fn(),
      remove: vi.fn(),
    };
    const h = createListDataHandlers(list);

    h.onInsertItems(["a"], afterTarget("k"));
    expect(list.insertAfter).toHaveBeenCalledWith("k", "a");
  });

  it("delegates append", () => {
    const list = {
      insertBefore: vi.fn(),
      insertAfter: vi.fn(),
      append: vi.fn(),
      moveBefore: vi.fn(),
      moveAfter: vi.fn(),
      remove: vi.fn(),
    };
    const h = createListDataHandlers(list);

    h.onAppendItems(["x", "y"]);
    expect(list.append).toHaveBeenCalledWith("x", "y");
  });

  it("delegates moveBefore for reorder before", () => {
    const list = {
      insertBefore: vi.fn(),
      insertAfter: vi.fn(),
      append: vi.fn(),
      moveBefore: vi.fn(),
      moveAfter: vi.fn(),
      remove: vi.fn(),
    };
    const h = createListDataHandlers(list);
    const keys = new Set(["a"]);

    h.onReorder(keys, beforeTarget("b"));
    expect(list.moveBefore).toHaveBeenCalledWith("b", keys);
  });

  it("delegates moveAfter for reorder after", () => {
    const list = {
      insertBefore: vi.fn(),
      insertAfter: vi.fn(),
      append: vi.fn(),
      moveBefore: vi.fn(),
      moveAfter: vi.fn(),
      remove: vi.fn(),
    };
    const h = createListDataHandlers(list);
    const keys = new Set(["a"]);

    h.onReorder(keys, afterTarget("b"));
    expect(list.moveAfter).toHaveBeenCalledWith("b", keys);
  });

  it("delegates remove", () => {
    const list = {
      insertBefore: vi.fn(),
      insertAfter: vi.fn(),
      append: vi.fn(),
      moveBefore: vi.fn(),
      moveAfter: vi.fn(),
      remove: vi.fn(),
    };
    const h = createListDataHandlers(list);

    h.onRemoveItems(new Set(["a", "b"]));
    expect(list.remove).toHaveBeenCalledWith("a", "b");
  });
});

// ============================================================
// processDropItems
// ============================================================

describe("processDropItems", () => {
  const FORMAT = "nimbus-test";

  it("deserializes internal items from the data format", async () => {
    const internal = makeTextDropItem({
      [FORMAT]: JSON.stringify({ key: "1", label: "One" }),
    });
    const result = await processDropItems([internal], FORMAT);
    expect(result).toEqual([{ key: "1", label: "One" }]);
  });

  it("passes external items to onExternalDrop callback", async () => {
    const external = makeFileDropItem("file.txt", "text/plain");
    const onExternalDrop = vi.fn(async () => [{ name: "converted" }]);

    const result = await processDropItems([external], FORMAT, onExternalDrop);
    expect(onExternalDrop).toHaveBeenCalledWith([external]);
    expect(result[0]).toMatchObject({ name: "converted" });
  });

  it("separates internal and external items correctly", async () => {
    const internal = makeTextDropItem({
      [FORMAT]: JSON.stringify({ key: "i", label: "Internal" }),
    });
    const external = makeTextDropItem({ "text/plain": "hello" });
    const onExternalDrop = vi.fn(async (items: DropItem[]) =>
      items.map(() => ({ key: "e", label: "External" }))
    );

    const result = await processDropItems(
      [internal, external],
      FORMAT,
      onExternalDrop
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ key: "i", label: "Internal" });
    expect(result[1]).toMatchObject({ key: "e", label: "External" });
  });

  it("auto-keys items missing both key and id", async () => {
    const onExternalDrop = vi.fn(async () => [
      { label: "no-key" } as Record<string, unknown>,
    ]);
    const external = makeFileDropItem("f.txt", "text/plain");

    const result = await processDropItems([external], FORMAT, onExternalDrop);
    expect(result[0].key).toBeDefined();
    expect(typeof result[0].key).toBe("string");
  });

  it("does not overwrite existing key", async () => {
    const onExternalDrop = vi.fn(async () => [{ key: "keep-me", label: "x" }]);
    const external = makeFileDropItem("f.txt", "text/plain");

    const result = await processDropItems([external], FORMAT, onExternalDrop);
    expect(result[0].key).toBe("keep-me");
  });

  it("does not overwrite existing id", async () => {
    const onExternalDrop = vi.fn(async () => [
      { id: "my-id", label: "x" } as Record<string, unknown>,
    ]);
    const external = makeFileDropItem("f.txt", "text/plain");

    const result = await processDropItems([external], FORMAT, onExternalDrop);
    expect(result[0].key).toBeUndefined();
    expect(result[0].id).toBe("my-id");
  });

  it("ignores external items when no callback provided", async () => {
    const external = makeFileDropItem("f.txt", "text/plain");
    const result = await processDropItems([external], FORMAT);
    expect(result).toEqual([]);
  });

  it("skips internal items with corrupted JSON", async () => {
    const corrupted = makeTextDropItem({ [FORMAT]: "not-valid-json" });
    const valid = makeTextDropItem({
      [FORMAT]: JSON.stringify({ key: "ok", label: "Valid" }),
    });
    const result = await processDropItems([corrupted, valid], FORMAT);
    expect(result).toEqual([{ key: "ok", label: "Valid" }]);
  });
});

// ============================================================
// createItemsFromTextDrop
// ============================================================

describe("createItemsFromTextDrop", () => {
  it("extracts text/plain items", async () => {
    const item = makeTextDropItem({ "text/plain": "Hello" });
    const result = await createItemsFromTextDrop([item]);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Hello");
    expect(result[0].key).toBeDefined();
  });

  it("extracts items with a custom type", async () => {
    const item = makeTextDropItem({ "text/html": "<b>Hi</b>" });
    const result = await createItemsFromTextDrop([item], "text/html");
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("<b>Hi</b>");
  });

  it("skips items that do not have the requested type", async () => {
    const item = makeTextDropItem({ "text/html": "<b>Hi</b>" });
    const result = await createItemsFromTextDrop([item], "text/plain");
    expect(result).toHaveLength(0);
  });

  it("skips non-text drop items", async () => {
    const file = makeFileDropItem("pic.png", "image/png");
    const result = await createItemsFromTextDrop([file]);
    expect(result).toHaveLength(0);
  });

  it("handles multiple items", async () => {
    const items = [
      makeTextDropItem({ "text/plain": "One" }),
      makeTextDropItem({ "text/plain": "Two" }),
    ];
    const result = await createItemsFromTextDrop(items);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.label)).toEqual(["One", "Two"]);
  });
});

// ============================================================
// createItemsFromFileDrop
// ============================================================

describe("createItemsFromFileDrop", () => {
  it("extracts file items with name, type, and file object", async () => {
    const item = makeFileDropItem("doc.pdf", "application/pdf");
    const result = await createItemsFromFileDrop([item]);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("doc.pdf");
    expect(result[0].fileName).toBe("doc.pdf");
    expect(result[0].fileType).toBe("application/pdf");
    expect(result[0].file).toBeInstanceOf(File);
  });

  it("skips non-file items", async () => {
    const text = makeTextDropItem({ "text/plain": "hello" });
    const result = await createItemsFromFileDrop([text]);
    expect(result).toHaveLength(0);
  });
});

// ============================================================
// createItemsFromDirectoryDrop
// ============================================================

describe("createItemsFromDirectoryDrop", () => {
  it("flattens files from a directory one level deep", async () => {
    const file1 = makeFileDropItem("a.txt", "text/plain");
    const file2 = makeFileDropItem("b.txt", "text/plain");
    const dir = makeDirectoryDropItem("docs", [file1, file2]);

    const result = await createItemsFromDirectoryDrop([dir]);
    expect(result).toHaveLength(2);
    expect(result[0].directory).toBe("docs");
    expect(result[1].directory).toBe("docs");
    expect(result[0].fileName).toBe("a.txt");
    expect(result[1].fileName).toBe("b.txt");
  });

  it("skips non-directory items", async () => {
    const file = makeFileDropItem("f.txt", "text/plain");
    const result = await createItemsFromDirectoryDrop([file]);
    expect(result).toHaveLength(0);
  });
});

// ============================================================
// createItemsFromJsonDrop
// ============================================================

describe("createItemsFromJsonDrop", () => {
  it("parses JSON and uses label field", async () => {
    const item = makeTextDropItem({
      "application/json": JSON.stringify({ label: "My Label", value: 42 }),
    });
    const result = await createItemsFromJsonDrop([item]);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("My Label");
    expect(result[0].data).toEqual({ label: "My Label", value: 42 });
  });

  it("falls back to name field when label is absent", async () => {
    const item = makeTextDropItem({
      "application/json": JSON.stringify({ name: "Fallback Name" }),
    });
    const result = await createItemsFromJsonDrop([item]);
    expect(result[0].label).toBe("Fallback Name");
  });

  it("falls back to truncated text when no label or name", async () => {
    const json = JSON.stringify({ id: 1, count: 99 });
    const item = makeTextDropItem({ "application/json": json });
    const result = await createItemsFromJsonDrop([item]);
    expect(result[0].label).toBe(json.slice(0, 50));
  });

  it("skips items without application/json type", async () => {
    const item = makeTextDropItem({ "text/plain": '{"label":"Nope"}' });
    const result = await createItemsFromJsonDrop([item]);
    expect(result).toHaveLength(0);
  });

  it("skips invalid JSON gracefully", async () => {
    const item = makeTextDropItem({ "application/json": "not-json" });
    const result = await createItemsFromJsonDrop([item]);
    expect(result).toHaveLength(0);
  });
});

// ============================================================
// createItemsFromCsvDrop
// ============================================================

describe("createItemsFromCsvDrop", () => {
  it("parses CSV with headers and data rows", async () => {
    const csv = "name,age\nAlice,30\nBob,25";
    const item = makeTextDropItem({ "text/csv": csv });
    const result = await createItemsFromCsvDrop([item]);
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe("Alice");
    expect(result[0].row).toEqual({ name: "Alice", age: "30" });
    expect(result[0].headers).toEqual(["name", "age"]);
    expect(result[1].label).toBe("Bob");
  });

  it("skips items without text/csv type", async () => {
    const item = makeTextDropItem({ "text/plain": "name,age\nAlice,30" });
    const result = await createItemsFromCsvDrop([item]);
    expect(result).toHaveLength(0);
  });

  it("skips CSV with only a header row", async () => {
    const item = makeTextDropItem({ "text/csv": "name,age" });
    const result = await createItemsFromCsvDrop([item]);
    expect(result).toHaveLength(0);
  });

  it("trims whitespace from headers and values", async () => {
    const csv = " name , age \n Alice , 30 ";
    const item = makeTextDropItem({ "text/csv": csv });
    const result = await createItemsFromCsvDrop([item]);
    expect(result[0].row).toEqual({ name: "Alice", age: "30" });
    expect(result[0].headers).toEqual(["name", "age"]);
  });

  it("handles missing trailing values with empty strings", async () => {
    const csv = "a,b,c\n1";
    const item = makeTextDropItem({ "text/csv": csv });
    const result = await createItemsFromCsvDrop([item]);
    expect(result[0].row).toEqual({ a: "1", b: "", c: "" });
  });

  it("ignores blank lines", async () => {
    const csv = "name\n\nAlice\n\n";
    const item = makeTextDropItem({ "text/csv": csv });
    const result = await createItemsFromCsvDrop([item]);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Alice");
  });
});

// ============================================================
// createItemsFromImageDrop
// ============================================================

describe("createItemsFromImageDrop", () => {
  it("extracts image files with object URLs", async () => {
    const item = makeFileDropItem("photo.jpg", "image/jpeg");
    const result = await createItemsFromImageDrop([item]);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("photo.jpg");
    expect(result[0].fileType).toBe("image/jpeg");
    expect(result[0].objectUrl).toBeDefined();
    expect(typeof result[0].objectUrl).toBe("string");
  });

  it("skips non-image file items", async () => {
    const item = makeFileDropItem("doc.pdf", "application/pdf");
    const result = await createItemsFromImageDrop([item]);
    expect(result).toHaveLength(0);
  });

  it("skips text drop items", async () => {
    const item = makeTextDropItem({ "text/plain": "not an image" });
    const result = await createItemsFromImageDrop([item]);
    expect(result).toHaveLength(0);
  });
});

// ============================================================
// resolveDropOperation
// ============================================================

describe("resolveDropOperation", () => {
  const FORMAT = "nimbus-collection-item:ns";

  it("returns 'move' for internal items when allowed", () => {
    const types = new Set<string | symbol>([FORMAT]);
    const result = resolveDropOperation(types, ["move", "copy"], FORMAT, {
      externalDropOperation: "copy",
    });
    expect(result).toBe("move");
  });

  it("returns 'cancel' for internal items when move is not allowed", () => {
    const types = new Set<string | symbol>([FORMAT]);
    const result = resolveDropOperation(types, ["copy"], FORMAT, {
      externalDropOperation: "copy",
    });
    expect(result).toBe("cancel");
  });

  it("returns external operation for accepted external types", () => {
    const types = new Set<string | symbol>(["text/plain"]);
    const result = resolveDropOperation(types, ["copy", "move"], FORMAT, {
      onExternalDrop: () => [],
      acceptExternalTypes: ["text/plain"],
      externalDropOperation: "copy",
    });
    expect(result).toBe("copy");
  });

  it("returns 'cancel' when external type is not in acceptExternalTypes", () => {
    const types = new Set<string | symbol>(["image/png"]);
    const result = resolveDropOperation(types, ["copy", "move"], FORMAT, {
      onExternalDrop: () => [],
      acceptExternalTypes: ["text/plain"],
      externalDropOperation: "copy",
    });
    expect(result).toBe("cancel");
  });

  it("returns 'cancel' when external operation is not in allowedOperations", () => {
    const types = new Set<string | symbol>(["text/plain"]);
    const result = resolveDropOperation(types, ["move"], FORMAT, {
      onExternalDrop: () => [],
      acceptExternalTypes: ["text/plain"],
      externalDropOperation: "copy",
    });
    expect(result).toBe("cancel");
  });

  it("returns 'cancel' when no onExternalDrop and type is not internal", () => {
    const types = new Set<string | symbol>(["text/plain"]);
    const result = resolveDropOperation(types, ["copy", "move"], FORMAT, {
      externalDropOperation: "copy",
    });
    expect(result).toBe("cancel");
  });

  it("returns 'cancel' for items from a different namespace", () => {
    const types = new Set<string | symbol>(["nimbus-collection-item:other"]);
    const result = resolveDropOperation(types, ["move", "copy"], FORMAT, {
      externalDropOperation: "copy",
    });
    expect(result).toBe("cancel");
  });

  it("returns 'cancel' when onExternalDrop is set but acceptExternalTypes is empty", () => {
    const types = new Set<string | symbol>(["text/plain"]);
    const result = resolveDropOperation(types, ["copy"], FORMAT, {
      onExternalDrop: () => [],
      acceptExternalTypes: [],
      externalDropOperation: "copy",
    });
    expect(result).toBe("cancel");
  });
});
