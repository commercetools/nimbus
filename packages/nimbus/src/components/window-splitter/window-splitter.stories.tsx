import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@chakra-ui/react";
import { userEvent, within, expect, fn } from "@storybook/test";
import { WindowSplitter } from "./window-splitter";

const meta: Meta<typeof WindowSplitter.Root> = {
  title: "Components/WindowSplitter",
  component: WindowSplitter.Root,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    orientation: {
      control: { type: "radio" },
      options: ["horizontal", "vertical"],
    },
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    defaultValue: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    minValue: {
      control: { type: "range", min: 0, max: 50, step: 1 },
    },
    maxValue: {
      control: { type: "range", min: 50, max: 100, step: 1 },
    },
    step: {
      control: { type: "range", min: 1, max: 20, step: 1 },
    },
    isDisabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof WindowSplitter.Root>;

// Sample content components
const PrimaryPaneContent = () => (
  <Box p={4} bg="blue.50" h="100%" overflow="auto">
    <h2>Primary Pane</h2>
    <p>This is the primary pane content. It can contain any React content.</p>
    <p>The size of this pane is controlled by the splitter value.</p>
    <p>
      Try dragging the separator or using keyboard navigation (Tab to focus,
      then arrow keys).
    </p>
    <div style={{ height: "200vh" }}>
      <p>This content is scrollable...</p>
      <p>Keep scrolling...</p>
      <p>More content here...</p>
      <p>And even more...</p>
      <p>Bottom of content</p>
    </div>
  </Box>
);

const SecondaryPaneContent = () => (
  <Box p={4} bg="green.50" h="100%" overflow="auto">
    <h2>Secondary Pane</h2>
    <p>This is the secondary pane content.</p>
    <p>Its size is automatically calculated as 100% - primary pane size.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
      <li>Item 5</li>
    </ul>
  </Box>
);

export const Default: Story = {
  args: {
    orientation: "horizontal",
    defaultValue: 50,
  },
  render: (args) => (
    <Box height="500px" width="100%" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary>
          <PrimaryPaneContent />
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Resize panes"
          data-testid="splitter"
        />
        <WindowSplitter.Pane>
          <SecondaryPaneContent />
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    defaultValue: 40,
  },
  render: (args) => (
    <Box height="500px" width="100%" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary>
          <PrimaryPaneContent />
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Resize panes vertically"
          data-testid="splitter"
        />
        <WindowSplitter.Pane>
          <SecondaryPaneContent />
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
};

export const Controlled: Story = {
  args: {
    orientation: "horizontal",
    value: 30,
    onValueChange: fn(),
  },
  render: (args) => (
    <Box height="500px" width="100%" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary>
          <PrimaryPaneContent />
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Controlled splitter"
          data-testid="splitter"
        />
        <WindowSplitter.Pane>
          <SecondaryPaneContent />
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
};

export const WithConstraints: Story = {
  args: {
    orientation: "horizontal",
    defaultValue: 50,
    minValue: 20,
    maxValue: 80,
  },
  render: (args) => (
    <Box height="500px" width="100%" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary>
          <PrimaryPaneContent />
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Constrained splitter (20% - 80%)"
          data-testid="splitter"
        />
        <WindowSplitter.Pane>
          <SecondaryPaneContent />
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
};

export const Disabled: Story = {
  args: {
    orientation: "horizontal",
    defaultValue: 50,
    isDisabled: true,
  },
  render: (args) => (
    <Box height="500px" width="100%" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary>
          <PrimaryPaneContent />
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Disabled splitter"
          data-testid="splitter"
        />
        <WindowSplitter.Pane>
          <SecondaryPaneContent />
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
};

// ============================================================
// INTERACTION TESTS
// ============================================================

export const KeyboardInteractionHorizontal: Story = {
  args: {
    orientation: "horizontal",
    defaultValue: 50,
    step: 10,
    minValue: 10,
    maxValue: 90,
  },
  render: (args) => (
    <Box height="400px" width="600px" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary data-testid="primary-pane">
          <Box p={4} bg="blue.50" h="100%">
            <h3>Primary Pane</h3>
            <p>Use keyboard to resize this pane</p>
          </Box>
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Table of Contents"
          data-testid="splitter"
        />
        <WindowSplitter.Pane data-testid="secondary-pane">
          <Box p={4} bg="green.50" h="100%">
            <h3>Secondary Pane</h3>
            <p>This pane adjusts automatically</p>
          </Box>
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const splitter = canvas.getByTestId("splitter");

    await step("Splitter has correct ARIA attributes", async () => {
      await expect(splitter).toHaveAttribute("role", "separator");
      await expect(splitter).toHaveAttribute("aria-orientation", "horizontal");
      await expect(splitter).toHaveAttribute("aria-valuenow", "50");
      await expect(splitter).toHaveAttribute("aria-valuemin", "10");
      await expect(splitter).toHaveAttribute("aria-valuemax", "90");
      await expect(splitter).toHaveAttribute("aria-label", "Table of Contents");
    });

    await step("Splitter is focusable", async () => {
      await userEvent.tab();
      await expect(splitter).toHaveFocus();
    });

    await step("Right arrow increases value", async () => {
      await userEvent.keyboard("{ArrowRight}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "60");
    });

    await step("Left arrow decreases value", async () => {
      await userEvent.keyboard("{ArrowLeft}");
      await userEvent.keyboard("{ArrowLeft}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "40");
    });

    await step("Home key sets to minimum value", async () => {
      await userEvent.keyboard("{Home}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "10");
    });

    await step("End key sets to maximum value", async () => {
      await userEvent.keyboard("{End}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "90");
    });

    await step("Enter key toggles collapse/restore", async () => {
      // First Enter should collapse to minimum
      await userEvent.keyboard("{Enter}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "10");

      // Second Enter should restore to default position
      await userEvent.keyboard("{Enter}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "50");
    });

    await step("Up/Down arrows don't affect horizontal splitter", async () => {
      const initialValue = splitter.getAttribute("aria-valuenow");
      await userEvent.keyboard("{ArrowUp}");
      await expect(splitter).toHaveAttribute("aria-valuenow", initialValue);
      await userEvent.keyboard("{ArrowDown}");
      await expect(splitter).toHaveAttribute("aria-valuenow", initialValue);
    });
  },
};

export const KeyboardInteractionVertical: Story = {
  args: {
    orientation: "vertical",
    defaultValue: 40,
    step: 15,
    minValue: 0,
    maxValue: 100,
  },
  render: (args) => (
    <Box height="500px" width="400px" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary data-testid="primary-pane">
          <Box p={4} bg="blue.50" h="100%">
            <h3>Primary Pane</h3>
            <p>Vertical layout</p>
          </Box>
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Navigation Panel"
          data-testid="splitter"
        />
        <WindowSplitter.Pane data-testid="secondary-pane">
          <Box p={4} bg="green.50" h="100%">
            <h3>Secondary Pane</h3>
            <p>Bottom section</p>
          </Box>
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const splitter = canvas.getByTestId("splitter");

    await step("Splitter has correct vertical ARIA attributes", async () => {
      await expect(splitter).toHaveAttribute("role", "separator");
      await expect(splitter).toHaveAttribute("aria-orientation", "vertical");
      await expect(splitter).toHaveAttribute("aria-valuenow", "40");
      await expect(splitter).toHaveAttribute("aria-valuemin", "0");
      await expect(splitter).toHaveAttribute("aria-valuemax", "100");
      await expect(splitter).toHaveAttribute("aria-label", "Navigation Panel");
    });

    await step("Focus splitter", async () => {
      await userEvent.tab();
      await expect(splitter).toHaveFocus();
    });

    await step("Down arrow increases value", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "55");
    });

    await step("Up arrow decreases value", async () => {
      await userEvent.keyboard("{ArrowUp}");
      await userEvent.keyboard("{ArrowUp}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "25");
    });

    await step("Left/Right arrows don't affect vertical splitter", async () => {
      const initialValue = splitter.getAttribute("aria-valuenow");
      await userEvent.keyboard("{ArrowLeft}");
      await expect(splitter).toHaveAttribute("aria-valuenow", initialValue);
      await userEvent.keyboard("{ArrowRight}");
      await expect(splitter).toHaveAttribute("aria-valuenow", initialValue);
    });

    await step("Home/End keys work for vertical splitter", async () => {
      await userEvent.keyboard("{Home}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "0");

      await userEvent.keyboard("{End}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "100");
    });
  },
};

export const DisabledKeyboardInteraction: Story = {
  args: {
    orientation: "horizontal",
    defaultValue: 50,
    isDisabled: true,
  },
  render: (args) => (
    <Box height="400px" width="600px" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary>
          <Box p={4} bg="blue.50" h="100%">
            <h3>Primary Pane</h3>
            <p>Disabled splitter</p>
          </Box>
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Disabled splitter"
          data-testid="splitter"
        />
        <WindowSplitter.Pane>
          <Box p={4} bg="green.50" h="100%">
            <h3>Secondary Pane</h3>
            <p>Cannot be resized</p>
          </Box>
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const splitter = canvas.getByTestId("splitter");

    await step("Disabled splitter is not focusable", async () => {
      await expect(splitter).toHaveAttribute("tabindex", "-1");
      await userEvent.tab();
      await expect(splitter).not.toHaveFocus();
    });

    await step("Keyboard interactions don't work when disabled", async () => {
      // Try to focus manually (this shouldn't work in real usage but we test the behavior)
      splitter.focus();
      const initialValue = splitter.getAttribute("aria-valuenow");

      await userEvent.keyboard("{ArrowRight}");
      await expect(splitter).toHaveAttribute("aria-valuenow", initialValue);

      await userEvent.keyboard("{Home}");
      await expect(splitter).toHaveAttribute("aria-valuenow", initialValue);

      await userEvent.keyboard("{Enter}");
      await expect(splitter).toHaveAttribute("aria-valuenow", initialValue);
    });
  },
};

export const ConstrainedKeyboardInteraction: Story = {
  args: {
    orientation: "horizontal",
    defaultValue: 50,
    minValue: 30,
    maxValue: 70,
    step: 5,
  },
  render: (args) => (
    <Box height="400px" width="600px" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary>
          <Box p={4} bg="blue.50" h="100%">
            <h3>Primary Pane</h3>
            <p>Constrained between 30% and 70%</p>
          </Box>
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Constrained splitter"
          data-testid="splitter"
        />
        <WindowSplitter.Pane>
          <Box p={4} bg="green.50" h="100%">
            <h3>Secondary Pane</h3>
            <p>Automatically sized</p>
          </Box>
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const splitter = canvas.getByTestId("splitter");

    await step("Splitter respects min/max constraints in ARIA", async () => {
      await expect(splitter).toHaveAttribute("aria-valuemin", "30");
      await expect(splitter).toHaveAttribute("aria-valuemax", "70");
    });

    await step("Focus splitter", async () => {
      await userEvent.tab();
      await expect(splitter).toHaveFocus();
    });

    await step("Home key respects minimum constraint", async () => {
      await userEvent.keyboard("{Home}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "30");
    });

    await step("End key respects maximum constraint", async () => {
      await userEvent.keyboard("{End}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "70");
    });

    await step("Arrow keys respect constraints", async () => {
      // Go to max, then try to go beyond
      await userEvent.keyboard("{End}");
      await userEvent.keyboard("{ArrowRight}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "70");

      // Go to min, then try to go beyond
      await userEvent.keyboard("{Home}");
      await userEvent.keyboard("{ArrowLeft}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "30");
    });
  },
};

export const ControlledValueInteraction: Story = {
  args: {
    orientation: "horizontal",
    value: 60,
    onValueChange: fn(),
  },
  render: (args) => (
    <Box height="400px" width="600px" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary>
          <Box p={4} bg="blue.50" h="100%">
            <h3>Primary Pane</h3>
            <p>Controlled value</p>
          </Box>
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Controlled splitter"
          data-testid="splitter"
        />
        <WindowSplitter.Pane>
          <Box p={4} bg="green.50" h="100%">
            <h3>Secondary Pane</h3>
            <p>Value changes trigger callback</p>
          </Box>
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);
    const splitter = canvas.getByTestId("splitter");

    await step("Controlled value is reflected in ARIA", async () => {
      await expect(splitter).toHaveAttribute("aria-valuenow", "60");
    });

    await step("Focus splitter", async () => {
      await userEvent.tab();
      await expect(splitter).toHaveFocus();
    });

    await step("Keyboard interactions trigger onValueChange", async () => {
      await userEvent.keyboard("{ArrowRight}");
      await expect(args.onValueChange).toHaveBeenCalledWith(65);

      await userEvent.keyboard("{ArrowLeft}");
      await expect(args.onValueChange).toHaveBeenCalledWith(55);

      await userEvent.keyboard("{Home}");
      await expect(args.onValueChange).toHaveBeenCalledWith(0);

      await userEvent.keyboard("{End}");
      await expect(args.onValueChange).toHaveBeenCalledWith(100);
    });
  },
};

export const AriaControlsAttribute: Story = {
  args: {
    orientation: "horizontal",
    defaultValue: 50,
  },
  render: (args) => (
    <Box height="400px" width="600px" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary id="primary-pane-test">
          <Box p={4} bg="blue.50" h="100%">
            <h3>Primary Pane</h3>
            <p>This pane should be referenced by aria-controls</p>
          </Box>
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Content splitter"
          data-testid="splitter"
        />
        <WindowSplitter.Pane>
          <Box p={4} bg="green.50" h="100%">
            <h3>Secondary Pane</h3>
            <p>Not controlled directly</p>
          </Box>
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const splitter = canvas.getByTestId("splitter");

    await step(
      "Splitter has aria-controls pointing to primary pane",
      async () => {
        // The component should automatically generate and set aria-controls
        const ariaControls = splitter.getAttribute("aria-controls");
        await expect(ariaControls).toBeTruthy();

        // Verify the referenced element exists
        if (ariaControls) {
          const controlledElement = document.getElementById(ariaControls);
          await expect(controlledElement).toBeInTheDocument();
        }
      }
    );
  },
};

export const ComprehensiveW3CCompliance: Story = {
  args: {
    orientation: "horizontal",
    defaultValue: 50,
    minValue: 10,
    maxValue: 90,
    step: 5,
  },
  render: (args) => (
    <Box height="400px" width="600px" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary data-testid="primary-pane">
          <Box p={4} bg="blue.50" h="100%" tabIndex={0}>
            <h3>Table of Contents</h3>
            <p>This is the primary pane that gets resized.</p>
            <button>Focusable element in primary pane</button>
          </Box>
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Table of Contents"
          data-testid="splitter"
        />
        <WindowSplitter.Pane data-testid="secondary-pane">
          <Box p={4} bg="green.50" h="100%" tabIndex={0}>
            <h3>Content</h3>
            <p>This is the secondary pane.</p>
            <button>Focusable element in secondary pane</button>
          </Box>
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const splitter = canvas.getByTestId("splitter");

    await step("All required WAI-ARIA attributes are present", async () => {
      // Role
      await expect(splitter).toHaveAttribute("role", "separator");

      // Value attributes
      await expect(splitter).toHaveAttribute("aria-valuenow", "50");
      await expect(splitter).toHaveAttribute("aria-valuemin", "10");
      await expect(splitter).toHaveAttribute("aria-valuemax", "90");

      // Orientation
      await expect(splitter).toHaveAttribute("aria-orientation", "horizontal");

      // Label (matches primary pane name as per W3C spec)
      await expect(splitter).toHaveAttribute("aria-label", "Table of Contents");

      // Controls relationship
      const ariaControls = splitter.getAttribute("aria-controls");
      await expect(ariaControls).toBeTruthy();
      if (ariaControls) {
        const controlledElement = document.getElementById(ariaControls);
        await expect(controlledElement).toBeInTheDocument();
      }
    });

    await step("Splitter is focusable and keyboard accessible", async () => {
      await expect(splitter).toHaveAttribute("tabindex", "0");
      await userEvent.tab();
      await expect(splitter).toHaveFocus();
    });

    await step("All keyboard interactions work as per W3C spec", async () => {
      // Test arrow keys for horizontal splitter
      await userEvent.keyboard("{ArrowRight}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "55");

      await userEvent.keyboard("{ArrowLeft}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "50");

      // Test Home/End keys
      await userEvent.keyboard("{Home}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "10");

      await userEvent.keyboard("{End}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "90");

      // Test Enter key for collapse/restore
      await userEvent.keyboard("{Enter}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "10");

      await userEvent.keyboard("{Enter}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "50");

      // Test that inappropriate arrow keys don't affect horizontal splitter
      const currentValue = splitter.getAttribute("aria-valuenow");
      await userEvent.keyboard("{ArrowUp}");
      await expect(splitter).toHaveAttribute("aria-valuenow", currentValue);
      await userEvent.keyboard("{ArrowDown}");
      await expect(splitter).toHaveAttribute("aria-valuenow", currentValue);
    });

    await step("Value constraints are respected", async () => {
      // Try to go beyond maximum
      await userEvent.keyboard("{End}");
      await userEvent.keyboard("{ArrowRight}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "90");

      // Try to go beyond minimum
      await userEvent.keyboard("{Home}");
      await userEvent.keyboard("{ArrowLeft}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "10");
    });

    await step("Focus management works correctly", async () => {
      // Splitter should maintain focus during value changes
      await expect(splitter).toHaveFocus();
      await userEvent.keyboard("{ArrowRight}");
      await expect(splitter).toHaveFocus();

      // Tab should move focus away from splitter
      await userEvent.tab();
      await expect(splitter).not.toHaveFocus();
    });
  },
};

export const VerticalW3CCompliance: Story = {
  args: {
    orientation: "vertical",
    defaultValue: 40,
    minValue: 0,
    maxValue: 100,
    step: 10,
  },
  render: (args) => (
    <Box height="500px" width="400px" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary data-testid="primary-pane">
          <Box p={4} bg="blue.50" h="100%">
            <h3>Navigation Panel</h3>
            <p>Primary pane in vertical layout</p>
          </Box>
        </WindowSplitter.Pane>
        <WindowSplitter.Separator
          aria-label="Navigation Panel"
          data-testid="splitter"
        />
        <WindowSplitter.Pane data-testid="secondary-pane">
          <Box p={4} bg="green.50" h="100%">
            <h3>Content Area</h3>
            <p>Secondary pane in vertical layout</p>
          </Box>
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const splitter = canvas.getByTestId("splitter");

    await step("Vertical splitter has correct ARIA orientation", async () => {
      await expect(splitter).toHaveAttribute("aria-orientation", "vertical");
    });

    await step("Focus splitter", async () => {
      await userEvent.tab();
      await expect(splitter).toHaveFocus();
    });

    await step("Vertical keyboard interactions work correctly", async () => {
      // Down arrow should increase value (move splitter down)
      await userEvent.keyboard("{ArrowDown}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "50");

      // Up arrow should decrease value (move splitter up)
      await userEvent.keyboard("{ArrowUp}");
      await userEvent.keyboard("{ArrowUp}");
      await expect(splitter).toHaveAttribute("aria-valuenow", "30");

      // Left/Right arrows should not affect vertical splitter
      const currentValue = splitter.getAttribute("aria-valuenow");
      await userEvent.keyboard("{ArrowLeft}");
      await expect(splitter).toHaveAttribute("aria-valuenow", currentValue);
      await userEvent.keyboard("{ArrowRight}");
      await expect(splitter).toHaveAttribute("aria-valuenow", currentValue);
    });
  },
};
