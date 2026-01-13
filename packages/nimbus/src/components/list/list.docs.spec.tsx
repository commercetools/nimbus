import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { List, NimbusProvider, Icon } from "@commercetools/nimbus";
import { Check, Close } from "@commercetools/nimbus-icons";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the List component renders with expected structure and children
 * @docs-order 1
 */
describe("List - Basic rendering", () => {
  it("renders List.Root with children", () => {
    render(
      <NimbusProvider>
        <List.Root asChild data-testid="test-list">
          <ul>
            <List.Item>Item 1</List.Item>
            <List.Item>Item 2</List.Item>
            <List.Item>Item 3</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("test-list");
    expect(list).toBeInTheDocument();
    expect(list).toHaveTextContent("Item 1");
    expect(list).toHaveTextContent("Item 2");
    expect(list).toHaveTextContent("Item 3");
  });

  it("renders as semantic ul element with asChild", () => {
    render(
      <NimbusProvider>
        <List.Root asChild>
          <ul data-testid="unordered-list">
            <List.Item>Item 1</List.Item>
            <List.Item>Item 2</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("unordered-list");
    expect(list.tagName).toBe("UL");
  });

  it("renders as semantic ol element with asChild", () => {
    render(
      <NimbusProvider>
        <List.Root asChild>
          <ol data-testid="ordered-list">
            <List.Item>Item 1</List.Item>
            <List.Item>Item 2</List.Item>
          </ol>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("ordered-list");
    expect(list.tagName).toBe("OL");
  });

  it("renders List.Item with content", () => {
    render(
      <NimbusProvider>
        <List.Root asChild>
          <ul>
            <List.Item data-testid="list-item">List item content</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const item = screen.getByTestId("list-item");
    expect(item).toBeInTheDocument();
    expect(item).toHaveTextContent("List item content");
  });
});

/**
 * @docs-section variants
 * @docs-title Variant Tests
 * @docs-description Test different visual variants of the List component
 * @docs-order 2
 */
describe("List - Variants", () => {
  it("renders with marker variant by default", () => {
    render(
      <NimbusProvider>
        <List.Root asChild data-testid="marker-list">
          <ul>
            <List.Item>Item 1</List.Item>
            <List.Item>Item 2</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("marker-list");
    expect(list).toBeInTheDocument();
    // Marker variant applies list-style styling
  });

  it("renders with plain variant", () => {
    render(
      <NimbusProvider>
        <List.Root variant="plain" data-testid="plain-list">
          <List.Item>Item 1</List.Item>
          <List.Item>Item 2</List.Item>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("plain-list");
    expect(list).toBeInTheDocument();
  });

  it("renders custom indicators with plain variant", () => {
    render(
      <NimbusProvider>
        <List.Root variant="plain" data-testid="indicator-list">
          <List.Item>
            <List.Indicator>
              <Icon>
                <Check />
              </Icon>
            </List.Indicator>
            Item with indicator
          </List.Item>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("indicator-list");
    expect(list).toBeInTheDocument();
    expect(list).toHaveTextContent("Item with indicator");
  });
});

/**
 * @docs-section alignment
 * @docs-title Alignment Tests
 * @docs-description Test alignment options for list items
 * @docs-order 3
 */
describe("List - Alignment", () => {
  it("applies start alignment by default", () => {
    render(
      <NimbusProvider>
        <List.Root asChild align="start" data-testid="start-list">
          <ul>
            <List.Item>Item 1</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("start-list");
    expect(list).toBeInTheDocument();
  });

  it("applies center alignment", () => {
    render(
      <NimbusProvider>
        <List.Root asChild align="center" data-testid="center-list">
          <ul>
            <List.Item>Item 1</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("center-list");
    expect(list).toBeInTheDocument();
  });

  it("applies end alignment", () => {
    render(
      <NimbusProvider>
        <List.Root asChild align="end" data-testid="end-list">
          <ul>
            <List.Item>Item 1</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("end-list");
    expect(list).toBeInTheDocument();
  });
});

/**
 * @docs-section nested-lists
 * @docs-title Nested Lists Tests
 * @docs-description Test nested list structures
 * @docs-order 4
 */
describe("List - Nested lists", () => {
  it("renders nested lists correctly", () => {
    render(
      <NimbusProvider>
        <List.Root asChild data-testid="parent-list">
          <ul>
            <List.Item>
              Parent item
              <List.Root asChild data-testid="nested-list">
                <ul>
                  <List.Item>Nested item 1</List.Item>
                  <List.Item>Nested item 2</List.Item>
                </ul>
              </List.Root>
            </List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const parentList = screen.getByTestId("parent-list");
    const nestedList = screen.getByTestId("nested-list");

    expect(parentList).toBeInTheDocument();
    expect(nestedList).toBeInTheDocument();
    expect(parentList).toHaveTextContent("Parent item");
    expect(nestedList).toHaveTextContent("Nested item 1");
    expect(nestedList).toHaveTextContent("Nested item 2");
  });
});

/**
 * @docs-section style-props
 * @docs-title Style Props Tests
 * @docs-description Test that List accepts and applies Chakra style props
 * @docs-order 5
 */
describe("List - Style props", () => {
  it("applies gap prop for spacing", () => {
    render(
      <NimbusProvider>
        <List.Root asChild gap="400" data-testid="spaced-list">
          <ul>
            <List.Item>Item 1</List.Item>
            <List.Item>Item 2</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("spaced-list");
    expect(list).toBeInTheDocument();
  });

  it("applies padding prop", () => {
    render(
      <NimbusProvider>
        <List.Root asChild p="400" data-testid="padded-list">
          <ul>
            <List.Item>Item 1</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("padded-list");
    expect(list).toBeInTheDocument();
  });

  it("applies background color prop", () => {
    render(
      <NimbusProvider>
        <List.Root
          bg="neutral.2"
          p="400"
          borderRadius="200"
          data-testid="styled-list"
        >
          <List.Item>Item 1</List.Item>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("styled-list");
    expect(list).toBeInTheDocument();
  });
});

/**
 * @docs-section props-forwarding
 * @docs-title Props Forwarding Tests
 * @docs-description Verify that List forwards standard HTML and ARIA attributes
 * @docs-order 6
 */
describe("List - Props forwarding", () => {
  it("forwards data attributes", () => {
    render(
      <NimbusProvider>
        <List.Root asChild data-testid="data-list" data-custom="custom-value">
          <ul>
            <List.Item>Content</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("data-list");
    expect(list).toHaveAttribute("data-custom", "custom-value");
  });

  it("forwards className prop", () => {
    render(
      <NimbusProvider>
        <List.Root asChild data-testid="class-list" className="custom-class">
          <ul>
            <List.Item>Content</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("class-list");
    expect(list).toHaveClass("custom-class");
  });

  it("forwards id prop", () => {
    render(
      <NimbusProvider>
        <List.Root asChild id="unique-list-id">
          <ul>
            <List.Item>Content</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = document.getElementById("unique-list-id");
    expect(list).toBeInTheDocument();
  });

  it("forwards ARIA attributes", () => {
    render(
      <NimbusProvider>
        <List.Root
          asChild
          data-testid="aria-list"
          aria-label="Navigation list"
          role="navigation"
        >
          <ul>
            <List.Item>Content</List.Item>
          </ul>
        </List.Root>
      </NimbusProvider>
    );

    const list = screen.getByTestId("aria-list");
    expect(list).toHaveAttribute("aria-label", "Navigation list");
    expect(list).toHaveAttribute("role", "navigation");
  });
});

/**
 * @docs-section indicator
 * @docs-title Indicator Tests
 * @docs-description Test List.Indicator component functionality
 * @docs-order 7
 */
describe("List - Indicator", () => {
  it("renders List.Indicator with content", () => {
    render(
      <NimbusProvider>
        <List.Root variant="plain">
          <List.Item data-testid="item-with-indicator">
            <List.Indicator data-testid="indicator">
              <Icon>
                <Check />
              </Icon>
            </List.Indicator>
            Item content
          </List.Item>
        </List.Root>
      </NimbusProvider>
    );

    const indicator = screen.getByTestId("indicator");
    const item = screen.getByTestId("item-with-indicator");

    expect(indicator).toBeInTheDocument();
    expect(item).toHaveTextContent("Item content");
  });

  it("renders multiple items with different indicators", () => {
    render(
      <NimbusProvider>
        <List.Root variant="plain">
          <List.Item>
            <List.Indicator>
              <Icon>
                <Check />
              </Icon>
            </List.Indicator>
            Item 1
          </List.Item>
          <List.Item>
            <List.Indicator>
              <Icon>
                <Close />
              </Icon>
            </List.Indicator>
            Item 2
          </List.Item>
        </List.Root>
      </NimbusProvider>
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});
