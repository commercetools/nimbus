import { createContext, useContext } from "react";
import type { GridListRootProps } from "../grid-list.types";

/**
 * Values `GridList.Root` shares with its items: the defaults for the built-in
 * controls and the size that scales the drag handle.
 */
export type GridListContextValue = {
  size: GridListRootProps["size"];
  showSelectionCheckbox: boolean;
  showDragHandle: boolean;
};

const GridListContext = createContext<GridListContextValue>({
  size: "md",
  showSelectionCheckbox: false,
  showDragHandle: false,
});

export const GridListProvider = GridListContext.Provider;

/**
 * Reads the Root defaults. Outside `GridList.Root` it returns the defaults
 * (both built-ins off), so an item behaves like React Aria's `GridListItem`.
 */
export const useGridListContext = () => useContext(GridListContext);
