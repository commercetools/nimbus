import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBox } from "./list-box";
import { userEvent, within, expect, fn } from "storybook/test";

const meta: Meta<typeof ListBox.Root> = {
  title: "experimental/ListBox",
  component: ListBox.Root,
};

export default meta;

type Story = StoryObj<typeof ListBox.Root>;

export const Base: Story = {
  args: {
    selectionMode: "single",
    onSelectionChange: fn(),
    "data-testid": "test-listbox",
    "aria-label": "test-listbox",
  } as any,
  render: (args) => (
    <ListBox.Root {...args}>
      <ListBox.Item value="item1">Item 1</ListBox.Item>
      <ListBox.Item value="item2">Item 2</ListBox.Item>
      <ListBox.Item value="item3">Item 3</ListBox.Item>
    </ListBox.Root>
  ),
};

export const WithSections: Story = {
  args: {
    selectionMode: "single",
    onSelectionChange: fn(),
  } as any,
  render: (args) => (
    <ListBox.Root {...args}>
      <ListBox.Section title="Fruits">
        <ListBox.Item value="apple">Apple</ListBox.Item>
        <ListBox.Item value="banana">Banana</ListBox.Item>
        <ListBox.Item value="orange">Orange</ListBox.Item>
      </ListBox.Section>
      <ListBox.Section title="Vegetables">
        <ListBox.Item value="carrot">Carrot</ListBox.Item>
        <ListBox.Item value="broccoli">Broccoli</ListBox.Item>
        <ListBox.Item value="spinach">Spinach</ListBox.Item>
      </ListBox.Section>
    </ListBox.Root>
  ),
};

export const MultipleSelection: Story = {
  args: {
    selectionMode: "multiple",
    onSelectionChange: fn(),
  } as any,
  render: (args) => (
    <ListBox.Root {...args}>
      <ListBox.Item value="option1">Option 1</ListBox.Item>
      <ListBox.Item value="option2">Option 2</ListBox.Item>
      <ListBox.Item value="option3">Option 3</ListBox.Item>
      <ListBox.Item value="option4">Option 4</ListBox.Item>
    </ListBox.Root>
  ),
};

export const DisabledItems: Story = {
  args: {
    selectionMode: "single",
    onSelectionChange: fn(),
  } as any,
  render: (args) => (
    <ListBox.Root {...args}>
      <ListBox.Item value="available">Available Item</ListBox.Item>
      <ListBox.Item value="disabled" isDisabled>
        Disabled Item
      </ListBox.Item>
      <ListBox.Item value="another">Another Available Item</ListBox.Item>
    </ListBox.Root>
  ),
};

export const WithDescriptions: Story = {
  args: {
    selectionMode: "single",
    onSelectionChange: fn(),
  } as any,
  render: (args) => (
    <ListBox.Root selectedKeys={new Set(["premium"])} {...args}>
      <ListBox.Item value="premium">
        <ListBox.ItemLabel>Premium Plan</ListBox.ItemLabel>
        <ListBox.ItemDescription>
          Advanced features with priority support
        </ListBox.ItemDescription>
      </ListBox.Item>
      <ListBox.Item value="standard">
        <ListBox.ItemLabel>Standard Plan</ListBox.ItemLabel>
        <ListBox.ItemDescription>
          All essential features for growing teams
        </ListBox.ItemDescription>
      </ListBox.Item>
      <ListBox.Item value="basic">
        <ListBox.ItemLabel>Basic Plan</ListBox.ItemLabel>
        <ListBox.ItemDescription>
          Perfect for individuals and small projects
        </ListBox.ItemDescription>
      </ListBox.Item>
    </ListBox.Root>
  ),
};

export const LongList: Story = {
  args: {
    selectionMode: "single",
    onSelectionChange: fn(),
  } as any,
  render: (args) => (
    <ListBox.Root {...args}>
      {Array.from({ length: 20 }, (_, i) => (
        <ListBox.Item key={i} value={`item-${i}`}>
          Item {i + 1}
        </ListBox.Item>
      ))}
    </ListBox.Root>
  ),
};
