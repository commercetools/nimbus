import { describe, it, expect } from "vitest";
import {
  defaultGetKey,
  defaultGetTextValue,
  defaultGetNewOptionData,
} from "./collection";

describe("collection utilities", () => {
  describe("defaultGetKey", () => {
    describe("string keys", () => {
      it("returns the string as-is", () => {
        expect(defaultGetKey("test-key")).toBe("test-key");
      });

      it("handles empty string", () => {
        expect(defaultGetKey("")).toBe("");
      });
    });

    describe("number keys", () => {
      it("returns the number as-is", () => {
        expect(defaultGetKey(123)).toBe(123);
      });

      it("handles zero", () => {
        expect(defaultGetKey(0)).toBe(0);
      });

      it("handles negative numbers", () => {
        expect(defaultGetKey(-42)).toBe(-42);
      });
    });

    describe("object with id property", () => {
      it("extracts id from object with string id", () => {
        const item = { id: "item-1", name: "Item 1" };
        expect(defaultGetKey(item)).toBe("item-1");
      });

      it("extracts id from object with number id", () => {
        const item = { id: 42, name: "Item 42" };
        expect(defaultGetKey(item)).toBe(42);
      });

      it("works with objects that have additional properties", () => {
        const item = { id: "test", name: "Test", value: 123, extra: "data" };
        expect(defaultGetKey(item)).toBe("test");
      });
    });

    describe("error handling", () => {
      it("throws error for object without id property", () => {
        const item = { name: "Test" };
        expect(() => defaultGetKey(item)).toThrow(
          "Item must have an 'id' property or provide getKey function"
        );
      });

      it("throws error for empty object", () => {
        const item = {};
        expect(() => defaultGetKey(item)).toThrow(
          "Item must have an 'id' property or provide getKey function"
        );
      });
    });
  });

  describe("defaultGetTextValue", () => {
    describe("string items", () => {
      it("returns the string as-is", () => {
        expect(defaultGetTextValue("Test String")).toBe("Test String");
      });

      it("handles empty string", () => {
        expect(defaultGetTextValue("")).toBe("");
      });
    });

    describe("object with name property", () => {
      it("extracts name from object", () => {
        const item = { id: "1", name: "Item Name" };
        expect(defaultGetTextValue(item)).toBe("Item Name");
      });

      it("converts non-string name to string", () => {
        const item = { id: "1", name: 123 };
        expect(defaultGetTextValue(item)).toBe("123");
      });

      it("prefers name over label when both exist", () => {
        const item = { id: "1", name: "Name Value", label: "Label Value" };
        expect(defaultGetTextValue(item)).toBe("Name Value");
      });
    });

    describe("object with label property", () => {
      it("extracts label when name is not present", () => {
        const item = { id: "1", label: "Item Label" };
        expect(defaultGetTextValue(item)).toBe("Item Label");
      });

      it("converts non-string label to string", () => {
        const item = { id: "1", label: 456 };
        expect(defaultGetTextValue(item)).toBe("456");
      });
    });

    describe("fallback behavior", () => {
      it("converts object to string when no name or label", () => {
        const item = { id: "1", value: "test" };
        expect(defaultGetTextValue(item)).toBe("[object Object]");
      });

      it("handles objects with toString method", () => {
        const item = {
          id: "1",
          toString() {
            return "Custom String";
          },
        };
        expect(defaultGetTextValue(item)).toBe("Custom String");
      });
    });
  });

  describe("defaultGetNewOptionData", () => {
    describe("basic functionality", () => {
      it("creates object with id and name from input", () => {
        const result = defaultGetNewOptionData<{ id: string; name: string }>(
          "New Option"
        );

        expect(result).toEqual({
          id: "New Option",
          name: "New Option",
        });
      });

      it("handles empty string input", () => {
        const result = defaultGetNewOptionData<{ id: string; name: string }>(
          ""
        );

        expect(result).toEqual({
          id: "",
          name: "",
        });
      });

      it("handles input with special characters", () => {
        const input = "Special!@#$%^&*()_+-=[]{}|;:',.<>?";
        const result = defaultGetNewOptionData<{ id: string; name: string }>(
          input
        );

        expect(result).toEqual({
          id: input,
          name: input,
        });
      });

      it("handles input with whitespace", () => {
        const result = defaultGetNewOptionData<{ id: string; name: string }>(
          "  Spaced  Option  "
        );

        expect(result).toEqual({
          id: "  Spaced  Option  ",
          name: "  Spaced  Option  ",
        });
      });

      it("handles unicode characters", () => {
        const result = defaultGetNewOptionData<{ id: string; name: string }>(
          "日本語 🎉"
        );

        expect(result).toEqual({
          id: "日本語 🎉",
          name: "日本語 🎉",
        });
      });
    });

    describe("return type", () => {
      it("returns object with correct structure", () => {
        const result = defaultGetNewOptionData<{ id: string; name: string }>(
          "Test"
        );

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("name");
        expect(Object.keys(result)).toHaveLength(2);
      });

      it("can be cast to different types", () => {
        // This tests the type casting behavior of the function
        type CustomType = { id: string; name: string; extra?: string };
        const result = defaultGetNewOptionData<CustomType>("Test");

        // TypeScript should accept this without error
        const typed: CustomType = result;
        expect(typed.id).toBe("Test");
        expect(typed.name).toBe("Test");
      });
    });
  });
});
