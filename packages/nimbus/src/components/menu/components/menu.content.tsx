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

  // Extract all props from context
  const {
    onAction,
    placement = placementOverride || "bottom start",
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disallowEmptySelection,
  } = contextProps;

  return (
    <Popover placement={placement} offset={4} shouldFlip>
      <MenuContentSlot asChild>
        <Menu
          ref={ref}
          shouldFocusWrap
          autoFocus="first"
          onAction={onAction}
          selectionMode={selectionMode}
          selectedKeys={selectedKeys}
          defaultSelectedKeys={defaultSelectedKeys}
          onSelectionChange={onSelectionChange}
          disallowEmptySelection={disallowEmptySelection}
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
