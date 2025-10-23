import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, fn, waitFor } from "storybook/test";
import { Menu, Separator, SplitButton, Stack } from "@commercetools/nimbus";
import { Save, Edit, Share } from "@commercetools/nimbus-icons";

const meta: Meta<typeof SplitButton> = {
  title: "Components/Buttons/SplitButton",
  component: SplitButton,
  parameters: {},
  tags: ["autodocs"],
  args: {
    onOpenChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <SplitButton
      defaultOpen={true}
      onAction={(id) => console.log(`Action: ${id}`)}
      aria-label="More actions"
      icon={<Save />}
    >
      <Menu.Item id="save">Save</Menu.Item>
      <Menu.Item id="save-publish">Save and publish</Menu.Item>
      <Menu.Item id="save-next">Save and open next</Menu.Item>
    </SplitButton>
  ),
  play: async ({ canvasElement, step }) => {
    // Get the canvas element directly first
    const localCanvas = within(canvasElement);

    // Also get parent node for menu portal
    const portalCanvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    // Wait for dropdown menu to be open (defaultOpen)
    await waitFor(() => {
      expect(portalCanvas.getByRole("menu")).toBeInTheDocument();
    });

    await step("Primary button should show first action", async () => {
      // Wait for the primary button to be rendered with the correct text
      // Use getAllByRole with hidden option to find buttons even in aria-hidden containers
      await waitFor(() => {
        const buttons = localCanvas.getAllByRole("button", { hidden: true });
        const primaryButton = buttons.find(
          (btn) =>
            btn.getAttribute("aria-label") === "Save" ||
            btn.textContent?.includes("Save")
        );
        expect(primaryButton).toBeDefined();
      });

      const buttons = localCanvas.getAllByRole("button", { hidden: true });
      const primaryButton = buttons.find(
        (btn) =>
          btn.getAttribute("aria-label") === "Save" ||
          btn.textContent?.includes("Save")
      );
      expect(primaryButton).toBeInTheDocument();
      expect(primaryButton).toBeVisible();
    });

    await step("Dropdown trigger should be accessible", async () => {
      const dropdownTrigger = localCanvas.getByRole("button", {
        name: /More actions/i,
        hidden: true,
      });
      expect(dropdownTrigger).toBeInTheDocument();
      expect(dropdownTrigger).toHaveAttribute("aria-expanded", "true");
    });

    await step("All actions should appear in dropdown", async () => {
      // Use getAllByRole and check the count instead to avoid duplicate issues
      const menuItems = portalCanvas.getAllByRole("menuitem");
      expect(menuItems).toHaveLength(3);

      // Check that all expected items exist
      const itemTexts = menuItems.map((item) => item.textContent);
      expect(itemTexts).toContain("Save");
      expect(itemTexts).toContain("Save and publish");
      expect(itemTexts).toContain("Save and open next");
    });

    await step("Navigate with keyboard arrows", async () => {
      // First item should have focus initially
      const menuItems = portalCanvas.getAllByRole("menuitem");
      await waitFor(() => {
        expect(menuItems[0]).toHaveFocus();
      });

      // Navigate down
      await userEvent.keyboard("{ArrowDown}");
      await waitFor(() => {
        expect(menuItems[1]).toHaveFocus();
      });
    });

    await step(
      "Select menu item executes action but does not change primary button",
      async () => {
        const menuItems = portalCanvas.getAllByRole("menuitem");
        const publishItem = menuItems.find(
          (item) => item.textContent === "Save and publish"
        );
        expect(publishItem).toBeDefined();
        await userEvent.click(publishItem!);

        // Menu should close after selection
        await waitFor(
          () => {
            expect(portalCanvas.queryByRole("menu")).not.toBeInTheDocument();
          },
          { timeout: 1000 }
        );

        // Primary button should still show the first action (Save)
        await waitFor(() => {
          const buttons = localCanvas.getAllByRole("button", { hidden: true });
          const primaryButton = buttons.find((btn) => {
            // Check if button contains "Save" text (might have icon too)
            const hasText =
              btn.textContent?.includes("Save") &&
              !btn.textContent?.includes("publish");
            const hasAriaLabel = btn.getAttribute("aria-label") === "Save";
            return hasText || hasAriaLabel;
          });
          expect(primaryButton).toBeDefined();
          expect(primaryButton).toBeInTheDocument();
        });
      }
    );
  },
};

