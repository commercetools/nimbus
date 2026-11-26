import { describe, expect, it } from "vitest";
import {
  headingText,
  matchesViewLabel,
  promoteViewHeading,
} from "./view-heading";

describe("headingText", () => {
  it("returns a string as it is", () => {
    expect(headingText("Overview")).toBe("Overview");
  });

  it("joins the text of nested children", () => {
    expect(headingText(["Use ", { props: { children: "Button" } }])).toBe(
      "Use Button"
    );
  });

  it("returns an empty string for nothing", () => {
    expect(headingText(undefined)).toBe("");
  });
});

describe("matchesViewLabel", () => {
  it("matches the same text", () => {
    expect(matchesViewLabel("Overview", "Overview")).toBe(true);
  });

  it("ignores case and surrounding space", () => {
    expect(matchesViewLabel("  overview ", "Overview")).toBe(true);
  });

  it("does not match a different text", () => {
    expect(matchesViewLabel("Getting started", "Implementation")).toBe(false);
  });

  it("does not match without a label", () => {
    expect(matchesViewLabel("Overview", undefined)).toBe(false);
  });
});

const item = (value: string, depth: number) => ({ value, depth });

describe("promoteViewHeading", () => {
  const toc = [
    item("Overview", 2),
    item("Resources", 3),
    item("Primary actions", 4),
    item("Variables", 3),
    item("Usage", 2),
    item("Details", 3),
  ];

  it("drops the matching first h2 and moves its children up one level", () => {
    expect(promoteViewHeading(toc, "Overview")).toEqual([
      item("Resources", 2),
      item("Primary actions", 3),
      item("Variables", 2),
      item("Usage", 2),
      item("Details", 3),
    ]);
  });

  it("keeps the list when the first h2 does not match", () => {
    expect(promoteViewHeading(toc, "Implementation")).toEqual(toc);
  });

  it("keeps the list when there is no label", () => {
    expect(promoteViewHeading(toc, undefined)).toEqual(toc);
  });

  it("only looks at the first h2", () => {
    const list = [item("Intro", 2), item("Overview", 2), item("A", 3)];
    expect(promoteViewHeading(list, "Overview")).toEqual(list);
  });

  it("does not change items before the first h2", () => {
    const list = [item("Lead", 1), item("Overview", 2), item("A", 3)];
    expect(promoteViewHeading(list, "Overview")).toEqual([
      item("Lead", 1),
      item("A", 2),
    ]);
  });
});
