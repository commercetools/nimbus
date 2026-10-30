import { useMemo } from "react";
import { CodeSnippet } from "../code-snippet/code-snippet";
import type { JsonSnippetProps } from "./json-snippet.types";
import { stringifyJson } from "./utils/stringify-json";

/**
 * # JsonSnippet
 *
 * Shows any value as formatted, highlighted JSON, with the options of
 * `CodeSnippet`. Formatting never throws: circular references become
 * `"[Circular]"` and `BigInt` values become decimal strings. Copy and
 * download use the formatted text.
 *
 * @example
 * ```tsx
 * <JsonSnippet title="Response" value={response} maxLines={20} />
 * ```
 * @supportsStyleProps
 */
export const JsonSnippet = ({
  value,
  indent = 2,
  ...rest
}: JsonSnippetProps) => {
  const code = useMemo(() => stringifyJson(value, indent), [value, indent]);
  return <CodeSnippet code={code} language="json" {...rest} />;
};

JsonSnippet.displayName = "JsonSnippet";
