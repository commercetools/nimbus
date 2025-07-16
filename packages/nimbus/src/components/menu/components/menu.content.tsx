import { Menu, Popover } from "react-aria-components";
import { MenuContentSlot } from "../menu.slots";
import type { MenuContentProps } from "../menu.types";
import { useMenuContext } from "./menu.context";
import { MenuSectionProvider } from "./menu.section-context";

export const MenuContent = ({
  children,
  placement: placementOverride,
  ref,
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
      <Popover placement={finalPlacement} offset={4} shouldFlip>
        <MenuContentSlot asChild>
          <Menu ref={ref} shouldFocusWrap autoFocus="first" {...menuProps}>
            {children}
          </Menu>
        </MenuContentSlot>
      </Popover>
    </MenuSectionProvider>
  );
};

MenuContent.displayName = "Menu.Content";
