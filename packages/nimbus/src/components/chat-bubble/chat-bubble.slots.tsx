import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "../../type-utils/slot-types";
import type {
  ChatBubbleRootSlotProps,
  ChatBubbleAvatarSlotProps,
  ChatBubbleBubbleSlotProps,
  ChatBubbleActionsSlotProps,
  ChatBubbleFeedbackSlotProps,
} from "./chat-bubble.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusChatBubble",
});

/**
 * Root slot — establishes the recipe context and owns the grid layout.
 */
export const ChatBubbleRootSlot: SlotComponent<
  HTMLDivElement,
  ChatBubbleRootSlotProps
> = withProvider<HTMLDivElement, ChatBubbleRootSlotProps>("div", "root");

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
 * Feedback slot — layout-only row rendered below the bubble.
 */
export const ChatBubbleFeedbackSlot: SlotComponent<
  HTMLDivElement,
  ChatBubbleFeedbackSlotProps
> = withContext<HTMLDivElement, ChatBubbleFeedbackSlotProps>("div", "feedback");
