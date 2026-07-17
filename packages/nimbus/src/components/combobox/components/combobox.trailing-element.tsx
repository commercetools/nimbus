import { ComboBoxTrailingElementSlot } from "../combobox.slots";

/**
 * # ComboBox.TrailingElement (Internal Component)
 *
 * Internal wrapper component that positions the trailing element (icon,
 * action, etc.) within the combobox trigger using CSS Grid's named template
 * area. Automatically rendered by ComboBox.Trigger when the trailingElement
 * prop is provided.
 *
 * @internal
 * @supportsStyleProps
 */
export const ComboBoxTrailingElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ComboBoxTrailingElementSlot>{children}</ComboBoxTrailingElementSlot>;
};
