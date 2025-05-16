import { type ForwardedRef } from "react";
import { useSlotRecipe } from "@chakra-ui/react";
import { comboBoxSlotRecipe } from "../combobox.recipe";
import { ComboBoxRootSlot } from "../combobox.slots";
import { SingleSelectRoot } from "./combobox.single-select-root";
import { MultiSelectRoot } from "./combobox.multi-select-root";
import type { ComboBoxRootProps } from "../combobox.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { fixedForwardRef } from "@/utils/fixedForwardRef";

export const ComboBoxRoot = fixedForwardRef(
  <T extends object>(
    { children, ...props }: ComboBoxRootProps<T>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const recipe = useSlotRecipe({ recipe: comboBoxSlotRecipe });
    const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
    const [styleProps, restProps] = extractStyleProps(restRecipeProps);
    const Component =
      "selectionMode" in props && props.selectionMode === "multiple"
        ? MultiSelectRoot
        : SingleSelectRoot;

    return (
      <ComboBoxRootSlot asChild ref={ref} {...recipeProps} {...styleProps}>
        <Component {...restProps} ref={ref}>
          {children}
        </Component>
      </ComboBoxRootSlot>
    );
  }
);

// @ts-expect-error - doesn't work with this complex types
ComboBoxRoot.displayName = "ComboBox.Root";
