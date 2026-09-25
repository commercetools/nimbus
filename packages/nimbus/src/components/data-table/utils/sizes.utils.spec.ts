import { describe, it, expect } from "vitest";
import { tableSlotRecipe } from "../../table/table.recipe";
import { dataTableSlotRecipe } from "../data-table.recipe";
import {
  DATA_TABLE_CELL_PADDING_X,
  DATA_TABLE_CONTROL_SIZE,
  DATA_TABLE_INTERNAL_COLUMN_WIDTHS,
} from "./sizes.utils";

const sharedSizes = ["sm", "md", "lg"] as const;

type SlotStyles = Record<string, Record<string, unknown>>;
const tableSize = (size: string) =>
  (tableSlotRecipe.variants!.size as Record<string, SlotStyles>)[size];
const dataTableSize = (size: string) =>
  (dataTableSlotRecipe.variants!.size as Record<string, SlotStyles>)[size];

describe("DataTable sizes shared with Table", () => {
  it.each(sharedSizes)("%s uses Table's cell padding", (size) => {
    const table = tableSize(size).cell;
    const dataTable = dataTableSize(size).cell;

    expect(dataTable.paddingLeft).toBe(table.px);
    expect(dataTable.paddingRight).toBe(table.px);
    expect(dataTable.paddingTop).toBe(table.py);
    expect(dataTable.paddingBottom).toBe(table.py);
  });

  it.each(sharedSizes)("%s uses Table's text style", (size) => {
    expect(dataTableSize(size).cell.textStyle).toBe(
      tableSize(size).root.textStyle
    );
  });

  it.each(sharedSizes)(
    "%s padding constant matches Table's padding token",
    (size) => {
      expect(DATA_TABLE_CELL_PADDING_X[size].token).toBe(
        tableSize(size).cell.px
      );
    }
  );
});

describe("DATA_TABLE_INTERNAL_COLUMN_WIDTHS", () => {
  it("adds the horizontal cell padding on both sides of the control", () => {
    expect(DATA_TABLE_INTERNAL_COLUMN_WIDTHS).toEqual({
      sm: { padded: 40, bare: 24 },
      md: { padded: 48, bare: 24 },
      lg: { padded: 56, bare: 24 },
      xl: { padded: 72, bare: 24 },
    });
  });

  it("never makes a column narrower than the 24px control target", () => {
    for (const widths of Object.values(DATA_TABLE_INTERNAL_COLUMN_WIDTHS)) {
      expect(widths.bare).toBeGreaterThanOrEqual(DATA_TABLE_CONTROL_SIZE);
      expect(widths.padded).toBeGreaterThanOrEqual(DATA_TABLE_CONTROL_SIZE);
    }
  });
});
