import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./index";
import { Button, IconButton } from "@/components";
import { MoreVert, KeyboardArrowDown } from "@commercetools/nimbus-icons";

const meta: Meta<typeof Menu> = {
  title: "Experimental/Menu",
  component: Menu,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {
    onAction: { action: "onAction" },
    onOpenChange: { action: "onOpenChange" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Menu onAction={(key) => alert(`Action: ${key}`)}>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="copy">Copy</Menu.Item>
        <Menu.Item id="cut">Cut</Menu.Item>
        <Menu.Item id="paste">Paste</Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const WithAsChildButton: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Menu onAction={(key) => alert(`Primary Button: ${key}`)}>
        <Menu.Trigger asChild>
          <Button variant="solid" tone="primary">
            <KeyboardArrowDown />
            Primary Actions
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Secondary Button: ${key}`)}>
        <Menu.Trigger asChild>
          <Button variant="outline" tone="primary">
            <KeyboardArrowDown />
            Secondary Actions
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Ghost Button: ${key}`)}>
        <Menu.Trigger asChild>
          <Button variant="ghost" tone="primary">
            <KeyboardArrowDown />
            Ghost Actions
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  ),
};

export const WithAsChildIconButton: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Menu onAction={(key) => alert(`More Options: ${key}`)}>
        <Menu.Trigger asChild>
          <IconButton variant="ghost" tone="neutral" aria-label="More options">
            <MoreVert />
          </IconButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="edit">Edit</Menu.Item>
          <Menu.Item id="duplicate">Duplicate</Menu.Item>
          <Menu.Item id="archive">Archive</Menu.Item>
          <Menu.Separator />
          <Menu.Item id="delete" isDanger>
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Solid Icon: ${key}`)}>
        <Menu.Trigger asChild>
          <IconButton
            variant="solid"
            tone="primary"
            aria-label="Primary actions"
          >
            <MoreVert />
          </IconButton>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="share">Share</Menu.Item>
          <Menu.Item id="export">Export</Menu.Item>
          <Menu.Item id="print">Print</Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Menu onAction={(key) => alert(`Action: ${key}`)}>
      <Menu.Trigger>File Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>File Operations</Menu.GroupLabel>
          <Menu.Item id="new">New File</Menu.Item>
          <Menu.Item id="open">Open File</Menu.Item>
          <Menu.Item id="save">Save File</Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Edit Operations</Menu.GroupLabel>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>View Options</Menu.GroupLabel>
          <Menu.Item id="zoom-in">Zoom In</Menu.Item>
          <Menu.Item id="zoom-out">Zoom Out</Menu.Item>
          <Menu.Item id="fullscreen">Toggle Fullscreen</Menu.Item>
        </Menu.Group>
      </Menu.Content>
    </Menu>
  ),
};

export const WithKeyboardShortcuts: Story = {
  render: () => (
    <Menu onAction={(key) => alert(`Action: ${key}`)}>
      <Menu.Trigger>Edit Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="undo">
          <Menu.ItemLabel>Undo</Menu.ItemLabel>
          <Menu.ItemKeyboard>⌘Z</Menu.ItemKeyboard>
        </Menu.Item>
        <Menu.Item id="redo">
          <Menu.ItemLabel>Redo</Menu.ItemLabel>
          <Menu.ItemKeyboard>⌘+Y</Menu.ItemKeyboard>
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item id="copy">
          <Menu.ItemLabel>Copy</Menu.ItemLabel>
          <Menu.ItemKeyboard>⌘C</Menu.ItemKeyboard>
        </Menu.Item>
        <Menu.Item id="cut">
          <Menu.ItemLabel>Cut</Menu.ItemLabel>
          <Menu.ItemKeyboard>⌘X</Menu.ItemKeyboard>
        </Menu.Item>
        <Menu.Item id="paste">
          <Menu.ItemLabel>Paste</Menu.ItemLabel>
          <Menu.ItemKeyboard>⌘V</Menu.ItemKeyboard>
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item id="select-all">
          <Menu.ItemLabel>Select All</Menu.ItemLabel>
          <Menu.ItemKeyboard>⌘A</Menu.ItemKeyboard>
        </Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <Menu isOpen onAction={(key) => alert(`Action: ${key}`)}>
      <Menu.Trigger>Account Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="profile">
          <Menu.ItemLabel>View Profile</Menu.ItemLabel>
          <Menu.ItemDescription>
            See your public profile information
          </Menu.ItemDescription>
        </Menu.Item>

        <Menu.Item id="settings">
          <Menu.ItemLabel>Account Settings</Menu.ItemLabel>
          <Menu.ItemDescription>
            Manage your account preferences and security
          </Menu.ItemDescription>
        </Menu.Item>

        <Menu.Item id="billing">
          <Menu.ItemLabel>Billing & Usage</Menu.ItemLabel>
          <Menu.ItemDescription>
            View your subscription and usage details
          </Menu.ItemDescription>
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item id="logout">
          <Menu.ItemLabel>Sign Out</Menu.ItemLabel>
          <Menu.ItemDescription>
            Sign out of your account on this device
          </Menu.ItemDescription>
        </Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <Menu onAction={(key) => alert(`Action: ${key}`)}>
      <Menu.Trigger>Edit Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="undo">Undo</Menu.Item>
        <Menu.Item id="redo" isDisabled>
          Redo (unavailable)
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item id="copy">Copy</Menu.Item>
        <Menu.Item id="cut">Cut</Menu.Item>
        <Menu.Item id="paste" isDisabled>
          Paste (clipboard empty)
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item id="delete" isDisabled>
          Delete (no selection)
        </Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const WithDifferentPlacements: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "2rem",
        padding: "4rem",
        minHeight: "300px",
      }}
    >
      <Menu onAction={(key) => alert(`Top Start: ${key}`)}>
        <Menu.Trigger>Top Start</Menu.Trigger>
        <Menu.Content placement="top start">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Top: ${key}`)}>
        <Menu.Trigger>Top</Menu.Trigger>
        <Menu.Content placement="top">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Top End: ${key}`)}>
        <Menu.Trigger>Top End</Menu.Trigger>
        <Menu.Content placement="top end">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Bottom Start: ${key}`)}>
        <Menu.Trigger>Bottom Start</Menu.Trigger>
        <Menu.Content placement="bottom start">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Bottom: ${key}`)}>
        <Menu.Trigger>Bottom</Menu.Trigger>
        <Menu.Content placement="bottom">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Bottom End: ${key}`)}>
        <Menu.Trigger>Bottom End</Menu.Trigger>
        <Menu.Content placement="bottom end">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  ),
};

