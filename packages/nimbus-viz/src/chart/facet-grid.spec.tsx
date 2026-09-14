import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FacetGrid } from "./facet-grid";
import { ChartThemeProvider } from "../theme";

describe("FacetGrid", () => {
  it("lays out one labeled cell per facet and hands each a positive size", () => {
    const sizes: { width: number; height: number }[] = [];
    const { getByText, container } = render(
      <ChartThemeProvider mode="light">
        <FacetGrid
          width={400}
          height={300}
          facets={[
            { key: "eu", label: "EU", data: 1 },
            { key: "us", label: "US", data: 2 },
            { key: "apac", label: "APAC", data: 3 },
            { key: "latam", label: "LATAM", data: 4 },
          ]}
          renderCell={(f, size) => {
            sizes.push(size);
            return <div data-facet={f.key} />;
          }}
        />
      </ChartThemeProvider>
    );
    expect(getByText("EU")).toBeTruthy();
    expect(getByText("LATAM")).toBeTruthy();
    expect(container.querySelectorAll("[data-facet]")).toHaveLength(4);
    expect(sizes[0].width).toBeGreaterThan(0);
    expect(sizes[0].height).toBeGreaterThan(0);
  });

  it("falls back to the key when no label is given", () => {
    const { getByText } = render(
      <ChartThemeProvider mode="light">
        <FacetGrid
          width={200}
          height={150}
          facets={[{ key: "solo", data: 0 }]}
          renderCell={() => <div />}
        />
      </ChartThemeProvider>
    );
    expect(getByText("solo")).toBeTruthy();
  });
});
