import { describe, it, expect } from "vitest";
import { evaluateExpectations, getPath } from "./matchers.js";
import type { EvalExpectation, EvalToolResponse } from "../src/types.js";

const json = (value: unknown, isError?: boolean): EvalToolResponse => ({
  text: JSON.stringify(value),
  isError,
});

const results = [
  { path: "components/buttons/button", matchedView: "dev", snippet: "a" },
  { path: "components/feedback/tooltip", matchedView: "dev" },
  { path: "components/layout/box" },
];

function run(expectation: EvalExpectation, response: EvalToolResponse) {
  return evaluateExpectations(expectation, response);
}

function failures(expectation: EvalExpectation, response: EvalToolResponse) {
  return run(expectation, response).filter((r) => !r.ok);
}

describe("getPath", () => {
  it("resolves root index, dotted and bracket segments", () => {
    const obj = { results: [{ name: "A" }, { name: "B" }], meta: { k: 1 } };
    expect(getPath(obj, "results[1].name")).toBe("B");
    expect(getPath(obj, "meta.k")).toBe(1);
    expect(getPath([{ matchedView: "dev" }], "[0].matchedView")).toBe("dev");
    expect(getPath(obj, "")).toBe(obj);
  });

  it("returns undefined for a missing segment", () => {
    expect(getPath({ a: 1 }, "b.c")).toBeUndefined();
    expect(getPath([], "[3].x")).toBeUndefined();
  });
});

describe("evaluateExpectations — text matchers", () => {
  it("contains passes and fails on the raw text", () => {
    const response = { text: "No matching documentation found." };
    expect(failures({ contains: "No matching" }, response)).toEqual([]);
    const [f] = failures({ contains: ["No matching", "zzz"] }, response);
    expect(f.key).toBe("contains");
    expect(f.expected).toBe("zzz");
    expect(String(f.actual)).toContain("No matching");
  });

  it("notContains fails when the text has the needle", () => {
    const response = { text: "``jsx leaked" };
    expect(failures({ notContains: "``" }, response)).toHaveLength(1);
    expect(failures({ notContains: ["```", "xyz"] }, response)).toEqual([]);
  });

  it("maxChars compares the text length", () => {
    expect(failures({ maxChars: 5 }, { text: "123456" })).toHaveLength(1);
    expect(failures({ maxChars: 6 }, { text: "123456" })).toEqual([]);
  });

  it("isError compares against the response flag, treating undefined as false", () => {
    expect(failures({ isError: true }, { text: "x", isError: true })).toEqual(
      []
    );
    expect(failures({ isError: false }, { text: "x" })).toEqual([]);
    expect(failures({ isError: true }, { text: "x" })).toHaveLength(1);
  });
});

describe("evaluateExpectations — JSON matchers", () => {
  it("field deep-equals values at a path", () => {
    const response = json(results);
    expect(
      failures(
        { field: { "[0].matchedView": "dev", "[2].snippet": undefined } },
        response
      )
    ).toEqual([]);
    const [f] = failures({ field: { "[1].path": "nope" } }, response);
    expect(f.expected).toBe("nope");
    expect(f.actual).toBe("components/feedback/tooltip");
  });

  it("rankWithin finds the element within k and checks also-clauses", () => {
    const response = json(results);
    expect(
      failures(
        {
          rankWithin: {
            field: "path",
            value: "components/feedback/tooltip",
            k: 2,
            also: { matchedView: "dev" },
          },
        },
        response
      )
    ).toEqual([]);
    expect(
      failures(
        {
          rankWithin: {
            field: "path",
            value: "components/feedback/tooltip",
            k: 1,
          },
        },
        response
      )
    ).toHaveLength(1);
    const [also] = failures(
      {
        rankWithin: {
          field: "path",
          value: "components/layout/box",
          k: 3,
          also: { matchedView: "dev" },
        },
      },
      response
    );
    expect(also.key).toBe("rankWithin");
    expect(String(also.actual)).toContain("matchedView");
  });

  it("rankWithin resolves an array under path", () => {
    const response = json({ results: [{ name: "ArrowBack" }] });
    expect(
      failures(
        {
          rankWithin: {
            path: "results",
            field: "name",
            value: "ArrowBack",
            k: 1,
          },
        },
        response
      )
    ).toEqual([]);
  });

  it("absent fails when any element matches", () => {
    const response = json(results);
    expect(
      failures({ absent: { field: "path", value: "components/x" } }, response)
    ).toEqual([]);
    expect(
      failures(
        { absent: { field: "path", value: "components/layout/box" } },
        response
      )
    ).toHaveLength(1);
  });

  it("length bounds an array at root or under path", () => {
    expect(failures({ length: { min: 3, max: 3 } }, json(results))).toEqual([]);
    expect(failures({ length: { min: 4 } }, json(results))).toHaveLength(1);
    expect(
      failures({ length: { path: "results", max: 10 } }, json({ results: [] }))
    ).toEqual([]);
  });

  it("JSON matchers fail with a not-JSON message on plain-text responses", () => {
    const response = { text: "No components found." };
    for (const expectation of [
      { field: { "[0].x": 1 } },
      { rankWithin: { field: "x", value: 1, k: 1 } },
      { absent: { field: "x", value: 1 } },
      { length: { min: 1 } },
    ] as EvalExpectation[]) {
      const [f] = failures(expectation, response);
      expect(String(f.actual)).toMatch(/not JSON/);
      expect(String(f.actual)).toContain("No components found.");
    }
  });

  it("returns one result per expectation key plus one per contains needle", () => {
    const all = run(
      { contains: ["a", "b"], maxChars: 100, isError: false },
      { text: "ab" }
    );
    expect(all.map((r) => r.key)).toEqual([
      "contains",
      "contains",
      "maxChars",
      "isError",
    ]);
    expect(all.every((r) => r.ok)).toBe(true);
  });
});
