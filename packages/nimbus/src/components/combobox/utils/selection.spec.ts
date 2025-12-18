import { describe, it, expect } from "vitest";
import { normalizeSelectedKeys, denormalizeSelectedKeys } from "./selection";

describe("selection utilities", () => {
  describe("normalizeSelectedKeys", () => {
    describe("handling undefined/null", () => {
      it("returns empty Set for undefined", () => {
        const result = normalizeSelectedKeys(undefined);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(0);
      });

      it("returns empty Set for null", () => {
        const result = normalizeSelectedKeys(null);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(0);
      });
    });

    describe("type signature validation", () => {
      it("accepts string key", () => {
        const result = normalizeSelectedKeys("key1");
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(1);
      });

      it("accepts number key", () => {
        const result = normalizeSelectedKeys(42);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(1);
      });

      it("accepts array of keys", () => {
        const result = normalizeSelectedKeys(["key1", "key2"]);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(2);
      });

      it("accepts undefined", () => {
        const result = normalizeSelectedKeys(undefined);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(0);
      });

      it("accepts null", () => {
        const result = normalizeSelectedKeys(null);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(0);
      });
    });

    describe("handling single key", () => {
      it("converts single string key to Set", () => {
        const result = normalizeSelectedKeys("single-key");
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(1);
        expect(result.has("single-key")).toBe(true);
      });

      it("converts single number key to Set", () => {
        const result = normalizeSelectedKeys(42);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(1);
        expect(result.has(42)).toBe(true);
      });

      it("treats zero as falsy (returns empty Set)", () => {
        // Note: 0 is falsy in JavaScript, so it's treated as "no selection"
        const result = normalizeSelectedKeys(0);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(0);
      });

      it("treats empty string as falsy (returns empty Set)", () => {
        // Note: "" is falsy in JavaScript, so it's treated as "no selection"
        const result = normalizeSelectedKeys("");
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(0);
      });
    });

    describe("handling array of keys", () => {
      it("converts array of strings to Set", () => {
        const result = normalizeSelectedKeys(["key1", "key2", "key3"]);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(3);
        expect(result.has("key1")).toBe(true);
        expect(result.has("key2")).toBe(true);
        expect(result.has("key3")).toBe(true);
      });

      it("converts array of numbers to Set", () => {
        const result = normalizeSelectedKeys([1, 2, 3]);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(3);
        expect(result.has(1)).toBe(true);
        expect(result.has(2)).toBe(true);
        expect(result.has(3)).toBe(true);
      });

      it("converts array of mixed types to Set", () => {
        const result = normalizeSelectedKeys(["key1", 42, "key2"]);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(3);
        expect(result.has("key1")).toBe(true);
        expect(result.has(42)).toBe(true);
        expect(result.has("key2")).toBe(true);
      });

      it("handles empty array", () => {
        const result = normalizeSelectedKeys([]);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(0);
      });

      it("removes duplicates from array", () => {
        const result = normalizeSelectedKeys(["key1", "key2", "key1"]);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(2);
        expect(result.has("key1")).toBe(true);
        expect(result.has("key2")).toBe(true);
      });

      it("handles array with single element", () => {
        const result = normalizeSelectedKeys(["single"]);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(1);
        expect(result.has("single")).toBe(true);
      });
    });

    describe("edge cases", () => {
      it("handles large arrays efficiently", () => {
        const largeArray = Array.from({ length: 1000 }, (_, i) => `key-${i}`);
        const result = normalizeSelectedKeys(largeArray);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(1000);
        expect(result.has("key-0")).toBe(true);
        expect(result.has("key-999")).toBe(true);
      });

      it("handles negative numbers", () => {
        const result = normalizeSelectedKeys([-1, -42]);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(2);
        expect(result.has(-1)).toBe(true);
        expect(result.has(-42)).toBe(true);
      });

      it("handles special string characters", () => {
        const result = normalizeSelectedKeys([
          "key@special",
          "key#hash",
          "key$dollar",
        ]);
        expect(result).toBeInstanceOf(Set);
        expect(result.size).toBe(3);
        expect(result.has("key@special")).toBe(true);
      });
    });
  });

  describe("denormalizeSelectedKeys", () => {
    describe("basic conversion", () => {
      it("converts empty Set to empty array", () => {
        const result = denormalizeSelectedKeys(new Set());
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
      });

      it("converts Set with single string key to array", () => {
        const result = denormalizeSelectedKeys(new Set(["key1"]));
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
        expect(result[0]).toBe("key1");
      });

      it("converts Set with single number key to array", () => {
        const result = denormalizeSelectedKeys(new Set([42]));
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(42);
      });

      it("converts Set with multiple keys to array", () => {
        const result = denormalizeSelectedKeys(
          new Set(["key1", "key2", "key3"])
        );
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(3);
        expect(result).toContain("key1");
        expect(result).toContain("key2");
        expect(result).toContain("key3");
      });

      it("converts Set with mixed key types to array", () => {
        const result = denormalizeSelectedKeys(new Set(["key1", 42, "key2"]));
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(3);
        expect(result).toContain("key1");
        expect(result).toContain(42);
        expect(result).toContain("key2");
      });
    });

    describe("return value characteristics", () => {
      it("always returns an array (not single value)", () => {
        const result = denormalizeSelectedKeys(new Set(["single"]));
        expect(Array.isArray(result)).toBe(true);
        expect(result).toEqual(["single"]);
      });

      it("returns a new array (not a reference)", () => {
        const inputSet = new Set(["key1"]);
        const result1 = denormalizeSelectedKeys(inputSet);
        const result2 = denormalizeSelectedKeys(inputSet);
        expect(result1).not.toBe(result2);
        expect(result1).toEqual(result2);
      });

      it("preserves order from Set iteration", () => {
        // Sets preserve insertion order
        const inputSet = new Set(["first", "second", "third"]);
        const result = denormalizeSelectedKeys(inputSet);
        expect(result).toEqual(["first", "second", "third"]);
      });
    });

    describe("edge cases", () => {
      it("handles Set with zero as key", () => {
        const result = denormalizeSelectedKeys(new Set([0]));
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(0);
      });

      it("handles Set with empty string as key", () => {
        const result = denormalizeSelectedKeys(new Set([""]));
        expect(result).toHaveLength(1);
        expect(result[0]).toBe("");
      });

      it("handles Set with negative numbers", () => {
        const result = denormalizeSelectedKeys(new Set([-1, -42]));
        expect(result).toHaveLength(2);
        expect(result).toContain(-1);
        expect(result).toContain(-42);
      });

      it("handles large Sets efficiently", () => {
        const largeSet = new Set(
          Array.from({ length: 1000 }, (_, i) => `key-${i}`)
        );
        const result = denormalizeSelectedKeys(largeSet);
        expect(result).toHaveLength(1000);
        expect(result[0]).toBe("key-0");
        expect(result[999]).toBe("key-999");
      });
    });
  });

  describe("round-trip conversion", () => {
    it("normalizing then denormalizing preserves keys", () => {
      const original = ["key1", "key2", "key3"];
      const normalized = normalizeSelectedKeys(original);
      const denormalized = denormalizeSelectedKeys(normalized);

      expect(denormalized).toHaveLength(3);
      expect(denormalized).toContain("key1");
      expect(denormalized).toContain("key2");
      expect(denormalized).toContain("key3");
    });

    it("handles single key round-trip", () => {
      const original = "single-key";
      const normalized = normalizeSelectedKeys(original);
      const denormalized = denormalizeSelectedKeys(normalized);

      expect(denormalized).toHaveLength(1);
      expect(denormalized[0]).toBe("single-key");
    });

    it("handles empty round-trip", () => {
      const original = undefined;
      const normalized = normalizeSelectedKeys(original);
      const denormalized = denormalizeSelectedKeys(normalized);

      expect(denormalized).toHaveLength(0);
    });

    it("handles array to Set round-trip", () => {
      const original = ["key1", "key2"];
      const normalized = normalizeSelectedKeys(original);
      const denormalized = denormalizeSelectedKeys(normalized);

      expect(denormalized).toHaveLength(2);
      expect(denormalized).toContain("key1");
      expect(denormalized).toContain("key2");
    });

    it("removes duplicates during round-trip", () => {
      const original = ["key1", "key2", "key1", "key2"];
      const normalized = normalizeSelectedKeys(original);
      const denormalized = denormalizeSelectedKeys(normalized);

      expect(denormalized).toHaveLength(2);
      expect(denormalized).toContain("key1");
      expect(denormalized).toContain("key2");
    });

    it("preserves mixed types during round-trip", () => {
      const original = ["key1", 42, "key2", 0];
      const normalized = normalizeSelectedKeys(original);
      const denormalized = denormalizeSelectedKeys(normalized);

      expect(denormalized).toHaveLength(4);
      expect(denormalized).toContain("key1");
      expect(denormalized).toContain(42);
      expect(denormalized).toContain("key2");
      expect(denormalized).toContain(0);
    });
  });

  describe("integration with typical use cases", () => {
    it("handles single selection mode (one key)", () => {
      // User selects a single item
      const selected = "item-1";
      const normalized = normalizeSelectedKeys(selected);

      expect(normalized.size).toBe(1);
      expect(normalized.has("item-1")).toBe(true);

      // Convert back for API response
      const forApi = denormalizeSelectedKeys(normalized);
      expect(forApi).toEqual(["item-1"]);
    });

    it("handles multiple selection mode (array of keys)", () => {
      // User selects multiple items
      const selected = ["item-1", "item-3", "item-5"];
      const normalized = normalizeSelectedKeys(selected);

      expect(normalized.size).toBe(3);

      // Convert back for API response
      const forApi = denormalizeSelectedKeys(normalized);
      expect(forApi).toHaveLength(3);
      expect(forApi).toContain("item-1");
      expect(forApi).toContain("item-3");
      expect(forApi).toContain("item-5");
    });

    it("handles no selection (undefined)", () => {
      const selected = undefined;
      const normalized = normalizeSelectedKeys(selected);

      expect(normalized.size).toBe(0);

      // Convert back for API response
      const forApi = denormalizeSelectedKeys(normalized);
      expect(forApi).toEqual([]);
    });

    it("converts selection to array for onChange callback", () => {
      // Component needs to convert internal Set to array for onChange callback
      const internalSelection = new Set(["item-2", "item-4"]);

      // Convert for onChange callback
      const forCallback = denormalizeSelectedKeys(internalSelection);
      expect(forCallback).toHaveLength(2);
      expect(forCallback).toContain("item-2");
      expect(forCallback).toContain("item-4");
    });
  });
});
