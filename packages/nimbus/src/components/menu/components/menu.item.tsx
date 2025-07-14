import { MenuItem as RaMenuItem } from "react-aria-components";
import { MenuItemSlot } from "../menu.slots";
import type { MenuItemProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import {
  CheckBox,
  ChevronRight,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "@commercetools/nimbus-icons";
import { Icon } from "@/components/icon";
import {
  CheckBox as CheckboxCheckedIcon,
  CheckBoxOutlineBlank as CheckboxUncheckedIcon,
} from "@commercetools/nimbus-icons";
import { useMenuContext } from "./menu.context";
import { Box } from "@/components/box";

export const MenuItem = ({
  children,
  isSelected,
  isCritical,
  ref,
  ...props
}: MenuItemProps) => {
  const [styleProps, restProps] = extractStyleProps(props);
  const menuContext = useMenuContext();
  const selectionMode = menuContext?.selectionMode;

  return (
    <MenuItemSlot
      asChild
      {...styleProps}
      data-selected={isSelected ? "" : undefined}
      data-critical={isCritical ? "" : undefined}
      data-selection-mode={selectionMode}
    >
      <RaMenuItem ref={ref} {...restProps}>
        {({ hasSubmenu }) => (
          <>
            {selectionMode && (
              <Box slot="selection" role="presentation" aria-hidden="true">
                {/* <Checkbox
                  role="presentation"
                  aria-hidden="true"
                  isSelected={isSelected}
                  isDisabled={props.isDisabled}
                /> */}
                {selectionMode === "single" && (
                  <>
                    {isSelected && <RadioButtonChecked />}
                    {!isSelected && <RadioButtonUnchecked />}
                  </>
                )}
                {selectionMode === "multiple" && (
                  <>
                    {isSelected && <CheckboxCheckedIcon />}
                    {!isSelected && <CheckboxUncheckedIcon />}
                  </>
                )}
              </Box>
            )}
            {children}
            {hasSubmenu && (
              <Icon slot="caretIcon">
                <ChevronRight />
              </Icon>
            )}
          </>
        )}
      </RaMenuItem>
    </MenuItemSlot>
  );
};

MenuItem.displayName = "Menu.Item";
