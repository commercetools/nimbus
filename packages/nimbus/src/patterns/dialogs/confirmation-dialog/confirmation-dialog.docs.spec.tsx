import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import {
  Button,
  ConfirmationDialog,
  NimbusProvider,
  Text,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering
 * @docs-description Verify the ConfirmationDialog opens with default localized button labels.
 * @docs-order 1
 */
describe("ConfirmationDialog - Basic rendering", () => {
  it("renders title, body, and default Confirm/Cancel labels when isOpen is true", () => {
    render(
      <NimbusProvider>
        <ConfirmationDialog
          title="Discard changes?"
          isOpen
          onConfirm={() => {}}
          onCancel={() => {}}
        >
          <Text>You will lose any unsaved changes.</Text>
        </ConfirmationDialog>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Discard changes?" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("You will lose any unsaved changes.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("uses the string title as the dialog's accessible name", () => {
    render(
      <NimbusProvider>
        <ConfirmationDialog
          title="Delete project"
          isOpen
          onConfirm={() => {}}
          onCancel={() => {}}
        >
          <Text>This action cannot be undone.</Text>
        </ConfirmationDialog>
      </NimbusProvider>
    );

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Delete project");
  });
});

/**
 * @docs-section confirm-and-cancel
 * @docs-title Confirm and Cancel callbacks
 * @docs-description Wire onConfirm and onCancel to consumer state to react to user choices.
 * @docs-order 2
 */
describe("ConfirmationDialog - Confirm and Cancel callbacks", () => {
  it("invokes onConfirm and closes the dialog when the confirm button is clicked", async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    const ControlledConfirmationDialog = () => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <ConfirmationDialog
          title="Submit order"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        >
          <Text>Submit this order for fulfillment.</Text>
        </ConfirmationDialog>
      );
    };

    render(
      <NimbusProvider>
        <ControlledConfirmationDialog />
      </NimbusProvider>
    );

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleCancel).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("invokes onCancel and closes the dialog when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    const ControlledConfirmationDialog = () => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <ConfirmationDialog
          title="Discard changes?"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        >
          <Text>You will lose any unsaved changes.</Text>
        </ConfirmationDialog>
      );
    };

    render(
      <NimbusProvider>
        <ControlledConfirmationDialog />
      </NimbusProvider>
    );

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleConfirm).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section destructive-intent
 * @docs-title Destructive intent
 * @docs-description Use intent="destructive" for delete, remove, and discard flows.
 * @docs-order 3
 */
describe("ConfirmationDialog - Destructive intent", () => {
  it("renders a destructive confirm button styled with the critical palette", () => {
    render(
      <NimbusProvider>
        <ConfirmationDialog
          title="Delete project"
          intent="destructive"
          confirmLabel="Delete"
          isOpen
          onConfirm={() => {}}
          onCancel={() => {}}
        >
          <Text>This will permanently delete the project.</Text>
        </ConfirmationDialog>
      </NimbusProvider>
    );

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });
});

/**
 * @docs-section loading-state
 * @docs-title Loading state lockout
 * @docs-description Hold the dialog open while an async confirm is in flight.
 * @docs-order 4
 */
describe("ConfirmationDialog - Loading state", () => {
  it("disables both buttons while isConfirmLoading is true", () => {
    render(
      <NimbusProvider>
        <ConfirmationDialog
          title="Submitting…"
          isOpen
          isConfirmLoading
          onConfirm={() => {}}
          onCancel={() => {}}
        >
          <Text>Your request is being processed.</Text>
        </ConfirmationDialog>
      </NimbusProvider>
    );

    expect(screen.getByRole("button", { name: /confirm/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });
});

/**
 * @docs-section disabled-confirm
 * @docs-title Gated confirm button
 * @docs-description Use isConfirmDisabled to gate confirm on consumer-side validity.
 * @docs-order 5
 */
describe("ConfirmationDialog - Disabled confirm", () => {
  it("disables the confirm button when isConfirmDisabled is true", async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();

    render(
      <NimbusProvider>
        <ConfirmationDialog
          title="Confirm acknowledgement"
          isOpen
          isConfirmDisabled
          onConfirm={handleConfirm}
          onCancel={() => {}}
        >
          <Text>Please review the disclaimer before confirming.</Text>
        </ConfirmationDialog>
      </NimbusProvider>
    );

    const confirm = screen.getByRole("button", { name: "Confirm" });
    expect(confirm).toBeDisabled();

    await user.click(confirm);
    expect(handleConfirm).not.toHaveBeenCalled();
  });
});

/**
 * @docs-section uncontrolled-state
 * @docs-title Uncontrolled open state
 * @docs-description Open the dialog by default with defaultOpen instead of managing state.
 * @docs-order 6
 */
describe("ConfirmationDialog - Uncontrolled state", () => {
  it("opens by default in uncontrolled mode via defaultOpen", () => {
    render(
      <NimbusProvider>
        <ConfirmationDialog
          title="Confirm action"
          defaultOpen
          onConfirm={() => {}}
          onCancel={() => {}}
        >
          <Text>Are you sure?</Text>
        </ConfirmationDialog>
      </NimbusProvider>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });
});

/**
 * @docs-section trigger-pattern
 * @docs-title Triggering from a button
 * @docs-description Render your own trigger and drive isOpen / onOpenChange from state.
 * @docs-order 7
 */
describe("ConfirmationDialog - Trigger pattern", () => {
  it("opens from a consumer-rendered trigger and closes after confirm", async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    const App = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <>
          <Button onPress={() => setIsOpen(true)}>Submit order</Button>
          <ConfirmationDialog
            title="Submit order"
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          >
            <Text>Submit this order for fulfillment.</Text>
          </ConfirmationDialog>
        </>
      );
    };

    render(
      <NimbusProvider>
        <App />
      </NimbusProvider>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Submit order" }));

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleCancel).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
