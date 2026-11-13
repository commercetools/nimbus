import { describe, expect, it } from "vitest";
import { getResourceLinks } from "./get-resource-links";

describe("getResourceLinks", () => {
  it("returns an empty list when no link is set", () => {
    expect(getResourceLinks({})).toEqual([]);
  });

  it("returns only the links that are set", () => {
    expect(getResourceLinks({ githubLink: "https://github.com/a/b" })).toEqual([
      { key: "github", label: "GitHub", href: "https://github.com/a/b" },
    ]);
  });

  it("orders the links Figma, Storybook, GitHub", () => {
    const links = getResourceLinks({
      githubLink: "https://github.com/a/b",
      storybookLink: "https://storybook.example/",
      figmaLink: "https://figma.com/design/x",
    });
    expect(links.map((link) => link.label)).toEqual([
      "Figma",
      "Storybook",
      "GitHub",
    ]);
  });

  it("ignores empty strings", () => {
    expect(getResourceLinks({ figmaLink: "" })).toEqual([]);
  });
});
