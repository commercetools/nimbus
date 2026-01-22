import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import {
  Dialog,
  Button,
  TextInput,
  NimbusProvider,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the dialog renders with expected elements
 * @docs-order 1
 */
describe("Dialog - Basic rendering", () => {
  it("renders trigger button", () => {
    render(
      <NimbusProvider>
        <Dialog.Root>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Body>Content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: "Open Dialog" })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section opening-closing
 * @docs-title Opening and Closing Interaction Tests
 * @docs-description Test opening and closing the dialog
 * @docs-order 2
 */
describe("Dialog - Opening and closing", () => {
  it("opens dialog when trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Body>Dialog content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });
  });

  it("closes dialog when close trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Body>Content</Dialog.Body>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Root>
      </NimbusProvider>
    );

    // Open dialog
    await user.click(screen.getByRole("button", { name: "Open" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    // Close dialog
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled component behavior
 * @docs-order 3
 */
describe("Dialog - Controlled mode", () => {
  const ControlledDialog = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <NimbusProvider>
        <Button onPress={() => setIsOpen(true)}>Open External</Button>
        <Dialog.Root isOpen={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content>
            <Dialog.Title>Controlled Dialog</Dialog.Title>
            <Dialog.Body>Content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>
      </NimbusProvider>
    );
  };

  it("opens dialog via external control", async () => {
    const user = userEvent.setup();
    render(<ControlledDialog />);

    await user.click(screen.getByRole("button", { name: "Open External" }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section form-submission
 * @docs-title Form Submission Tests
 * @docs-description Test form handling within dialogs
 * @docs-order 4
 */
describe("Dialog - Form submission", () => {
  const FormDialog = ({
    onSubmit,
  }: {
    onSubmit: (data: { name: string }) => void;
  }) => {
    const [name, setName] = useState("");

    return (
      <NimbusProvider>
        <Dialog.Root>
          <Dialog.Trigger>Add User</Dialog.Trigger>
          <Dialog.Content>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ name });
              }}
            >
              <Dialog.Header>
                <Dialog.Title>Create User</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <TextInput
                  aria-label="Name"
                  placeholder="Name"
                  value={name}
                  onChange={(value) => setName(value)}
                />
              </Dialog.Body>
              <Dialog.Footer>
                <Button type="submit">Create</Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      </NimbusProvider>
    );
  };

  it("submits form with entered data", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<FormDialog onSubmit={handleSubmit} />);

    // Open dialog
    await user.click(screen.getByRole("button", { name: "Add User" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    // Fill form
    await user.type(screen.getByPlaceholderText("Name"), "John Doe");

    // Submit
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(handleSubmit).toHaveBeenCalledWith({ name: "John Doe" });
  });
});

/**
 * @docs-section keyboard-navigation
 * @docs-title Keyboard Navigation Tests
 * @docs-description Test keyboard interactions
 * @docs-order 5
 */
describe("Dialog - Keyboard navigation", () => {
  it("closes dialog when Escape is pressed", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Body>Content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>
      </NimbusProvider>
    );

    // Open dialog
    await user.click(screen.getByRole("button", { name: "Open" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    // Press Escape
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("does not close when Escape is disabled", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Dialog.Root isKeyboardDismissDisabled>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Test Dialog</Dialog.Title>
            <Dialog.Body>Content</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    await user.keyboard("{Escape}");

    // Dialog should still be open
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
