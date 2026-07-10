import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatNotice, Stack } from "@commercetools/nimbus";
import { within, expect } from "storybook/test";

const meta: Meta<typeof ChatNotice> = {
  title: "Components/ChatNotice",
  component: ChatNotice,
};

export default meta;

type Story = StoryObj<typeof ChatNotice>;

/**
 * Base
 * A centered, subdued, avatar-less interjection for a chat transcript. A peer of
 * `ChatMessage`, not a `sender` variant.
 */
export const Base: Story = {
  render: () => (
    <ChatNotice data-testid="notice">
      Conversation history was cleared.
    </ChatNotice>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Renders the notice content", async () => {
      await expect(canvas.getByTestId("notice")).toHaveTextContent(
        "Conversation history was cleared."
      );
    });
  },
};

/**
 * As a divider between turns
 * A notice reads as a divider when placed between messages in a transcript.
 */
export const AsDivider: Story = {
  render: () => (
    <Stack gap="600">
      <ChatNotice>Today</ChatNotice>
      <ChatNotice>You left the conversation.</ChatNotice>
    </Stack>
  ),
};

/**
 * Long content wraps
 * Long, unbreakable content wraps inside the notice rather than overflowing.
 */
export const Overflow: Story = {
  render: () => (
    <ChatNotice data-testid="overflow-notice">
      Notice with a long unbreakable token
      https://example.com/very/long/path/that/should/wrap?token=aVeryLongUnbrokenIdentifierWithNoSpacesAtAll
    </ChatNotice>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const notice = canvas.getByTestId("overflow-notice");

    await step("Content wraps inside the notice (no overflow)", async () => {
      await expect(notice.scrollWidth).toBeLessThanOrEqual(
        notice.clientWidth + 1
      );
    });
  },
};
