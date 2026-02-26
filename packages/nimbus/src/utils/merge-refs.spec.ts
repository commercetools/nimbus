import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { mergeRefs } from "./merge-refs";

describe("mergeRefs", () => {
  it("calls callback refs with the node", () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const merged = mergeRefs(cb1, cb2);
    const node = document.createElement("div");

    merged(node);

    expect(cb1).toHaveBeenCalledWith(node);
    expect(cb2).toHaveBeenCalledWith(node);
  });

  it("assigns to RefObject refs", () => {
    const ref1 = createRef<HTMLDivElement>();
    const ref2 = createRef<HTMLDivElement>();
    const merged = mergeRefs(ref1, ref2);
    const node = document.createElement("div");

    merged(node);

    expect(ref1.current).toBe(node);
    expect(ref2.current).toBe(node);
  });

  it("handles a mix of callback and object refs", () => {
    const cb = vi.fn();
    const objRef = createRef<HTMLDivElement>();
    const merged = mergeRefs(cb, objRef);
    const node = document.createElement("div");

    merged(node);

    expect(cb).toHaveBeenCalledWith(node);
    expect(objRef.current).toBe(node);
  });

  it("skips null and undefined refs", () => {
    const cb = vi.fn();
    const merged = mergeRefs(null, cb, undefined);
    const node = document.createElement("div");

    merged(node);

    expect(cb).toHaveBeenCalledWith(node);
  });
});
