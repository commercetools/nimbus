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

export function ChatWidgetPanel({ onClose }: { onClose: () => void }) {
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
    <Box
      position="fixed"
      bottom="1600"
      right="800"
      width="380px"
      maxWidth="calc(100vw - 32px)"
      height="520px"
      maxHeight="calc(100vh - 120px)"
      borderRadius="300"
      border="solid-25"
      borderColor="neutral.4"
      bg="neutral.1"
      boxShadow="6"
      zIndex="banner"
      display="flex"
      flexDirection="column"
      overflow="hidden"
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
          px="400"
          py="300"
          emptyState={
            <Stack gap="100" textAlign="center" color="neutral.11" px="400">
              <Text fontWeight="500">Ask a commerce-analytics question</Text>
              <Text textStyle="sm">
                e.g. “how has weekly revenue trended lately?” — every answer is
                synthetic demo data, resolved into a live nimbus-viz chart.
              </Text>
            </Stack>
          }
        >
          {messages.map((message) => (
            <ChatMessageList.Item key={message.id}>
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
  );
}
