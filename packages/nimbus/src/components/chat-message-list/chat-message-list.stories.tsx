import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChatMessageList,
  ChatMessage,
  Text,
  Button,
  Stack,
  Box,
} from "@commercetools/nimbus";
import { AutoAwesome } from "@commercetools/nimbus-icons";
import { within, expect, waitFor, userEvent } from "storybook/test";

const SAMPLE =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Ut et massa mi. " +
  "Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla.";

/** The scroll viewport is the element that actually scrolls (ScrollArea's). */
const getViewport = (root: HTMLElement) =>
  root.querySelector('[data-part="viewport"]') as HTMLElement;

const distanceFromBottom = (el: HTMLElement) =>
  el.scrollHeight - el.scrollTop - el.clientHeight;

const meta: Meta<typeof ChatMessageList.Root> = {
  title: "Components/Chat/ChatMessageList",
  component: ChatMessageList.Root,
};

export default meta;

type Story = StoryObj<typeof ChatMessageList.Root>;

/**
 * Mixed transcript
 * A `ChatMessageList` arranges `Item`s that hold user and assistant
 * `ChatMessage`s — and any other content — into a scrollable, live transcript.
 * The list is content-agnostic: an `Item` can hold a `ChatMessage` or, as the
 * last item shows, a consumer-rendered notice (a plain centered box). The
 * members do not know they are inside a list.
 */
export const MixedTranscript: Story = {
  render: () => (
    <ChatMessageList.Root
      aria-label="Conversation with the assistant"
      height="360px"
      data-testid="list"
    >
      <ChatMessageList.Item>
        <ChatMessage.Root sender="user" aria-label="Message from Ada">
          <ChatMessage.Avatar firstName="Ada" lastName="Lovelace" />
          <ChatMessage.Body>
            <Text>Can you summarise last week's orders?</Text>
          </ChatMessage.Body>
        </ChatMessage.Root>
      </ChatMessageList.Item>

      <ChatMessageList.Item>
        <ChatMessage.Root
          sender="assistant"
          aria-label="Message from the assistant"
        >
          <ChatMessage.Avatar>
            <AutoAwesome />
          </ChatMessage.Avatar>
          <ChatMessage.Body>
            <Text>Revenue is up 12% week-over-week.</Text>
          </ChatMessage.Body>
        </ChatMessage.Root>
      </ChatMessageList.Item>

      <ChatMessageList.Item>
        {/* No dedicated notice component — a consumer renders their own
            centered, subdued content inside an Item. */}
        <Box mx="auto" textAlign="center" color="neutral.11" textStyle="sm">
          Conversation history was cleared.
        </Box>
      </ChatMessageList.Item>
    </ChatMessageList.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders every member as a vertical sequence", async () => {
      await expect(
        canvas.getByText("Can you summarise last week's orders?")
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("Revenue is up 12% week-over-week.")
      ).toBeInTheDocument();
      await expect(
        canvas.getByText("Conversation history was cleared.")
      ).toBeInTheDocument();
    });

    await step("Exposes a named log live region", async () => {
      const log = canvas.getByRole("log");
      await expect(log).toHaveAttribute("aria-live", "polite");
      await expect(log).toHaveAccessibleName("Conversation with the assistant");
    });
  },
};

/** A wrapper that appends messages on demand, for the autoscroll stories. */
const AppendableList = ({ autoScroll = true }: { autoScroll?: boolean }) => {
  const [count, setCount] = useState(4);
  return (
    <Stack gap="400" alignItems="start">
      <Button data-testid="send" onPress={() => setCount((c) => c + 1)}>
        Send message
      </Button>
      <ChatMessageList.Root
        aria-label="Conversation"
        autoScroll={autoScroll}
        height="240px"
        width="480px"
        data-testid="list"
      >
        {Array.from({ length: count }).map((_, i) => (
          <ChatMessageList.Item key={i}>
            <ChatMessage.Root sender={i % 2 === 0 ? "user" : "assistant"}>
              <ChatMessage.Body>
                <Text>
                  Message {i + 1}. {SAMPLE}
                </Text>
              </ChatMessage.Body>
            </ChatMessage.Root>
          </ChatMessageList.Item>
        ))}
      </ChatMessageList.Root>
    </Stack>
  );
};

