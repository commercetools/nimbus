import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./popover";
import { within, expect, screen } from "storybook/test";

const meta: Meta<typeof Popover.Content> = {
  title: "components/Popover",
  component: Popover.Content,

};

export default meta;


type Story = StoryObj<typeof Popover.Content>;

/**
 * Base story
 * Demonstrates the most basic implementation with controlled state
 */
export const Base: Story = {
  render: (args) => (
    <Popover.Root isOpen data-testid="test-popover-root">
      <Popover.Content {...args} data-testid="test-popover-content">
        <p>This is a basic popover component!</p>
        <Popover.Close data-testid="test-popover-close">Close</Popover.Close>
      </Popover.Content>
    </Popover.Root>
  ),
  args: {},
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    await step("Renders popover content", async () => {
      // Use screen instead of canvas since popover is rendered in a portal
      const content = screen.getByTestId("test-popover-content");
      await expect(content).toBeInTheDocument();
    });

    await step("Displays correct text content", async () => {
      const content = screen.getByTestId("test-popover-content");
      await expect(content).toHaveTextContent("This is a basic popover component!");
    });

    await step("Contains close button", async () => {
      const closeButton = screen.getByTestId("test-popover-close");
      await expect(closeButton).toBeInTheDocument();
    });
  },
};
