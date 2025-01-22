import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof Button> = {
  title: "components/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Base: Story = {
  args: {
    //👇 The args you need here will depend on your component
    children: "Demo Button",
  },
};
