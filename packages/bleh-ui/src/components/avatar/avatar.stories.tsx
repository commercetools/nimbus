import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./avatar";
import { Stack } from "./../stack";
import type { AvatarProps } from "./avatar.types";
import { userEvent, within, expect, fn } from "@storybook/test";

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

export const Base: Story = {
  args: {
    src: "https://bit.ly/dan-abramov",
    // @ts-expect-error: todo: investigate why this causes squiggly lines
    ["data-testid"]: "test",
    ["aria-label"]: "test-avatar",
    onClick: fn(),
    alt: "avatar",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByTestId("test");
    const onClick = args.onClick;

    await step("Uses a <div> element by default", async () => {
      await expect(avatar.tagName).toBe("DIV");
    });

    await step("Forwards data- & aria-attributes", async () => {
      await expect(avatar).toHaveAttribute("data-testid", "test");
      await expect(avatar).toHaveAttribute("aria-label", "test-avatar");
    });

    await step("Is clickable", async () => {
      avatar.click();
      await expect(onClick).toHaveBeenCalledTimes(1);
      avatar.blur();
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(avatar).toHaveFocus();
    });

    await step("Can be triggered with enter", async () => {
      await userEvent.keyboard("{enter}");
      await expect(onClick).toHaveBeenCalledTimes(2);
    });

    await step("Can be triggered with space-bar", async () => {
      await expect(avatar).toHaveFocus();
      await userEvent.keyboard(" ");
      await expect(onClick).toHaveBeenCalledTimes(3);
    });
  },
};

export const Disabled: Story = {
  args: {
    src: "https://bit.ly/dan-abramov",
    // @ts-expect-error: todo: investigate why this causes squiggly lines
    ["data-testid"]: "test",
    ["aria-label"]: "test-avatar",
    onClick: fn(),
    alt: "avatar",
    isDisabled: true,
  },

  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByTestId("test");
    const onClick = args.onClick;

    await step("Is not clickable", async () => {
      avatar.click();
      await expect(onClick).not.toBeCalled();
      avatar.blur();
    });

    await step("Is not focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(avatar).not.toHaveFocus();
    });
  },
};

export const Sizes: Story = {
  args: {
    src: "https://bit.ly/dan-abramov",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <Avatar key={size} {...args} size={size} alt="avatar" />
        ))}
      </Stack>
    );
  },
};

export const BaseWithInitials: Story = {
  args: {
    name: "John Doe",
    // @ts-expect-error: todo: investigate why this causes squiggly lines
    ["data-testid"]: "test-with-initials",
    ["aria-label"]: "test-avatar",
    onClick: fn(),
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
    name: "Bond",
    // @ts-expect-error: todo: investigate why this causes squiggly lines
    ["data-testid"]: "test-with-single-name",
    ["aria-label"]: "test-avatar",
    onClick: fn(),
    alt: "avatar",
    isDisabled: true,
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByTestId("test-with-single-name");

    await step(
      "Take first two letters when only one name is provided",
      async () => {
        await expect(avatar).toHaveTextContent("BO");
      }
    );
  },
};

export const SizesWithInitials: Story = {
  args: {
    name: "Avatar",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <Avatar key={size} {...args} size={size} alt="avatar" />
        ))}
      </Stack>
    );
  },
};

export const Colors: Story = {
  args: {
    name: "Avatar",
  },
  render: (args) => {
    return (
      <Stack>
        {
          <Stack direction="row" gap="400" alignItems="center">
            {tones.map((tone) => (
              <Avatar key={tone} {...args} tone={tone} alt="avatar" />
            ))}
          </Stack>
        }
      </Stack>
    );
  },
};
