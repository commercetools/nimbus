---
to: packages/bleh-ui/src/components/<%= h.changeCase.paramCase(name) %>/<%= h.changeCase.paramCase(name) %>.stories.tsx
---

import type { Meta, StoryObj } from "@storybook/react";

import { <%= h.changeCase.pascalCase(name) %> } from "./<%= h.changeCase.paramCase(name) %>"

const meta: Meta<typeof <%= h.changeCase.pascalCase(name) %>> = {
  title: "components/<%= h.changeCase.pascalCase(name) %>",
  component: <%= h.changeCase.pascalCase(name) %>,
};

export default meta;

type Story = StoryObj<typeof <%= h.changeCase.pascalCase(name) %>>;

export const Base: Story = {
  args: {
    children: "<%= h.changeCase.pascalCase(name) %> Demo",
  },
};
