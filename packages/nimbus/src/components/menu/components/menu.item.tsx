import { MenuItem as RaMenuItem } from "react-aria-components";
import { MenuItemSlot } from "../menu.slots";
import type { MenuItemProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import {
  CheckBox as CheckboxCheckedIcon,
  CheckBoxOutlineBlank as CheckboxUncheckedIcon,
  ChevronRight,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "@commercetools/nimbus-icons";
import { Icon } from "@/components/icon";
import { useMenuContext } from "./menu.context";
import { useMenuSectionContext } from "./menu.section-context";
import { Box } from "@/components/box";

export const MenuItem = ({
  children,
  isCritical,
  ref,
  ...props
}: MenuItemProps) => {
  const [styleProps, restProps] = extractStyleProps(props);
  const menuContext = useMenuContext();
  const sectionContext = useMenuSectionContext();

  // Use section context if available, otherwise fall back to menu context
  const selectionMode =
    sectionContext?.selectionMode ?? menuContext?.selectionMode;

  return (
    <MenuItemSlot
      asChild
      {...styleProps}
      data-critical={isCritical ? "" : undefined}
    >
      <RaMenuItem ref={ref} {...restProps}>
        {({ hasSubmenu, isSelected }) => (
          <>
            {selectionMode && (
              <Box slot="selection" role="presentation" aria-hidden="true">
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
