/**
 * Unit tests for Avatar's pure helpers.
 *
 * Component behavior (rendered DOM, image fallback, icon fallback) is
 * covered by avatar.stories.tsx play functions. These JSDOM-fast tests
 * exercise the initials extraction edge-case matrix that would otherwise
 * require many browser-test permutations.
 */

import { describe, it, expect } from "vitest";
import { getInitials, getFullName } from "./avatar";

describe("getInitials", () => {
  it("returns uppercase first character of each name", () => {
    expect(getInitials("John", "Doe")).toBe("JD");
  });

  it("uppercases lowercase input", () => {
    expect(getInitials("john", "doe")).toBe("JD");
  });

  it("trims leading and trailing whitespace before extracting", () => {
    expect(getInitials(" John ", "Doe")).toBe("JD");
    expect(getInitials("John ", " Doe")).toBe("JD");
    expect(getInitials("\tJohn\n", "Doe")).toBe("JD");
  });

  it("returns empty string when both names are empty", () => {
    expect(getInitials("", "")).toBe("");
  });

  it("returns empty string when both names are undefined", () => {
    expect(getInitials(undefined, undefined)).toBe("");
  });

  it("returns empty string when both names are whitespace only", () => {
    expect(getInitials("  ", "\t\n")).toBe("");
  });

  it("returns single initial when only firstName is provided", () => {
    expect(getInitials("John", undefined)).toBe("J");
    expect(getInitials("John", "")).toBe("J");
    expect(getInitials("John", "  ")).toBe("J");
  });

  it("returns single initial when only lastName is provided", () => {
    expect(getInitials(undefined, "Doe")).toBe("D");
    expect(getInitials("", "Doe")).toBe("D");
    expect(getInitials(" ", "Doe")).toBe("D");
  });

  it("preserves astral-plane codepoints (emoji)", () => {
    // 👨 is a surrogate pair in UTF-16; charAt(0) would return half of it.
    // Array.from yields the full codepoint as a single string slice.
    expect(getInitials("\u{1F468}", "Doe")).toBe("\u{1F468}D");
  });

  it("handles non-cased scripts (CJK)", () => {
    // toUpperCase is a no-op for ideographic characters; result is unchanged.
    expect(getInitials("中", "村")).toBe("中村");
  });

  it("handles single-character names", () => {
    expect(getInitials("J", "D")).toBe("JD");
  });

  it("never returns undefined", () => {
    // The caller distinguishes 'render text' from 'render Person icon' by
    // checking for an empty string. Returning undefined would break that
    // contract.
    expect(typeof getInitials(undefined, undefined)).toBe("string");
    expect(typeof getInitials("", "")).toBe("string");
  });
});

describe("getFullName", () => {
  it("joins both trimmed names with a single space", () => {
    expect(getFullName("John", "Doe")).toBe("John Doe");
    expect(getFullName(" John ", " Doe ")).toBe("John Doe");
  });

  it("returns just firstName when lastName is missing", () => {
    expect(getFullName("John", undefined)).toBe("John");
    expect(getFullName("John", "")).toBe("John");
    expect(getFullName("John", "  ")).toBe("John");
  });

  it("returns just lastName when firstName is missing", () => {
    expect(getFullName(undefined, "Doe")).toBe("Doe");
    expect(getFullName("", "Doe")).toBe("Doe");
    expect(getFullName(" ", "Doe")).toBe("Doe");
  });

  it("returns empty string when both are missing", () => {
    expect(getFullName(undefined, undefined)).toBe("");
    expect(getFullName("", "")).toBe("");
    expect(getFullName(" ", "\t")).toBe("");
  });

  it("does not produce leading, trailing, or doubled spaces", () => {
    expect(getFullName("John", " ")).toBe("John");
    expect(getFullName(" ", "Doe")).toBe("Doe");
    expect(getFullName("  John  ", "  Doe  ")).toBe("John Doe");
  });
});
