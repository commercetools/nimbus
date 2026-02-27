import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusTable",
});

export type TableRootSlotProps = HTMLChakraProps<"table">;
export const TableRootSlot: SlotComponent<
  HTMLTableElement,
  TableRootSlotProps
> = withProvider<HTMLTableElement, TableRootSlotProps>("table", "root");

export type TableCaptionSlotProps = HTMLChakraProps<"caption">;
export const TableCaptionSlot: SlotComponent<
  HTMLTableCaptionElement,
  TableCaptionSlotProps
> = withContext<HTMLTableCaptionElement, TableCaptionSlotProps>(
  "caption",
  "caption"
);

export type TableHeaderSlotProps = HTMLChakraProps<"thead">;
export const TableHeaderSlot: SlotComponent<
  HTMLTableSectionElement,
  TableHeaderSlotProps
> = withContext<HTMLTableSectionElement, TableHeaderSlotProps>(
  "thead",
  "header"
);

export type TableBodySlotProps = HTMLChakraProps<"tbody">;
export const TableBodySlot: SlotComponent<
  HTMLTableSectionElement,
  TableBodySlotProps
> = withContext<HTMLTableSectionElement, TableBodySlotProps>("tbody", "body");

export type TableFooterSlotProps = HTMLChakraProps<"tfoot">;
export const TableFooterSlot: SlotComponent<
  HTMLTableSectionElement,
  TableFooterSlotProps
> = withContext<HTMLTableSectionElement, TableFooterSlotProps>(
  "tfoot",
  "footer"
);

export type TableRowSlotProps = HTMLChakraProps<"tr">;
export const TableRowSlot: SlotComponent<
  HTMLTableRowElement,
  TableRowSlotProps
> = withContext<HTMLTableRowElement, TableRowSlotProps>("tr", "row");

export type TableColumnHeaderSlotProps = HTMLChakraProps<"th">;
export const TableColumnHeaderSlot: SlotComponent<
  HTMLTableCellElement,
  TableColumnHeaderSlotProps
> = withContext<HTMLTableCellElement, TableColumnHeaderSlotProps>(
  "th",
  "columnHeader"
);

export type TableCellSlotProps = HTMLChakraProps<"td">;
export const TableCellSlot: SlotComponent<
  HTMLTableCellElement,
  TableCellSlotProps
> = withContext<HTMLTableCellElement, TableCellSlotProps>("td", "cell");
