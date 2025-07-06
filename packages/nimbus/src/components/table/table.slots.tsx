import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";
import { tableSlotRecipe } from "./table.recipe";

// Base recipe props for the table
interface TableRecipeProps extends RecipeProps<"table">, UnstyledProp {}

export interface TableRootProps extends HTMLChakraProps<"table", TableRecipeProps> { variant?: string; }
export interface TableHeaderSlotProps extends HTMLChakraProps<"thead", TableRecipeProps> { variant?: string; }
export interface TableBodySlotProps extends HTMLChakraProps<"tbody", TableRecipeProps> { variant?: string; }
export interface TableRowSlotProps extends HTMLChakraProps<"tr", TableRecipeProps> { variant?: string; }
export interface TableColumnHeaderSlotProps extends HTMLChakraProps<"th", TableRecipeProps> { variant?: string; }
export interface TableCellSlotProps extends HTMLChakraProps<"td", TableRecipeProps> { variant?: string; }
export interface TableFooterSlotProps extends HTMLChakraProps<"tfoot", TableRecipeProps> { variant?: string; }
export interface TableCaptionSlotProps extends HTMLChakraProps<"caption", TableRecipeProps> { variant?: string; }

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