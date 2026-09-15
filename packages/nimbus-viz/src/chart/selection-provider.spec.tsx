import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "storybook/test";
import { SelectionProvider, useLinkedSelection } from "./selection-provider";

function SelectedReadout({ id }: { id: string }) {
  const { selected } = useLinkedSelection();
  return (
    <div data-testid={`readout-${id}`}>{selected.has(id) ? "on" : "off"}</div>
  );
}

function SelectButton({ id }: { id: string }) {
  const { setSelected } = useLinkedSelection();
  return (
    <button type="button" onClick={() => setSelected(new Set([id]))}>
      select {id}
    </button>
  );
}

function BrushReadout() {
  const { brushedDomain } = useLinkedSelection();
  return (
    <div data-testid="brushed">
      {brushedDomain ? brushedDomain.join(",") : "none"}
    </div>
  );
}

function BrushButton() {
  const { setBrushedDomain } = useLinkedSelection();
  return (
    <button type="button" onClick={() => setBrushedDomain([10, 20])}>
      brush
    </button>
  );
}

describe("SelectionProvider / useLinkedSelection", () => {
  it("throws when used outside a provider", () => {
    // Swallow the expected console.error React logs for the thrown render.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<SelectedReadout id="eu" />)).toThrow(
      /useLinkedSelection used outside a SelectionProvider/
    );
    spy.mockRestore();
  });

  it("broadcasts a selected entity-set to every consumer under one provider", async () => {
    render(
      <SelectionProvider>
        <SelectButton id="eu" />
        <SelectedReadout id="eu" />
        <SelectedReadout id="us" />
      </SelectionProvider>
    );
    expect(screen.getByTestId("readout-eu")).toHaveTextContent("off");
    expect(screen.getByTestId("readout-us")).toHaveTextContent("off");

    await userEvent.click(screen.getByRole("button", { name: "select eu" }));

    expect(screen.getByTestId("readout-eu")).toHaveTextContent("on");
    expect(screen.getByTestId("readout-us")).toHaveTextContent("off");
  });

  it("broadcasts a brushed domain to every consumer under one provider", async () => {
    render(
      <SelectionProvider>
        <BrushButton />
        <BrushReadout />
      </SelectionProvider>
    );
    expect(screen.getByTestId("brushed")).toHaveTextContent("none");

    await userEvent.click(screen.getByRole("button", { name: "brush" }));

    expect(screen.getByTestId("brushed")).toHaveTextContent("10,20");
  });

  it("keeps two independently-mounted providers unlinked", async () => {
    render(
      <>
        <SelectionProvider>
          <SelectButton id="eu" />
          <SelectedReadout id="eu" />
        </SelectionProvider>
        <SelectionProvider>
          <SelectedReadout id="eu" />
        </SelectionProvider>
      </>
    );
    const readouts = screen.getAllByTestId("readout-eu");
    await userEvent.click(screen.getByRole("button", { name: "select eu" }));
    expect(readouts[0]).toHaveTextContent("on");
    expect(readouts[1]).toHaveTextContent("off");
  });
});
