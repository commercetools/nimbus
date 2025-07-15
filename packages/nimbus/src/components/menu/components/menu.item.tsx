import { useRef, useLayoutEffect, useState } from "react";
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
import { Box } from "@/components/box";

export const MenuItem = ({
  children,
  isCritical,
  ref,
  ...props
}: MenuItemProps) => {
  const [styleProps, restProps] = extractStyleProps(props);
  const menuContext = useMenuContext();
  const itemRef = useRef<HTMLDivElement>(null);
  
  // Start with menu context selection mode as default
  const [selectionMode, setSelectionMode] = useState<
    "single" | "multiple" | "none" | undefined
  >(menuContext?.selectionMode);

  // Read selection mode from closest parent with data-selection-mode attribute
  // Use useLayoutEffect to read DOM before paint
  useLayoutEffect(() => {
    if (itemRef.current) {
      const section = itemRef.current.closest("[data-selection-mode]");
      const sectionMode = section?.getAttribute("data-selection-mode") as
        | "single"
        | "multiple"
        | "none"
        | null;
      const newMode = sectionMode ?? menuContext?.selectionMode;
      if (newMode !== selectionMode) {
        setSelectionMode(newMode);
      }
    }
  });

  // Combine refs
  const combinedRef = (node: HTMLDivElement) => {
    itemRef.current = node;
    if (ref) {
      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
      }
    }
    
    // Also check selection mode when ref is set
    if (node) {
      const section = node.closest("[data-selection-mode]");
      const sectionMode = section?.getAttribute("data-selection-mode") as
        | "single"
        | "multiple"
        | "none"
        | null;
      const newMode = sectionMode ?? menuContext?.selectionMode;
      if (newMode !== selectionMode) {
        setSelectionMode(newMode);
      }
    }
  };

  return (
    <MenuItemSlot
      asChild
      {...styleProps}
      data-critical={isCritical ? "" : undefined}
      data-selection-mode={selectionMode}
    >
      <RaMenuItem ref={combinedRef} {...restProps}>
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
