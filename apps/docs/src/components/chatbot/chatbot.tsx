import { Box, Button, Code, Flex, Link, Stack, Text } from "@bleh-ui/react";
import { MessageCircleCode, SendHorizontal, X } from "@bleh-ui/icons";
import { type Message, useChat } from "ai/react";
import { useState } from "react";
import { MdxStringRenderer } from "@/components/document-renderer/mdx-string-renderer.tsx";
import { components } from "@/components/document-renderer/components";

const Message = ({ item }: { item: Message }) => {
  const align = item.role === "user" ? "flex-end" : "flex-start";
  const palette = item.role === "user" ? "neutral" : "primary";

  return (
    <Flex colorPalette={palette} justifyContent={align}>
      <Text
        as="div"
        bg="colorPalette.3"
        maxWidth="10/12"
        px="400"
        color="colorPalette.12"
        textStyle="md"
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
        bottom="400"
        right="400"
        boxShadow="2xl"
        bg="neutral.1"
        mb="400"
        mr="400"
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
      bottom="400"
      right="400"
      boxShadow="2xl"
      bg="neutral.1"
    >
      <Box width="breakpoint-sm">
        <Flex direction="column" divideY="1px" overflow="hidden">
          <Flex colorPalette="primary" bg="colorPalette.9" alignItems="center">
            <Text fontWeight="600" color="colorPalette.contrast" p="400">
              Ask AI
            </Text>
            <Box flexGrow="1" />
            <Button
              variant="solid"
              size="md"
              mr="200"
              onClick={() => setChatOpen(false)}
            >
              <X />
            </Button>
          </Flex>
          <Box colorPalette="neutral" minHeight="xs" bg="colorPalette.2">
            <Stack minHeight="xs" maxHeight="xl" overflow="auto" p="400">
              {messages.length === 0 && (
                <>
                  <Text
                    p="400"
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
                    p="400"
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
              <Box
                asChild
                border="solid-25"
                borderColor="neutral.6"
                p="200"
                fontSize="350"
                color="neutral.11"
                w="full"
                h={input.length === 0 ? "10" : undefined}
              >
                <textarea
                  placeholder="Type your instructions here..."
                  onChange={handleInputChange}
                  value={input}
                />
              </Box>

              <Button
                colorPalette="primary"
                variant="solid"
                onPress={() => handleSubmit()}
              >
                <SendHorizontal />
              </Button>
            </form>
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
};
