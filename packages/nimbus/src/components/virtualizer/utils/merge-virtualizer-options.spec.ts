import { describe, it, expect } from "vitest";
import type { VirtualizerListLayoutOptions } from "../virtualizer.types";
import { mergeVirtualizerOptions } from "./merge-virtualizer-options";

const merge = mergeVirtualizerOptions<VirtualizerListLayoutOptions>;

describe("mergeVirtualizerOptions", () => {
  it("returns the defaults when there are no consumer options", () => {
    expect(merge({ estimatedRowHeight: 38, gap: "100" })).toEqual({
      estimatedRowHeight: 38,
      gap: "100",
    });
  });

  it("lets consumer options override collection defaults", () => {
    expect(
      merge({ estimatedRowHeight: 38, gap: "100" }, { estimatedRowHeight: 56 })
    ).toEqual({ estimatedRowHeight: 56, gap: "100" });
  });

  it("adds consumer options the collection does not set", () => {
    expect(merge({ estimatedRowHeight: 38 }, { rowHeight: 40 })).toEqual({
      estimatedRowHeight: 38,
      rowHeight: 40,
    });
  });

  it("ignores consumer options that are undefined", () => {
    expect(
      merge({ estimatedRowHeight: 38 }, { estimatedRowHeight: undefined })
    ).toEqual({ estimatedRowHeight: 38 });
  });

  it("leaves keys unset that neither side sets", () => {
    const merged = merge({ gap: 4 }, { padding: 8 });
    expect(Object.keys(merged).sort()).toEqual(["gap", "padding"]);
  });
});
