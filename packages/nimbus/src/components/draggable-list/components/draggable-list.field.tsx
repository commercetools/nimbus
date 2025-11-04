import { FormField } from "@/components/form-field/form-field";
import type {
  DraggableListFieldProps,
  DraggableListFieldItemData,
} from "../draggable-list.types";
import { DraggableListRoot } from "./draggable-list.root";

/**
 * DraggableList.Field - A form field wrapper for DraggableList
 *
 * Combines draggable list functionality with form field labeling,
 * description, and error handling for form integration.
 *
 * @supportsStyleProps
 */
export const DraggableListField = <T extends DraggableListFieldItemData>({
  label,
  description,
  error,
  infoBox,
  isRequired,
  isInvalid,
  isDisabled,
  isReadOnly,
  id,
  items,
  ...restProps
}: DraggableListFieldProps<T>) => {
  return (
    <FormField.Root
      id={id}
      isRequired={isRequired}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    >
      <FormField.Label>{label}</FormField.Label>
      <FormField.Input>
        <DraggableListRoot
          disabledKeys={isDisabled ? items?.map((item) => item.key) : undefined}
          items={items}
          {...restProps}
        />
      </FormField.Input>
      {description && (
        <FormField.Description>{description}</FormField.Description>
      )}
      {error && <FormField.Error>{error}</FormField.Error>}
      {infoBox && <FormField.InfoBox>{infoBox}</FormField.InfoBox>}
    </FormField.Root>
  );
};

DraggableListField.displayName = "DraggableList.Field";
