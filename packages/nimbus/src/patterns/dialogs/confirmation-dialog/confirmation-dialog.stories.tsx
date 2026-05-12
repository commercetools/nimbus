import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within, expect, waitFor } from "storybook/test";
import { useState } from "react";
import { Badge, Button, Flex, Stack, Text } from "@commercetools/nimbus";
import { ConfirmationDialog } from "./confirmation-dialog";

const meta: Meta<typeof ConfirmationDialog> = {
  title: "patterns/dialogs/ConfirmationDialog",
  component: ConfirmationDialog,
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic controlled usage with the default intent. Cancel and Confirm
 * use the localized default labels. The play function exercises every
 * close path (Cancel button, Confirm button, X, Escape, overlay click)
 * and asserts that confirm and cancel callbacks fire on exactly the
 * expected paths.
 */
export const Base: Story = {
  args: {
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open confirmation</Button>
        <ConfirmationDialog
          {...args}
          title="Discard changes?"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Text>You will lose any unsaved changes.</Text>
        </ConfirmationDialog>
      </>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const getTrigger = () =>
      canvas.getByRole("button", { name: "Open confirmation" });
    const onConfirm = args.onConfirm as ReturnType<typeof fn>;
    const onCancel = args.onCancel as ReturnType<typeof fn>;

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
          "Discard changes?"
        );
        expect(
          canvas.getByRole("heading", { name: "Discard changes?" })
        ).toBeInTheDocument();
      }
    );

    await step(
      "Renders default localized Confirm and Cancel labels",
      async () => {
        expect(
          canvas.getByRole("button", { name: "Confirm" })
        ).toBeInTheDocument();
        expect(
          canvas.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();
      }
    );

    await step(
      "Cancel button click invokes onCancel and closes the dialog",
      async () => {
        onConfirm.mockClear();
        onCancel.mockClear();

        await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));

        await waitFor(() =>
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
        );
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onConfirm).not.toHaveBeenCalled();
      }
    );

    await step(
      "Confirm button click invokes onConfirm and closes the dialog without firing onCancel",
      async () => {
        onConfirm.mockClear();
        onCancel.mockClear();

        await userEvent.click(getTrigger());
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );

        await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));

        await waitFor(() =>
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
        );
        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onCancel).not.toHaveBeenCalled();
      }
    );

    await step(
      "Escape closes the dialog and invokes onCancel exactly once",
      async () => {
        onConfirm.mockClear();
        onCancel.mockClear();

        await userEvent.click(getTrigger());
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );

        await userEvent.keyboard("{Escape}");

        await waitFor(() =>
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
        );
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onConfirm).not.toHaveBeenCalled();
      }
    );

    await step(
      "Close button (X) click invokes onCancel and closes the dialog",
      async () => {
        onConfirm.mockClear();
        onCancel.mockClear();

        await userEvent.click(getTrigger());
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );

        await userEvent.click(canvas.getByRole("button", { name: /close/i }));

        await waitFor(() =>
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
        );
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onConfirm).not.toHaveBeenCalled();
      }
    );

    await step(
      "Overlay click invokes onCancel and closes the dialog",
      async () => {
        onConfirm.mockClear();
        onCancel.mockClear();

        await userEvent.click(getTrigger());
        const dialog = await waitFor(() => canvas.getByRole("dialog"));

        // Walk up to the modal overlay (whose direct parent is <body>) and
        // click its corner — outside the centered modal content.
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

        await waitFor(() =>
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
        );
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onConfirm).not.toHaveBeenCalled();
      }
    );
  },
};

/**
 * Destructive intent renders the confirm button with the critical
 * color palette, signalling that the action is irreversible (delete,
 * remove, discard).
 */
export const DestructiveIntent: Story = {
  args: {
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button colorPalette="critical" onPress={() => setIsOpen(true)}>
          Delete project
        </Button>
        <ConfirmationDialog
          {...args}
          title="Delete project"
          intent="destructive"
          confirmLabel="Delete"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Text>
            This will permanently delete the project and all its data.
          </Text>
        </ConfirmationDialog>
      </>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const onConfirm = args.onConfirm as ReturnType<typeof fn>;
    const onCancel = args.onCancel as ReturnType<typeof fn>;

    await step(
      "Opens with the destructive Delete confirm button visible",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Delete project" })
        );
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );
        expect(
          canvas.getByRole("button", { name: "Delete" })
        ).toBeInTheDocument();
      }
    );

    await step(
      "Clicking the destructive Delete confirm fires onConfirm and closes",
      async () => {
        onConfirm.mockClear();
        onCancel.mockClear();

        await userEvent.click(canvas.getByRole("button", { name: "Delete" }));

        await waitFor(() =>
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument()
        );
        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onCancel).not.toHaveBeenCalled();
      }
    );
  },
};

