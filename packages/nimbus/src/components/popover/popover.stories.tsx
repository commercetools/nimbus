import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./popover";
import { expect, screen } from "storybook/test";

const meta: Meta<typeof Popover> = {
  title: "components/Popover",
  component: Popover,
};

export default meta;

type Story = StoryObj<typeof Popover>;

/**
 * Base story
 * Demonstrates the most basic implementation with controlled state
 */
export const Base: Story = {
  render: () => (
    <Popover.Trigger isOpen data-testid="test-popover-trigger">
      <Popover aria-label="popover" data-testid="test-popover-content">
        <p>This is a basic popover component!</p>
      </Popover>
    </Popover.Trigger>
  ),

  play: async ({ step }) => {
    await step("Renders popover content", async () => {
      // Use screen instead of canvas since popover is rendered in a portal
      const content = screen.getByTestId("test-popover-content");
      await expect(content).toBeInTheDocument();
    });

    await step("Displays correct text content", async () => {
      const content = screen.getByTestId("test-popover-content");
      await expect(content).toHaveTextContent(
        "This is a basic popover component!"
      );
    });
  },
};
