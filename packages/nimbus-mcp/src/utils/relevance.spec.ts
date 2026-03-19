import { describe, it, expect } from "vitest";
import {
  scoreRelevance,
  rankByRelevance,
  filterAndRankByRelevance,
} from "./relevance.js";
import type { RelevanceFields } from "../types.js";

// ---------------------------------------------------------------------------
// scoreRelevance
// ---------------------------------------------------------------------------

describe("scoreRelevance", () => {
  const base: RelevanceFields = {
    title: "",
    description: "",
    tags: "",
  };

  it("returns 0 when no tokens match any field", () => {
    const fields: RelevanceFields = {
      title: "Button",
      description: "A clickable element",
      tags: "input interactive",
    };
    expect(scoreRelevance(fields, ["xyzzy"])).toBe(0);
  });

  it("returns 0 for empty tokens", () => {
    expect(scoreRelevance({ ...base, title: "Button" }, [])).toBe(0);
  });

  it("title match scores higher than description match", () => {
    const titleMatch = scoreRelevance({ ...base, title: "color" }, ["color"]);
    const descMatch = scoreRelevance({ ...base, description: "color" }, [
      "color",
    ]);
    expect(titleMatch).toBeGreaterThan(descMatch);
  });

  it("description and tags score equally", () => {
    const descMatch = scoreRelevance({ ...base, description: "color" }, [
      "color",
    ]);
    const tagsMatch = scoreRelevance({ ...base, tags: "color" }, ["color"]);
    expect(descMatch).toBe(tagsMatch);
  });

  it("content scores lower than description", () => {
    const descMatch = scoreRelevance({ ...base, description: "color" }, [
      "color",
    ]);
    const contentMatch = scoreRelevance({ ...base, content: "color" }, [
      "color",
    ]);
    expect(descMatch).toBeGreaterThan(contentMatch);
  });

  it("scores accumulate across multiple matching fields", () => {
    const oneField = scoreRelevance({ ...base, title: "color" }, ["color"]);
    const twoFields = scoreRelevance(
      { ...base, title: "color", description: "color" },
      ["color"]
    );
    expect(twoFields).toBeGreaterThan(oneField);
  });

  it("scores accumulate across multiple tokens", () => {
    const oneToken = scoreRelevance({ ...base, title: "color" }, ["color"]);
    const twoTokens = scoreRelevance({ ...base, title: "color tokens" }, [
      "color",
      "tokens",
    ]);
    expect(twoTokens).toBeGreaterThan(oneToken);
  });

  it("is case-insensitive", () => {
    const lower = scoreRelevance({ ...base, title: "Button" }, ["button"]);
    const upper = scoreRelevance({ ...base, title: "button" }, ["button"]);
    expect(lower).toBe(upper);
    expect(lower).toBeGreaterThan(0);
  });

  it("content is optional — omitting it scores the same as empty string", () => {
    const withContent = scoreRelevance(
      { ...base, title: "Button", content: "" },
      ["button"]
    );
    const withoutContent = scoreRelevance({ ...base, title: "Button" }, [
      "button",
    ]);
    expect(withContent).toBe(withoutContent);
  });
});

// ---------------------------------------------------------------------------
// rankByRelevance
// ---------------------------------------------------------------------------

describe("rankByRelevance", () => {
  type Item = { id: string; title: string; description: string; tags: string };

  const getFields = (item: Item): RelevanceFields => ({
    title: item.title,
    description: item.description,
    tags: item.tags,
  });

  it("returns empty array for empty input", () => {
    expect(rankByRelevance([], ["color"], getFields)).toEqual([]);
  });

  it("returns items unchanged for empty tokens", () => {
    const items: Item[] = [
      { id: "a", title: "Button", description: "", tags: "" },
      { id: "b", title: "Select", description: "", tags: "" },
    ];
    expect(rankByRelevance(items, [], getFields)).toEqual(items);
  });

  it("places the highest-scoring item first", () => {
    const items: Item[] = [
      { id: "blurs", title: "Blurs", description: "blur tokens", tags: "" },
      {
        id: "colors",
        title: "Colors",
        description: "available colors",
        tags: "",
      },
      {
        id: "spacing",
        title: "Spacing",
        description: "spacing tokens",
        tags: "",
      },
    ];
    // "Colors" has title match for "color"; others only match on description
    const ranked = rankByRelevance(items, ["color"], getFields);
    expect(ranked[0].id).toBe("colors");
  });

  it("mirrors the color tokens scenario — Colors ranks above other token pages", () => {
    const items: Item[] = [
      {
        id: "design-tokens",
        title: "Design Tokens",
        description: "style definitions colors fonts spacing",
        tags: "tokens",
      },
      {
        id: "blurs",
        title: "Blurs",
        description: "blur tokens",
        tags: "tokens",
      },
      {
        id: "shadows",
        title: "Shadows",
        description: "shadow tokens",
        tags: "tokens",
      },
      {
        id: "borders",
        title: "Borders",
        description: "border tokens",
        tags: "tokens",
      },
      {
        id: "colors",
        title: "Colors",
        description: "available colors",
        tags: "tokens color",
      },
      {
        id: "spacing",
        title: "Spacing",
        description: "spacing tokens",
        tags: "tokens",
      },
    ];
    const ranked = rankByRelevance(items, ["color", "tokens"], getFields);
    // Colors has title match for "color" — should rank first or second
    const colorsIndex = ranked.findIndex((r) => r.id === "colors");
    expect(colorsIndex).toBeLessThan(3);
  });

  it("is stable — equal-scoring items preserve original order", () => {
    const items: Item[] = [
      { id: "a", title: "alpha component", description: "", tags: "" },
      { id: "b", title: "beta component", description: "", tags: "" },
      { id: "c", title: "gamma component", description: "", tags: "" },
    ];
    // All three have identical scores for "component"
    const ranked = rankByRelevance(items, ["component"], getFields);
    expect(ranked.map((r) => r.id)).toEqual(["a", "b", "c"]);
  });

  it("does not mutate the input array", () => {
    const items: Item[] = [
      { id: "b", title: "beta", description: "color", tags: "" },
      { id: "a", title: "alpha color", description: "", tags: "" },
    ];
    const original = [...items];
    rankByRelevance(items, ["color"], getFields);
    expect(items).toEqual(original);
  });
});

