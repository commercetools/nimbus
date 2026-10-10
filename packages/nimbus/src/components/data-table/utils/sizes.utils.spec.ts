import { describe, it, expect } from "vitest";
import { themeTokens } from "@commercetools/nimbus-tokens";
import { tableSlotRecipe } from "../../table/table.recipe";
import { dataTableSlotRecipe } from "../data-table.recipe";
import type { DataTableSize } from "../data-table.types";
import {
  DATA_TABLE_CELL_PADDING_X,
  DATA_TABLE_CONTROL_SIZE,
  DATA_TABLE_INTERNAL_COLUMN_WIDTHS,
} from "./sizes.utils";

const sharedSizes = ["sm", "md", "lg"] as const;
const allSizes = [...sharedSizes, "xl"] as const;

type SlotStyles = Record<string, Record<string, unknown>>;
const tableSize = (size: string) =>
  (tableSlotRecipe.variants!.size as Record<string, SlotStyles>)[size];
const dataTableSize = (size: string) =>
  (dataTableSlotRecipe.variants!.size as Record<string, SlotStyles>)[size];
const dataTableVar = (size: DataTableSize, name: string) =>
  dataTableSize(size).root[name];

describe("DataTable sizes shared with Table", () => {
  it.each(sharedSizes)("%s uses Table's cell padding", (size) => {
    const table = tableSize(size).cell;

    expect(dataTableVar(size, "--data-table-padding-x")).toBe(
      `{spacing.${table.px}}`
    );
    expect(dataTableVar(size, "--data-table-cell-padding-y")).toBe(
      `{spacing.${table.py}}`
    );
  });

  it.each(sharedSizes)("%s uses Table's column header padding", (size) => {
    expect(dataTableVar(size, "--data-table-header-padding-y")).toBe(
      `{spacing.${tableSize(size).columnHeader.py}}`
    );
  });

  it.each(sharedSizes)("%s uses Table's text style", (size) => {
    expect(dataTableSize(size).cell.textStyle).toBe(
      tableSize(size).root.textStyle
    );
    expect(dataTableSize(size).header.textStyle).toBe(
      tableSize(size).root.textStyle
    );
  });
});

describe("DATA_TABLE_CELL_PADDING_X", () => {
  it.each(allSizes)(
    "%s matches the recipe's horizontal padding token",
    (size) => {
      const token = /^\{spacing\.(\w+)\}$/.exec(
        String(dataTableVar(size, "--data-table-padding-x"))
      )?.[1];
      const spacing = themeTokens.spacing as Record<string, { value: string }>;

      expect(token, "padding is not a spacing token").toBeDefined();
      expect(spacing[token!].value).toBe(
        `${DATA_TABLE_CELL_PADDING_X[size]}px`
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
