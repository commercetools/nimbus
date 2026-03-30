export { ScrollArea } from "./scroll-area";
export { useScrollAreaContext } from "@chakra-ui/react/scroll-area";
export type { ScrollAreaProps } from "./scroll-area.types";

/**
 * Custom element IDs for ScrollArea's internal parts.
 * Pass to the `ids` prop to set known IDs for DOM access.
 */
export type ScrollAreaElementIds = Partial<{
  root: string;
  viewport: string;
  content: string;
  scrollbar: string;
  thumb: string;
}>;
