import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Icon } from "../icon";
import { Toolbar } from "./toolbar.tsx";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Home,
  Search,
  Settings,
  Person,
  Add,
  FolderOpen,
  Save,
  Print,
  Menu,
  Minimize,
  Close,
} from "@commercetools/nimbus-icons";

const meta: Meta<typeof Toolbar.Root> = {
  title: "Components / Toolbar",
  component: Toolbar.Root,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: {
      control: { type: "radio" },
      options: ["horizontal", "vertical"],
      description: "The orientation of the toolbar",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toolbar.Root>;

export const Default: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args: any) => (
    <Toolbar.Root {...args}>
      <Button size="xs">Action 1</Button>
      <Button size="xs">Action 2</Button>
      <Button size="xs">Action 3</Button>
    </Toolbar.Root>
  ),
};

export const WithGroups: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args: any) => (
    <Toolbar.Root {...args}>
      <Toolbar.Group>
        <IconButton size="xs" aria-label="Bold">
          <Icon as={FormatBold} />
        </IconButton>
        <IconButton size="xs" aria-label="Italic">
          <Icon as={FormatItalic} />
        </IconButton>
        <IconButton size="xs" aria-label="Underline">
          <Icon as={FormatUnderlined} />
        </IconButton>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group>
        <IconButton size="xs" aria-label="Align Left">
          <Icon as={FormatAlignLeft} />
        </IconButton>
        <IconButton size="xs" aria-label="Align Center">
          <Icon as={FormatAlignCenter} />
        </IconButton>
        <IconButton size="xs" aria-label="Align Right">
          <Icon as={FormatAlignRight} />
        </IconButton>
      </Toolbar.Group>
    </Toolbar.Root>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args: any) => (
    <Toolbar.Root {...args}>
      <IconButton size="xs" aria-label="Home">
        <Icon as={Home} />
      </IconButton>
      <IconButton size="xs" aria-label="Search">
        <Icon as={Search} />
      </IconButton>
      <IconButton size="xs" aria-label="Settings">
        <Icon as={Settings} />
      </IconButton>
      <IconButton size="xs" aria-label="Profile">
        <Icon as={Person} />
      </IconButton>
    </Toolbar.Root>
  ),
};

export const VerticalWithGroups: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args: any) => (
    <Toolbar.Root {...args}>
      <Toolbar.Group>
        <IconButton size="xs" aria-label="New">
          <Icon as={Add} />
        </IconButton>
        <IconButton size="xs" aria-label="Open">
          <Icon as={FolderOpen} />
        </IconButton>
      </Toolbar.Group>
      <Toolbar.Separator orientation="horizontal" />
      <Toolbar.Group>
        <IconButton size="xs" aria-label="Save">
          <Icon as={Save} />
        </IconButton>
        <IconButton size="xs" aria-label="Print">
          <Icon as={Print} />
        </IconButton>
      </Toolbar.Group>
    </Toolbar.Root>
  ),
};

export const MixedContent: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args: any) => (
    <Toolbar.Root {...args}>
      <Toolbar.Group>
        <IconButton size="sm" aria-label="Menu">
          <Icon as={Menu} />
        </IconButton>
        <Button size="sm">File</Button>
        <Button size="sm">Edit</Button>
        <Button size="sm">View</Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Group>
        <IconButton size="sm" aria-label="Minimize">
          <Icon as={Minimize} />
        </IconButton>
        <IconButton size="sm" aria-label="Close">
          <Icon as={Close} />
        </IconButton>
      </Toolbar.Group>
    </Toolbar.Root>
  ),
};
