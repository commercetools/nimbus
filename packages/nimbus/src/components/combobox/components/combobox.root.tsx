import { useSlotRecipe } from "@chakra-ui/react";
import { comboBoxSlotRecipe } from "../combobox.recipe";
import { ComboBoxRootSlot } from "../combobox.slots";
import { SingleSelectRoot } from "./combobox.single-select-root";
import { MultiSelectRoot } from "./combobox.multi-select-root";
import type { ComboBoxRootProps } from "../combobox.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * # ComboBox
 * 
 * A combo box combines a text input with a dropdown list, allowing users to filter a list of options to items matching a query.
 * 
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/combobox}
 */
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
  // TODO: should there be a prop to allow for user control of the menu width? (based on the figma, I think that allowing control of the input/tag/value/rootslot width is enough, but if not we can pass a prop)
  // TODO: should there be a prop to allow the user to pass in an icon to display on the right of the input other than the down caret (eg search)?
  // TODO: this should really have its own context, especially for the collection (a top-level collection context would make the tags and inputs a lot more straightforward to reason about, and would potentially allow us to make this into a single component instead of 2 components in a trenchcoat)
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
