import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  ChatBubbleRootSlotProps,
  ChatBubbleAvatarSlotProps,
  ChatBubbleBubbleSlotProps,
  ChatBubbleActionsSlotProps,
  ChatBubbleFooterSlotProps,
  ChatBubbleTypingSlotProps,
} from "./chat-bubble.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusChatBubble",
});

/**
 * Root slot — establishes the recipe context and owns the grid layout. The
 * component defaults its rendered element to `<article>` (a feed item, per the
 * ARIA APG); consumers can override via `as`.
 */
export const ChatBubbleRootSlot: SlotComponent<
  HTMLDivElement,
  ChatBubbleRootSlotProps
> = withProvider<HTMLDivElement, ChatBubbleRootSlotProps>("article", "root");

/**
 * Avatar slot — a layout wrapper for the interior Nimbus `Avatar`. The nested
 * avatar's background/color are set per `sender` from the recipe.
 */
export const ChatBubbleAvatarSlot: SlotComponent<
  HTMLDivElement,
  ChatBubbleAvatarSlotProps
> = withContext<HTMLDivElement, ChatBubbleAvatarSlotProps>("div", "avatar");

/**
 * Bubble slot — the rounded card that holds the message payload.
 */
export const ChatBubbleBubbleSlot: SlotComponent<
  HTMLDivElement,
  ChatBubbleBubbleSlotProps
> = withContext<HTMLDivElement, ChatBubbleBubbleSlotProps>("div", "bubble");

/**
 * Actions slot — layout-only row for buttons, rendered inside the bubble.
 */
export const ChatBubbleActionsSlot: SlotComponent<
  HTMLDivElement,
  ChatBubbleActionsSlotProps
> = withContext<HTMLDivElement, ChatBubbleActionsSlotProps>("div", "actions");

/**
 * Footer slot — layout-only row rendered below the bubble.
 */
export const ChatBubbleFooterSlot: SlotComponent<
  HTMLDivElement,
  ChatBubbleFooterSlotProps
> = withContext<HTMLDivElement, ChatBubbleFooterSlotProps>("div", "footer");

/**
 * Typing slot — layout wrapper for the animated typing indicator (and an
 * optional visible label), rendered inside the bubble while a reply streams.
 */
export const ChatBubbleTypingSlot: SlotComponent<
  HTMLDivElement,
  ChatBubbleTypingSlotProps
> = withContext<HTMLDivElement, ChatBubbleTypingSlotProps>("div", "typing");
