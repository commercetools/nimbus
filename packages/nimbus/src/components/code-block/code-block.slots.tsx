import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  CodeBlockRootSlotProps,
  CodeBlockHeaderSlotProps,
  CodeBlockLanguageLabelSlotProps,
  CodeBlockCopyButtonSlotProps,
  CodeBlockPreSlotProps,
  CodeBlockCodeSlotProps,
  CodeBlockLineSlotProps,
  CodeBlockLineNumberSlotProps,
} from "./code-block.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusCodeBlock",
});

/**
 * Root slot — provides recipe styling context for the CodeBlock component.
 * Renders as a `<section>` element with `role="region"` applied in the main component.
 */
export const CodeBlockRootSlot: SlotComponent<
  HTMLElement,
  CodeBlockRootSlotProps
> = withProvider<HTMLElement, CodeBlockRootSlotProps>("section", "root");

/**
 * Header slot — renders the language label and optional copy button bar.
 */
export const CodeBlockHeaderSlot: SlotComponent<
  HTMLDivElement,
  CodeBlockHeaderSlotProps
> = withContext<HTMLDivElement, CodeBlockHeaderSlotProps>("div", "header");

/**
 * Language label slot — decorative label showing the language name in the header.
 */
export const CodeBlockLanguageLabelSlot: SlotComponent<
  HTMLSpanElement,
  CodeBlockLanguageLabelSlotProps
> = withContext<HTMLSpanElement, CodeBlockLanguageLabelSlotProps>(
  "span",
  "languageLabel"
);

/**
 * Copy button wrapper slot — container for the copy-to-clipboard icon button.
 */
export const CodeBlockCopyButtonSlot: SlotComponent<
  HTMLDivElement,
  CodeBlockCopyButtonSlotProps
> = withContext<HTMLDivElement, CodeBlockCopyButtonSlotProps>(
  "div",
  "copyButton"
);

/**
 * Pre slot — scrollable container for the highlighted code output.
 * The `tabIndex` attribute is applied in the main component.
 */
export const CodeBlockPreSlot: SlotComponent<
  HTMLPreElement,
  CodeBlockPreSlotProps
> = withContext<HTMLPreElement, CodeBlockPreSlotProps>("pre", "pre");

/**
 * Code slot — the `<code>` element wrapping token output.
 * No `aria-label` is ever applied here (ARIA prohibits it on `role=code`).
 */
export const CodeBlockCodeSlot: SlotComponent<
  HTMLElement,
  CodeBlockCodeSlotProps
> = withContext<HTMLElement, CodeBlockCodeSlotProps>("code", "code");

/**
 * Line slot — wraps each rendered line of code output.
 */
export const CodeBlockLineSlot: SlotComponent<
  HTMLSpanElement,
  CodeBlockLineSlotProps
> = withContext<HTMLSpanElement, CodeBlockLineSlotProps>("span", "line");

/**
 * Line number slot — renders the non-selectable gutter number for each line.
 */
export const CodeBlockLineNumberSlot: SlotComponent<
  HTMLSpanElement,
  CodeBlockLineNumberSlotProps
> = withContext<HTMLSpanElement, CodeBlockLineNumberSlotProps>(
  "span",
  "lineNumber"
);
