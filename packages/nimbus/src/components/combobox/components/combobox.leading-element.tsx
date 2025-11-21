import { ComboBoxLeadingElementSlot } from "../combobox.slots";

/**
 * This component is needed as proxy around the leading element slot.
 * It measures the width of whatever the user hands over via `leadingElement`
 * and provides this width as css variable on the root element.
 *
 * the css variable is then used in the recipe to update the left-padding of the
 * input.
 *
 * @supportsStyleProps
 */
export const ComboBoxLeadingElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ComboBoxLeadingElementSlot>{children}</ComboBoxLeadingElementSlot>;
};
