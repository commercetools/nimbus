import React from "react";
import ReactMarkdown from "react-markdown";
import remend from "remend";
import { splitMarkdownIntoBlocks } from "../utils";
import type { ReactMarkdownRenderOptions } from "../markdown.types";

/**
 * Streaming-only rendering code (remend completion, block splitting +
 * memoization). Isolated in its own module so the non-streaming render path
 * never references it — consumers who never set `isStreaming` do not execute
 * remend or the block memoization machinery. (The aria-busy state and the
 * completion announcement are owned by the always-mounted root in
 * `markdown.tsx`, so they survive the moment `isStreaming` flips to false.)
 */

type MemoBlockProps = ReactMarkdownRenderOptions & { content: string };

/**
 * A single memoized top-level block. Because the render options are stable
 * references (memoized by the parent), settled blocks compare equal and skip
 * re-rendering; only the final, still-growing block re-parses as tokens arrive.
 */
const MemoBlock = React.memo(
  function MemoBlock({ content, ...options }: MemoBlockProps) {
    return <ReactMarkdown {...options}>{content}</ReactMarkdown>;
  },
  (prev, next) =>
    prev.content === next.content &&
    prev.components === next.components &&
    prev.skipHtml === next.skipHtml &&
    prev.allowedElements === next.allowedElements &&
    prev.disallowedElements === next.disallowedElements &&
    prev.remarkPlugins === next.remarkPlugins &&
    prev.rehypePlugins === next.rehypePlugins
);

export type StreamingContentProps = ReactMarkdownRenderOptions & {
  /** Raw (still-streaming) markdown source. */
  source: string;
};

export function StreamingContent({
  source,
  customTagNames,
  ...options
}: StreamingContentProps) {
  // Complete unterminated inline constructs so partial tokens render as
  // formatted content. remend is a no-op on already-complete input. In-progress
  // links render as plain text until their URL closes.
  const completed = React.useMemo(
    () => remend(source, { linkMode: "text-only" }),
    [source]
  );

  // `customTagNames` keeps a paired `<Name>…</Name>` region in one block so the
  // custom-tag remark plugin can pair it; it is deliberately NOT spread onto
  // MemoBlock/react-markdown.
  const blocks = React.useMemo(
    () => splitMarkdownIntoBlocks(completed, customTagNames),
    [completed, customTagNames]
  );

  return (
    <>
      {blocks.map((content, index) => (
        <MemoBlock key={index} content={content} {...options} />
      ))}
    </>
  );
}
