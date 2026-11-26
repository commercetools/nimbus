import { describe, it, expect } from "vitest";
import { classifySourceFiles } from "./resolve-source-files.js";

describe("classifySourceFiles", () => {
  it("names the kind of each source file", () => {
    expect(
      classifySourceFiles([
        "dialog.tsx",
        "dialog.types.ts",
        "dialog.stories.tsx",
        "dialog.i18n.ts",
        "dialog.mdx",
      ]).sort()
    ).toEqual(["i18n", "stories", "types"]);
  });

  it("counts a docs spec as docsSpec, not as spec", () => {
    expect(classifySourceFiles(["tabs.docs.spec.tsx"])).toEqual(["docsSpec"]);
    expect(classifySourceFiles(["tabs.spec.tsx"])).toEqual(["spec"]);
  });

  it("returns nothing for other files", () => {
    expect(classifySourceFiles(["readme.md"])).toEqual([]);
  });
});
