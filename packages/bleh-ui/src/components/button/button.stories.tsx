import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Stack } from "./../stack";
import type { ButtonProps } from "./button.types";
import { userEvent, within, expect, fn } from "@storybook/test";

const meta: Meta<typeof Button> = {
  title: "components/Button",
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

const sizes: ButtonProps["size"][] = [
  "2xl",
  "xl",
  "lg",
  "md",
  "sm",
  "xs",
  "2xs",
];

const variants: ButtonProps["variant"][] = [
  "solid",
  "subtle",
  "outline",
  "ghost",
  "link",
  "plain",
];

const colors: ButtonProps["colorPalette"][] = [
  "neutral",
  "info",
  "success",
  "danger",
  "error",
];

export const Base: Story = {
  args: {
    children: "Button",
    onPress: fn(),
    // @ts-expect-error: works, but causes squiggly lines, investigate
    ["data-testid"]: "test",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");
    const onPress = args.onPress;

    // ATTENTION: react-aria does some complicated science,
    // if there is a **KEYSTROKE** before the click (like a tab-key aiming to focus the button),
    // the first click is not counted as a valid click

    await step("Is clickable", async () => {
      button.click();
      await expect(onPress).toHaveBeenCalledTimes(1);
      button.blur();
    });

    await step("Is focusable with <tab> key", async () => {
      await userEvent.tab();
      await expect(button).toHaveFocus();
    });

    await step("Can be triggered with enter", async () => {
      await userEvent.keyboard("{enter}");
      await expect(onPress).toHaveBeenCalledTimes(2);
    });

    await step("Can be triggered with space-bar", async () => {
      await expect(button).toHaveFocus();
      await userEvent.keyboard(" ");
      await expect(onPress).toHaveBeenCalledTimes(3);
    });
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    isDisabled: true,
    onPress: fn(),
    // @ts-expect-error: works, but causes squiggly lines, investigate
    ["data-testid"]: "test",
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");

    await step("Can not be clicked", async () => {
      await userEvent.click(button);
      await userEvent.click(button);
      await expect(args.onPress).toHaveBeenCalledTimes(0);
    });

    await step("Can not be focused", async () => {
      await userEvent.tab();
      await expect(button).not.toHaveFocus();
    });
  },
};

export const AsLink: Story = {
  args: {
    children: "Link disguised as Button",
    as: "a",
    href: "/",
    // @ts-expect-error: works, but causes squiggly lines, investigate
    ["data-testid"]: "test",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByTestId("test");

    await step("Uses an <a> element", async () => {
      await expect(link.tagName).toBe("A");
    });
  },
};

export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <Button key={size as string} {...args} size={size} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo Button",
  },
};

export const Variants: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {variants.map((size) => (
          <Button key={size as string} {...args} variant={size} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo Button",
  },
};

export const Colors: Story = {
  render: (args) => {
    return (
      <Stack>
        {colors.map((color) => (
          <Stack
            key={color as string}
            direction="row"
            gap="400"
            alignItems="center"
          >
            {variants.map((size) => (
              <Button
                key={size as string}
                {...args}
                variant={size}
                colorPalette={color}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo Button",
  },
};
