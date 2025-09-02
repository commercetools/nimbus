import React, { forwardRef, useMemo } from "react";
import {
  AccordionTriggerSlot,
  AccordionTitleSlot,
  AccordionHeaderRightContentSlot,
} from "../accordion.slots";
import { Flex } from "@/components";
import { KeyboardArrowRight } from "@commercetools/nimbus-icons";
import { Button as RaButton } from "react-aria-components";
import type { AccordionHeaderProps } from "../accordion.types";

export const AccordionHeader = forwardRef<
  HTMLButtonElement,
  AccordionHeaderProps
>(({ children, ...props }, ref) => {
  // Extract HeaderRightContent if present
  const headerContent = useMemo(() => {
    const main: React.ReactNode[] = [];
    const rightContent: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement(child) &&
        child.type === AccordionHeaderRightContentSlot
      ) {
        rightContent.push(child);
      } else {
        main.push(child);
      }
    });

    return { main, rightContent };
  }, [children]);

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      borderBottom="solid-25"
      borderColor="neutral.4"
    >
      <AccordionTriggerSlot ref={ref} slot="trigger" asChild>
        <RaButton {...props}>
          <KeyboardArrowRight />
          <AccordionTitleSlot>{headerContent.main}</AccordionTitleSlot>
        </RaButton>
      </AccordionTriggerSlot>
      {headerContent.rightContent.length > 0 && (
        <AccordionHeaderRightContentSlot>
          {headerContent.rightContent}
        </AccordionHeaderRightContentSlot>
      )}
    </Flex>
  );
});
