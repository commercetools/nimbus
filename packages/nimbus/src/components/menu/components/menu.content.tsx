import { forwardRef } from "react";
import { Menu, Popover } from "react-aria-components";
import { MenuContentSlot } from "../menu.slots";
import { useMenuContext } from "../menu.context";
import type { MenuContentProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  (
    {
      children,
      placement = "bottom start",
      offset = 4,
      shouldFlip = true,
      isLoading,
      ...props
    },
    ref
  ) => {
    const { onAction } = useMenuContext();
    const [styleProps, restProps] = extractStyleProps(props);

    return (
      <Popover placement={placement} offset={offset} shouldFlip={shouldFlip}>
        <MenuContentSlot
          asChild
          {...styleProps}
          data-loading={isLoading ? "" : undefined}
        >
          <Menu
            ref={ref}
            onAction={onAction}
            shouldFocusWrap
            autoFocus="first"
            {...restProps}
          >
            {children}
          </Menu>
        </MenuContentSlot>
      </Popover>
    );
  }
);

MenuContent.displayName = "MenuContent";
