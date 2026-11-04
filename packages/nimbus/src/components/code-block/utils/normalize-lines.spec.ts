import { describe, it, expect } from "vitest";
import { normalizeLines } from "./normalize-lines";

describe("normalizeLines", () => {
  it("splits on LF", () => {
    expect(normalizeLines("a\nb")).toEqual(["a", "b"]);
  });

  it("splits on CRLF", () => {
    expect(normalizeLines("a\r\nb\r\nc")).toEqual(["a", "b", "c"]);
  });

  it("splits on CR", () => {
    expect(normalizeLines("a\rb")).toEqual(["a", "b"]);
  });

  it("drops one trailing line break", () => {
    expect(normalizeLines("a\nb\n")).toEqual(["a", "b"]);
    expect(normalizeLines("a\r\nb\r\n")).toEqual(["a", "b"]);
  });

  it("keeps empty lines before the trailing line break", () => {
    expect(normalizeLines("a\n\n")).toEqual(["a", ""]);
    expect(normalizeLines("\n")).toEqual([""]);
  });

  it("keeps empty lines in the middle", () => {
    expect(normalizeLines("a\n\nb")).toEqual(["a", "", "b"]);
  });

  it("returns no lines for empty code", () => {
    expect(normalizeLines("")).toEqual([]);
  });
});
