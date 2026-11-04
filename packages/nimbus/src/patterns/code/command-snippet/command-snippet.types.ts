import type {
  CodeBlockContentProps,
  CodeBlockRootProps,
} from "@/components/code-block/code-block.types";

/**
 * Props for the CommandSnippet pattern.
 *
 * Style props (margin, width, etc.) are applied to the root element.
 */
export type CommandSnippetProps = Omit<
  CodeBlockRootProps,
  | "code"
  | "language"
  | "children"
  | "maxLines"
  | "isExpanded"
  | "defaultExpanded"
  | "onExpandedChange"
  | "onCopy"
> &
  Pick<CodeBlockContentProps, "outputLines" | "wrapLongLines"> & {
    /**
     * The command, or several lines of commands and output. It is copied
     * without prompts.
     */
    command: string;
    /**
     * The language used for syntax highlighting.
     * @default "bash"
     */
    language?: string;
    /**
     * The prompt shown before every line except `outputLines`. An empty
     * string shows no prompt.
     * @default "$"
     */
    prompt?: string;
    /**
     * Whether to show the copy button.
     * @default true
     */
    showCopyButton?: boolean;
    /**
     * Called once after each successful copy.
     */
    onCopy?: () => void;
  };
