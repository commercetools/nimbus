import { useMemo } from "react";
import { MenuTrigger } from "react-aria-components";
import { MenuRootSlot } from "../menu.slots";
import type { MenuRootProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const MenuRoot = ({
  children,
  onOpenChange,
  isOpen,
  defaultOpen,
  onAction,
  ref,
  ...props
}: MenuRootProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <MenuRootSlot ref={ref} {...styleProps} {...restProps}>
      <MenuTrigger
        isOpen={isOpen}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        {children}
      </MenuTrigger>
    </MenuRootSlot>
  );
};

MenuRoot.displayName = "MenuRoot";
