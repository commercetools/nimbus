import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils/slot-types";
import type {
  FeedbackCardActionSlotProps,
  FeedbackCardContentSlotProps,
  FeedbackCardRootSlotProps,
} from "./feedback-card.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusFeedbackCard",
});

/**
 * Root slot — establishes the recipe context for the FeedbackCard parts and
 * renders the responsive wrapping row.
 */
export const FeedbackCardRoot: SlotComponent<
  HTMLDivElement,
  FeedbackCardRootSlotProps
> = withProvider<HTMLDivElement, FeedbackCardRootSlotProps>("div", "root");

/** Content slot — the text area (title + subtitle) that grows to fill the row. */
export const FeedbackCardContent: SlotComponent<
  HTMLDivElement,
  FeedbackCardContentSlotProps
> = withContext<HTMLDivElement, FeedbackCardContentSlotProps>("div", "content");

/** Action slot — positions the consumer's action button at the row's end. */
export const FeedbackCardAction: SlotComponent<
  HTMLDivElement,
  FeedbackCardActionSlotProps
> = withContext<HTMLDivElement, FeedbackCardActionSlotProps>("div", "action");
