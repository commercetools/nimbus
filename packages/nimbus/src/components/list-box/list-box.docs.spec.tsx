import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ListBox, NimbusProvider } from "@commercetools/nimbus";

const Fruit = (
  props: Partial<React.ComponentProps<typeof ListBox.Root>> = {}
) => (
  <NimbusProvider>
    <ListBox.Root aria-label="Fruit" {...props}>
      <ListBox.Item id="apple">Apple</ListBox.Item>
      <ListBox.Item id="banana">Banana</ListBox.Item>
      <ListBox.Item id="cherry">Cherry</ListBox.Item>
    </ListBox.Root>
  </NimbusProvider>
);

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the list and its options render
 * @docs-order 1
 */
describe("ListBox - Basic rendering", () => {
  it("renders a listbox with all options", () => {
    render(<Fruit selectionMode="single" />);

    expect(screen.getByRole("listbox", { name: "Fruit" })).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });
});

/**
 * @docs-section single-selection
 * @docs-title Single Selection Tests
 * @docs-description Selecting an option, and single-select replacing behaviour
 * @docs-order 2
 */
describe("ListBox - Single selection", () => {
  it("selects an option and fires onSelectionChange", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <Fruit selectionMode="single" onSelectionChange={onSelectionChange} />
    );

    await user.click(screen.getByRole("option", { name: "Banana" }));

    expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });

  it("replaces the previous selection", async () => {
    const user = userEvent.setup();
    render(<Fruit selectionMode="single" defaultSelectedKeys={["banana"]} />);

    await user.click(screen.getByRole("option", { name: "Cherry" }));

    expect(screen.getByRole("option", { name: "Cherry" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("option", { name: "Banana" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });
});

/**
 * @docs-section multiple-selection
 * @docs-title Multiple Selection Tests
 * @docs-description Toggling multiple options independently
 * @docs-order 3
 */
describe("ListBox - Multiple selection", () => {
  it("toggles options independently", async () => {
    const user = userEvent.setup();
    render(<Fruit selectionMode="multiple" />);

    await user.click(screen.getByRole("option", { name: "Apple" }));
    await user.click(screen.getByRole("option", { name: "Cherry" }));

    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("option", { name: "Cherry" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});

/**
 * @docs-section disabled
 * @docs-title Disabled Option Tests
 * @docs-description A disabled option cannot be selected
 * @docs-order 4
 */
describe("ListBox - Disabled options", () => {
  it("does not select a disabled option", async () => {
    const user = userEvent.setup();
    render(<Fruit selectionMode="single" disabledKeys={["banana"]} />);

    const banana = screen.getByRole("option", { name: "Banana" });
    expect(banana).toHaveAttribute("aria-disabled", "true");

    await user.click(banana);
    expect(banana).not.toHaveAttribute("aria-selected", "true");
  });
});

/**
 * @docs-section empty-state
 * @docs-title Empty State Tests
 * @docs-description The default empty message renders with no options
 * @docs-order 5
 */
describe("ListBox - Empty state", () => {
  it("renders the default empty message", () => {
    render(
      <NimbusProvider>
        <ListBox.Root aria-label="Empty">{[]}</ListBox.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("No options available")).toBeInTheDocument();
  });
});
