import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn } from "storybook/test";
import { FormActionBar } from "./form-action-bar";

const meta: Meta<typeof FormActionBar> = {
  title: "patterns/actions/FormActionBar",
  component: FormActionBar,
};

export default meta;

type Story = StoryObj<typeof FormActionBar>;

export const SaveAndCancel: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const saveButton = canvas.getByRole("button", { name: /save/i });
    const cancelButton = canvas.getByRole("button", { name: /cancel/i });

    await step(
      "Renders save and cancel buttons with default labels",
      async () => {
        await expect(saveButton).toBeInTheDocument();
        await expect(cancelButton).toBeInTheDocument();
      }
    );

    await step(
      "Does not render a delete button when onDelete is omitted",
      async () => {
        await expect(
          canvas.queryByRole("button", { name: /delete/i })
        ).not.toBeInTheDocument();
      }
    );

    await step("Invokes onSave when the save button is pressed", async () => {
      await userEvent.click(saveButton);
      await expect(args.onSave).toHaveBeenCalledTimes(1);
    });

    await step(
      "Invokes onCancel when the cancel button is pressed",
      async () => {
        await userEvent.click(cancelButton);
        await expect(args.onCancel).toHaveBeenCalledTimes(1);
      }
    );
  },
};

export const WithDelete: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
    onDelete: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const deleteButton = canvas.getByRole("button", { name: /delete/i });

    await step(
      "Renders a delete button when onDelete is provided",
      async () => {
        await expect(deleteButton).toBeInTheDocument();
      }
    );

    await step(
      "Invokes onDelete when the delete button is pressed",
      async () => {
        await userEvent.click(deleteButton);
        await expect(args.onDelete).toHaveBeenCalledTimes(1);
      }
    );
  },
};

export const CustomLabels: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
    onDelete: fn(),
    saveLabel: "Publish",
    cancelLabel: "Discard",
    deleteLabel: "Archive",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Renders provided custom labels instead of defaults",
      async () => {
        await expect(
          canvas.getByRole("button", { name: "Publish" })
        ).toBeInTheDocument();
        await expect(
          canvas.getByRole("button", { name: "Discard" })
        ).toBeInTheDocument();
        await expect(
          canvas.getByRole("button", { name: "Archive" })
        ).toBeInTheDocument();
      }
    );
  },
};

export const SaveDisabled: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
    isSaveDisabled: true,
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const saveButton = canvas.getByRole("button", { name: /save/i });
    const cancelButton = canvas.getByRole("button", { name: /cancel/i });

    await step(
      "Save button is disabled when isSaveDisabled is true",
      async () => {
        await expect(saveButton).toBeDisabled();
      }
    );

    await step(
      "Cancel button remains enabled while save is disabled",
      async () => {
        await expect(cancelButton).not.toBeDisabled();
      }
    );

    await step(
      "Disabled save button does not invoke onSave on click",
      async () => {
        await userEvent.click(saveButton);
        await expect(args.onSave).not.toHaveBeenCalled();
      }
    );
  },
};

export const SaveLoading: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
    onDelete: fn(),
    isSaveLoading: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");

    await step(
      "All buttons are disabled while saving (cancel and delete are locked to prevent escaping the in-flight mutation)",
      async () => {
        for (const button of buttons) {
          await expect(button).toBeDisabled();
        }
      }
    );

    await step(
      "Save label remains visible while loading (text is not swapped out)",
      async () => {
        const saveButton = canvas.getByRole("button", { name: /save/i });
        await expect(saveButton).toBeInTheDocument();
        await expect(saveButton).toHaveTextContent(/save/i);
      }
    );

    await step(
      "Spinner is rendered after the save label in DOM order",
      async () => {
        const saveButton = canvas.getByRole("button", { name: /save/i });
        const spinner = canvas.getByRole("progressbar");
        await expect(saveButton).toContainElement(spinner);
        const labelText = Array.from(saveButton.childNodes).find(
          (node) => node.textContent?.trim().toLowerCase() === "save"
        );
        await expect(labelText).toBeTruthy();
        const position = labelText!.compareDocumentPosition(spinner);
        await expect(
          position & Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeGreaterThan(0);
      }
    );
  },
};

