import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChatMessage,
  ChatNotice,
  type ChatMessageProps,
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

const meta: Meta<typeof ChatMessage.Root> = {
  title: "Components/ChatMessage",
  component: ChatMessage.Root,
};

export default meta;

type Story = StoryObj<typeof ChatMessage.Root>;

/**
 * Base
 * The default (assistant) body with a single text payload.
 */
export const Base: Story = {
  args: {
    sender: "assistant",
    "data-testid": "chat-message",
  },
  render: (args: ChatMessageProps) => (
    <ChatMessage.Root {...args}>
      <ChatMessage.Avatar>
        <AutoAwesome />
      </ChatMessage.Avatar>
      <ChatMessage.Body>
        <Text>{SAMPLE_MESSAGE}</Text>
      </ChatMessage.Body>
    </ChatMessage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("chat-message");

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

    await step("Decorative assistant avatar is hidden from AT", async () => {
      // The AutoAwesome sender glyph must not leak a misleading generic
      // "avatar" label into the accessibility tree.
      await expect(canvas.queryByLabelText(/avatar/i)).not.toBeInTheDocument();
    });
  },
};

/**
 * User message
 * A user body: avatar trails the body, `primary.3` background. Naming the
 * message with `aria-label` opts the avatar back into the a11y tree.
 */
