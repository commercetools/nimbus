import { afterEach, describe, expect, it, vi } from "vitest";
import type { ChartBaseProps } from "../chart.types";
import { getCategories, getCategory } from "./chart-categories";

interface Visit {
  browser: string;
  visitors: number;
}

describe("getCategory", () => {
  it("reads the category of a row as a string", () => {
    expect(getCategory({ browser: "chrome", visitors: 1 }, "browser")).toBe(
      "chrome"
    );
    expect(getCategory({ year: 2026 }, "year")).toBe("2026");
  });
});

describe("getCategories", () => {
  afterEach(() => vi.restoreAllMocks());

  it("lists the distinct categories in data order", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const data = [{ b: "x" }, { b: "y" }, { b: "z" }];
    expect(getCategories(data, "b")).toEqual(["x", "y", "z"]);
    expect(warn).not.toHaveBeenCalled();
  });

  it("warns once per key in development when a category repeats", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const rows = [{ repeated: "x" }, { repeated: "x" }, { repeated: "y" }];
    expect(getCategories(rows, "repeated")).toEqual(["x", "y"]);
    // A re-render calls it again with the same key
    getCategories(rows, "repeated");
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe("chart data type", () => {
  it("accepts rows typed with an interface", () => {
    const rows: Visit[] = [{ browser: "chrome", visitors: 275 }];
    const data: ChartBaseProps["data"] = rows;
    expect(getCategories(data, "browser")).toEqual(["chrome"]);
  });
});
