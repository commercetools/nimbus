import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  CodeBlockRootSlotProps,
  CodeBlockHeaderSlotProps,
  CodeBlockTitleSlotProps,
  CodeBlockLanguageLabelSlotProps,
  CodeBlockActionsSlotProps,
  CodeBlockTriggerSlotProps,
  CodeBlockContentSlotProps,
  CodeBlockPreSlotProps,
  CodeBlockCodeSlotProps,
  CodeBlockLineSlotProps,
  CodeBlockLineNumberSlotProps,
  CodeBlockMarkerSlotProps,
  CodeBlockPromptSlotProps,
  CodeBlockLineContentSlotProps,
  CodeBlockExpandTriggerSlotProps,
  CodeBlockFooterSlotProps,
} from "./code-block.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusCodeBlock",
});

/**
 * Root slot — provides recipe styling context. Renders a `<section>`; `role="region"` is applied in `CodeBlock.Root`.
 */
export const CodeBlockRootSlot: SlotComponent<
  HTMLElement,
  CodeBlockRootSlotProps
> = withProvider<HTMLElement, CodeBlockRootSlotProps>("section", "root");

/**
 * Header slot — a row for the title, language label and actions.
 */
export const CodeBlockHeaderSlot: SlotComponent<
  HTMLDivElement,
  CodeBlockHeaderSlotProps
> = withContext<HTMLDivElement, CodeBlockHeaderSlotProps>("div", "header");

/**
 * Title slot — the visible title (for example a file name) that names the region.
 */
export const CodeBlockTitleSlot: SlotComponent<
  HTMLSpanElement,
  CodeBlockTitleSlotProps
> = withContext<HTMLSpanElement, CodeBlockTitleSlotProps>("span", "title");

/**
 * Language label slot — decorative label showing the language name.
 */
export const CodeBlockLanguageLabelSlot: SlotComponent<
  HTMLSpanElement,
  CodeBlockLanguageLabelSlotProps
> = withContext<HTMLSpanElement, CodeBlockLanguageLabelSlotProps>(
  "span",
  "languageLabel"
);

/**
 * Actions slot — groups triggers in the header or next to the code.
 */
export const CodeBlockActionsSlot: SlotComponent<
  HTMLDivElement,
  CodeBlockActionsSlotProps
> = withContext<HTMLDivElement, CodeBlockActionsSlotProps>("div", "actions");

/**
 * Trigger slot — wraps the copy and download icon buttons and extends their hit area.
 */
export const CodeBlockTriggerSlot: SlotComponent<
  HTMLSpanElement,
  CodeBlockTriggerSlotProps
> = withContext<HTMLSpanElement, CodeBlockTriggerSlotProps>("span", "trigger");

/**
 * Content slot — holds the scroll area and floating actions side by side.
 */
export const CodeBlockContentSlot: SlotComponent<
  HTMLDivElement,
  CodeBlockContentSlotProps
> = withContext<HTMLDivElement, CodeBlockContentSlotProps>("div", "content");

/**
 * Pre slot — scrollable container for the highlighted code output.
 * The `tabIndex` attribute is applied in `CodeBlock.Content`.
 */
export const CodeBlockPreSlot: SlotComponent<
  HTMLPreElement,
  CodeBlockPreSlotProps
> = withContext<HTMLPreElement, CodeBlockPreSlotProps>("pre", "pre");

/**
 * Code slot — the `<code>` element wrapping all lines.
 * No `aria-label` is ever applied here (ARIA prohibits it on `role=code`).
 */
export const CodeBlockCodeSlot: SlotComponent<
  HTMLElement,
  CodeBlockCodeSlotProps
> = withContext<HTMLElement, CodeBlockCodeSlotProps>("code", "code");

/**
 * Line slot — one rendered line of code, including its gutter.
 */
export const CodeBlockLineSlot: SlotComponent<
  HTMLSpanElement,
  CodeBlockLineSlotProps
> = withContext<HTMLSpanElement, CodeBlockLineSlotProps>("span", "line");

/**
 * Line number slot — the non-selectable gutter number of a line.
 */
export const CodeBlockLineNumberSlot: SlotComponent<
  HTMLSpanElement,
  CodeBlockLineNumberSlotProps
> = withContext<HTMLSpanElement, CodeBlockLineNumberSlotProps>(
  "span",
  "lineNumber"
);

/**
 * Marker slot — the non-selectable `+` / `−` column for added and removed lines.
 */
export const CodeBlockMarkerSlot: SlotComponent<
  HTMLSpanElement,
  CodeBlockMarkerSlotProps
> = withContext<HTMLSpanElement, CodeBlockMarkerSlotProps>("span", "marker");

/**
 * Prompt slot — the non-selectable prompt (for example `$`) before a command line.
 */
export const CodeBlockPromptSlot: SlotComponent<
  HTMLSpanElement,
  CodeBlockPromptSlotProps
> = withContext<HTMLSpanElement, CodeBlockPromptSlotProps>("span", "prompt");

/**
 * Line content slot — the tokens of a line.
 */
export const CodeBlockLineContentSlot: SlotComponent<
  HTMLSpanElement,
  CodeBlockLineContentSlotProps
> = withContext<HTMLSpanElement, CodeBlockLineContentSlotProps>(
  "span",
  "lineContent"
);

/**
 * Expand trigger slot — wraps the show more / show less button.
 */
export const CodeBlockExpandTriggerSlot: SlotComponent<
  HTMLDivElement,
  CodeBlockExpandTriggerSlotProps
> = withContext<HTMLDivElement, CodeBlockExpandTriggerSlotProps>(
  "div",
  "expandTrigger"
);

/**
 * Footer slot — content below the code.
 */
export const CodeBlockFooterSlot: SlotComponent<
  HTMLDivElement,
  CodeBlockFooterSlotProps
> = withContext<HTMLDivElement, CodeBlockFooterSlotProps>("div", "footer");
