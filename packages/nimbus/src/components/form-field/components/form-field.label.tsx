import type { FormFieldLabelSlotProps } from "../form-field.slots";

export const FormFieldLabel = ({
  children: _children, // eslint-disable-line @typescript-eslint/no-unused-vars
  ..._labelSlotProps // eslint-disable-line @typescript-eslint/no-unused-vars
}: FormFieldLabelSlotProps) => {
  // This component now acts as a declarative marker for the FormFieldRoot
  // The actual rendering is handled by FormFieldRoot through children analysis
  // This approach is SSR-safe as it doesn't rely on useEffect or useState
  return null;
};
