import { Fragment, type ReactNode } from "react";
import { VisuallyHidden } from "@/components/visually-hidden/visually-hidden";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import {
  CodeBlockContentSlot,
  CodeBlockPreSlot,
  CodeBlockCodeSlot,
  CodeBlockLineSlot,
  CodeBlockLineNumberSlot,
  CodeBlockMarkerSlot,
  CodeBlockPromptSlot,
  CodeBlockLineContentSlot,
} from "../code-block.slots";
import { CodeBlockActionsPlacementContext } from "../code-block.context";
import type { CodeBlockContentProps } from "../code-block.types";
import type { CodeToken } from "../highlighter/code-highlighter.types";
import { codeBlockMessagesStrings } from "../code-block.messages";
import { useCodeBlockContext } from "../hooks/use-code-block-context";
import {
  getLineMarks,
  groupLineMarks,
  toLineNumberSet,
  type CodeLineMark,
} from "../utils/line-selection";
import { splitLineAtWords } from "../utils/highlight-words";

const markerText: Record<CodeLineMark, string> = {
  highlighted: " ",
  added: "+",
  removed: "−",
};

/**
 * Renders tokens as text; typed tokens get a `span` with the classes
 * `token <type>…`, which the recipe maps to colors.
 */
const renderTokens = (tokens: readonly CodeToken[]): ReactNode[] =>
  tokens.map((token, index) =>
    token.types.length === 0 ? (
      <Fragment key={index}>{token.content}</Fragment>
    ) : (
      <span key={index} className={`token ${token.types.join(" ")}`}>
        {token.content}
      </span>
    )
  );

/**
 * CodeBlock.Content - The focusable, scrollable code area. Renders the
 * highlighted lines with optional line numbers, marked lines, word highlights
 * and prompts. While the block is collapsed, only the first `maxLines` lines
 * are rendered. `CodeBlock.Actions` placed inside floats in the top-end
 * corner.
 *
 * @supportsStyleProps
 */
export const CodeBlockContent = (props: CodeBlockContentProps) => {
  const { lines, maxLines, isCollapsible, isExpanded, contentId } =
    useCodeBlockContext("Content");
  const msg = useLocalizedStringFormatter(codeBlockMessagesStrings);
  const {
    showLineNumbers = false,
    startLineNumber = 1,
    highlightedLines,
    addedLines,
    removedLines,
    highlightedWords,
    prompt,
    outputLines,
    wrapLongLines = false,
    children,
    ref,
    ...restProps
  } = props;
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  const lastLineNumber = startLineNumber + lines.length - 1;
  const marks = getLineMarks({
    lineCount: lines.length,
    startLineNumber,
    highlightedLines,
    addedLines,
    removedLines,
  });
  const hasDiffLines = marks.some(
    (mark) => mark === "added" || mark === "removed"
  );
  const outputLineNumbers = toLineNumberSet(
    outputLines,
    startLineNumber,
    lastLineNumber
  );
  const visibleLines =
    isCollapsible && !isExpanded ? lines.slice(0, maxLines) : lines;
  const runs = groupLineMarks(marks.slice(0, visibleLines.length));
  const runStarts = new Map(runs.map((run) => [run.startIndex, run.mark]));
  const runEnds = new Map(runs.map((run) => [run.endIndex, run.mark]));
  const runTexts: Record<CodeLineMark, { start: string; end: string }> = {
    highlighted: {
      start: msg.format("highlightedLinesStart"),
      end: msg.format("highlightedLinesEnd"),
    },
    added: {
      start: msg.format("addedLinesStart"),
      end: msg.format("addedLinesEnd"),
    },
    removed: {
      start: msg.format("removedLinesStart"),
      end: msg.format("removedLinesEnd"),
    },
  };
  // Wide enough for the widest displayed number, so code on every line
  // starts at the same position.
  const gutterWidth = `${Math.max(
    String(startLineNumber).length,
    String(lastLineNumber).length
  )}ch`;
  const words =
    highlightedWords !== undefined && highlightedWords.length > 0
      ? highlightedWords
      : undefined;
  const wrap = wrapLongLines || undefined;
  const hasPrompt = prompt !== undefined && prompt !== "";

  return (
    <CodeBlockActionsPlacementContext.Provider value="content">
      <CodeBlockContentSlot ref={ref} {...styleProps} {...functionalProps}>
        {/* tabIndex={0} keeps overflowing code keyboard-scrollable (WCAG 2.1.1) */}
        <CodeBlockPreSlot id={contentId} tabIndex={0}>
          <CodeBlockCodeSlot>
            {visibleLines.map((line, index) => {
              const lineNumber = index + startLineNumber;
              const mark = marks[index];
              const runStart = runStarts.get(index);
              const runEnd = runEnds.get(index);
              return (
                // Keyed by index so streamed updates reuse the line elements.
                <Fragment key={index}>
                  {/* Keeps the code element's text equal to the code. */}
                  {index > 0 && "\n"}
                  <CodeBlockLineSlot data-mark={mark} data-wrap={wrap}>
                    {showLineNumbers && (
                      <CodeBlockLineNumberSlot minWidth={gutterWidth}>
                        {lineNumber}
                      </CodeBlockLineNumberSlot>
                    )}
                    {hasDiffLines && (
                      <CodeBlockMarkerSlot aria-hidden="true" data-mark={mark}>
                        {mark === undefined ? " " : markerText[mark]}
                      </CodeBlockMarkerSlot>
                    )}
                    {hasPrompt && !outputLineNumbers.has(lineNumber) && (
                      <CodeBlockPromptSlot aria-hidden="true">
                        {prompt}
                      </CodeBlockPromptSlot>
                    )}
                    <CodeBlockLineContentSlot data-wrap={wrap}>
                      {runStart !== undefined && (
                        <VisuallyHidden as="span" data-line-announcement="">
                          {runTexts[runStart].start}
                        </VisuallyHidden>
                      )}
                      {words === undefined
                        ? renderTokens(line)
                        : splitLineAtWords(line, words).map((segment, i) =>
                            segment.isMatch ? (
                              <mark key={i}>
                                {renderTokens(segment.tokens)}
                              </mark>
                            ) : (
                              <Fragment key={i}>
                                {renderTokens(segment.tokens)}
                              </Fragment>
                            )
                          )}
                      {runEnd !== undefined && (
                        <VisuallyHidden as="span" data-line-announcement="">
                          {runTexts[runEnd].end}
                        </VisuallyHidden>
                      )}
                    </CodeBlockLineContentSlot>
                  </CodeBlockLineSlot>
                </Fragment>
              );
            })}
          </CodeBlockCodeSlot>
        </CodeBlockPreSlot>
        {children}
      </CodeBlockContentSlot>
    </CodeBlockActionsPlacementContext.Provider>
  );
};

CodeBlockContent.displayName = "CodeBlock.Content";
