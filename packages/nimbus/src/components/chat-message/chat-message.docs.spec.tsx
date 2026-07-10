import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ChatMessage,
  ChatNotice,
  NimbusProvider,
  Text,
  Button,
  Link,
  Box,
} from "@commercetools/nimbus";
import { AutoAwesome } from "@commercetools/nimbus-icons";

/**
 * @docs-section basic-rendering
 * @docs-title Basic rendering
 * @docs-description Compose a single agent message from the ChatMessage parts.
 * @docs-order 1
 */
describe("ChatMessage - Basic rendering", () => {
  it("renders an agent message as a semantic article", () => {
    render(
      <NimbusProvider>
        <ChatMessage.Root sender="agent" data-testid="bubble">
          <ChatMessage.Avatar>
            <AutoAwesome />
          </ChatMessage.Avatar>
          <ChatMessage.Bubble>
            <Text>Here is the summary you asked for.</Text>
          </ChatMessage.Bubble>
        </ChatMessage.Root>
      </NimbusProvider>
    );

    const bubble = screen.getByTestId("bubble");
    expect(bubble.tagName.toLowerCase()).toBe("article");
    expect(bubble).toHaveTextContent("Here is the summary you asked for.");
  });

  it("can override the rendered element via `as`", () => {
    render(
      <NimbusProvider>
        <Box as="ul">
          <ChatMessage.Root as="li" data-testid="bubble">
            <ChatMessage.Bubble>
              <Text>Item</Text>
            </ChatMessage.Bubble>
          </ChatMessage.Root>
        </Box>
      </NimbusProvider>
    );

    expect(screen.getByTestId("bubble").tagName.toLowerCase()).toBe("li");
  });
});

/**
 * @docs-section senders-and-tone
 * @docs-title Senders and tone
 * @docs-description Each sender lays out differently; `tone="error"` flags a failed generation.
 * @docs-order 2
 */
describe("ChatMessage - Senders and tone", () => {
  it.each(["user", "agent"] as const)("renders the %s sender", (sender) => {
    render(
      <NimbusProvider>
        <ChatMessage.Root sender={sender} data-testid="bubble">
          <ChatMessage.Bubble>
            <Text>{sender} message</Text>
          </ChatMessage.Bubble>
        </ChatMessage.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("bubble")).toHaveTextContent(`${sender} message`);
  });

  it("renders an error-toned agent message with a retry action", () => {
    render(
      <NimbusProvider>
        <ChatMessage.Root sender="agent" tone="error" data-testid="bubble">
          <ChatMessage.Bubble>
            <Text>Something went wrong.</Text>
            <ChatMessage.Actions>
              <Button variant="outline">Retry</Button>
            </ChatMessage.Actions>
          </ChatMessage.Bubble>
        </ChatMessage.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("bubble")).toHaveTextContent(
      "Something went wrong."
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});

/**
 * @docs-section actions-and-meta
 * @docs-title Actions and meta
 * @docs-description Actions sit inside the bubble; the meta sits below it.
 * @docs-order 3
 */
describe("ChatMessage - Actions and meta", () => {
  it("invokes an action button's handler", async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();

    render(
      <NimbusProvider>
        <ChatMessage.Root sender="agent">
          <ChatMessage.Bubble>
            <Text>Approve to apply.</Text>
            <ChatMessage.Actions>
              <Button variant="solid" onPress={onApprove}>
                Approve
              </Button>
            </ChatMessage.Actions>
          </ChatMessage.Bubble>
        </ChatMessage.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Approve" }));
    expect(onApprove).toHaveBeenCalledTimes(1);
  });

  it("renders meta content below the bubble", () => {
    render(
      <NimbusProvider>
        <ChatMessage.Root sender="agent">
          <ChatMessage.Bubble>
            <Text>Done.</Text>
          </ChatMessage.Bubble>
          <ChatMessage.Meta>
            <Link href="#">How was this generated?</Link>
            <Text>Apr 13, 11:56pm</Text>
          </ChatMessage.Meta>
        </ChatMessage.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("link", { name: "How was this generated?" })
    ).toBeInTheDocument();
    expect(screen.getByText("Apr 13, 11:56pm")).toBeInTheDocument();
  });
});

/**
 * @docs-section streaming
 * @docs-title Streaming replies
 * @docs-description While generating, render ChatMessage.Typing and set isStreaming.
 * @docs-order 4
 */
describe("ChatMessage - Streaming", () => {
  it("sets aria-busy and shows a typing affordance", () => {
    render(
      <NimbusProvider>
        <ChatMessage.Root sender="agent" isStreaming data-testid="bubble">
          <ChatMessage.Avatar>
            <AutoAwesome />
          </ChatMessage.Avatar>
          <ChatMessage.Bubble>
            <ChatMessage.Typing>
              <Text>Assistant is typing…</Text>
            </ChatMessage.Typing>
          </ChatMessage.Bubble>
        </ChatMessage.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("bubble")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Assistant is typing…")).toBeInTheDocument();
  });
});

/**
 * @docs-section accessible-transcript
 * @docs-title Accessible transcript
 * @docs-description ChatMessage renders one message; compose the transcript as a live log of named articles.
 * @docs-order 5
 */
describe("ChatMessage - Accessible transcript", () => {
  it("names each message and hides a decorative avatar", () => {
    render(
      <NimbusProvider>
        <Box role="log" aria-live="polite" aria-label="Conversation">
          <ChatMessage.Root
            sender="user"
            aria-label="Message from Ada Lovelace"
          >
            <ChatMessage.Avatar firstName="Ada" lastName="Lovelace" />
            <ChatMessage.Bubble>
              <Text>Summarise last week's orders?</Text>
            </ChatMessage.Bubble>
          </ChatMessage.Root>

          <ChatMessage.Root
            sender="agent"
            aria-label="Message from the assistant"
          >
            <ChatMessage.Avatar>
              <AutoAwesome />
            </ChatMessage.Avatar>
            <ChatMessage.Bubble>
              <Text>Revenue is up 12%.</Text>
            </ChatMessage.Bubble>
          </ChatMessage.Root>
        </Box>
      </NimbusProvider>
    );

    // The transcript is a polite live region.
    const log = screen.getByRole("log");
    expect(log).toHaveAttribute("aria-live", "polite");

    // Each message is a named article.
    expect(
      screen.getByRole("article", { name: "Message from Ada Lovelace" })
    ).toBeInTheDocument();
    const agent = screen.getByRole("article", {
      name: "Message from the assistant",
    });
    expect(agent).toBeInTheDocument();

    // The decorative agent avatar is not exposed with a misleading label.
    expect(within(agent).queryByLabelText(/avatar/i)).not.toBeInTheDocument();
  });

  it("renders a system notice as a ChatNotice (a peer, not a sender)", () => {
    render(
      <NimbusProvider>
        <ChatNotice>Conversation history was cleared.</ChatNotice>
      </NimbusProvider>
    );

    expect(
      screen.getByText("Conversation history was cleared.")
    ).toBeInTheDocument();
  });
});
