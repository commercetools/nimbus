import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./popover";

const meta: Meta<typeof Popover.Content> = {
  title: "components/Popover",
  component: Popover.Content,
  decorators: [
    (Story) => (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Popover.Content>;

export const Basic: Story = {
  render: (args) => (
    <Popover.Root>
      <Popover.Trigger>Open Popover</Popover.Trigger>
      <Popover.Content {...args}>
        <Popover.Dialog>
          <p>This is a popover component built with React Aria.</p>
          <Popover.Close>Close</Popover.Close>
        </Popover.Dialog>
      </Popover.Content>
    </Popover.Root>
  ),
  args: {},
};
