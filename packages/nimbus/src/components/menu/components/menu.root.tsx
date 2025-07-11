import { MenuTrigger } from "react-aria-components";
import { MenuRootSlot } from "../menu.slots";
import type { MenuRootProps } from "../menu.types";
import { useSlotRecipe } from "@chakra-ui/react";
import { MenuProvider } from "./menu.context";

export const MenuRoot = (props: MenuRootProps) => {
  const recipe = useSlotRecipe({ key: "menu" });
  const [recipeProps, functionalProps] = recipe.splitVariantProps(props);

  // Extract menu-specific props for context
  const {
    onAction,
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disallowEmptySelection,
    placement,
    ...menuTriggerProps
  } = functionalProps;

  const contextValue = {
    onAction,
    selectionMode,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disallowEmptySelection,
    placement,
  };

  return (
    <MenuRootSlot {...recipeProps} asChild>
      <MenuTrigger {...menuTriggerProps}>
        <MenuProvider value={contextValue}>{props.children}</MenuProvider>
      </MenuTrigger>
    </MenuRootSlot>
  );
};

MenuRoot.displayName = "Menu.Root";
