import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./index";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Menu onAction={(key) => alert(`Action: ${key}`)}>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="copy">Copy</Menu.Item>
        <Menu.Item id="cut">Cut</Menu.Item>
        <Menu.Item id="paste">Paste</Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};