/**
 * `confirmLabel` and `cancelLabel` accept any ReactNode, so consumers
 * can pass `intl.formatMessage(...)` results directly.
 */
export const CustomLabels: Story = {
  args: {
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Submit order</Button>
        <ConfirmationDialog
          {...args}
          title="Submit order"
          confirmLabel="Place order"
          cancelLabel="Keep editing"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Text>You're about to submit this order for fulfillment.</Text>
        </ConfirmationDialog>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Renders custom Confirm and Cancel labels", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Submit order" })
      );
      await waitFor(() =>
        expect(canvas.getByRole("dialog")).toBeInTheDocument()
      );
      expect(
        canvas.getByRole("button", { name: "Place order" })
      ).toBeInTheDocument();
      expect(
        canvas.getByRole("button", { name: "Keep editing" })
      ).toBeInTheDocument();
    });
  },
};

/**
 * `isConfirmDisabled` gates the confirm action — useful when consumer-side
 * validity is not yet satisfied (e.g. a required acknowledgement
 * checkbox is unchecked).
 */
export const DisabledConfirm: Story = {
  args: {
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Acknowledge disclaimer</Button>
        <ConfirmationDialog
          {...args}
          title="Confirm acknowledgement"
          isConfirmDisabled
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Text>Please review the disclaimer before confirming.</Text>
        </ConfirmationDialog>
      </>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const onConfirm = args.onConfirm as ReturnType<typeof fn>;

    await step(
      "Confirm button is disabled and clicking it does not invoke onConfirm",
      async () => {
        onConfirm.mockClear();
        await userEvent.click(
          canvas.getByRole("button", { name: "Acknowledge disclaimer" })
        );
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );

        const confirm = canvas.getByRole("button", { name: "Confirm" });
        expect(confirm).toBeDisabled();

        await userEvent.click(confirm);
        expect(onConfirm).not.toHaveBeenCalled();
        // Dialog stays open
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      }
    );
  },
};

/**
 * `isConfirmLoading` shows a spinner inside the confirm button and
 * locks the entire dialog: cancel and confirm are disabled, and
 * Escape / overlay click / close-button click are all suppressed
 * for the duration. Consumers should hold this state across an
 * in-flight async confirm.
 */
export const LoadingLockout: Story = {
  args: {
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open loading dialog</Button>
        <ConfirmationDialog
          {...args}
          title="Submitting…"
          isConfirmLoading
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Text>Your request is being processed.</Text>
        </ConfirmationDialog>
      </>
    );
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const onConfirm = args.onConfirm as ReturnType<typeof fn>;
    const onCancel = args.onCancel as ReturnType<typeof fn>;

    await step("Both buttons are disabled while loading", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open loading dialog" })
      );
      await waitFor(() =>
        expect(canvas.getByRole("dialog")).toBeInTheDocument()
      );
      expect(canvas.getByRole("button", { name: /confirm/i })).toBeDisabled();
      expect(canvas.getByRole("button", { name: /cancel/i })).toBeDisabled();
    });

    await step(
      "Pressing Escape while loading is a no-op (dialog stays, no callbacks)",
      async () => {
        onConfirm.mockClear();
        onCancel.mockClear();

        await userEvent.keyboard("{Escape}");

        // Dialog still present
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
        expect(onCancel).not.toHaveBeenCalled();
        expect(onConfirm).not.toHaveBeenCalled();
      }
    );

    await step("Clicking the overlay while loading is a no-op", async () => {
      onConfirm.mockClear();
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
      expect(onConfirm).not.toHaveBeenCalled();
    });

    await step(
      "Clicking the close button (X) while loading is a no-op",
      async () => {
        onConfirm.mockClear();
        onCancel.mockClear();

        const closeButton = canvas.getByRole("button", { name: /close/i });
        expect(closeButton).toBeDisabled();

        await userEvent.click(closeButton);

        expect(canvas.getByRole("dialog")).toBeInTheDocument();
        expect(onCancel).not.toHaveBeenCalled();
        expect(onConfirm).not.toHaveBeenCalled();
      }
    );
  },
};

/**
 * When `onConfirm` returns a `Promise`, the dialog stays open while
 * the promise is pending and closes automatically when it fulfills.
 * Consumers manage `isConfirmLoading` themselves so the spinner /
 * lockout is visible during the in-flight period.
 */
