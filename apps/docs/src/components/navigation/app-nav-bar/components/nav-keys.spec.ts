import { describe, expect, it } from "vitest";
import { nextIndex } from "./nav-keys";

describe("nextIndex", () => {
  it("moves forward and backward", () => {
    expect(nextIndex(1, "ArrowRight", 4, true)).toBe(2);
    expect(nextIndex(1, "ArrowDown", 4, false)).toBe(2);
    expect(nextIndex(2, "ArrowLeft", 4, true)).toBe(1);
    expect(nextIndex(2, "ArrowUp", 4, false)).toBe(1);
  });

  it("wraps at the ends when wrap is true", () => {
    expect(nextIndex(3, "ArrowRight", 4, true)).toBe(0);
    expect(nextIndex(0, "ArrowLeft", 4, true)).toBe(3);
  });

  it("stays at the ends when wrap is false", () => {
    expect(nextIndex(3, "ArrowDown", 4, false)).toBe(3);
    expect(nextIndex(0, "ArrowUp", 4, false)).toBe(0);
  });

  it("goes to the first and last item with Home and End", () => {
    expect(nextIndex(2, "Home", 4, false)).toBe(0);
    expect(nextIndex(1, "End", 4, true)).toBe(3);
  });

  it("returns null for other keys and empty lists", () => {
    expect(nextIndex(1, "a", 4, true)).toBeNull();
    expect(nextIndex(0, "ArrowDown", 0, true)).toBeNull();
  });
});
