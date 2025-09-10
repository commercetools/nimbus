import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { within, expect, userEvent } from "storybook/test";
import { Dialog } from "./dialog";
import { Button, Stack, Text, Heading } from "@/components";

const meta: Meta<typeof Dialog.Content> = {
  title: "components/Overlay/Dialog",
  component: Dialog.Content,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: { type: "select" },
      options: ["center", "top", "bottom"],
    },
    scrollBehavior: {
      control: { type: "select" },
      options: ["inside", "outside"],
    },
    motionPreset: {
      control: { type: "select" },
      options: [
        "scale",
        "slide-in-bottom",
        "slide-in-top",
        "slide-in-left",
        "slide-in-right",
        "none",
      ],
    },
  },
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Content {...args}>
        <Dialog.Backdrop />
        <Dialog.Header>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>
          <Dialog.Description>
            This is a dialog dialog. You can add any content here.
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer>
          <Button>Cancel</Button>
          <Button>Save</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default dialog configuration with medium size and center placement.
 */
export const Default: Story = {
  args: {
    placement: "center",
    scrollBehavior: "outside",
    motionPreset: "scale",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Opens dialog on trigger click", async () => {
      const trigger = canvas.getByRole("button", { name: "Open Dialog" });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "Dialog Title",
      });
      expect(dialog).toBeInTheDocument();
    });

    await step("Closes dialog on close button click", async () => {
      const closeButton = canvas.getByRole("button", { name: "Close dialog" });
      await userEvent.click(closeButton);

      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

/**
 * Dialog with different placement variants.
 */
export const Placements: Story = {
  args: {},
  render: () => (
    <Stack direction="row">
      {(["center", "top", "bottom"] as const).map((placement) => (
        <Dialog.Root key={placement}>
          <Dialog.Trigger>{placement}</Dialog.Trigger>
          <Dialog.Content placement={placement}>
            <Dialog.Backdrop />
            <Dialog.Header>
              <Dialog.Title>Placement: {placement}</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <Text>This dialog is positioned at "{placement}".</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button>Close</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);
    const placements = ["center", "top", "bottom"];

    for (const placement of placements) {
      await step(`Tests ${placement} placement dialog`, async () => {
        const trigger = canvas.getByRole("button", { name: placement });
        await userEvent.click(trigger);

        const dialog = await canvas.findByRole("dialog", {
          name: `Placement: ${placement}`,
        });
        expect(dialog).toBeInTheDocument();

        const closeButton = canvas.getByRole("button", {
          name: "Close dialog",
        });
        await userEvent.click(closeButton);

        await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    }
  },
};

/**
 * Dialog with scrollable content to test scroll behavior variants.
 */
export const ScrollBehavior: Story = {
  args: {},
  render: () => (
    <Stack direction="row">
      {(["inside", "outside"] as const).map((scrollBehavior) => (
        <Dialog.Root key={scrollBehavior}>
          <Dialog.Trigger>Scroll {scrollBehavior}</Dialog.Trigger>
          <Dialog.Content scrollBehavior={scrollBehavior}>
            <Dialog.Backdrop />
            <Dialog.Header>
              <Dialog.Title>Scroll: {scrollBehavior}</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <Stack>
                <Text>
                  This dialog tests "{scrollBehavior}" scroll behavior with lots
                  of content.
                </Text>
                {Array.from({ length: 20 }, (_, i) => (
                  <Text key={i}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris.
                  </Text>
                ))}
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button>Close</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Tests inside scroll behavior", async () => {
      const trigger = canvas.getByRole("button", { name: "Scroll inside" });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "Scroll: inside",
      });
      expect(dialog).toBeInTheDocument();

      const closeButton = canvas.getByRole("button", { name: "Close dialog" });
      await userEvent.click(closeButton);
    });
  },
};

/**
 * Dialog with different motion presets for entrance animations.
 */
export const MotionPresets: Story = {
  args: {},
  render: () => (
    <Stack direction="row" flexWrap="wrap">
      {(
        [
          "scale",
          "slide-in-bottom",
          "slide-in-top",
          "slide-in-left",
          "slide-in-right",
          "none",
        ] as const
      ).map((preset) => (
        <Dialog.Root key={preset}>
          <Dialog.Trigger>{preset}</Dialog.Trigger>
          <Dialog.Content motionPreset={preset}>
            <Dialog.Backdrop />
            <Dialog.Header>
              <Dialog.Title>Motion: {preset}</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <Text>This dialog uses "{preset}" animation preset.</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button>Close</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Stack>
  ),
};

/**
 * Dialog without backdrop for special use cases.
 */
export const WithoutBackdrop: Story = {
  args: {},
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog (No Backdrop)</Dialog.Trigger>
      <Dialog.Content hasBackdrop={false}>
        <Dialog.Header>
          <Dialog.Title>No Backdrop Dialog</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>
          <Text>This dialog has no backdrop overlay.</Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button>Close</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Opens dialog without backdrop", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Open Dialog (No Backdrop)",
      });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "No Backdrop Dialog",
      });
      expect(dialog).toBeInTheDocument();

      const closeButton = canvas.getByRole("button", { name: "Close dialog" });
      await userEvent.click(closeButton);
    });
  },
};

/**
 * Dialog with controlled state example.
 */
export const ControlledState: Story = {
  args: {},
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Stack>
        <Button onClick={() => setIsOpen(true)}>Open Controlled Dialog</Button>
        <Text>Dialog is {isOpen ? "open" : "closed"}</Text>

        <Dialog.Root isOpen={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content>
            <Dialog.Backdrop />
            <Dialog.Header>
              <Dialog.Title>Controlled Dialog</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <Dialog.Description>
                This dialog's open state is controlled by parent component
                state.
              </Dialog.Description>
            </Dialog.Body>
            <Dialog.Footer>
              <Button>Cancel</Button>
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Controls dialog state externally", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Open Controlled Dialog",
      });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "Controlled Dialog",
      });
      expect(dialog).toBeInTheDocument();

      const saveButton = canvas.getByRole("button", { name: "Save" });
      await userEvent.click(saveButton);

      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

