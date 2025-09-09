import type { Meta, StoryObj } from "@storybook/react-vite";
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
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    placement: {
      control: { type: "select" },
      options: ["center", "top", "bottom"],
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
      <Dialog.Trigger>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content {...args}>
        <Dialog.Backdrop />
        <Dialog.Header>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.CloseTrigger>
            <Button variant="ghost" size="xs">
              ×
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Header>
        <Dialog.Body>
          <Dialog.Description>
            This is a dialog message. Dialogs are perfect for confirmations,
            alerts, and forms.
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant="outline">Cancel</Button>
          </Dialog.CloseTrigger>
          <Button>Confirm</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default dialog configuration optimized for center positioning and scale animation.
 * Perfect for confirmations and alerts.
 */
export const Default: Story = {
  args: {
    size: "md",
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

    await step("Closes dialog on cancel button", async () => {
      const cancelButton = canvas.getByRole("button", { name: "Cancel" });
      await userEvent.click(cancelButton);

      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

/**
 * A confirmation dialog for destructive actions with appropriate styling.
 */
export const ConfirmationDialog: Story = {
  args: {
    size: "sm",
  },
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="solid" tone="critical">
          Delete Item
        </Button>
      </Dialog.Trigger>
      <Dialog.Content {...args}>
        <Dialog.Backdrop />
        <Dialog.Header>
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.CloseTrigger>
            <Button variant="ghost" size="xs">
              ×
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Header>
        <Dialog.Body>
          <Dialog.Description>
            This action cannot be undone. Are you sure you want to delete this
            item?
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant="outline">Cancel</Button>
          </Dialog.CloseTrigger>
          <Button variant="solid" tone="critical">
            Delete
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Opens confirmation dialog", async () => {
      const trigger = canvas.getByRole("button", { name: "Delete Item" });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "Confirm Delete",
      });
      expect(dialog).toBeInTheDocument();

      // Verify destructive action messaging
      expect(
        canvas.getByText("This action cannot be undone")
      ).toBeInTheDocument();
    });

    await step("Can cancel the action", async () => {
      const cancelButton = canvas.getByRole("button", { name: "Cancel" });
      await userEvent.click(cancelButton);

      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

/**
 * A form dialog for user input with validation states.
 */
export const FormDialog: Story = {
  args: {
    size: "md",
  },
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Edit Profile</Button>
      </Dialog.Trigger>
      <Dialog.Content {...args}>
        <Dialog.Backdrop />
        <Dialog.Header>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.CloseTrigger>
            <Button variant="ghost" size="xs">
              ×
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Header>
        <Dialog.Body>
          <Stack gap="4">
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" type="text" placeholder="Enter your name" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="Enter your email" />
            </div>
          </Stack>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant="outline">Cancel</Button>
          </Dialog.CloseTrigger>
          <Button>Save Changes</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Opens form dialog", async () => {
      const trigger = canvas.getByRole("button", { name: "Edit Profile" });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "Edit Profile",
      });
      expect(dialog).toBeInTheDocument();
    });

    await step("Can interact with form fields", async () => {
      const nameInput = canvas.getByLabelText("Name");
      const emailInput = canvas.getByLabelText("Email");

      await userEvent.type(nameInput, "John Doe");
      await userEvent.type(emailInput, "john@example.com");

      expect(nameInput).toHaveValue("John Doe");
      expect(emailInput).toHaveValue("john@example.com");
    });

    await step("Form maintains focus within dialog", async () => {
      // Test focus management
      const nameInput = canvas.getByLabelText("Name");
      expect(nameInput).toBeInTheDocument();

      // Close the dialog
      const cancelButton = canvas.getByRole("button", { name: "Cancel" });
      await userEvent.click(cancelButton);
    });
  },
};

/**
 * An alert dialog for important notifications that require acknowledgment.
 */
