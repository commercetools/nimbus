import { describe, it, expect } from "vitest";
import { parseTagAttributes } from "./parse-tag-attributes";

describe("markdown utils — parseTagAttributes", () => {
  it("returns an empty object for empty/missing input", () => {
    expect(parseTagAttributes("")).toEqual({});
    expect(parseTagAttributes(undefined)).toEqual({});
    expect(parseTagAttributes("   ")).toEqual({});
  });

  it("parses double- and single-quoted string values", () => {
    expect(parseTagAttributes(` id="foo" title='Bar' `)).toEqual({
      id: "foo",
      title: "Bar",
    });
  });

  it("parses bare (unquoted) values", () => {
    expect(parseTagAttributes(" count=3 ")).toEqual({ count: "3" });
  });

  it("treats a valueless attribute as boolean true", () => {
    expect(parseTagAttributes(" disabled ")).toEqual({ disabled: true });
  });

  it("preserves attribute-name casing", () => {
    expect(parseTagAttributes(` toneColor="blue" data-testid="x" `)).toEqual({
      toneColor: "blue",
      "data-testid": "x",
    });
  });

  it("drops expression values (never evaluated)", () => {
    expect(parseTagAttributes(' id={someVar} title="ok" ')).toEqual({
      title: "ok",
    });
  });

  it("keeps `>` inside a quoted value", () => {
    expect(parseTagAttributes(` label="a > b" `)).toEqual({ label: "a > b" });
  });
});
