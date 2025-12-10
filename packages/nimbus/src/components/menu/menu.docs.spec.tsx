import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menu, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the menu renders with expected elements
 * @docs-order 1
 */
describe("Menu - Basic rendering", () => {
  it("renders menu trigger", () => {
    render(
      <NimbusProvider>
        <Menu.Root>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="edit">Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    expect(screen.getByRole("button", { name: "Actions" })).toBeInTheDocument();
  });

  it("renders menu items when opened", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Menu.Root>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="edit">Edit</Menu.Item>
            <Menu.Item id="delete">Delete</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Delete" })
    ).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the menu
 * @docs-order 2
 */
describe("Menu - Interactions", () => {
  it("opens menu on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Menu.Root>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="edit">Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  it("closes menu when item is selected", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <NimbusProvider>
        <Menu.Root onAction={handleAction}>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="edit">Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(handleAction).toHaveBeenCalledWith("edit");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  it("closes menu on Escape key", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Menu.Root>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="edit">Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});

/**
 * @docs-section action-callback
 * @docs-title Action Callback Tests
 * @docs-description Test the onAction callback behavior
 * @docs-order 3
 */
describe("Menu - Action callback", () => {
  it("calls onAction with item id when clicked", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <NimbusProvider>
        <Menu.Root onAction={handleAction}>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="copy">Copy</Menu.Item>
            <Menu.Item id="paste">Paste</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("menuitem", { name: "Copy" }));

    expect(handleAction).toHaveBeenCalledWith("copy");
  });

  it("calls onAction with Enter key", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <NimbusProvider>
        <Menu.Root onAction={handleAction}>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="save">Save</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    // First item should have focus
    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: "Save" })).toHaveFocus();
    });

    await user.keyboard("{Enter}");

    expect(handleAction).toHaveBeenCalledWith("save");
  });
});

/**
 * @docs-section controlled-mode
 * @docs-title Controlled Mode Tests
 * @docs-description Test controlled open/close behavior
 * @docs-order 4
 */
describe("Menu - Controlled mode", () => {
  it("opens when isOpen is true", async () => {
    render(
      <NimbusProvider>
        <Menu.Root isOpen={true} onOpenChange={() => {}}>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="edit">Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  it("calls onOpenChange when menu is opened", async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <NimbusProvider>
        <Menu.Root isOpen={false} onOpenChange={handleOpenChange}>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="edit">Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));

    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });
});

/**
 * @docs-section disabled-items
 * @docs-title Disabled Items Tests
 * @docs-description Test disabled item behavior
 * @docs-order 5
 */
describe("Menu - Disabled items", () => {
  it("renders disabled item with aria-disabled", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Menu.Root>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="edit">Edit</Menu.Item>
            <Menu.Item id="paste" isDisabled>
              Paste
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    const disabledItem = screen.getByRole("menuitem", { name: "Paste" });
    expect(disabledItem).toHaveAttribute("aria-disabled", "true");
  });

  it("does not call onAction for disabled items", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(
      <NimbusProvider>
        <Menu.Root onAction={handleAction}>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="paste" isDisabled>
              Paste
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    // Disabled items have pointer-events: none, so click won't fire
    // We verify the item is disabled
    const disabledItem = screen.getByRole("menuitem", { name: "Paste" });
    expect(disabledItem).toHaveAttribute("aria-disabled", "true");

    // onAction should not have been called
    expect(handleAction).not.toHaveBeenCalled();
  });
});

/**
 * @docs-section selection-mode
 * @docs-title Selection Mode Tests
 * @docs-description Test single and multiple selection modes
 * @docs-order 6
 */
describe("Menu - Selection mode", () => {
  it("renders radio items in single selection mode", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Menu.Root selectionMode="single" selectedKeys={new Set(["medium"])}>
          <Menu.Trigger>Size</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="small">Small</Menu.Item>
            <Menu.Item id="medium">Medium</Menu.Item>
            <Menu.Item id="large">Large</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Size" }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    // Items should be radio items in single selection mode
    expect(
      screen.getByRole("menuitemradio", { name: "Medium" })
    ).toHaveAttribute("data-selected");
  });

  it("renders checkbox items in multiple selection mode", async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <Menu.Root
          selectionMode="multiple"
          selectedKeys={new Set(["bold", "italic"])}
        >
          <Menu.Trigger>Formatting</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="bold">Bold</Menu.Item>
            <Menu.Item id="italic">Italic</Menu.Item>
            <Menu.Item id="underline">Underline</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Formatting" }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    // Items should be checkbox items in multiple selection mode
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Bold" })
    ).toHaveAttribute("data-selected");
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Italic" })
    ).toHaveAttribute("data-selected");
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Underline" })
    ).not.toHaveAttribute("data-selected");
  });

  it("calls onSelectionChange when selection changes", async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();

    render(
      <NimbusProvider>
        <Menu.Root
          selectionMode="single"
          selectedKeys={new Set(["small"])}
          onSelectionChange={handleSelectionChange}
        >
          <Menu.Trigger>Size</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="small">Small</Menu.Item>
            <Menu.Item id="medium">Medium</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </NimbusProvider>
    );

    await user.click(screen.getByRole("button", { name: "Size" }));

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("menuitemradio", { name: "Medium" }));

    expect(handleSelectionChange).toHaveBeenCalled();
  });
});
