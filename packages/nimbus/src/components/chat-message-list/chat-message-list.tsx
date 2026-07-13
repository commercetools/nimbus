import { ChatMessageListRoot, ChatMessageListItem } from "./components";

/**
 * ChatMessageList
 * ============================================================
 * A compound component that presents a **scrollable sequence of chat messages**
 * and owns transcript-level scroll and announcement behavior. It is the second
 * primitive in the `Chat*` family: `ChatMessage` renders one message,
 * `ChatMessageList` arranges many into a conversation.
 *
 * A list is defined by its items, so `ChatMessageList` is a compound of a
 * `Root` and its `Item`s — not a box that happens to contain children. The
 * `Item` is the list-membership socket; a `ChatMessage` (or `ChatNotice`) is
 * what plugs into it.
 *
 * `Root` wraps the Nimbus `ScrollArea`, owns autoscroll / stick-to-bottom and
 * the "jump to latest" affordance, and is the single persistent
 * `role="log"` `aria-live="polite"` region that announces appended and streamed
 * replies — the counterpart to `ChatMessage`'s `isStreaming` busy flag.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/chat-message-list}
 *
 * @example
 * ```tsx
 * <ChatMessageList.Root aria-label="Conversation with the assistant">
 *   <ChatMessageList.Item>
 *     <ChatMessage.Root sender="user">
 *       <ChatMessage.Body><Text>Summarise last week's orders?</Text></ChatMessage.Body>
 *     </ChatMessage.Root>
 *   </ChatMessageList.Item>
 *   <ChatMessageList.Item>
 *     <ChatNotice>Conversation history was cleared.</ChatNotice>
 *   </ChatMessageList.Item>
 * </ChatMessageList.Root>
 * ```
 */
export const ChatMessageList = {
  /**
   * # ChatMessageList.Root
   *
   * The scrollable transcript container. Wraps `ScrollArea`, owns autoscroll /
   * stick-to-bottom, the scroll-to-bottom control, and the transcript's single
   * `role="log"` `aria-live="polite"` region. Renders `emptyState` when there
   * are no items. Accepts `autoScroll` (default `true`) and exposes an
   * imperative `scrollToBottom()` via `ref`.
   *
   * @example
   * ```tsx
   * <ChatMessageList.Root aria-label="Conversation" autoScroll>
   *   <ChatMessageList.Item>…</ChatMessageList.Item>
   * </ChatMessageList.Root>
   * ```
   */
  Root: ChatMessageListRoot,
  /**
   * # ChatMessageList.Item
   *
   * One member of the transcript — the socket that owns inter-item placement
   * and entry presentation. Content-agnostic: it holds a `ChatMessage` or a
   * `ChatNotice`. Does not assert `role="listitem"` (which would conflict with
   * the `log` container).
   *
   * @example
   * ```tsx
   * <ChatMessageList.Item>
   *   <ChatMessage.Root sender="assistant">…</ChatMessage.Root>
   * </ChatMessageList.Item>
   * ```
   */
  Item: ChatMessageListItem,
};

export {
  ChatMessageListRoot as _ChatMessageListRoot,
  ChatMessageListItem as _ChatMessageListItem,
};
