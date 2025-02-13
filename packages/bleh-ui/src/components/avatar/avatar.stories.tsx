import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./avatar";
import { Stack } from "./../stack";
import type { AvatarProps } from "./avatar.types";
import { userEvent, within, expect } from "@storybook/test";

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

const tones: AvatarProps["tone"][] = ["primary", "neutral", "critical"];

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

    await step("Forwards data- & aria-attributes", async () => {
      await expect(avatar).toHaveAttribute("data-testid", "test");
      await expect(avatar).toHaveAttribute("aria-label", "test-avatar");
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(avatar).toHaveFocus();
    });
  },
};

export const Disabled: Story = {
  args: {
    src: avatarImg,
    // @ts-expect-error: todo: investigate why this causes squiggly lines
    ["data-testid"]: "test",
    ["aria-label"]: "test-avatar",
    alt: "avatar",
    isDisabled: true,
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByTestId("test");

    await step("Is not focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(avatar).not.toHaveFocus();
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

export const DisabledWithInitials: Story = {
  args: {
    firstName: "Bond",
    // @ts-expect-error: todo: investigate why this causes squiggly lines
    ["data-testid"]: "test-with-single-name",
    ["aria-label"]: "test-avatar",
    alt: "avatar",
    isDisabled: true,
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByTestId("test-with-single-name");

    await step(
      "Take first two letters when only firstName name is provided",
      async () => {
        await expect(avatar).toHaveTextContent("BO");
      }
    );
  },
};

export const SizesWithInitials: Story = {
  args: {
    firstName: "Avatar",
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
    firstName: "Avatar",
  },
  render: (args) => {
    return (
      <Stack>
        {
          <Stack direction="row" gap="400" alignItems="center">
            {tones.map((tone) => (
              <Avatar key={tone as string} {...args} tone={tone} alt="avatar" />
            ))}
          </Stack>
        }
      </Stack>
    );
  },
};
