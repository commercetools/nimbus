import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ChatBubble,
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
 * @docs-description Compose a single agent message from the ChatBubble parts.
 * @docs-order 1
 */
describe("ChatBubble - Basic rendering", () => {
  it("renders an agent message as a semantic article", () => {
    render(
      <NimbusProvider>
        <ChatBubble.Root sender="agent" data-testid="bubble">
          <ChatBubble.Avatar>
            <AutoAwesome />
          </ChatBubble.Avatar>
          <ChatBubble.Bubble>
            <Text>Here is the summary you asked for.</Text>
          </ChatBubble.Bubble>
        </ChatBubble.Root>
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
          <ChatBubble.Root as="li" data-testid="bubble">
            <ChatBubble.Bubble>
              <Text>Item</Text>
            </ChatBubble.Bubble>
          </ChatBubble.Root>
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
describe("ChatBubble - Senders and tone", () => {
  it.each(["user", "agent", "system", "tool"] as const)(
    "renders the %s sender",
    (sender) => {
      render(
        <NimbusProvider>
          <ChatBubble.Root sender={sender} data-testid="bubble">
            <ChatBubble.Bubble>
              <Text>{sender} message</Text>
            </ChatBubble.Bubble>
          </ChatBubble.Root>
        </NimbusProvider>
      );

      expect(screen.getByTestId("bubble")).toHaveTextContent(
        `${sender} message`
      );
    }
  );

  it("renders an error-toned agent message with a retry action", () => {
    render(
      <NimbusProvider>
        <ChatBubble.Root sender="agent" tone="error" data-testid="bubble">
          <ChatBubble.Bubble>
            <Text>Something went wrong.</Text>
            <ChatBubble.Actions>
              <Button variant="outline">Retry</Button>
            </ChatBubble.Actions>
          </ChatBubble.Bubble>
        </ChatBubble.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("bubble")).toHaveTextContent(
      "Something went wrong."
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});

/**
 * @docs-section actions-and-footer
 * @docs-title Actions and footer
 * @docs-description Actions sit inside the bubble; the footer sits below it.
 * @docs-order 3
 */
describe("ChatBubble - Actions and footer", () => {
  it("invokes an action button's handler", async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();

    render(
      <NimbusProvider>
        <ChatBubble.Root sender="agent">
          <ChatBubble.Bubble>
            <Text>Approve to apply.</Text>
            <ChatBubble.Actions>
              <Button variant="solid" onPress={onApprove}>
                Approve
              </Button>
            </ChatBubble.Actions>
          </ChatBubble.Bubble>
        </ChatBubble.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Approve" }));
    expect(onApprove).toHaveBeenCalledTimes(1);
  });

  it("renders footer content below the bubble", () => {
    render(
      <NimbusProvider>
        <ChatBubble.Root sender="agent">
          <ChatBubble.Bubble>
            <Text>Done.</Text>
          </ChatBubble.Bubble>
          <ChatBubble.Footer>
            <Link href="#">How was this generated?</Link>
            <Text>Apr 13, 11:56pm</Text>
          </ChatBubble.Footer>
        </ChatBubble.Root>
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
 * @docs-description While generating, render ChatBubble.Typing and set isStreaming.
 * @docs-order 4
 */
describe("ChatBubble - Streaming", () => {
  it("sets aria-busy and shows a typing affordance", () => {
    render(
      <NimbusProvider>
        <ChatBubble.Root sender="agent" isStreaming data-testid="bubble">
          <ChatBubble.Avatar>
            <AutoAwesome />
          </ChatBubble.Avatar>
          <ChatBubble.Bubble>
            <ChatBubble.Typing>
              <Text>Assistant is typing…</Text>
            </ChatBubble.Typing>
          </ChatBubble.Bubble>
        </ChatBubble.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("bubble")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Assistant is typing…")).toBeInTheDocument();
  });
});

/**
 * @docs-section accessible-transcript
 * @docs-title Accessible transcript
 * @docs-description ChatBubble renders one message; compose the transcript as a live log of named articles.
 * @docs-order 5
 */
describe("ChatBubble - Accessible transcript", () => {
  it("names each message and hides a decorative avatar", () => {
    render(
      <NimbusProvider>
        <Box role="log" aria-live="polite" aria-label="Conversation">
          <ChatBubble.Root sender="user" aria-label="Message from Ada Lovelace">
            <ChatBubble.Avatar firstName="Ada" lastName="Lovelace" />
            <ChatBubble.Bubble>
              <Text>Summarise last week's orders?</Text>
            </ChatBubble.Bubble>
          </ChatBubble.Root>

          <ChatBubble.Root
            sender="agent"
            aria-label="Message from the assistant"
          >
            <ChatBubble.Avatar>
              <AutoAwesome />
            </ChatBubble.Avatar>
            <ChatBubble.Bubble>
              <Text>Revenue is up 12%.</Text>
            </ChatBubble.Bubble>
          </ChatBubble.Root>
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
});
