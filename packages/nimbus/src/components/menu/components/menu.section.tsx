import { MenuSection as RaMenuSection } from "react-aria-components";
import { MenuSectionSlot } from "../menu.slots";
import type { MenuSectionProps } from "../menu.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useMenuContext } from "./menu.context";
import { MenuSectionProvider } from "./menu.section-context";

export const MenuSection = ({ children, ref, ...props }: MenuSectionProps) => {
  const [styleProps, restProps] = extractStyleProps(props);
  const contextProps = useMenuContext();

  // Merge context defaults with section-specific props
  const {
    selectionMode = contextProps?.selectionMode,
    selectedKeys = contextProps?.selectedKeys,
    defaultSelectedKeys = contextProps?.defaultSelectedKeys,
    onSelectionChange = contextProps?.onSelectionChange,
    disallowEmptySelection = contextProps?.disallowEmptySelection,
    ...otherProps
  } = restProps;

  return (
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
        <MenuSectionProvider value={{ selectionMode }}>
          {children}
        </MenuSectionProvider>
      </RaMenuSection>
    </MenuSectionSlot>
  );
};

MenuSection.displayName = "Menu.Section";