import { useEffect, useMemo, useState } from "react";
import type {
  CodeHighlighter,
  CodeLine,
} from "../highlighter/code-highlighter.types";
import { normalizeLines } from "../utils/normalize-lines";

/**
 * Returns the highlighted lines of `code`, normalized with `normalizeLines`.
 *
 * - The result is memoized by `code`, `language` and `highlighter`.
 * - Without a language, or for a language the highlighter does not support,
 *   the lines are plain text.
 * - When the highlighter returns a Promise, the lines are plain text until the
 *   first result arrives. After that, the last highlighted result stays visible
 *   while a newer result is pending. Results for outdated input are discarded.
 */
export const useHighlightedLines = (
  code: string,
  language: string | undefined,
  highlighter: CodeHighlighter
): readonly CodeLine[] => {
  const lines = useMemo(() => normalizeLines(code), [code]);
  const plainLines = useMemo<readonly CodeLine[]>(
    () =>
      lines.map((line) => (line === "" ? [] : [{ content: line, types: [] }])),
    [lines]
  );

  const result = useMemo(() => {
    const languageId =
      language === undefined
        ? undefined
        : highlighter.resolveLanguage(language);
    if (languageId === undefined || lines.length === 0) return plainLines;
    return highlighter.highlight(lines.join("\n"), languageId);
  }, [lines, plainLines, language, highlighter]);

  const [asyncLines, setAsyncLines] = useState<readonly CodeLine[]>();

  useEffect(() => {
    if (!(result instanceof Promise)) return;
    let isCurrent = true;
    result.then(
      (lines) => {
        if (isCurrent) setAsyncLines(lines);
      },
      () => {
        if (isCurrent) setAsyncLines(plainLines);
      }
    );
    return () => {
      isCurrent = false;
    };
  }, [result, plainLines]);

  if (!(result instanceof Promise)) return result;
  return asyncLines ?? plainLines;
};
