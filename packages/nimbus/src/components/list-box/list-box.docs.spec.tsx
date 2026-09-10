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

/**
 * @docs-section async-load-more
 * @docs-title Async Load-More Tests
 * @docs-description Paginated list that shows a spinner row while the next page
 *   is fetched, then appends it — the infinite-scroll integration pattern.
 * @docs-order 6
 */
describe("ListBox - Async load more", () => {
  const page1 = [
    { id: "apple", name: "Apple" },
    { id: "banana", name: "Banana" },
  ];
  const page2 = [
    { id: "cherry", name: "Cherry" },
    { id: "date", name: "Date" },
  ];

  const PaginatedFruit = ({
    fruits,
    isLoading,
  }: {
    fruits: Array<{ id: string; name: string }>;
    isLoading: boolean;
  }) => (
    <NimbusProvider>
      <ListBox.Root aria-label="Fruit" selectionMode="single">
        {fruits.map((fruit) => (
          <ListBox.Item key={fruit.id} id={fruit.id}>
            {fruit.name}
          </ListBox.Item>
        ))}
        <ListBox.LoadMore isLoading={isLoading} />
      </ListBox.Root>
    </NimbusProvider>
  );

  it("shows a spinner while loading, then appends the next page", () => {
    const { rerender } = render(
      <PaginatedFruit fruits={page1} isLoading={true} />
    );

    // While the next page is being fetched, the spinner row is shown alongside
    // the already-loaded options.
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Cherry" })).toBeNull();

    // The fetch resolves: the consumer appends page 2 and clears the flag.
    rerender(
      <PaginatedFruit fruits={[...page1, ...page2]} isLoading={false} />
    );

    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByRole("option", { name: "Cherry" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Date" })).toBeInTheDocument();
  });
});
