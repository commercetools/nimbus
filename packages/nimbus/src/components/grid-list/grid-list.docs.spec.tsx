import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GridList, NimbusProvider, Text } from "@commercetools/nimbus";

const Places = (
  props: Partial<React.ComponentProps<typeof GridList.Root>> = {}
) => (
  <NimbusProvider>
    <GridList.Root aria-label="Places" {...props}>
      <GridList.Item id="mountain" textValue="Mountain">
        <Text>Mountain</Text>
      </GridList.Item>
      <GridList.Item id="lake" textValue="Lake">
        <Text>Lake</Text>
      </GridList.Item>
      <GridList.Item id="forest" textValue="Forest">
        <Text>Forest</Text>
      </GridList.Item>
    </GridList.Root>
  </NimbusProvider>
);

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the list and its items render
 * @docs-order 1
 */
describe("GridList - Basic rendering", () => {
  it("renders a named grid with one row per item", () => {
    render(<Places />);

    expect(screen.getByRole("grid", { name: "Places" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("shows no checkbox by default", () => {
    render(<Places selectionMode="multiple" />);

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});

/**
 * @docs-section selection
 * @docs-title Selection Tests
 * @docs-description Selecting items and reacting to selection changes
 * @docs-order 2
 */
describe("GridList - Selection", () => {
  it("selects an item and calls onSelectionChange (single)", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <Places selectionMode="single" onSelectionChange={onSelectionChange} />
    );

    await user.click(screen.getByRole("row", { name: "Lake" }));

    expect(screen.getByRole("row", { name: "Lake" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  it("selects several items (multiple)", async () => {
    const user = userEvent.setup();
    render(<Places selectionMode="multiple" />);

    await user.click(screen.getByRole("row", { name: "Mountain" }));
    await user.click(screen.getByRole("row", { name: "Forest" }));

    expect(screen.getByRole("row", { name: "Mountain" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("row", { name: "Forest" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("row", { name: "Lake" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("does not select disabled items", async () => {
    const user = userEvent.setup();
    render(<Places selectionMode="multiple" disabledKeys={["lake"]} />);

    await user.click(screen.getByRole("row", { name: "Lake" }));

    expect(screen.getByRole("row", { name: "Lake" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    expect(screen.getByRole("row", { name: "Lake" })).not.toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});

/**
 * @docs-section actions
 * @docs-title Action Tests
 * @docs-description Running an action when an item is pressed
 * @docs-order 3
 */
describe("GridList - Actions", () => {
  it("calls onAction with the item key when an item is pressed", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Places selectionMode="none" onAction={onAction} />);

    await user.click(screen.getByRole("row", { name: "Lake" }));

    expect(onAction).toHaveBeenCalledWith("lake");
  });
});

/**
 * @docs-section built-in-controls
 * @docs-title Built-in Controls Tests
 * @docs-description The selection checkbox and the Root and Item override rule
 * @docs-order 4
 */
describe("GridList - Built-in controls", () => {
  it("shows a checkbox in every item when enabled on the Root", () => {
    render(<Places selectionMode="multiple" showSelectionCheckbox />);

    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  it("lets an item override the Root setting", () => {
    render(
      <NimbusProvider>
        <GridList.Root
          aria-label="Places"
          selectionMode="multiple"
          showSelectionCheckbox
        >
          <GridList.Item id="a" textValue="Alpha">
            Alpha
          </GridList.Item>
          <GridList.Item id="b" textValue="Bravo" showSelectionCheckbox={false}>
            Bravo
          </GridList.Item>
        </GridList.Root>
      </NimbusProvider>
    );

    expect(
      within(screen.getByRole("row", { name: "Alpha" })).getByRole("checkbox")
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("row", { name: "Bravo" })).queryByRole("checkbox")
    ).not.toBeInTheDocument();
  });

  it("does not show a checkbox with single selection", () => {
    render(<Places selectionMode="single" showSelectionCheckbox />);

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});

/**
 * @docs-section empty-state
 * @docs-title Empty State Tests
 * @docs-description The default and a custom empty state
 * @docs-order 5
 */
describe("GridList - Empty state", () => {
  it("shows a custom empty state", () => {
    render(
      <NimbusProvider>
        <GridList.Root
          aria-label="Places"
          renderEmptyState={() => <Text>No places yet</Text>}
        >
          {[]}
        </GridList.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("No places yet")).toBeInTheDocument();
  });
});
