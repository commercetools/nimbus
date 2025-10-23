import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconToggleButton, Stack } from "@commercetools/nimbus";
import { userEvent, within, expect, fn } from "storybook/test";
import { ThumbUp, Star, Bookmark } from "@commercetools/nimbus-icons";
import { useState } from "react";

const meta: Meta<typeof IconToggleButton> = {
  title: "Components/Buttons/IconToggleButton",
  component: IconToggleButton,
};

export default meta;

type Story = StoryObj<typeof IconToggleButton>;

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
      await expect(button).not.toHaveAttribute("data-selected", "true");
    });

    await step("Can be toggled by clicking", async () => {
      await userEvent.click(button);
      await expect(onChange).toHaveBeenCalledTimes(1);
      await expect(onChange).toHaveBeenCalledWith(true);
      await expect(button).toHaveAttribute("data-selected", "true");
    });
  },
};

export const Variants: Story = {
  name: "Visual Variants",
  render: () => {
    return (
      <Stack gap="400">
        <Stack gap="200" align="center">
          <IconToggleButton variant="outline" aria-label="outline unselected">
            <Star />
          </IconToggleButton>
          <IconToggleButton
            variant="outline"
            isSelected
            aria-label="outline selected"
          >
            <Star />
          </IconToggleButton>
        </Stack>
        <Stack gap="200" align="center">
          <IconToggleButton variant="ghost" aria-label="ghost unselected">
            <Star />
          </IconToggleButton>
          <IconToggleButton
            variant="ghost"
            isSelected
            aria-label="ghost selected"
          >
            <Star />
          </IconToggleButton>
        </Stack>
      </Stack>
    );
  },
};

export const InContext: Story = {
  name: "Multiple in Context",
  render: () => {
    const [liked, setLiked] = useState(false);
    const [starred, setStarred] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    return (
      <Stack gap="200" align="center">
        <IconToggleButton
          isSelected={liked}
          onChange={setLiked}
          aria-label="Like"
          colorPalette="critical"
        >
          <ThumbUp />
        </IconToggleButton>
        <IconToggleButton
          isSelected={starred}
          onChange={setStarred}
          aria-label="Star"
          colorPalette="info"
        >
          <Star />
        </IconToggleButton>
        <IconToggleButton
          isSelected={bookmarked}
          onChange={setBookmarked}
          aria-label="Bookmark"
        >
          <Bookmark />
        </IconToggleButton>
      </Stack>
    );
  },
};
