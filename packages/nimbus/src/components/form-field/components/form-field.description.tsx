import type { FormFieldDescriptionSlotProps } from "../form-field.slots";

export const FormFieldDescription = ({
  children: _children, // eslint-disable-line @typescript-eslint/no-unused-vars
  ..._descriptionSlotProps // eslint-disable-line @typescript-eslint/no-unused-vars
}: FormFieldDescriptionSlotProps) => {
  // This component now acts as a declarative marker for the FormFieldRoot
  // The actual rendering is handled by FormFieldRoot through children analysis
  // This approach is SSR-safe as it doesn't rely on useEffect or useState
  return null;
};
