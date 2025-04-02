import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup } from "./button-group";
import { Stack } from "./../stack";
import type { ButtonProps } from "@/components";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof ButtonGroup> = {
  title: "components/ButtonGroup",
  component: ButtonGroup,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof ButtonGroup>;

const sizes: ButtonProps["size"][] = ["md", "xs"];

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    children: (
      <>
        <ButtonGroup.Button>Left</ButtonGroup.Button>
        <ButtonGroup.Button>Center</ButtonGroup.Button>
        <ButtonGroup.Button>Right</ButtonGroup.Button>
      </>
    ),
  },
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {sizes.map((size) => (
          <ButtonGroup key={size as string} {...args} size={size}>
            <ButtonGroup.Button>Left</ButtonGroup.Button>
            <ButtonGroup.Button>Center</ButtonGroup.Button>
            <ButtonGroup.Button>Right</ButtonGroup.Button>
          </ButtonGroup>
        ))}
      </Stack>
    );
  },

  args: {},
};

/**
 * Showcase Variants
 */
export const Variants: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {[].map((variant) => (
          <ButtonGroup key={variant} {...args} variant={variant} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo ButtonGroup",
  },
};

/**
 * Showcase Colors
 */
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
              <ButtonGroup
                key={variant}
                {...args}
                variant={variant}
                colorPalette={colorPalette}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo ButtonGroup",
  },
};
