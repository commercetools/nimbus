import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ChartThemeProvider } from "../theme";
import { Legend } from "./legend";

const items = [
  { label: "New", color: "#3987e5" },
  { label: "Returning", color: "#e8783c" },
];

describe("Legend", () => {
  it("renders the default swatch + label per item", () => {
    const { container, getByText } = render(
      <ChartThemeProvider>
        <Legend items={items} />
      </ChartThemeProvider>
    );
    expect(getByText("New")).toBeTruthy();
    expect(getByText("Returning")).toBeTruthy();
    expect(container.querySelectorAll("li")).toHaveLength(2);
    // The default swatch is an aria-hidden span colored from the item.
    const swatches = container.querySelectorAll('span[aria-hidden="true"]');
    expect(swatches).toHaveLength(2);
    // jsdom normalizes hex to rgb() when read back via .style.
    expect((swatches[0] as HTMLElement).style.background).toBe(
      "rgb(57, 135, 229)"
    );
  });

  it("renderItem replaces the default swatch + label, not merged in", () => {
    const { container, getByText, queryByText } = render(
      <ChartThemeProvider>
        <Legend
          items={items}
          renderItem={(item, i) => <b>{`${i}: ${item.label}!`}</b>}
        />
      </ChartThemeProvider>
    );
    expect(getByText("0: New!")).toBeTruthy();
    expect(getByText("1: Returning!")).toBeTruthy();
    // The plain label text is gone -- renderItem fully owns the <li> body.
    expect(queryByText("New")).toBeNull();
    expect(container.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(
      0
    );
  });
});
