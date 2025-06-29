import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./popover";
import { Stack, Button, Text, Box, Heading } from "@/components";
import { userEvent, within, expect } from "storybook/test";

const meta: Meta<typeof Popover.Content> = {
  title: "experimental/Popover",
  component: Popover.Content,
};

export default meta;

type Story = StoryObj<typeof Popover.Content>;

export const Base: Story = {
  args: {
    children: "Popover content goes here",
  },
  render: (args) => (
    <Popover.Root>
      <Popover.Trigger>No default look for the trigger</Popover.Trigger>
      <Popover.Content {...args} data-testid="test-popover" />
    </Popover.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open Popover" });

    await step("Opens popover on click", async () => {
      await userEvent.click(trigger);
      const popover = await canvas.findByTestId("test-popover");
      await expect(popover).toBeInTheDocument();
    });

    await step("Forwards data attributes", async () => {
      const popover = canvas.getByTestId("test-popover");
      await expect(popover).toHaveAttribute("data-testid", "test-popover");
    });
  },
};

// Placement stories
export const Placements: Story = {
  args: {
    children: "Positioned popover",
  },
  render: (args) => {
    const placements = ["top", "bottom", "left", "right"] as const;
    return (
      <Box p="800">
        <Stack
          direction="row"
          gap="400"
          alignItems="center"
          justifyContent="center"
        >
          {placements.map((placement, index) => (
            <Popover.Root key={index}>
              <Popover.Trigger asChild>
                <Button variant="outline">{placement}</Button>
              </Popover.Trigger>
              <Popover.Content {...args} placement={placement} />
            </Popover.Root>
          ))}
        </Stack>
      </Box>
    );
  },
};

// Rich content example
export const RichContent: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>
        <Button>Open Rich Popover</Button>
      </Popover.Trigger>
      <Popover.Content size="lg">
        <Stack gap="300">
          <Text fontSize="lg" fontWeight="600">
            Popover Title
          </Text>
          <Text>
            This is a more complex popover with multiple elements and rich
            content. It can contain any React components.
          </Text>
          <Stack direction="row" gap="200">
            <Button size="2xs" variant="solid">
              Action
            </Button>
            <Button size="2xs" variant="outline">
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  ),
};

// Controlled popover
export const Controlled: Story = {
  render: () => {
    const [isOpen, setOpen] = React.useState(false);

    return (
      <Stack gap="400">
        <Text>Popover is {isOpen ? "open" : "closed"}</Text>
        <Button mb="800" onPress={() => setOpen(!isOpen)}>
          Toggle Popover on/off
        </Button>
        <Popover.Root isOpen={isOpen} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <Button>Button with Popover</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Stack gap="300">
              <Text>This is a controlled popover.</Text>
              <Button size="2xs" onPress={() => setOpen(false)}>
                Close
              </Button>
            </Stack>
          </Popover.Content>
        </Popover.Root>
      </Stack>
    );
  },
};
