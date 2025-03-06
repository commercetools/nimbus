import * as icons from "@bleh-ui/icons";
import { Text } from "@bleh-ui/react";
import { MenuIconProps } from "../menu.types";

/**
 * MenuIcon component renders an icon or the id if the icon is not found.
 * @param {MenuIconProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const MenuIcon = ({ id }: MenuIconProps): JSX.Element => {
  // Get the icon component from the icons object
  const IconComponent = icons[id as keyof typeof icons];

  // If the icon component exists, render it
  if (IconComponent) {
    return (
      <Text
        as="span"
        display="inline-block"
        position="relative"
        top="50"
        mr="200"
      >
        <IconComponent />
      </Text>
    );
  }

  // If the icon component does not exist, render the id as text
  // sideeffect: this allows displaying emojis instead of icons
  return (
    <Text as="span" display="inline-block" mr="200" fontSize="350">
      {id}
    </Text>
  );
};
