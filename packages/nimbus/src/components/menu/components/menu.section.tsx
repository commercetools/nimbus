import {
  MenuSection as RaMenuSection,
  Collection,
} from "react-aria-components";
import { MenuSectionSlot } from "../menu.slots";
import type { MenuSectionProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extract-style-props";
import { useMenuContext } from "./menu.context";
import { MenuSectionProvider } from "./menu.section-context";
import { MenuSectionLabel } from "./menu.section-label";
import type { ReactNode } from "react";

export const MenuSection = <T extends object = object>({
  children,
  ref,
  label,
  items,
  ...props
}: MenuSectionProps<T>) => {
  const contextProps = useMenuContext();

  // Extract selection-related props before extracting style props
  const {
    selectionMode = contextProps?.selectionMode,
    selectedKeys = contextProps?.selectedKeys,
    defaultSelectedKeys = contextProps?.defaultSelectedKeys,
    onSelectionChange = contextProps?.onSelectionChange,
    disallowEmptySelection = contextProps?.disallowEmptySelection,
    ...restProps
  } = props;

  const [styleProps, otherProps] = extractStyleProps(restProps);

  return (
    <MenuSectionProvider value={{ selectionMode }}>
      <MenuSectionSlot asChild {...styleProps}>
        <RaMenuSection
          ref={ref}
          selectionMode={selectionMode}
          selectedKeys={selectedKeys}
          defaultSelectedKeys={defaultSelectedKeys}
          onSelectionChange={onSelectionChange}
          disallowEmptySelection={disallowEmptySelection}
          {...otherProps}
        >
          <MenuSectionLabel>{label}</MenuSectionLabel>
          {items ? (
            <Collection items={items}>{children}</Collection>
          ) : (
            (children as ReactNode)
          )}
        </RaMenuSection>
      </MenuSectionSlot>
    </MenuSectionProvider>
  );
};

MenuSection.displayName = "Menu.Section";
