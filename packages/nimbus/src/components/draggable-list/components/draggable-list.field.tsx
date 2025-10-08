import { FormField } from "@/components/form-field";
import type {
  DraggableListFieldProps,
  DraggableListFieldItemData,
} from "../draggable-list.types";
import { DraggableListRoot } from "./draggable-list.root";

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
          disabledKeys={isDisabled ? "all" : undefined}
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
