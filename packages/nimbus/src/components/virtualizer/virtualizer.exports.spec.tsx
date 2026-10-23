import { describe, it, expect } from "vitest";
import * as components from "../index";
import * as virtualizerModule from "./index";
import { ListBox } from "../list-box/list-box";
import type { VirtualizerListLayoutOptions } from "../index";

describe("Virtualizer public surface", () => {
  it("exports nothing at runtime from the virtualizer folder", () => {
    // Only the type `VirtualizerListLayoutOptions` is exported.
    expect(Object.keys(virtualizerModule)).toEqual([]);
  });

  it("does not export the Virtualizer, its helpers or React Aria layouts from the package", () => {
    for (const name of [
      "Virtualizer",
      "ListLayout",
      "GridLayout",
      "TableLayout",
      "mergeVirtualizerOptions",
      "useVirtualizerOptionsWarning",
    ]) {
      expect(components).not.toHaveProperty(name);
    }
  });

  it("types ListBox virtualizerOptions with the list options (type-level)", () => {
    const options: VirtualizerListLayoutOptions = {
      estimatedRowHeight: 56,
      gap: "100",
      padding: 8,
    };
    const valid = (
      <ListBox.Root isVirtualized virtualizerOptions={options} aria-label="a">
        <ListBox.Item id="a">A</ListBox.Item>
      </ListBox.Root>
    );
    const invalid = [
      <ListBox.Root
        key="columns"
        isVirtualized
        // @ts-expect-error -- grid options are not list options
        virtualizerOptions={{ maxColumns: 3 }}
        aria-label="b"
      >
        <ListBox.Item id="b">B</ListBox.Item>
      </ListBox.Root>,
      <ListBox.Root
        key="token"
        isVirtualized
        // @ts-expect-error -- gap accepts spacing tokens or numbers only
        virtualizerOptions={{ gap: "not-a-token" }}
        aria-label="c"
      >
        <ListBox.Item id="c">C</ListBox.Item>
      </ListBox.Root>,
    ];
    expect(valid).toBeDefined();
    expect(invalid).toHaveLength(2);
  });
});
