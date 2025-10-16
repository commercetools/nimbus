import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton, type IconButtonProps, Stack } from "@commercetools/nimbus";
import { Apps as DemoIcon } from "@commercetools/nimbus-icons";
import { createRef } from "react";
import { expect, fn, within, userEvent } from "storybook/test";

const meta: Meta<typeof IconButton> = {
  title: "Components/Buttons/IconButton",
  component: IconButton,
};

export default meta;

const sizes: IconButtonProps["size"][] = [
  //"2xl",
  //"xl",
  //"lg",
  "md",
  //"sm",
  "xs",
  "2xs",
];

const variants: IconButtonProps["variant"][] = [
  "solid",
  "subtle",
  "outline",
  "ghost",
  "link",
];

const tones: IconButtonProps["tone"][] = [
  "primary",
  "neutral",
  "critical",
] as const;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof IconButton>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    children: <DemoIcon />,
    onPress: fn(),
    ["data-testid"]: "test",
    ["aria-label"]: "test-button",
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId("test");
    const onPress = args.onPress;

    await step("Uses a <button> element by default", async () => {
      await expect(button.tagName).toBe("BUTTON");
    });

    await step("Forwards data- & aria-attributes", async () => {
      await expect(button).toHaveAttribute("data-testid", "test");
      await expect(button).toHaveAttribute("aria-label", "test-button");
    });

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

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  args: {
    children: <DemoIcon />,
    ["aria-label"]: "test-button",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <IconButton key={size as string} size={size} {...args} />
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Variants
 */
export const Variants: Story = {
  args: {
    children: <DemoIcon />,
    ["aria-label"]: "test-button",
  },
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {variants.map((variant) => (
          <IconButton key={variant as string} {...args} variant={variant} />
        ))}
      </Stack>
    );
  },
};

/**
 * Showcase Tones
 */
export const Tones: Story = {
  args: {
    children: <DemoIcon />,
    ["aria-label"]: "test-button",
  },
  render: (args) => {
    return (
      <Stack>
        {tones.map((tone) => (
          <Stack
            key={tone as string}
            direction="row"
            gap="400"
            alignItems="center"
          >
            {variants.map((variant) => (
              <IconButton
                key={variant as string}
                {...args}
                variant={variant}
                tone={tone}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },
};

const buttonRef = createRef<HTMLButtonElement>();

export const WithRef: Story = {
  args: {
    children: <DemoIcon />,
    ["aria-label"]: "test-button",
  },
  render: (args) => {
    return (
      <IconButton ref={buttonRef} {...args}>
        {args.children}
      </IconButton>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    await step("Does accept ref's", async () => {
      await expect(buttonRef.current).toBe(button);
    });
  },
};
