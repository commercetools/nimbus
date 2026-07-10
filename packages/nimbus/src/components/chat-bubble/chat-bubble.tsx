import {
  ChatBubbleRoot,
  ChatBubbleAvatar,
  ChatBubbleBubble,
  ChatBubbleActions,
  ChatBubbleFooter,
  ChatBubbleTyping,
} from "./components";

/**
 * ChatBubble
 * ============================================================
 * A compound component representing a single message in an AI chat feed.
 * It provides a bubble container, an avatar, and layout-only slots that
 * consumers fill with their own content: actions inside the bubble, a footer
 * below it, and a typing indicator for streaming replies. The `sender` prop
 * drives the layout direction and sender-specific styling, and `tone` flags a
 * failed generation.
 *
 * ChatBubble renders a single message; composing the surrounding feed and any
 * live region is the consumer's job — see the accessibility documentation.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/chat-bubble}
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
 *   <ChatBubble.Footer>
 *     <Link>How was this generated?</Link>
 *     <Text>Apr 13, 11:56pm</Text>
 *   </ChatBubble.Footer>
 * </ChatBubble.Root>
 * ```
 */
export const ChatBubble = {
  /**
   * # ChatBubble.Root
   *
   * The grid container for a single message. Establishes the styling context
   * and lays out the avatar, bubble and optional footer row. Accepts `sender`
   * (`"user" | "agent" | "system" | "tool"`) which controls layout direction
   * and styling, `tone` (`"neutral" | "error"`) to flag a failed generation,
   * and `isStreaming` to mark the message as still generating (sets
   * `aria-busy`). Renders a semantic `<article>` by default; override with `as`.
   *
   * @example
   * ```tsx
   * <ChatBubble.Root sender="user" aria-label="Message from Ada Lovelace">
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
   * The sender's avatar. Wraps the Nimbus `Avatar` (defaulting to `size="xs"`)
   * and is styled per `sender`. Provide the content via `firstName`/`lastName`
   * (initials), `src` (image), or `children` (a custom icon). Decorative by
   * default (`aria-hidden`) unless named.
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
   * Long, unbreakable content wraps inside the card.
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
   * # ChatBubble.Footer
   *
   * A layout-only `space-between` row rendered below the bubble. Consumers
   * provide the content (timestamp, trust affordances, reaction icons, links).
   *
   * @example
   * ```tsx
   * <ChatBubble.Footer>
   *   <Link>How was this generated?</Link>
   *   <Text>Apr 13, 11:56pm</Text>
   * </ChatBubble.Footer>
   * ```
   */
  Footer: ChatBubbleFooter,
  /**
   * # ChatBubble.Typing
   *
   * An animated "generating…" indicator (Nimbus `ActivityIndicator`) for a
   * streaming reply. Render it as the bubble's payload while the response
   * streams; pass a visible label as `children` for a per-message affordance.
   *
   * @example
   * ```tsx
   * <ChatBubble.Root sender="agent" isStreaming>
   *   <ChatBubble.Avatar>
   *     <AutoAwesome />
   *   </ChatBubble.Avatar>
   *   <ChatBubble.Bubble>
   *     <ChatBubble.Typing>Assistant is typing…</ChatBubble.Typing>
   *   </ChatBubble.Bubble>
   * </ChatBubble.Root>
   * ```
   */
  Typing: ChatBubbleTyping,
};

export {
  ChatBubbleRoot as _ChatBubbleRoot,
  ChatBubbleAvatar as _ChatBubbleAvatar,
  ChatBubbleBubble as _ChatBubbleBubble,
  ChatBubbleActions as _ChatBubbleActions,
  ChatBubbleFooter as _ChatBubbleFooter,
  ChatBubbleTyping as _ChatBubbleTyping,
};
