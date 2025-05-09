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
  <List.Root pl="600" mb="400" asChild {...props}>
    <ol>{children}</ol>
  </List.Root>
);

OlList.displayName = "OlList";

export const UlList = ({
  children,
  ...props
}: ComponentProps<typeof List.Root>) => (
  <List.Root pl="600" mb="400" asChild {...props}>
    <ul>{children}</ul>
  </List.Root>
);

UlList.displayName = "UlList";

type ListComponentProps = ComponentProps<typeof List.Root>;

export const ListItem = (props: ComponentProps<typeof List.Item>) => {
  const { children, ...rest } = props;
  return (
    <List.Item
      pl="100"
      css={{
        "& + li": {
          mt: "100",
        },
      }}
      listStylePosition="outside"
      {...rest}
    >
      {Children.map(children, (child) => {
        const isAnotherList =
          isValidElement(child) &&
          (child.type === OlList || child.type === UlList);

        if (isAnotherList) {
          return cloneElement(child as ReactElement<ListComponentProps>, {
            //ml: "400",
            //my: undefined,
          });
        }

        // Otherwise, return the child unchanged
        return child;
      })}
    </List.Item>
  );
};

ListItem.displayName = "ListItem";
