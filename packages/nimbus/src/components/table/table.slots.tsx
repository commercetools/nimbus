import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";
import { tableSlotRecipe } from "./table.recipe";

// Base recipe props for the table
interface TableRecipeProps extends RecipeProps<"table">, UnstyledProp {}

export interface TableRootProps extends HTMLChakraProps<"table", TableRecipeProps> {}
export interface TableHeaderSlotProps extends HTMLChakraProps<"thead", TableRecipeProps> {}
export interface TableBodySlotProps extends HTMLChakraProps<"tbody", TableRecipeProps> {}
export interface TableRowSlotProps extends HTMLChakraProps<"tr", TableRecipeProps> {}
export interface TableColumnHeaderSlotProps extends HTMLChakraProps<"th", TableRecipeProps> {}
export interface TableCellSlotProps extends HTMLChakraProps<"td", TableRecipeProps> {}
export interface TableFooterSlotProps extends HTMLChakraProps<"tfoot", TableRecipeProps> {}
export interface TableCaptionSlotProps extends HTMLChakraProps<"caption", TableRecipeProps> {}

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: tableSlotRecipe,
});

export const TableRoot = withProvider<HTMLTableElement, TableRootProps>("table", "root");
export const TableHeaderSlot = withContext<HTMLTableSectionElement, TableHeaderSlotProps>("thead", "header");
export const TableBodySlot = withContext<HTMLTableSectionElement, TableBodySlotProps>("tbody", "body");
export const TableRowSlot = withContext<HTMLTableRowElement, TableRowSlotProps>("tr", "row");
export const TableColumnHeaderSlot = withContext<HTMLTableCellElement, TableColumnHeaderSlotProps>("th", "columnHeader");
export const TableCellSlot = withContext<HTMLTableCellElement, TableCellSlotProps>("td", "cell");
export const TableFooterSlot = withContext<HTMLTableSectionElement, TableFooterSlotProps>("tfoot", "footer");
export const TableCaptionSlot = withContext<HTMLTableCaptionElement, TableCaptionSlotProps>("caption", "caption"); 