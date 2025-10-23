import { AccordionRootSlot } from "../accordion.slots";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { DisclosureGroup as RaDisclosureGroup } from "react-aria-components";
import type { AccordionRootProps } from "../accordion.types";
import { extractStyleProps } from "@/utils";

/**
 * # Accordion
 *
 * Displays an Accordion.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/accordion}
 */
export const AccordionRoot = (props: AccordionRootProps) => {
  const { ref, ...restProps } = props;
  const recipe = useSlotRecipe({ key: "accordion" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps, raProps] = extractStyleProps(restRecipeProps);

  return (
    <AccordionRootSlot ref={ref} {...recipeProps} {...styleProps} asChild>
      <RaDisclosureGroup {...raProps} />
    </AccordionRootSlot>
  );
};