export const DeleteLoading: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
    onDelete: fn(),
    isDeleteLoading: true,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");

    await step(
      "All buttons are disabled while deleting (cancel and save are locked to prevent escaping the in-flight mutation)",
      async () => {
        for (const button of buttons) {
          await expect(button).toBeDisabled();
        }
      }
    );

    await step(
      "Delete label remains visible while loading (text is not swapped out)",
      async () => {
        const deleteButton = canvas.getByRole("button", { name: /delete/i });
        await expect(deleteButton).toBeInTheDocument();
        await expect(deleteButton).toHaveTextContent(/delete/i);
      }
    );

    await step(
      "Spinner is rendered after the delete label in DOM order",
      async () => {
        const deleteButton = canvas.getByRole("button", { name: /delete/i });
        const spinner = canvas.getByRole("progressbar");
        await expect(deleteButton).toContainElement(spinner);
        const labelText = Array.from(deleteButton.childNodes).find(
          (node) => node.textContent?.trim().toLowerCase() === "delete"
        );
        await expect(labelText).toBeTruthy();
        const position = labelText!.compareDocumentPosition(spinner);
        await expect(
          position & Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeGreaterThan(0);
      }
    );
  },
};

export const KeyboardAndAriaGroup: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
    onDelete: fn(),
    "aria-label": "Custom form actions",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Group wrapper exposes the provided aria-label for assistive tech",
      async () => {
        await expect(
          canvas.getByRole("group", { name: "Custom form actions" })
        ).toBeInTheDocument();
      }
    );

    await step(
      "Buttons are reachable by Tab in document order: delete, cancel, save",
      async () => {
        await userEvent.click(document.body);

        const deleteButton = canvas.getByRole("button", { name: /delete/i });
        const cancelButton = canvas.getByRole("button", { name: /cancel/i });
        const saveButton = canvas.getByRole("button", { name: /save/i });

        await userEvent.tab();
        await expect(deleteButton).toHaveFocus();

        await userEvent.tab();
        await expect(cancelButton).toHaveFocus();

        await userEvent.tab();
        await expect(saveButton).toHaveFocus();
      }
    );

    await step(
      "Shift+Tab walks focus backwards through the group",
      async () => {
        const cancelButton = canvas.getByRole("button", { name: /cancel/i });
        const deleteButton = canvas.getByRole("button", { name: /delete/i });

        await userEvent.tab({ shift: true });
        await expect(cancelButton).toHaveFocus();

        await userEvent.tab({ shift: true });
        await expect(deleteButton).toHaveFocus();
      }
    );
  },
};

export const CustomButtonSize: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
    onDelete: fn(),
    buttonSize: "xs",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole("button");

    await step("All three buttons receive the same size", async () => {
      const heights = buttons.map(
        (button) => window.getComputedStyle(button).height
      );
      const unique = new Set(heights);
      await expect(unique.size).toBe(1);
    });

    await step(
      "buttonSize='xs' renders shorter than the default md size",
      async () => {
        const saveButton = canvas.getByRole("button", { name: /save/i });
        const height = parseFloat(window.getComputedStyle(saveButton).height);
        await expect(height).toBeLessThan(40);
      }
    );
  },
};

export const CancelSlotPassthrough: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
    cancelSlot: "close",
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "cancelSlot forwards to the underlying Button slot attribute so React Aria Dialog can wire its close handler",
      async () => {
        const cancelButton = canvas.getByRole("button", { name: /cancel/i });
        await expect(cancelButton).toHaveAttribute("slot", "close");
      }
    );

    await step("Save button does not receive a slot", async () => {
      const saveButton = canvas.getByRole("button", { name: /save/i });
      await expect(saveButton).not.toHaveAttribute("slot");
    });
  },
};
