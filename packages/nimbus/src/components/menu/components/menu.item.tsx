import { MenuItem as RaMenuItem } from "react-aria-components";
import { MenuItemSlot } from "../menu.slots";
import type { MenuItemProps } from "../menu.types";
import { extractStyleProps } from "@/utils";
import { ChevronRight } from "@commercetools/nimbus-icons";
import { Icon } from "@/components/icon";

/**
 * Menu.Item - A selectable item within a Menu
 *
 * @supportsStyleProps
 */
export const MenuItem = ({
  children,
  isCritical,
  ref,
  ...props
}: MenuItemProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <MenuItemSlot
      asChild
      {...styleProps}
      data-critical={isCritical ? "" : undefined}
    >
      <RaMenuItem ref={ref} {...restProps}>
        {({ hasSubmenu }) => (
          <>
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
