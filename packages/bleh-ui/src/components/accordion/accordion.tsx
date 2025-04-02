import React, {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  type RefAttributes,
  type ForwardRefExoticComponent,
} from "react";
import {
  AccordionRoot,
  AccordionDisclosure,
  AccordionTrigger,
  AccordionPanel,
  AccordionTitle,
} from "./accordion.slots";
import { useDisclosureState } from "react-stately";
import { useDisclosure, mergeProps, useButton, useFocusRing } from "react-aria";
import { useSlotRecipe } from "@chakra-ui/react";
import type { AccordionProps, AccordionComposition } from "./accordion.types";
import { Flex } from "@/components";
import { validateAccordionChildren } from "./accordion.validate";

/**
 * Accordion
 * ============================================================
 * A collapsible component used for organizing contents. This allows users to toggle visibility of the content sections in their individual panels when the panel's header is clicked.
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */

type AccordionComponent = ForwardRefExoticComponent<
  AccordionProps & RefAttributes<HTMLDivElement>
> & {
  Header: typeof AccordionHeader;
  Content: typeof AccordionContent;
};

const AccordionContext = createContext<AccordionComposition | undefined>(
  undefined
);

const AccordionHeader: React.FC<{
  children: ReactNode;
  additionalTriggerComponent?: ReactNode;
}> = ({ children, additionalTriggerComponent }) => {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("AccordionHeader must be used within Accordion");

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      borderBottom="solid-25"
      borderColor="neutral.4"
    >
      <AccordionTrigger
        ref={context.triggerRef}
        {...context.buttonProps}
        data-slot="trigger"
        outline={context.isFocusVisible ? undefined : "none"}
      >
        <svg viewBox="0 0 24 24">
          <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <AccordionTitle>{children}</AccordionTitle>
      </AccordionTrigger>
      {additionalTriggerComponent && <div>{additionalTriggerComponent}</div>}
    </Flex>
  );
};

const AccordionContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("AccordionContent must be used within Accordion");
  }

  return (
    <AccordionPanel
      ref={context.panelRef}
      {...context.panelProps}
      data-slot="panel"
    >
      {children}
    </AccordionPanel>
  );
};

export const Accordion = forwardRef<
  HTMLDivElement,
  AccordionProps & {
    children: ReactNode;
  }
>(({ children, ...props }, forwardedRef) => {
  // validate accordion children and how they are structured
  validateAccordionChildren(children, AccordionHeader, AccordionContent);

  const state = useDisclosureState(props);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { buttonProps, ...disclosureProps } = useDisclosure(
    props,
    state,
    panelRef
  );
  const { buttonProps: finalButtonProps } = useButton(buttonProps, triggerRef);
  const { focusProps, isFocusVisible } = useFocusRing();

  const contextValue = useMemo(
    () => ({
      state,
      buttonProps: mergeProps(finalButtonProps, focusProps),
      ...disclosureProps,
      triggerRef,
      panelRef,
      isFocusVisible,
    }),
    [state, finalButtonProps, focusProps, disclosureProps, isFocusVisible]
  );

  const recipe = useSlotRecipe({ key: "accordion" });
  const [recipeProps] = recipe.splitVariantProps(props);

  return (
    <AccordionContext.Provider value={contextValue}>
      <AccordionRoot data-slot="root" ref={forwardedRef} {...recipeProps}>
        <AccordionDisclosure>{children}</AccordionDisclosure>
      </AccordionRoot>
    </AccordionContext.Provider>
  );
}) as AccordionComponent;

Accordion.displayName = "Accordion";

Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;