export const DocumentManagement: Story = {
  render: () => (
    <SplitButton
      onAction={(id) => alert(`${id} clicked!`)}
      aria-label="Document actions"
      icon={<Share />}
    >
      <Menu.Item id="share">Share Document</Menu.Item>
      <Menu.Item id="copy-link">Copy Link</Menu.Item>
      <Menu.Item id="email">Send via Email</Menu.Item>
      <Menu.Item id="download">Download PDF</Menu.Item>
      <Menu.Item id="print">Print Document</Menu.Item>
    </SplitButton>
  ),
};

export const SimpleText: Story = {
  render: () => (
    <SplitButton
      onAction={(id) => alert(`${id} clicked!`)}
      aria-label="Save options"
    >
      <Menu.Item id="save">Save Document</Menu.Item>
      <Menu.Item id="save-copy">Save as Copy</Menu.Item>
      <Menu.Item id="save-template">Save as Template</Menu.Item>
    </SplitButton>
  ),
};

export const WithComplexContent: Story = {
  render: () => (
    <SplitButton
      onAction={(id) => alert(`${id} clicked!`)}
      aria-label="Task actions"
      icon={<Edit />}
    >
      <Menu.Item id="complete">Complete Task</Menu.Item>
      <Menu.Item id="edit">Edit Task</Menu.Item>
      <Menu.Item id="duplicate">Duplicate Task</Menu.Item>
      <Menu.Item id="archive">Archive Task</Menu.Item>
      <Menu.Item id="delete" isCritical={true}>
        Delete Task
      </Menu.Item>
    </SplitButton>
  ),
};

export const SizeVariants: Story = {
  render: () => (
    <Stack direction="row" gap="400" alignItems="center">
      <SplitButton
        size="2xs"
        onAction={fn()}
        aria-label="Size variant actions"
        icon={<Save />}
      >
        <Menu.Item id="action1">Action 1</Menu.Item>
        <Menu.Item id="action2">Action 2</Menu.Item>
      </SplitButton>

      <SplitButton
        size="xs"
        onAction={fn()}
        aria-label="Size variant actions"
        icon={<Save />}
      >
        <Menu.Item id="action1">Action 1</Menu.Item>
        <Menu.Item id="action2">Action 2</Menu.Item>
      </SplitButton>

      <SplitButton
        size="md"
        onAction={fn()}
        aria-label="Size variant actions"
        icon={<Save />}
      >
        <Menu.Item id="action1">Action 1</Menu.Item>
        <Menu.Item id="action2">Action 2</Menu.Item>
      </SplitButton>
    </Stack>
  ),
};

