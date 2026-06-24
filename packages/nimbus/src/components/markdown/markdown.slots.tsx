import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusMarkdown",
});

export type MarkdownRootSlotProps = HTMLChakraProps<"div">;
export const MarkdownRootSlot: SlotComponent<
  HTMLDivElement,
  MarkdownRootSlotProps
> = withProvider<HTMLDivElement, MarkdownRootSlotProps>("div", "root");

export type MarkdownHeadingSlotProps = HTMLChakraProps<"h2">;
export const MarkdownHeadingSlot: SlotComponent<
  HTMLHeadingElement,
  MarkdownHeadingSlotProps
> = withContext<HTMLHeadingElement, MarkdownHeadingSlotProps>("h2", "heading");

export type MarkdownParagraphSlotProps = HTMLChakraProps<"p">;
export const MarkdownParagraphSlot: SlotComponent<
  HTMLParagraphElement,
  MarkdownParagraphSlotProps
> = withContext<HTMLParagraphElement, MarkdownParagraphSlotProps>(
  "p",
  "paragraph"
);

export type MarkdownLinkSlotProps = HTMLChakraProps<"a">;
export const MarkdownLinkSlot: SlotComponent<
  HTMLAnchorElement,
  MarkdownLinkSlotProps
> = withContext<HTMLAnchorElement, MarkdownLinkSlotProps>("a", "link");

export type MarkdownInlineCodeSlotProps = HTMLChakraProps<"code">;
export const MarkdownInlineCodeSlot: SlotComponent<
  HTMLElement,
  MarkdownInlineCodeSlotProps
> = withContext<HTMLElement, MarkdownInlineCodeSlotProps>("code", "inlineCode");

export type MarkdownCodeBlockSlotProps = HTMLChakraProps<"pre">;
export const MarkdownCodeBlockSlot: SlotComponent<
  HTMLPreElement,
  MarkdownCodeBlockSlotProps
> = withContext<HTMLPreElement, MarkdownCodeBlockSlotProps>("pre", "codeBlock");

export type MarkdownListSlotProps = HTMLChakraProps<"ul">;
export const MarkdownListSlot: SlotComponent<
  HTMLElement,
  MarkdownListSlotProps
> = withContext<HTMLElement, MarkdownListSlotProps>("ul", "list");

export type MarkdownListItemSlotProps = HTMLChakraProps<"li">;
export const MarkdownListItemSlot: SlotComponent<
  HTMLLIElement,
  MarkdownListItemSlotProps
> = withContext<HTMLLIElement, MarkdownListItemSlotProps>("li", "listItem");

export type MarkdownBlockquoteSlotProps = HTMLChakraProps<"blockquote">;
export const MarkdownBlockquoteSlot: SlotComponent<
  HTMLQuoteElement,
  MarkdownBlockquoteSlotProps
> = withContext<HTMLQuoteElement, MarkdownBlockquoteSlotProps>(
  "blockquote",
  "blockquote"
);

export type MarkdownTableSlotProps = HTMLChakraProps<"table">;
export const MarkdownTableSlot: SlotComponent<
  HTMLTableElement,
  MarkdownTableSlotProps
> = withContext<HTMLTableElement, MarkdownTableSlotProps>("table", "table");

export type MarkdownTableHeaderCellSlotProps = HTMLChakraProps<"th">;
export const MarkdownTableHeaderCellSlot: SlotComponent<
  HTMLTableCellElement,
  MarkdownTableHeaderCellSlotProps
> = withContext<HTMLTableCellElement, MarkdownTableHeaderCellSlotProps>(
  "th",
  "tableHeaderCell"
);

export type MarkdownTableCellSlotProps = HTMLChakraProps<"td">;
export const MarkdownTableCellSlot: SlotComponent<
  HTMLTableCellElement,
  MarkdownTableCellSlotProps
> = withContext<HTMLTableCellElement, MarkdownTableCellSlotProps>(
  "td",
  "tableCell"
);

export type MarkdownImageSlotProps = HTMLChakraProps<"img">;
export const MarkdownImageSlot: SlotComponent<
  HTMLImageElement,
  MarkdownImageSlotProps
> = withContext<HTMLImageElement, MarkdownImageSlotProps>("img", "image");

export type MarkdownSeparatorSlotProps = HTMLChakraProps<"hr">;
export const MarkdownSeparatorSlot: SlotComponent<
  HTMLHRElement,
  MarkdownSeparatorSlotProps
> = withContext<HTMLHRElement, MarkdownSeparatorSlotProps>("hr", "separator");
