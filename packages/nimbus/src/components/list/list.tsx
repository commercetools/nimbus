import { ListRoot, ListItem, ListIndicator } from "./components";

/**
 * # List
 *
 * The List component is used to display a list of items.
 *
 * @supportsStyleProps
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/list}
 */
export const List: {
  Root: typeof ListRoot;
  Item: typeof ListItem;
  Indicator: typeof ListIndicator;
} = {
  Root: ListRoot,
  Item: ListItem,
  Indicator: ListIndicator,
};

export {
  ListRoot as _ListRoot,
  ListItem as _ListItem,
  ListIndicator as _ListIndicator,
};
