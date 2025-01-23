---
to: packages/bleh-ui/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.stories.tsx
---

import type { Meta, StoryObj } from "@storybook/react";
import { <%= h.changeCase.pascalCase(name) %> } from "./<%= h.changeCase.paramCase(name) %>";
import { Stack } from "./../stack";

const meta: Meta<typeof <%= h.changeCase.pascalCase(name) %>> = {
  title: "components/<%= h.changeCase.pascalCase(name) %>",
  component: <%= h.changeCase.pascalCase(name) %>,
};

export default meta;

type Story = StoryObj<typeof <%= h.changeCase.pascalCase(name) %>>;

export const Base: Story = {
  args: {
    children: "Demo <%= h.changeCase.pascalCase(name) %>",
  },
};

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