export const AsyncConfirm: Story = {
  args: {
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Place order</Button>
        <ConfirmationDialog
          {...args}
          title="Submit order"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          isConfirmLoading={isLoading}
          onConfirm={async () => {
            setIsLoading(true);
            try {
              await new Promise((resolve) => setTimeout(resolve, 200));
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <Text>This will charge your card.</Text>
        </ConfirmationDialog>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Dialog opens with confirm button enabled", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Place order" })
      );
      await waitFor(() =>
        expect(canvas.getByRole("dialog")).toBeInTheDocument()
      );
      expect(canvas.getByRole("button", { name: /confirm/i })).toBeEnabled();
    });

    await step(
      "Clicking confirm engages the loading lockout while the promise is in flight",
      async () => {
        await userEvent.click(canvas.getByRole("button", { name: /confirm/i }));

        await waitFor(() =>
          expect(
            canvas.getByRole("button", { name: /confirm/i })
          ).toBeDisabled()
        );
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
        expect(canvas.getByRole("button", { name: /cancel/i })).toBeDisabled();
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
 * When `onConfirm` returns a rejected Promise, the dialog stays open so
 * the consumer can surface the error and let the user retry. The
 * spinner / lockout reflects whatever `isConfirmLoading` the consumer
 * holds across the failed attempt.
 */
export const AsyncConfirmRejection: Story = {
  args: {
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Try submit order</Button>
        <ConfirmationDialog
          {...args}
          title="Submit order"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          isConfirmLoading={isLoading}
          onConfirm={async () => {
            setIsLoading(true);
            try {
              await new Promise((_resolve, reject) =>
                setTimeout(() => reject(new Error("network")), 200)
              );
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <Text>This will charge your card.</Text>
        </ConfirmationDialog>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step(
      "Dialog stays open after the rejected promise settles",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Try submit order" })
        );
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );

        await userEvent.click(canvas.getByRole("button", { name: /confirm/i }));

        // After the promise rejects and the consumer flips
        // isConfirmLoading back to false, the dialog is still mounted
        // and the buttons are interactive again so the user can retry.
        await waitFor(
          () =>
            expect(
              canvas.getByRole("button", { name: /confirm/i })
            ).toBeEnabled(),
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
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Manage subscription</Button>
        <ConfirmationDialog
          {...args}
          title={
            <Flex alignItems="center" gap="200">
              <Text>Cancel subscription</Text>
              <Badge>Pro</Badge>
            </Flex>
          }
          aria-label="Cancel subscription"
          intent="destructive"
          confirmLabel="Cancel subscription"
          cancelLabel="Keep subscription"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Text>
            You'll keep access until the end of the current billing period.
          </Text>
        </ConfirmationDialog>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Composed title renders with the badge", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Manage subscription" })
      );
      await waitFor(() =>
        expect(canvas.getByRole("dialog")).toBeInTheDocument()
      );
      // The phrase "Cancel subscription" appears in both the composed
      // title text and the destructive confirm button label — assert
      // both occurrences are present and the badge alongside the title.
      expect(canvas.getAllByText("Cancel subscription")).toHaveLength(2);
      expect(canvas.getByText("Pro")).toBeInTheDocument();
    });

    await step(
      "aria-label overrides the composed title as the dialog's accessible name",
      async () => {
        expect(canvas.getByRole("dialog")).toHaveAccessibleName(
          "Cancel subscription"
        );
      }
    );
  },
};

/**
 * Long content scrolls within the body; the header (with title and X)
 * stays pinned at the top and the footer (with cancel/confirm) stays
 * pinned at the bottom.
 */
export const LongContent: Story = {
  args: {
    onConfirm: fn(),
    onCancel: fn(),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const paragraphs = Array.from({ length: 25 }, (_, i) => (
      <Text key={i}>
        Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
      </Text>
    ));
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Review terms</Button>
        <ConfirmationDialog
          {...args}
          title="Accept terms"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Stack gap="400">{paragraphs}</Stack>
        </ConfirmationDialog>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step(
      "Header and footer remain visible while long body content is rendered",
      async () => {
        await userEvent.click(
          canvas.getByRole("button", { name: "Review terms" })
        );
        await waitFor(() =>
          expect(canvas.getByRole("dialog")).toBeInTheDocument()
        );
        expect(
          canvas.getByRole("heading", { name: "Accept terms" })
        ).toBeInTheDocument();
        expect(
          canvas.getByRole("button", { name: "Confirm" })
        ).toBeInTheDocument();
        expect(
          canvas.getByRole("button", { name: "Cancel" })
        ).toBeInTheDocument();
      }
    );

    await step(
      "Body scrolls to reveal the last paragraph while header stays pinned",
      async () => {
        const lastParagraph = canvas.getByText(/^Paragraph 25:/);
        const header = canvas.getByRole("heading", { name: "Accept terms" });
        const headerTopBeforeScroll = header.getBoundingClientRect().top;

        lastParagraph.scrollIntoView({ block: "end" });

        await waitFor(() => {
          const paragraphRect = lastParagraph.getBoundingClientRect();
          expect(paragraphRect.top).toBeLessThan(window.innerHeight);
          expect(paragraphRect.bottom).toBeGreaterThan(0);
        });

        expect(header.getBoundingClientRect().top).toBeCloseTo(
          headerTopBeforeScroll,
          0
        );
      }
    );
  },
};
