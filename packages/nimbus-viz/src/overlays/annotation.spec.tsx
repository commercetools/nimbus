import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { ChartScaleProvider } from "../chart/scale-context";
import type { ChartScales } from "../chart/scale-context";
import { ChartThemeProvider } from "../theme";
import { Annotation } from "./annotation";
import { EventMarkers } from "./event-markers";
import { NowLine } from "./now-line";

const scales: ChartScales = {
  yScale: (v) => v,
  xScale: (v) => (typeof v === "number" ? v : 50),
  xBandwidth: 0,
  innerWidth: 200,
  innerHeight: 100,
};

function wrap(node: ReactNode) {
  return render(
    <ChartThemeProvider mode="light">
      <svg>
        <ChartScaleProvider value={scales}>{node}</ChartScaleProvider>
      </svg>
    </ChartThemeProvider>
  );
}

describe("Annotation", () => {
  it("renders a ringed marker, a leader line, and the label", () => {
    const { container, getByText } = wrap(
      <Annotation x={10} y={20} label="Spike" />
    );
    expect(container.querySelector("circle")).not.toBeNull();
    expect(container.querySelector("line")).not.toBeNull();
    expect(getByText("Spike")).toBeTruthy();
  });
});

describe("EventMarkers", () => {
  it("renders one rule per event with labels", () => {
    const { container, getByText } = wrap(
      <EventMarkers
        events={[
          { x: 10, label: "Deploy" },
          { x: 40 },
          { x: 80, label: "Incident" },
        ]}
      />
    );
    expect(container.querySelectorAll("line")).toHaveLength(3);
    expect(getByText("Deploy")).toBeTruthy();
    expect(getByText("Incident")).toBeTruthy();
  });
});

describe("NowLine", () => {
  it("renders a rule and a default 'Now' label", () => {
    const { container, getByText } = wrap(<NowLine at={30} />);
    expect(container.querySelector("line")).not.toBeNull();
    expect(getByText("Now")).toBeTruthy();
  });
});
