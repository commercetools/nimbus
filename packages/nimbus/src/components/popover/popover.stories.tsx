import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./popover";
import { expect, screen } from "storybook/test";

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
      </Popover.Content>
    </Popover.Root>
  ),
  args: {
    ["aria-label"]: "popover",
  },
  play: async ({ canvasElement, step }) => {
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
