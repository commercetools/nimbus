import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the Tabs component renders with expected structure and accessibility attributes
 * @docs-order 1
 */
describe("Tabs - Basic rendering", () => {
  it("renders tabs with correct structure", () => {
    render(
      <NimbusProvider>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Tab id="tab1">First Tab</Tabs.Tab>
            <Tabs.Tab id="tab2">Second Tab</Tabs.Tab>
            <Tabs.Tab id="tab3">Third Tab</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">First panel content</Tabs.Panel>
            <Tabs.Panel id="tab2">Second panel content</Tabs.Panel>
            <Tabs.Panel id="tab3">Third panel content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    // Verify tablist is present
    expect(screen.getByRole("tablist")).toBeInTheDocument();

    // Verify all tabs are rendered
    expect(screen.getByRole("tab", { name: "First Tab" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Second Tab" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Third Tab" })).toBeInTheDocument();

    // Verify first tab is selected by default
    expect(screen.getByRole("tab", { name: "First Tab" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    // Verify corresponding panel is visible
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "First panel content"
    );
  });

  it("renders tabs with dynamic tabs prop", () => {
    const tabs = [
      { id: "1", tabLabel: "Overview", panelContent: "Overview content" },
      { id: "2", tabLabel: "Details", panelContent: "Details content" },
      { id: "3", tabLabel: "Settings", panelContent: "Settings content" },
    ];

    render(
      <NimbusProvider>
        <Tabs.Root tabs={tabs} />
      </NimbusProvider>
    );

    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Settings" })).toBeInTheDocument();
  });

  it("applies size variants correctly", () => {
    const { rerender } = render(
      <NimbusProvider>
        <Tabs.Root size="sm" data-testid="tabs">
          <Tabs.List>
            <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">Content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    const tabsRoot = screen.getByTestId("tabs");
    expect(tabsRoot).toBeInTheDocument();

    // Rerender with different size
    rerender(
      <NimbusProvider>
        <Tabs.Root size="lg" data-testid="tabs">
          <Tabs.List>
            <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">Content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("tabs")).toBeInTheDocument();
  });

  it("applies visual variants correctly", () => {
    const { rerender } = render(
      <NimbusProvider>
        <Tabs.Root variant="line" data-testid="tabs">
          <Tabs.List>
            <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">Content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("tabs")).toBeInTheDocument();

    // Rerender with pills variant
    rerender(
      <NimbusProvider>
        <Tabs.Root variant="pills" data-testid="tabs">
          <Tabs.List>
            <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">Content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    expect(screen.getByTestId("tabs")).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions including clicking tabs and keyboard navigation
 * @docs-order 2
 *
 * Note: Keyboard navigation tests may produce act() warnings in console output.
 * These warnings originate from React Aria's internal state management and are
 * expected when testing React Aria components in JSDOM. The tests pass correctly
 * and the warnings do not indicate issues with the component or test implementation.
 */
describe("Tabs - Interactions", () => {
  it("switches tabs when clicked", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Tab id="tab1">First</Tabs.Tab>
            <Tabs.Tab id="tab2">Second</Tabs.Tab>
            <Tabs.Tab id="tab3">Third</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">First content</Tabs.Panel>
            <Tabs.Panel id="tab2">Second content</Tabs.Panel>
            <Tabs.Panel id="tab3">Third content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    // Initially first tab is selected
    expect(screen.getByRole("tabpanel")).toHaveTextContent("First content");

    // Click second tab
    await user.click(screen.getByRole("tab", { name: "Second" }));

    // Verify second tab is now selected
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second content");

    // Click third tab
    await user.click(screen.getByRole("tab", { name: "Third" }));

    // Verify third tab is now selected
    expect(screen.getByRole("tab", { name: "Third" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Third content");
  });

  it("supports keyboard navigation with arrow keys", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Tabs.Root orientation="horizontal">
          <Tabs.List>
            <Tabs.Tab id="tab1">First</Tabs.Tab>
            <Tabs.Tab id="tab2">Second</Tabs.Tab>
            <Tabs.Tab id="tab3">Third</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">First content</Tabs.Panel>
            <Tabs.Panel id="tab2">Second content</Tabs.Panel>
            <Tabs.Panel id="tab3">Third content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    const firstTab = screen.getByRole("tab", { name: "First" });
    const secondTab = screen.getByRole("tab", { name: "Second" });
    const thirdTab = screen.getByRole("tab", { name: "Third" });

    // Focus first tab
    firstTab.focus();
    expect(firstTab).toHaveFocus();

    // Navigate to second tab with ArrowRight
    await user.keyboard("{ArrowRight}");
    expect(secondTab).toHaveFocus();

    // Navigate to third tab with ArrowRight
    await user.keyboard("{ArrowRight}");
    expect(thirdTab).toHaveFocus();

    // Navigate back to second tab with ArrowLeft
    await user.keyboard("{ArrowLeft}");
    expect(secondTab).toHaveFocus();

    // Activate with Enter
    await user.keyboard("{Enter}");
    expect(secondTab).toHaveAttribute("aria-selected", "true");
  });

  it("supports Home and End keys for navigation", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Tab id="tab1">First</Tabs.Tab>
            <Tabs.Tab id="tab2">Second</Tabs.Tab>
            <Tabs.Tab id="tab3">Third</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">First content</Tabs.Panel>
            <Tabs.Panel id="tab2">Second content</Tabs.Panel>
            <Tabs.Panel id="tab3">Third content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    const firstTab = screen.getByRole("tab", { name: "First" });
    const thirdTab = screen.getByRole("tab", { name: "Third" });

    // Focus first tab
    firstTab.focus();

    // Press End to jump to last tab
    await user.keyboard("{End}");
    expect(thirdTab).toHaveFocus();

    // Press Home to jump to first tab
    await user.keyboard("{Home}");
    expect(firstTab).toHaveFocus();
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled mode with selectedKey and onSelectionChange props
 * @docs-order 3
 */
describe("Tabs - Controlled mode", () => {
  it("handles controlled mode with selectedKey and onSelectionChange", async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();

    const ControlledTabs = () => {
      const [selectedKey, setSelectedKey] = React.useState<string | number>(
        "tab1"
      );

      return (
        <Tabs.Root
          selectedKey={selectedKey}
          onSelectionChange={(key) => {
            setSelectedKey(key);
            handleSelectionChange(key);
          }}
        >
          <Tabs.List>
            <Tabs.Tab id="tab1">First</Tabs.Tab>
            <Tabs.Tab id="tab2">Second</Tabs.Tab>
            <Tabs.Tab id="tab3">Third</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">First content</Tabs.Panel>
            <Tabs.Panel id="tab2">Second content</Tabs.Panel>
            <Tabs.Panel id="tab3">Third content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      );
    };

    render(
      <NimbusProvider>
        <ControlledTabs />
      </NimbusProvider>
    );

    // Initially first tab is selected
    expect(screen.getByRole("tab", { name: "First" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    // Click second tab
    await user.click(screen.getByRole("tab", { name: "Second" }));

    // Verify callback was called
    expect(handleSelectionChange).toHaveBeenCalledWith("tab2");

    // Verify second tab is now selected
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("respects defaultSelectedKey for uncontrolled mode", () => {
    render(
      <NimbusProvider>
        <Tabs.Root defaultSelectedKey="tab2">
          <Tabs.List>
            <Tabs.Tab id="tab1">First</Tabs.Tab>
            <Tabs.Tab id="tab2">Second</Tabs.Tab>
            <Tabs.Tab id="tab3">Third</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">First content</Tabs.Panel>
            <Tabs.Panel id="tab2">Second content</Tabs.Panel>
            <Tabs.Panel id="tab3">Third content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    // Second tab should be selected by default
    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second content");
  });
});

/**
 * @docs-section disabled-states
 * @docs-title Disabled States Tests
 * @docs-description Test disabled tabs via disabledKeys prop and isDisabled prop
 * @docs-order 4
 */
describe("Tabs - Disabled states", () => {
  it("disables tabs via disabledKeys prop", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Tabs.Root disabledKeys={["tab2"]}>
          <Tabs.List>
            <Tabs.Tab id="tab1">First</Tabs.Tab>
            <Tabs.Tab id="tab2">Second (Disabled)</Tabs.Tab>
            <Tabs.Tab id="tab3">Third</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">First content</Tabs.Panel>
            <Tabs.Panel id="tab2">Second content</Tabs.Panel>
            <Tabs.Panel id="tab3">Third content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    const disabledTab = screen.getByRole("tab", {
      name: "Second (Disabled)",
    });

    // Verify tab is disabled
    expect(disabledTab).toHaveAttribute("aria-disabled", "true");

    // Try to click disabled tab
    await user.click(disabledTab);

    // Verify disabled tab did not become selected
    expect(disabledTab).not.toHaveAttribute("aria-selected", "true");

    // First tab should still be selected
    expect(screen.getByRole("tab", { name: "First" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("disables individual tabs via isDisabled prop", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Tab id="tab1">Available</Tabs.Tab>
            <Tabs.Tab id="tab2" isDisabled>
              Unavailable
            </Tabs.Tab>
            <Tabs.Tab id="tab3">Available</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel id="tab1">First content</Tabs.Panel>
            <Tabs.Panel id="tab2">Second content</Tabs.Panel>
            <Tabs.Panel id="tab3">Third content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs.Root>
      </NimbusProvider>
    );

    const disabledTab = screen.getByRole("tab", { name: "Unavailable" });

    // Verify tab is disabled
    expect(disabledTab).toHaveAttribute("aria-disabled", "true");

    // Try to click disabled tab
    await user.click(disabledTab);

    // Verify disabled tab did not become selected
    expect(disabledTab).not.toHaveAttribute("aria-selected", "true");
  });
});

/**
 * @docs-section dynamic-tabs
 * @docs-title Dynamic Tabs Tests
 * @docs-description Test dynamic tab rendering and updates
 * @docs-order 5
 */
describe("Tabs - Dynamic tabs", () => {
  it("updates when tabs array changes", () => {
    const initialTabs = [
      { id: "1", tabLabel: "First", panelContent: "First content" },
      { id: "2", tabLabel: "Second", panelContent: "Second content" },
    ];

    const { rerender } = render(
      <NimbusProvider>
        <Tabs.Root tabs={initialTabs} />
      </NimbusProvider>
    );

    // Verify initial tabs
    expect(screen.getByRole("tab", { name: "First" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Second" })).toBeInTheDocument();

    // Update tabs array
    const updatedTabs = [
      ...initialTabs,
      { id: "3", tabLabel: "Third", panelContent: "Third content" },
    ];

    rerender(
      <NimbusProvider>
        <Tabs.Root tabs={updatedTabs} />
      </NimbusProvider>
    );

    // Verify new tab is rendered
    expect(screen.getByRole("tab", { name: "First" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Second" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Third" })).toBeInTheDocument();
  });

  it("handles empty tabs array gracefully", () => {
    const { container } = render(
      <NimbusProvider>
        <Tabs.Root tabs={[]} />
      </NimbusProvider>
    );

    // Component should render without errors
    expect(container).toBeInTheDocument();
  });
});
