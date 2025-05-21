import React, { forwardRef, useContext } from "react";
import {
  AccordionTriggerSlot,
  AccordionTitleSlot,
  AccordionHeaderRightContent,
} from "../accordion.slots";
import { mergeRefs } from "@chakra-ui/react";
import { Flex } from "@/components";
import { KeyboardArrowRight } from "@commercetools/nimbus-icons";
import type { DisclosureGroupProps } from "../accordion.types";
import { ItemContext } from "./accordion.context";

export const AccordionHeader = forwardRef<
  HTMLButtonElement,
  DisclosureGroupProps
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
      <AccordionTriggerSlot
        ref={mergeRefs(context.triggerRef, ref)}
        {...context.buttonProps}
        data-slot="trigger"
        outline={context.isFocusVisible ? undefined : "none"}
      >
        <KeyboardArrowRight />
        <AccordionTitleSlot data-slot="accordionTitle">
          {headerContent.main}
        </AccordionTitleSlot>
      </AccordionTriggerSlot>
      {headerContent.rightContent.length > 0 && (
        <AccordionHeaderRightContent data-slot="headerContentRight">
          {headerContent.rightContent}
        </AccordionHeaderRightContent>
      )}
    </Flex>
  );
});