export const UserText: Story = {
  render: () => (
    <ChatMessage.Root
      sender="user"
      data-testid="user-body"
      aria-label="Message from Ada Lovelace"
    >
      <ChatMessage.Avatar firstName="Ada" lastName="Lovelace" />
      <ChatMessage.Body>
        <Text>Can you summarise last week's orders for me?</Text>
      </ChatMessage.Body>
    </ChatMessage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the user's message", async () => {
      await expect(canvas.getByTestId("user-body")).toHaveTextContent(
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
 * Assistant message
 * An assistant body with a single text payload.
 */
export const AgentText: Story = {
  render: () => (
    <ChatMessage.Root sender="assistant" data-testid="assistant-body">
      <ChatMessage.Avatar>
        <AutoAwesome />
      </ChatMessage.Avatar>
      <ChatMessage.Body>
        <Text>{SAMPLE_MESSAGE}</Text>
      </ChatMessage.Body>
    </ChatMessage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the assistant's message", async () => {
      await expect(canvas.getByTestId("assistant-body")).toHaveTextContent(
        "Lorem ipsum"
      );
    });
  },
};

/**
 * With actions
 * Action buttons sit inside the body, right-aligned at the bottom.
 */
export const AgentWithActions: Story = {
  render: () => (
    <ChatMessage.Root sender="assistant" data-testid="assistant-actions">
      <ChatMessage.Avatar>
        <AutoAwesome />
      </ChatMessage.Avatar>
      <ChatMessage.Body>
        <Text>I drafted the date range for your report. Approve to apply.</Text>
        <ChatMessage.Actions>
          <Button variant="outline" colorPalette="primary">
            Save as draft
          </Button>
          <Button variant="solid" colorPalette="primary">
            Approve
          </Button>
        </ChatMessage.Actions>
      </ChatMessage.Body>
    </ChatMessage.Root>
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
 * With meta
 * A meta row is rendered below the body: a trust link on the left,
 * timestamp and reaction icons on the right.
 */
export const AgentWithMeta: Story = {
  render: () => (
    <ChatMessage.Root sender="assistant" data-testid="assistant-meta">
      <ChatMessage.Avatar>
        <AutoAwesome />
      </ChatMessage.Avatar>
      <ChatMessage.Body>
        <Text>{SAMPLE_MESSAGE}</Text>
      </ChatMessage.Body>
      <ChatMessage.Meta>
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
      </ChatMessage.Meta>
    </ChatMessage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the meta affordances", async () => {
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
 * The body payload is arbitrary content — here a `Markdown` string rendered
 * into Nimbus-styled elements, plus actions and meta.
 */
export const AgentWithMarkdown: Story = {
  render: () => (
    <ChatMessage.Root sender="assistant" data-testid="assistant-markdown">
      <ChatMessage.Avatar>
        <AutoAwesome />
      </ChatMessage.Avatar>
      <ChatMessage.Body>
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
        <ChatMessage.Actions>
          <Button variant="solid" colorPalette="primary">
            Approve
          </Button>
        </ChatMessage.Actions>
      </ChatMessage.Body>
      <ChatMessage.Meta>
        <Link href="#">How was this generated?</Link>
        <Text color="neutral.11">Apr 13, 11:56pm</Text>
      </ChatMessage.Meta>
    </ChatMessage.Root>
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
 * A bare URL and a long inline-code token must wrap inside the body rather
 * than overflowing its rounded card (and pushing horizontal page scroll).
 */
export const Overflow: Story = {
  render: () => (
    <ChatMessage.Root sender="assistant">
      <ChatMessage.Avatar>
        <AutoAwesome />
      </ChatMessage.Avatar>
      <ChatMessage.Body data-testid="overflow-body">
        <Text>
          Reference:
          https://example.com/very/long/path/that/should/wrap?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.aVeryLongUnbrokenIdentifierWithNoSpacesAtAll
        </Text>
      </ChatMessage.Body>
    </ChatMessage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const body = canvas.getByTestId("overflow-body");

    await step("Content wraps inside the body (no overflow)", async () => {
      // If the long token overflowed, scrollWidth would exceed clientWidth.
      await expect(body.scrollWidth).toBeLessThanOrEqual(body.clientWidth + 1);
    });
  },
};

/**
 * System notice
 * A centered, subdued, avatar-less interjection. `ChatNotice` is a peer of
 * `ChatMessage`, not a sender variant — its presentation is the opposite of a
 * message.
 */
export const SystemNotice: Story = {
  render: () => (
    <ChatNotice data-testid="system-notice">
      Conversation history was cleared.
    </ChatNotice>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the system notice", async () => {
      await expect(canvas.getByTestId("system-notice")).toHaveTextContent(
        "Conversation history was cleared."
      );
    });
  },
};

/**
 * Tool output as assistant content
 * Tool / function-call output is content *inside* an `assistant` message (here a
 * JSON code block via `Markdown`) — not a distinct sender.
 */
export const ToolOutput: Story = {
  render: () => (
    <ChatMessage.Root sender="assistant" data-testid="tool-output">
      <ChatMessage.Avatar>
        <AutoAwesome />
      </ChatMessage.Avatar>
      <ChatMessage.Body>
        <Markdown>
          {["```json", '{ "orders": 42, "revenue": 12890 }', "```"].join("\n")}
        </Markdown>
      </ChatMessage.Body>
    </ChatMessage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the tool output", async () => {
      await expect(canvas.getByTestId("tool-output")).toHaveTextContent(
        "revenue"
      );
    });
  },
};

/**
 * Error tone
 * `tone="error"` tints the body to flag a failed generation, on top of any
 * sender (here an assistant message).
 */
export const ErrorTone: Story = {
  render: () => (
    <ChatMessage.Root sender="assistant" tone="error" data-testid="error-body">
      <ChatMessage.Avatar>
        <AutoAwesome />
      </ChatMessage.Avatar>
      <ChatMessage.Body>
        <Text>Something went wrong generating this response.</Text>
        <ChatMessage.Actions colorPalette="critical">
          <Button variant="solid">Retry</Button>
        </ChatMessage.Actions>
      </ChatMessage.Body>
    </ChatMessage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the error message and retry", async () => {
      await expect(canvas.getByTestId("error-body")).toHaveTextContent(
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
 * While a reply generates, render `ChatMessage.Typing` as the payload and set
 * `isStreaming` on the root (which sets `aria-busy`).
 */
export const Streaming: Story = {
  render: () => (
    <ChatMessage.Root
      sender="assistant"
      isStreaming
      data-testid="streaming-body"
    >
      <ChatMessage.Avatar>
        <AutoAwesome />
      </ChatMessage.Avatar>
      <ChatMessage.Body>
        <ChatMessage.Typing>
          <Text color="neutral.11">Assistant is typing…</Text>
        </ChatMessage.Typing>
      </ChatMessage.Body>
    </ChatMessage.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("streaming-body");

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
 * Compares the two sender layout directions, with a `ChatNotice` interjection
 * between turns.
 */
export const Senders: Story = {
  render: () => (
    <Stack gap="600">
      <ChatMessage.Root sender="user">
        <ChatMessage.Avatar firstName="Ada" lastName="Lovelace" />
        <ChatMessage.Body>
          <Text>Can you summarise last week's orders?</Text>
        </ChatMessage.Body>
      </ChatMessage.Root>
      <ChatNotice>Conversation history was cleared.</ChatNotice>
      <ChatMessage.Root sender="assistant">
        <ChatMessage.Avatar>
          <AutoAwesome />
        </ChatMessage.Avatar>
        <ChatMessage.Body>
          <Text>{SAMPLE_MESSAGE}</Text>
        </ChatMessage.Body>
      </ChatMessage.Root>
    </Stack>
  ),
};

/**
 * Accessible message log (recommended composition)
 * ChatMessage renders one message; the consumer composes the transcript. A
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
      <ChatMessage.Root sender="user" aria-label="Message from Ada Lovelace">
        <ChatMessage.Avatar firstName="Ada" lastName="Lovelace" />
        <ChatMessage.Body>
          <Text>Can you summarise last week's orders?</Text>
        </ChatMessage.Body>
      </ChatMessage.Root>

      <ChatMessage.Root
        sender="assistant"
        aria-label="Message from the assistant"
      >
        <ChatMessage.Avatar aria-label="Assistant">
          <AutoAwesome />
        </ChatMessage.Avatar>
        <ChatMessage.Body>
          <Text>Revenue is up 12% week-over-week.</Text>
        </ChatMessage.Body>
      </ChatMessage.Root>
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
