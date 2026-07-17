import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import {
  Button,
  Checkbox,
  FilterMenu,
  NimbusProvider,
  Separator,
  Text,
} from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering
 * @docs-description Verify the FilterMenu opens with trigger click and renders sections.
 * @docs-order 1
 */
describe("FilterMenu - Basic rendering", () => {
  it("opens when the trigger is clicked and renders section labels", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <FilterMenu.Root>
          <FilterMenu.Trigger asChild>
            <Button>Filters</Button>
          </FilterMenu.Trigger>
          <FilterMenu.Content width="280px">
            <FilterMenu.Section label="Status">
              <FilterMenu.Option isSelected={false} onSelect={() => {}}>
                Published
              </FilterMenu.Option>
            </FilterMenu.Section>
          </FilterMenu.Content>
        </FilterMenu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Filters" }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Published" })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section option-selection
 * @docs-title Option selection
 * @docs-description Verify that selecting an option calls onSelect and the popover stays open.
 * @docs-order 2
 */
describe("FilterMenu - Option selection", () => {
  it("calls onSelect when an option is clicked and keeps the popover open", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    const App = () => {
      const [selected, setSelected] = useState(false);

      return (
        <NimbusProvider>
          <FilterMenu.Root>
            <FilterMenu.Trigger asChild>
              <Button>Filters</Button>
            </FilterMenu.Trigger>
            <FilterMenu.Content width="280px">
              <FilterMenu.Section label="Status">
                <FilterMenu.Option
                  isSelected={selected}
                  onSelect={() => {
                    setSelected(!selected);
                    handleSelect();
                  }}
                >
                  Active
                </FilterMenu.Option>
              </FilterMenu.Section>
            </FilterMenu.Content>
          </FilterMenu.Root>
        </NimbusProvider>
      );
    };

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Active" }));

    expect(handleSelect).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Active" })).toHaveAttribute(
      "data-selected",
      "true"
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

/**
 * @docs-section clear-action
 * @docs-title Clear action
 * @docs-description Verify the ClearAction fires the callback and keeps the popover open.
 * @docs-order 3
 */
describe("FilterMenu - Clear action", () => {
  it("calls onPress when the clear button is clicked", async () => {
    const user = userEvent.setup();

    const App = () => {
      const [status, setStatus] = useState<string | null>("Active");

      return (
        <NimbusProvider>
          <FilterMenu.Root>
            <FilterMenu.Trigger asChild>
              <Button>Filters</Button>
            </FilterMenu.Trigger>
            <FilterMenu.Content width="280px">
              <FilterMenu.Section label="Status">
                <FilterMenu.Option
                  isSelected={status === "Active"}
                  onSelect={() =>
                    setStatus((s) => (s === "Active" ? null : "Active"))
                  }
                >
                  Active
                </FilterMenu.Option>
              </FilterMenu.Section>
              <Separator />
              <FilterMenu.ClearAction onPress={() => setStatus(null)}>
                Clear all filters
              </FilterMenu.ClearAction>
            </FilterMenu.Content>
          </FilterMenu.Root>
        </NimbusProvider>
      );
    };

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Active" })).toHaveAttribute(
      "data-selected",
      "true"
    );

    await user.click(screen.getByRole("button", { name: "Clear all filters" }));

    expect(screen.getByRole("button", { name: "Active" })).not.toHaveAttribute(
      "data-selected",
      "true"
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

/**
 * @docs-section escape-dismissal
 * @docs-title Escape key dismissal
 * @docs-description Verify that pressing Escape closes the FilterMenu.
 * @docs-order 4
 */
describe("FilterMenu - Escape dismissal", () => {
  it("closes the popover when Escape is pressed", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <FilterMenu.Root>
          <FilterMenu.Trigger asChild>
            <Button>Filters</Button>
          </FilterMenu.Trigger>
          <FilterMenu.Content width="280px">
            <FilterMenu.Section label="Status">
              <Text>Filter content</Text>
            </FilterMenu.Section>
          </FilterMenu.Content>
        </FilterMenu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
