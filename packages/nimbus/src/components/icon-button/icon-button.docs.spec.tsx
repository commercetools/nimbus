import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton, NimbusProvider } from "@commercetools/nimbus";
import { Add as AddIcon } from "@commercetools/nimbus-icons";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the IconButton renders correctly with required props
 * @docs-order 1
 */
describe("IconButton - Basic rendering", () => {
  it("renders button with icon", () => {
    render(
      <NimbusProvider>
        <IconButton aria-label="Add item">
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /add item/i });
    expect(button).toBeInTheDocument();
  });

  it("renders with required aria-label", () => {
    render(
      <NimbusProvider>
        <IconButton aria-label="Open menu">
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /open menu/i });
    expect(button).toHaveAttribute("aria-label", "Open menu");
  });

  it("renders with custom data attributes", () => {
    render(
      <NimbusProvider>
        <IconButton aria-label="Test button" data-testid="custom-button">
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    expect(screen.getByTestId("custom-button")).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the IconButton
 * @docs-order 2
 */
describe("IconButton - Interactions", () => {
  it("calls onPress when clicked", async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();

    render(
      <NimbusProvider>
        <IconButton aria-label="Add item" onPress={handlePress}>
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /add item/i });
    await user.click(button);

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();

    render(
      <NimbusProvider>
        <IconButton aria-label="Add item" onPress={handlePress} isDisabled>
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /add item/i });
    await user.click(button);

    expect(handlePress).not.toHaveBeenCalled();
  });
});

/**
 * @docs-section keyboard
 * @docs-title Keyboard Navigation Tests
 * @docs-description Test keyboard interactions with the IconButton
 * @docs-order 3
 */
describe("IconButton - Keyboard navigation", () => {
  it("is focusable with Tab key", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <IconButton aria-label="Add item">
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /add item/i });

    await user.tab();

    expect(button).toHaveFocus();
  });

  it("can be activated with Enter key", async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();

    render(
      <NimbusProvider>
        <IconButton aria-label="Add item" onPress={handlePress}>
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /add item/i });
    button.focus();

    await user.keyboard("{Enter}");

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it("can be activated with Space key", async () => {
    const user = userEvent.setup();
    const handlePress = vi.fn();

    render(
      <NimbusProvider>
        <IconButton aria-label="Add item" onPress={handlePress}>
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /add item/i });
    button.focus();

    await user.keyboard(" ");

    expect(handlePress).toHaveBeenCalledTimes(1);
  });
});

/**
 * @docs-section states
 * @docs-title State Tests
 * @docs-description Test different states of the IconButton
 * @docs-order 4
 */
describe("IconButton - States", () => {
  it("applies disabled state", () => {
    render(
      <NimbusProvider>
        <IconButton aria-label="Add item" isDisabled>
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /add item/i });
    expect(button).toBeDisabled();
  });

  it("displays loading state", () => {
    render(
      <NimbusProvider>
        <IconButton aria-label="Save" isLoading>
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /save/i });
    expect(button).toBeInTheDocument();
    // Note: Loading indicator is internal to the Button component
  });
});

/**
 * @docs-section variants
 * @docs-title Visual Variant Tests
 * @docs-description Test different visual variants and sizes
 * @docs-order 5
 */
describe("IconButton - Visual variants", () => {
  it("renders with different size variants", () => {
    const { rerender } = render(
      <NimbusProvider>
        <IconButton aria-label="Small button" size="xs">
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <IconButton aria-label="Medium button" size="md">
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with different visual variants", () => {
    const { rerender } = render(
      <NimbusProvider>
        <IconButton aria-label="Solid button" variant="solid">
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <IconButton aria-label="Outline button" variant="outline">
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with color palettes", () => {
    render(
      <NimbusProvider>
        <IconButton aria-label="Primary action" colorPalette="primary">
          <AddIcon />
        </IconButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
