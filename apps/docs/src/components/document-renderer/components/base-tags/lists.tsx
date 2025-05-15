import { List } from "@commercetools/nimbus";
import { ComponentProps } from "react";

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
      {children}
    </List.Item>
  );
};

ListItem.displayName = "ListItem";
