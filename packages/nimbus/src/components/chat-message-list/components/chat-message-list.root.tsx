import { Children, useImperativeHandle } from "react";
import { KeyboardArrowDown } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { ScrollArea } from "../../scroll-area/scroll-area";
import { IconButton } from "../../icon-button/icon-button";
import {
  ChatMessageListRootSlot,
  ChatMessageListViewportSlot,
  ChatMessageListScrollToBottomSlot,
  ChatMessageListEmptySlot,
} from "../chat-message-list.slots";
import { useStickToBottom } from "../hooks";
import { chatMessageListMessagesStrings } from "../chat-message-list.messages";
import type { ChatMessageListRootProps } from "../chat-message-list.types";

/**
 * ChatMessageList.Root - The scrollable transcript container.
 *
 * Wraps the Nimbus `ScrollArea` for the viewport and owns transcript-level
 * behavior: autoscroll / stick-to-bottom (pins to the newest item while the
 * user is at the bottom, including during streaming, and releases when they
 * scroll up), the "jump to latest" affordance, and the single persistent
 * `role="log"` `aria-live="polite"` region that announces appended and streamed
 * messages. When there are no items it renders `emptyState`.
 *
 * The list is content-agnostic: its `Item`s hold a `ChatMessage` or any other
 * content and it never reaches into them. It renders one message's
 * announcement at the transcript level; the message itself only flags
 * `aria-busy` while streaming (see `ChatMessage`).
 *
 * @supportsStyleProps
 */
export const ChatMessageListRoot = (props: ChatMessageListRootProps) => {
  const {
    ref,
    children,
    autoScroll = true,
    emptyState,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...restProps
  } = props;

  const [styleProps, functionalProps] = extractStyleProps(restProps);
  const stringFormatter = useLocalizedStringFormatter(
    chatMessageListMessagesStrings
  );

  const { viewportRef, contentRef, isPinned, scrollToBottom } =
    useStickToBottom({
      enabled: autoScroll,
    });

  // Expose imperative scroll control on the ref (see ChatMessageListHandle).
  useImperativeHandle(ref, () => ({ scrollToBottom }), [scrollToBottom]);

  const hasItems = Children.toArray(children).length > 0;

  // Always name the live region: fall back to a localized label unless the
  // consumer named it themselves (via `aria-label` or `aria-labelledby`).
  const resolvedAriaLabel =
    ariaLabel ??
    (ariaLabelledBy ? undefined : stringFormatter.format("conversationLabel"));

  return (
    <ChatMessageListRootSlot {...styleProps} {...functionalProps}>
      <ScrollArea
        orientation="vertical"
        viewportRef={viewportRef}
        // The single, always-mounted live region for the transcript. `log`
        // (over `feed`) imposes no `aria-required-children`, so a mixed
        // transcript of message articles and notices is valid.
        role="log"
        aria-live="polite"
        aria-label={resolvedAriaLabel}
        aria-labelledby={ariaLabelledBy}
        flex="1"
        minH="0"
        height="100%"
      >
        {hasItems ? (
          <ChatMessageListViewportSlot ref={contentRef}>
            {children}
          </ChatMessageListViewportSlot>
        ) : (
          <ChatMessageListEmptySlot>{emptyState}</ChatMessageListEmptySlot>
        )}
      </ScrollArea>

      {autoScroll && !isPinned && (
        <ChatMessageListScrollToBottomSlot>
          <IconButton
            aria-label={stringFormatter.format("scrollToBottom")}
            variant="solid"
            colorPalette="primary"
            size="xs"
            onPress={() => {
              scrollToBottom("smooth");
              // Pinning re-engages and unmounts this button, which would drop
              // keyboard focus to <body>. Move focus to the scroll viewport (a
              // tab stop while the transcript overflows) so a keyboard/SR user
              // keeps their place. Deferred so it runs after the unmount;
              // `preventScroll` so focusing doesn't cancel the smooth scroll.
              setTimeout(
                () => viewportRef.current?.focus({ preventScroll: true }),
                0
              );
            }}
          >
            <KeyboardArrowDown />
          </IconButton>
        </ChatMessageListScrollToBottomSlot>
      )}
    </ChatMessageListRootSlot>
  );
};

ChatMessageListRoot.displayName = "ChatMessageList.Root";