export const WithLinks: Story = {
  render: () => (
    <Menu>
      <Menu.Trigger>Navigation</Menu.Trigger>
      <Menu.Content>
        <Menu.Item href="/" target="_blank" rel="noopener">
          Home Page
        </Menu.Item>
        <Menu.Item href="/about" target="_blank" rel="noopener">
          About Us
        </Menu.Item>
        <Menu.Item href="/contact" target="_blank" rel="noopener">
          Contact
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item href="https://github.com" target="_blank" rel="noopener">
          GitHub
        </Menu.Item>
        <Menu.Item
          href="https://docs.example.com"
          target="_blank"
          rel="noopener"
        >
          Documentation
        </Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const ComplexExample: Story = {
  render: () => (
    <Menu isOpen onAction={(key) => alert(`Action: ${key}`)}>
      <Menu.Trigger>Application Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>File</Menu.GroupLabel>
          <Menu.Item id="new">
            <Menu.ItemLabel>New Document</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘N</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="open">
            <Menu.ItemLabel>Open</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘O</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="save">
            <Menu.ItemLabel>Save</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘S</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="save-as" isDisabled>
            <Menu.ItemLabel>Save As...</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘⇧S</Menu.ItemKeyboard>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Edit</Menu.GroupLabel>
          <Menu.Item id="undo">
            <Menu.ItemLabel>Undo</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘Z</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="redo">
            <Menu.ItemLabel>Redo</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘⇧Z</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="copy">
            <Menu.ItemLabel>Copy</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘C</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="paste" isDisabled>
            <Menu.ItemLabel>Paste</Menu.ItemLabel>
            <Menu.ItemDescription>Clipboard is empty</Menu.ItemDescription>
            <Menu.ItemKeyboard>⌘V</Menu.ItemKeyboard>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>View</Menu.GroupLabel>
          <Menu.Item id="zoom-in">
            <Menu.ItemLabel>Zoom In</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘+</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="zoom-out">
            <Menu.ItemLabel>Zoom Out</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘-</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="fullscreen">
            <Menu.ItemLabel>Enter Fullscreen</Menu.ItemLabel>
            <Menu.ItemDescription>Hide all UI elements</Menu.ItemDescription>

            <Menu.ItemKeyboard>F11</Menu.ItemKeyboard>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Item href="/help" target="_blank" rel="noopener">
          <Menu.ItemLabel>Help & Support</Menu.ItemLabel>
          <Menu.ItemDescription>Open help documentation</Menu.ItemDescription>
        </Menu.Item>

        <Menu.Item id="logout">
          <Menu.ItemLabel>Logout</Menu.ItemLabel>
          <Menu.ItemDescription>Sign out of your account</Menu.ItemDescription>
        </Menu.Item>
      </Menu.Content>
    </Menu>
  ),
};

export const ControlledMenu: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Menu
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onAction={(key) => {
            alert(`Action: ${key}`);
            setIsOpen(false);
          }}
        >
          <Menu.Trigger>Controlled Menu</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="item1">Item 1</Menu.Item>
            <Menu.Item id="item2">Item 2</Menu.Item>
            <Menu.Item id="item3">Item 3</Menu.Item>
          </Menu.Content>
        </Menu>

        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close" : "Open"} Menu
        </button>

        <span>Menu is {isOpen ? "open" : "closed"}</span>
      </div>
    );
  },
};

