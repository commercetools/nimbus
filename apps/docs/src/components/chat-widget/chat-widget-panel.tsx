import { useState } from "react";
import {
  Box,
  ChatMessageList,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  TextInput,
} from "@commercetools/nimbus";
import { Close, Send } from "@commercetools/nimbus-icons";
import { ChatWidgetMessage } from "./chat-widget-message";
import { useChatWidget } from "./use-chat-widget";

const SIDEBAR_WIDTH = "640px";

export function ChatWidgetPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { messages, isSending, sendMessage } = useChatWidget();
  const [draft, setDraft] = useState("");

  // Chakra's `as="form"` doesn't retype the JSX handler prop (Box's onSubmit
  // stays bound to its base div element type), so this takes only the one
  // thing it uses rather than naming a mismatched/deprecated event type.
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!draft.trim() || isSending) return;
    void sendMessage(draft);
    setDraft("");
  };

  return (
    // A fixed, full-viewport, click-through frame that clips the sliding
    // sidebar below. Without it, sliding the sidebar to `translateX(100%)`
    // can still register as extra scrollable page width in some browsers —
    // the same "position:fixed content wider than the viewport quietly adds
    // horizontal scroll" gotcha that affects any off-canvas panel — even
    // though the sidebar itself is fully out of view. `overflow="hidden"`
    // here guarantees it never does, on every route, since this widget is
    // mounted once at the app root.
    <Box
      position="fixed"
      inset="0"
      overflow="hidden"
      pointerEvents="none"
      zIndex="banner"
    >
      <Box
        position="absolute"
        top="0"
        right="0"
        bottom="0"
        width={SIDEBAR_WIDTH}
        maxWidth="100vw"
        borderLeft="solid-25"
        borderColor="neutral.4"
        bg="neutral.1"
        boxShadow="6"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        // Collapsible sidebar: always mounted (so it can animate) and slid
        // fully off-screen via `transform` rather than unmounted — that's
        // what makes this a *collapsible* sidebar rather than a show/hide
        // panel.
        transform={isOpen ? "translateX(0)" : "translateX(100%)"}
        transitionProperty="transform"
        transitionDuration="moderate"
        // While collapsed: out of the a11y tree and tab order (`aria-hidden`
        // + `inert`), and clicks pass through to whatever's underneath —
        // belt-and-suspenders for older browsers that honor one but not the
        // other.
        aria-hidden={!isOpen}
        inert={!isOpen}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <Flex
          align="center"
          justify="space-between"
          px="400"
          py="300"
          borderBottom="solid-25"
          borderColor="neutral.4"
        >
          <Heading size="sm" color="neutral.12">
            Ask about your data
          </Heading>
          <IconButton
            aria-label="Close chat"
            size="xs"
            variant="ghost"
            onPress={onClose}
          >
            <Close />
          </IconButton>
        </Flex>

        <Box flex="1" minHeight="0">
          <ChatMessageList.Root
            aria-label="Conversation with the mock commerce-analytics assistant"
            height="full"
            p="0"
            emptyState={
              <Stack gap="100" textAlign="center" color="neutral.11" px="400">
                <Text fontWeight="500">Ask a commerce-analytics question</Text>
                <Text textStyle="sm">
                  e.g. “how has weekly revenue trended lately?” — every answer
                  is synthetic demo data, resolved into a live nimbus-viz chart.
                </Text>
              </Stack>
            }
          >
            {messages.map((message) => (
              <ChatMessageList.Item px="400" py="300" key={message.id}>
                <ChatWidgetMessage message={message} />
              </ChatMessageList.Item>
            ))}
          </ChatMessageList.Root>
        </Box>

        <Box
          as="form"
          onSubmit={handleSubmit}
          borderTop="solid-25"
          borderColor="neutral.4"
          p="300"
        >
          <Flex gap="150">
            <TextInput
              aria-label="Your question"
              placeholder="Ask a question…"
              value={draft}
              onChange={setDraft}
              isDisabled={isSending}
              width="full"
            />
            <IconButton
              aria-label="Send"
              type="submit"
              isDisabled={isSending || !draft.trim()}
            >
              <Send />
            </IconButton>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
