import { FormFieldRoot } from "./components/form-field.root";
import { FormFieldLabel } from "./components/form-field.label";
import { FormFieldInput } from "./components/form-field.input";
import { FormFieldDescription } from "./components/form-field.description";
import { FormFieldError } from "./components/form-field.error";
import { FormFieldInfoBox } from "./components/form-field.info-box";

export const FormField = {
  Root: FormFieldRoot,
  Label: FormFieldLabel,
  Input: FormFieldInput,
  Description: FormFieldDescription,
  Error: FormFieldError,
  InfoBox: FormFieldInfoBox,
};

export {
  FormFieldRoot as _FormFieldRoot,
  FormFieldLabel as _FormFieldLabel,
  FormFieldInput as _FormFieldInput,
  FormFieldDescription as _FormFieldDescription,
  FormFieldError as _FormFieldError,
  FormFieldInfoBox as _FormFieldInfoBox,
};