export const SplitButtonVariants: Story = {
  render: () => (
    <Stack gap="600">
      {/* Split Button Mode - Size Variants */}
      <Stack>
        <h3>Split Button Sizes (data-mode='split')</h3>
        <Stack direction="row" gap="400" alignItems="center">
          <SplitButton
            size="2xs"
            variant="solid"
            tone="primary"
            onAction={(id) => alert(`${id} clicked!`)}
            aria-label="Split button save actions"
            icon={<Save />}
          >
            <Menu.Item id="save">Save</Menu.Item>
            <Menu.Item id="save-publish">Save & Publish</Menu.Item>
          </SplitButton>

          <SplitButton
            size="xs"
            variant="solid"
            tone="primary"
            onAction={(id) => alert(`${id} clicked!`)}
            aria-label="Split button save actions"
            icon={<Save />}
          >
            <Menu.Item id="save">Save</Menu.Item>
            <Menu.Item id="save-publish">Save & Publish</Menu.Item>
          </SplitButton>

          <SplitButton
            size="md"
            variant="solid"
            tone="primary"
            onAction={(id) => alert(`${id} clicked!`)}
            aria-label="Split button save actions"
            icon={<Save />}
          >
            <Menu.Item id="save">Save</Menu.Item>
            <Menu.Item id="save-publish">Save & Publish</Menu.Item>
          </SplitButton>
        </Stack>
      </Stack>

      {/* Split Button Mode - Style Variants */}
      <Stack>
        <h3>Split Button Style Variants</h3>
        <Stack direction="row" gap="400" wrap="wrap">
          <SplitButton
            variant="solid"
            tone="primary"
            onAction={(id) => alert(`${id} clicked!`)}
            aria-label="Split button solid actions"
            icon={<Save />}
          >
            <Menu.Item id="save">Save</Menu.Item>
            <Menu.Item id="export">Export</Menu.Item>
          </SplitButton>

          <SplitButton
            variant="subtle"
            tone="neutral"
            onAction={(id) => alert(`${id} clicked!`)}
            aria-label="Split button subtle actions"
            icon={<Save />}
          >
            <Menu.Item id="save">Save</Menu.Item>
            <Menu.Item id="export">Export</Menu.Item>
          </SplitButton>

          <SplitButton
            variant="outline"
            tone="primary"
            onAction={(id) => alert(`${id} clicked!`)}
            aria-label="Split button outline actions"
            icon={<Save />}
          >
            <Menu.Item id="save">Save</Menu.Item>
            <Menu.Item id="export">Export</Menu.Item>
          </SplitButton>

          <SplitButton
            variant="outline"
            tone="critical"
            onAction={(id) => alert(`${id} clicked!`)}
            aria-label="Split button outline critical actions"
            icon={<Save />}
          >
            <Menu.Item id="save">Save</Menu.Item>
            <Menu.Item id="export">Export</Menu.Item>
          </SplitButton>

          <SplitButton
            variant="ghost"
            tone="primary"
            onAction={(id) => alert(`${id} clicked!`)}
            aria-label="Split button ghost actions"
            icon={<Save />}
          >
            <Menu.Item id="save">Save</Menu.Item>
            <Menu.Item id="export">Export</Menu.Item>
          </SplitButton>
        </Stack>
      </Stack>
    </Stack>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <Stack direction="row" gap="400">
      <SplitButton
        isDisabled
        onAction={fn()}
        aria-label="Disabled actions"
        icon={<Save />}
      >
        <Menu.Item id="action1">Disabled Action</Menu.Item>
        <Menu.Item id="action2">Another Action</Menu.Item>
      </SplitButton>

      <SplitButton
        onAction={fn()}
        aria-label="Mixed state actions"
        icon={<Save />}
      >
        <Menu.Item id="available">Available Action</Menu.Item>
        <Menu.Item id="disabled" isDisabled>
          Disabled Item
        </Menu.Item>
        <Menu.Item id="another">Another Action</Menu.Item>
      </SplitButton>
    </Stack>
  ),
};

export const AutomaticSelectionDemo: Story = {
  render: () => (
    <div>
      <p style={{ marginBottom: "16px" }}>
        The component automatically selects the first enabled option as the
        primary action.
      </p>
      <SplitButton
        onAction={(id) => alert(`${id} clicked!`)}
        aria-label="Automatic selection demo"
        icon={<Save />}
      >
        <Menu.Item id="save">Save</Menu.Item>
        <Menu.Item id="save-publish">Save and publish</Menu.Item>
        <Menu.Item id="save-next">Save and open next</Menu.Item>
      </SplitButton>
      <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
        The primary button shows "Save" because it's the first enabled
        Menu.Item. All actions are available in the dropdown.
      </p>
    </div>
  ),
};

export const WithSections: Story = {
  render: () => (
    <div>
      <h3>Sectioned Menu</h3>
      <p>Using sections and separators to organize actions</p>
      <SplitButton
        onAction={(id) => alert(`${id} clicked!`)}
        aria-label="Sectioned document actions"
        icon={<Save />}
      >
        <Menu.Section label="File Actions">
          <Menu.Item id="save">Save Document</Menu.Item>
          <Menu.Item id="save-as">Save As Copy</Menu.Item>
          <Menu.Item id="export">Export PDF</Menu.Item>
        </Menu.Section>

        <Separator />

        <Menu.Section label="Share">
          <Menu.Item id="share-link">Share Link</Menu.Item>
          <Menu.Item id="send-email">Send via Email</Menu.Item>
        </Menu.Section>

        <Separator />

        <Menu.Section label="Manage">
          <Menu.Item id="archive">Archive</Menu.Item>
          <Menu.Item id="delete" isCritical>
            Delete Document
          </Menu.Item>
        </Menu.Section>
      </SplitButton>
    </div>
  ),
};

