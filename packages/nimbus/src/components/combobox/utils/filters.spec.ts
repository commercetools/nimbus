import { describe, it, expect } from "vitest";
import type { Node } from "react-stately";
import {
  filterByText,
  filterByStartsWith,
  filterByCaseSensitive,
  filterByWordBoundary,
  filterByFuzzy,
  createMultiPropertyFilter,
  createRankedFilter,
  createMultiTermFilter,
  createSectionAwareFilter,
} from "./filters";

// Helper to create mock nodes
function createMockNode<T extends object>(
  key: string,
  textValue: string,
  value?: T,
  type: "item" | "section" = "item"
): Node<T> {
  return {
    key,
    textValue,
    value: value as T,
    type,
  } as Node<T>;
}

describe("filter utilities", () => {
  describe("filterByText", () => {
    const nodes = [
      createMockNode("1", "Apple"),
      createMockNode("2", "Banana"),
      createMockNode("3", "Cherry"),
      createMockNode("4", "Date"),
      createMockNode("5", "Elderberry"),
    ];

    describe("basic filtering", () => {
      it("returns all nodes when input is empty", () => {
        const result = Array.from(filterByText(nodes, ""));
        expect(result).toHaveLength(5);
      });

      it("returns all nodes when input is whitespace only", () => {
        const result = Array.from(filterByText(nodes, "   "));
        expect(result).toHaveLength(5);
      });

      it("filters by substring match", () => {
        const result = Array.from(filterByText(nodes, "an"));
        expect(result).toHaveLength(1);
        expect(result[0].textValue).toBe("Banana");
      });

      it("is case-insensitive", () => {
        const result = Array.from(filterByText(nodes, "APPLE"));
        expect(result).toHaveLength(1);
        expect(result[0].textValue).toBe("Apple");
      });

      it("matches multiple items", () => {
        const result = Array.from(filterByText(nodes, "e"));
        expect(result).toHaveLength(4);
        expect(result.map((n) => n.textValue)).toEqual([
          "Apple",
          "Cherry",
          "Date",
          "Elderberry",
        ]);
      });
    });

    describe("edge cases", () => {
      it("returns empty array when no matches", () => {
        const result = Array.from(filterByText(nodes, "xyz"));
        expect(result).toHaveLength(0);
      });

      it("handles empty node list", () => {
        const result = Array.from(filterByText([], "test"));
        expect(result).toHaveLength(0);
      });

      it("handles special characters in input", () => {
        const specialNodes = [
          createMockNode("1", "test@example.com"),
          createMockNode("2", "user+tag@test.com"),
        ];
        const result = Array.from(filterByText(specialNodes, "@"));
        expect(result).toHaveLength(2);
      });
    });
  });

  describe("filterByStartsWith", () => {
    const nodes = [
      createMockNode("1", "Apple"),
      createMockNode("2", "Apricot"),
      createMockNode("3", "Banana"),
      createMockNode("4", "Blueberry"),
      createMockNode("5", "Cherry"),
    ];

    describe("basic filtering", () => {
      it("returns all nodes when input is empty", () => {
        const result = Array.from(filterByStartsWith(nodes, ""));
        expect(result).toHaveLength(5);
      });

      it("filters by prefix match", () => {
        const result = Array.from(filterByStartsWith(nodes, "Ap"));
        expect(result).toHaveLength(2);
        expect(result.map((n) => n.textValue)).toEqual(["Apple", "Apricot"]);
      });

      it("is case-insensitive", () => {
        const result = Array.from(filterByStartsWith(nodes, "ap"));
        expect(result).toHaveLength(2);
      });

      it("does not match substrings in middle", () => {
        const result = Array.from(filterByStartsWith(nodes, "berry"));
        expect(result).toHaveLength(0);
      });
    });

    describe("edge cases", () => {
      it("matches single character prefix", () => {
        const result = Array.from(filterByStartsWith(nodes, "B"));
        expect(result).toHaveLength(2);
        expect(result.map((n) => n.textValue)).toEqual(["Banana", "Blueberry"]);
      });

      it("returns exact match", () => {
        const result = Array.from(filterByStartsWith(nodes, "Cherry"));
        expect(result).toHaveLength(1);
        expect(result[0].textValue).toBe("Cherry");
      });
    });
  });

  describe("filterByCaseSensitive", () => {
    const nodes = [
      createMockNode("1", "Apple"),
      createMockNode("2", "apple"),
      createMockNode("3", "APPLE"),
      createMockNode("4", "Banana"),
    ];

    describe("case-sensitive matching", () => {
      it("returns all nodes when input is empty", () => {
        const result = Array.from(filterByCaseSensitive(nodes, ""));
        expect(result).toHaveLength(4);
      });

      it("matches exact case only", () => {
        const result = Array.from(filterByCaseSensitive(nodes, "Apple"));
        expect(result).toHaveLength(1);
        expect(result[0].textValue).toBe("Apple");
      });

      it("does not match different case", () => {
        const result = Array.from(filterByCaseSensitive(nodes, "apple"));
        expect(result).toHaveLength(1);
        expect(result[0].textValue).toBe("apple");
      });

      it("matches uppercase", () => {
        const result = Array.from(filterByCaseSensitive(nodes, "APPLE"));
        expect(result).toHaveLength(1);
        expect(result[0].textValue).toBe("APPLE");
      });
    });

    describe("substring matching", () => {
      it("matches case-sensitive substrings", () => {
        const result = Array.from(filterByCaseSensitive(nodes, "pp"));
        expect(result).toHaveLength(2);
        expect(result.map((n) => n.textValue)).toEqual(["Apple", "apple"]);
      });

      it("does not match wrong case substrings", () => {
        const result = Array.from(filterByCaseSensitive(nodes, "PP"));
        expect(result).toHaveLength(1);
        expect(result[0].textValue).toBe("APPLE");
      });
    });
  });

  describe("filterByWordBoundary", () => {
    const nodes = [
      createMockNode("1", "Bald Eagle"),
      createMockNode("2", "Golden Eagle"),
      createMockNode("3", "Beagle"),
      createMockNode("4", "Eagle Mountain"),
      createMockNode("5", "The Eagle"),
    ];

    describe("word boundary matching", () => {
      it("returns all nodes when input is empty", () => {
        const result = Array.from(filterByWordBoundary(nodes, ""));
        expect(result).toHaveLength(5);
      });

      it("matches word at start", () => {
        const result = Array.from(filterByWordBoundary(nodes, "Eagle"));
        expect(result).toHaveLength(4);
        expect(result.map((n) => n.textValue)).toEqual([
          "Bald Eagle",
          "Golden Eagle",
          "Eagle Mountain",
          "The Eagle",
        ]);
      });

      it("does not match partial word", () => {
        const result = Array.from(filterByWordBoundary(nodes, "eagle"));
        // Should not match "Beagle" since "eagle" is not at word boundary
        expect(result).toHaveLength(4);
        expect(result.some((n) => n.textValue === "Beagle")).toBe(false);
      });

      it("is case-insensitive", () => {
        const result = Array.from(filterByWordBoundary(nodes, "bald"));
        expect(result).toHaveLength(1);
        expect(result[0].textValue).toBe("Bald Eagle");
      });
    });

    describe("special character handling", () => {
      it("escapes regex special characters", () => {
        const specialNodes = [
          createMockNode("1", "test.file"),
          createMockNode("2", "test+plus"),
          createMockNode("3", "test[bracket]"),
        ];
        const result = Array.from(filterByWordBoundary(specialNodes, "test."));
        expect(result).toHaveLength(1);
        expect(result[0].textValue).toBe("test.file");
      });
    });
  });

  describe("filterByFuzzy", () => {
    const nodes = [
      createMockNode("1", "Bald Eagle"),
      createMockNode("2", "Blue Elephant"),
      createMockNode("3", "Black Bear"),
      createMockNode("4", "New Jersey"),
      createMockNode("5", "New York"),
    ];

    describe("fuzzy matching", () => {
      it("returns all nodes when input is empty", () => {
        const result = Array.from(filterByFuzzy(nodes, ""));
        expect(result).toHaveLength(5);
      });

      it("matches characters in order with gaps", () => {
        const result = Array.from(filterByFuzzy(nodes, "ble"));
        expect(result).toHaveLength(3);
        expect(result.map((n) => n.textValue)).toEqual([
          "Bald Eagle",
          "Blue Elephant",
          "Black Bear",
        ]);
      });

      it("matches abbreviated input", () => {
        const result = Array.from(filterByFuzzy(nodes, "nj"));
        expect(result).toHaveLength(1);
        expect(result[0].textValue).toBe("New Jersey");
      });

      it("is case-insensitive", () => {
        const result = Array.from(filterByFuzzy(nodes, "BE"));
        expect(result).toHaveLength(3);
        expect(result.map((n) => n.textValue)).toEqual([
          "Bald Eagle",
          "Blue Elephant",
          "Black Bear",
        ]);
      });

      it("does not match out of order characters", () => {
        const result = Array.from(filterByFuzzy(nodes, "elb"));
        expect(result).toHaveLength(0);
      });
    });

    describe("edge cases", () => {
      it("matches single character", () => {
        const result = Array.from(filterByFuzzy(nodes, "B"));
        expect(result).toHaveLength(3);
      });

      it("requires all characters to match in order", () => {
        const result = Array.from(filterByFuzzy(nodes, "Bld"));
        expect(result).toHaveLength(1);
        expect(result[0].textValue).toBe("Bald Eagle");
      });
    });
  });

  describe("createMultiPropertyFilter", () => {
    type Product = {
      id: string;
      name: string;
      category: string;
      description: string;
    };

    const products: Node<Product>[] = [
      createMockNode("1", "iPhone", {
        id: "1",
        name: "iPhone",
        category: "Electronics",
        description: "A smartphone",
      }),
      createMockNode("2", "iPad", {
        id: "2",
        name: "iPad",
        category: "Electronics",
        description: "A tablet device",
      }),
      createMockNode("3", "Desk", {
        id: "3",
        name: "Desk",
        category: "Furniture",
        description: "Office desk",
      }),
    ];

    describe("multi-property search", () => {
      it("returns all nodes when input is empty", () => {
        const filter = createMultiPropertyFilter<Product>(["name", "category"]);
        const result = Array.from(filter(products, ""));
        expect(result).toHaveLength(3);
      });

      it("searches across specified properties", () => {
        const filter = createMultiPropertyFilter<Product>([
          "name",
          "category",
          "description",
        ]);
        const result = Array.from(filter(products, "tablet"));
        expect(result).toHaveLength(1);
        expect(result[0]?.value?.name).toBe("iPad");
      });

      it("matches if any property contains input", () => {
        const filter = createMultiPropertyFilter<Product>(["name", "category"]);
        const result = Array.from(filter(products, "Electronics"));
        expect(result).toHaveLength(2);
        expect(result.map((n) => n?.value?.name)).toEqual(["iPhone", "iPad"]);
      });

      it("is case-insensitive", () => {
        const filter = createMultiPropertyFilter<Product>(["category"]);
        const result = Array.from(filter(products, "electronics"));
        expect(result).toHaveLength(2);
      });
    });

    describe("nested property support", () => {
      type NestedProduct = {
        id: string;
        details: {
          name: string;
          specs: {
            brand: string;
          };
        };
      };

      it("supports dot notation for nested properties", () => {
        const nestedProducts: Node<NestedProduct>[] = [
          createMockNode("1", "Product 1", {
            id: "1",
            details: { name: "iPhone", specs: { brand: "Apple" } },
          }),
          createMockNode("2", "Product 2", {
            id: "2",
            details: { name: "Galaxy", specs: { brand: "Samsung" } },
          }),
        ];

        const filter = createMultiPropertyFilter<NestedProduct>([
          "details.name",
          "details.specs.brand",
        ]);
        const result = Array.from(filter(nestedProducts, "Apple"));
        expect(result).toHaveLength(1);
        expect(result[0]?.value?.details.specs.brand).toBe("Apple");
      });
    });

    describe("edge cases", () => {
      it("handles nodes without value", () => {
        const nodesWithoutValue: Node<Product>[] = [
          { key: "1", textValue: "Test", type: "item" } as Node<Product>,
        ];
        const filter = createMultiPropertyFilter<Product>(["name"]);
        const result = Array.from(filter(nodesWithoutValue, "test"));
        expect(result).toHaveLength(0);
      });

      it("handles null/undefined property values", () => {
        const nodesWithNull: Node<Partial<Product>>[] = [
          createMockNode("1", "Test", {
            id: "1",
            name: "Test",
            category: undefined as unknown as string,
            description: "",
          }),
        ];
        const filter = createMultiPropertyFilter<Partial<Product>>([
          "category",
        ]);
        const result = Array.from(filter(nodesWithNull, "test"));
        expect(result).toHaveLength(0);
      });
    });
  });

  describe("createRankedFilter", () => {
    const nodes = [
      createMockNode("1", "Apple"),
      createMockNode("2", "Apricot"),
      createMockNode("3", "Banana"),
      createMockNode("4", "Pineapple"),
    ];

    describe("scoring and ranking", () => {
      it("returns all nodes when input is empty", () => {
        const filter = createRankedFilter<object>(() => 1);
        const result = Array.from(filter(nodes, ""));
        expect(result).toHaveLength(4);
      });

      it("filters out items with score <= 0", () => {
        const filter = createRankedFilter<object>((node) => {
          return node.textValue.startsWith("A") ? 100 : 0;
        });
        const result = Array.from(filter(nodes, "test"));
        expect(result).toHaveLength(2);
        expect(result.map((n) => n.textValue)).toEqual(["Apple", "Apricot"]);
      });

      it("sorts by score descending", () => {
        const filter = createRankedFilter<object>((node, input) => {
          const text = node.textValue.toLowerCase();
          const lowerInput = input.toLowerCase();
          if (text.startsWith(lowerInput)) return 100;
          if (text.includes(lowerInput)) return 50;
          return 0;
        });
        const result = Array.from(filter(nodes, "app"));
        // "Apple" starts with "app" (score 100)
        // "Pineapple" contains "app" (score 50)
        // "Apricot" doesn't contain "app" (score 0, filtered out)
        expect(result.map((n) => n.textValue)).toEqual(["Apple", "Pineapple"]);
      });

      it("handles equal scores", () => {
        const filter = createRankedFilter<object>(() => 50);
        const result = Array.from(filter(nodes, "test"));
        expect(result).toHaveLength(4);
      });
    });

    describe("custom scoring logic", () => {
      it("can use complex scoring algorithms", () => {
        const filter = createRankedFilter<object>((node, input) => {
          const text = node.textValue.toLowerCase();
          const lowerInput = input.toLowerCase();

          let score;
          if (text === lowerInput)
            score = 1000; // Exact match
          else if (text.startsWith(lowerInput))
            score = 100; // Prefix
          else if (text.includes(lowerInput))
            score = 50; // Substring
          else return 0;

          // Boost shorter results
          score += 100 / text.length;

          return score;
        });

        const result = Array.from(filter(nodes, "apple"));
        // "Apple" should score highest (exact match + shortest)
        expect(result[0].textValue).toBe("Apple");
      });
    });
  });

  describe("createMultiTermFilter", () => {
    const nodes = [
      createMockNode("1", "Bald Eagle"),
      createMockNode("2", "Golden Eagle"),
      createMockNode("3", "Bison"),
      createMockNode("4", "Black Bear"),
      createMockNode("5", "Brown Bear"),
    ];

    describe("multi-term matching", () => {
      it("returns all nodes when input is empty", () => {
        const filter = createMultiTermFilter<object>();
        const result = Array.from(filter(nodes, ""));
        expect(result).toHaveLength(5);
      });

      it("matches items containing any term (OR logic)", () => {
        const filter = createMultiTermFilter<object>();
        const result = Array.from(filter(nodes, "eagle bison"));
        expect(result).toHaveLength(3);
        expect(result.map((n) => n.textValue)).toEqual([
          "Bald Eagle",
          "Golden Eagle",
          "Bison",
        ]);
      });

      it("splits input by whitespace", () => {
        const filter = createMultiTermFilter<object>();
        const result = Array.from(filter(nodes, "  bald   golden  "));
        expect(result).toHaveLength(2);
        expect(result.map((n) => n.textValue)).toEqual([
          "Bald Eagle",
          "Golden Eagle",
        ]);
      });

      it("removes duplicate matches", () => {
        const filter = createMultiTermFilter<object>();
        const result = Array.from(filter(nodes, "bear black brown"));
        // Should not duplicate "Black Bear" or "Brown Bear"
        expect(result).toHaveLength(2);
      });
    });

    describe("custom base filter", () => {
      it("uses custom base filter for term matching", () => {
        const filter = createMultiTermFilter<object>(filterByStartsWith);
        const result = Array.from(filter(nodes, "bald golden"));
        expect(result).toHaveLength(2);
        expect(result.map((n) => n.textValue)).toEqual([
          "Bald Eagle",
          "Golden Eagle",
        ]);
      });

      it("works with fuzzy filter", () => {
        const filter = createMultiTermFilter<object>(filterByFuzzy);
        const result = Array.from(filter(nodes, "ble bbr"));
        expect(result).toHaveLength(3);
      });
    });
  });

  describe("createSectionAwareFilter", () => {
    type AnimalItem = { id: string; name: string };
    type AnimalSection = { id: string; name: string; items: AnimalItem[] };

    describe("section structure preservation", () => {
      it("returns all nodes when input is empty", () => {
        const nodes = [
          createMockNode<AnimalSection>(
            "mammals",
            "Mammals",
            undefined,
            "section"
          ),
          createMockNode<AnimalItem>("1", "Lion"),
          createMockNode<AnimalItem>("2", "Tiger"),
          createMockNode<AnimalSection>("birds", "Birds", undefined, "section"),
          createMockNode<AnimalItem>("3", "Eagle"),
          createMockNode<AnimalItem>("4", "Hawk"),
        ];

        const filter = createSectionAwareFilter<AnimalItem | AnimalSection>(
          filterByText
        );
        const result = Array.from(filter(nodes, ""));
        expect(result).toHaveLength(6);
      });

      it("preserves sections with matching items", () => {
        const nodes = [
          createMockNode<AnimalSection>(
            "mammals",
            "Mammals",
            undefined,
            "section"
          ),
          createMockNode<AnimalItem>("1", "Lion"),
          createMockNode<AnimalItem>("2", "Tiger"),
          createMockNode<AnimalSection>("birds", "Birds", undefined, "section"),
          createMockNode<AnimalItem>("3", "Eagle"),
          createMockNode<AnimalItem>("4", "Hawk"),
        ];

        const filter = createSectionAwareFilter<AnimalItem | AnimalSection>(
          filterByText
        );
        const result = Array.from(filter(nodes, "Eagle"));

        // Should include: section "birds" + "Eagle"
        expect(result).toHaveLength(2);
        expect(result[0].type).toBe("section");
        expect(result[0].textValue).toBe("Birds");
        expect(result[1].textValue).toBe("Eagle");
      });

      it("hides sections with no matching items", () => {
        const nodes = [
          createMockNode<AnimalSection>(
            "mammals",
            "Mammals",
            undefined,
            "section"
          ),
          createMockNode<AnimalItem>("1", "Lion"),
          createMockNode<AnimalItem>("2", "Tiger"),
          createMockNode<AnimalSection>("birds", "Birds", undefined, "section"),
          createMockNode<AnimalItem>("3", "Eagle"),
          createMockNode<AnimalItem>("4", "Hawk"),
        ];

        const filter = createSectionAwareFilter<AnimalItem | AnimalSection>(
          filterByText
        );
        const result = Array.from(filter(nodes, "Lion"));

        // Should include: section "mammals" + "Lion" only
        expect(result).toHaveLength(2);
        expect(result[0].textValue).toBe("Mammals");
        expect(result[1].textValue).toBe("Lion");
      });

      it("handles multiple sections with matches", () => {
        const nodes = [
          createMockNode<AnimalSection>(
            "mammals",
            "Mammals",
            undefined,
            "section"
          ),
          createMockNode<AnimalItem>("1", "Bear"),
          createMockNode<AnimalItem>("2", "Tiger"),
          createMockNode<AnimalSection>("birds", "Birds", undefined, "section"),
          createMockNode<AnimalItem>("3", "Eagle"),
          createMockNode<AnimalItem>("4", "Peacock"),
        ];

        const filter = createSectionAwareFilter<AnimalItem | AnimalSection>(
          filterByText
        );
        const result = Array.from(filter(nodes, "ea"));

        // Should match: "Bear" in mammals, "Eagle" and "Peacock" in birds
        expect(result).toHaveLength(5);
        expect(result[0].textValue).toBe("Mammals");
        expect(result[1].textValue).toBe("Bear");
        expect(result[2].textValue).toBe("Birds");
        expect(result[3].textValue).toBe("Eagle");
        expect(result[4].textValue).toBe("Peacock");
      });
    });

    describe("custom item filters", () => {
      it("works with starts-with filter", () => {
        const nodes = [
          createMockNode<AnimalSection>(
            "mammals",
            "Mammals",
            undefined,
            "section"
          ),
          createMockNode<AnimalItem>("1", "Lion"),
          createMockNode<AnimalItem>("2", "Tiger"),
          createMockNode<AnimalSection>("birds", "Birds", undefined, "section"),
          createMockNode<AnimalItem>("3", "Eagle"),
          createMockNode<AnimalItem>("4", "Emu"),
        ];

        const filter = createSectionAwareFilter<AnimalItem | AnimalSection>(
          filterByStartsWith
        );
        const result = Array.from(filter(nodes, "E"));

        expect(result).toHaveLength(3);
        expect(result[0].textValue).toBe("Birds");
        expect(result[1].textValue).toBe("Eagle");
        expect(result[2].textValue).toBe("Emu");
      });

      it("works with fuzzy filter", () => {
        const nodes = [
          createMockNode<AnimalSection>(
            "mammals",
            "Mammals",
            undefined,
            "section"
          ),
          createMockNode<AnimalItem>("1", "Black Bear"),
          createMockNode<AnimalSection>("birds", "Birds", undefined, "section"),
          createMockNode<AnimalItem>("2", "Bald Eagle"),
        ];

        const filter = createSectionAwareFilter<AnimalItem | AnimalSection>(
          filterByFuzzy
        );
        const result = Array.from(filter(nodes, "ble"));

        expect(result).toHaveLength(4);
        expect(result.map((n) => n.textValue)).toEqual([
          "Mammals",
          "Black Bear",
          "Birds",
          "Bald Eagle",
        ]);
      });
    });

    describe("edge cases", () => {
      it("handles empty sections", () => {
        const nodes = [
          createMockNode<AnimalSection>(
            "empty",
            "Empty Section",
            undefined,
            "section"
          ),
          createMockNode<AnimalSection>(
            "mammals",
            "Mammals",
            undefined,
            "section"
          ),
          createMockNode<AnimalItem>("1", "Lion"),
        ];

        const filter = createSectionAwareFilter<AnimalItem | AnimalSection>(
          filterByText
        );
        const result = Array.from(filter(nodes, "Lion"));

        expect(result).toHaveLength(2);
        expect(result[0].textValue).toBe("Mammals");
        expect(result[1].textValue).toBe("Lion");
      });

      it("handles sections at the end", () => {
        const nodes = [
          createMockNode<AnimalSection>(
            "mammals",
            "Mammals",
            undefined,
            "section"
          ),
          createMockNode<AnimalItem>("1", "Lion"),
          createMockNode<AnimalSection>("birds", "Birds", undefined, "section"),
        ];

        const filter = createSectionAwareFilter<AnimalItem | AnimalSection>(
          filterByText
        );
        const result = Array.from(filter(nodes, "Lion"));

        expect(result).toHaveLength(2);
        expect(result[0].textValue).toBe("Mammals");
        expect(result[1].textValue).toBe("Lion");
      });
    });
  });
});
