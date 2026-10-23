import type { ReactNode } from "react";
import type {
  CodeBlockContentProps,
  CodeBlockRootProps,
} from "@/components/code-block/code-block.types";

/**
 * Props for the CodeSnippet pattern.
 *
 * Style props (margin, width, etc.) are applied to the root element. Props
 * with the same name as a `CodeBlock` prop behave as described there.
 */
export type CodeSnippetProps = Omit<
  CodeBlockRootProps,
  "children" | "title" | "onCopy"
> &
  Pick<
    CodeBlockContentProps,
    | "showLineNumbers"
    | "startLineNumber"
    | "highlightedLines"
    | "addedLines"
    | "removedLines"
    | "highlightedWords"
    | "wrapLongLines"
  > & {
    /**
     * A title above the code, for example a file name. It also names the
     * snippet, which makes it a region (unless `aria-label` is set).
     */
    title?: ReactNode;
    /**
     * Whether to show the language label in the header.
     * @default true
     */
    showLanguage?: boolean;
    /**
     * Whether to show the copy button.
     * @default true
     */
    showCopyButton?: boolean;
    /**
     * When set, a download button downloads the code under this file name.
     */
    downloadFileName?: string;
    /**
     * Called once after each successful copy.
     */
    onCopy?: () => void;
    /**
     * Content below the code, for example a note or a link.
     */
    footer?: ReactNode;
  };
