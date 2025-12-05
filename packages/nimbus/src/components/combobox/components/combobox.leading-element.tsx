import { ComboBoxLeadingElementSlot } from "../combobox.slots";

/**
 * # ComboBox.LeadingElement (Internal Component)
 *
 * Internal wrapper component that positions the leading element (icon, avatar, etc.)
 * within the combobox trigger using CSS Grid's named template area.
 * Automatically rendered by ComboBox.Trigger when leadingElement prop is provided.
 *
 * @internal
 * @supportsStyleProps
 */
export const ComboBoxLeadingElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ComboBoxLeadingElementSlot>{children}</ComboBoxLeadingElementSlot>;
};
