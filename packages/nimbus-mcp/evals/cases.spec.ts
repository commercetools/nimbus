import { describe, it, expect } from "vitest";
import { parseCaseFile } from "./case-schema.js";

const validFile = {
  tool: "search_docs",
  cases: [
    {
      id: "deep-term",
      input: { query: "allowFocusWhenDisabled" },
      expect: { contains: "allowFocusWhenDisabled", maxChars: 4000 },
    },
  ],
};

describe("parseCaseFile", () => {
  it("accepts a file that uses only the expectation vocabulary", () => {
    const parsed = parseCaseFile(validFile, "search_docs.json");
    expect(parsed.tool).toBe("search_docs");
    expect(parsed.cases).toHaveLength(1);
    expect(parsed.cases[0].expect.maxChars).toBe(4000);
  });

  it("rejects an unknown expectation key, naming file, case id and key", () => {
    const raw = {
      tool: "search_docs",
      cases: [
        {
          id: "typo-case",
          input: { query: "x" },
          expect: { contain: "x" },
        },
      ],
    };
    expect(() => parseCaseFile(raw, "search_docs.json")).toThrow(
      /search_docs\.json.*typo-case.*"contain"/s
    );
  });

  it("rejects a case with no id, naming the file and case index", () => {
    const raw = {
      tool: "search_docs",
      cases: [{ input: { query: "x" }, expect: { contains: "x" } }],
    };
    expect(() => parseCaseFile(raw, "search_docs.json")).toThrow(
      /search_docs\.json.*cases\[0\].*id/s
    );
  });

  it("rejects a case with an empty expect block", () => {
    const raw = {
      tool: "search_docs",
      cases: [{ id: "empty", input: {}, expect: {} }],
    };
    expect(() => parseCaseFile(raw, "search_docs.json")).toThrow(
      /search_docs\.json.*empty.*expect/s
    );
  });

  it("rejects a rankWithin block with an unknown sub-key", () => {
    const raw = {
      tool: "search_docs",
      cases: [
        {
          id: "bad-rank",
          input: {},
          expect: { rankWithin: { field: "path", value: "x", k: 1, top: 2 } },
        },
      ],
    };
    expect(() => parseCaseFile(raw, "search_docs.json")).toThrow(
      /bad-rank.*"top"/s
    );
  });
});
