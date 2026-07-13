import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ChatMessageList,
  ChatMessage,
  NimbusProvider,
  Text,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Rendering a transcript
 * @docs-description Wrap each turn in a ChatMessageList.Item inside ChatMessageList.Root.
 * @docs-order 1
 */
describe("ChatMessageList - Rendering a transcript", () => {
  it("renders each item's member as a vertical sequence", () => {
    render(
      <NimbusProvider>
        <ChatMessageList.Root aria-label="Conversation">
          <ChatMessageList.Item>
            <ChatMessage.Root sender="user">
              <ChatMessage.Body>
                <Text>Summarise last week's orders?</Text>
              </ChatMessage.Body>
            </ChatMessage.Root>
          </ChatMessageList.Item>
          <ChatMessageList.Item>
            <ChatMessage.Root sender="assistant">
              <ChatMessage.Body>
                <Text>Revenue is up 12%.</Text>
              </ChatMessage.Body>
            </ChatMessage.Root>
          </ChatMessageList.Item>
        </ChatMessageList.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByText("Summarise last week's orders?")
    ).toBeInTheDocument();
    expect(screen.getByText("Revenue is up 12%.")).toBeInTheDocument();
  });

  it("holds arbitrary content as a member, not just messages", () => {
    render(
      <NimbusProvider>
        <ChatMessageList.Root aria-label="Conversation">
          <ChatMessageList.Item>
            {/* The list is content-agnostic — an Item can hold any content,
                e.g. a consumer-rendered notice. */}
            <Text>Conversation history was cleared.</Text>
          </ChatMessageList.Item>
        </ChatMessageList.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByText("Conversation history was cleared.")
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section live-region
 * @docs-title Accessible live region
 * @docs-description Root is a named role="log" aria-live="polite" region for the transcript.
 * @docs-order 2
 */
describe("ChatMessageList - Accessible live region", () => {
  it("exposes a polite log region named by aria-label", () => {
    render(
      <NimbusProvider>
        <ChatMessageList.Root aria-label="Conversation with the assistant">
          <ChatMessageList.Item>
            <ChatMessage.Root sender="assistant">
              <ChatMessage.Body>
                <Text>Hello!</Text>
              </ChatMessage.Body>
            </ChatMessage.Root>
          </ChatMessageList.Item>
        </ChatMessageList.Root>
      </NimbusProvider>
    );

    // Scope by name: under the unit project's shared JSDOM (isolate:false),
    // React Aria's global LiveAnnouncer leaves nameless role="log" nodes on
    // document.body that an unscoped query would also match.
    const log = screen.getByRole("log", {
      name: "Conversation with the assistant",
    });
    expect(log).toHaveAttribute("aria-live", "polite");
    expect(log).toHaveAccessibleName("Conversation with the assistant");
  });

  it("falls back to a localized name when none is provided", () => {
    render(
      <NimbusProvider>
        <ChatMessageList.Root>
          <ChatMessageList.Item>
            <ChatMessage.Root sender="assistant">
              <ChatMessage.Body>
                <Text>Hello!</Text>
              </ChatMessage.Body>
            </ChatMessage.Root>
          </ChatMessageList.Item>
        </ChatMessageList.Root>
      </NimbusProvider>
    );

    // Scope by name (see note above) to exclude LiveAnnouncer's nameless logs.
    expect(
      screen.getByRole("log", { name: "Conversation" })
    ).toHaveAccessibleName("Conversation");
  });
});

/**
 * @docs-section empty-state
 * @docs-title Empty state
 * @docs-description Root renders emptyState when there are no items.
 * @docs-order 3
 */
describe("ChatMessageList - Empty state", () => {
  it("renders the empty state when there are no items", () => {
    render(
      <NimbusProvider>
        <ChatMessageList.Root
          aria-label="Conversation"
          emptyState={<Text>No messages yet.</Text>}
        />
      </NimbusProvider>
    );

    expect(screen.getByText("No messages yet.")).toBeInTheDocument();
  });
});
