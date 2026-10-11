import { CodeBlock } from "@/components/code-block/code-block";
import type { CodeSnippetProps } from "./code-snippet.types";

/**
 * # CodeSnippet
 *
 * A pre-composed code block with a flat-props API: a header with title,
 * language label and actions (copy, download), the highlighted code with all
 * line options, an optional expand button and a footer. When there is no
 * header, the actions sit next to the code.
 *
 * For layouts this pattern does not cover, compose `CodeBlock` parts
 * directly.
 *
 * @example
 * ```tsx
 * <CodeSnippet
 *   title="button.tsx"
 *   code={source}
 *   language="tsx"
 *   showLineNumbers
 *   highlightedLines={[3]}
 * />
 * ```
 * @supportsStyleProps
 */
export const CodeSnippet = ({
  code,
  language,
  title,
  showLanguage = true,
  showCopyButton = true,
  downloadFileName,
  onCopy,
  footer,
  showLineNumbers,
  startLineNumber,
  highlightedLines,
  addedLines,
  removedLines,
  highlightedWords,
  wrapLongLines,
  ...rootProps
}: CodeSnippetProps) => {
  const isLanguageShown = showLanguage && language !== undefined;
  const hasHeader = title !== undefined || isLanguageShown;
  const actions =
    showCopyButton || downloadFileName !== undefined ? (
      <CodeBlock.Actions>
        {downloadFileName !== undefined && (
          <CodeBlock.DownloadTrigger fileName={downloadFileName} />
        )}
        {showCopyButton && <CodeBlock.CopyTrigger onCopy={onCopy} />}
      </CodeBlock.Actions>
    ) : null;

  return (
    <CodeBlock.Root code={code} language={language} {...rootProps}>
      {hasHeader && (
        <CodeBlock.Header>
          {title !== undefined && <CodeBlock.Title>{title}</CodeBlock.Title>}
          {isLanguageShown && <CodeBlock.LanguageLabel />}
          {actions}
        </CodeBlock.Header>
      )}
      <CodeBlock.Content
        showLineNumbers={showLineNumbers}
        startLineNumber={startLineNumber}
        highlightedLines={highlightedLines}
        addedLines={addedLines}
        removedLines={removedLines}
        highlightedWords={highlightedWords}
        wrapLongLines={wrapLongLines}
      >
        {!hasHeader && actions}
      </CodeBlock.Content>
      <CodeBlock.ExpandTrigger />
      {footer !== undefined && <CodeBlock.Footer>{footer}</CodeBlock.Footer>}
    </CodeBlock.Root>
  );
};

CodeSnippet.displayName = "CodeSnippet";
