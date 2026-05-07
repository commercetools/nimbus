import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within, expect, waitFor } from "storybook/test";
import { useState } from "react";
import {
  Badge,
  Button,
  Flex,
  FormField,
  Stack,
  Text,
  TextInput,
} from "@commercetools/nimbus";
import { FormDialog } from "./form-dialog";

const meta: Meta<typeof FormDialog> = {
  title: "patterns/dialogs/FormDialog",
  component: FormDialog,
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic controlled usage with a string title and a single form field.
 * Cancel and Save use the localized default labels. The play function
 * exercises every close path (Cancel button, Save button, X, Escape,
 * overlay click) and asserts that save and cancel callbacks fire on
 * exactly the expected paths.
 */
export const Base: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
    onOpenChange: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("Initial value");
    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      args.onOpenChange?.(open);
    };
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Edit name</Button>
        <FormDialog
          {...args}
          title="Edit display name"
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
        >
          <FormField.Root>
            <FormField.Label>Display name</FormField.Label>
            <FormField.Input>
              <TextInput value={name} onChange={setName} />
            </FormField.Input>
          </FormField.Root>
        </FormDialog>
      </>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const getTrigger = () => canvas.getByRole("button", { name: "Edit name" });
    const onSave = args.onSave as ReturnType<typeof fn>;
    const onCancel = args.onCancel as ReturnType<typeof fn>;
    const onOpenChange = args.onOpenChange as ReturnType<typeof fn>;

    await step("Dialog is not rendered initially", async () => {
      expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await step(
      "Opens on trigger click and exposes the title as accessible name",
      async () => {
        await userEvent.click(getTrigger());
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );
        expect(canvas.getByRole("dialog")).toHaveAccessibleName(
          "Edit display name"
        );
        expect(
          canvas.getByRole("heading", { name: "Edit display name" })
        ).toBeInTheDocument();
      }
    );

    await step("Form content renders inside the dialog body", async () => {
      expect(canvas.getByLabelText("Display name")).toBeInTheDocument();
    });

    await step("Renders default localized Save and Cancel labels", async () => {
      expect(canvas.getByRole("button", { name: "Save" })).toBeInTheDocument();
      expect(
        canvas.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });

    await step(
      "Cancel button click invokes onCancel, fires onOpenChange(false), and closes the dialog without firing onSave",
      async () => {
        onSave.mockClear();
        onCancel.mockClear();
        onOpenChange.mockClear();

        await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));

        await waitFor(() =>
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
        );
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onSave).not.toHaveBeenCalled();
      }
    );

    await step(
      "Save button click invokes onSave, fires onOpenChange(false), and closes the dialog without firing onCancel",
      async () => {
        onSave.mockClear();
        onCancel.mockClear();
        onOpenChange.mockClear();

        await userEvent.click(getTrigger());
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );

        onOpenChange.mockClear();
        await userEvent.click(canvas.getByRole("button", { name: "Save" }));

        await waitFor(() =>
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
        );
        expect(onSave).toHaveBeenCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onCancel).not.toHaveBeenCalled();
      }
    );

    await step(
      "Escape closes the dialog, invokes onCancel exactly once, and fires onOpenChange(false)",
      async () => {
        onSave.mockClear();
        onCancel.mockClear();
        onOpenChange.mockClear();

        await userEvent.click(getTrigger());
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );

        onOpenChange.mockClear();
        await userEvent.keyboard("{Escape}");

        await waitFor(() =>
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
        );
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onSave).not.toHaveBeenCalled();
      }
    );

    await step(
      "Close button (X) click invokes onCancel, fires onOpenChange(false), and closes the dialog",
      async () => {
        onSave.mockClear();
        onCancel.mockClear();
        onOpenChange.mockClear();

        await userEvent.click(getTrigger());
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );

        onOpenChange.mockClear();
        await userEvent.click(
          canvas.getByRole("button", { name: "Close dialog" })
        );

        await waitFor(() =>
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
        );
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onSave).not.toHaveBeenCalled();
      }
    );

    await step(
      "Overlay click invokes onCancel, fires onOpenChange(false), and closes the dialog",
      async () => {
        onSave.mockClear();
        onCancel.mockClear();
        onOpenChange.mockClear();

        await userEvent.click(getTrigger());
        const dialog = await waitFor(() => canvas.getByRole("dialog"));

        // Walk up to the modal overlay (whose direct parent is <body>) and
        // click its corner — outside the centered modal content.
        let overlay: HTMLElement | null = dialog;
        while (overlay && overlay.parentElement !== document.body) {
          overlay = overlay.parentElement;
        }
        expect(overlay).not.toBeNull();

        onOpenChange.mockClear();
        await userEvent.pointer([
          {
            target: overlay!,
            coords: { clientX: 2, clientY: 2 },
            keys: "[MouseLeft]",
          },
        ]);

        await waitFor(() =>
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
        );
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onSave).not.toHaveBeenCalled();
      }
    );
  },
};

/**
 * `saveLabel` and `cancelLabel` accept any ReactNode, so consumers can
 * pass `intl.formatMessage(...)` results directly.
 */
