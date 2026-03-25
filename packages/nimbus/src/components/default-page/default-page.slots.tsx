import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  DefaultPageRootSlotProps,
  DefaultPageHeaderSlotProps,
  DefaultPageActionsSlotProps,
  DefaultPageBackLinkSlotProps,
  DefaultPageTitleSlotProps,
  DefaultPageSubtitleSlotProps,
  DefaultPageTabNavSlotProps,
  DefaultPageContentSlotProps,
  DefaultPageFooterSlotProps,
} from "./default-page.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusDefaultPage",
});

/**
 * Root component that provides the styling context for the DefaultPage component.
 */
export const DefaultPageRootSlot: SlotComponent<
  HTMLDivElement,
  DefaultPageRootSlotProps
> = withProvider<HTMLDivElement, DefaultPageRootSlotProps>("div", "root");

export const DefaultPageHeaderSlot: SlotComponent<
  HTMLElement,
  DefaultPageHeaderSlotProps
> = withContext<HTMLElement, DefaultPageHeaderSlotProps>("header", "header");

export const DefaultPageActionsSlot: SlotComponent<
  HTMLDivElement,
  DefaultPageActionsSlotProps
> = withContext<HTMLDivElement, DefaultPageActionsSlotProps>("div", "actions");

export const DefaultPageBackLinkSlot: SlotComponent<
  HTMLAnchorElement,
  DefaultPageBackLinkSlotProps
> = withContext<HTMLAnchorElement, DefaultPageBackLinkSlotProps>(
  "a",
  "backLink"
);

export const DefaultPageTitleSlot: SlotComponent<
  HTMLHeadingElement,
  DefaultPageTitleSlotProps
> = withContext<HTMLHeadingElement, DefaultPageTitleSlotProps>("h1", "title");

export const DefaultPageSubtitleSlot: SlotComponent<
  HTMLParagraphElement,
  DefaultPageSubtitleSlotProps
> = withContext<HTMLParagraphElement, DefaultPageSubtitleSlotProps>(
  "p",
  "subtitle"
);

export const DefaultPageTabNavSlot: SlotComponent<
  HTMLDivElement,
  DefaultPageTabNavSlotProps
> = withContext<HTMLDivElement, DefaultPageTabNavSlotProps>("div", "tabNav");

export const DefaultPageContentSlot: SlotComponent<
  HTMLElement,
  DefaultPageContentSlotProps
> = withContext<HTMLElement, DefaultPageContentSlotProps>("main", "content");

export const DefaultPageFooterSlot: SlotComponent<
  HTMLElement,
  DefaultPageFooterSlotProps
> = withContext<HTMLElement, DefaultPageFooterSlotProps>("footer", "footer");
