import { useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FeedbackCard,
  Text,
  Button,
  Stack,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * @docs-section undo-external-state
 * @docs-title Revert an applied change on undo
 * @docs-description Wire the action to your own state so pressing Undo rolls the outcome back and swaps the card for an acknowledgement. FeedbackCard positions the button; your app owns the state transition.
 * @docs-order 1
 */
describe("FeedbackCard - Undo drives external state", () => {
  it("reverts the applied change and replaces the card when undo is pressed", async () => {
    const user = userEvent.setup();

    const AgentSuggestion = () => {
      const [status, setStatus] = useState<"applied" | "reverted">("applied");

      if (status === "reverted") {
        return <Text>Change reverted.</Text>;
      }

      return (
        <FeedbackCard.Root bg="positive.2" borderRadius="200" p="400">
          <FeedbackCard.Content>
            <Text fontWeight="700">Suggestion approved</Text>
            <Text color="neutral.11">Applied the recommended discount.</Text>
          </FeedbackCard.Content>
          <FeedbackCard.Action>
            <Button variant="outline" onPress={() => setStatus("reverted")}>
              Undo
            </Button>
          </FeedbackCard.Action>
        </FeedbackCard.Root>
      );
    };

    render(
      <NimbusProvider>
        <AgentSuggestion />
      </NimbusProvider>
    );

    expect(screen.getByText("Suggestion approved")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /undo/i }));

    expect(screen.queryByText("Suggestion approved")).not.toBeInTheDocument();
    expect(screen.getByText("Change reverted.")).toBeInTheDocument();
  });
});

/**
 * @docs-section feed-dismissal
 * @docs-title Dismiss one card from a feed of suggestions
 * @docs-description Render a list of confirmations, each as its own FeedbackCard, and remove the matching entry when its undo is pressed — a common chat-feed workflow.
 * @docs-order 2
 */
describe("FeedbackCard - Feed dismissal workflow", () => {
  it("removes only the undone entry from the feed", async () => {
    const user = userEvent.setup();

    const SuggestionFeed = () => {
      const [items, setItems] = useState([
        { id: 1, label: "Discount applied" },
        { id: 2, label: "Tax rate updated" },
      ]);

      return (
        <Stack gap="200">
          {items.map((item) => (
            <FeedbackCard.Root key={item.id} bg="neutral.2" p="400">
              <FeedbackCard.Content>
                <Text>{item.label}</Text>
              </FeedbackCard.Content>
              <FeedbackCard.Action>
                <Button
                  variant="outline"
                  aria-label={`Undo ${item.label}`}
                  onPress={() =>
                    setItems((prev) => prev.filter((i) => i.id !== item.id))
                  }
                >
                  Undo
                </Button>
              </FeedbackCard.Action>
            </FeedbackCard.Root>
          ))}
        </Stack>
      );
    };

    render(
      <NimbusProvider>
        <SuggestionFeed />
      </NimbusProvider>
    );

    expect(screen.getByText("Discount applied")).toBeInTheDocument();
    expect(screen.getByText("Tax rate updated")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /undo discount applied/i })
    );

    expect(screen.queryByText("Discount applied")).not.toBeInTheDocument();
    expect(screen.getByText("Tax rate updated")).toBeInTheDocument();
  });
});
