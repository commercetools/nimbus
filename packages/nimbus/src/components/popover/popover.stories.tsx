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
    <Popover.Root isOpen>
      <Popover.Content {...args}>
        <p>This is a popover component!</p>
        <Popover.Close onClick={() => {console.log('Popover closed');}}>Close</Popover.Close>
      </Popover.Content>
    </Popover.Root>
  ),
  args: {},
};
