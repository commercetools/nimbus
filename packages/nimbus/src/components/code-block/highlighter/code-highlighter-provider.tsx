import { createContext, useContext, type ReactNode } from "react";
import type { CodeHighlighter } from "./code-highlighter.types";
import { createPrismHighlighter } from "./create-prism-highlighter";

/**
 * Props for `CodeHighlighterProvider`.
 */
export type CodeHighlighterProviderProps = {
  /**
   * The highlighter used by every `CodeBlock.Root` below this provider.
   */
  highlighter: CodeHighlighter;
  /**
   * Content that uses the highlighter.
   */
  children?: ReactNode;
};

/**
 * Internal context that carries the highlighter from `CodeHighlighterProvider`
 * to `CodeBlock.Root`.
 *
 * @internal
 */
const CodeHighlighterContext = createContext<CodeHighlighter | undefined>(
  undefined
);

let defaultHighlighter: CodeHighlighter | undefined;

/**
 * Returns the shared default Prism highlighter, created on first use.
 *
 * @internal
 */
export const getDefaultCodeHighlighter = (): CodeHighlighter => {
  defaultHighlighter ??= createPrismHighlighter();
  return defaultHighlighter;
};

/**
 * Returns the highlighter of the nearest `CodeHighlighterProvider`, or the
 * shared default Prism highlighter when there is none.
 *
 * @internal
 */
export const useCodeHighlighter = (): CodeHighlighter =>
  useContext(CodeHighlighterContext) ?? getDefaultCodeHighlighter();

/**
 * Supplies a highlighter to every `CodeBlock.Root` below it. Renders no DOM
 * element. Without a provider, code blocks use a shared default Prism
 * highlighter with `defaultCodeLanguages`.
 *
 * Create the highlighter once (outside render, or with `useMemo`), so that
 * code blocks do not highlight again on every render.
 *
 * @example
 * ```tsx
 * import java from "refractor/java";
 *
 * const highlighter = createPrismHighlighter({ additionalLanguages: [java] });
 *
 * <CodeHighlighterProvider highlighter={highlighter}>
 *   <App />
 * </CodeHighlighterProvider>
 * ```
 */
export const CodeHighlighterProvider = ({
  highlighter,
  children,
}: CodeHighlighterProviderProps) => (
  <CodeHighlighterContext.Provider value={highlighter}>
    {children}
  </CodeHighlighterContext.Provider>
);

CodeHighlighterProvider.displayName = "CodeHighlighterProvider";