export const CustomLabels: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <FormDialog
        {...args}
        title="New project"
        saveLabel="Create"
        cancelLabel="Discard"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <FormField.Root>
          <FormField.Label>Project name</FormField.Label>
          <FormField.Input>
            <TextInput defaultValue="" />
          </FormField.Input>
        </FormField.Root>
      </FormDialog>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Renders custom Save and Cancel labels", async () => {
      await waitFor(() =>
        expect(canvas.getByRole("dialog")).toBeInTheDocument()
      );
      expect(
        canvas.getByRole("button", { name: "Create" })
      ).toBeInTheDocument();
      expect(
        canvas.getByRole("button", { name: "Discard" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * `isSaveDisabled` gates the save action — useful when consumer-side
 * validity is not yet satisfied (required form fields empty or
 * invalid). Cancel remains enabled so the user can always discard.
 */
export const SaveDisabled: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <FormDialog
        {...args}
        title="Edit profile"
        isSaveDisabled
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <FormField.Root>
          <FormField.Label>Display name</FormField.Label>
          <FormField.Input>
            <TextInput defaultValue="" />
          </FormField.Input>
        </FormField.Root>
      </FormDialog>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const onSave = args.onSave as ReturnType<typeof fn>;

    await step(
      "Save button is disabled and clicking it does not invoke onSave",
      async () => {
        onSave.mockClear();
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );

        const save = canvas.getByRole("button", { name: "Save" });
        expect(save).toBeDisabled();

        await userEvent.click(save);
        expect(onSave).not.toHaveBeenCalled();
        // Dialog stays open
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      }
    );

    await step("Cancel button remains enabled while save is disabled", () => {
      expect(canvas.getByRole("button", { name: "Cancel" })).toBeEnabled();
    });
  },
};

/**
 * `isSaveLoading` shows a spinner inside the save button and locks the
 * entire dialog: cancel and save are disabled, and Escape / overlay
 * click / close-button click are all suppressed for the duration —
 * preventing in-flight data loss. Consumers should hold this state
 * across an in-flight async save.
 */
export const LoadingLockout: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <FormDialog
        {...args}
        title="Saving…"
        isSaveLoading
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <FormField.Root>
          <FormField.Label>Display name</FormField.Label>
          <FormField.Input>
            <TextInput defaultValue="Pending" />
          </FormField.Input>
        </FormField.Root>
      </FormDialog>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const onSave = args.onSave as ReturnType<typeof fn>;
    const onCancel = args.onCancel as ReturnType<typeof fn>;

    await step("Both buttons are disabled while loading", async () => {
      await waitFor(() =>
        expect(canvas.getByRole("dialog")).toBeInTheDocument()
      );
      expect(canvas.getByRole("button", { name: "Save" })).toBeDisabled();
      expect(canvas.getByRole("button", { name: "Cancel" })).toBeDisabled();
    });

    await step(
      "Pressing Escape while loading is a no-op (dialog stays, no callbacks)",
      async () => {
        onSave.mockClear();
        onCancel.mockClear();

        await userEvent.keyboard("{Escape}");

        expect(canvas.getByRole("dialog")).toBeInTheDocument();
        expect(onCancel).not.toHaveBeenCalled();
        expect(onSave).not.toHaveBeenCalled();
      }
    );

    await step("Clicking the overlay while loading is a no-op", async () => {
      onSave.mockClear();
      onCancel.mockClear();

      const dialog = canvas.getByRole("dialog");
      let overlay: HTMLElement | null = dialog;
      while (overlay && overlay.parentElement !== document.body) {
        overlay = overlay.parentElement;
      }
      expect(overlay).not.toBeNull();

      await userEvent.pointer([
        {
          target: overlay!,
          coords: { clientX: 2, clientY: 2 },
          keys: "[MouseLeft]",
        },
      ]);

      expect(canvas.getByRole("dialog")).toBeInTheDocument();
      expect(onCancel).not.toHaveBeenCalled();
      expect(onSave).not.toHaveBeenCalled();
    });

    await step(
      "Clicking the close button (X) while loading is a no-op",
      async () => {
        onSave.mockClear();
        onCancel.mockClear();

        const closeButton = canvas.getByRole("button", {
          name: "Close dialog",
        });
        expect(closeButton).toBeDisabled();

        await userEvent.click(closeButton);

        expect(canvas.getByRole("dialog")).toBeInTheDocument();
        expect(onCancel).not.toHaveBeenCalled();
        expect(onSave).not.toHaveBeenCalled();
      }
    );
  },
};

/**
 * When `onSave` returns a `Promise`, the dialog stays open while the
 * promise is pending and closes automatically when it fulfills.
 * Consumers manage `isSaveLoading` themselves so the spinner /
 * lockout is visible during the in-flight period.
 */
