import {
  ChatBubbleRoot,
  ChatBubbleAvatar,
  ChatBubbleBubble,
  ChatBubbleActions,
  ChatBubbleFeedback,
} from "./components";

/**
 * ChatBubble
 * ============================================================
 * A compound component representing a single message in an AI chat feed.
 * It provides a bubble container, an avatar, and two layout-only slots
 * (actions inside the bubble, feedback below it) that consumers fill with
 * their own content. The `sender` prop drives the layout direction and the
 * sender-specific visual styling.
 *
 * @example
 * ```tsx
 * <ChatBubble.Root sender="agent">
 *   <ChatBubble.Avatar>
 *     <AutoAwesome />
 *   </ChatBubble.Avatar>
 *   <ChatBubble.Bubble>
 *     <Text>Here is the summary you asked for.</Text>
 *     <ChatBubble.Actions>
 *       <Button variant="outline">Save as draft</Button>
 *       <Button variant="solid">Approve</Button>
 *     </ChatBubble.Actions>
 *   </ChatBubble.Bubble>
 *   <ChatBubble.Feedback>
 *     <Link>How was this generated?</Link>
 *     <Text>Apr 13, 11:56pm</Text>
 *   </ChatBubble.Feedback>
 * </ChatBubble.Root>
 * ```
 */
export const ChatBubble = {
  /**
   * # ChatBubble.Root
   *
   * The grid container for a single message. Establishes the styling context
   * and lays out the avatar, bubble and optional feedback row. Accepts the
   * `sender` prop (`"user" | "agent"`) which controls layout direction and
   * sender-specific styling.
   *
   * @example
   * ```tsx
   * <ChatBubble.Root sender="user">
   *   <ChatBubble.Avatar firstName="Ada" lastName="Lovelace" />
   *   <ChatBubble.Bubble>
   *     <Text>Can you summarise this order?</Text>
   *   </ChatBubble.Bubble>
   * </ChatBubble.Root>
   * ```
   */
  Root: ChatBubbleRoot,
  /**
   * # ChatBubble.Avatar
   *
   * The sender's avatar. Wraps the Nimbus `Avatar` (defaulting to `size="2xs"`)
   * and is styled per `sender`. Provide the content via `firstName`/`lastName`
   * (initials), `src` (image), or `children` (a custom icon).
   *
   * @example
   * ```tsx
   * <ChatBubble.Avatar>
   *   <AutoAwesome />
   * </ChatBubble.Avatar>
   * ```
   */
  Avatar: ChatBubbleAvatar,
  /**
   * # ChatBubble.Bubble
   *
   * The rounded card that holds the message payload. Stacks its children
   * vertically; place `ChatBubble.Actions` last to pin actions to the bottom.
   *
   * @example
   * ```tsx
   * <ChatBubble.Bubble>
   *   <Text>Message content</Text>
   * </ChatBubble.Bubble>
   * ```
   */
  Bubble: ChatBubbleBubble,
  /**
   * # ChatBubble.Actions
   *
   * A layout-only, right-aligned row for action buttons, rendered inside the
   * bubble. Consumers provide the buttons.
   *
   * @example
   * ```tsx
   * <ChatBubble.Actions>
   *   <Button variant="outline">Dismiss</Button>
   *   <Button variant="solid">Approve</Button>
   * </ChatBubble.Actions>
   * ```
   */
  Actions: ChatBubbleActions,
  /**
   * # ChatBubble.Feedback
   *
   * A layout-only `space-between` row rendered below the bubble. Consumers
   * provide the content (timestamp, trust affordances, reaction icons, links).
   *
   * @example
   * ```tsx
   * <ChatBubble.Feedback>
   *   <Link>How was this generated?</Link>
   *   <Text>Apr 13, 11:56pm</Text>
   * </ChatBubble.Feedback>
   * ```
   */
  Feedback: ChatBubbleFeedback,
};

export {
  ChatBubbleRoot as _ChatBubbleRoot,
  ChatBubbleAvatar as _ChatBubbleAvatar,
  ChatBubbleBubble as _ChatBubbleBubble,
  ChatBubbleActions as _ChatBubbleActions,
  ChatBubbleFeedback as _ChatBubbleFeedback,
};