/**
 * Autoscroll pins to newest
 * While the user is at the bottom, appending a message keeps the newest content
 * in view and no "jump to latest" control is shown.
 */
export const Autoscroll: Story = {
  render: () => <AppendableList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    const viewport = getViewport(list);

    await step("Starts pinned to the newest message", async () => {
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
    });

    await step("Stays pinned when a message is appended", async () => {
      await userEvent.click(canvas.getByTestId("send"));
      await userEvent.click(canvas.getByTestId("send"));
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
      // Pinned ⇒ no jump-to-latest control.
      await expect(
        canvas.queryByRole("button", { name: "Scroll to latest message" })
      ).not.toBeInTheDocument();
    });
  },
};

/**
 * Scroll up releases the pin
 * Scrolling up to read history releases the stick-to-bottom pin and reveals a
 * "jump to latest" control; activating it re-engages the pin.
 */
export const ReleaseOnScrollUp: Story = {
  render: () => <AppendableList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    const viewport = getViewport(list);

    await step("Pinned initially: no jump-to-latest control", async () => {
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
      await expect(
        canvas.queryByRole("button", { name: "Scroll to latest message" })
      ).not.toBeInTheDocument();
    });

    await step("Scrolling up reveals the jump-to-latest control", async () => {
      viewport.scrollTop = 0;
      viewport.dispatchEvent(new Event("scroll"));
      await waitFor(() =>
        expect(
          canvas.getByRole("button", { name: "Scroll to latest message" })
        ).toBeInTheDocument()
      );
    });

    await step("Activating it re-engages stick-to-bottom", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Scroll to latest message" })
      );
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
      await waitFor(() =>
        expect(
          canvas.queryByRole("button", { name: "Scroll to latest message" })
        ).not.toBeInTheDocument()
      );
    });
  },
};

/** A wrapper that grows the last message's text, simulating a streamed reply. */
const StreamingList = () => {
  const [len, setLen] = useState(1);
  const streamed = Array.from({ length: len })
    .map((_, i) => `Streamed sentence ${i + 1}. ${SAMPLE}`)
    .join(" ");
  return (
    <Stack gap="400" alignItems="start">
      <Button data-testid="grow" onPress={() => setLen((l) => l + 1)}>
        Stream more
      </Button>
      <ChatMessageList.Root
        aria-label="Conversation"
        height="240px"
        width="480px"
        data-testid="list"
      >
        <ChatMessageList.Item>
          <ChatMessage.Root sender="user">
            <ChatMessage.Body>
              <Text>Tell me a long story.</Text>
            </ChatMessage.Body>
          </ChatMessage.Root>
        </ChatMessageList.Item>
        <ChatMessageList.Item>
          <ChatMessage.Root sender="assistant" isStreaming>
            <ChatMessage.Body>
              <Text>{streamed}</Text>
            </ChatMessage.Body>
          </ChatMessage.Root>
        </ChatMessageList.Item>
      </ChatMessageList.Root>
    </Stack>
  );
};

/**
 * Autoscroll during streaming
 * As the last message grows (a streamed reply), a pinned view keeps following
 * the newest content.
 */
export const StreamingGrow: Story = {
  render: () => <StreamingList />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByTestId("list");
    const viewport = getViewport(list);

    await step("Follows the growing message while pinned", async () => {
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
      await userEvent.click(canvas.getByTestId("grow"));
      await userEvent.click(canvas.getByTestId("grow"));
      await userEvent.click(canvas.getByTestId("grow"));
      await waitFor(() =>
        expect(distanceFromBottom(viewport)).toBeLessThanOrEqual(33)
      );
    });
  },
};

/**
 * Empty state
 * With no items, the list renders its consumer-supplied `emptyState`.
 */
export const EmptyState: Story = {
  render: () => (
    <ChatMessageList.Root
      aria-label="Conversation"
      height="240px"
      width="480px"
      data-testid="list"
      emptyState={
        <Text data-testid="empty">
          No messages yet — ask the assistant anything to get started.
        </Text>
      }
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the empty-state content", async () => {
      await expect(canvas.getByTestId("empty")).toBeInTheDocument();
    });
  },
};
