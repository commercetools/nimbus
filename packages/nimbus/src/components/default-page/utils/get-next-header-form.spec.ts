import { describe, expect, it } from "vitest";
import { getNextHeaderForm } from "./get-next-header-form";

const measured = {
  fullHeight: 120,
  collapsedHeight: 48,
};

// Space given back is 72. Collapse at 80 (72 + 8). Full below 1.

describe("getNextHeaderForm", () => {
  it("collapses at the space given back plus 8 CSS pixels", () => {
    expect(
      getNextHeaderForm({
        ...measured,
        currentForm: "full",
        distance: 80,
      })
    ).toBe("collapsed");
  });

  it("is full below 1 CSS pixel", () => {
    expect(
      getNextHeaderForm({
        ...measured,
        currentForm: "collapsed",
        distance: 0.9,
      })
    ).toBe("full");
  });

  it("keeps the current form between the two points", () => {
    expect(
      getNextHeaderForm({
        ...measured,
        currentForm: "full",
        distance: 1,
      })
    ).toBe("full");
    expect(
      getNextHeaderForm({
        ...measured,
        currentForm: "full",
        distance: 79,
      })
    ).toBe("full");
    expect(
      getNextHeaderForm({
        ...measured,
        currentForm: "collapsed",
        distance: 1,
      })
    ).toBe("collapsed");
    expect(
      getNextHeaderForm({
        ...measured,
        currentForm: "collapsed",
        distance: 79,
      })
    ).toBe("collapsed");
  });

  it("keeps the collapsed form when scrolling up within the range", () => {
    expect(
      getNextHeaderForm({
        ...measured,
        currentForm: "collapsed",
        distance: 40,
      })
    ).toBe("collapsed");
  });

  it("is full when nothing could be measured", () => {
    expect(
      getNextHeaderForm({
        currentForm: "collapsed",
        distance: null,
        fullHeight: 120,
        collapsedHeight: 48,
      })
    ).toBe("full");
    expect(
      getNextHeaderForm({
        currentForm: "collapsed",
        distance: 200,
        fullHeight: undefined,
        collapsedHeight: 48,
      })
    ).toBe("full");
    expect(
      getNextHeaderForm({
        currentForm: "collapsed",
        distance: 200,
        fullHeight: 120,
        collapsedHeight: null,
      })
    ).toBe("full");
  });

  it("is full when the header height is 0", () => {
    expect(
      getNextHeaderForm({
        currentForm: "collapsed",
        distance: 200,
        fullHeight: 0,
        collapsedHeight: 0,
      })
    ).toBe("full");
  });
});