export const WithInteractiveStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Menu onAction={(key) => alert(`Action: ${key}`)}>
        <Menu.Trigger>Interactive States</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="normal">Normal Item</Menu.Item>
          <Menu.Item id="selected" isSelected>
            Selected Item
          </Menu.Item>
          <Menu.Item id="disabled" isDisabled>
            Disabled Item
          </Menu.Item>
          <Menu.Item id="danger" isDanger>
            Danger Item
          </Menu.Item>
          <Menu.Item id="loading" isLoading>
            Loading Item
          </Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Loading: ${key}`)}>
        <Menu.Trigger isLoading>Loading Trigger</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="item1">Item 1</Menu.Item>
          <Menu.Item id="item2">Item 2</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Loading Content: ${key}`)}>
        <Menu.Trigger>Loading Content</Menu.Trigger>
        <Menu.Content isLoading>
          <Menu.Item id="item1">Item 1</Menu.Item>
          <Menu.Item id="item2">Item 2</Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  ),
};

export const WithComplexStates: Story = {
  render: () => (
    <Menu onAction={(key) => alert(`Action: ${key}`)}>
      <Menu.Trigger>Complex Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>File Operations</Menu.GroupLabel>
          <Menu.Item id="new">
            <Menu.ItemLabel>New File</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘N</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="open" isSelected>
            <Menu.ItemLabel>Open File</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘O</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="save">
            <Menu.ItemLabel>Save File</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘S</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="save-as" isDisabled>
            <Menu.ItemLabel>Save As...</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘⇧S</Menu.ItemKeyboard>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Dangerous Actions</Menu.GroupLabel>
          <Menu.Item id="delete" isDanger>
            <Menu.ItemLabel>Delete File</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘⌫</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="reset" isDanger>
            <Menu.ItemLabel>Reset All Settings</Menu.ItemLabel>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Background Tasks</Menu.GroupLabel>
          <Menu.Item id="sync" isLoading>
            <Menu.ItemLabel>Synchronizing...</Menu.ItemLabel>
          </Menu.Item>
          <Menu.Item id="backup">
            <Menu.ItemLabel>Create Backup</Menu.ItemLabel>
          </Menu.Item>
        </Menu.Group>
      </Menu.Content>
    </Menu>
  ),
};
