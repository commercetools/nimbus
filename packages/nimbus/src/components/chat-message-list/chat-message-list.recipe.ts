import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ChatMessageList compound component.
 *
 * `ChatMessageList` presents a scrollable sequence of chat messages. The slots
 * mirror the component's seams:
 *
 * - `root` — the positioned container. It is the anchor for the floating
 *   "jump to latest" control (`position: relative`) and establishes the height
 *   context the interior `ScrollArea` scrolls within.
 * - `viewport` — the vertical flow that holds the items. It owns the transcript
 *   rhythm (the inter-item gap) and horizontal padding; it is rendered *inside*
 *   the `ScrollArea`, so it is the content that scrolls.
 * - `item` — one list member (the socket that holds a `ChatMessage` or any
 *   other content).
 * - `scrollToBottom` — the absolutely-positioned control shown while the
 *   stick-to-bottom pin is released.
 * - `empty` — the centered empty-state shown when there are no items.
 *
 * The `ScrollArea` (an already-registered Nimbus component) owns the scrollbar
 * styling, so this recipe deliberately does not re-style scrollbars.
 */
export const chatMessageListSlotRecipe = defineSlotRecipe({
  slots: ["root", "viewport", "item", "scrollToBottom", "empty"],

  className: "nimbus-chat-message-list",

  base: {
    root: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      // Bound the scroll: the list fills the height its consumer gives it and
      // scrolls internally rather than growing the page. `minHeight: 0` lets it
      // shrink inside a flex parent so the interior ScrollArea can scroll.
      minHeight: "0",
      width: "100%",
    },
    viewport: {
      display: "flex",
      flexDirection: "column",
      // The transcript rhythm — the space between consecutive members.
      gap: "600",
      width: "100%",
      px: "400",
      py: "600",
    },
    item: {
      // The membership socket: a block in the scroll flow. Content-agnostic —
      // it does not know whether it holds a message or a notice.
      display: "block",
      width: "100%",
    },
    scrollToBottom: {
      position: "absolute",
      bottom: "400",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "1",
      borderRadius: "full",
      boxShadow: "5",
    },
    empty: {
      display: "flex",
      flex: "1",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "200",
      minHeight: "0",
      px: "600",
      py: "800",
      color: "neutral.11",
      textAlign: "center",
    },
  },
});
