import { MenuSection as RaMenuSection } from "react-aria-components";
import { MenuSectionSlot } from "../menu.slots";
import type { MenuSectionProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useMenuContext } from "./menu.context";

export const MenuSection = ({ children, ref, ...props }: MenuSectionProps) => {
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
    <MenuSectionSlot asChild {...styleProps}>
      <RaMenuSection
        ref={ref}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChange}
        disallowEmptySelection={disallowEmptySelection}
        data-selection-mode={selectionMode}
        {...otherProps}
      >
        {children as React.ReactNode}
      </RaMenuSection>
    </MenuSectionSlot>
  );
};

MenuSection.displayName = "Menu.Section";
