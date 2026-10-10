import {
  CodeBlockRoot,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockLanguageLabel,
  CodeBlockActions,
  CodeBlockCopyTrigger,
  CodeBlockDownloadTrigger,
  CodeBlockContent,
  CodeBlockExpandTrigger,
  CodeBlockFooter,
} from "./components";

/**
 * CodeBlock
 * ============================================================
 * A read-only, syntax-highlighted, accessible block of source code, built
 * from parts. For common layouts, use the patterns `CodeSnippet`,
 * `CodeSnippetGroup`, `JsonSnippet` and `CommandSnippet`; use `CodeBlock`
 * directly for custom layouts.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/code-block}
 *
 * @example
 * ```tsx
 * <CodeBlock.Root code={source} language="tsx">
 *   <CodeBlock.Header>
 *     <CodeBlock.Title>button.tsx</CodeBlock.Title>
 *     <CodeBlock.LanguageLabel />
 *     <CodeBlock.Actions>
 *       <CodeBlock.CopyTrigger />
 *     </CodeBlock.Actions>
 *   </CodeBlock.Header>
 *   <CodeBlock.Content showLineNumbers />
 * </CodeBlock.Root>
 * ```
 */
export const CodeBlock = {
  /**
   * # CodeBlock.Root
   *
   * Holds the code and language, highlights the code, and provides shared
   * state to all parts. Renders a `section` region named by `aria-label`,
   * `CodeBlock.Title`, or the localized "Code block". Accepts `size`,
   * `maxLines` and the expanded state.
   *
   * @example
   * ```tsx
   * <CodeBlock.Root code={source} language="tsx" size="sm">
   *   <CodeBlock.Content />
   * </CodeBlock.Root>
   * ```
   */
  Root: CodeBlockRoot,
  /**
   * # CodeBlock.Header
   *
   * A row above the code for the title, language label and actions.
   *
   * @example
   * ```tsx
   * <CodeBlock.Header>
   *   <CodeBlock.LanguageLabel />
   *   <CodeBlock.Actions>
   *     <CodeBlock.CopyTrigger />
   *   </CodeBlock.Actions>
   * </CodeBlock.Header>
   * ```
   */
  Header: CodeBlockHeader,
  /**
   * # CodeBlock.Title
   *
   * The visible title, for example a file name. It names the code region
   * unless `aria-label` is set on `CodeBlock.Root`.
   *
   * @example
   * ```tsx
   * <CodeBlock.Title>config.yaml</CodeBlock.Title>
   * ```
   */
  Title: CodeBlockTitle,
  /**
   * # CodeBlock.LanguageLabel
   *
   * A decorative label that shows the language of `CodeBlock.Root`, or its
   * children. Hidden from assistive technology.
   *
   * @example
   * ```tsx
   * <CodeBlock.LanguageLabel>TypeScript</CodeBlock.LanguageLabel>
   * ```
   */
  LanguageLabel: CodeBlockLanguageLabel,
  /**
   * # CodeBlock.Actions
   *
   * Groups triggers. Inside `CodeBlock.Header` it aligns to the end; inside
   * `CodeBlock.Content` it floats in the top-end corner next to the code.
   *
   * @example
   * ```tsx
   * <CodeBlock.Content>
   *   <CodeBlock.Actions>
   *     <CodeBlock.CopyTrigger />
   *   </CodeBlock.Actions>
   * </CodeBlock.Content>
   * ```
   */
  Actions: CodeBlockActions,
  /**
   * # CodeBlock.CopyTrigger
   *
   * An icon button that copies the code (or `text`) and announces the result.
   *
   * @example
   * ```tsx
   * <CodeBlock.CopyTrigger onCopy={() => track("copy")} />
   * ```
   */
  CopyTrigger: CodeBlockCopyTrigger,
  /**
   * # CodeBlock.DownloadTrigger
   *
   * An icon button that downloads the code (or `text`) as a file.
   *
   * @example
   * ```tsx
   * <CodeBlock.DownloadTrigger fileName="config.yaml" />
   * ```
   */
  DownloadTrigger: CodeBlockDownloadTrigger,
  /**
   * # CodeBlock.Content
   *
   * The focusable, scrollable code area with options for line numbers,
   * marked lines, word highlights, prompts and wrapping.
   *
   * @example
   * ```tsx
   * <CodeBlock.Content
   *   showLineNumbers
   *   highlightedLines={[2, [5, 7]]}
   *   addedLines={[9]}
   * />
   * ```
   */
  Content: CodeBlockContent,
  /**
   * # CodeBlock.ExpandTrigger
   *
   * A "Show more" / "Show less" button, rendered only when the code has more
   * lines than `maxLines`.
   *
   * @example
   * ```tsx
   * <CodeBlock.Root code={longSource} maxLines={10}>
   *   <CodeBlock.Content />
   *   <CodeBlock.ExpandTrigger />
   * </CodeBlock.Root>
   * ```
   */
  ExpandTrigger: CodeBlockExpandTrigger,
  /**
   * # CodeBlock.Footer
   *
   * Content below the code, for example a note or a link.
   *
   * @example
   * ```tsx
   * <CodeBlock.Footer>Requires Node 20 or later.</CodeBlock.Footer>
   * ```
   */
  Footer: CodeBlockFooter,
};
