import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@chakra-ui/react";
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
        <WindowSplitter.Separator aria-label="Resize panes" />
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
        <WindowSplitter.Separator aria-label="Resize panes vertically" />
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
    onValueChange: (value) => console.log("Value changed:", value),
  },
  render: (args) => (
    <Box height="500px" width="100%" border="1px solid" borderColor="gray.200">
      <WindowSplitter.Root {...args}>
        <WindowSplitter.Pane isPrimary>
          <PrimaryPaneContent />
        </WindowSplitter.Pane>
        <WindowSplitter.Separator aria-label="Controlled splitter" />
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
        <WindowSplitter.Separator aria-label="Constrained splitter (20% - 80%)" />
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
        <WindowSplitter.Separator aria-label="Disabled splitter" />
        <WindowSplitter.Pane>
          <SecondaryPaneContent />
        </WindowSplitter.Pane>
      </WindowSplitter.Root>
    </Box>
  ),
};
