import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { useState } from "react";
import { Badge, Button, Flex, Stack, Text } from "@commercetools/nimbus";
import { InfoDialog } from "./info-dialog";

const meta: Meta<typeof InfoDialog> = {
  title: "patterns/dialogs/InfoDialog",
  component: InfoDialog,
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic controlled usage with a string title. The pattern has no trigger
 * slot — consumers render their own button and drive `isOpen` / `onOpenChange`.
 *
 * This story also exercises every close affordance (X button, Escape key,
 * overlay click) and verifies focus moves into the dialog on open and is
 * restored to the trigger on close.
 */
export const Base: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open info dialog</Button>
        <InfoDialog
          title="Shipping restrictions"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Text>
            Some goods cannot be shipped to the selected region. Review the
            restricted items and update the shipping address if needed.
          </Text>
        </InfoDialog>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    const getTrigger = () =>
      canvas.getByRole("button", { name: "Open info dialog" });

    await step("Dialog is not rendered initially", async () => {
      expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await step(
      "Opens on trigger click and exposes the title as accessible name",
      async () => {
        await userEvent.click(getTrigger());

        await waitFor(() => {
          expect(canvas.getByRole("dialog")).toBeInTheDocument();
        });

        const dialog = canvas.getByRole("dialog");
        expect(dialog).toHaveAccessibleName("Shipping restrictions");
        expect(
          canvas.getByRole("heading", { name: "Shipping restrictions" })
        ).toBeInTheDocument();
      }
    );

    await step("Moves focus into the dialog on open", async () => {
      const dialog = canvas.getByRole("dialog");
      await waitFor(() => {
        const active = document.activeElement;
        expect(active === dialog || dialog.contains(active)).toBeTruthy();
      });
    });

    await step("Closes via the X button and restores focus", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /close/i }));

      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(getTrigger()).toHaveFocus();
        },
        { timeout: 1000 }
      );
    });

    await step("Closes via the Escape key", async () => {
      await userEvent.click(getTrigger());

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      await userEvent.keyboard("{Escape}");

      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    await step("Closes when the overlay is clicked", async () => {
      await userEvent.click(getTrigger());

      const dialog = await waitFor(() => canvas.getByRole("dialog"));

      // React Aria's useInteractOutside listens on the document and fires
      // onOpenChange when a pointerdown lands outside the Dialog element.
      // The overlay/backdrop is an ancestor of the dialog but outside the
      // dialog's own subtree — walk up until we find a wrapper whose direct
      // parent is <body> and click its corner (outside the centered
      // modal content).
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

      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  },
};

/**
 * Title accepts any ReactNode, so consumers can compose a heading with inline
 * elements like a badge or icon.
 */
export const WithReactNodeTitle: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open info dialog</Button>
        <InfoDialog
          title={
            <Flex alignItems="center" gap="200">
              <Text>Plan details</Text>
              <Badge>Pro</Badge>
            </Flex>
          }
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Text>
            Your current plan includes unlimited projects and priority support.
          </Text>
        </InfoDialog>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Opens with a composed ReactNode title", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open info dialog" })
      );

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      expect(canvas.getByText("Plan details")).toBeInTheDocument();
      expect(canvas.getByText("Pro")).toBeInTheDocument();
    });
  },
};

/**
 * Long content scrolls within the dialog body; the header with the title and
 * close button stays pinned at the top.
 */
export const LongContent: Story = {
  render: () => {
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
        <Button onPress={() => setIsOpen(true)}>Open info dialog</Button>
        <InfoDialog
          title="Terms of service"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Stack gap="400">{paragraphs}</Stack>
        </InfoDialog>
      </>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Opens with long scrollable content", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Open info dialog" })
      );

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      expect(
        canvas.getByRole("heading", { name: "Terms of service" })
      ).toBeInTheDocument();
      expect(canvas.getByText(/Paragraph 1:/)).toBeInTheDocument();
      expect(
        canvas.getByRole("button", { name: /close/i })
      ).toBeInTheDocument();
    });
  },
};
