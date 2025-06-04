import React, { forwardRef, useContext, type ReactNode } from "react";
import {
  AccordionTrigger,
  AccordionTitle,
  AccordionHeaderRightContent,
} from "../accordion.slots";
import { mergeRefs } from "@chakra-ui/react";
import { Flex } from "@/components";
import { KeyboardArrowRight } from "@commercetools/nimbus-icons";
import { ItemContext } from "../accordion-context";

type AccordionHeaderProps = {
  /**
   * The text / content to display in the Header
   */
  children: ReactNode;
};

export const AccordionHeader = forwardRef<
  HTMLButtonElement,
  AccordionHeaderProps
>(({ children }, ref) => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("Accordion.Header must be used within Accordion.Item");
  }

  // Extract HeaderRightContent if present
  const headerContent = React.Children.toArray(children).reduce<{
    main: React.ReactNode[];
    rightContent: React.ReactNode[];
  }>(
    (acc, child) => {
      if (
        React.isValidElement(child) &&
        child.type === AccordionHeaderRightContent
      ) {
        acc.rightContent.push(child);
      } else {
        acc.main.push(child);
      }
      return acc;
    },
    { main: [], rightContent: [] }
  );

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      borderBottom="solid-25"
      borderColor="neutral.4"
    >
      <AccordionTrigger
        ref={mergeRefs(context.triggerRef, ref)}
        {...context.buttonProps}
        data-slot="trigger"
        outline={context.isFocusVisible ? undefined : "none"}
      >
        <KeyboardArrowRight />
        <AccordionTitle data-slot="accordionTitle">
          {headerContent.main}
        </AccordionTitle>
      </AccordionTrigger>
      {headerContent.rightContent.length > 0 && (
        <AccordionHeaderRightContent data-slot="headerContentRight">
          {headerContent.rightContent}
        </AccordionHeaderRightContent>
      )}
    </Flex>
  );
});
