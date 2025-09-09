import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { within, expect, userEvent } from "storybook/test";
import { Modal } from "./modal";
import { Button, Stack, Text, Heading } from "@/components";

const meta: Meta<typeof Modal.Content> = {
  title: "components/Overlay/Modal",
  component: Modal.Content,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl", "cover", "full"],
    },
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
    <Modal.Root>
      <Modal.Trigger>Open Modal</Modal.Trigger>
      <Modal.Content {...args}>
        <Modal.Backdrop />
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
          <Modal.CloseTrigger>×</Modal.CloseTrigger>
        </Modal.Header>
        <Modal.Body>
          <Modal.Description>
            This is a modal dialog. You can add any content here.
          </Modal.Description>
        </Modal.Body>
        <Modal.Footer>
          <Modal.CloseTrigger>Cancel</Modal.CloseTrigger>
          <Button>Save</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default modal configuration with medium size and center placement.
 */
export const Default: Story = {
  args: {
    size: "md",
    placement: "center",
    scrollBehavior: "outside",
    motionPreset: "scale",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Opens modal on trigger click", async () => {
      const trigger = canvas.getByRole("button", { name: "Open Modal" });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", { name: "Modal Title" });
      expect(dialog).toBeInTheDocument();
    });

    await step("Closes modal on close button click", async () => {
      const footer = canvas.getByRole("contentinfo");
      const closeButton = within(footer).getByRole("button", { name: "Close modal" });
      await userEvent.click(closeButton);

      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

/**
 * Modal with different size variants.
 */
export const Sizes: Story = {
  args: {},
  render: () => (
    <Stack direction="row" wrap>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Modal.Root key={size}>
          <Modal.Trigger>{size.toUpperCase()}</Modal.Trigger>
          <Modal.Content size={size}>
            <Modal.Backdrop />
            <Modal.Header>
              <Modal.Title>Size: {size.toUpperCase()}</Modal.Title>
              <Modal.CloseTrigger>×</Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body>
              <Text>This modal demonstrates the "{size}" size variant.</Text>
            </Modal.Body>
            <Modal.Footer>
              <Modal.CloseTrigger>Close</Modal.CloseTrigger>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);
    const sizes = ["XS", "SM", "MD", "LG", "XL"];

    for (const size of sizes) {
      await step(`Opens ${size} modal and verifies accessibility`, async () => {
        const trigger = canvas.getByRole("button", { name: size });
        await userEvent.click(trigger);

        const dialog = await canvas.findByRole("dialog", {
          name: `Size: ${size}`,
        });
        expect(dialog).toBeInTheDocument();

        const closeButton = canvas.getByRole("button", { name: "Close modal" });
        await userEvent.click(closeButton);

        await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    }
  },
};

/**
 * Modal with different placement variants.
 */
export const Placements: Story = {
  args: {},
  render: () => (
    <Stack direction="row">
      {(["center", "top", "bottom"] as const).map((placement) => (
        <Modal.Root key={placement}>
          <Modal.Trigger>{placement}</Modal.Trigger>
          <Modal.Content placement={placement}>
            <Modal.Backdrop />
            <Modal.Header>
              <Modal.Title>Placement: {placement}</Modal.Title>
              <Modal.CloseTrigger>×</Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body>
              <Text>This modal is positioned at "{placement}".</Text>
            </Modal.Body>
            <Modal.Footer>
              <Modal.CloseTrigger>Close</Modal.CloseTrigger>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      ))}
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);
    const placements = ["center", "top", "bottom"];

    for (const placement of placements) {
      await step(`Tests ${placement} placement modal`, async () => {
        const trigger = canvas.getByRole("button", { name: placement });
        await userEvent.click(trigger);

        const dialog = await canvas.findByRole("dialog", {
          name: `Placement: ${placement}`,
        });
        expect(dialog).toBeInTheDocument();

        const closeButton = canvas.getByRole("button", { name: "Close modal" });
        await userEvent.click(closeButton);

        await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    }
  },
};

/**
 * Modal with scrollable content to test scroll behavior variants.
 */
export const ScrollBehavior: Story = {
  args: {},
  render: () => (
    <Stack direction="row">
      {(["inside", "outside"] as const).map((scrollBehavior) => (
        <Modal.Root key={scrollBehavior}>
          <Modal.Trigger>Scroll {scrollBehavior}</Modal.Trigger>
          <Modal.Content scrollBehavior={scrollBehavior} size="xs">
            <Modal.Backdrop />
            <Modal.Header>
              <Modal.Title>Scroll: {scrollBehavior}</Modal.Title>
              <Modal.CloseTrigger>×</Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body>
              <Stack>
                <Text>
                  This modal tests "{scrollBehavior}" scroll behavior with lots
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
            </Modal.Body>
            <Modal.Footer>
              <Modal.CloseTrigger>Close</Modal.CloseTrigger>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
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

      const closeButton = canvas.getByRole("button", { name: "Close modal" });
      await userEvent.click(closeButton);
    });
  },
};

/**
 * Modal with different motion presets for entrance animations.
 */
export const MotionPresets: Story = {
  args: {},
  render: () => (
    <Stack direction="row" wrap>
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
        <Modal.Root key={preset}>
          <Modal.Trigger>{preset}</Modal.Trigger>
          <Modal.Content motionPreset={preset}>
            <Modal.Backdrop />
            <Modal.Header>
              <Modal.Title>Motion: {preset}</Modal.Title>
              <Modal.CloseTrigger>×</Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body>
              <Text>This modal uses "{preset}" animation preset.</Text>
            </Modal.Body>
            <Modal.Footer>
              <Modal.CloseTrigger>Close</Modal.CloseTrigger>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      ))}
    </Stack>
  ),
};

/**
 * Modal without backdrop for special use cases.
 */
export const WithoutBackdrop: Story = {
  args: {},
  render: () => (
    <Modal.Root>
      <Modal.Trigger>Open Modal (No Backdrop)</Modal.Trigger>
      <Modal.Content hasBackdrop={false}>
        <Modal.Header>
          <Modal.Title>No Backdrop Modal</Modal.Title>
          <Modal.CloseTrigger>×</Modal.CloseTrigger>
        </Modal.Header>
        <Modal.Body>
          <Text>This modal has no backdrop overlay.</Text>
        </Modal.Body>
        <Modal.Footer>
          <Modal.CloseTrigger>Close</Modal.CloseTrigger>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Opens modal without backdrop", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Open Modal (No Backdrop)",
      });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "No Backdrop Modal",
      });
      expect(dialog).toBeInTheDocument();

      const closeButton = canvas.getByRole("button", { name: "Close modal" });
      await userEvent.click(closeButton);
    });
  },
};

