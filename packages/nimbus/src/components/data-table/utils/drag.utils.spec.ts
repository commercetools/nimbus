import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDraggableItem } from "react-aria";
import type { DraggableCollectionState } from "react-stately";
import { isRowDragDisabled, restrictDraggableItem } from "./drag.utils";

describe("isRowDragDisabled", () => {
  it("is false without draggableKeys", () => {
    expect(isRowDragDisabled({ rowKey: "a" })).toBe(false);
  });

  it("is true for a row outside draggableKeys", () => {
    expect(
      isRowDragDisabled({ rowKey: "a", draggableKeys: new Set(["b"]) })
    ).toBe(true);
  });

  it("is false for a listed row", () => {
    expect(
      isRowDragDisabled({ rowKey: "a", draggableKeys: new Set(["a"]) })
    ).toBe(false);
  });

  it("is true for every row with an empty set", () => {
    expect(isRowDragDisabled({ rowKey: "a", draggableKeys: new Set() })).toBe(
      true
    );
  });
});

/**
 * A minimal `DraggableCollectionState` for React Aria's real
 * `useDraggableItem`. `disabledKey` is the key React Aria itself treats as
 * disabled.
 */
const createState = (disabledKey?: string) =>
  ({
    isDisabled: false,
    selectionManager: {
      isDisabled: (key: string) => key === disabledKey,
      isSelected: () => false,
      selectionMode: "none",
    },
    collection: { getItem: () => ({ textValue: "Row" }) },
    getKeysForDrag: (key: string) => new Set([key]),
    getItems: () => [],
    getAllowedDropOperations: () => ["move"],
    startDrag: () => {},
    moveDrag: () => {},
    endDrag: () => {},
  }) as unknown as DraggableCollectionState;

describe("restrictDraggableItem", () => {
  const props = { key: "a", hasDragButton: true };

  it("returns React Aria's result untouched for a listed key", () => {
    const state = createState();
    const original = renderHook(() => useDraggableItem(props, state)).result
      .current;
    const restricted = renderHook(() =>
      restrictDraggableItem(useDraggableItem, new Set(["a"]))(props, state)
    ).result.current;
    expect(restricted.dragButtonProps.isDisabled).toBe(false);
    expect(Object.keys(restricted.dragProps)).toEqual(
      Object.keys(original.dragProps)
    );
  });

  // Guards the coupling to React Aria internals: the result for a key outside
  // draggableKeys must look exactly like React Aria's own result for a
  // disabled item. If an upgrade changes that shape, this test fails.
  it("matches React Aria's own disabled result for an unlisted key", () => {
    const disabledByAria = renderHook(() =>
      useDraggableItem(props, createState("a"))
    ).result.current;
    const restricted = renderHook(() =>
      restrictDraggableItem(useDraggableItem, new Set(["b"]))(
        props,
        createState()
      )
    ).result.current;

    expect(restricted.dragProps).toEqual(disabledByAria.dragProps);
    expect(restricted.dragProps).toEqual({});
    expect(restricted.dragButtonProps.isDisabled).toBe(true);
    expect(Object.keys(restricted.dragButtonProps).sort()).toEqual(
      Object.keys(disabledByAria.dragButtonProps).sort()
    );
  });

  it("keeps React Aria's disabled result for a listed disabled key", () => {
    const restricted = renderHook(() =>
      restrictDraggableItem(useDraggableItem, new Set(["a"]))(
        props,
        createState("a")
      )
    ).result.current;
    expect(restricted.dragProps).toEqual({});
    expect(restricted.dragButtonProps.isDisabled).toBe(true);
  });
});
