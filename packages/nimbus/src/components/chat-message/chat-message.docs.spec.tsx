import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ChatMessage,
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
        <ChatMessage.Root sender="agent" data-testid="body">
          <ChatMessage.Avatar>
            <AutoAwesome />
          </ChatMessage.Avatar>
          <ChatMessage.Body>
            <Text>Here is the summary you asked for.</Text>
          </ChatMessage.Body>
        </ChatMessage.Root>
      </NimbusProvider>
    );

    const body = screen.getByTestId("body");
    expect(body.tagName.toLowerCase()).toBe("article");
    expect(body).toHaveTextContent("Here is the summary you asked for.");
  });

  it("can override the rendered element via `as`", () => {
    render(
      <NimbusProvider>
        <Box as="ul">
          <ChatMessage.Root as="li" data-testid="body">
            <ChatMessage.Body>
              <Text>Item</Text>
            </ChatMessage.Body>
          </ChatMessage.Root>
        </Box>
      </NimbusProvider>
    );

    expect(screen.getByTestId("body").tagName.toLowerCase()).toBe("li");
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
        <ChatMessage.Root sender={sender} data-testid="body">
          <ChatMessage.Body>
            <Text>{sender} message</Text>
          </ChatMessage.Body>
        </ChatMessage.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("body")).toHaveTextContent(`${sender} message`);
  });

  it("renders an error-toned agent message with a retry action", () => {
    render(
      <NimbusProvider>
        <ChatMessage.Root sender="agent" tone="error" data-testid="body">
          <ChatMessage.Body>
            <Text>Something went wrong.</Text>
            <ChatMessage.Actions>
              <Button variant="outline">Retry</Button>
            </ChatMessage.Actions>
          </ChatMessage.Body>
        </ChatMessage.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("body")).toHaveTextContent(
      "Something went wrong."
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});

/**
 * @docs-section actions-and-meta
 * @docs-title Actions and meta
 * @docs-description Actions sit inside the body; the meta sits below it.
 * @docs-order 3
 */
describe("ChatMessage - Actions and meta", () => {
  it("invokes an action button's handler", async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();

    render(
      <NimbusProvider>
        <ChatMessage.Root sender="agent">
          <ChatMessage.Body>
            <Text>Approve to apply.</Text>
            <ChatMessage.Actions>
              <Button variant="solid" onPress={onApprove}>
                Approve
              </Button>
            </ChatMessage.Actions>
          </ChatMessage.Body>
        </ChatMessage.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Approve" }));
    expect(onApprove).toHaveBeenCalledTimes(1);
  });

  it("renders meta content below the body", () => {
    render(
      <NimbusProvider>
        <ChatMessage.Root sender="agent">
          <ChatMessage.Body>
            <Text>Done.</Text>
          </ChatMessage.Body>
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
        <ChatMessage.Root sender="agent" isStreaming data-testid="body">
          <ChatMessage.Avatar>
            <AutoAwesome />
          </ChatMessage.Avatar>
          <ChatMessage.Body>
            <ChatMessage.Typing>
              <Text>Agent is typing…</Text>
            </ChatMessage.Typing>
          </ChatMessage.Body>
        </ChatMessage.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("body")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Agent is typing…")).toBeInTheDocument();
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
            <ChatMessage.Body>
              <Text>Summarise last week's orders?</Text>
            </ChatMessage.Body>
          </ChatMessage.Root>

          <ChatMessage.Root sender="agent" aria-label="Message from the agent">
            <ChatMessage.Avatar>
              <AutoAwesome />
            </ChatMessage.Avatar>
            <ChatMessage.Body>
              <Text>Revenue is up 12%.</Text>
            </ChatMessage.Body>
          </ChatMessage.Root>
        </Box>
      </NimbusProvider>
    );

    // The transcript is a polite live region. Scope by accessible name: under
    // the unit project's shared JSDOM (isolate:false), React Aria's global
    // LiveAnnouncer leaves nameless role="log" nodes on document.body that an
    // unscoped query would also match.
    const log = screen.getByRole("log", { name: "Conversation" });
    expect(log).toHaveAttribute("aria-live", "polite");

    // Each message is a named article.
    expect(
      screen.getByRole("article", { name: "Message from Ada Lovelace" })
    ).toBeInTheDocument();
    const agent = screen.getByRole("article", {
      name: "Message from the agent",
    });
    expect(agent).toBeInTheDocument();

    // The decorative agent avatar is not exposed with a misleading label.
    expect(within(agent).queryByLabelText(/avatar/i)).not.toBeInTheDocument();
  });
});
