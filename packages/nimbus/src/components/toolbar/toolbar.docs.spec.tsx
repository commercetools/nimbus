import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toolbar, Button, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe("Toolbar - Basic rendering", () => {
  it("renders toolbar with role attribute", () => {
    render(
      <NimbusProvider>
        <Toolbar aria-label="Main toolbar">
          <Button size="xs">File</Button>
        </Toolbar>
      </NimbusProvider>
    );

    // Verify toolbar is rendered with correct role
    expect(
      screen.getByRole("toolbar", { name: /main toolbar/i })
    ).toBeInTheDocument();
  });

  it("renders with horizontal orientation by default", () => {
    render(
      <NimbusProvider>
        <Toolbar aria-label="Test toolbar">
          <Button size="xs">File</Button>
        </Toolbar>
      </NimbusProvider>
    );

    const toolbar = screen.getByRole("toolbar");
    expect(toolbar).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("renders with vertical orientation when specified", () => {
    render(
      <NimbusProvider>
        <Toolbar orientation="vertical" aria-label="Test toolbar">
          <Button size="xs">File</Button>
        </Toolbar>
      </NimbusProvider>
    );

    const toolbar = screen.getByRole("toolbar");
    expect(toolbar).toHaveAttribute("aria-orientation", "vertical");
  });
});

/**
 * @docs-section keyboard-navigation
 * @docs-title Keyboard Navigation Tests
 * @docs-description Test keyboard navigation with the toolbar
 * @docs-order 2
 */
describe("Toolbar - Keyboard navigation", () => {
  it("navigates between controls with arrow keys in horizontal toolbar", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Toolbar aria-label="Test toolbar">
          <Button size="xs" data-testid="btn-1">
            File
          </Button>
          <Button size="xs" data-testid="btn-2">
            Edit
          </Button>
          <Button size="xs" data-testid="btn-3">
            View
          </Button>
        </Toolbar>
      </NimbusProvider>
    );

    const btn1 = screen.getByTestId("btn-1");
    const btn2 = screen.getByTestId("btn-2");
    const btn3 = screen.getByTestId("btn-3");

    // Focus first button
    await user.click(btn1);
    expect(btn1).toHaveFocus();

    // Navigate with Arrow Right
    await user.keyboard("{ArrowRight}");
    expect(btn2).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(btn3).toHaveFocus();

    // Navigate backwards with Arrow Left
    await user.keyboard("{ArrowLeft}");
    expect(btn2).toHaveFocus();
  });

  it("navigates between controls with arrow keys in vertical toolbar", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Toolbar orientation="vertical" aria-label="Test toolbar">
          <Button size="xs" data-testid="btn-1">
            Home
          </Button>
          <Button size="xs" data-testid="btn-2">
            Search
          </Button>
          <Button size="xs" data-testid="btn-3">
            Settings
          </Button>
        </Toolbar>
      </NimbusProvider>
    );

    const btn1 = screen.getByTestId("btn-1");
    const btn2 = screen.getByTestId("btn-2");
    const btn3 = screen.getByTestId("btn-3");

    // Focus first button
    await user.click(btn1);
    expect(btn1).toHaveFocus();

    // Navigate with Arrow Down
    await user.keyboard("{ArrowDown}");
    expect(btn2).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(btn3).toHaveFocus();

    // Navigate backwards with Arrow Up
    await user.keyboard("{ArrowUp}");
    expect(btn2).toHaveFocus();
  });
});

/**
 * @docs-section toolbar-children
 * @docs-title Testing Toolbar Children
 * @docs-description Test that toolbar properly contains and manages child elements
 * @docs-order 3
 */
describe("Toolbar - Children", () => {
  it("renders multiple child buttons", () => {
    render(
      <NimbusProvider>
        <Toolbar aria-label="Test toolbar">
          <Button size="xs">File</Button>
          <Button size="xs">Edit</Button>
          <Button size="xs">View</Button>
        </Toolbar>
      </NimbusProvider>
    );

    expect(screen.getByRole("button", { name: /file/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view/i })).toBeInTheDocument();
  });

  it("maintains button functionality within toolbar", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <NimbusProvider>
        <Toolbar aria-label="Test toolbar">
          <Button size="xs" onClick={handleClick} data-testid="clickable-btn">
            Click me
          </Button>
        </Toolbar>
      </NimbusProvider>
    );

    const button = screen.getByTestId("clickable-btn");
    await user.click(button);

    // Verify the click handler was called (may be called multiple times due to event bubbling)
    expect(handleClick).toHaveBeenCalled();
  });
});