export const AccessibilityTest: Story = {
  render: () => (
    <SplitButton
      aria-label="More sending options"
      onAction={fn()}
      icon={<Save />}
    >
      <Menu.Item id="send">Send Message</Menu.Item>
      <Menu.Item id="schedule">Schedule Send</Menu.Item>
      <Menu.Item id="draft">Save as Draft</Menu.Item>
      <Menu.Item id="template">Save as Template</Menu.Item>
    </SplitButton>
  ),
  play: async ({ canvasElement, step }) => {
    const localCanvas = within(canvasElement);
    const portalCanvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Check ARIA attributes", async () => {
      // Wait for items to register and primary button to update
      await waitFor(
        () => {
          const primaryButton = localCanvas.getByRole("button", {
            name: "Send Message",
            hidden: true,
          });
          expect(primaryButton).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const primaryButton = localCanvas.getByRole("button", {
        name: "Send Message",
        hidden: true,
      });
      expect(primaryButton).toBeInTheDocument();

      const dropdownTrigger = localCanvas.getByRole("button", {
        name: /More sending options/i,
        hidden: true,
      });
      expect(dropdownTrigger).toHaveAttribute(
        "aria-label",
        "More sending options"
      );
      expect(dropdownTrigger).toHaveAttribute("aria-expanded", "false");
    });

    await step("Open dropdown with keyboard", async () => {
      const dropdownTrigger = localCanvas.getByRole("button", {
        name: /More sending options/i,
        hidden: true,
      });

      // Focus the trigger
      await userEvent.tab();
      await userEvent.tab();
      expect(dropdownTrigger).toHaveFocus();

      // Open with Enter
      await userEvent.keyboard("{Enter}");

      await waitFor(() => {
        expect(dropdownTrigger).toHaveAttribute("aria-expanded", "true");
        expect(portalCanvas.getByRole("menu")).toBeInTheDocument();
      });
    });

    await step("Check menu accessibility", async () => {
      const menu = portalCanvas.getByRole("menu");
      expect(menu).toBeInTheDocument();

      const menuItems = portalCanvas.getAllByRole("menuitem");
      expect(menuItems).toHaveLength(4);

      // First item should have focus
      expect(menuItems[0]).toHaveFocus();
    });

    await step(
      "Select item executes action but primary button stays the same",
      async () => {
        const scheduleItem = portalCanvas.getByRole("menuitem", {
          name: /Schedule Send/i,
        });
        await userEvent.click(scheduleItem);

        await waitFor(() => {
          expect(portalCanvas.queryByRole("menu")).not.toBeInTheDocument();
        });

        // Primary button should still show first action (Send Message)
        await waitFor(() => {
          const primaryButton = localCanvas.getByRole("button", {
            name: "Send Message",
            hidden: true,
          });
          expect(primaryButton).toBeInTheDocument();
        });
      }
    );
  },
};

