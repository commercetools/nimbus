/**
 * Test-only helpers for simulating native HTML drag-and-drop in the
 * Storybook/jsdom test runner.
 *
 * React Aria's `useDrop` (which powers `DropZone`) listens for native
 * `dragenter` / `dragover` / `dragleave` / `drop` events and reads drag
 * payload from the event's `dataTransfer`. Browsers do not allow scripts to
 * construct a real `DataTransfer` with items, and jsdom's `DragEvent` does not
 * support passing `dataTransfer` through its constructor at all — so these
 * helpers build a minimal mock that satisfies the surface React Aria reads
 * (`items`, `types`, `getData`, `effectAllowed`, `dropEffect`) and attach it to
 * a plain `Event` via `Object.defineProperty`, then dispatch that as if it
 * were the native `DragEvent`.
 */

export type MockDataTransferItem =
  | { kind: "file"; type: string; file: File }
  | { kind: "string"; type: string; data: string };

interface MockDataTransfer {
  items: Array<{
    kind: "file" | "string";
    type: string;
    getAsFile: () => File | null;
  }>;
  types: string[];
  effectAllowed: string;
  dropEffect: string;
  getData: (type: string) => string;
  files: File[];
}

/** Builds a mock `DataTransfer` from a simple item description. */
export const makeDataTransfer = (
  items: MockDataTransferItem[]
): MockDataTransfer => {
  const stringData = new Map<string, string>();
  const files: File[] = [];

  const dtItems = items.map((item) => {
    if (item.kind === "file") {
      files.push(item.file);
      return {
        kind: "file" as const,
        type: item.type,
        getAsFile: (): File | null => item.file,
        // Deliberately omit `webkitGetAsEntry`: React Aria's `useDrop` only
        // calls it when the property is a function, and treats a `null`
        // return value as "no file" (skipping the item entirely) rather than
        // falling back to `getAsFile()`. Omitting it entirely routes through
        // `useDrop`'s `else` branch, which calls `getAsFile()` directly —
        // matching plain drag-and-drop from outside the browser (e.g. the OS
        // file manager) in browsers/mocks without a filesystem entry API.
      };
    }
    stringData.set(item.type, item.data);
    return {
      kind: "string" as const,
      type: item.type,
      getAsFile: (): File | null => null,
    };
  });

  const types = [
    ...new Set(items.map((item) => item.type)),
    ...(files.length > 0 ? ["Files"] : []),
  ];

  return {
    items: dtItems,
    types,
    effectAllowed: "all",
    dropEffect: "none",
    getData: (type: string) => stringData.get(type) ?? "",
    files,
  };
};

/** Convenience factory for a single-file drag payload. */
export const makeFileDataTransfer = (
  files: File | File[]
): MockDataTransfer => {
  const fileList = Array.isArray(files) ? files : [files];
  return makeDataTransfer(
    fileList.map((file) => ({
      kind: "file" as const,
      type: file.type || "application/octet-stream",
      file,
    }))
  );
};

/**
 * Dispatches a synthetic drag event of the given type on `element`, with the
 * provided mock `DataTransfer` attached. jsdom's `DragEvent` does not accept
 * `dataTransfer` via its constructor, so a plain `Event` is used and
 * `dataTransfer` is defined on it directly.
 */
export const fireDragEvent = (
  element: Element,
  type: "dragenter" | "dragover" | "dragleave" | "drop",
  dataTransfer: MockDataTransfer,
  init: { clientX?: number; clientY?: number } = {}
) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
  Object.defineProperty(event, "clientX", { value: init.clientX ?? 0 });
  Object.defineProperty(event, "clientY", { value: init.clientY ?? 0 });
  element.dispatchEvent(event);
  return event;
};

/**
 * Simulates a full drag-enter-then-drop sequence on `element`: fires
 * `dragenter`, then `dragover` (required by React Aria's `useDrop` to compute
 * the drop operation before a drop is accepted), then `drop`.
 */
export const fireDrop = (element: Element, dataTransfer: MockDataTransfer) => {
  fireDragEvent(element, "dragenter", dataTransfer);
  fireDragEvent(element, "dragover", dataTransfer);
  fireDragEvent(element, "drop", dataTransfer);
};

/** Simulates a drag entering and hovering over `element` without dropping. */
export const fireDragOver = (
  element: Element,
  dataTransfer: MockDataTransfer
) => {
  fireDragEvent(element, "dragenter", dataTransfer);
  fireDragEvent(element, "dragover", dataTransfer);
};

/** Simulates the drag leaving `element` (clears the drop-target highlight). */
export const fireDragLeave = (
  element: Element,
  dataTransfer: MockDataTransfer
) => {
  fireDragEvent(element, "dragleave", dataTransfer);
};
