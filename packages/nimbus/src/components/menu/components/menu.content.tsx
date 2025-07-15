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

  // Use only non-selection context props
  const {
    onAction,
    placement = placementOverride || "bottom start",
    selectionMode,
  } = contextProps;

  return (
    <Popover placement={placement} offset={4} shouldFlip>
      <MenuContentSlot asChild>
        <Menu
          ref={ref}
          shouldFocusWrap
          autoFocus="first"
          onAction={onAction}
        >
          <MenuSectionProvider value={{ selectionMode }}>
            {children}
          </MenuSectionProvider>
        </Menu>
      </MenuContentSlot>
    </Popover>
  );
};

MenuContent.displayName = "Menu.Content";
