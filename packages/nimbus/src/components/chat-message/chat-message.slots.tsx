import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  ChatMessageRootSlotProps,
  ChatMessageAvatarSlotProps,
  ChatMessageBubbleSlotProps,
  ChatMessageActionsSlotProps,
  ChatMessageMetaSlotProps,
  ChatMessageTypingSlotProps,
} from "./chat-message.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusChatMessage",
});

/**
 * Root slot — establishes the recipe context and owns the grid layout. The
 * component defaults its rendered element to `<article>` (a feed item, per the
 * ARIA APG); consumers can override via `as`.
 */
export const ChatMessageRootSlot: SlotComponent<
  HTMLDivElement,
  ChatMessageRootSlotProps
> = withProvider<HTMLDivElement, ChatMessageRootSlotProps>("article", "root");

/**
 * Avatar slot — a layout wrapper for the interior Nimbus `Avatar`. The nested
 * avatar's background/color are set per `sender` from the recipe.
 */
export const ChatMessageAvatarSlot: SlotComponent<
  HTMLDivElement,
  ChatMessageAvatarSlotProps
> = withContext<HTMLDivElement, ChatMessageAvatarSlotProps>("div", "avatar");

/**
 * Bubble slot — the rounded card that holds the message payload.
 */
export const ChatMessageBubbleSlot: SlotComponent<
  HTMLDivElement,
  ChatMessageBubbleSlotProps
> = withContext<HTMLDivElement, ChatMessageBubbleSlotProps>("div", "bubble");

/**
 * Actions slot — layout-only row for buttons, rendered inside the bubble.
 */
export const ChatMessageActionsSlot: SlotComponent<
  HTMLDivElement,
  ChatMessageActionsSlotProps
> = withContext<HTMLDivElement, ChatMessageActionsSlotProps>("div", "actions");

/**
 * Meta slot — layout-only row rendered below the bubble.
 */
export const ChatMessageMetaSlot: SlotComponent<
  HTMLDivElement,
  ChatMessageMetaSlotProps
> = withContext<HTMLDivElement, ChatMessageMetaSlotProps>("div", "meta");

/**
 * Typing slot — layout wrapper for the animated typing indicator (and an
 * optional visible label), rendered inside the bubble while a reply streams.
 */
export const ChatMessageTypingSlot: SlotComponent<
  HTMLDivElement,
  ChatMessageTypingSlotProps
> = withContext<HTMLDivElement, ChatMessageTypingSlotProps>("div", "typing");
