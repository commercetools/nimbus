import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  ChatMessageListRootSlotProps,
  ChatMessageListViewportSlotProps,
  ChatMessageListItemSlotProps,
  ChatMessageListScrollToBottomSlotProps,
  ChatMessageListEmptySlotProps,
} from "./chat-message-list.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusChatMessageList",
});

/**
 * Root slot — establishes the recipe context and is the positioned anchor for
 * the floating scroll-to-bottom control.
 */
export const ChatMessageListRootSlot: SlotComponent<
  HTMLDivElement,
  ChatMessageListRootSlotProps
> = withProvider<HTMLDivElement, ChatMessageListRootSlotProps>("div", "root");

/**
 * Viewport slot — the vertical flow that holds the items and owns the
 * transcript rhythm. Rendered inside the interior `ScrollArea`, so it is the
 * content that scrolls.
 */
export const ChatMessageListViewportSlot: SlotComponent<
  HTMLDivElement,
  ChatMessageListViewportSlotProps
> = withContext<HTMLDivElement, ChatMessageListViewportSlotProps>(
  "div",
  "viewport"
);

/**
 * Item slot — one list member. A plain block in the scroll flow; it does not
 * assert `role="listitem"` (which would conflict with the `log` container).
 */
export const ChatMessageListItemSlot: SlotComponent<
  HTMLDivElement,
  ChatMessageListItemSlotProps
> = withContext<HTMLDivElement, ChatMessageListItemSlotProps>("div", "item");

/**
 * Scroll-to-bottom slot — the layout wrapper that positions the "jump to
 * latest" control over the bottom of the transcript.
 */
export const ChatMessageListScrollToBottomSlot: SlotComponent<
  HTMLDivElement,
  ChatMessageListScrollToBottomSlotProps
> = withContext<HTMLDivElement, ChatMessageListScrollToBottomSlotProps>(
  "div",
  "scrollToBottom"
);

/**
 * Empty slot — the centered container shown when there are no items.
 */
export const ChatMessageListEmptySlot: SlotComponent<
  HTMLDivElement,
  ChatMessageListEmptySlotProps
> = withContext<HTMLDivElement, ChatMessageListEmptySlotProps>("div", "empty");
