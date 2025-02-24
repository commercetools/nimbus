import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "../box";
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
    children: [
      <Box key="1" p="400" bg="primary.7">
        Item 1
      </Box>,
      <Box key="1" p="400" bg="primary.7">
        Item 2
      </Box>,
    ],
  },
};

export const WithDirection: Story = {
  args: {
    direction: "column",
    children: [
      <Box key="1" p="400" bg="primary.7">
        Item 1
      </Box>,
      <Box key="2" p="400" bg="primary.7">
        Item 2
      </Box>,
      // <Box key="3" p="400" bg="primary.7">
      //   Item 3
      // </Box>,
    ],
  },
  argTypes: {
    direction: {
      options: ["row", "column", "row-reverse", "column-reverse"],
      control: { type: "radio" },
    },
  },
};

export const WithSpacing: Story = {
  args: {
    gap: "100",
    children: [
      <Box key="1" p="400" bg="primary.7">
        Spaced Item 1
      </Box>,
      <Box key="1" p="400" bg="primary.7">
        Spaced Item 2
      </Box>,
      <Box key="1" p="400" bg="primary.7">
        Spaced Item 3
      </Box>,
    ],
  },
};

export const WithSeparator: Story = {
  args: {
    separator: <hr />,
    children: [
      <Box key="1" p="400" bg="primary.7">
        Spaced Item with separator 1
      </Box>,
      <Box key="1" p="400" bg="primary.7">
        Spaced Item with separator 2
      </Box>,
      <Box key="1" p="400" bg="primary.7">
        Spaced Item with separator 3
      </Box>,
    ],
  },
};
