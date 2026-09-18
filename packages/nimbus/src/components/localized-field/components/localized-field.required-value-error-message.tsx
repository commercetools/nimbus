import { FormField } from "@/components";
import { useLocalizedStringFormatter } from "@/hooks";
import { localizedFieldMessagesStrings } from "../localized-field.messages";

/**
 * # LocalizedField.RequiredValueErrorMessage
 *
 * The standard error message shown when a required localized field has no
 * value. Exposed on the `LocalizedField` namespace for parity with UI Kit.
 *
 * @example
 * ```tsx
 * <LocalizedField.RequiredValueErrorMessage />
 * ```
 */
export const RequiredValueErrorMessage = () => {
  const msg = useLocalizedStringFormatter(localizedFieldMessagesStrings);
  return (
    <FormField.Error>{msg.format("missingRequiredField")}</FormField.Error>
  );
};
