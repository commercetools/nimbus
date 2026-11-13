import { describe, it, expect } from "vitest";
import { stringifyJson } from "./stringify-json";

describe("stringifyJson", () => {
  it("indents with 2 spaces by default", () => {
    expect(stringifyJson({ a: 1 })).toBe('{\n  "a": 1\n}');
  });

  it("uses the given indentation", () => {
    expect(stringifyJson({ a: 1 }, 4)).toBe('{\n    "a": 1\n}');
  });

  it("replaces circular references with [Circular]", () => {
    const value: Record<string, unknown> = { name: "root" };
    value.self = value;
    value.child = { parent: value };

    expect(JSON.parse(stringifyJson(value))).toEqual({
      name: "root",
      self: "[Circular]",
      child: { parent: "[Circular]" },
    });
  });

  it("keeps shared references that are not circular", () => {
    const shared = { id: 1 };

    expect(JSON.parse(stringifyJson({ a: shared, b: [shared] }))).toEqual({
      a: { id: 1 },
      b: [{ id: 1 }],
    });
  });

  it("writes BigInt values as decimal strings", () => {
    expect(stringifyJson({ id: 12345678901234567890n })).toBe(
      '{\n  "id": "12345678901234567890"\n}'
    );
    expect(stringifyJson(1n)).toBe('"1"');
  });

  it("writes undefined and functions as the text undefined", () => {
    expect(stringifyJson(undefined)).toBe("undefined");
    expect(stringifyJson(() => 1)).toBe("undefined");
  });

  it("does not throw when serialization throws", () => {
    const value = {
      toJSON() {
        throw new Error("no");
      },
    };

    expect(stringifyJson(value)).toBe("[Unserializable]");
  });
});
