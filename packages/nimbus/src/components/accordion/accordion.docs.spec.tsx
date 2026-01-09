import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, NimbusProvider, Text } from "@commercetools/nimbus";

/**
 * @docs-section setup
 * @docs-title Test Setup
 * @docs-description Configure your testing environment for Accordion components
 * @docs-order 0
 */
describe("Accordion - Test Setup", () => {
  it("renders accordion with basic structure", () => {
    render(
      <NimbusProvider>
        <Accordion.Root>
          <Accordion.Item value="test-item">
            <Accordion.Header>Test Header</Accordion.Header>
            <Accordion.Content>
              <Text>Test Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: "Test Header" })
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { hidden: true })).toBeInTheDocument();
  });

  it("renders multiple accordion items", () => {
    render(
      <NimbusProvider>
        <Accordion.Root>
          <Accordion.Item value="item-1">
            <Accordion.Header>First Item</Accordion.Header>
            <Accordion.Content>
              <Text>First Content</Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>Second Item</Accordion.Header>
            <Accordion.Content>
              <Text>Second Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: "First Item" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Second Item" })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title User Interactions
 * @docs-description Test user interactions with accordion items
 * @docs-order 1
 */
describe("Accordion - User Interactions", () => {
  it("expands and collapses items when clicked", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Accordion.Root>
          <Accordion.Item value="test-item">
            <Accordion.Header>Clickable Header</Accordion.Header>
            <Accordion.Content>
              <Text>Hidden Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    const header = screen.getByRole("button", { name: "Clickable Header" });
    const content = screen.getByRole("group", { hidden: true });

    // Initially collapsed
    expect(content).not.toBeVisible();
    expect(header).toHaveAttribute("aria-expanded", "false");

    // Click to expand
    await user.click(header);
    expect(content).toBeVisible();
    expect(header).toHaveAttribute("aria-expanded", "true");

    // Click to collapse
    await user.click(header);
    expect(content).not.toBeVisible();
    expect(header).toHaveAttribute("aria-expanded", "false");
  });

  it("handles keyboard navigation with Space and Enter", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Accordion.Root>
          <Accordion.Item value="keyboard-item">
            <Accordion.Header>Keyboard Test</Accordion.Header>
            <Accordion.Content>
              <Text>Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    const header = screen.getByRole("button", { name: "Keyboard Test" });
    const content = screen.getByRole("group", { hidden: true });

    // Focus the header using tab navigation
    await user.tab();
    await waitFor(() => {
      expect(header).toHaveFocus();
    });

    // Expand with Enter key
    await user.keyboard("{Enter}");
    await waitFor(() => {
      expect(content).toBeVisible();
    });

    // Collapse with Space key
    await user.keyboard(" ");
    await waitFor(() => {
      expect(content).not.toBeVisible();
    });
  });
});

/**
 * @docs-section multiple-expansion
 * @docs-title Multiple Item Expansion
 * @docs-description Test accordion behavior with multiple expanded items
 * @docs-order 2
 */
describe("Accordion - Multiple Expansion", () => {
  it("allows only one item expanded by default", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Accordion.Root>
          <Accordion.Item value="item-1">
            <Accordion.Header>First Item</Accordion.Header>
            <Accordion.Content>
              <Text>First Content</Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>Second Item</Accordion.Header>
            <Accordion.Content>
              <Text>Second Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    const firstHeader = screen.getByRole("button", { name: "First Item" });
    const secondHeader = screen.getByRole("button", { name: "Second Item" });
    const panels = screen.getAllByRole("group", { hidden: true });

    // Expand first item
    await user.click(firstHeader);
    expect(panels[0]).toBeVisible();
    expect(panels[1]).not.toBeVisible();

    // Expand second item - first should close
    await user.click(secondHeader);
    expect(panels[0]).not.toBeVisible();
    expect(panels[1]).toBeVisible();
  });

  it("allows multiple items expanded when allowsMultipleExpanded is true", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Accordion.Root allowsMultipleExpanded>
          <Accordion.Item value="item-1">
            <Accordion.Header>First Item</Accordion.Header>
            <Accordion.Content>
              <Text>First Content</Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>Second Item</Accordion.Header>
            <Accordion.Content>
              <Text>Second Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    const firstHeader = screen.getByRole("button", { name: "First Item" });
    const secondHeader = screen.getByRole("button", { name: "Second Item" });
    const panels = screen.getAllByRole("group", { hidden: true });

    // Expand first item
    await user.click(firstHeader);
    expect(panels[0]).toBeVisible();

    // Expand second item - first should remain open
    await user.click(secondHeader);
    expect(panels[0]).toBeVisible();
    expect(panels[1]).toBeVisible();
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode
 * @docs-description Test controlled accordion state management
 * @docs-order 3
 */
describe("Accordion - Controlled Mode", () => {
  it("respects controlled expandedKeys prop", () => {
    render(
      <NimbusProvider>
        <Accordion.Root expandedKeys={["item-1"]}>
          <Accordion.Item value="item-1">
            <Accordion.Header>First Item</Accordion.Header>
            <Accordion.Content>
              <Text>First Content</Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>Second Item</Accordion.Header>
            <Accordion.Content>
              <Text>Second Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    const panels = screen.getAllByRole("group", { hidden: true });

    // First item should be expanded, second collapsed
    expect(panels[0]).toBeVisible();
    expect(panels[1]).not.toBeVisible();
  });

  it("calls onExpandedChange when items are toggled", async () => {
    const user = userEvent.setup();
    const handleExpandedChange = vi.fn();

    render(
      <NimbusProvider>
        <Accordion.Root
          expandedKeys={[]}
          onExpandedChange={handleExpandedChange}
        >
          <Accordion.Item value="item-1">
            <Accordion.Header>Test Item</Accordion.Header>
            <Accordion.Content>
              <Text>Test Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    const header = screen.getByRole("button", { name: "Test Item" });

    await user.click(header);

    // React Aria returns a Set for expandedKeys
    expect(handleExpandedChange).toHaveBeenCalledWith(new Set(["item-1"]));
  });

  it("supports uncontrolled mode with defaultExpandedKeys", () => {
    render(
      <NimbusProvider>
        <Accordion.Root
          allowsMultipleExpanded
          defaultExpandedKeys={["item-1", "item-3"]}
        >
          <Accordion.Item value="item-1">
            <Accordion.Header>First Item</Accordion.Header>
            <Accordion.Content>
              <Text>First Content</Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Header>Second Item</Accordion.Header>
            <Accordion.Content>
              <Text>Second Content</Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-3">
            <Accordion.Header>Third Item</Accordion.Header>
            <Accordion.Content>
              <Text>Third Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    const panels = screen.getAllByRole("group", { hidden: true });

    // First and third items should be expanded by default
    expect(panels[0]).toBeVisible();
    expect(panels[1]).not.toBeVisible();
    expect(panels[2]).toBeVisible();
  });
});

/**
 * @docs-section disabled-state
 * @docs-title Disabled State
 * @docs-description Test accordion disabled state behavior
 * @docs-order 4
 */
describe("Accordion - Disabled State", () => {
  it("disables all items when root is disabled", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Accordion.Root isDisabled>
          <Accordion.Item value="item-1">
            <Accordion.Header>Disabled Item</Accordion.Header>
            <Accordion.Content>
              <Text>Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    const header = screen.getByRole("button", { name: "Disabled Item" });
    const content = screen.getByRole("group", { hidden: true });

    expect(header).toBeDisabled();

    // Clicking should not expand
    await user.click(header);
    expect(content).not.toBeVisible();
  });

  it("disables individual items", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <Accordion.Root>
          <Accordion.Item value="item-1">
            <Accordion.Header>Enabled Item</Accordion.Header>
            <Accordion.Content>
              <Text>Enabled Content</Text>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2" isDisabled>
            <Accordion.Header>Disabled Item</Accordion.Header>
            <Accordion.Content>
              <Text>Disabled Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    const enabledHeader = screen.getByRole("button", { name: "Enabled Item" });
    const disabledHeader = screen.getByRole("button", {
      name: "Disabled Item",
    });
    const panels = screen.getAllByRole("group", { hidden: true });

    // Enabled item should work
    await user.click(enabledHeader);
    expect(panels[0]).toBeVisible();

    // Disabled item should not work
    expect(disabledHeader).toBeDisabled();
    await user.click(disabledHeader);
    expect(panels[1]).not.toBeVisible();
  });
});

/**
 * @docs-section header-right-content
 * @docs-title Header Right Content
 * @docs-description Test accordion header with right-aligned content
 * @docs-order 5
 */
describe("Accordion - Header Right Content", () => {
  it("renders right-aligned content in header", () => {
    render(
      <NimbusProvider>
        <Accordion.Root>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              Item Title
              <Accordion.HeaderRightContent>
                <Text>Extra Info</Text>
              </Accordion.HeaderRightContent>
            </Accordion.Header>
            <Accordion.Content>
              <Text>Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Item Title")).toBeInTheDocument();
    expect(screen.getByText("Extra Info")).toBeInTheDocument();
  });

  it("allows interactions with header right content without toggling accordion", async () => {
    const user = userEvent.setup();
    const handleButtonClick = vi.fn((e: React.MouseEvent) => {
      e.stopPropagation();
    });

    render(
      <NimbusProvider>
        <Accordion.Root>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              Item Title
              <Accordion.HeaderRightContent>
                <button onClick={handleButtonClick}>Action</button>
              </Accordion.HeaderRightContent>
            </Accordion.Header>
            <Accordion.Content>
              <Text>Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    const actionButton = screen.getByRole("button", { name: "Action" });
    const content = screen.getByRole("group", { hidden: true });

    // Click action button
    await user.click(actionButton);

    // Action should be called
    expect(handleButtonClick).toHaveBeenCalled();

    // Accordion should remain collapsed
    expect(content).not.toBeVisible();
  });
});

/**
 * @docs-section size-variants
 * @docs-title Size Variants
 * @docs-description Test accordion size variant rendering
 * @docs-order 6
 */
describe("Accordion - Size Variants", () => {
  it("renders small size variant", () => {
    render(
      <NimbusProvider>
        <Accordion.Root size="sm">
          <Accordion.Item value="item-1">
            <Accordion.Header>Small Item</Accordion.Header>
            <Accordion.Content>
              <Text>Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    // Verify the component renders with the size variant
    expect(
      screen.getByRole("button", { name: "Small Item" })
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { hidden: true })).toBeInTheDocument();
  });

  it("renders medium size variant (default)", () => {
    render(
      <NimbusProvider>
        <Accordion.Root size="md">
          <Accordion.Item value="item-1">
            <Accordion.Header>Medium Item</Accordion.Header>
            <Accordion.Content>
              <Text>Content</Text>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </NimbusProvider>
    );

    // Verify the component renders with the size variant
    expect(
      screen.getByRole("button", { name: "Medium Item" })
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { hidden: true })).toBeInTheDocument();
  });
});
