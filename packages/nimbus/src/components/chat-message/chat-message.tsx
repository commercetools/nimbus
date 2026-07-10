import {
  ChatMessageRoot,
  ChatMessageAvatar,
  ChatMessageBubble,
  ChatMessageActions,
  ChatMessageMeta,
  ChatMessageTyping,
} from "./components";

/**
 * ChatMessage
 * ============================================================
 * A compound component representing a single message in an AI chat feed.
 * It provides a bubble container, an avatar, and layout-only slots that
 * consumers fill with their own content: actions inside the bubble, a meta
 * below it, and a typing indicator for streaming replies. The `sender` prop
 * drives the layout direction and sender-specific styling, and `tone` flags a
 * failed generation.
 *
 * ChatMessage renders a single message; composing the surrounding feed and any
 * live region is the consumer's job — see the accessibility documentation.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/chat-message}
 *
 * @example
 * ```tsx
 * <ChatMessage.Root sender="agent">
 *   <ChatMessage.Avatar>
 *     <AutoAwesome />
 *   </ChatMessage.Avatar>
 *   <ChatMessage.Bubble>
 *     <Text>Here is the summary you asked for.</Text>
 *     <ChatMessage.Actions>
 *       <Button variant="outline">Save as draft</Button>
 *       <Button variant="solid">Approve</Button>
 *     </ChatMessage.Actions>
 *   </ChatMessage.Bubble>
 *   <ChatMessage.Meta>
 *     <Link>How was this generated?</Link>
 *     <Text>Apr 13, 11:56pm</Text>
 *   </ChatMessage.Meta>
 * </ChatMessage.Root>
 * ```
 */
export const ChatMessage = {
  /**
   * # ChatMessage.Root
   *
   * The grid container for a single message. Establishes the styling context
   * and lays out the avatar, bubble and optional meta row. Accepts `sender`
   * (`"user" | "agent"`) which controls layout direction
   * and styling, `tone` (`"neutral" | "error"`) to flag a failed generation,
   * and `isStreaming` to mark the message as still generating (sets
   * `aria-busy`). Renders a semantic `<article>` by default; override with `as`.
   *
   * @example
   * ```tsx
   * <ChatMessage.Root sender="user" aria-label="Message from Ada Lovelace">
   *   <ChatMessage.Avatar firstName="Ada" lastName="Lovelace" />
   *   <ChatMessage.Bubble>
   *     <Text>Can you summarise this order?</Text>
   *   </ChatMessage.Bubble>
   * </ChatMessage.Root>
   * ```
   */
  Root: ChatMessageRoot,
  /**
   * # ChatMessage.Avatar
   *
   * The sender's avatar. Wraps the Nimbus `Avatar` (defaulting to `size="xs"`)
   * and is styled per `sender`. Provide the content via `firstName`/`lastName`
   * (initials), `src` (image), or `children` (a custom icon). Decorative by
   * default (`aria-hidden`) unless named.
   *
   * @example
   * ```tsx
   * <ChatMessage.Avatar>
   *   <AutoAwesome />
   * </ChatMessage.Avatar>
   * ```
   */
  Avatar: ChatMessageAvatar,
  /**
   * # ChatMessage.Bubble
   *
   * The rounded card that holds the message payload. Stacks its children
   * vertically; place `ChatMessage.Actions` last to pin actions to the bottom.
   * Long, unbreakable content wraps inside the card.
   *
   * @example
   * ```tsx
   * <ChatMessage.Bubble>
   *   <Text>Message content</Text>
   * </ChatMessage.Bubble>
   * ```
   */
  Bubble: ChatMessageBubble,
  /**
   * # ChatMessage.Actions
   *
   * A layout-only, right-aligned row for action buttons, rendered inside the
   * bubble. Consumers provide the buttons.
   *
   * @example
   * ```tsx
   * <ChatMessage.Actions>
   *   <Button variant="outline">Dismiss</Button>
   *   <Button variant="solid">Approve</Button>
   * </ChatMessage.Actions>
   * ```
   */
  Actions: ChatMessageActions,
  /**
   * # ChatMessage.Meta
   *
   * A layout-only `space-between` row rendered below the bubble. Consumers
   * provide the content (timestamp, trust affordances, reaction icons, links).
   *
   * @example
   * ```tsx
   * <ChatMessage.Meta>
   *   <Link>How was this generated?</Link>
   *   <Text>Apr 13, 11:56pm</Text>
   * </ChatMessage.Meta>
   * ```
   */
  Meta: ChatMessageMeta,
  /**
   * # ChatMessage.Typing
   *
   * An animated "generating…" indicator (Nimbus `ActivityIndicator`) for a
   * streaming reply. Render it as the bubble's payload while the response
   * streams; pass a visible label as `children` for a per-message affordance.
   *
   * @example
   * ```tsx
   * <ChatMessage.Root sender="agent" isStreaming>
   *   <ChatMessage.Avatar>
   *     <AutoAwesome />
   *   </ChatMessage.Avatar>
   *   <ChatMessage.Bubble>
   *     <ChatMessage.Typing>Assistant is typing…</ChatMessage.Typing>
   *   </ChatMessage.Bubble>
   * </ChatMessage.Root>
   * ```
   */
  Typing: ChatMessageTyping,
};

export {
  ChatMessageRoot as _ChatMessageRoot,
  ChatMessageAvatar as _ChatMessageAvatar,
  ChatMessageBubble as _ChatMessageBubble,
  ChatMessageActions as _ChatMessageActions,
  ChatMessageMeta as _ChatMessageMeta,
  ChatMessageTyping as _ChatMessageTyping,
};
