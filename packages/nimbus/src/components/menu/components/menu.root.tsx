import { forwardRef, useMemo } from "react";
import { MenuTrigger } from "react-aria-components";
import { MenuRootSlot } from "../menu.slots";
import { MenuProvider } from "../menu.context";
import type { MenuRootProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuRoot = forwardRef<HTMLDivElement, MenuRootProps>(
  (
    {
      children,
      onAction,
      onOpenChange,
      isOpen,
      defaultOpen,
      closeOnSelect = true,
      ...props
    },
    ref
  ) => {
    const [styleProps, restProps] = extractStyleProps(props);

    const contextValue = useMemo(
      () => ({
        onAction,
        closeOnSelect,
        // For React Aria Components, we don't need MenuTriggerState
        // as it's managed internally by the MenuTrigger component
        state: null,
      }),
      [onAction, closeOnSelect]
    );

    return (
      <MenuRootSlot ref={ref} {...styleProps} {...restProps}>
        <MenuTrigger
          isOpen={isOpen}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          <MenuProvider value={contextValue}>{children}</MenuProvider>
        </MenuTrigger>
      </MenuRootSlot>
    );
  }
);

MenuRoot.displayName = "MenuRoot";
