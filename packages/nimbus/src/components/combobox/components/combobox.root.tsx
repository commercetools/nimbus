import { type ForwardedRef } from "react";
import { useSlotRecipe } from "@chakra-ui/react";
// import { Flex } from "@/components";
import { comboBoxSlotRecipe } from "../combobox.recipe";
import { ComboBoxRootSlot } from "../combobox.slots";
import { SingleSelectRoot } from "./combobox.single-select-root";
import type { ComboBoxRootProps } from "../combobox.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const ComboBoxRoot = fixedForwardRef(
  <T extends object>(
    { children, ...rest }: ComboBoxRootProps<T>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const recipe = useSlotRecipe({ recipe: comboBoxSlotRecipe });
    const [recipeProps, restRecipeProps] = recipe.splitVariantProps(rest);
    const [styleProps, restProps] = extractStyleProps(restRecipeProps);
    //TODO: it may be necessary to instantiate a context for multi-select
    return (
      <ComboBoxRootSlot asChild ref={ref} {...recipeProps} {...styleProps}>
        <SingleSelectRoot {...restProps} ref={ref}>
          {children}
        </SingleSelectRoot>
      </ComboBoxRootSlot>
    );
  }
);

// @ts-expect-error - doesn't work with this complex types
ComboBoxRoot.displayName = "ComboBox.Root";
