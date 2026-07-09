import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChatBubble,
  type ChatBubbleProps,
  Text,
  Button,
  Link,
  IconButton,
  Stack,
  Box,
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

    await step("Root is a semantic article by default", async () => {
      await expect(root.tagName.toLowerCase()).toBe("article");
      await expect(canvas.getByRole("article")).toBe(root);
    });

    await step("Decorative agent avatar is hidden from AT", async () => {
      // The AutoAwesome sender glyph must not leak a misleading generic
      // "avatar" label into the accessibility tree.
      await expect(canvas.queryByLabelText(/avatar/i)).not.toBeInTheDocument();
    });
  },
};

/**
 * User message
 * A user bubble: avatar trails the bubble, `iris.3` background. Naming the
 * message with `aria-label` opts the avatar back into the a11y tree.
 */
export const UserText: Story = {
  render: () => (
    <ChatBubble.Root
      sender="user"
      data-testid="user-bubble"
      aria-label="Message from Ada Lovelace"
    >
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

    await step("Message is named for assistive tech", async () => {
      await expect(
        canvas.getByRole("article", { name: "Message from Ada Lovelace" })
      ).toBeInTheDocument();
    });

    await step("Named avatar is exposed with its real name", async () => {
      await expect(
        canvas.getByLabelText("Avatar image for Ada Lovelace")
      ).toBeInTheDocument();
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
 * With footer
 * A footer row is rendered below the bubble: a trust link on the left,
 * timestamp and reaction icons on the right.
 */
export const AgentWithFooter: Story = {
  render: () => (
    <ChatBubble.Root sender="agent" data-testid="agent-footer">
      <ChatBubble.Avatar>
        <AutoAwesome />
      </ChatBubble.Avatar>
      <ChatBubble.Bubble>
        <Text>{SAMPLE_MESSAGE}</Text>
      </ChatBubble.Bubble>
      <ChatBubble.Footer>
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
      </ChatBubble.Footer>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the footer affordances", async () => {
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
 * into Nimbus-styled elements, plus actions and footer.
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
      <ChatBubble.Footer>
        <Link href="#">How was this generated?</Link>
        <Text color="neutral.11">Apr 13, 11:56pm</Text>
      </ChatBubble.Footer>
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
 * Long / unbreakable content
 * A bare URL and a long inline-code token must wrap inside the bubble rather
 * than overflowing its rounded card (and pushing horizontal page scroll).
 */
export const Overflow: Story = {
  render: () => (
    <ChatBubble.Root sender="agent">
      <ChatBubble.Avatar>
        <AutoAwesome />
      </ChatBubble.Avatar>
      <ChatBubble.Bubble data-testid="overflow-bubble">
        <Text>
          Reference:
          https://example.com/very/long/path/that/should/wrap?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aVeryLongUnbrokenIdentifierWithNoSpacesAtAll
        </Text>
      </ChatBubble.Bubble>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const bubble = canvas.getByTestId("overflow-bubble");

    await step("Content wraps inside the bubble (no overflow)", async () => {
      // If the long token overflowed, scrollWidth would exceed clientWidth.
      await expect(bubble.scrollWidth).toBeLessThanOrEqual(
        bubble.clientWidth + 1
      );
    });
  },
};

/**
 * System message
 * A centered, subdued, avatar-less notice.
 */
export const SystemMessage: Story = {
  render: () => (
    <ChatBubble.Root sender="system" data-testid="system-bubble">
      <ChatBubble.Bubble>
        <Text>Conversation history was cleared.</Text>
      </ChatBubble.Bubble>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the system notice", async () => {
      await expect(canvas.getByTestId("system-bubble")).toHaveTextContent(
        "Conversation history was cleared."
      );
    });
  },
};

/**
 * Tool message
 * Tool / function-call output on a subdued neutral surface, agent-side.
 */
export const ToolMessage: Story = {
  render: () => (
    <ChatBubble.Root sender="tool" data-testid="tool-bubble">
      <ChatBubble.Avatar>
        <AutoAwesome />
      </ChatBubble.Avatar>
      <ChatBubble.Bubble>
        <Markdown>
          {["```json", '{ "orders": 42, "revenue": 12890 }', "```"].join("\n")}
        </Markdown>
      </ChatBubble.Bubble>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the tool output", async () => {
      await expect(canvas.getByTestId("tool-bubble")).toHaveTextContent(
        "revenue"
      );
    });
  },
};

/**
 * Error tone
 * `tone="error"` tints the bubble to flag a failed generation, on top of any
 * sender (here an agent message).
 */
export const ErrorTone: Story = {
  render: () => (
    <ChatBubble.Root sender="agent" tone="error" data-testid="error-bubble">
      <ChatBubble.Avatar>
        <AutoAwesome />
      </ChatBubble.Avatar>
      <ChatBubble.Bubble>
        <Text>Something went wrong generating this response.</Text>
        <ChatBubble.Actions>
          <Button variant="outline" colorPalette="primary">
            Retry
          </Button>
        </ChatBubble.Actions>
      </ChatBubble.Bubble>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the error message and retry", async () => {
      await expect(canvas.getByTestId("error-bubble")).toHaveTextContent(
        "Something went wrong"
      );
      await expect(
        canvas.getByRole("button", { name: "Retry" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * Streaming
 * While a reply generates, render `ChatBubble.Typing` as the payload and set
 * `isStreaming` on the root (which sets `aria-busy`).
 */
export const Streaming: Story = {
  render: () => (
    <ChatBubble.Root sender="agent" isStreaming data-testid="streaming-bubble">
      <ChatBubble.Avatar>
        <AutoAwesome />
      </ChatBubble.Avatar>
      <ChatBubble.Bubble>
        <ChatBubble.Typing>
          <Text color="neutral.11">Assistant is typing…</Text>
        </ChatBubble.Typing>
      </ChatBubble.Bubble>
    </ChatBubble.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("streaming-bubble");

    await step("Root reports a busy state to assistive tech", async () => {
      await expect(root).toHaveAttribute("aria-busy", "true");
    });

    await step("Shows a visible typing affordance", async () => {
      await expect(
        canvas.getByText("Assistant is typing…")
      ).toBeInTheDocument();
    });
  },
};

/**
 * Senders side by side
 * Compares the layout directions and sender styling.
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
      <ChatBubble.Root sender="tool">
        <ChatBubble.Avatar>
          <AutoAwesome />
        </ChatBubble.Avatar>
        <ChatBubble.Bubble>
          <Text>Tool output</Text>
        </ChatBubble.Bubble>
      </ChatBubble.Root>
      <ChatBubble.Root sender="system">
        <ChatBubble.Bubble>
          <Text>System notice</Text>
        </ChatBubble.Bubble>
      </ChatBubble.Root>
    </Stack>
  ),
};

/**
 * Accessible message log (recommended composition)
 * ChatBubble renders one message; the consumer composes the transcript. A
 * `role="log"` `aria-live="polite"` container of `<article>` messages — each
 * named for assistive tech — is the recommended pattern for an assistant chat:
 * it is a live region (so streamed replies are announced without per-token
 * spam) and, unlike `role="feed"`, it validly contains non-article children.
 */
export const AccessibleFeed: Story = {
  render: () => (
    <Box
      role="log"
      aria-live="polite"
      aria-label="Conversation with the assistant"
      display="flex"
      flexDirection="column"
      gap="600"
      data-testid="feed"
    >
      <ChatBubble.Root sender="user" aria-label="Message from Ada Lovelace">
        <ChatBubble.Avatar firstName="Ada" lastName="Lovelace" />
        <ChatBubble.Bubble>
          <Text>Can you summarise last week's orders?</Text>
        </ChatBubble.Bubble>
      </ChatBubble.Root>

      <ChatBubble.Root sender="agent" aria-label="Message from the assistant">
        <ChatBubble.Avatar aria-label="Assistant">
          <AutoAwesome />
        </ChatBubble.Avatar>
        <ChatBubble.Bubble>
          <Text>Revenue is up 12% week-over-week.</Text>
        </ChatBubble.Bubble>
      </ChatBubble.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Transcript is a polite live region", async () => {
      const log = canvas.getByRole("log");
      await expect(log).toHaveAttribute("aria-live", "polite");
    });

    await step("Each message is a named article", async () => {
      await expect(
        canvas.getByRole("article", { name: "Message from Ada Lovelace" })
      ).toBeInTheDocument();
      await expect(
        canvas.getByRole("article", { name: "Message from the assistant" })
      ).toBeInTheDocument();
    });
  },
};