export const EdgeCasesAndFallbacks: Story = {
  render: () => (
    <Stack direction="column" gap="600">
      {/* Edge Case: First option disabled */}
      <Stack direction="column" gap="200">
        <h3>Edge Case: First Option Disabled</h3>
        <p>
          When the first Menu.Item is disabled, the component automatically
          selects the next enabled option
        </p>
        <SplitButton
          aria-label="Disabled first option test"
          onAction={(id) => alert(`Action: ${id}`)}
          icon={<Save />}
        >
          <Menu.Item id="save" isDisabled>
            Save Document
          </Menu.Item>
          <Menu.Item id="export">Export PDF</Menu.Item>
        </SplitButton>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Expected: Primary button shows "Export PDF" (first enabled option) and
          is enabled
        </p>
      </Stack>

      {/* Edge Case: No Menu.Items at all */}
      <Stack direction="column" gap="200">
        <h3>Edge Case: No Menu Items</h3>
        <p>Component with no Menu.Item children</p>
        <SplitButton
          aria-label="No menu items test"
          onAction={(id) => alert(`Action: ${id}`)}
          icon={<Save />}
        >
          {/* No Menu.Item components */}
          <></>
        </SplitButton>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Expected: Button shows "No actions available" and is disabled
        </p>
      </Stack>

      {/* Edge Case: Only disabled Menu.Items */}
      <Stack direction="column" gap="200">
        <h3>Edge Case: All Menu Items Disabled</h3>
        <p>
          When all Menu.Items are disabled, the component uses the first one but
          disables everything
        </p>
        <SplitButton
          aria-label="All disabled items test"
          onAction={(id) => alert(`Action: ${id}`)}
          icon={<Save />}
        >
          <Menu.Item id="save" isDisabled>
            Save Document
          </Menu.Item>
          <Menu.Item id="export" isDisabled>
            Export PDF
          </Menu.Item>
        </SplitButton>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Expected: Button shows "Save Document" (first option) but is disabled
        </p>
      </Stack>

      {/* Edge Case: Empty Menu.Section */}
      <Stack direction="column" gap="200">
        <h3>Edge Case: Empty Menu Section</h3>
        <p>Menu.Section with no Menu.Item children</p>
        <SplitButton
          aria-label="Empty section test"
          onAction={(id) => alert(`Action: ${id}`)}
          icon={<Save />}
        >
          <Menu.Section label="Empty Section">
            {/* No Menu.Item components */}
          </Menu.Section>
        </SplitButton>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Expected: Button shows "No actions available" and is disabled
        </p>
      </Stack>

      {/* Edge Case: Menu.Item without ID */}
      <Stack direction="column" gap="200">
        <h3>Edge Case: Menu Items Without IDs</h3>
        <p>Some Menu.Items missing id props</p>
        <SplitButton
          aria-label="Missing ID test"
          onAction={(id) => alert(`Action: ${id}`)}
          icon={<Save />}
        >
          <Menu.Item>No ID Item</Menu.Item>
          <Menu.Item id="valid">Valid Item</Menu.Item>
          <Menu.Item>Another No ID</Menu.Item>
        </SplitButton>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Expected: Button shows "Valid Item" (automatically selects first valid
          Menu.Item)
        </p>
      </Stack>
    </Stack>
  ),
  play: async ({ canvasElement, step }) => {
    const localCanvas = within(canvasElement);

    await step(
      "Test disabled first option - should select next enabled",
      async () => {
        // Find the first test case by its header
        const testHeader = localCanvas.getByText(
          "Edge Case: First Option Disabled"
        );
        const testContainer = testHeader.closest("div")!;
        const testCanvas = within(testContainer);

        const buttons = testCanvas.getAllByRole("button", { hidden: true });
        const primaryButton = buttons.find((btn) =>
          btn.textContent?.includes("Export PDF")
        );
        const dropdownTrigger = buttons.find((btn) =>
          btn.getAttribute("aria-label")?.includes("Disabled first option test")
        );

        expect(primaryButton).toBeInTheDocument();
        expect(primaryButton).not.toBeDisabled();
        expect(dropdownTrigger).toBeInTheDocument();
        expect(dropdownTrigger).not.toBeDisabled();
      }
    );

    await step("Test no menu items - should show fallback", async () => {
      const testHeader = localCanvas.getByText("Edge Case: No Menu Items");
      const testContainer = testHeader.closest("div")!;
      const testCanvas = within(testContainer);

      const buttons = testCanvas.getAllByRole("button", { hidden: true });
      const primaryButton = buttons.find((btn) =>
        btn.textContent?.includes("No actions available")
      );
      const dropdownTrigger = buttons.find((btn) =>
        btn.getAttribute("aria-label")?.includes("No menu items test")
      );

      expect(primaryButton).toBeInTheDocument();
      expect(primaryButton).toBeDisabled();
      expect(dropdownTrigger).toBeInTheDocument();
      expect(dropdownTrigger).toBeDisabled();
    });

    await step(
      "Test all disabled items - should show first but be disabled",
      async () => {
        const testHeader = localCanvas.getByText(
          "Edge Case: All Menu Items Disabled"
        );
        const testContainer = testHeader.closest("div")!;
        const testCanvas = within(testContainer);

        const buttons = testCanvas.getAllByRole("button", { hidden: true });
        const primaryButton = buttons.find((btn) =>
          btn.textContent?.includes("Save Document")
        );
        const dropdownTrigger = buttons.find((btn) =>
          btn.getAttribute("aria-label")?.includes("All disabled items test")
        );

        expect(primaryButton).toBeInTheDocument();
        expect(primaryButton).toBeDisabled();
        expect(dropdownTrigger).toBeInTheDocument();
        expect(dropdownTrigger).toBeDisabled();
      }
    );

    await step(
      "Test Menu.Items without IDs - should skip and find valid",
      async () => {
        const testHeader = localCanvas.getByText(
          "Edge Case: Menu Items Without IDs"
        );
        const testContainer = testHeader.closest("div")!;
        const testCanvas = within(testContainer);

        const buttons = testCanvas.getAllByRole("button", { hidden: true });
        const primaryButton = buttons.find((btn) =>
          btn.textContent?.includes("Valid Item")
        );

        expect(primaryButton).toBeInTheDocument();
        expect(primaryButton).not.toBeDisabled();
      }
    );
  },
};
