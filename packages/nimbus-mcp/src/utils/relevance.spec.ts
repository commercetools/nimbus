import { describe, it, expect } from "vitest";
import {
  scoreRelevance,
  rankByRelevance,
  filterAndRankByRelevance,
  filterAndRankPreLowered,
  boundedLevenshtein,
  fuzzyScorePreLowered,
  fuzzyResolveName,
} from "./relevance.js";
import type { RelevanceFields, LoweredRelevanceFields } from "../types.js";

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

// ---------------------------------------------------------------------------
// boundedLevenshtein
// ---------------------------------------------------------------------------

describe("boundedLevenshtein", () => {
  it("returns 0 for identical strings", () => {
    expect(boundedLevenshtein("button", "button", 3)).toBe(0);
  });

  it("returns 1 for a single substitution", () => {
    expect(boundedLevenshtein("button", "buttan", 1)).toBe(1);
  });

  it("returns 1 for a single insertion", () => {
    expect(boundedLevenshtein("buton", "button", 1)).toBe(1);
  });

  it("returns 1 for a single deletion", () => {
    expect(boundedLevenshtein("button", "buton", 1)).toBe(1);
  });

  it("returns -1 when distance exceeds maxDist", () => {
    expect(boundedLevenshtein("button", "xxxxxx", 2)).toBe(-1);
  });

  it("returns -1 early when length difference alone exceeds maxDist", () => {
    expect(boundedLevenshtein("a", "abcdef", 2)).toBe(-1);
  });

  it("returns 0 for two empty strings", () => {
    expect(boundedLevenshtein("", "", 0)).toBe(0);
  });

  it("handles empty vs non-empty within maxDist", () => {
    expect(boundedLevenshtein("", "ab", 3)).toBe(2);
  });

  it("handles empty vs non-empty exceeding maxDist", () => {
    expect(boundedLevenshtein("", "abc", 2)).toBe(-1);
  });

  it("is symmetric — order of arguments does not matter", () => {
    expect(boundedLevenshtein("kitten", "sitting", 3)).toBe(
      boundedLevenshtein("sitting", "kitten", 3)
    );
  });

  it("computes correct distance for multi-edit words", () => {
    // kitten → sitting: 3 edits (s/k, e→i, +g)
    expect(boundedLevenshtein("kitten", "sitting", 3)).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// filterAndRankPreLowered
// ---------------------------------------------------------------------------

describe("filterAndRankPreLowered", () => {
  type Item = { id: string; lower: LoweredRelevanceFields };

  const makeLower = (
    title: string,
    description = "",
    tags = "",
    content = ""
  ): LoweredRelevanceFields => ({
    title,
    description,
    tags,
    content,
    combined: title + " " + description + " " + tags + " " + content,
  });

  const getLowered = (item: Item) => item.lower;

  it("returns empty array for empty input", () => {
    expect(filterAndRankPreLowered([], ["color"], getLowered)).toEqual([]);
  });

  it("returns all items unchanged for empty tokens", () => {
    const items: Item[] = [
      { id: "a", lower: makeLower("button") },
      { id: "b", lower: makeLower("select") },
    ];
    expect(filterAndRankPreLowered(items, [], getLowered)).toEqual(items);
  });

  it("filters out items missing any token", () => {
    const items: Item[] = [
      { id: "a", lower: makeLower("color tokens") },
      { id: "b", lower: makeLower("color only") },
      { id: "c", lower: makeLower("tokens only") },
    ];
    const result = filterAndRankPreLowered(
      items,
      ["color", "tokens"],
      getLowered
    );
    expect(result.map((r) => r.id)).toEqual(["a"]);
  });

  it("uses combined field for fast token-presence check", () => {
    // Token in description only — combined field should still catch it
    const items: Item[] = [
      { id: "a", lower: makeLower("button", "color variant") },
    ];
    const result = filterAndRankPreLowered(items, ["color"], getLowered);
    expect(result).toHaveLength(1);
  });

  it("ranks title matches above description-only matches", () => {
    const items: Item[] = [
      { id: "desc", lower: makeLower("widget", "color info") },
      { id: "title", lower: makeLower("color", "some info") },
    ];
    const result = filterAndRankPreLowered(items, ["color"], getLowered);
    expect(result[0].id).toBe("title");
  });

  it("uses single-token fast path correctly", () => {
    const items: Item[] = [
      { id: "a", lower: makeLower("alpha") },
      { id: "b", lower: makeLower("beta", "alpha component") },
    ];
    // Single token triggers the fast path
    const result = filterAndRankPreLowered(items, ["alpha"], getLowered);
    expect(result).toHaveLength(2);
    // Title match should rank first
    expect(result[0].id).toBe("a");
  });

  it("matches filterAndRankByRelevance for equivalent input", () => {
    type HighItem = {
      id: string;
      title: string;
      description: string;
      tags: string;
    };
    const highItems: HighItem[] = [
      { id: "a", title: "Color Tokens", description: "all colors", tags: "" },
      {
        id: "b",
        title: "Spacing",
        description: "spacing tokens",
        tags: "tokens",
      },
      {
        id: "c",
        title: "Design Tokens",
        description: "color fonts",
        tags: "tokens",
      },
    ];
    const tokens = ["color", "tokens"];

    const highLevel = filterAndRankByRelevance(highItems, tokens, (i) => ({
      title: i.title,
      description: i.description,
      tags: i.tags,
    }));

    const lowItems: Item[] = highItems.map((i) => ({
      id: i.id,
      lower: makeLower(
        i.title.toLowerCase(),
        i.description.toLowerCase(),
        i.tags.toLowerCase()
      ),
    }));
    const preLowered = filterAndRankPreLowered(lowItems, tokens, getLowered);

    expect(preLowered.map((r) => r.id)).toEqual(highLevel.map((r) => r.id));
  });
});

// ---------------------------------------------------------------------------
// fuzzyScorePreLowered
// ---------------------------------------------------------------------------

describe("fuzzyScorePreLowered", () => {
  const base: LoweredRelevanceFields = {
    title: "",
    description: "",
    tags: "",
    content: "",
    combined: "",
  };

  it("returns 0 for tokens shorter than 3 characters", () => {
    expect(fuzzyScorePreLowered({ ...base, title: "button" }, ["bu"])).toBe(0);
  });

  it("returns 0 when nothing matches", () => {
    expect(
      fuzzyScorePreLowered({ ...base, title: "button" }, ["xyzzyabc"])
    ).toBe(0);
  });

  it("matches exact substring in title", () => {
    const score = fuzzyScorePreLowered({ ...base, title: "button" }, [
      "button",
    ]);
    expect(score).toBeGreaterThan(0);
  });

  it("matches compound words across spaces (datepicker in 'date picker')", () => {
    const score = fuzzyScorePreLowered({ ...base, title: "date picker" }, [
      "datepicker",
    ]);
    expect(score).toBeGreaterThan(0);
  });

  it("matches via Levenshtein distance (typo tolerance)", () => {
    // "buttn" is 1 edit from "button"
    const score = fuzzyScorePreLowered({ ...base, title: "button" }, ["buttn"]);
    expect(score).toBeGreaterThan(0);
  });

  it("matches via prefix — token is prefix of word", () => {
    // "check" is a prefix of "checkbox"
    const score = fuzzyScorePreLowered({ ...base, title: "checkbox" }, [
      "check",
    ]);
    expect(score).toBeGreaterThan(0);
  });

  it("matches via prefix — word is prefix of token", () => {
    // "checkmark" starts with "check" (a word in the field)
    const score = fuzzyScorePreLowered({ ...base, tags: "check icon" }, [
      "checkmark",
    ]);
    expect(score).toBeGreaterThan(0);
  });

  it("scores at half the exact-match weight", () => {
    // Exact substring: title weight = 8, fuzzy weight = 4
    const fuzzyScore = fuzzyScorePreLowered({ ...base, title: "button" }, [
      "button",
    ]);
    expect(fuzzyScore).toBe(4); // WEIGHTS.title / 2
  });

  it("accumulates across multiple fields", () => {
    const oneField = fuzzyScorePreLowered({ ...base, title: "button" }, [
      "button",
    ]);
    const twoFields = fuzzyScorePreLowered(
      { ...base, title: "button", description: "button component" },
      ["button"]
    );
    expect(twoFields).toBeGreaterThan(oneField);
  });

  it("accumulates across multiple tokens", () => {
    const oneToken = fuzzyScorePreLowered({ ...base, title: "color button" }, [
      "color",
    ]);
    const twoTokens = fuzzyScorePreLowered({ ...base, title: "color button" }, [
      "color",
      "button",
    ]);
    expect(twoTokens).toBeGreaterThan(oneToken);
  });

  it("does not match content field (skipped for performance)", () => {
    const score = fuzzyScorePreLowered(
      { ...base, content: "button component details" },
      ["button"]
    );
    expect(score).toBe(0);
  });

  it("scales maxDist with token length", () => {
    // 3-4 chars → maxDist 1: "btn" vs "btn" (0) OK, "btn" vs "btx" (1) OK
    expect(
      fuzzyScorePreLowered({ ...base, title: "btx" }, ["btn"])
    ).toBeGreaterThan(0);

    // 5-7 chars → maxDist 2: "buttn" (5 chars) vs "buttons" needs 2 edits
    expect(
      fuzzyScorePreLowered({ ...base, title: "buttons" }, ["buttn"])
    ).toBeGreaterThan(0);

    // 8+ chars → maxDist 3
    expect(
      fuzzyScorePreLowered({ ...base, title: "datepicker" }, ["datapickar"])
    ).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// fuzzyResolveName
// ---------------------------------------------------------------------------

describe("fuzzyResolveName", () => {
  type Entry = { id: string; names: string[] };
  const getNames = (e: Entry) => e.names;

  it("returns undefined for single-character needle", () => {
    const items: Entry[] = [{ id: "a", names: ["a"] }];
    expect(fuzzyResolveName("a", items, getNames)).toBeUndefined();
  });

  it("returns exact match", () => {
    const items: Entry[] = [
      { id: "button", names: ["Button"] },
      { id: "select", names: ["Select"] },
    ];
    expect(fuzzyResolveName("button", items, getNames)?.id).toBe("button");
  });

  it("returns closest Levenshtein match for typos", () => {
    const items: Entry[] = [
      { id: "button", names: ["button"] },
      { id: "toggle", names: ["toggle"] },
    ];
    // "buton" is 1 edit from "button"
    expect(fuzzyResolveName("buton", items, getNames)?.id).toBe("button");
  });

  it("is case-insensitive", () => {
    const items: Entry[] = [{ id: "button", names: ["Button"] }];
    expect(fuzzyResolveName("BUTTON", items, getNames)?.id).toBe("button");
  });

  it("returns undefined when no candidate is close enough", () => {
    const items: Entry[] = [{ id: "button", names: ["button"] }];
    expect(fuzzyResolveName("xyzzy", items, getNames)).toBeUndefined();
  });

  it("matches against any name in the candidate list", () => {
    const items: Entry[] = [
      { id: "datepicker", names: ["DatePicker", "date-picker", "calendar"] },
    ];
    expect(fuzzyResolveName("calendar", items, getNames)?.id).toBe(
      "datepicker"
    );
  });

  it("breaks ties by shortest candidate name (most specific)", () => {
    const items: Entry[] = [
      { id: "btn", names: ["btn"] },
      { id: "button", names: ["button"] },
    ];
    // "bton" is 1 edit from "btn" (3 chars) and 2 edits from "button" (6 chars)
    // but "btn" is shorter — should win on tie-breaking
    expect(fuzzyResolveName("btn", items, getNames)?.id).toBe("btn");
  });

  it("returns undefined for empty candidates", () => {
    expect(fuzzyResolveName("button", [], getNames)).toBeUndefined();
  });

  it("scales maxDist with needle length", () => {
    const items: Entry[] = [{ id: "a", names: ["abcdefghij"] }];
    // 10-char needle with 3 edits should match (maxDist = 3 for 8+ chars)
    expect(fuzzyResolveName("abcdefgxyz", items, getNames)?.id).toBe("a");
    // But 4 edits should not
    expect(fuzzyResolveName("abcdefwxyz", items, getNames)).toBeUndefined();
  });
});
