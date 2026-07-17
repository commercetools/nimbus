import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { Button, Popover, Stack, Text, TextInput } from "@commercetools/nimbus";

const meta: Meta<typeof Popover.Root> = {
  title: "Components/Overlay/Popover",
  component: Popover.Root,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Popover.Root>;

export const Default: Story = {
  render: (args) => (
    <Popover.Root {...args}>
      <Popover.Trigger asChild>
        <Button>Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Text>Popover content goes here</Text>
      </Popover.Content>
    </Popover.Root>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Trigger is rendered", async () => {
      const trigger = canvas.getByRole("button", { name: "Open Popover" });
      expect(trigger).toBeInTheDocument();
    });

    await step("Opens on trigger click", async () => {
      const trigger = canvas.getByRole("button", { name: "Open Popover" });
      await userEvent.click(trigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      expect(canvas.getByText("Popover content goes here")).toBeInTheDocument();
    });

    await step("Closes on Escape key", async () => {
      await userEvent.keyboard("{Escape}");

      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    await step("Focus returns to trigger after close", async () => {
      const trigger = canvas.getByRole("button", { name: "Open Popover" });
      await waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });
  },
};

export const StaysOpenOnInternalInteraction: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button>Edit Settings</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Stack gap="200">
          <TextInput aria-label="Name" placeholder="Enter name" />
          <Button variant="solid" size="sm">
            Save
          </Button>
        </Stack>
      </Popover.Content>
    </Popover.Root>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open the popover", async () => {
      const trigger = canvas.getByRole("button", { name: "Edit Settings" });
      await userEvent.click(trigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("Popover stays open when clicking internal input", async () => {
      const input = canvas.getByRole("textbox", { name: "Name" });
      await userEvent.click(input);
      await userEvent.type(input, "Test value");

      expect(canvas.getByRole("dialog")).toBeInTheDocument();
    });

    await step("Popover stays open when clicking internal button", async () => {
      const saveButton = canvas.getByRole("button", { name: "Save" });
      await userEvent.click(saveButton);

      expect(canvas.getByRole("dialog")).toBeInTheDocument();
    });
  },
};

export const ControlledMode: Story = {
  args: {
    onOpenChange: fn(),
  },

  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Stack gap="200">
        <Text>Popover is {isOpen ? "open" : "closed"}</Text>
        <Popover.Root
          isOpen={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            args.onOpenChange?.(open);
          }}
        >
          <Popover.Trigger asChild>
            <Button>Toggle Popover</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Text>Controlled content</Text>
          </Popover.Content>
        </Popover.Root>
      </Stack>
    );
  },

  play: async ({ args, canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Initially closed", async () => {
      expect(canvas.getByText("Popover is closed")).toBeInTheDocument();
      expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await step("Opens via trigger and calls onOpenChange", async () => {
      const trigger = canvas.getByRole("button", { name: "Toggle Popover" });
      await userEvent.click(trigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
      expect(canvas.getByText("Popover is open")).toBeInTheDocument();
      expect(args.onOpenChange).toHaveBeenCalledWith(true);
    });

    await step("Closes via Escape and calls onOpenChange", async () => {
      await userEvent.keyboard("{Escape}");

      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
      expect(canvas.getByText("Popover is closed")).toBeInTheDocument();
      expect(args.onOpenChange).toHaveBeenCalledWith(false);
    });
  },
};

export const AsChildTrigger: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm">
          Custom Trigger
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Text>Works with asChild</Text>
      </Popover.Content>
    </Popover.Root>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Custom trigger renders and opens popover", async () => {
      const trigger = canvas.getByRole("button", { name: "Custom Trigger" });
      await userEvent.click(trigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      expect(canvas.getByText("Works with asChild")).toBeInTheDocument();
    });
  },
};

export const ClosesOnOutsideClick: Story = {
  render: () => (
    <Stack gap="400">
      <Text>Click here (outside) to close</Text>
      <Popover.Root defaultOpen>
        <Popover.Trigger asChild>
          <Button>Open Popover</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Text>This should close on outside click</Text>
        </Popover.Content>
      </Popover.Root>
    </Stack>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Popover is initially open via defaultOpen", async () => {
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });

    await step("Closes when clicking outside", async () => {
      const outsideText = canvas.getByText("Click here (outside) to close");
      await userEvent.click(outsideText);

      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  },
};
