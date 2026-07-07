import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { AvatarProps } from "../avatar/avatar.types";

// ============================================================
// RECIPE PROPS
// ============================================================

type ChatBubbleRecipeProps = {
  /**
   * Who sent the message. Controls layout direction (avatar side) and the
   * sender-specific bubble/avatar styling.
   * @default "agent"
   */
  sender?: SlotRecipeProps<"nimbusChatBubble">["sender"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type ChatBubbleRootSlotProps = HTMLChakraProps<
  "div",
  ChatBubbleRecipeProps
>;

export type ChatBubbleAvatarSlotProps = HTMLChakraProps<"div">;

export type ChatBubbleBubbleSlotProps = HTMLChakraProps<"div">;

export type ChatBubbleActionsSlotProps = HTMLChakraProps<"div">;

export type ChatBubbleFeedbackSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/** Props for the ChatBubble.Root component. */
export type ChatBubbleProps = OmitInternalProps<ChatBubbleRootSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};

/**
 * Props for the ChatBubble.Avatar component.
 *
 * Wraps the Nimbus {@link AvatarProps | Avatar}; the background and icon color
 * are set automatically per `sender` by the recipe, so consumers only provide
 * the avatar content (initials, `src`, or an icon via `children`). Defaults to
 * `size="2xs"`.
 */
export type ChatBubbleAvatarProps = AvatarProps;

/** Props for the ChatBubble.Bubble component. */
export type ChatBubbleBubbleProps =
  OmitInternalProps<ChatBubbleBubbleSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  };

/** Props for the ChatBubble.Actions component. */
export type ChatBubbleActionsProps =
  OmitInternalProps<ChatBubbleActionsSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  };

/** Props for the ChatBubble.Feedback component. */
export type ChatBubbleFeedbackProps =
  OmitInternalProps<ChatBubbleFeedbackSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  };
