import { describe, it, expect } from "vitest";
import java from "refractor/java";
import {
  createPrismHighlighter,
  defaultCodeLanguages,
} from "./create-prism-highlighter";
import type { CodeLine } from "./code-highlighter.types";

/**
 * The prism highlighter is synchronous; this narrows the return type.
 */
const highlightSync = (
  code: string,
  language: string,
  highlighter = createPrismHighlighter()
): readonly CodeLine[] => {
  const result = highlighter.highlight(code, language);
  if (result instanceof Promise) throw new Error("Expected a sync result");
  return result;
};

const joinLines = (lines: readonly CodeLine[]): string =>
  lines.map((line) => line.map((token) => token.content).join("")).join("\n");

const hasTypedToken = (lines: readonly CodeLine[]): boolean =>
  lines.some((line) => line.some((token) => token.types.length > 0));

describe("createPrismHighlighter", () => {
  it("lists the default languages", () => {
    expect(defaultCodeLanguages).toEqual([
      "tsx",
      "typescript",
      "javascript",
      "jsx",
      "json",
      "css",
      "markup",
      "bash",
      "yaml",
      "graphql",
      "diff",
      "sql",
      "markdown",
      "http",
    ]);
  });

  it.each([
    ["tsx", 'const a = <Button variant="primary">Hi</Button>;\n\nexport {};'],
    ["json", '{\n  "a": [1, true, null],\n  "b": "x"\n}'],
    ["bash", "npm install \\\n  --save foo # note\necho $HOME"],
    ["markdown", "# Title\n\n```js\nconst a = 1;\n```\n"],
    ["diff", "- old\n+ new\n  same"],
    ["brainfuck", "++[>+<-]\n"],
  ])("reproduces the input lines for %s", (language, code) => {
    expect(joinLines(highlightSync(code, language))).toBe(code);
  });

  it("splits a multi-line block comment into one token per line", () => {
    const lines = highlightSync("/* one\n two\n three */", "javascript");

    expect(lines).toHaveLength(3);
    for (const line of lines) {
      expect(line).toHaveLength(1);
      expect(line[0].types).toContain("comment");
      expect(line[0].content).not.toMatch(/[\r\n]/);
    }
  });

  it("keeps the token types of all ancestor elements", () => {
    const [line] = highlightSync("<div />", "tsx");
    const bracket = line.find((token) => token.content === "<");

    expect(bracket?.types).toEqual(["tag", "tag", "punctuation"]);
  });

  it("splits CRLF and CR line breaks", () => {
    expect(highlightSync("a\r\nb\rc", "javascript")).toHaveLength(3);
    expect(highlightSync("a\r\nb\rc", "plaintext")).toHaveLength(3);
  });

  it("highlights shell code", () => {
    const lines = highlightSync("npm install --save foo # note", "bash");

    expect(hasTypedToken(lines)).toBe(true);
  });

  it.each([
    ["ts", "typescript"],
    ["js", "javascript"],
    ["html", "markup"],
    ["xml", "markup"],
    ["svg", "markup"],
    ["sh", "bash"],
    ["shell", "bash"],
    ["zsh", "bash"],
    ["console", "bash"],
    ["terminal", "bash"],
    ["curl", "bash"],
    ["yml", "yaml"],
    ["md", "markdown"],
    ["gql", "graphql"],
  ])("resolves the alias %s to %s", (alias, language) => {
    expect(createPrismHighlighter().resolveLanguage(alias)).toBe(language);
  });

  it("highlights an alias with the grammar of its language", () => {
    const code = "npm install --save foo # note";

    expect(highlightSync(code, "sh")).toEqual(highlightSync(code, "bash"));
  });

  it.each(["plaintext", "text", "txt", "brainfuck", ""])(
    "returns plain tokens for the language %j",
    (language) => {
      const highlighter = createPrismHighlighter();
      const lines = highlightSync("const a = 1;", language, highlighter);

      expect(highlighter.resolveLanguage(language)).toBeUndefined();
      expect(lines).toEqual([[{ content: "const a = 1;", types: [] }]]);
    }
  );

  it("returns one empty line for empty code", () => {
    expect(highlightSync("", "tsx")).toEqual([[]]);
    expect(highlightSync("", "plaintext")).toEqual([[]]);
  });

  it("adds languages with additionalLanguages", () => {
    const highlighter = createPrismHighlighter({ additionalLanguages: [java] });
    const lines = highlightSync("public class A {}", "java", highlighter);

    expect(highlighter.resolveLanguage("java")).toBe("java");
    expect(hasTypedToken(lines)).toBe(true);
  });

  it("adds aliases, which win over the default aliases", () => {
    const highlighter = createPrismHighlighter({
      aliases: { jsonc: "json", js: "typescript", foo: "unknown" },
    });

    expect(highlighter.resolveLanguage("jsonc")).toBe("json");
    expect(highlighter.resolveLanguage("js")).toBe("typescript");
    expect(highlighter.resolveLanguage("foo")).toBeUndefined();
  });

  it("keeps highlighters isolated from each other", () => {
    createPrismHighlighter({
      additionalLanguages: [java],
      aliases: { jav: "java" },
    });
    const other = createPrismHighlighter();

    expect(other.resolveLanguage("java")).toBeUndefined();
    expect(other.resolveLanguage("jav")).toBeUndefined();
    expect(
      hasTypedToken(highlightSync("public class A {}", "java", other))
    ).toBe(false);
  });

  it("does not change global objects", () => {
    const globalKeys = Object.keys(globalThis);
    const highlighter = createPrismHighlighter({ additionalLanguages: [java] });
    highlightSync("public class A {}", "java", highlighter);

    expect(Object.keys(globalThis)).toEqual(globalKeys);
    expect("Prism" in globalThis).toBe(false);
  });

  it("does not throw for an unterminated string", () => {
    const code = 'const a = "open\nconst b = 1;';

    expect(joinLines(highlightSync(code, "tsx"))).toBe(code);
  });
});
