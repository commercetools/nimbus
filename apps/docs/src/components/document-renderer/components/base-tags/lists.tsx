import { List } from "@commercetools/nimbus";
import {
  Children,
  isValidElement,
  cloneElement,
  ComponentProps,
  ReactElement,
} from "react";

export const OlList = ({
  children,
  ...props
}: ComponentProps<typeof List.Root>) => (
  <List.Root my="3" asChild {...props}>
    <ol>{children}</ol>
  </List.Root>
);

OlList.displayName = "OlList";

export const UlList = ({
  children,
  ...props
}: ComponentProps<typeof List.Root>) => (
  <List.Root my="3" asChild {...props}>
    <ul>{children}</ul>
  </List.Root>
);

UlList.displayName = "UlList";

type ListComponentProps =
  | ComponentProps<typeof OlList> // Props for OlList
  | ComponentProps<typeof UlList>; // Props for UlList

export const ListItem = (props: ComponentProps<typeof List.Item>) => {
  const { children, ...rest } = props;
  return (
    <List.Item
      as={"li"}
      listStylePosition="outside"
      ml="500"
      my="100"
      {...rest}
    >
      {Children.map(children, (child) => {
        const isAnotherList =
          isValidElement(child) &&
          (child.type === OlList || child.type === UlList);

        if (isAnotherList) {
          return cloneElement(child as ReactElement<ListComponentProps>, {
            ml: "400",
            my: undefined,
          });
        }

        // Otherwise, return the child unchanged
        return child;
      })}
    </List.Item>
  );
};

ListItem.displayName = "ListItem";