// ---------------------------------------------------------------------------
// filterAndRankByRelevance
// ---------------------------------------------------------------------------

describe("filterAndRankByRelevance", () => {
  type Item = { id: string; title: string; description: string; tags: string };

  const getFields = (item: Item): RelevanceFields => ({
    title: item.title,
    description: item.description,
    tags: item.tags,
  });

  it("excludes items where not all tokens are present", () => {
    const items: Item[] = [
      { id: "a", title: "color palette", description: "", tags: "" },
      { id: "b", title: "spacing tokens", description: "", tags: "" },
      { id: "c", title: "color tokens", description: "", tags: "" },
    ];
    const results = filterAndRankByRelevance(
      items,
      ["color", "tokens"],
      getFields
    );
    expect(results.map((r) => r.id)).not.toContain("a"); // has "color" but not "tokens"
    expect(results.map((r) => r.id)).not.toContain("b"); // has "tokens" but not "color"
    expect(results.map((r) => r.id)).toContain("c");
  });

  it("matches tokens across different fields", () => {
    const items: Item[] = [
      // "color" in title, "tokens" in description — should still match
      { id: "a", title: "color", description: "design tokens", tags: "" },
      { id: "b", title: "unrelated", description: "", tags: "" },
    ];
    const results = filterAndRankByRelevance(
      items,
      ["color", "tokens"],
      getFields
    );
    expect(results.map((r) => r.id)).toContain("a");
    expect(results.map((r) => r.id)).not.toContain("b");
  });

  it("ranks filtered results by relevance — title match first", () => {
    const items: Item[] = [
      {
        id: "low",
        title: "design system",
        description: "color tokens reference",
        tags: "",
      },
      {
        id: "high",
        title: "color tokens",
        description: "color tokens reference",
        tags: "",
      },
    ];
    const results = filterAndRankByRelevance(
      items,
      ["color", "tokens"],
      getFields
    );
    expect(results[0].id).toBe("high");
  });

  it("returns empty array for empty input", () => {
    expect(filterAndRankByRelevance([], ["color"], getFields)).toEqual([]);
  });

  it("returns all items unchanged for empty tokens", () => {
    const items: Item[] = [
      { id: "a", title: "Button", description: "", tags: "" },
      { id: "b", title: "Select", description: "", tags: "" },
    ];
    expect(filterAndRankByRelevance(items, [], getFields)).toEqual(items);
  });

  it("is case-insensitive", () => {
    const items: Item[] = [
      { id: "a", title: "Color Tokens", description: "", tags: "" },
    ];
    const results = filterAndRankByRelevance(
      items,
      ["color", "tokens"],
      getFields
    );
    expect(results).toHaveLength(1);
  });

  it("does not mutate the input array", () => {
    const items: Item[] = [
      { id: "b", title: "beta color tokens", description: "", tags: "" },
      { id: "a", title: "alpha color tokens", description: "", tags: "" },
    ];
    const original = [...items];
    filterAndRankByRelevance(items, ["color", "tokens"], getFields);
    expect(items).toEqual(original);
  });

  it("produces the same ranking as filter + rankByRelevance", () => {
    const items: Item[] = [
      {
        id: "colors",
        title: "Colors",
        description: "available colors",
        tags: "tokens color",
      },
      {
        id: "design-tokens",
        title: "Design Tokens",
        description: "colors fonts spacing",
        tags: "tokens",
      },
      {
        id: "blurs",
        title: "Blurs",
        description: "blur tokens",
        tags: "tokens",
      },
      {
        id: "unrelated",
        title: "Unrelated",
        description: "nothing here",
        tags: "",
      },
    ];
    const tokens = ["color", "tokens"];

    const viaFilter = rankByRelevance(
      items.filter((item) => {
        const hay = [item.title, item.description, item.tags]
          .join(" ")
          .toLowerCase();
        return tokens.every((t) => hay.includes(t));
      }),
      tokens,
      getFields
    );
    const viaSingle = filterAndRankByRelevance(items, tokens, getFields);

    expect(viaSingle.map((r) => r.id)).toEqual(viaFilter.map((r) => r.id));
  });
});
