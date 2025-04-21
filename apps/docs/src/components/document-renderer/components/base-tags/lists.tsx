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
  <List.Root mb="400" pl="600" asChild {...props}>
    <ol>{children}</ol>
  </List.Root>
);

OlList.displayName = "OlList";

export const UlList = ({
  children,
  ...props
}: ComponentProps<typeof List.Root>) => (
  <List.Root mb="400" pl="600" asChild {...props}>
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
    <List.Item as={"li"} listStylePosition="outside" mb="100" {...rest}>
      {children}
    </List.Item>
  );
};

ListItem.displayName = "ListItem";
