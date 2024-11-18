import { List } from "@chakra-ui/react";

export type ListRootType = React.ComponentProps<typeof List.Root>;
export type ListItemType = React.ComponentProps<typeof List.Item>;

const ListRoot = (props: ListRootType) => <List.Root {...props} />;
const ListItem = (props: ListItemType) => <List.Item {...props} />;

export { List, ListRoot, ListItem };
