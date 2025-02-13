import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./avatar";
import type { AvatarProps } from "./avatar.types";
import { within, expect } from "@storybook/test";
import { Button, Stack } from "@/components";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Avatar> = {
  title: "components/Avatar",
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

const sizes: AvatarProps["size"][] = ["md", "xs", "2xs"];

const colorPalettes: AvatarProps["colorPalette"][] = [
  "red",
  "green",
  "blue",
  "amber",
];

const avatarImg = "https://thispersondoesnotexist.com/ ";

export const Base: Story = {
  args: {
    src: avatarImg,
    // @ts-expect-error: todo: investigate why this causes squiggly lines
    ["data-testid"]: "test",
    ["aria-label"]: "test-avatar",
    alt: "avatar",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByTestId("test");

    await step("Uses a <div> element by default", async () => {
      await expect(avatar.tagName).toBe("DIV");
    });
  },
};

export const Sizes: Story = {
  args: {
    src: avatarImg,
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <Avatar key={size as string} {...args} size={size} alt="avatar" />
        ))}
      </Stack>
    );
  },
};

export const BaseWithInitials: Story = {
  args: {
    firstName: "John",
    lastName: "Doe",
    // @ts-expect-error: todo: investigate why this causes squiggly lines
    ["data-testid"]: "test-with-initials",
    ["aria-label"]: "test-avatar",
    alt: "avatar",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByTestId("test-with-initials");
    await step(
      "Take first letters of first and last name to make initials",
      async () => {
        await expect(avatar).toHaveTextContent("JD");
      }
    );
  },
};

export const SizesWithInitials: Story = {
  args: {
    firstName: "Michael",
    lastName: "Douglas",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <Avatar key={size as string} {...args} size={size} alt="avatar" />
        ))}
      </Stack>
    );
  },
};

export const Colors: Story = {
  args: {
    firstName: "Michael",
    lastName: "Douglas",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {colorPalettes.map((colorPalette) => (
          <Avatar
            key={colorPalette as string}
            {...args}
            colorPalette={colorPalette}
            alt="avatar"
          />
        ))}
      </Stack>
    );
  },
};

export const InAButton: Story = {
  args: {
    src: avatarImg,
    // @ts-expect-error: todo: investigate why this causes squiggly lines
    ["data-testid"]: "test",
    ["aria-label"]: "test-avatar",
    alt: "avatar",
  },

  render(args) {
    return (
      <Button unstyled asChild>
        <Avatar {...args} as="button" />
      </Button>
    );
  },
};
