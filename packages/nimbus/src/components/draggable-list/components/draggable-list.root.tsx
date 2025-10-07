import { GridList, useDragAndDrop } from "react-aria-components";
import { useListData } from "react-stately";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { DraggableListRootSlot } from "../draggable-list.slots";
import type { DraggableListRootProps } from "../draggable-list.types";

export const DraggableList = <T extends object>({
  children,
  ref,
  items,
  ...restProps
}: DraggableListRootProps<T>) => {
  const list = useListData({ initialItems: items });
  const { dragAndDropHooks } = useDragAndDrop<T>({});
  const [styleProps, functionalProps] = extractStyleProps(restProps);
  return (
    <DraggableListRootSlot {...styleProps} asChild>
      <GridList
        ref={ref}
        {...functionalProps}
        dragAndDropHooks={dragAndDropHooks}
        items={list.items}
      >
        {children}
      </GridList>
    </DraggableListRootSlot>
  );
};
