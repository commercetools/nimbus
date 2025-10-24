import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { MenuTrigger as RaMenuTrigger } from "react-aria-components";
import type { MenuRootProps } from "../menu.types";
import { MenuRootSlot } from "../menu.slots";
import { MenuProvider } from "./menu.context";

/**
 * Menu.Root - Container component that provides configuration and state management
 *
 * @supportsStyleProps
 */
export const MenuRoot = (props: MenuRootProps) => {
  const recipe = useSlotRecipe({ key: "menu" });
  const [recipeProps, functionalProps] = recipe.splitVariantProps(props);

  // Separate MenuTrigger props from Menu props
  const {
    children,
    trigger,
    isOpen,
    defaultOpen,
    onOpenChange,
    ...menuContextProps
  } = functionalProps;

  const menuTriggerProps = {
    trigger,
    isOpen,
    defaultOpen,
    onOpenChange,
  };

  return (
    <MenuRootSlot {...recipeProps} asChild>
      <RaMenuTrigger {...menuTriggerProps}>
        <MenuProvider value={menuContextProps}>{children}</MenuProvider>
      </RaMenuTrigger>
    </MenuRootSlot>
  );
};

MenuRoot.displayName = "Menu.Root";
