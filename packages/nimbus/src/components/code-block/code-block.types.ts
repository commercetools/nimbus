import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type CodeBlockRecipeProps = {
  /**
   * Controls typography and padding scaling.
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

export type CodeBlockLanguageLabelSlotProps = HTMLChakraProps<"span">;

export type CodeBlockCopyButtonSlotProps = HTMLChakraProps<"div">;

export type CodeBlockPreSlotProps = HTMLChakraProps<"pre">;

export type CodeBlockCodeSlotProps = HTMLChakraProps<"code">;

export type CodeBlockLineSlotProps = HTMLChakraProps<"span">;

export type CodeBlockLineNumberSlotProps = HTMLChakraProps<"span">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the CodeBlock component.
 *
 * A read-only, accessible, token-themed block-level code renderer with
 * syntax highlighting, optional header, copy-to-clipboard, and line numbers.
 */
export type CodeBlockProps = OmitInternalProps<CodeBlockRootSlotProps> & {
  /**
   * The source code string to display. The content is rendered as text nodes
   * (no dangerouslySetInnerHTML), so untrusted code strings are safe.
   */
  code: string;

  /**
   * The programming language used for syntax highlighting.
   * Unknown or unsupported values fall back to plain text without crashing.
   * @default "plaintext"
   */
  language?: string;

  /**
   * Whether to show a per-line number gutter alongside the code.
   * Line numbers are decorative and are excluded from copied text.
   * @default false
   */
  showLineNumbers?: boolean;

  /**
   * The number assigned to the first rendered line of the gutter; each
   * subsequent line increments by one. Use this to display a contiguous
   * excerpt of a file with its real source line numbers (e.g.
   * `startLineNumber={42}` numbers a five-line excerpt 42–46). Only takes
   * effect when `showLineNumbers` is `true`, and never affects the copied
   * text (line numbers remain decorative).
   * @default 1
   */
  startLineNumber?: number;

  /**
   * Line numbers to visually highlight with a background band, keyed to the
   * displayed line numbers (the same numbering as the gutter, so a
   * `startLineNumber` offset applies — e.g. `highlightedLines={[43]}` with
   * `startLineNumber={42}` highlights the second rendered line). Highlighting
   * works whether or not `showLineNumbers` is enabled. The highlight is
   * decorative and is excluded from copied text.
   * @default []
   */
  highlightedLines?: number[];

  /**
   * Whether to render the header bar containing the language label and copy button.
   * When false, the copy button is also hidden.
   * @default true
   */
  showHeader?: boolean;

  /**
   * Whether to show the copy-to-clipboard button inside the header.
   * Has no effect when `showHeader` is false.
   * @default true
   */
  showCopyButton?: boolean;

  /**
   * Accessible label for the code region landmark (`role="region"`).
   * Defaults to the localized "Code block" string from the active locale.
   */
  "aria-label"?: string;

  /**
   * Callback fired exactly once per successful clipboard write.
   * Not called when the clipboard API is unavailable (e.g., insecure origins).
   */
  onCopy?: () => void;

  /**
   * React ref forwarded to the root `<section>` element.
   */
  ref?: React.Ref<HTMLElement>;
};
