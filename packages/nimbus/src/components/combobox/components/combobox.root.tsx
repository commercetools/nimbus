import { useSlotRecipe } from "@chakra-ui/react";
import { comboBoxSlotRecipe } from "../combobox.recipe";
import { ComboBoxRootSlot } from "../combobox.slots";
import { SingleSelectRoot } from "./combobox.single-select-root";
import { MultiSelectRoot } from "./combobox.multi-select-root";
import type { ComboBoxRootProps } from "../combobox.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

export const ComboBoxRoot = <T extends object>({
  children,
  ref,
  ...props
}: ComboBoxRootProps<T>) => {
  const recipe = useSlotRecipe({ recipe: comboBoxSlotRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps, restProps] = extractStyleProps(restRecipeProps);
  const Component =
    "selectionMode" in props && props.selectionMode === "multiple"
      ? MultiSelectRoot
      : SingleSelectRoot;
  // TODO: should there be a prop to allow for user control of the menu width?
  // TODO: should there be a prop to allow the user to pass in an icon to display on the right of the input other than the down caret (eg search)?
  return (
    <ComboBoxRootSlot
      asChild
      selectionMode={props.selectionMode}
      {...recipeProps}
      {...styleProps}
    >
      <Component ref={ref} size={recipeProps.size} {...restProps}>
        {children}
      </Component>
    </ComboBoxRootSlot>
  );
};

ComboBoxRoot.displayName = "ComboBox.Root";
