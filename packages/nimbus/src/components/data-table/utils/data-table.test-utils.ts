import { within, userEvent, spyOn, expect, waitFor } from "storybook/test";

// Toggle a checkbox given its root (the data-testid'd <label>). As of
// react-aria 3.49 the press needs trusted pointer events, so the synthetic
// userEvent no longer toggles via the <label> — but clicking the <input>
// still works. Assertions use the root (data-selected lives there); the click
// targets the input within it.
export const toggleCheckbox = (checkbox: HTMLElement) =>
  userEvent.click(within(checkbox).getByRole("checkbox"));

export const rowNamed = (canvasElement: HTMLElement, name: RegExp) =>
  within(canvasElement).getByRole("row", { name });

/**
 * Records `console.warn` calls for a story and restores the original afterwards.
 * `beforeEach` returns the cleanup, so the console is restored even when an
 * assertion in `play` fails part-way.
 */
export const recordWarnings = (warnings: string[]) => () => {
  const spy = spyOn(console, "warn").mockImplementation((...args) => {
    warnings.push(args.map(String).join(" "));
  });
  return () => {
    spy.mockRestore();
    warnings.length = 0;
  };
};

export const dragButtons = (root: HTMLElement) =>
  within(root).queryAllByRole("button", { name: /drag to reorder/i });

export const rowNamedExactly = (
  canvas: ReturnType<typeof within>,
  name: string
) => canvas.getByRole("row", { name: new RegExp(`^${name}$`) });

export const isDragging = (root: HTMLElement) =>
  root.querySelector("[data-dragging='true']") !== null;

/** Focuses the row's drag button with the keyboard and starts a keyboard drag. */
export const startKeyboardDrag = async (
  root: HTMLElement,
  row: HTMLElement
) => {
  row.focus();
  const handle = within(row).getByRole("button", { name: /drag to reorder/i });
  // React Aria reads its focus state when the key arrives, so a key sent right
  // after `focus()` can be lost. Send ArrowRight again until the handle has
  // focus, and only while the row still has it.
  await waitFor(async () => {
    if (document.activeElement === row)
      await userEvent.keyboard("{ArrowRight}");
    expect(handle).toHaveFocus();
  });
  await userEvent.keyboard("{Enter}");
  await waitFor(() => expect(isDragging(root)).toBe(true));
};

/** Presses a key and waits until focus moves to the next drop target. */
export const moveDropTarget = async (key: string) => {
  const before = document.activeElement;
  await userEvent.keyboard(key);
  await waitFor(() => expect(document.activeElement).not.toBe(before));
};

/**
 * The minimal `DataTransfer` that React Aria's drag source and drop target
 * read. Chromium does not let a script build a real one (see the ListBox
 * stories), and a play cannot start a native drag with the pointer.
 */
export const createDataTransfer = () => {
  const data = new Map<string, string>();
  return {
    effectAllowed: "all",
    dropEffect: "none",
    files: [] as File[],
    get types() {
      return [...data.keys()];
    },
    get items() {
      const items = [...data.keys()].map((type) => ({ kind: "string", type }));
      return Object.assign(items, {
        add: (value: string, type: string) => void data.set(type, value),
      });
    },
    setData: (type: string, value: string) => void data.set(type, value),
    getData: (type: string) => data.get(type) ?? "",
    setDragImage: () => {},
  };
};

/** Dispatches a native drag event at the vertical position inside `el`. */
export const dispatchDrag = (
  el: Element,
  type: "dragstart" | "dragenter" | "dragover" | "drop" | "dragend",
  dataTransfer: ReturnType<typeof createDataTransfer>,
  fraction = 0.5
) => {
  const rect = el.getBoundingClientRect();
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
  Object.defineProperty(event, "clientX", {
    value: rect.left + rect.width / 2,
  });
  Object.defineProperty(event, "clientY", {
    value: rect.top + rect.height * fraction,
  });
  el.dispatchEvent(event);
};

/**
 * A pointer drag from `source` onto the `fraction` (0 top, 1 bottom) of
 * `target`, with mocked native drag events.
 */
export const pointerDrag = async (
  root: HTMLElement,
  source: HTMLElement,
  target: HTMLElement,
  fraction: number
) => {
  const dataTransfer = createDataTransfer();
  dispatchDrag(source, "dragstart", dataTransfer);
  await waitFor(() => expect(isDragging(root)).toBe(true));
  dispatchDrag(target, "dragenter", dataTransfer, fraction);
  dispatchDrag(target, "dragover", dataTransfer, fraction);
  await waitFor(() =>
    expect(root.querySelector("[data-drop-target]")).not.toBeNull()
  );
  dispatchDrag(target, "drop", dataTransfer, fraction);
  dispatchDrag(source, "dragend", dataTransfer);
  await waitFor(() => expect(isDragging(root)).toBe(false));
};
