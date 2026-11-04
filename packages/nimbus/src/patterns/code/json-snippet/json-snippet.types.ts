import type { CodeSnippetProps } from "../code-snippet/code-snippet.types";

/**
 * Props for the JsonSnippet pattern: every `CodeSnippet` prop except `code`
 * and `language`, plus the value to format.
 */
export type JsonSnippetProps = Omit<CodeSnippetProps, "code" | "language"> & {
  /**
   * Any value. It is formatted with `JSON.stringify`; circular references
   * become `"[Circular]"` and `BigInt` values become decimal strings.
   */
  value: unknown;
  /**
   * The number of spaces per indentation level.
   * @default 2
   */
  indent?: number;
};
