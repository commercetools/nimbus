import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChatBubble,
  type ChatBubbleProps,
  Text,
  Button,
  Link,
  IconButton,
  Stack,
  Markdown,
} from "@commercetools/nimbus";
import {
  AutoAwesome,
  ThumbUp,
  ThumbDown,
  ContentCopy,
} from "@commercetools/nimbus-icons";
import { within, expect } from "storybook/test";

const SAMPLE_MESSAGE =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Ut et massa mi. " +
  "Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla.";

const meta: Meta<typeof ChatBubble.Root> = {
  title: "Components/ChatBubble",
  component: ChatBubble.Root,
};

export default meta;

type Story = StoryObj<typeof ChatBubble.Root>;

/**
 * Base
 * The default (agent) bubble with a single text payload.
 */
export const Base: Story = {
  args: {
    sender: "agent",
    "data-testid": "chat-bubble",
  },
  render: (args: ChatBubbleProps) => (
    <ChatBubble.Root {...args}>
      <ChatBubble.Avatar>
        <AutoAwesome />
      </ChatBubble.Avatar>
      <ChatBubble.Bubble>
        <Text>{SAMPLE_MESSAGE}</Text>
      </ChatBubble.Bubble>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("chat-bubble");

    await step("Renders the message content", async () => {
      await expect(root).toHaveTextContent(SAMPLE_MESSAGE);
    });

    await step("Root lays its parts out on a grid", async () => {
      await expect(window.getComputedStyle(root).display).toBe("grid");
    });
  },
};

/**
 * User message
 * A user bubble: avatar trails the bubble, `iris.3` background.
 */
export const UserText: Story = {
  render: () => (
    <ChatBubble.Root sender="user" data-testid="user-bubble">
      <ChatBubble.Avatar firstName="Ada" lastName="Lovelace" />
      <ChatBubble.Bubble>
        <Text>Can you summarise last week's orders for me?</Text>
      </ChatBubble.Bubble>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the user's message", async () => {
      await expect(canvas.getByTestId("user-bubble")).toHaveTextContent(
        "Can you summarise"
      );
    });
  },
};

/**
 * Agent message
 * An agent bubble with a single text payload.
 */
export const AgentText: Story = {
  render: () => (
    <ChatBubble.Root sender="agent" data-testid="agent-bubble">
      <ChatBubble.Avatar>
        <AutoAwesome />
      </ChatBubble.Avatar>
      <ChatBubble.Bubble>
        <Text>{SAMPLE_MESSAGE}</Text>
      </ChatBubble.Bubble>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the agent's message", async () => {
      await expect(canvas.getByTestId("agent-bubble")).toHaveTextContent(
        "Lorem ipsum"
      );
    });
  },
};

/**
 * With actions
 * Action buttons sit inside the bubble, right-aligned at the bottom.
 */
export const AgentWithActions: Story = {
  render: () => (
    <ChatBubble.Root sender="agent" data-testid="agent-actions">
      <ChatBubble.Avatar>
        <AutoAwesome />
      </ChatBubble.Avatar>
      <ChatBubble.Bubble>
        <Text>I drafted the date range for your report. Approve to apply.</Text>
        <ChatBubble.Actions>
          <Button variant="outline" colorPalette="primary">
            Save as draft
          </Button>
          <Button variant="solid" colorPalette="primary">
            Approve
          </Button>
        </ChatBubble.Actions>
      </ChatBubble.Bubble>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders both action buttons", async () => {
      await expect(
        canvas.getByRole("button", { name: "Save as draft" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: "Approve" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * With feedback
 * A feedback row is rendered below the bubble: a trust link on the left,
 * timestamp and reaction icons on the right.
 */
export const AgentWithFeedback: Story = {
  render: () => (
    <ChatBubble.Root sender="agent" data-testid="agent-feedback">
      <ChatBubble.Avatar>
        <AutoAwesome />
      </ChatBubble.Avatar>
      <ChatBubble.Bubble>
        <Text>{SAMPLE_MESSAGE}</Text>
      </ChatBubble.Bubble>
      <ChatBubble.Feedback>
        <Link href="#">How was this generated?</Link>
        <Stack direction="row" alignItems="center" gap="100">
          <Text color="neutral.11">Apr 13, 11:56pm</Text>
          <IconButton aria-label="Good response" variant="ghost" size="xs">
            <ThumbUp />
          </IconButton>
          <IconButton aria-label="Bad response" variant="ghost" size="xs">
            <ThumbDown />
          </IconButton>
          <IconButton aria-label="Copy" variant="ghost" size="xs">
            <ContentCopy />
          </IconButton>
        </Stack>
      </ChatBubble.Feedback>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the feedback affordances", async () => {
      await expect(
        canvas.getByRole("link", { name: "How was this generated?" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: "Good response" })
      ).toBeInTheDocument();
      await expect(canvas.getByText("Apr 13, 11:56pm")).toBeInTheDocument();
    });
  },
};

/**
 * With Markdown content
 * The bubble payload is arbitrary content — here a `Markdown` string rendered
 * into Nimbus-styled elements, plus actions and feedback.
 */
export const AgentWithMarkdown: Story = {
  render: () => (
    <ChatBubble.Root sender="agent" data-testid="agent-markdown">
      <ChatBubble.Avatar>
        <AutoAwesome />
      </ChatBubble.Avatar>
      <ChatBubble.Bubble>
        <Markdown>
          {[
            "Here's what I found:",
            "",
            "- **Revenue** is up 12% week-over-week",
            "- Top SKU: `ABC-123`",
            "",
            "See the [full report](#) for details.",
          ].join("\n")}
        </Markdown>
        <ChatBubble.Actions>
          <Button variant="solid" colorPalette="primary">
            Approve
          </Button>
        </ChatBubble.Actions>
      </ChatBubble.Bubble>
      <ChatBubble.Feedback>
        <Link href="#">How was this generated?</Link>
        <Text color="neutral.11">Apr 13, 11:56pm</Text>
      </ChatBubble.Feedback>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the Markdown payload", async () => {
      await expect(canvas.getByText("Revenue")).toBeInTheDocument();
      await expect(
        canvas.getByRole("link", { name: "full report" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * Senders side by side
 * Compares the two layout directions and sender styling.
 */
export const Senders: Story = {
  render: () => (
    <Stack gap="600">
      <ChatBubble.Root sender="user">
        <ChatBubble.Avatar firstName="Ada" lastName="Lovelace" />
        <ChatBubble.Bubble>
          <Text>Can you summarise last week's orders?</Text>
        </ChatBubble.Bubble>
      </ChatBubble.Root>
      <ChatBubble.Root sender="agent">
        <ChatBubble.Avatar>
          <AutoAwesome />
        </ChatBubble.Avatar>
        <ChatBubble.Bubble>
          <Text>{SAMPLE_MESSAGE}</Text>
        </ChatBubble.Bubble>
      </ChatBubble.Root>
    </Stack>
  ),
};
