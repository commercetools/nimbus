import { describe, it, expect } from "vitest";
import { getFullName } from "./get-full-name";

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
