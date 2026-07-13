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

type ChatMessageRecipeProps = {
  /**
   * Which participant sent the message. Controls layout direction (avatar side)
   * and the sender-specific body/avatar styling:
   *
   * - `"agent"` (default) — agent voice, avatar leading.
   * - `"user"` — the human, avatar trailing, `colorPalette.2` surface
   *   (`primary` by default).
   *
   * `sender` denotes only *who* sent the message. System notices are out of
   * scope — a system notice isn't a message, and it isn't a standardized
   * component either; consumers render their own content (e.g. inside a
   * `ChatMessageList.Item`). Tool/function output is content inside an
   * `agent` message. Neither is a `sender` value.
   *
   * @default "agent"
   */
  sender?: SlotRecipeProps<"nimbusChatMessage">["sender"];
  /**
   * Status overlay, orthogonal to `sender`. `"error"` tints the body with the
   * critical palette to flag a failed generation — an *agent* message can fail,
   * so error is a tone rather than a sender.
   * @default "neutral"
   */
  tone?: SlotRecipeProps<"nimbusChatMessage">["tone"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type ChatMessageRootSlotProps = HTMLChakraProps<
  "div",
  ChatMessageRecipeProps
>;

export type ChatMessageAvatarSlotProps = HTMLChakraProps<"div">;

export type ChatMessageBodySlotProps = HTMLChakraProps<"div">;

export type ChatMessageActionsSlotProps = HTMLChakraProps<"div">;

export type ChatMessageMetaSlotProps = HTMLChakraProps<"div">;

export type ChatMessageTypingSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/** Props for the ChatMessage.Root component. */
export type ChatMessageProps = OmitInternalProps<ChatMessageRootSlotProps> & {
  children?: React.ReactNode;
  /**
   * Override the rendered element. Defaults to `"article"` (a feed item, per
   * the ARIA APG); set e.g. `as="li"` when composing the message into a list.
   */
  as?: React.ElementType;
  /**
   * Marks the message as still being generated. Sets `aria-busy` on the root so
   * assistive tech knows the content is in flux. The live-region announcement
   * (e.g. wrapping the feed in `role="log" aria-live="polite"`) stays the
   * consumer's responsibility — see the accessibility docs.
   */
  isStreaming?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};

/**
 * Props for the ChatMessage.Avatar component.
 *
 * Wraps the Nimbus {@link AvatarProps | Avatar}. Unless `variant` is set
 * explicitly, it defaults per `sender` — `solid` for the `agent`, `subtle` for
 * the `user`. The color palette comes from the recipe (`primary`), so consumers
 * only provide the avatar content (initials, `src`, or an icon via `children`);
 * an unconfigured avatar shows a generic person icon. Defaults to `size="xs"`
 * (a 32px box per the Figma spec).
 *
 * The avatar is **decorative by default** (`aria-hidden`) — the sender is better
 * conveyed by the message's accessible name and position than by a repeated
 * "avatar" node. Provide `firstName`/`lastName` or an explicit `aria-label` to
 * opt the avatar back into the accessibility tree with a meaningful name.
 */
export type ChatMessageAvatarProps = AvatarProps;

/** Props for the ChatMessage.Body component. */
export type ChatMessageBodyProps =
  OmitInternalProps<ChatMessageBodySlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    [key: `data-${string}`]: unknown;
  };

/** Props for the ChatMessage.Actions component. */
export type ChatMessageActionsProps =
  OmitInternalProps<ChatMessageActionsSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    [key: `data-${string}`]: unknown;
  };

/** Props for the ChatMessage.Meta component. */
export type ChatMessageMetaProps =
  OmitInternalProps<ChatMessageMetaSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    [key: `data-${string}`]: unknown;
  };

/** Props for the ChatMessage.Typing component. */
export type ChatMessageTypingProps =
  OmitInternalProps<ChatMessageTypingSlotProps> & {
    /**
     * Optional visible label rendered beside the animated dots (e.g.
     * "Agent is typing…"). The dots themselves are decorative
     * (`aria-hidden`); any text you pass here is the accessible affordance.
     */
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    [key: `data-${string}`]: unknown;
  };
