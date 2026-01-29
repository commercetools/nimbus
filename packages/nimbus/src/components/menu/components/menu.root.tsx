import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { MenuTrigger as RaMenuTrigger } from "react-aria-components";
import type { MenuRootProps } from "../menu.types";
import { MenuRootSlot } from "../menu.slots";
import { MenuProvider } from "./menu.context";
import { extractStyleProps } from "@/utils";

/**
 * Menu.Root - Container component that provides configuration and state management
 *
 * @supportsStyleProps
 */
export const MenuRoot = (props: MenuRootProps) => {
  const recipe = useSlotRecipe({ key: "nimbusMenu" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);

  // Separate MenuTrigger props and functional props from style props
  const { children, trigger, isOpen, defaultOpen, onOpenChange, ...restProps } =
    restRecipeProps;

  const [styleProps, menuContextProps] = extractStyleProps(restProps);

  const menuTriggerProps = {
    trigger,
    isOpen,
    defaultOpen,
    onOpenChange,
  };

  return (
    <MenuRootSlot {...recipeProps} {...styleProps} asChild>
      <RaMenuTrigger {...menuTriggerProps}>
        <MenuProvider value={menuContextProps}>{children}</MenuProvider>
      </RaMenuTrigger>
    </MenuRootSlot>
  );
};

MenuRoot.displayName = "Menu.Root";
