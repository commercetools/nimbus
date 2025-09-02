import { forwardRef } from "react";
import { AccordionRootSlot } from "../accordion.slots";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { DisclosureGroup as RaDisclosureGroup } from "react-aria-components";
import type { AccordionRootProps } from "../accordion.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * # Accordion
 *
 * Displays an Accordion.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/accordion}
 */
export const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>(
  (props, forwardedRef) => {
    const recipe = useSlotRecipe({ key: "accordion" });
    const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
    const [styleProps, raProps] = extractStyleProps(restRecipeProps);

    return (
      <AccordionRootSlot
        ref={forwardedRef}
        {...recipeProps}
        {...styleProps}
        asChild
      >
        <RaDisclosureGroup {...raProps} />
      </AccordionRootSlot>
    );
  }
);