/**
 * Dialog with keyboard navigation and accessibility testing.
 */
export const KeyboardNavigation: Story = {
  args: {},
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>Test Keyboard Navigation</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Backdrop />
        <Dialog.Header>
          <Dialog.Title>Keyboard Navigation Test</Dialog.Title>
          <Dialog.CloseTrigger aria-label="Close dialog" />
        </Dialog.Header>
        <Dialog.Body>
          <Stack>
            <Dialog.Description>
              Test keyboard navigation: Tab through focusable elements, Escape
              to close, Enter/Space on buttons.
            </Dialog.Description>
            <Button>First Button</Button>
            <Button>Second Button</Button>
          </Stack>
        </Dialog.Body>
        <Dialog.Footer>
          <Button>Cancel</Button>
          <Button>Confirm</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Tests keyboard interactions", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Test Keyboard Navigation",
      });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "Keyboard Navigation Test",
      });
      expect(dialog).toBeInTheDocument();

      // Test Escape key closes dialog
      await userEvent.keyboard("{Escape}");
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await step("Tests focus management", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Test Keyboard Navigation",
      });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "Keyboard Navigation Test",
      });
      expect(dialog).toBeInTheDocument();

      // Test Tab navigation
      await userEvent.tab();
      const closeButton = canvas.getByRole("button", { name: "Close dialog" });
      expect(closeButton).toHaveFocus();

      await userEvent.tab();
      const firstButton = canvas.getByRole("button", { name: "First Button" });
      expect(firstButton).toHaveFocus();

      await userEvent.tab();
      const secondButton = canvas.getByRole("button", {
        name: "Second Button",
      });
      expect(secondButton).toHaveFocus();

      await userEvent.click(closeButton);
    });
  },
};
