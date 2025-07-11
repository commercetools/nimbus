import { Menu, Popover } from "react-aria-components";
import { MenuContentSlot } from "../menu.slots";
import type { MenuContentProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuContent = ({
  children,
  placement = "bottom start",
  offset = 4,
  shouldFlip = true,
  onAction,
  selectionMode,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disallowEmptySelection,
  ref,
  ...props
}: MenuContentProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <Popover placement={placement} offset={offset} shouldFlip={shouldFlip}>
      <MenuContentSlot asChild {...styleProps}>
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
          {...restProps}
        >
          {children}
        </Menu>
      </MenuContentSlot>
    </Popover>
  );
};

MenuContent.displayName = "MenuContent";
