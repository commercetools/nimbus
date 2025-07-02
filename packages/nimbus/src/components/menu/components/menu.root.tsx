import { forwardRef, useMemo } from "react";
import { MenuTrigger } from "react-aria-components";
import { MenuRootSlot } from "../menu.slots";
import { MenuProvider } from "../menu.context";
import type { MenuRootProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useMenuTriggerState } from "react-stately";

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

    const triggerState = useMenuTriggerState({
      onOpenChange,
      isOpen,
      defaultOpen,
    });

    const contextValue = useMemo(
      () => ({
        onAction,
        closeOnSelect,
        state: triggerState,
      }),
      [onAction, closeOnSelect, triggerState]
    );

    return (
      <MenuRootSlot ref={ref} {...styleProps} {...restProps}>
        <MenuTrigger
          isOpen={isOpen}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          state={triggerState}
        >
          <MenuProvider value={contextValue}>{children}</MenuProvider>
        </MenuTrigger>
      </MenuRootSlot>
    );
  }
);

MenuRoot.displayName = "MenuRoot";
