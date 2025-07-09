import { MenuTrigger } from "react-aria-components";
import { MenuRootSlot } from "../menu.slots";
import type { MenuRootProps } from "../menu.types";
import { useSlotRecipe } from "@chakra-ui/react";

export const MenuRoot = (props: MenuRootProps) => {
  const recipe = useSlotRecipe({ key: "menu" });
  const [recipeProps, functionalProps] = recipe.splitVariantProps(props);

  return (
    <MenuRootSlot {...recipeProps} asChild>
      <MenuTrigger {...functionalProps}>{props.children}</MenuTrigger>
    </MenuRootSlot>
  );
};

MenuRoot.displayName = "MenuRoot";
