import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconToggleButton, NimbusProvider } from "@commercetools/nimbus";
import { ThumbUp } from "@commercetools/nimbus-icons";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected accessibility attributes
 * @docs-order 1
 */
describe("IconToggleButton - Basic rendering", () => {
  it("renders with aria-label", () => {
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Like this post">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /like this post/i })
    ).toBeInTheDocument();
  });

  it("renders with pressed state attribute", () => {
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Like">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button", { name: /like/i });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("renders unselected by default", () => {
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Star">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
});

/**
 * @docs-section selection-states
 * @docs-title Selection State Tests
 * @docs-description Test different selection states (selected/unselected)
 * @docs-order 2
 */
describe("IconToggleButton - Selection states", () => {
  it("renders selected state", () => {
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Like" isSelected>
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("renders unselected state explicitly", () => {
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Like" isSelected={false}>
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("applies default selected state", () => {
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Star" defaultSelected>
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the component
 * @docs-order 3
 */
describe("IconToggleButton - Interactions", () => {
  it("toggles when clicked", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Like">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onChange callback when toggled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Star" onChange={handleChange}>
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("toggles with spacebar when focused", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Bookmark">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard(" ");

    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles with enter key when focused", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Like">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");

    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Testing Controlled Mode
 * @docs-description Test controlled component behavior
 * @docs-order 4
 */
describe("IconToggleButton - Controlled mode", () => {
  it("displays controlled value", () => {
    render(
      <NimbusProvider>
        <IconToggleButton
          aria-label="Like"
          isSelected={true}
          onChange={() => {}}
        >
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("updates when controlled value changes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <IconToggleButton
          aria-label="Star"
          isSelected={false}
          onChange={() => {}}
        >
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");

    rerender(
      <NimbusProvider>
        <IconToggleButton
          aria-label="Star"
          isSelected={true}
          onChange={() => {}}
        >
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onChange when user interacts with controlled button", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <IconToggleButton
          aria-label="Like"
          isSelected={false}
          onChange={handleChange}
        >
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleChange).toHaveBeenCalledWith(true);
  });
});

/**
 * @docs-section validation-states
 * @docs-title Testing Validation States
 * @docs-description Test different validation and state variations
 * @docs-order 5
 */
describe("IconToggleButton - Validation states", () => {
  it("renders disabled state", () => {
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Like" isDisabled>
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Star" isDisabled onChange={handleChange}>
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("renders selected and disabled state", () => {
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Like" isSelected isDisabled>
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toBeDisabled();
  });
});

/**
 * @docs-section visual-variants
 * @docs-title Testing Visual Variants
 * @docs-description Test that different visual variants render correctly
 * @docs-order 6
 */
describe("IconToggleButton - Visual variants", () => {
  it("renders outline variant", () => {
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Like" variant="outline">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders ghost variant", () => {
    render(
      <NimbusProvider>
        <IconToggleButton aria-label="Star" variant="ghost">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders different size variants", () => {
    const { rerender } = render(
      <NimbusProvider>
        <IconToggleButton aria-label="Like" size="2xs">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <IconToggleButton aria-label="Like" size="xs">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <IconToggleButton aria-label="Like" size="md">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with different color palettes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <IconToggleButton aria-label="Like" colorPalette="primary">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <IconToggleButton aria-label="Like" colorPalette="critical">
          <ThumbUp />
        </IconToggleButton>
      </NimbusProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
