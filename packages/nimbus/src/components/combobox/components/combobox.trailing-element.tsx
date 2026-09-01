import { AdornmentContent } from "@/utils";
import { ComboBoxTrailingElementSlot } from "../combobox.slots";

/**
 * # ComboBox.TrailingElement (Internal Component)
 *
 * Internal wrapper component that positions the trailing element (icon, button, etc.)
 * within the combobox trigger using CSS Grid's named template area, after the input
 * content and before the clear and toggle buttons.
 * Automatically rendered by ComboBox.Trigger when the trailingElement prop is provided.
 *
 * Consumer content is wrapped in AdornmentContent so it does not inherit the
 * combobox's own ButtonContext, which is configured with the `slots` pattern for
 * the clear and toggle buttons and would otherwise require a matching `slot` prop.
 *
 * @internal
 * @supportsStyleProps
 */
export const ComboBoxTrailingElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ComboBoxTrailingElementSlot>
      <AdornmentContent>{children}</AdornmentContent>
    </ComboBoxTrailingElementSlot>
  );
};
