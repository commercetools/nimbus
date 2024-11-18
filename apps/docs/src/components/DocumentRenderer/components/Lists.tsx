import { List } from "@bleh-ui/react";
import { Children, isValidElement, cloneElement } from "react";

export const OlList = ({ children, ...props }) => (
  <List.Root my="3" asChild {...props}>
    <ol>{children}</ol>
  </List.Root>
);

OlList.displayName = "OlList";

export const UlList = ({ children, ...props }) => (
  <List.Root my="3" asChild {...props}>
    <ul>{children}</ul>
  </List.Root>
);

UlList.displayName = "UlList";

export const ListItem = (props) => {
  const { children, ...rest } = props;
  return (
    <List.Item asChild>
      <li {...rest}>
        {Children.map(children, (child) => {
          // Check if the child is a React element and if its type is 'kbd'

          if (
            isValidElement(child) &&
            ["OlList", "UlList"].includes(child.type.displayName)
          ) {
            return cloneElement(child, { ml: "4", my: "0" });
          }

          // Otherwise, return the child unchanged
          return child;
        })}
      </li>
    </List.Item>
  );
};

ListItem.displayName = "ListItem";
