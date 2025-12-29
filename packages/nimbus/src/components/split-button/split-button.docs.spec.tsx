import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SplitButton, Menu, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the SplitButton renders with expected structure and elements
 * @docs-order 1
 */
describe("SplitButton - Basic rendering", () => {
  it("renders primary button and dropdown trigger", () => {
    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="More actions">
          <Menu.Item id="save">Save</Menu.Item>
          <Menu.Item id="export">Export</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    // Primary button should show first action
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    // Dropdown trigger should have aria-label
    const dropdownTrigger = screen.getByRole("button", {
      name: /More actions/i,
    });
    expect(dropdownTrigger).toBeInTheDocument();
  });

  it("displays first enabled menu item as primary action", () => {
    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save">Save Document</Menu.Item>
          <Menu.Item id="export">Export</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    // Primary button should show "Save Document"
    expect(screen.getByText("Save Document")).toBeInTheDocument();
  });

  it("renders with icon in primary button", () => {
    const TestIcon = () => <svg data-testid="test-icon" />;

    render(
      <NimbusProvider>
        <SplitButton
          onAction={vi.fn()}
          aria-label="Actions"
          icon={<TestIcon />}
        >
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { rerender } = render(
      <NimbusProvider>
        <SplitButton size="2xs" onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /Actions/i })
    ).toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <SplitButton size="md" onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    expect(
      screen.getByRole("button", { name: /Actions/i })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with primary button and dropdown menu
 * @docs-order 2
 */
describe("SplitButton - Interactions", () => {
  it("executes primary action when primary button is clicked", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <NimbusProvider>
        <SplitButton onAction={handleAction} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
          <Menu.Item id="export">Export</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    const primaryButton = screen.getByText("Save");
    await user.click(primaryButton);

    expect(handleAction).toHaveBeenCalledWith("save");
  });

  it("opens dropdown menu when trigger is clicked", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="More actions">
          <Menu.Item id="save">Save</Menu.Item>
          <Menu.Item id="export">Export</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    const dropdownTrigger = screen.getByRole("button", {
      name: /More actions/i,
    });
    await user.click(dropdownTrigger);

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  it("executes selected menu item action", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <NimbusProvider>
        <SplitButton onAction={handleAction} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
          <Menu.Item id="export">Export</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    // Open menu
    const dropdownTrigger = screen.getByRole("button", { name: /Actions/i });
    await user.click(dropdownTrigger);

    // Click menu item
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    const exportItem = screen.getByRole("menuitem", { name: /Export/i });
    await user.click(exportItem);

    expect(handleAction).toHaveBeenCalledWith("export");
  });

  it("closes menu after selecting an item", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
          <Menu.Item id="export">Export</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    // Open menu
    const dropdownTrigger = screen.getByRole("button", { name: /Actions/i });
    await user.click(dropdownTrigger);

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    // Select item
    const saveItem = screen.getByRole("menuitem", { name: /Save/i });
    await user.click(saveItem);

    // Menu should close
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section primary-selection
 * @docs-title Primary Action Selection Tests
 * @docs-description Test automatic primary action selection logic
 * @docs-order 3
 */
describe("SplitButton - Primary action selection", () => {
  it("selects first enabled item when first item is disabled", () => {
    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save" isDisabled>
            Save
          </Menu.Item>
          <Menu.Item id="export">Export</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    // Primary button should show "Export" (first enabled item)
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("shows first item even if all items are disabled", () => {
    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save" isDisabled>
            Save
          </Menu.Item>
          <Menu.Item id="export" isDisabled>
            Export
          </Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    // Primary button should show first item
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("handles Menu.Items nested in Menu.Section", () => {
    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Section label="File">
            <Menu.Item id="save">Save</Menu.Item>
            <Menu.Item id="export">Export</Menu.Item>
          </Menu.Section>
        </SplitButton>
      </NimbusProvider>
    );

    // Should still find and display first item from section
    expect(screen.getByText("Save")).toBeInTheDocument();
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled menu state behavior
 * @docs-order 4
 */
describe("SplitButton - Controlled mode", () => {
  it("respects controlled isOpen prop", async () => {
    const { rerender } = render(
      <NimbusProvider>
        <SplitButton
          isOpen={false}
          onOpenChange={vi.fn()}
          onAction={vi.fn()}
          aria-label="Actions"
        >
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <SplitButton
          isOpen={true}
          onOpenChange={vi.fn()}
          onAction={vi.fn()}
          aria-label="Actions"
        >
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  it("calls onOpenChange when menu state changes", async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <NimbusProvider>
        <SplitButton
          onOpenChange={handleOpenChange}
          onAction={vi.fn()}
          aria-label="Actions"
        >
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    const dropdownTrigger = screen.getByRole("button", { name: /Actions/i });
    await user.click(dropdownTrigger);

    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });
});

/**
 * @docs-section uncontrolled-mode
 * @docs-title Uncontrolled Mode Tests
 * @docs-description Test uncontrolled menu state with defaultOpen
 * @docs-order 5
 */
describe("SplitButton - Uncontrolled mode", () => {
  it("opens menu by default when defaultOpen is true", async () => {
    render(
      <NimbusProvider>
        <SplitButton defaultOpen={true} onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  it("manages internal state when uncontrolled", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    const dropdownTrigger = screen.getByRole("button", { name: /Actions/i });
    await user.click(dropdownTrigger);

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    // Click outside or press escape to close
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section states
 * @docs-title State Tests
 * @docs-description Test different component states (disabled, menu item states)
 * @docs-order 6
 */
describe("SplitButton - States", () => {
  it("disables both buttons when isDisabled is true", () => {
    render(
      <NimbusProvider>
        <SplitButton isDisabled onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("disables primary button when primary action is disabled", () => {
    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save" isDisabled>
            Save
          </Menu.Item>
          <Menu.Item id="export" isDisabled>
            Export
          </Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    const primaryButton = screen.getByText("Save");
    expect(primaryButton).toBeDisabled();
  });

  it("disables dropdown trigger when no actionable items exist", () => {
    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save" isDisabled>
            Save
          </Menu.Item>
          <Menu.Item id="export" isDisabled>
            Export
          </Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    const dropdownTrigger = screen.getByRole("button", { name: /Actions/i });
    expect(dropdownTrigger).toBeDisabled();
  });

  it("renders critical menu items", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
          <Menu.Item id="delete" isCritical>
            Delete
          </Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    const dropdownTrigger = screen.getByRole("button", { name: /Actions/i });
    await user.click(dropdownTrigger);

    await waitFor(() => {
      expect(
        screen.getByRole("menuitem", { name: /Delete/i })
      ).toBeInTheDocument();
    });
  });
});

/**
 * @docs-section accessibility
 * @docs-title Accessibility Tests
 * @docs-description Verify ARIA attributes and keyboard navigation
 * @docs-order 7
 */
describe("SplitButton - Accessibility", () => {
  it("has proper ARIA attributes on dropdown trigger", () => {
    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="More actions">
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    const dropdownTrigger = screen.getByRole("button", {
      name: /More actions/i,
    });
    expect(dropdownTrigger).toHaveAttribute("aria-label", "More actions");
    expect(dropdownTrigger).toHaveAttribute("aria-expanded", "false");
  });

  it("updates aria-expanded when menu opens", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    const dropdownTrigger = screen.getByRole("button", { name: /Actions/i });
    expect(dropdownTrigger).toHaveAttribute("aria-expanded", "false");

    await user.click(dropdownTrigger);

    await waitFor(() => {
      expect(dropdownTrigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  it("supports keyboard navigation in menu", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
          <Menu.Item id="export">Export</Menu.Item>
          <Menu.Item id="print">Print</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    const dropdownTrigger = screen.getByRole("button", { name: /Actions/i });
    await user.click(dropdownTrigger);

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    const menuItems = screen.getAllByRole("menuitem");

    // First item should have focus initially
    await waitFor(() => {
      expect(menuItems[0]).toHaveFocus();
    });

    // Navigate down
    await user.keyboard("{ArrowDown}");
    expect(menuItems[1]).toHaveFocus();

    // Navigate down again
    await user.keyboard("{ArrowDown}");
    expect(menuItems[2]).toHaveFocus();
  });

  it("closes menu with Escape key", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    const dropdownTrigger = screen.getByRole("button", { name: /Actions/i });
    await user.click(dropdownTrigger);

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("primary button is keyboard accessible", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <NimbusProvider>
        <SplitButton onAction={handleAction} aria-label="Actions">
          <Menu.Item id="save">Save</Menu.Item>
        </SplitButton>
      </NimbusProvider>
    );

    // Tab to primary button
    await user.tab();

    const primaryButton = screen.getByText("Save");
    expect(primaryButton).toHaveFocus();

    // Activate with Enter
    await user.keyboard("{Enter}");

    expect(handleAction).toHaveBeenCalledWith("save");
  });
});

/**
 * @docs-section menu-content
 * @docs-title Menu Content Tests
 * @docs-description Test rendering of menu sections and separators
 * @docs-order 8
 */
describe("SplitButton - Menu content", () => {
  it("renders menu with sections", async () => {
    const user = userEvent.setup();

    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <Menu.Section label="File">
            <Menu.Item id="save">Save</Menu.Item>
            <Menu.Item id="export">Export</Menu.Item>
          </Menu.Section>
          <Menu.Section label="Edit">
            <Menu.Item id="copy">Copy</Menu.Item>
          </Menu.Section>
        </SplitButton>
      </NimbusProvider>
    );

    const dropdownTrigger = screen.getByRole("button", { name: /Actions/i });
    await user.click(dropdownTrigger);

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    // Check for section labels
    expect(screen.getByText("File")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();

    // Check for menu items
    expect(screen.getByRole("menuitem", { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Copy/i })).toBeInTheDocument();
  });

  it("handles empty menu gracefully", () => {
    render(
      <NimbusProvider>
        <SplitButton onAction={vi.fn()} aria-label="Actions">
          <></>
        </SplitButton>
      </NimbusProvider>
    );

    // Should render with fallback text
    expect(screen.getByText(/No actions available/i)).toBeInTheDocument();
  });
});
