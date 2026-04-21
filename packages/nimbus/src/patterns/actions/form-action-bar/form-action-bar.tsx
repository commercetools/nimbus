import { Button } from "@/components/button/button";
import { Group } from "@/components/group/group";
import { LoadingSpinner } from "@/components/loading-spinner/loading-spinner";
import { useLocalizedStringFormatter } from "@/hooks";
import { formActionBarMessagesStrings } from "./form-action-bar.messages";
import type { FormActionBarProps } from "./form-action-bar.types";

/**
 * # FormActionBar
 *
 * A pattern providing save / cancel / optional delete buttons for form footers.
 *
 * Works inside any footer slot: `DefaultPage.Footer`, `ModalPage.Footer`,
 * `Drawer.Footer`, `Dialog.Footer`. Replaces separate form-page wrappers.
 *
 * @example
 * ```tsx
 * <FormActionBar
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 *   onDelete={handleDelete}
 *   isSaveDisabled={!isDirty}
 *   isSaveLoading={isSaving}
 * />
 * ```
 */
export const FormActionBar = ({
  onSave,
  onCancel,
  onDelete,
  saveLabel,
  cancelLabel,
  deleteLabel,
  isSaveDisabled = false,
  isSaveLoading = false,
  isDeleteLoading = false,
  "aria-label": ariaLabel,
  cancelSlot,
  buttonSize,
}: FormActionBarProps) => {
  const msg = useLocalizedStringFormatter(formActionBarMessagesStrings);
  const isBusy = isSaveLoading || isDeleteLoading;

  const resolvedSaveLabel = saveLabel ?? msg.format("save");
  const resolvedCancelLabel = cancelLabel ?? msg.format("cancel");
  const resolvedDeleteLabel = deleteLabel ?? msg.format("delete");
  const resolvedAriaLabel = ariaLabel ?? msg.format("ariaLabel");

  return (
    <Group aria-label={resolvedAriaLabel} gap="300">
      {onDelete && (
        <Button
          variant="solid"
          colorPalette="critical"
          size={buttonSize}
          isDisabled={isBusy}
          onPress={onDelete}
          data-slot="delete"
        >
          {resolvedDeleteLabel}
          {isDeleteLoading && <LoadingSpinner ml="100" size="2xs" />}
        </Button>
      )}
      <Button
        variant="outline"
        size={buttonSize}
        isDisabled={isBusy}
        onPress={onCancel}
        slot={cancelSlot}
        data-slot="cancel"
      >
        {resolvedCancelLabel}
      </Button>
      <Button
        variant="solid"
        colorPalette="primary"
        size={buttonSize}
        isDisabled={isSaveDisabled || isBusy}
        onPress={onSave}
        data-slot="save"
      >
        {resolvedSaveLabel}
        {isSaveLoading && <LoadingSpinner ml="100" size="2xs" />}
      </Button>
    </Group>
  );
};

FormActionBar.displayName = "FormActionBar";
