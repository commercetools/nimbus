import { Kbd, Text } from "@commercetools/nimbus";
import {
  Children,
  DetailedHTMLProps,
  HTMLAttributes,
  isValidElement,
} from "react";

type ParagraphProps = DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

export const Paragraph = (props: ParagraphProps) => {
  const { children, ...rest } = props;
  return (
    <Text
      textStyle="md"
      lineHeight="650"
      mb="400"
      maxWidth="80ch"
      asChild
      {...rest}
    >
      <p>
        {Children.map(children, (child) => {
          // Check if the child is a React element and if its type is 'kbd'
          if (isValidElement(child) && child.type === "kbd") {
            return <Kbd>{child.props.children}</Kbd>;
          }

          // Otherwise, return the child unchanged
          return child;
        })}
      </p>
    </Text>
  );
};

Paragraph.displayName = "Paragraph";
