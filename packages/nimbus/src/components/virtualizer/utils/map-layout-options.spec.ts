import { describe, it, expect } from "vitest";
import { Size } from "react-aria-components";
import {
  mapListLayoutOptions,
  mapTableLayoutOptions,
  mapGridLayoutOptions,
} from "./map-layout-options";

describe("mapListLayoutOptions", () => {
  it("returns an empty object when there are no options", () => {
    expect(mapListLayoutOptions()).toEqual({});
  });

  it("maps Nimbus names to React Aria list layout names", () => {
    expect(
      mapListLayoutOptions({
        rowHeight: 36,
        estimatedRowHeight: 40,
        headingHeight: 30,
        estimatedHeadingHeight: 32,
        loaderHeight: 44,
      })
    ).toEqual({
      rowSize: 36,
      estimatedRowSize: 40,
      headingSize: 30,
      estimatedHeadingSize: 32,
      loaderSize: 44,
    });
  });

  it("resolves spacing tokens and keeps pixel numbers", () => {
    expect(mapListLayoutOptions({ gap: "100", padding: 8 })).toEqual({
      gap: 4,
      padding: 8,
    });
  });

  it("omits options that are not set", () => {
    expect(mapListLayoutOptions({ estimatedRowHeight: 38 })).toEqual({
      estimatedRowSize: 38,
    });
  });
});

describe("mapTableLayoutOptions", () => {
  it("passes table names through and resolves spacing", () => {
    expect(
      mapTableLayoutOptions({
        rowHeight: 36,
        estimatedRowHeight: 40,
        headingHeight: 30,
        estimatedHeadingHeight: 32,
        loaderHeight: 44,
        gap: "50",
        padding: 0,
      })
    ).toEqual({
      rowHeight: 36,
      estimatedRowHeight: 40,
      headingHeight: 30,
      estimatedHeadingHeight: 32,
      loaderHeight: 44,
      gap: 2,
      padding: 0,
    });
  });

  it("never sets columnWidths, so React Aria's column resizing keeps working", () => {
    expect(mapTableLayoutOptions({ rowHeight: 36 })).not.toHaveProperty(
      "columnWidths"
    );
  });
});

describe("mapGridLayoutOptions", () => {
  it("converts sizes to React Aria Size instances", () => {
    const mapped = mapGridLayoutOptions({
      minItemSize: { width: 200, height: 160 },
      maxItemSize: { width: 400, height: 320 },
      minSpace: { width: 8, height: 12 },
    });
    expect(mapped.minItemSize).toBeInstanceOf(Size);
    expect(mapped.minItemSize).toMatchObject({ width: 200, height: 160 });
    expect(mapped.maxItemSize).toMatchObject({ width: 400, height: 320 });
    expect(mapped.minSpace).toMatchObject({ width: 8, height: 12 });
  });

  it("passes number and boolean options through", () => {
    expect(
      mapGridLayoutOptions({
        maxColumns: 4,
        maxHorizontalSpace: 24,
        preserveAspectRatio: true,
        loaderHeight: 44,
      })
    ).toEqual({
      maxColumns: 4,
      maxHorizontalSpace: 24,
      preserveAspectRatio: true,
      loaderHeight: 44,
    });
  });

  it("never sets direction, so React Aria's locale direction keeps working", () => {
    expect(mapGridLayoutOptions({ maxColumns: 2 })).not.toHaveProperty(
      "direction"
    );
  });
});
