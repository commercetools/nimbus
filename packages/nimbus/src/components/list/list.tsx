import { List as ChakraList } from "@chakra-ui/react";

const ListRoot = ChakraList.Root;
const ListItem = ChakraList.Item;
const ListIndicator = ChakraList.Indicator;

/**
 * @experimental This component is experimental and may change or be removed in future versions.
 */
export const List = {
  Root: ListRoot,
  Item: ListItem,
  Indicator: ListIndicator,
};

export {
  ListRoot as _ListRoot,
  ListItem as _ListItem,
  ListIndicator as _ListIndicator,
};
