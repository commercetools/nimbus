import type { Meta, StoryObj } from "@storybook/react-vite";
import { Item, ItemGroup } from "@commercetools/nimbus";
import { Person, Settings, Notifications } from "@commercetools/nimbus-icons";
import { within, expect } from "storybook/test";

const meta: Meta<typeof ItemGroup.Root> = {
  title: "Components/ItemGroup",
  component: ItemGroup.Root,
};

export default meta;

type Story = StoryObj<typeof ItemGroup.Root>;

/**
 * Base — a group of Item rows divided by separators.
 */
export const Base: Story = {
  render: () => (
    <ItemGroup.Root data-testid="group">
      <Item.Root>
        <Item.Media variant="icon">
          <Person />
        </Item.Media>
        <Item.Content>
          <Item.Title>Profile</Item.Title>
          <Item.Description>Name, avatar, and contact details</Item.Description>
        </Item.Content>
      </Item.Root>
      <ItemGroup.Separator />
      <Item.Root>
        <Item.Media variant="icon">
          <Notifications />
        </Item.Media>
        <Item.Content>
          <Item.Title>Notifications</Item.Title>
          <Item.Description>Email and push preferences</Item.Description>
        </Item.Content>
      </Item.Root>
      <ItemGroup.Separator />
      <Item.Root>
        <Item.Media variant="icon">
          <Settings />
        </Item.Media>
        <Item.Content>
          <Item.Title>Settings</Item.Title>
          <Item.Description>Workspace configuration</Item.Description>
        </Item.Content>
      </Item.Root>
    </ItemGroup.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Group wraps all its rows", async () => {
      const group = canvas.getByTestId("group");
      await expect(group).toBeInTheDocument();
      await expect(within(group).getByText("Profile")).toBeInTheDocument();
      await expect(
        within(group).getByText("Notifications")
      ).toBeInTheDocument();
      await expect(within(group).getByText("Settings")).toBeInTheDocument();
    });

    await step("Renders separators between rows", async () => {
      await expect(canvas.getAllByRole("separator")).toHaveLength(2);
    });
  },
};

/**
 * Grouped link rows — each row navigates; the group divides them.
 */
export const LinkRows: Story = {
  render: () => (
    <ItemGroup.Root data-testid="group">
      <Item.Root href="#profile">
        <Item.Content>
          <Item.Title>Profile</Item.Title>
        </Item.Content>
      </Item.Root>
      <ItemGroup.Separator />
      <Item.Root href="#settings">
        <Item.Content>
          <Item.Title>Settings</Item.Title>
        </Item.Content>
      </Item.Root>
    </ItemGroup.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Each row is an accessible link", async () => {
      const links = canvas.getAllByRole("link");
      await expect(links).toHaveLength(2);
      await expect(links[0]).toHaveAttribute("href", "#profile");
      await expect(links[1]).toHaveAttribute("href", "#settings");
    });
  },
};
