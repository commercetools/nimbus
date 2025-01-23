import type { Meta, StoryObj } from "@storybook/react";
import { MehButton } from "./meh-button";
import { Stack } from "./../stack";

const meta: Meta<typeof MehButton> = {
  title: "components/MehButton",
  component: MehButton,
};

export default meta;

type Story = StoryObj<typeof MehButton>;

export const Base: Story = {
  args: {
    children: "Demo MehButton",
  },
};

export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {[].map((size) => (
          <MehButton key={size} {...args} size={size} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo MehButton",
  },
};

export const Variants: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {[].map((variant) => (
          <MehButton key={variant} {...args} variant={variant} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo MehButton",
  },
};

export const Colors: Story = {
  render: (args) => {
    return (
      <Stack>
        {[].map((colorPalette) => (
          <Stack
            key={colorPalette}
            direction="row"
            gap="400"
            alignItems="center"
          >
            {[].map((variant) => (
              <MehButton
                key={variant}
                variant={variant}
                {...args}
                colorPalette={colorPalette}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo MehButton",
  },
};
