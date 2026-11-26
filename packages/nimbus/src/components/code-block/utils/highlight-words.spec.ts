import { describe, it, expect } from "vitest";
import { splitLineAtWords } from "./highlight-words";
import type { CodeLine } from "../highlighter/code-highlighter.types";

const token = (content: string, ...types: string[]) => ({ content, types });

describe("splitLineAtWords", () => {
  it("returns the whole line as one segment without matches", () => {
    const line: CodeLine = [token("a", "x"), token(" b")];

    expect(splitLineAtWords(line, ["zzz"])).toEqual([
      { isMatch: false, tokens: [token("a", "x"), token(" b")] },
    ]);
    expect(splitLineAtWords(line, [])).toEqual([
      { isMatch: false, tokens: [token("a", "x"), token(" b")] },
    ]);
  });

  it("returns no segments for an empty line", () => {
    expect(splitLineAtWords([], ["a"])).toEqual([]);
  });

  it("cuts a token at the borders of a match and keeps its types", () => {
    const line: CodeLine = [token('variant="primary"', "attr")];

    expect(splitLineAtWords(line, ["variant"])).toEqual([
      { isMatch: true, tokens: [token("variant", "attr")] },
      { isMatch: false, tokens: [token('="primary"', "attr")] },
    ]);
  });

  it("covers a match across several tokens with one segment", () => {
    const line: CodeLine = [
      token("x "),
      token("a", "variable"),
      token(".", "punctuation"),
      token("b", "property"),
      token(";"),
    ];

    expect(splitLineAtWords(line, ["a.b"])).toEqual([
      { isMatch: false, tokens: [token("x ")] },
      {
        isMatch: true,
        tokens: [
          token("a", "variable"),
          token(".", "punctuation"),
          token("b", "property"),
        ],
      },
      { isMatch: false, tokens: [token(";")] },
    ]);
  });

  it("matches every occurrence, case-sensitive", () => {
    const line: CodeLine = [token("foo Foo foo")];

    expect(splitLineAtWords(line, ["foo"])).toEqual([
      { isMatch: true, tokens: [token("foo")] },
      { isMatch: false, tokens: [token(" Foo ")] },
      { isMatch: true, tokens: [token("foo")] },
    ]);
  });

  it("keeps neighboring matches as separate segments", () => {
    expect(splitLineAtWords([token("abcd")], ["ab", "cd"])).toEqual([
      { isMatch: true, tokens: [token("ab")] },
      { isMatch: true, tokens: [token("cd")] },
    ]);
  });

  it("merges overlapping matches", () => {
    expect(splitLineAtWords([token("abc")], ["ab", "bc"])).toEqual([
      { isMatch: true, tokens: [token("abc")] },
    ]);
  });

  it("ignores empty words", () => {
    expect(splitLineAtWords([token("abc")], [""])).toEqual([
      { isMatch: false, tokens: [token("abc")] },
    ]);
  });

  it("keeps the line text unchanged", () => {
    const line: CodeLine = [
      token("const ", "keyword"),
      token("value", "variable"),
      token(" = "),
      token("value", "variable"),
    ];
    const text = splitLineAtWords(line, ["value", "e = v"])
      .flatMap((segment) => segment.tokens)
      .map((piece) => piece.content)
      .join("");

    expect(text).toBe("const value = value");
  });
});
