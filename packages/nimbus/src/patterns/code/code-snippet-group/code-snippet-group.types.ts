import type { ReactNode } from "react";
import type {
  CodeBlockContentProps,
  CodeBlockRootProps,
} from "@/components/code-block/code-block.types";

/**
 * One code example of a `CodeSnippetGroup`.
 */
export type CodeSnippetGroupItem = {
  /**
   * A unique key, passed to `onSelectionChange` and `onCopy`.
   */
  key: string;
  /**
   * The visible name in the tab or select option, for example "JavaScript".
   */
  label: string;
  /**
   * The code of this example.
   */
  code: string;
  /**
   * The language used for syntax highlighting and the language label.
   */
  language?: string;
  /**
   * When set, a download button downloads this example under this file name.
   */
  fileName?: string;
};

/**
 * Props for the CodeSnippetGroup pattern.
 *
 * Style props (margin, width, etc.) are applied to the root element.
 */
export type CodeSnippetGroupProps = Omit<
  CodeBlockRootProps,
  | "code"
  | "language"
  | "children"
  | "title"
  | "onCopy"
  | "isExpanded"
  | "defaultExpanded"
  | "onExpandedChange"
> &
  Pick<CodeBlockContentProps, "showLineNumbers" | "wrapLongLines"> & {
    /**
     * The examples; one is shown at a time.
     */
    items: readonly CodeSnippetGroupItem[];
    /**
     * How the user switches between examples. Use `"select"` when there are
     * many examples or long labels.
     * @default "tabs"
     */
    switcher?: "tabs" | "select";
    /**
     * The key of the shown example (controlled).
     */
    selectedKey?: string;
    /**
     * The key of the example shown first (uncontrolled). Defaults to the
     * first item.
     */
    defaultSelectedKey?: string;
    /**
     * Called with the key of the example the user selects.
     */
    onSelectionChange?: (key: string) => void;
    /**
     * A title above the code. It also names the group, which makes it a
     * region (unless `aria-label` is set).
     */
    title?: ReactNode;
    /**
     * Accessible name of the tab list or select.
     * @default "Code example"
     */
    switcherLabel?: string;
    /**
     * Whether to show the copy button.
     * @default true
     */
    showCopyButton?: boolean;
    /**
     * Called with the key of the copied example after each successful copy.
     */
    onCopy?: (key: string) => void;
  };
