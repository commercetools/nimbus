import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Stack } from "./../stack";
import type { ButtonProps } from "./button.types";

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
    children: "Demo Button",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    isDisabled: true,
  },
};

export const AsLink: Story = {
  args: {
    children: "Link disguised as Button",
    as: "a",
    href: "/",
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
    //👇 The args you need here will depend on your component
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
    //👇 The args you need here will depend on your component
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
    //👇 The args you need here will depend on your component
    children: "Demo Button",
  },
};
