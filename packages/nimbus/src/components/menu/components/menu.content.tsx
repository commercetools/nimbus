import { Menu, Popover } from "react-aria-components";
import { MenuContentSlot } from "../menu.slots";
import type { MenuContentProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useMenuContext } from "../menu.context";

export const MenuContent = ({
  children,
  placement = "bottom start",
  offset = 4,
  shouldFlip = true,
  onAction: localOnAction,
  selectionMode: localSelectionMode,
  selectedKeys: localSelectedKeys,
  defaultSelectedKeys: localDefaultSelectedKeys,
  onSelectionChange: localOnSelectionChange,
  disallowEmptySelection: localDisallowEmptySelection,
  ref,
  ...props
}: MenuContentProps) => {
  const [styleProps, restProps] = extractStyleProps(props);
  const contextProps = useMenuContext();

  // Local props override context props
  const onAction = localOnAction ?? contextProps?.onAction;
  const selectionMode = localSelectionMode ?? contextProps?.selectionMode;
  const selectedKeys = localSelectedKeys ?? contextProps?.selectedKeys;
  const defaultSelectedKeys = localDefaultSelectedKeys ?? contextProps?.defaultSelectedKeys;
  const onSelectionChange = localOnSelectionChange ?? contextProps?.onSelectionChange;
  const disallowEmptySelection = localDisallowEmptySelection ?? contextProps?.disallowEmptySelection;

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
