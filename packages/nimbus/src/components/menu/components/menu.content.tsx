import { Menu, Popover } from "react-aria-components";
import { MenuContentSlot, MenuPopoverSlot } from "../menu.slots";
import type { MenuContentProps } from "../menu.types";
import { useMenuContext } from "./menu.context";
import { MenuSectionProvider } from "./menu.section-context";

/**
 * Menu.Content - The popover container that displays menu items
 *
 * @supportsStyleProps
 */
export const MenuContent = ({
  children,
  placement: placementOverride,
  ref,
  ...styleProps
}: MenuContentProps) => {
  const contextProps = useMenuContext();

  if (!contextProps) {
    throw new Error("Menu.Content must be used within Menu.Root");
  }

  // Separate placement from other props since it's handled by Popover
  const { placement, ...menuProps } = contextProps;
  const finalPlacement = placementOverride || placement || "bottom start";

  return (
    <MenuSectionProvider value={{ selectionMode: menuProps.selectionMode }}>
      <MenuPopoverSlot {...styleProps} asChild>
        <Popover placement={finalPlacement} offset={4} shouldFlip>
          <MenuContentSlot asChild>
            <Menu ref={ref} shouldFocusWrap autoFocus="first" {...menuProps}>
              {children}
            </Menu>
          </MenuContentSlot>
        </Popover>
      </MenuPopoverSlot>
    </MenuSectionProvider>
  );
};

MenuContent.displayName = "Menu.Content";
