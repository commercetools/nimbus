import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "./stack";

const meta: Meta<typeof Stack> = {
  title: "Components/Stack",
  component: Stack,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Basic: Story = {
  args: {
    children: "Basic Stack",
  },
};

export const WithDirection: Story = {
  args: {
    direction: "row",
    children: (
      <>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </>
    ),
  },
};

export const WithSpacing: Story = {
  args: {
    children: (
      <>
        <Stack h="1200">Spaced Item 1</Stack>
        <Stack h="1200">Spaced Item 2</Stack>
        <Stack h="1200">Spaced Item 3</Stack>
      </>
    ),
  },
};

export const WithSeparator: Story = {
  args: {
    separator: <hr />,
    children: (
      <Stack separator={<hr />}>
        <Stack h="1200">Spaced Item with separator 1</Stack>
        <Stack h="1200">Spaced Item with separator 2</Stack>
        <Stack h="1200">Spaced Item with separator 3</Stack>
      </Stack>
    ),
  },
};