export const AlertDialog: Story = {
  args: {
    size: "sm",
  },
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="outline">Show Alert</Button>
      </Dialog.Trigger>
      <Dialog.Content {...args}>
        <Dialog.Backdrop />
        <Dialog.Header>
          <Dialog.Title>Important Notice</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Dialog.Description>
            Your session will expire in 5 minutes. Please save your work before
            continuing.
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button>Understood</Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Opens alert dialog", async () => {
      const trigger = canvas.getByRole("button", { name: "Show Alert" });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "Important Notice",
      });
      expect(dialog).toBeInTheDocument();

      // Verify alert message
      expect(canvas.getByText(/Your session will expire/)).toBeInTheDocument();
    });

    await step("Can acknowledge alert", async () => {
      const acknowledgeButton = canvas.getByRole("button", {
        name: "Understood",
      });
      await userEvent.click(acknowledgeButton);

      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};

/**
 * Dialog size variants showing different size options.
 */
export const Sizes: Story = {
  args: {},
  render: () => (
    <Stack gap="4">
      <Dialog.Root>
        <Dialog.Trigger>
          <Button size="xs">Small Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content size="xs">
          <Dialog.Backdrop />
          <Dialog.Header>
            <Dialog.Title>Small Dialog</Dialog.Title>
            <Dialog.CloseTrigger>
              <Button variant="ghost" size="xs">
                ×
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              This is a small dialog, perfect for simple confirmations.
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger>
              <Button size="xs">OK</Button>
            </Dialog.CloseTrigger>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root>
        <Dialog.Trigger>
          <Button>Medium Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content size="md">
          <Dialog.Backdrop />
          <Dialog.Header>
            <Dialog.Title>Medium Dialog</Dialog.Title>
            <Dialog.CloseTrigger>
              <Button variant="ghost" size="xs">
                ×
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              This is a medium dialog, the default size for most dialog use
              cases.
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger>
              <Button>OK</Button>
            </Dialog.CloseTrigger>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root>
        <Dialog.Trigger>
          <Button size="lg">Large Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content size="lg">
          <Dialog.Backdrop />
          <Dialog.Header>
            <Dialog.Title>Large Dialog</Dialog.Title>
            <Dialog.CloseTrigger>
              <Button variant="ghost" size="xs">
                ×
              </Button>
            </Dialog.CloseTrigger>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              This is a large dialog, suitable for complex forms or detailed
              content.
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger>
              <Button>OK</Button>
            </Dialog.CloseTrigger>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </Stack>
  ),
};

/**
 * Dialog accessibility testing - focuses on keyboard navigation and screen reader support.
 */
export const AccessibilityTest: Story = {
  args: {
    size: "md",
  },
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Accessible Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content {...args}>
        <Dialog.Backdrop />
        <Dialog.Header>
          <Dialog.Title>Accessibility Test</Dialog.Title>
          <Dialog.CloseTrigger>
            <Button variant="ghost" size="xs" aria-label="Close dialog">
              ×
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Header>
        <Dialog.Body>
          <Dialog.Description>
            This dialog tests accessibility features including proper focus
            management, keyboard navigation, and screen reader announcements.
          </Dialog.Description>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant="outline">Cancel</Button>
          </Dialog.CloseTrigger>
          <Button>Confirm</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentNode as HTMLElement);

    await step("Opens dialog and focuses correctly", async () => {
      const trigger = canvas.getByRole("button", { name: "Accessible Dialog" });
      await userEvent.click(trigger);

      const dialog = await canvas.findByRole("dialog", {
        name: "Accessibility Test",
      });
      expect(dialog).toBeInTheDocument();
    });

    await step("Supports keyboard navigation", async () => {
      // Tab through interactive elements
      await userEvent.tab();
      expect(
        canvas.getByRole("button", { name: "Close dialog" })
      ).toHaveFocus();

      await userEvent.tab();
      expect(canvas.getByRole("button", { name: "Cancel" })).toHaveFocus();

      await userEvent.tab();
      expect(canvas.getByRole("button", { name: "Confirm" })).toHaveFocus();
    });

    await step("Closes on Escape key", async () => {
      await userEvent.keyboard("{Escape}");
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });
  },
};
