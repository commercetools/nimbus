import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FormActionBar,
  NimbusProvider,
  Stack,
  Text,
  TextInputField,
} from "@commercetools/nimbus";

/**
 * @docs-section dirty-tracking
 * @docs-title Enable Save only when the form is dirty
 * @docs-description Track form dirtiness with local state and wire `isSaveDisabled` to the pristine state so consumers cannot save unchanged forms.
 * @docs-order 1
 */
describe("FormActionBar - Dirty tracking", () => {
  it("only submits when the form has pending changes", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    const initialValue = "Initial name";

    const DirtyTrackingForm = () => {
      const [value, setValue] = useState(initialValue);
      const isDirty = value !== initialValue;

      return (
        <Stack gap="400">
          <TextInputField
            label="Project name"
            value={value}
            onChange={setValue}
          />
          <FormActionBar
            onSave={() => handleSubmit(value)}
            onCancel={() => setValue(initialValue)}
            isSaveDisabled={!isDirty}
          />
        </Stack>
      );
    };

    render(
      <NimbusProvider>
        <DirtyTrackingForm />
      </NimbusProvider>
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const input = screen.getByRole("textbox", { name: /project name/i });

    expect(saveButton).toBeDisabled();

    await user.type(input, " updated");
    expect(saveButton).not.toBeDisabled();

    await user.click(saveButton);
    expect(handleSubmit).toHaveBeenCalledWith("Initial name updated");

    await user.click(cancelButton);
    expect(input).toHaveValue(initialValue);
    expect(saveButton).toBeDisabled();
  });
});

/**
 * @docs-section async-save
 * @docs-title Coordinate loading state with an async save handler
 * @docs-description Drive `isSaveLoading` from the consumer's async submit flow so all actions are disabled during the request and re-enabled on completion.
 * @docs-order 2
 */
describe("FormActionBar - Async save", () => {
  it("disables all actions during a pending save and re-enables them after", async () => {
    const user = userEvent.setup();

    let resolveSave: (() => void) | undefined;
    const saveEntity = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        })
    );

    const AsyncSaveForm = () => {
      const [isSaving, setIsSaving] = useState(false);

      const handleSave = async () => {
        setIsSaving(true);
        try {
          await saveEntity();
        } finally {
          setIsSaving(false);
        }
      };

      return (
        <FormActionBar
          onSave={handleSave}
          onCancel={vi.fn()}
          onDelete={vi.fn()}
          isSaveLoading={isSaving}
        />
      );
    };

    render(
      <NimbusProvider>
        <AsyncSaveForm />
      </NimbusProvider>
    );

    const saveButton = screen.getByRole("button", { name: /save/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    await user.click(saveButton);

    await waitFor(() => expect(saveButton).toBeDisabled());
    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
    expect(saveEntity).toHaveBeenCalledTimes(1);

    resolveSave?.();

    await waitFor(() => expect(saveButton).not.toBeDisabled());
    expect(cancelButton).not.toBeDisabled();
    expect(deleteButton).not.toBeDisabled();
  });
});

/**
 * @docs-section destructive-confirmation
 * @docs-title Gate delete behind a confirmation step
 * @docs-description Drive `isDeleteLoading` from the consumer's delete flow and keep the destructive action guarded behind an explicit confirmation.
 * @docs-order 3
 */
describe("FormActionBar - Destructive confirmation", () => {
  it("only deletes after the user confirms", async () => {
    const user = userEvent.setup();

    let resolveDelete: (() => void) | undefined;
    const deleteEntity = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveDelete = resolve;
        })
    );

    const DestructiveForm = () => {
      const [isConfirming, setIsConfirming] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        if (!isConfirming) {
          setIsConfirming(true);
          return;
        }
        setIsDeleting(true);
        try {
          await deleteEntity();
        } finally {
          setIsDeleting(false);
          setIsConfirming(false);
        }
      };

      return (
        <Stack gap="400">
          {isConfirming && (
            <Text role="alert">Press delete again to confirm.</Text>
          )}
          <FormActionBar
            onSave={vi.fn()}
            onCancel={vi.fn()}
            onDelete={handleDelete}
            isDeleteLoading={isDeleting}
          />
        </Stack>
      );
    };

    render(
      <NimbusProvider>
        <DestructiveForm />
      </NimbusProvider>
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });

    await user.click(deleteButton);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(deleteEntity).not.toHaveBeenCalled();

    await user.click(deleteButton);
    await waitFor(() => expect(deleteButton).toBeDisabled());
    expect(deleteEntity).toHaveBeenCalledTimes(1);

    resolveDelete?.();
    await waitFor(() => expect(deleteButton).not.toBeDisabled());
  });
});
