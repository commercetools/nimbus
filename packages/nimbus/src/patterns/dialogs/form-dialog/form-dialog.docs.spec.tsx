import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import {
  FormDialog,
  FormField,
  NimbusProvider,
  TextInput,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering
 * @docs-description Verify the FormDialog opens with form content and default localized button labels.
 * @docs-order 1
 */
describe("FormDialog - Basic rendering", () => {
  it("renders title, form content, and default Save/Cancel labels when isOpen is true", () => {
    render(
      <NimbusProvider>
        <FormDialog
          title="Edit display name"
          isOpen
          onSave={() => {}}
          onCancel={() => {}}
        >
          <FormField.Root>
            <FormField.Label>Display name</FormField.Label>
            <FormField.Input>
              <TextInput defaultValue="" />
            </FormField.Input>
          </FormField.Root>
        </FormDialog>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("heading", { name: "Edit display name" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Display name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("uses the string title as the dialog's accessible name", () => {
    render(
      <NimbusProvider>
        <FormDialog
          title="Edit profile"
          isOpen
          onSave={() => {}}
          onCancel={() => {}}
        >
          <FormField.Root>
            <FormField.Label>Display name</FormField.Label>
            <FormField.Input>
              <TextInput defaultValue="" />
            </FormField.Input>
          </FormField.Root>
        </FormDialog>
      </NimbusProvider>
    );

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Edit profile");
  });
});

/**
 * @docs-section save-and-cancel
 * @docs-title Save and Cancel callbacks
 * @docs-description Wire onSave and onCancel to consumer state to react to user choices.
 * @docs-order 2
 */
describe("FormDialog - Save and Cancel callbacks", () => {
  it("invokes onSave and closes the dialog when the save button is clicked", async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    const handleCancel = vi.fn();

    const ControlledFormDialog = () => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <FormDialog
          title="Edit display name"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSave={handleSave}
          onCancel={handleCancel}
        >
          <FormField.Root>
            <FormField.Label>Display name</FormField.Label>
            <FormField.Input>
              <TextInput defaultValue="" />
            </FormField.Input>
          </FormField.Root>
        </FormDialog>
      );
    };

    render(
      <NimbusProvider>
        <ControlledFormDialog />
      </NimbusProvider>
    );

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleCancel).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("invokes onCancel and closes the dialog when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    const handleCancel = vi.fn();

    const ControlledFormDialog = () => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <FormDialog
          title="Edit display name"
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onSave={handleSave}
          onCancel={handleCancel}
        >
          <FormField.Root>
            <FormField.Label>Display name</FormField.Label>
            <FormField.Input>
              <TextInput defaultValue="" />
            </FormField.Input>
          </FormField.Root>
        </FormDialog>
      );
    };

    render(
      <NimbusProvider>
        <ControlledFormDialog />
      </NimbusProvider>
    );

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(handleCancel).toHaveBeenCalledTimes(1);
    expect(handleSave).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section save-disabled
 * @docs-title Save Disabled
 * @docs-description Gate the save action behind consumer-side validity (e.g. required fields are empty).
 * @docs-order 3
 */
describe("FormDialog - Save disabled", () => {
  it("disables the save button when isSaveDisabled is true", () => {
    render(
      <NimbusProvider>
        <FormDialog
          title="Edit profile"
          isOpen
          isSaveDisabled
          onSave={() => {}}
          onCancel={() => {}}
        >
          <FormField.Root>
            <FormField.Label>Display name</FormField.Label>
            <FormField.Input>
              <TextInput defaultValue="" />
            </FormField.Input>
          </FormField.Root>
        </FormDialog>
      </NimbusProvider>
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeEnabled();
  });
});

/**
 * @docs-section custom-labels
 * @docs-title Custom button labels
 * @docs-description Override the default localized Save and Cancel labels via saveLabel and cancelLabel.
 * @docs-order 4
 */
describe("FormDialog - Custom labels", () => {
  it("renders custom saveLabel and cancelLabel when provided", () => {
    render(
      <NimbusProvider>
        <FormDialog
          title="New project"
          isOpen
          saveLabel="Create"
          cancelLabel="Discard"
          onSave={() => {}}
          onCancel={() => {}}
        >
          <FormField.Root>
            <FormField.Label>Project name</FormField.Label>
            <FormField.Input>
              <TextInput defaultValue="" />
            </FormField.Input>
          </FormField.Root>
        </FormDialog>
      </NimbusProvider>
    );

    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Discard" })).toBeInTheDocument();
  });
});
