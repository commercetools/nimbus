import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleButtonGroup, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the toggle button group renders with expected structure and accessibility attributes
 * @docs-order 1
 */
describe("ToggleButtonGroup - Basic rendering", () => {
  it("renders toggle button group with buttons", () => {
    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root aria-label="Text alignment">
          <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="center">
            Center
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="right">Right</ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const group = screen.getByRole("radiogroup", { name: /text alignment/i });
    expect(group).toBeInTheDocument();

    const buttons = within(group).getAllByRole("radio");
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveTextContent("Left");
    expect(buttons[1]).toHaveTextContent("Center");
    expect(buttons[2]).toHaveTextContent("Right");
  });

  it("renders with correct accessibility attributes", () => {
    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root aria-label="Formatting options">
          <ToggleButtonGroup.Button id="bold">Bold</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="italic">
            Italic
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const group = screen.getByRole("radiogroup", {
      name: /formatting options/i,
    });
    expect(group).toHaveAttribute("aria-label", "Formatting options");
  });
});

/**
 * @docs-section single-selection
 * @docs-title Single Selection Tests
 * @docs-description Test single-selection mode behavior (default mode)
 * @docs-order 2
 */
describe("ToggleButtonGroup - Single selection mode", () => {
  it("allows selecting one button at a time", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root
          onSelectionChange={handleChange}
          aria-label="Text alignment"
        >
          <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="center">
            Center
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="right">Right</ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const buttons = screen.getAllByRole("radio");
    const [leftButton, centerButton] = buttons;

    // Initially no buttons selected
    expect(leftButton).toHaveAttribute("aria-checked", "false");
    expect(centerButton).toHaveAttribute("aria-checked", "false");

    // Click first button
    await user.click(leftButton);
    expect(handleChange).toHaveBeenCalledWith(new Set(["left"]));

    // Click second button - should deselect first
    await user.click(centerButton);
    expect(handleChange).toHaveBeenCalledWith(new Set(["center"]));
  });

  it("supports toggling selection by clicking same button", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root
          onSelectionChange={handleChange}
          aria-label="Options"
        >
          <ToggleButtonGroup.Button id="option1">
            Option 1
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const button = screen.getByRole("radio");

    // Select
    await user.click(button);
    expect(handleChange).toHaveBeenCalledWith(new Set(["option1"]));

    // Deselect
    await user.click(button);
    expect(handleChange).toHaveBeenCalledWith(new Set());
  });
});

/**
 * @docs-section multiple-selection
 * @docs-title Multiple Selection Tests
 * @docs-description Test multi-selection mode behavior with selectionMode="multiple"
 * @docs-order 3
 */
describe("ToggleButtonGroup - Multiple selection mode", () => {
  it("allows selecting multiple buttons independently", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root
          selectionMode="multiple"
          onSelectionChange={handleChange}
          aria-label="Text formatting"
        >
          <ToggleButtonGroup.Button id="bold">Bold</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="italic">
            Italic
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="underline">
            Underline
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const toolbar = screen.getByRole("toolbar", { name: /text formatting/i });
    const buttons = within(toolbar).getAllByRole("button");
    const [boldButton, italicButton] = buttons;

    // Select first button
    await user.click(boldButton);
    expect(handleChange).toHaveBeenCalledWith(new Set(["bold"]));

    handleChange.mockClear();

    // Select second button - first should remain selected
    await user.click(italicButton);
    expect(handleChange).toHaveBeenCalledWith(new Set(["bold", "italic"]));
  });
});

/**
 * @docs-section keyboard-navigation
 * @docs-title Keyboard Navigation Tests
 * @docs-description Test keyboard interactions and focus management
 * @docs-order 4
 */
describe("ToggleButtonGroup - Keyboard navigation", () => {
  it("supports arrow key navigation between buttons", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root aria-label="Navigation">
          <ToggleButtonGroup.Button id="first">First</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="second">
            Second
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="third">Third</ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const buttons = screen.getAllByRole("radio");
    const [firstButton, secondButton, thirdButton] = buttons;

    // Tab to focus first button
    await user.tab();
    expect(firstButton).toHaveFocus();

    // Arrow right to second button
    await user.keyboard("{ArrowRight}");
    expect(secondButton).toHaveFocus();

    // Arrow right to third button
    await user.keyboard("{ArrowRight}");
    expect(thirdButton).toHaveFocus();

    // Arrow left back to second button
    await user.keyboard("{ArrowLeft}");
    expect(secondButton).toHaveFocus();
  });

  it("supports Space key for toggling selection", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root
          onSelectionChange={handleChange}
          aria-label="Options"
        >
          <ToggleButtonGroup.Button id="option1">
            Option 1
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="option2">
            Option 2
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    // Tab to focus first button
    await user.tab();

    // Press Space to select
    await user.keyboard(" ");
    expect(handleChange).toHaveBeenCalledWith(new Set(["option1"]));

    handleChange.mockClear();

    // Navigate to second button
    await user.keyboard("{ArrowRight}");

    // Press Space to select second
    await user.keyboard(" ");
    expect(handleChange).toHaveBeenCalledWith(new Set(["option2"]));
  });
});

