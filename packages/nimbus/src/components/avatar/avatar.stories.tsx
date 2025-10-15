import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar";
import type { AvatarProps } from "./avatar.types";
import { within, expect, waitFor } from "storybook/test";
import { Button, Stack } from "@/components";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
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
    firstName: "John",
    lastName: "Doe",
    src: avatarImg,
    ["aria-label"]: "avatar",
    alt: "avatar",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText("avatar");

    await step("Uses a <figure> element by default", async () => {
      await expect(avatar.tagName).toBe("FIGURE");
    });
  },
};

export const Sizes: Story = {
  args: {
    firstName: "John",
    lastName: "Doe",
    src: avatarImg,
    ["aria-label"]: "avatar",
    alt: "avatar",
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
    ["aria-label"]: "avatar",
    alt: "avatar",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText("avatar");
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
    ["aria-label"]: "avatar",
    alt: "avatar",
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
    ["aria-label"]: "avatar",
    alt: "avatar",
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

export const ImageErrorFallback: Story = {
  args: {
    firstName: "Jane",
    lastName: "Smith",
    src: "https://www.gravatar.com/avatar/thisWill404?s=200&d=404", // d=404 will return a 404 if the image doesn't exist
    ["aria-label"]: "Jane Smith avatar",
    alt: "Jane Smith",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByLabelText("Jane Smith avatar");

    await step(
      "Should fall back to initials when image fails to load",
      async () => {
        // Wait for the image error to be handled
        await waitFor(
          async () => {
            await expect(avatar).toHaveTextContent("JS");
          },
          { timeout: 3000 }
        );
      }
    );

    await step("Should hide the img element after error", async () => {
      const img = avatar.querySelector("img");
      await expect(img).not.toBeNull(); // Image element should still exist
      await expect(img).toHaveStyle("display: none"); // But should be hidden
    });
  },
};

export const InAButton: Story = {
  args: {
    firstName: "Jane",
    lastName: "Smith",
    src: avatarImg,
  },

  render(args) {
    return (
      <Button unstyled asChild>
        <Avatar {...args} as="button" />
      </Button>
    );
  },
};
