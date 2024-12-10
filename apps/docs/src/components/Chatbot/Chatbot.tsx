import {
  Box,
  Button,
  Code,
  Flex,
  Input,
  Link,
  Stack,
  Text,
} from "@bleh-ui/react";
import { MessageCircleCode, SendHorizontal, X } from "@bleh-ui/icons";
import { type Message, useChat } from "ai/react";
import { useState } from "react";
import { MdxStringRenderer } from "../DocumentRenderer/MdxStringRenderer";
import { components } from "@/components/DocumentRenderer/components";

const Message = ({ item }: { item: Message }) => {
  const align = item.role === "user" ? "flex-end" : "flex-start";
  const palette = item.role === "user" ? "neutral" : "primary";

  return (
    <Flex colorPalette={palette} justifyContent={align}>
      <Text
        as="div"
        bg="colorPalette.3"
        maxWidth="10/12"
        px="4"
        color="colorPalette.12"
        textStyle="md"
        rounded="md"
      >
        <MdxStringRenderer content={item.content} components={components} />
      </Text>
    </Flex>
  );
};

export const Chatbot = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  if (!chatOpen) {
    return (
      <Box
        position="fixed"
        rounded="sm"
        bottom="4"
        right="4"
        boxShadow="2xl"
        bg="neutral.1"
        mb="4"
        mr="4"
      >
        <Button
          colorPalette="primary"
          variant="solid"
          onClick={() => setChatOpen(true)}
        >
          <MessageCircleCode />
        </Button>
      </Box>
    );
  }

  return (
    <Box
      position="fixed"
      rounded="sm"
      bottom="4"
      right="4"
      boxShadow="2xl"
      bg="neutral.1"
    >
      <Box width="480px">
        <Flex direction="column" divideY="1px" rounded="md" overflow="hidden">
          <Flex colorPalette="primary" bg="colorPalette.9" alignItems="center">
            <Text fontWeight="semibold" color="colorPalette.contrast" p="4">
              Ask AI
            </Text>
            <Box flexGrow="1" />
            <Button
              variant="solid"
              size="md"
              mr="2"
              onClick={() => setChatOpen(false)}
            >
              <X />
            </Button>
          </Flex>
          <Box colorPalette="neutral" minHeight="xs" bg="colorPalette.2">
            <Stack minHeight="xs" maxHeight="xl" overflow="auto" p="4">
              {messages.length === 0 && (
                <>
                  <Text
                    p="4"
                    color="colorPalette.12"
                    colorPalette="primary"
                    bg="colorPalette.2"
                  >
                    Hi! I'm a helpful assistant. You can ask me anything,
                    provided the <Code>VITE_OPENAI_API_KEY</Code> environment
                    variable in <strong>apps/docs/.env</strong> contains a valid
                    OpenAI API key!
                  </Text>
                  <Text
                    p="4"
                    textStyle="sm"
                    color="colorPalette.11"
                    colorPalette="neutral"
                    bg="colorPalette.2"
                  >
                    <strong>TODO</strong>: Create an{" "}
                    <Link
                      target="_blank"
                      textDecoration="underline"
                      href="https://sdk.vercel.ai/docs/ai-sdk-ui/openai-assistants"
                    >
                      Open AI's Assistant
                    </Link>{" "}
                    so that we can ask it to generate pages, docs, code-examples
                    or answer questions.
                  </Text>
                </>
              )}
              {messages.map((message) => (
                <Message key={message.id} item={message} />
              ))}
            </Stack>
          </Box>

          <Stack p="4" direction="row" asChild>
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="Type a message"
                value={input}
                onChange={handleInputChange}
              />
              <Button colorPalette="primary" variant="solid">
                <SendHorizontal />
              </Button>
            </form>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
};
