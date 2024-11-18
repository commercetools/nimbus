import { Kbd, Text } from "@bleh-ui/react";
import { Children, isValidElement } from "react";

export const Paragraph = (props) => {
  const { children, ...rest } = props;
  return (
    <Text my="3" asChild {...rest}>
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
