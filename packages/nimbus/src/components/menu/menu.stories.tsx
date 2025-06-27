import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./index";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
  },
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

export const WithSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Menu onAction={(key) => alert(`Small: ${key}`)}>
        <Menu.Trigger>Small</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Medium: ${key}`)}>
        <Menu.Trigger>Medium</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Large: ${key}`)}>
        <Menu.Trigger>Large</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Content>
      </Menu>
    </div>
  ),
};

export const WithVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Menu onAction={(key) => alert(`Solid: ${key}`)}>
        <Menu.Trigger>Solid</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Outline: ${key}`)}>
        <Menu.Trigger>Outline</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Content>
      </Menu>

      <Menu onAction={(key) => alert(`Ghost: ${key}`)}>
        <Menu.Trigger>Ghost</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
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
          <Menu.ItemKeyboard>⌘⇧Z</Menu.ItemKeyboard>
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
    <Menu onAction={(key) => alert(`Action: ${key}`)}>
      <Menu.Trigger>Account Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="profile">
          <div>
            <Menu.ItemLabel>View Profile</Menu.ItemLabel>
            <Menu.ItemDescription>
              See your public profile information
            </Menu.ItemDescription>
          </div>
        </Menu.Item>

        <Menu.Item id="settings">
          <div>
            <Menu.ItemLabel>Account Settings</Menu.ItemLabel>
            <Menu.ItemDescription>
              Manage your account preferences and security
            </Menu.ItemDescription>
          </div>
        </Menu.Item>

        <Menu.Item id="billing">
          <div>
            <Menu.ItemLabel>Billing & Usage</Menu.ItemLabel>
            <Menu.ItemDescription>
              View your subscription and usage details
            </Menu.ItemDescription>
          </div>
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item id="logout">
          <div>
            <Menu.ItemLabel>Sign Out</Menu.ItemLabel>
            <Menu.ItemDescription>
              Sign out of your account on this device
            </Menu.ItemDescription>
          </div>
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
    <Menu onAction={(key) => alert(`Action: ${key}`)}>
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
            <div>
              <Menu.ItemLabel>Paste</Menu.ItemLabel>
              <Menu.ItemDescription>Clipboard is empty</Menu.ItemDescription>
            </div>
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
            <div>
              <Menu.ItemLabel>Enter Fullscreen</Menu.ItemLabel>
              <Menu.ItemDescription>Hide all UI elements</Menu.ItemDescription>
            </div>
            <Menu.ItemKeyboard>F11</Menu.ItemKeyboard>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Item href="/help" target="_blank" rel="noopener">
          <div>
            <Menu.ItemLabel>Help & Support</Menu.ItemLabel>
            <Menu.ItemDescription>Open help documentation</Menu.ItemDescription>
          </div>
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
