import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { Key } from "react-aria-components";
import { useTree } from "./use-tree";
import { fileTree, type TreeNode } from "../utils/tree.test-data";

/**
 * `useTree` exposes React Stately's tree mutations — including `move` — as an
 * imperative controller for programmatic edits, alongside the state it spreads
 * onto `Tree.Root`. Moving a node *into its own subtree* is not a meaningful
 * operation, and `move` neither rejects nor reports it: the node is detached,
 * then re-attached under a parent key that no longer exists, so the dragged node
 * and everything beneath it are dropped from the tree with no error raised.
 *
 * Drag-and-drop does not expose this. React Aria's `getDropOperation` cancels
 * any internal drop targeting a dragged key or a descendant of one, for pointer
 * and keyboard alike (`react-stately`'s `useDroppableCollectionState`), so
 * `onMove` is never handed such a target — pinned by the
 * `DropTargetsExcludeDraggedSubtree` story. The reachable path is a consumer
 * calling `move` directly.
 *
 * The two failing cases below are the defect; the first test is a control
 * proving the harness itself moves nodes correctly.
 */

/** Structural view of a `useTreeData` node, enough to walk the hierarchy. */
interface WalkableNode {
  key: Key;
  children?: WalkableNode[] | null;
}

/** Every key in the tree, in document order. */
const flattenKeys = (nodes: readonly WalkableNode[]): Key[] =>
  nodes.flatMap((node) => [node.key, ...flattenKeys(node.children ?? [])]);

/** The 7 keys of `fileTree`, in document order, before any mutation. */
const ALL_KEYS = [
  "documents",
  "project",
  "report",
  "budget",
  "photos",
  "image-1",
  "image-2",
];

const setup = () =>
  renderHook(() =>
    useTree<TreeNode>({
      initialItems: fileTree,
      getKey: (item) => item.id,
      getChildren: (item) => item.children ?? [],
      dragAndDrop: true,
    })
  );

/**
 * Run a tree mutation, capturing a throw rather than failing on it, so each
 * case can report whether the call threw *and* whether the data survived
 * instead of stopping at the first symptom.
 */
const attempt = (fn: () => void): unknown => {
  let caught: unknown;
  act(() => {
    try {
      fn();
    } catch (error) {
      caught = error;
    }
  });
  return caught;
};

describe("useTree — move into own subtree", () => {
  it("moves a node into an unrelated group (control)", () => {
    const { result } = setup();
    expect(flattenKeys(result.current.items)).toEqual(ALL_KEYS);

    const error = attempt(() => result.current.move("report", "photos", 2));

    expect(error).toBeUndefined();
    expect(result.current.getItem("report")).toBeDefined();
    expect(flattenKeys(result.current.items)).toHaveLength(ALL_KEYS.length);
    expect(
      result.current.getItem("photos")?.children?.map((child) => child.key)
    ).toContain("report");
  });

  it("keeps the node and its subtree when moved into itself", () => {
    const { result } = setup();
    const index = result.current.getItem("documents")?.children?.length ?? 0;

    const error = attempt(() =>
      result.current.move("documents", "documents", index)
    );

    expect
      .soft(error, "move() neither rejected nor reported the no-op")
      .toBeUndefined();
    expect
      .soft(result.current.getItem("documents"), "moved node was dropped")
      .toBeDefined();
    expect(flattenKeys(result.current.items)).toEqual(ALL_KEYS);
  });

  it("keeps the node and its subtree when moved into its own descendant", () => {
    const { result } = setup();
    const index = result.current.getItem("project")?.children?.length ?? 0;

    // "project" is a child of "documents".
    const error = attempt(() =>
      result.current.move("documents", "project", index)
    );

    expect
      .soft(error, "move() neither rejected nor reported the invalid move")
      .toBeUndefined();
    expect
      .soft(result.current.getItem("documents"), "moved node was dropped")
      .toBeDefined();
    expect(flattenKeys(result.current.items)).toEqual(
      expect.arrayContaining(ALL_KEYS)
    );
  });
});
