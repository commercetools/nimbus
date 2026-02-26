import { createSlotRecipeContext } from "@chakra-ui/react";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  DetailPageRootSlotProps,
  DetailPageHeaderSlotProps,
  DetailPageBackLinkSlotProps,
  DetailPageTitleSlotProps,
  DetailPageSubtitleSlotProps,
  DetailPageContentSlotProps,
  DetailPageFooterSlotProps,
} from "./detail-page.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusDetailPage",
});

/**
 * Root component that provides the styling context for the DetailPage component.
 */
export const DetailPageRootSlot: SlotComponent<
  HTMLDivElement,
  DetailPageRootSlotProps
> = withProvider<HTMLDivElement, DetailPageRootSlotProps>("div", "root");

export const DetailPageHeaderSlot: SlotComponent<
  HTMLElement,
  DetailPageHeaderSlotProps
> = withContext<HTMLElement, DetailPageHeaderSlotProps>("header", "header");

export const DetailPageBackLinkSlot: SlotComponent<
  HTMLAnchorElement,
  DetailPageBackLinkSlotProps
> = withContext<HTMLAnchorElement, DetailPageBackLinkSlotProps>(
  "a",
  "backLink"
);

export const DetailPageTitleSlot: SlotComponent<
  HTMLHeadingElement,
  DetailPageTitleSlotProps
> = withContext<HTMLHeadingElement, DetailPageTitleSlotProps>("h1", "title");

export const DetailPageSubtitleSlot: SlotComponent<
  HTMLParagraphElement,
  DetailPageSubtitleSlotProps
> = withContext<HTMLParagraphElement, DetailPageSubtitleSlotProps>(
  "p",
  "subtitle"
);

export const DetailPageContentSlot: SlotComponent<
  HTMLElement,
  DetailPageContentSlotProps
> = withContext<HTMLElement, DetailPageContentSlotProps>("main", "content");

export const DetailPageFooterSlot: SlotComponent<
  HTMLElement,
  DetailPageFooterSlotProps
> = withContext<HTMLElement, DetailPageFooterSlotProps>("footer", "footer");
