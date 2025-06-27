---
to: packages/nimbus/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.stories.tsx
---

import type { Meta, StoryObj } from "@storybook/react-vite";
import { <%= h.changeCase.pascalCase(name) %> } from "./<%= h.changeCase.paramCase(name) %>";
import { Stack } from "./../stack";

/**
 * Storybook metadata configuration
 * - title: determines the location in the sidebar
 * - component: references the component being documented
 */
const meta: Meta<typeof <%= h.changeCase.pascalCase(name) %>> = {
  title: "components/<%= h.changeCase.pascalCase(name) %>",
  component: <%= h.changeCase.pascalCase(name) %>,
};

export default meta;

/**
 * Story type for TypeScript support
 * StoryObj provides type checking for our story configurations
 */
type Story = StoryObj<typeof <%= h.changeCase.pascalCase(name) %>>;

/**
 * Base story
 * Demonstrates the most basic implementation
 * Uses the args pattern for dynamic control panel inputs
 */
export const Base: Story = {
  args: {
    children: "Demo <%= h.changeCase.pascalCase(name) %>",
  },
};

/**
 * Showcase Sizes
 */
export const Sizes: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {[].map((size) => (
          <<%= h.changeCase.pascalCase(name) %> key={size} {...args} size={size} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo <%= h.changeCase.pascalCase(name) %>",
  },
};

/**
 * Showcase Variants
 */
export const Variants: Story = {
  render: (args) => {
    return (
      <Stack direction="row" gap="400" alignItems="center">
        {[].map((variant) => (
          <<%= h.changeCase.pascalCase(name) %> key={variant} {...args} variant={variant} />
        ))}
      </Stack>
    );
  },

  args: {
    children: "Demo <%= h.changeCase.pascalCase(name) %>",
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
          <Stack key={colorPalette} direction="row" gap="400" alignItems="center">
            {[].map((variant) => (
              <<%= h.changeCase.pascalCase(name) %>
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
    children: "Demo <%= h.changeCase.pascalCase(name) %>",
  },
};
