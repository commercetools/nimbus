import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./box";

const meta: Meta<typeof Box> = {
  title: "Components/Box",
  component: Box,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Box>;

export const Basic: Story = {
  args: {
    p: "100",
    bg: "primary.3",
    children: "Basic Box",
  },
};

export const WithBorder: Story = {
  args: {
    p: "100",
    border: "solid-50",
    borderColor: "primary.3",
    children: "Box with border",
  },
};

export const AsFlexContainer: Story = {
  args: {
    display: "grid",
    children: (
      <>
        <Box p="100" bg="primary.3">
          Item 1
        </Box>
        <Box p="100" bg="primary.3">
          Item 2
        </Box>
        <Box p="100" bg="primary.3">
          Item 3
        </Box>
      </>
    ),
  },
};

export const WithShadow: Story = {
  args: {
    p: "100",
    shadow: "6",
    borderRadius: "100",
    children: "Box with shadow",
  },
};

export const AsChild: Story = {
  args: {
    p: "100",
    bg: "primary.3",
    color: "primary.11",
    asChild: true,
    children: (
      <button onClick={() => alert("Clicked!")}>
        Click me! I am a button with Box styles
      </button>
    ),
  },
};