/**
 * @docs-section disabled-state
 * @docs-title Disabled State Tests
 * @docs-description Test behavior when group or individual buttons are disabled
 * @docs-order 5
 */
describe("ToggleButtonGroup - Disabled state", () => {
  it("disables entire group when isDisabled is true", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root
          isDisabled
          onSelectionChange={handleChange}
          aria-label="Disabled group"
        >
          <ToggleButtonGroup.Button id="option1">
            Option 1
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="option2">
            Option 2
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const buttons = screen.getAllByRole("radio");

    // All buttons should be disabled
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });

    // Clicking disabled button should not trigger change
    await user.click(buttons[0]);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("disables individual buttons", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root
          onSelectionChange={handleChange}
          aria-label="Partial disabled"
        >
          <ToggleButtonGroup.Button id="enabled">
            Enabled
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="disabled" isDisabled>
            Disabled
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const buttons = screen.getAllByRole("radio");
    const [enabledButton, disabledButton] = buttons;

    expect(enabledButton).not.toBeDisabled();
    expect(disabledButton).toBeDisabled();

    // Click enabled button works
    await user.click(enabledButton);
    expect(handleChange).toHaveBeenCalledWith(new Set(["enabled"]));

    handleChange.mockClear();

    // Click disabled button does not work
    await user.click(disabledButton);
    expect(handleChange).not.toHaveBeenCalled();
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled selection state with selectedKeys prop
 * @docs-order 6
 */
describe("ToggleButtonGroup - Controlled mode", () => {
  it("respects controlled selectedKeys prop", () => {
    const { rerender } = render(
      <NimbusProvider>
        <ToggleButtonGroup.Root
          selectedKeys={new Set(["center"])}
          aria-label="Controlled"
        >
          <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="center">
            Center
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="right">Right</ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const buttons = screen.getAllByRole("radio");
    const [leftButton, centerButton, rightButton] = buttons;

    // Center button should be selected
    expect(leftButton).toHaveAttribute("aria-checked", "false");
    expect(centerButton).toHaveAttribute("aria-checked", "true");
    expect(rightButton).toHaveAttribute("aria-checked", "false");

    // Update selection externally
    rerender(
      <NimbusProvider>
        <ToggleButtonGroup.Root
          selectedKeys={new Set(["right"])}
          aria-label="Controlled"
        >
          <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="center">
            Center
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="right">Right</ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    // Right button should now be selected
    expect(leftButton).toHaveAttribute("aria-checked", "false");
    expect(centerButton).toHaveAttribute("aria-checked", "false");
    expect(rightButton).toHaveAttribute("aria-checked", "true");
  });

  it("calls onSelectionChange with updated selection", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root
          selectedKeys={new Set(["left"])}
          onSelectionChange={handleChange}
          aria-label="Controlled with callback"
        >
          <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="center">
            Center
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const buttons = screen.getAllByRole("radio");
    const centerButton = buttons[1];

    await user.click(centerButton);
    expect(handleChange).toHaveBeenCalledWith(new Set(["center"]));
  });
});

/**
 * @docs-section uncontrolled-mode
 * @docs-title Uncontrolled Mode Tests
 * @docs-description Test uncontrolled selection with defaultSelectedKeys prop
 * @docs-order 7
 */
describe("ToggleButtonGroup - Uncontrolled mode", () => {
  it("respects defaultSelectedKeys for initial selection", () => {
    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root
          defaultSelectedKeys={["center"]}
          aria-label="Uncontrolled"
        >
          <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="center">
            Center
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="right">Right</ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const buttons = screen.getAllByRole("radio");
    const [leftButton, centerButton, rightButton] = buttons;

    expect(leftButton).toHaveAttribute("aria-checked", "false");
    expect(centerButton).toHaveAttribute("aria-checked", "true");
    expect(rightButton).toHaveAttribute("aria-checked", "false");
  });

  it("manages selection state internally", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NimbusProvider>
        <ToggleButtonGroup.Root
          defaultSelectedKeys={["left"]}
          onSelectionChange={handleChange}
          aria-label="Uncontrolled internal"
        >
          <ToggleButtonGroup.Button id="left">Left</ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button id="center">
            Center
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup.Root>
      </NimbusProvider>
    );

    const buttons = screen.getAllByRole("radio");
    const centerButton = buttons[1];

    // Click center button
    await user.click(centerButton);

    // Callback should be called with new selection
    expect(handleChange).toHaveBeenCalledWith(new Set(["center"]));

    // Component should update its own internal state
    expect(centerButton).toHaveAttribute("aria-checked", "true");
  });
});
