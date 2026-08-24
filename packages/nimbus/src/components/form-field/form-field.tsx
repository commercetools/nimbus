import {
  FormFieldRoot,
  FormFieldLabel,
  FormFieldInput,
  FormFieldDescription,
  FormFieldError,
  FormFieldInfoBox,
} from "./components";

export const FormField = {
  /**
   * # FormField.Root
   *
   * The root container for the form field that provides context and state management
   * for all child components. Handles React Aria integration for accessibility,
   * manages field state (required, invalid, disabled, readonly), and coordinates
   * rendering of label, input, description, and error elements.
   *
   * @example
   * ```tsx
   * <FormField.Root isRequired isInvalid>
   *   <FormField.Label>Username</FormField.Label>
   *   <FormField.Input>
   *     <TextInput />
   *   </FormField.Input>
   *   <FormField.Description>Enter your username</FormField.Description>
   *   <FormField.Error>Username is required</FormField.Error>
   * </FormField.Root>
   * ```
   */
  Root: FormFieldRoot,

  /**
   * # FormField.Label
   *
   * The label element for the form field. Automatically associates with the input
   * via React Aria and displays a required indicator when the field is required.
   * Supports an optional info box trigger for additional field information.
   *
   * @example
   * ```tsx
   * <FormField.Root>
   *   <FormField.Label>Email Address</FormField.Label>
   *   <FormField.InfoBox>
   *     Your email will be used for account notifications
   *   </FormField.InfoBox>
   *   <FormField.Input>
   *     <TextInput />
   *   </FormField.Input>
   * </FormField.Root>
   * ```
   */
  Label: FormFieldLabel,

  /**
   * # FormField.Input
   *
   * The input wrapper element that receives and displays the actual input component.
   * Automatically clones children and passes accessibility props, validation state,
   * and field attributes from React Aria.
   *
   * @example
   * ```tsx
   * <FormField.Root>
   *   <FormField.Label>Password</FormField.Label>
   *   <FormField.Input>
   *     <PasswordInput />
   *   </FormField.Input>
   * </FormField.Root>
   * ```
   */
  Input: FormFieldInput,

  /**
   * # FormField.Description
   *
   * The description element that provides helpful information about the field.
   * Automatically associates with the input via `aria-describedby` for screen readers.
   *
   * @example
   * ```tsx
   * <FormField.Root>
   *   <FormField.Label>Username</FormField.Label>
   *   <FormField.Input>
   *     <TextInput />
   *   </FormField.Input>
   *   <FormField.Description>
   *     Must be 3-20 characters, letters and numbers only
   *   </FormField.Description>
   * </FormField.Root>
   * ```
   */
  Description: FormFieldDescription,

  /**
   * # FormField.Error
   *
   * The error message element that displays validation errors. Only visible when
   * the field is invalid. Automatically associates with the input via
   * `aria-errormessage` and includes an error icon.
   *
   * @example
   * ```tsx
   * <FormField.Root isInvalid>
   *   <FormField.Label>Email</FormField.Label>
   *   <FormField.Input>
   *     <TextInput />
   *   </FormField.Input>
   *   <FormField.Error>Please enter a valid email address</FormField.Error>
   * </FormField.Root>
   * ```
   */
  Error: FormFieldError,

  /**
   * # FormField.InfoBox
   *
   * The info box content that appears in a popover when the help icon next to
   * the label is clicked. Use for additional context or instructions that don't
   * need to be visible by default.
   *
   * @example
   * ```tsx
   * <FormField.Root>
   *   <FormField.Label>API Key</FormField.Label>
   *   <FormField.InfoBox>
   *     Your API key can be found in your account settings.
   *     Keep it secure and never share it publicly.
   *   </FormField.InfoBox>
   *   <FormField.Input>
   *     <TextInput />
   *   </FormField.Input>
   * </FormField.Root>
   * ```
   */
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
