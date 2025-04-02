import { Children, isValidElement, type ReactNode } from "react";

type AccordionHeaderProps = {
  children: ReactNode;
  additionalTriggerComponent?: ReactNode;
};

type AccordionContentProps = {
  children: ReactNode;
};

export const validateAccordionChildren = (
  children: ReactNode,
  AccordionHeaderComponent: React.ComponentType<AccordionHeaderProps>,
  AccordionContentComponent: React.ComponentType<AccordionContentProps>
) => {
  const childArray = Children.toArray(children);

  if (childArray.length !== 2) {
    throw new Error(
      "Accordion must have exactly two children: Header and Content"
    );
  }

  const [header, content] = childArray;

  if (!isValidElement(header) || header.type !== AccordionHeaderComponent) {
    throw new Error("First child must be Accordion.Header");
  }

  if (!isValidElement(content) || content.type !== AccordionContentComponent) {
    throw new Error("Second child must be Accordion.Content");
  }

  const headerChildren = Children.toArray(
    (header as React.ReactElement<AccordionHeaderProps>).props.children
  );
  const contentChildren = Children.toArray(
    (content as React.ReactElement<{ children: ReactNode }>).props.children
  );

  if (
    headerChildren.some(
      (child) =>
        isValidElement(child) && child.type === AccordionContentComponent
    )
  ) {
    throw new Error("Accordion.Header cannot contain Accordion.Content");
  }

  if (
    contentChildren.some(
      (child) =>
        isValidElement(child) && child.type === AccordionHeaderComponent
    )
  ) {
    throw new Error("Accordion.Content cannot contain Accordion.Header");
  }

  return true;
};