/**
 * Modal with controlled state example.
 */
export const ControlledState: Story = {
  args: {},
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Stack>
        <Button onClick={() => setIsOpen(true)}>Open Controlled Modal</Button>
        <Text>Modal is {isOpen ? "open" : "closed"}</Text>

        <Modal.Root isOpen={isOpen} onOpenChange={setIsOpen}>
          <Modal.Content>
            <Modal.Backdrop />
            <Modal.Header>
              <Modal.Title>Controlled Modal</Modal.Title>
              <Modal.CloseTrigger>×</Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body>
              <Modal.Description>
                This modal's open state is controlled by parent component state.
              </Modal.Description>
            </Modal.Body>
            <Modal.Footer>
              <Modal.CloseTrigger>Cancel</Modal.CloseTrigger>
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Controls modal state externally", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Open Controlled Modal",
      });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "Controlled Modal",
      });
      expect(dialog).toBeInTheDocument();

      const saveButton = canvas.getByRole("button", { name: "Save" });
      await userEvent.click(saveButton);

      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

/**
 * Modal with keyboard navigation and accessibility testing.
 */
export const KeyboardNavigation: Story = {
  args: {},
  render: () => (
    <Modal.Root>
      <Modal.Trigger>Test Keyboard Navigation</Modal.Trigger>
      <Modal.Content>
        <Modal.Backdrop />
        <Modal.Header>
          <Modal.Title>Keyboard Navigation Test</Modal.Title>
          <Modal.CloseTrigger aria-label="Close modal">×</Modal.CloseTrigger>
        </Modal.Header>
        <Modal.Body>
          <Stack>
            <Modal.Description>
              Test keyboard navigation: Tab through focusable elements, Escape
              to close, Enter/Space on buttons.
            </Modal.Description>
            <Button>First Button</Button>
            <Button>Second Button</Button>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Modal.CloseTrigger>Cancel</Modal.CloseTrigger>
          <Button>Confirm</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
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

      // Test Escape key closes modal
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
      const firstButton = canvas.getByRole("button", { name: "First Button" });
      expect(firstButton).toHaveFocus();

      await userEvent.tab();
      const secondButton = canvas.getByRole("button", {
        name: "Second Button",
      });
      expect(secondButton).toHaveFocus();

      const closeButton = canvas.getByRole("button", { name: "Close modal" });
      await userEvent.click(closeButton);
    });
  },
};
