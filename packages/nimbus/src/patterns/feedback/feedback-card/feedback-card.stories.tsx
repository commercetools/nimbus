import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn } from "storybook/test";
import { FeedbackCard, Heading, Text, Button } from "@commercetools/nimbus";

const meta: Meta<typeof FeedbackCard.Root> = {
  title: "patterns/feedback/FeedbackCard",
  component: FeedbackCard.Root,
};

export default meta;

type Story = StoryObj<typeof FeedbackCard.Root>;

// Per-story action spies. `fn()` from storybook/test auto-resets before each
// story renders, so module scope is safe.
const onApproveUndo = fn();
const onRejectUndo = fn();

/**
 * Approve context — the visual treatment (positive background + border) is
 * supplied entirely through consumer Chakra style props on Root.
 */
export const ApproveContext: Story = {
  render: () => (
    <FeedbackCard.Root
      data-testid="feedback-card"
      colorPalette="positive"
      bg="colorPalette.2"
      border="solid-25"
      borderColor="colorPalette.6"
      borderRadius="200"
      p="400"
    >
      <FeedbackCard.Content>
        <Heading size="md">Suggestion approved</Heading>
        <Text>Applied the recommended discount to 3 products.</Text>
      </FeedbackCard.Content>
      <FeedbackCard.Action>
        {/* The Button needs no colorPalette — it inherits "positive" from Root. */}
        <Button variant="outline" onPress={onApproveUndo}>
          Undo
        </Button>
      </FeedbackCard.Action>
    </FeedbackCard.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the consumer-provided title and subtitle", async () => {
      await expect(canvas.getByText("Suggestion approved")).toBeInTheDocument();
      await expect(
        canvas.getByText("Applied the recommended discount to 3 products.")
      ).toBeInTheDocument();
    });

    await step(
      "Renders the action button with an accessible name",
      async () => {
        await expect(
          canvas.getByRole("button", { name: /undo/i })
        ).toBeInTheDocument();
      }
    );

    await step("The consumer button's onPress fires unmodified", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /undo/i }));
      await expect(onApproveUndo).toHaveBeenCalledTimes(1);
    });
  },
};

/**
 * Rejected context — same structure, only the consumer style props differ
 * (critical background + border). Proves approve/reject differ by style alone.
 */
export const RejectedContext: Story = {
  render: () => (
    <FeedbackCard.Root
      data-testid="feedback-card"
      colorPalette="critical"
      bg="colorPalette.2"
      border="solid-25"
      borderColor="colorPalette.6"
      borderRadius="200"
      p="400"
    >
      <FeedbackCard.Content>
        <Heading size="md">Suggestion rejected</Heading>
        <Text>No changes were applied.</Text>
      </FeedbackCard.Content>
      <FeedbackCard.Action>
        {/* No colorPalette on the Button — it inherits "critical" from Root. */}
        <Button variant="outline" onPress={onRejectUndo}>
          Undo
        </Button>
      </FeedbackCard.Action>
    </FeedbackCard.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the rejected title and subtitle", async () => {
      await expect(canvas.getByText("Suggestion rejected")).toBeInTheDocument();
      await expect(
        canvas.getByText("No changes were applied.")
      ).toBeInTheDocument();
    });

    await step("Action button works in the reject context", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /undo/i }));
      await expect(onRejectUndo).toHaveBeenCalledTimes(1);
    });
  },
};

/**
 * Style-prop forwarding — bg/border/borderRadius/padding passed to Root must
 * land on the rendered root element.
 */
export const StylePropForwarding: Story = {
  render: () => (
    <FeedbackCard.Root
      data-testid="feedback-card-styled"
      bg="info.2"
      borderRadius="300"
      p="500"
    >
      <FeedbackCard.Content>
        <Text>Styled via consumer props</Text>
      </FeedbackCard.Content>
      <FeedbackCard.Action>
        <Button variant="outline" onPress={fn()}>
          Undo
        </Button>
      </FeedbackCard.Action>
    </FeedbackCard.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("feedback-card-styled");

    await step("Consumer style props are applied to the root", async () => {
      const styles = getComputedStyle(root);
      // padding + radius come from p="500" / borderRadius="300"
      await expect(styles.padding).not.toBe("0px");
      await expect(styles.borderTopLeftRadius).not.toBe("0px");
      // bg="info.2" resolves to a real (non-transparent) color
      await expect(styles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
      await expect(styles.backgroundColor).not.toBe("transparent");
    });
  },
};

/**
 * Layout contract — all three slots render, the layout row styles are applied,
 * and the action follows the content in DOM order (so it wraps below on narrow
 * widths).
 */
export const LayoutContract: Story = {
  render: () => (
    <FeedbackCard.Root data-testid="feedback-card-layout" p="400">
      <FeedbackCard.Content>
        <Text fontWeight="700">Layout title</Text>
        <Text color="neutral.11">Layout subtitle</Text>
      </FeedbackCard.Content>
      <FeedbackCard.Action>
        <Button variant="outline" onPress={fn()}>
          Undo
        </Button>
      </FeedbackCard.Action>
    </FeedbackCard.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const root = canvas.getByTestId("feedback-card-layout");

    await step(
      "Root renders the recipe's root slot as a wrapping row",
      async () => {
        await expect(root.className).toContain("nimbus-feedback-card__root");
        const styles = getComputedStyle(root);
        await expect(styles.display).toBe("flex");
        await expect(styles.flexWrap).toBe("wrap");
        await expect(styles.justifyContent).toBe("space-between");
      }
    );

    await step("All three slots render", async () => {
      const content = canvas
        .getByText("Layout title")
        .closest(".nimbus-feedback-card__content");
      const action = canvas
        .getByRole("button", { name: /undo/i })
        .closest(".nimbus-feedback-card__action");
      await expect(root).toBeInTheDocument();
      await expect(content).not.toBeNull();
      await expect(action).not.toBeNull();

      await step("Action follows content in DOM order", async () => {
        const order = content!.compareDocumentPosition(action!);
        await expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      });
    });
  },
};
