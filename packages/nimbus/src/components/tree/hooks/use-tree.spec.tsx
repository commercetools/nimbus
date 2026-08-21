import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { Key } from "react-aria-components";
import { useTree } from "./use-tree";
import { fileTree, type TreeNode } from "../utils/tree.test-data";

/**
 * `useTree` exposes React Stately's tree mutations as an imperative controller
 * for programmatic edits, alongside the state it spreads onto `Tree.Root`.
 *
 * Moving a node into its own subtree has no valid result: React Stately
 * detaches the node, then re-attaches it under a parent key that no longer
 * exists, so the node and every descendant are dropped from the tree. Left
 * unguarded this happened silently — no throw, no rejection, no diagnostic —
 * while `moveBefore` / `moveAfter` already threw for the same condition.
 * `useTree` now rejects it, so the whole controller reports consistently.
 *
 * Drag-and-drop never reached this: React Aria's `getDropOperation` cancels any
 * internal drop targeting a dragged key or a descendant of one, for pointer and
 * keyboard alike — pinned by the `DropTargetsExcludeDraggedSubtree` story.
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

/** Run a mutation, returning whatever it threw instead of failing the test. */
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
  it("rejects moving a node into itself, leaving the tree untouched", () => {
    const { result } = setup();
    const index = result.current.getItem("documents")?.children?.length ?? 0;

    const error = attempt(() =>
      result.current.move("documents", "documents", index)
    );

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toMatch(/itself or one of its own/i);
    expect(result.current.getItem("documents")).toBeDefined();
    expect(flattenKeys(result.current.items)).toEqual(ALL_KEYS);
  });

  it("rejects moving a node into its own descendant", () => {
    const { result } = setup();
    const index = result.current.getItem("project")?.children?.length ?? 0;

    // "project" is a child of "documents"; "report" a grandchild.
    const intoChild = attempt(() =>
      result.current.move("documents", "project", index)
    );
    const intoGrandchild = attempt(() =>
      result.current.move("documents", "report", 0)
    );

    expect(intoChild).toBeInstanceOf(Error);
    expect(intoGrandchild).toBeInstanceOf(Error);
    expect(flattenKeys(result.current.items)).toEqual(ALL_KEYS);
  });

  it("still moves a node into an unrelated group", () => {
    const { result } = setup();
    expect(flattenKeys(result.current.items)).toEqual(ALL_KEYS);

    const error = attempt(() => result.current.move("report", "photos", 2));

    expect(error).toBeUndefined();
    expect(
      result.current.getItem("photos")?.children?.map((child) => child.key)
    ).toContain("report");
    expect(flattenKeys(result.current.items)).toHaveLength(ALL_KEYS.length);
  });

  it("still moves a node into its own parent and up to the root", () => {
    const { result } = setup();

    // A node's parent and ancestors are outside its subtree — the guard must
    // not over-reach and block legitimate moves upward.
    const intoParent = attempt(() =>
      result.current.move("report", "documents", 0)
    );
    const toRoot = attempt(() => result.current.move("budget", null, 0));

    expect(intoParent).toBeUndefined();
    expect(toRoot).toBeUndefined();
    expect(result.current.getItem("report")).toBeDefined();
    expect(result.current.getItem("budget")).toBeDefined();
    expect(flattenKeys(result.current.items)).toHaveLength(ALL_KEYS.length);
  });
});

/**
 * Sibling reordering is what `onMove` delegates to for `"before"` / `"after"`
 * drop positions. The browser-level drop mechanics are React Aria's, and the
 * `DragAndDrop` story covers a real keyboard drag end-to-end, but the ordering
 * outcome itself is asserted here where it is deterministic rather than
 * dependent on which insertion point a keypress lands on.
 */
describe("useTree — sibling reordering", () => {
  const childKeysOf = (
    result: ReturnType<typeof setup>["result"],
    parent: Key
  ) => result.current.getItem(parent)?.children?.map((child) => child.key);

  it("moves a node before a sibling", () => {
    const { result } = setup();
    expect(childKeysOf(result, "photos")).toEqual(["image-1", "image-2"]);

    act(() => {
      result.current.moveBefore("image-1", ["image-2"]);
    });

    expect(childKeysOf(result, "photos")).toEqual(["image-2", "image-1"]);
  });

  it("moves a node after a sibling", () => {
    const { result } = setup();

    act(() => {
      result.current.moveAfter("budget", ["report"]);
    });

    expect(childKeysOf(result, "project")).toEqual(["budget", "report"]);
  });

  it("keeps multiple moved nodes in document order, not selection order", () => {
    const { result } = setup();

    // `onMove` receives keys in selection order; a drag selected bottom-to-top
    // must still land top-to-bottom.
    act(() => {
      result.current.moveBefore("image-1", ["budget", "report"]);
    });

    expect(childKeysOf(result, "photos")).toEqual([
      "report",
      "budget",
      "image-1",
      "image-2",
    ]);
  });
});