export const AsyncSave: Story = {
  args: {
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    return (
      <FormDialog
        {...args}
        title="Edit profile"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isSaveLoading={isLoading}
        onSave={async () => {
          setIsLoading(true);
          try {
            await new Promise((resolve) => setTimeout(resolve, 200));
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <FormField.Root>
          <FormField.Label>Display name</FormField.Label>
          <FormField.Input>
            <TextInput defaultValue="New name" />
          </FormField.Input>
        </FormField.Root>
      </FormDialog>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Dialog opens with save button enabled", async () => {
      await waitFor(() =>
        expect(canvas.getByRole("dialog")).toBeInTheDocument()
      );
      expect(canvas.getByRole("button", { name: "Save" })).toBeEnabled();
    });

    await step(
      "Clicking save engages the loading lockout while the promise is in flight",
      async () => {
        await userEvent.click(canvas.getByRole("button", { name: "Save" }));

        await waitFor(() =>
          expect(canvas.getByRole("button", { name: "Save" })).toBeDisabled()
        );
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
        expect(canvas.getByRole("button", { name: "Cancel" })).toBeDisabled();
      }
    );

    await step("Dialog closes after the promise fulfills", async () => {
      await waitFor(
        () => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument(),
        { timeout: 2000 }
      );
    });
  },
};

/**
 * When `onSave` returns a rejected Promise, the dialog stays open so
 * the consumer can surface validation errors and let the user correct
 * and retry. The spinner / lockout reflects whatever `isSaveLoading`
 * the consumer holds across the failed attempt.
 */
export const AsyncSaveRejection: Story = {
  args: {
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    return (
      <FormDialog
        {...args}
        title="Edit profile"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isSaveLoading={isLoading}
        onSave={async () => {
          setIsLoading(true);
          try {
            await new Promise((_resolve, reject) =>
              setTimeout(() => reject(new Error("validation")), 200)
            );
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <FormField.Root>
          <FormField.Label>Display name</FormField.Label>
          <FormField.Input>
            <TextInput defaultValue="New name" />
          </FormField.Input>
        </FormField.Root>
      </FormDialog>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step(
      "Dialog stays open after the rejected promise settles",
      async () => {
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );

        await userEvent.click(canvas.getByRole("button", { name: "Save" }));

        // After the promise rejects and the consumer flips
        // isSaveLoading back to false, the dialog is still mounted and
        // the buttons are interactive again so the user can retry.
        await waitFor(
          () =>
            expect(canvas.getByRole("button", { name: "Save" })).toBeEnabled(),
          { timeout: 2000 }
        );
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      }
    );
  },
};

/**
 * Title accepts any ReactNode, so consumers can compose a heading with
 * inline elements like a badge or icon. When the composed title would
 * produce a confusing accessible name, pass an explicit `aria-label`.
 */
export const WithReactNodeTitle: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <FormDialog
        {...args}
        title={
          <Flex alignItems="center" gap="200">
            <Text>Edit billing</Text>
            <Badge>Pro</Badge>
          </Flex>
        }
        aria-label="Edit billing"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <FormField.Root>
          <FormField.Label>Billing email</FormField.Label>
          <FormField.Input>
            <TextInput defaultValue="" />
          </FormField.Input>
        </FormField.Root>
      </FormDialog>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Composed title renders with the badge", async () => {
      await waitFor(() =>
        expect(canvas.getByRole("dialog")).toBeInTheDocument()
      );
      expect(canvas.getByText("Edit billing")).toBeInTheDocument();
      expect(canvas.getByText("Pro")).toBeInTheDocument();
    });

    await step(
      "aria-label overrides the composed title as the dialog's accessible name",
      async () => {
        expect(canvas.getByRole("dialog")).toHaveAccessibleName("Edit billing");
      }
    );
  },
};

/**
 * Long form bodies scroll within the dialog body; the header (with
 * title and X) stays pinned at the top and the footer (with cancel /
 * save) stays pinned at the bottom.
 */
export const LongForm: Story = {
  args: {
    onSave: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);
    const fields = Array.from({ length: 20 }, (_, i) => (
      <FormField.Root key={i}>
        <FormField.Label>Field {i + 1}</FormField.Label>
        <FormField.Input>
          <TextInput defaultValue="" />
        </FormField.Input>
      </FormField.Root>
    ));
    return (
      <FormDialog
        {...args}
        title="Edit configuration"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Stack gap="400">{fields}</Stack>
      </FormDialog>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step(
      "Header and footer remain visible while long form is rendered",
      async () => {
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );
        expect(
          canvas.getByRole("heading", { name: "Edit configuration" })
        ).toBeInTheDocument();
        expect(
          canvas.getByRole("button", { name: "Save" })
        ).toBeInTheDocument();
        expect(
          canvas.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();
      }
    );

    await step(
      "Body scrolls to reveal the last field while header stays pinned",
      async () => {
        const lastField = canvas.getByLabelText("Field 20");
        const header = canvas.getByRole("heading", {
          name: "Edit configuration",
        });
        const headerTopBeforeScroll = header.getBoundingClientRect().top;

        lastField.scrollIntoView({ block: "end" });

        await waitFor(() => {
          const fieldRect = lastField.getBoundingClientRect();
          expect(fieldRect.top).toBeLessThan(window.innerHeight);
          expect(fieldRect.bottom).toBeGreaterThan(0);
        });

        expect(header.getBoundingClientRect().top).toBeCloseTo(
          headerTopBeforeScroll,
          0
        );
      }
    );
  },
};
