import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { ButtonProps } from "../button/button.types";
import type { IconButtonProps } from "../icon-button/icon-button.types";
import type { CodeLineSelection } from "./highlighter/code-highlighter.types";

// ============================================================
// RECIPE PROPS
// ============================================================

type CodeBlockRecipeProps = {
  /**
   * Controls typography, padding and trigger size.
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusCodeBlock">["size"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type CodeBlockRootSlotProps = HTMLChakraProps<
  "section",
  CodeBlockRecipeProps
>;

export type CodeBlockHeaderSlotProps = HTMLChakraProps<"div">;

export type CodeBlockTitleSlotProps = HTMLChakraProps<"span">;

export type CodeBlockLanguageLabelSlotProps = HTMLChakraProps<"span">;

export type CodeBlockActionsSlotProps = HTMLChakraProps<"div">;

export type CodeBlockTriggerSlotProps = HTMLChakraProps<"span">;

export type CodeBlockContentSlotProps = HTMLChakraProps<"div">;

export type CodeBlockPreSlotProps = HTMLChakraProps<"pre">;

export type CodeBlockCodeSlotProps = HTMLChakraProps<"code">;

export type CodeBlockLineSlotProps = HTMLChakraProps<"span">;

export type CodeBlockLineNumberSlotProps = HTMLChakraProps<"span">;

export type CodeBlockMarkerSlotProps = HTMLChakraProps<"span">;

export type CodeBlockPromptSlotProps = HTMLChakraProps<"span">;

export type CodeBlockLineContentSlotProps = HTMLChakraProps<"span">;

export type CodeBlockExpandTriggerSlotProps = HTMLChakraProps<"div">;

export type CodeBlockFooterSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * Where a `CodeBlock.Actions` group is placed.
 */
export type CodeBlockActionsPlacement = "header" | "content";

/**
 * Button props the triggers pass to their button. The triggers set
 * `children` and `onPress` themselves, and `aria-label` is optional because a
 * localized default exists. The DOM `onCopy` clipboard-event handler is
 * omitted because `CodeBlock.CopyTrigger` uses `onCopy` for a successful copy.
 */
type CodeBlockTriggerButtonProps = Omit<
  IconButtonProps,
  "children" | "onPress" | "aria-label" | "onCopy"
>;

// ============================================================
// MAIN PROPS
// ============================================================

/** Props for the CodeBlock.Root component. */
export type CodeBlockRootProps = OmitInternalProps<CodeBlockRootSlotProps> & {
  /**
   * The source code to display. It is rendered as text, never as markup, so
   * untrusted code is safe. Copy and download use this exact string.
   */
  code: string;
  /**
   * The language used for syntax highlighting, as a language id or alias
   * (for example `"tsx"`, `"sh"`). Unsupported values, `"plaintext"`,
   * `"text"` and `"txt"` show plain text.
   */
  language?: string;
  /**
   * The number of lines shown while the block is collapsed. When the code has
   * more lines, the block becomes collapsible and `CodeBlock.ExpandTrigger`
   * is rendered.
   */
  maxLines?: number;
  /**
   * Whether all lines are shown (controlled). Use with `onExpandedChange`.
   */
  isExpanded?: boolean;
  /**
   * Whether all lines are shown initially (uncontrolled).
   * @default false
   */
  defaultExpanded?: boolean;
  /**
   * Called when the user expands or collapses the block.
   */
  onExpandedChange?: (isExpanded: boolean) => void;
  /**
   * Accessible name of the code region. Wins over `CodeBlock.Title`. Without
   * both, the localized "Code block" is used.
   */
  "aria-label"?: string;
  /**
   * The parts of the code block.
   */
  children?: React.ReactNode;
  /**
   * Reference to the root `<section>` element.
   */
  ref?: React.Ref<HTMLElement>;
};

/** Props for the CodeBlock.Header component. */
export type CodeBlockHeaderProps =
  OmitInternalProps<CodeBlockHeaderSlotProps> & {
    /**
     * Header content, usually `Title`, `LanguageLabel` and `Actions`.
     */
    children?: React.ReactNode;
    /**
     * Reference to the header element.
     */
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * Props for the CodeBlock.Title component. Render at most one Title per
 * Root; its `id` is set by Root.
 */
export type CodeBlockTitleProps = OmitInternalProps<CodeBlockTitleSlotProps> & {
  /**
   * The title, for example a file name. It names the code region unless
   * `aria-label` is set on `CodeBlock.Root`. The title is detected after
   * mount, so server-rendered HTML uses the default name; set `aria-label` on
   * Root when that matters.
   */
  children: React.ReactNode;
  /**
   * Reference to the title element.
   */
  ref?: React.Ref<HTMLSpanElement>;
};

/** Props for the CodeBlock.LanguageLabel component. */
export type CodeBlockLanguageLabelProps =
  OmitInternalProps<CodeBlockLanguageLabelSlotProps> & {
    /**
     * The visible label. Defaults to the `language` of `CodeBlock.Root`.
     * The label is hidden from assistive technology.
     */
    children?: React.ReactNode;
    /**
     * Reference to the label element.
     */
    ref?: React.Ref<HTMLSpanElement>;
  };

/** Props for the CodeBlock.Actions component. */
export type CodeBlockActionsProps =
  OmitInternalProps<CodeBlockActionsSlotProps> & {
    /**
     * The triggers, for example `CopyTrigger` and `DownloadTrigger`.
     */
    children?: React.ReactNode;
    /**
     * Reference to the actions element.
     */
    ref?: React.Ref<HTMLDivElement>;
  };

/** Props for the CodeBlock.CopyTrigger component. */
export type CodeBlockCopyTriggerProps =
  OmitInternalProps<CodeBlockTriggerButtonProps> & {
    /**
     * Accessible name of the button.
     * @default "Copy code"
     */
    "aria-label"?: string;
    /**
     * The text to copy. Defaults to the `code` of `CodeBlock.Root`.
     */
    text?: string;
    /**
     * Called once after each successful copy.
     */
    onCopy?: () => void;
    /**
     * Called once when the clipboard write fails, with the error.
     */
    onCopyError?: (error?: Error) => void;
    /**
     * Time in milliseconds until the "copied" state resets.
     * @default 2000
     */
    timeout?: number;
  };

/** Props for the CodeBlock.DownloadTrigger component. */
export type CodeBlockDownloadTriggerProps =
  OmitInternalProps<CodeBlockTriggerButtonProps> & {
    /**
     * Accessible name of the button.
     * @default "Download code"
     */
    "aria-label"?: string;
    /**
     * The name of the downloaded file, for example `"config.yaml"`.
     */
    fileName: string;
    /**
     * The MIME type of the downloaded file.
     * @default "text/plain;charset=utf-8"
     */
    mimeType?: string;
    /**
     * The text to download. Defaults to the `code` of `CodeBlock.Root`.
     */
    text?: string;
    /**
     * Called once after each download starts.
     */
    onDownload?: () => void;
  };

/**
 * Props for the CodeBlock.Content component. Render at most one Content per
 * Root; its scroll area gets an `id` from Root for `aria-controls`.
 */
export type CodeBlockContentProps =
  OmitInternalProps<CodeBlockContentSlotProps> & {
    /**
     * Whether to show a line-number column. Numbers are not copied.
     * @default false
     */
    showLineNumbers?: boolean;
    /**
     * The number of the first line; the following lines count up from it.
     * Line selections use these displayed numbers.
     * @default 1
     */
    startLineNumber?: number;
    /**
     * Lines to highlight, as line numbers and inclusive `[start, end]`
     * ranges.
     */
    highlightedLines?: CodeLineSelection;
    /**
     * Lines shown as added (`+` marker and added background).
     */
    addedLines?: CodeLineSelection;
    /**
     * Lines shown as removed (`−` marker and removed background).
     */
    removedLines?: CodeLineSelection;
    /**
     * Strings to mark wherever they occur (exact and case-sensitive).
     */
    highlightedWords?: readonly string[];
    /**
     * Text shown before every line except `outputLines`, for example `"$"`.
     * The prompt is not copied.
     */
    prompt?: string;
    /**
     * Lines that show command output and therefore no `prompt`.
     */
    outputLines?: CodeLineSelection;
    /**
     * Whether long lines wrap instead of scrolling horizontally.
     * @default false
     */
    wrapLongLines?: boolean;
    /**
     * Content placed next to the code, usually `CodeBlock.Actions`, which
     * then floats in the top-end corner.
     */
    children?: React.ReactNode;
    /**
     * Reference to the content element.
     */
    ref?: React.Ref<HTMLDivElement>;
  };

/** Props for the CodeBlock.ExpandTrigger component. */
export type CodeBlockExpandTriggerProps = OmitInternalProps<
  Omit<ButtonProps, "children" | "onPress">
> & {
  /**
   * A custom label, or a function that returns the label for the current
   * state. Defaults to the localized "Show more" / "Show less".
   */
  children?: React.ReactNode | ((isExpanded: boolean) => React.ReactNode);
};

/** Props for the CodeBlock.Footer component. */
export type CodeBlockFooterProps =
  OmitInternalProps<CodeBlockFooterSlotProps> & {
    /**
     * Footer content, for example a note or a link.
     */
    children?: React.ReactNode;
    /**
     * Reference to the footer element.
     */
    ref?: React.Ref<HTMLDivElement>;
  };
