import { describe, it, expect, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useHighlightedLines } from "./use-highlighted-lines";
import { createPrismHighlighter } from "../highlighter/create-prism-highlighter";
import type {
  CodeHighlighter,
  CodeLine,
} from "../highlighter/code-highlighter.types";

const plain = (...lines: string[]): CodeLine[] =>
  lines.map((line) => (line === "" ? [] : [{ content: line, types: [] }]));

const marked = (...lines: string[]): CodeLine[] =>
  lines.map((line) => [{ content: line, types: ["marked"] }]);

/**
 * A highlighter whose results resolve only when the test calls `resolve`.
 */
const createAsyncHighlighter = () => {
  const pending = new Map<string, (lines: CodeLine[]) => void>();
  const highlighter: CodeHighlighter = {
    resolveLanguage: (language) => language,
    highlight: vi.fn(
      (code: string) =>
        new Promise<readonly CodeLine[]>((resolve) => {
          pending.set(code, resolve);
        })
    ),
  };
  const resolve = async (code: string) => {
    await act(async () => {
      pending.get(code)?.(marked(...code.split("\n")));
    });
  };
  return { highlighter, resolve };
};

type HookProps = {
  code: string;
  language?: string;
  highlighter: CodeHighlighter;
};

const renderLines = (initialProps: HookProps) =>
  renderHook(
    ({ code, language, highlighter }: HookProps) =>
      useHighlightedLines(code, language, highlighter),
    { initialProps }
  );

describe("useHighlightedLines", () => {
  const prism = createPrismHighlighter();

  it("returns highlighted lines from a synchronous highlighter", () => {
    const { result } = renderLines({
      code: "const a = 1;\n",
      language: "tsx",
      highlighter: prism,
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0][0]).toEqual({
      content: "const",
      types: ["keyword"],
    });
  });

  it("normalizes line breaks before highlighting", () => {
    const highlighter: CodeHighlighter = {
      resolveLanguage: (language) => language,
      highlight: vi.fn(() => [] as CodeLine[]),
    };
    renderLines({ code: "a\r\nb\rc\n", language: "x", highlighter });

    expect(highlighter.highlight).toHaveBeenCalledWith("a\nb\nc", "x");
  });

  it("highlights with the resolved language id", () => {
    const highlighter: CodeHighlighter = {
      resolveLanguage: () => "bash",
      highlight: vi.fn(() => [] as CodeLine[]),
    };
    renderLines({ code: "ls", language: "sh", highlighter });

    expect(highlighter.highlight).toHaveBeenCalledWith("ls", "bash");
  });

  it("returns plain lines without a language", () => {
    const { result } = renderLines({ code: "a\n\nb", highlighter: prism });

    expect(result.current).toEqual(plain("a", "", "b"));
  });

  it("returns plain lines for an unsupported language", () => {
    const { result } = renderLines({
      code: "const a",
      language: "brainfuck",
      highlighter: prism,
    });

    expect(result.current).toEqual(plain("const a"));
  });

  it("returns no lines for empty code", () => {
    const { result } = renderLines({
      code: "",
      language: "tsx",
      highlighter: prism,
    });

    expect(result.current).toEqual([]);
  });

  it("memoizes by code, language and highlighter", () => {
    const highlighter: CodeHighlighter = {
      resolveLanguage: (language) => language,
      highlight: vi.fn(() => plain("a")),
    };
    const { result, rerender } = renderLines({
      code: "a",
      language: "x",
      highlighter,
    });
    const first = result.current;

    rerender({ code: "a", language: "x", highlighter });

    expect(result.current).toBe(first);
    expect(highlighter.highlight).toHaveBeenCalledTimes(1);
  });

  it("shows plain lines until an async result arrives", async () => {
    const { highlighter, resolve } = createAsyncHighlighter();
    const { result } = renderLines({
      code: "a\nb",
      language: "x",
      highlighter,
    });

    expect(result.current).toEqual(plain("a", "b"));

    await resolve("a\nb");

    expect(result.current).toEqual(marked("a", "b"));
  });

  it("keeps the last async result while a new one is pending", async () => {
    const { highlighter, resolve } = createAsyncHighlighter();
    const { result, rerender } = renderLines({
      code: "a",
      language: "x",
      highlighter,
    });
    await resolve("a");

    rerender({ code: "b", language: "x", highlighter });

    expect(result.current).toEqual(marked("a"));

    await resolve("b");

    expect(result.current).toEqual(marked("b"));
  });

  it("discards outdated async results", async () => {
    const { highlighter, resolve } = createAsyncHighlighter();
    const { result, rerender } = renderLines({
      code: "a",
      language: "x",
      highlighter,
    });
    rerender({ code: "b", language: "x", highlighter });

    await resolve("b");
    await resolve("a");

    expect(result.current).toEqual(marked("b"));
  });

  it("falls back to plain lines when an async highlighter fails", async () => {
    const highlighter: CodeHighlighter = {
      resolveLanguage: (language) => language,
      highlight: () => Promise.reject(new Error("grammar failed to load")),
    };
    const { result } = renderLines({ code: "a", language: "x", highlighter });

    await waitFor(() => expect(result.current).toEqual(plain("a")));
  });

  it("returns sync results right away after an async highlighter", async () => {
    const { highlighter, resolve } = createAsyncHighlighter();
    const { result, rerender } = renderLines({
      code: "const a",
      language: "x",
      highlighter,
    });
    await resolve("const a");

    rerender({ code: "const a", language: "tsx", highlighter: prism });

    expect(result.current[0][0]).toEqual({
      content: "const",
      types: ["keyword"],
    });
  });
});
