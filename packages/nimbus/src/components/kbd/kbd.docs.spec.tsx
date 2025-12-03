import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Kbd, Text, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected content
 * @docs-order 1
 */
describe("Kbd - Basic rendering", () => {
  it("renders keyboard key content", () => {
    render(
      <NimbusProvider>
        <Kbd>Enter</Kbd>
      </NimbusProvider>
    );

    expect(screen.getByText("Enter")).toBeInTheDocument();
  });

  it("renders with semantic kbd element", () => {
    const { container } = render(
      <NimbusProvider>
        <Kbd>Ctrl</Kbd>
      </NimbusProvider>
    );

    const kbdElement = container.querySelector("kbd");
    expect(kbdElement).toBeInTheDocument();
  });

  it("renders within instructional text", () => {
    render(
      <NimbusProvider>
        <Text>
          Press <Kbd>Esc</Kbd> to cancel
        </Text>
      </NimbusProvider>
    );

    expect(screen.getByText("Press")).toBeInTheDocument();
    expect(screen.getByText("Esc")).toBeInTheDocument();
    expect(screen.getByText("to cancel")).toBeInTheDocument();
  });
});

/**
 * @docs-section key-combinations
 * @docs-title Key Combination Tests
 * @docs-description Test multiple keys in combinations
 * @docs-order 2
 */
describe("Kbd - Key combinations", () => {
  it("renders key combination correctly", () => {
    render(
      <NimbusProvider>
        <Text>
          Press <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd> to copy
        </Text>
      </NimbusProvider>
    );

    expect(screen.getByText("Ctrl")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("to copy")).toBeInTheDocument();
  });

  it("renders multiple kbd elements independently", () => {
    const { container } = render(
      <NimbusProvider>
        <>
          <Kbd>Shift</Kbd>
          <Kbd>Tab</Kbd>
        </>
      </NimbusProvider>
    );

    const kbdElements = container.querySelectorAll("kbd");
    expect(kbdElements).toHaveLength(2);
    expect(kbdElements[0]).toHaveTextContent("Shift");
    expect(kbdElements[1]).toHaveTextContent("Tab");
  });
});

/**
 * @docs-section integration-with-instructions
 * @docs-title Integration with Instructions
 * @docs-description Test keyboard shortcuts within instructional text
 * @docs-order 3
 */
describe("Kbd - Instructions integration", () => {
  it("displays shortcut within help text", () => {
    render(
      <NimbusProvider>
        <Text>
          Press <Kbd>Esc</Kbd> to cancel
        </Text>
      </NimbusProvider>
    );

    expect(screen.getByText("Press")).toBeInTheDocument();
    expect(screen.getByText("Esc")).toBeInTheDocument();
    expect(screen.getByText("to cancel")).toBeInTheDocument();
  });

  it("renders accessible keyboard instruction", () => {
    const { container } = render(
      <NimbusProvider>
        <Text>
          Use <Kbd>Tab</Kbd> to navigate
        </Text>
      </NimbusProvider>
    );

    const kbdElement = container.querySelector("kbd");
    expect(kbdElement).toHaveTextContent("Tab");
    expect(kbdElement?.tagName).toBe("KBD");
  });
});
