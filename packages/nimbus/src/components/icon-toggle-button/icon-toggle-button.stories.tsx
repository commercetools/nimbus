import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconToggleButton } from "./icon-toggle-button";
import { Stack } from "@/components";
import type { IconToggleButtonProps } from "./icon-toggle-button.types";
import { userEvent, within, expect, fn } from "storybook/test";
import {
  ThumbUp,
  Star,
  Bookmark,
  NotificationsNone,
  FavoriteBorder,
} from "@commercetools/nimbus-icons";
import { useState } from "react";

const meta: Meta<typeof IconToggleButton> = {
  title: "components/Buttons/IconToggleButton",
  component: IconToggleButton,
};

export default meta;

type Story = StoryObj<typeof IconToggleButton>;

const sizes = ["md", "xs", "2xs"] as const;
const variants = ["outline", "ghost"] as const;
const tones = ["primary", "neutral", "critical", "info"] as const;

export const Base: Story = {
  args: {
    children: <ThumbUp />,
    "aria-label": "Like",
    onChange: fn(),
    // @ts-expect-error - data-testid is not an official prop
    "data-testid": "test",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");
    const onChange = args.onChange;

    await step("Uses a <button> element", async () => {
      await expect(button.tagName).toBe("BUTTON");
    });

    await step("Has required aria-label", async () => {
      await expect(button).toHaveAttribute("aria-label", "Like");
    });

    await step("Starts unselected", async () => {
      await expect(button).toHaveAttribute("data-selected", "false");
    });

    await step("Can be toggled by clicking", async () => {
      await userEvent.click(button);
      await expect(onChange).toHaveBeenCalledTimes(1);
      await expect(onChange).toHaveBeenCalledWith(true);
      await expect(button).toHaveAttribute("data-selected", "true");
    });
  },
};

export const Controlled: Story = {
  render: () => {
    const [isSelected, setIsSelected] = useState(false);

    return (
      <Stack gap="400">
        <IconToggleButton
          isSelected={isSelected}
          onChange={setIsSelected}
          aria-label="Toggle notifications"
        >
          <NotificationsNone />
        </IconToggleButton>
        <span>Notifications: {isSelected ? "ON" : "OFF"}</span>
      </Stack>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    return (
      <Stack gap="400" align="center">
        {sizes.map((size) => (
          <IconToggleButton
            key={size}
            size={size}
            aria-label={`Like (${size})`}
          >
            <ThumbUp />
          </IconToggleButton>
        ))}
      </Stack>
    );
  },
};

export const Variants: Story = {
  render: () => {
    return (
      <Stack gap="400">
        {variants.map((variant) => (
          <Stack key={variant} gap="200" align="center">
            <IconToggleButton
              variant={variant}
              aria-label={`${variant} unselected`}
            >
              <Star />
            </IconToggleButton>
            <IconToggleButton
              variant={variant}
              isSelected
              aria-label={`${variant} selected`}
            >
              <Star />
            </IconToggleButton>
          </Stack>
        ))}
      </Stack>
    );
  },
};

export const Tones: Story = {
  render: () => {
    return (
      <Stack gap="400">
        {tones.map((tone) => (
          <Stack key={tone} gap="200" align="center">
            <IconToggleButton tone={tone} aria-label={`${tone} favorite`}>
              <FavoriteBorder />
            </IconToggleButton>
            <IconToggleButton
              tone={tone}
              isSelected
              aria-label={`${tone} favorite selected`}
            >
              <FavoriteBorder />
            </IconToggleButton>
          </Stack>
        ))}
      </Stack>
    );
  },
};

export const Multiple: Story = {
  name: "Multiple Icon Toggle Buttons",
  render: () => {
    const [liked, setLiked] = useState(false);
    const [starred, setStarred] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    return (
      <Stack gap="400">
        <IconToggleButton
          isSelected={liked}
          onChange={setLiked}
          aria-label="Like"
          tone="critical"
        >
          <ThumbUp />
        </IconToggleButton>
        <IconToggleButton
          isSelected={starred}
          onChange={setStarred}
          aria-label="Star"
          tone="info"
        >
          <Star />
        </IconToggleButton>
        <IconToggleButton
          isSelected={bookmarked}
          onChange={setBookmarked}
          aria-label="Bookmark"
          tone="primary"
        >
          <Bookmark />
        </IconToggleButton>
      </Stack>
    );
  },
};

export const Disabled: Story = {
  args: {
    children: <ThumbUp />,
    "aria-label": "Like",
    isDisabled: true,
    onChange: fn(),
    // @ts-expect-error - data-testid is not an official prop
    "data-testid": "test",
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");
    const onChange = args.onChange;

    await step("Is disabled", async () => {
      await expect(button).toBeDisabled();
      await expect(button).toHaveAttribute("data-disabled", "true");
    });

    await step("Cannot be clicked when disabled", async () => {
      await userEvent.click(button);
      await expect(onChange).not.toHaveBeenCalled();
    });
  },
};
