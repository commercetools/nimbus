import { GridListItem as RaGridListItem } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { GridListItemSlot } from "../grid-list.slots";
import type { GridListItemProps } from "../grid-list.types";

/**
 * GridList.Item
 *
 * A single focusable interactive row in the grid list (`role="row"`).
 * Participates in keyboard navigation, selection, and type-ahead. May render
 * arbitrary content via `children`.
 *
 * @supportsStyleProps
 */
export const GridListItem = ({
  children,
  ref,
  ...props
}: GridListItemProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <GridListItemSlot ref={ref} {...styleProps} asChild>
      <RaGridListItem {...functionalProps}>{children}</RaGridListItem>
    </GridListItemSlot>
  );
};

GridListItem.displayName = "GridList.Item";
