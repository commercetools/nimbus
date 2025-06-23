import type { FormFieldErrorSlotProps } from "../form-field.slots";

export const FormFieldError = ({
  children: _children, // eslint-disable-line @typescript-eslint/no-unused-vars
  ..._errorSlotProps // eslint-disable-line @typescript-eslint/no-unused-vars
}: FormFieldErrorSlotProps) => {
  // This component now acts as a declarative marker for the FormFieldRoot
  // The actual rendering is handled by FormFieldRoot through children analysis
  // This approach is SSR-safe as it doesn't rely on useEffect or useState
  return null;
};
