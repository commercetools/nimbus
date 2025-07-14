import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu } from "./index";
import { Button, Icon, IconButton, Kbd, Text } from "@/components";
import {
  MoreVert,
  KeyboardArrowDown,
  CopyAll,
  InsertDriveFile,
  FolderOpen,
  Save,
  SaveAs,
  Undo,
  Redo,
  ContentCopy,
  ContentPaste,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  Help,
  Logout,
  Edit,
  Delete,
  Sync,
  Backup,
  Settings,
  AccountCircle,
  Notifications,
  Security,
  Language,
  Palette,
  ViewList,
  ViewModule,
  Dashboard,
  Analytics,
  Report,
  Share,
  Download,
  Upload,
} from "@commercetools/nimbus-icons";

const meta: Meta<typeof Menu.Root> = {
  title: "Experimental/Menu",
  component: Menu.Root,
  parameters: {},
  tags: ["autodocs"],
  argTypes: {
    onOpenChange: { action: "onOpenChange" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Menu.Root defaultOpen>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="copy">
          <Text slot="label">Copy</Text>
          <Text slot="description">Copy the selected text</Text>
          <Kbd slot="keyboard">⌘C</Kbd>
        </Menu.Item>
        <Menu.Item id="cut">
          <Text slot="label">Cut</Text>
          <Text slot="description">Cut the selected text</Text>
          <Kbd slot="keyboard">⌘X</Kbd>
        </Menu.Item>
        <Menu.Item id="paste">
          <Text slot="label">Paste</Text>
          <Text slot="description">Paste the copied text</Text>
          <Kbd slot="keyboard">⌘V</Kbd>
        </Menu.Item>
        <Menu.Item id="delete">
          <Text slot="label">Delete</Text>
          <Text slot="description">Delete the selected text</Text>
          <Kbd slot="keyboard">⌫</Kbd>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <Menu.Root defaultOpen>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="copy">Copy</Menu.Item>
        <Menu.Item id="cut">Cut</Menu.Item>
        <Menu.Item id="paste">Paste</Menu.Item>
        <Menu.Separator />
        <Menu.SubmenuTrigger>
          <Menu.Item>
            <Text slot="label">Submenu</Text>
            <Text slot="description">Submenu description</Text>
            <Kbd slot="keyboard">⌘⇧S</Kbd>
          </Menu.Item>
          <Menu.Submenu>
            <Menu.Item id="copy">Copy</Menu.Item>
          </Menu.Submenu>
        </Menu.SubmenuTrigger>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const WithAsChildButton: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Menu.Root defaultOpen>
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
      </Menu.Root>

      <Menu.Root defaultOpen>
        <Menu.Trigger asChild>
          <Button variant="outline" colorPalette="primary">
            <KeyboardArrowDown />
            Secondary Actions
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen>
        <Menu.Trigger asChild>
          <Button variant="ghost" colorPalette="primary">
            <KeyboardArrowDown />
            Ghost Actions
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="cut">Cut</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  ),
};

export const WithAsChildIconButton: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Menu.Root defaultOpen>
        <Menu.Trigger asChild>
          <IconButton
            variant="ghost"
            colorPalette="neutral"
            aria-label="More options"
          >
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
      </Menu.Root>

      <Menu.Root defaultOpen>
        <Menu.Trigger asChild>
          <IconButton
            variant="solid"
            colorPalette="primary"
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
      </Menu.Root>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Menu.Root defaultOpen>
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
    </Menu.Root>
  ),
};

export const WithKeyboardShortcuts: Story = {
  render: () => (
    <Menu.Root defaultOpen>
      <Menu.Trigger>Edit Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="undo">
          <Text slot="label">Undo</Text>
          <Kbd slot="keyboard">⌘Z</Kbd>
        </Menu.Item>
        <Menu.Item id="redo">
          <Text slot="label">Redo</Text>
          <Kbd slot="keyboard">⌘+Y</Kbd>
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item id="copy">
          <Text slot="label">Copy</Text>
          <Kbd slot="keyboard">⌘C</Kbd>
        </Menu.Item>
        <Menu.Item id="cut">
          <Text slot="label">Cut</Text>
          <Kbd slot="keyboard">⌘X</Kbd>
        </Menu.Item>
        <Menu.Item id="paste">
          <Text slot="label">Paste</Text>
          <Kbd slot="keyboard">⌘V</Kbd>
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item id="select-all">
          <Text slot="label">Select All</Text>
          <Kbd slot="keyboard">⌘A</Kbd>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <Menu.Root defaultOpen>
      <Menu.Trigger>Account Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="profile">
          <Text slot="label">View Profile</Text>
          <Text slot="description">
            See your public profile information
          </Text>
        </Menu.Item>

        <Menu.Item id="settings">
          <Text slot="label">Account Settings</Text>
          <Text slot="description">
            Manage your account preferences and security
          </Text>
        </Menu.Item>

        <Menu.Item id="billing">
          <Text slot="label">Billing & Usage</Text>
          <Text slot="description">
            View your subscription and usage details
          </Text>
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item id="logout">
          <Text slot="label">Sign Out</Text>
          <Text slot="description">
            Sign out of your account on this device
          </Text>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <Menu.Root defaultOpen>
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
    </Menu.Root>
  ),
};

export const WithDifferentPlacements: Story = {
  render: () => (
    <div
      style={{
        position: "relative",
        height: "600px",
        width: "100%",
        border: "1px dashed #ccc",
        background: "#f5f5f5",
      }}
    >
      {/* Top placements */}
      <Menu.Root defaultOpen placement="top start">
        <Menu.Trigger asChild>
          <Button
            variant="solid"
            size="xs"
            style={{
              position: "absolute",
              top: "150px",
              left: "20%",
            }}
          >
            Top Start
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen placement="top">
        <Menu.Trigger asChild>
          <Button
            variant="solid"
            size="xs"
            style={{
              position: "absolute",
              top: "150px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Top
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen placement="top end">
        <Menu.Trigger asChild>
          <Button
            variant="solid"
            size="xs"
            style={{
              position: "absolute",
              top: "150px",
              right: "20%",
            }}
          >
            Top End
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      {/* Middle placements (left and right) */}
      <Menu.Root defaultOpen placement="left">
        <Menu.Trigger asChild>
          <Button
            variant="solid"
            size="xs"
            style={{
              position: "absolute",
              top: "50%",
              left: "150px",
              transform: "translateY(-50%)",
            }}
          >
            Left
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen placement="right">
        <Menu.Trigger asChild>
          <Button
            variant="solid"
            size="xs"
            style={{
              position: "absolute",
              top: "50%",
              right: "150px",
              transform: "translateY(-50%)",
            }}
          >
            Right
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      {/* Bottom placements */}
      <Menu.Root defaultOpen placement="bottom start">
        <Menu.Trigger asChild>
          <Button
            variant="solid"
            size="xs"
            style={{
              position: "absolute",
              bottom: "150px",
              left: "20%",
            }}
          >
            Bottom Start
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen placement="bottom">
        <Menu.Trigger asChild>
          <Button
            variant="solid"
            size="sm"
            style={{
              position: "absolute",
              bottom: "150px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Bottom
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen placement="bottom end">
        <Menu.Trigger asChild>
          <Button
            variant="solid"
            size="xs"
            style={{
              position: "absolute",
              bottom: "150px",
              right: "20%",
            }}
          >
            Bottom End
          </Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      {/* Labels to show placement names */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "14px",
          color: "#666",
          fontWeight: "600",
        }}
      >
        Menu Placement Examples
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "12px",
          color: "#999",
        }}
      >
        Buttons are positioned to demonstrate different menu placements
      </div>
    </div>
  ),
};

export const WithLinks: Story = {
  render: () => (
    <Menu.Root defaultOpen>
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
    </Menu.Root>
  ),
};

export const ComplexExample: Story = {
  render: () => (
    <Menu.Root
      defaultOpen
      onAction={(key) => console.log("Action triggered", key)}
    >
      <Menu.Trigger>Application Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>File Operations</Menu.GroupLabel>
          <Menu.Item id="new">
            <Icon slot="icon">
              <InsertDriveFile />
            </Icon>
            <Text slot="label">New Document</Text>
            <Kbd slot="keyboard">⌘N</Kbd>
          </Menu.Item>
          <Menu.Item id="open">
            <Icon slot="icon">
              <FolderOpen />
            </Icon>
            <Text slot="label">Open</Text>
            <Kbd slot="keyboard">⌘O</Kbd>
          </Menu.Item>
          <Menu.Item id="save">
            <Icon slot="icon">
              <Save />
            </Icon>
            <Text slot="label">Save</Text>
            <Kbd slot="keyboard">⌘S</Kbd>
          </Menu.Item>
          <Menu.Item id="save-as" isDisabled>
            <Icon slot="icon">
              <SaveAs />
            </Icon>
            <Text slot="label">Save As...</Text>
            <Text slot="description">
              Save document with a new name
            </Text>
            <Kbd slot="keyboard">⌘⇧S</Kbd>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Edit Operations</Menu.GroupLabel>
          <Menu.Item id="undo">
            <Icon slot="icon">
              <Undo />
            </Icon>
            <Text slot="label">Undo</Text>
            <Kbd slot="keyboard">⌘Z</Kbd>
          </Menu.Item>
          <Menu.Item id="redo">
            <Icon slot="icon">
              <Redo />
            </Icon>
            <Text slot="label">Redo</Text>
            <Kbd slot="keyboard">⌘⇧Z</Kbd>
          </Menu.Item>
          <Menu.Item id="copy">
            <Icon slot="icon">
              <ContentCopy />
            </Icon>
            <Text slot="label">Copy</Text>
            <Kbd slot="keyboard">⌘C</Kbd>
          </Menu.Item>
          <Menu.Item id="paste" isDisabled>
            <Icon slot="icon">
              <ContentPaste />
            </Icon>
            <Text slot="label">Paste</Text>
            <Text slot="description">Clipboard is empty</Text>
            <Kbd slot="keyboard">⌘V</Kbd>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>View Options</Menu.GroupLabel>
          <Menu.Item id="zoom-in">
            <Icon slot="icon">
              <ZoomIn />
            </Icon>
            <Text slot="label">Zoom In</Text>
            <Kbd slot="keyboard">⌘+</Kbd>
          </Menu.Item>
          <Menu.Item id="zoom-out">
            <Icon slot="icon">
              <ZoomOut />
            </Icon>
            <Text slot="label">Zoom Out</Text>
            <Kbd slot="keyboard">⌘-</Kbd>
          </Menu.Item>
          <Menu.Item id="fullscreen">
            <Icon slot="icon">
              <Fullscreen />
            </Icon>
            <Text slot="label">Enter Fullscreen</Text>
            <Text slot="description">Hide all UI elements</Text>
            <Kbd slot="keyboard">F11</Kbd>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Item Variations</Menu.GroupLabel>
          {/* Item with icon only */}
          <Menu.Item id="icon-only">
            <Icon slot="icon">
              <Edit />
            </Icon>
            <Text slot="label">Icon + Label</Text>
          </Menu.Item>

          {/* Item with label only (no icon) */}
          <Menu.Item id="label-only">
            <Text slot="label">Label Only</Text>
          </Menu.Item>

          {/* Item with label + description (no icon) */}
          <Menu.Item id="label-desc">
            <Text slot="label">Label + Description</Text>
            <Text slot="description">
              This item has a description but no icon
            </Text>
          </Menu.Item>

          {/* Item with label + keyboard (no icon) */}
          <Menu.Item id="label-kbd">
            <Text slot="label">Label + Keyboard</Text>
            <Kbd slot="keyboard">⌘K</Kbd>
          </Menu.Item>

          {/* Item with icon + label + description (no keyboard) */}
          <Menu.Item id="icon-label-desc">
            <Icon slot="icon">
              <Help />
            </Icon>
            <Text slot="label">Icon + Label + Description</Text>
            <Text slot="description">
              This item has everything except keyboard shortcut
            </Text>
          </Menu.Item>

          {/* Item with icon + label + keyboard (no description) */}
          <Menu.Item id="icon-label-kbd">
            <Icon slot="icon">
              <Delete />
            </Icon>
            <Text slot="label">Icon + Label + Keyboard</Text>
            <Kbd slot="keyboard">⌘⌫</Kbd>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>States & Behaviors</Menu.GroupLabel>
          <Menu.Item id="selected" isSelected>
            <Icon slot="icon">
              <Edit />
            </Icon>
            <Text slot="label">Selected Item</Text>
            <Text slot="description">
              This item is currently selected
            </Text>
            <Kbd slot="keyboard">⌘E</Kbd>
          </Menu.Item>

          <Menu.Item id="danger" isDanger>
            <Icon slot="icon">
              <Delete />
            </Icon>
            <Text slot="label">Danger Item</Text>
            <Text slot="description">
              This is a destructive action
            </Text>
            <Kbd slot="keyboard">⌘⌫</Kbd>
          </Menu.Item>

          <Menu.Item id="loading" isLoading>
            <Icon slot="icon">
              <Sync />
            </Icon>
            <Text slot="label">Loading Item</Text>
            <Text slot="description">
              This item is currently loading
            </Text>
          </Menu.Item>

          <Menu.Item id="disabled" isDisabled>
            <Icon slot="icon">
              <Backup />
            </Icon>
            <Text slot="label">Disabled Item</Text>
            <Text slot="description">This item is disabled</Text>
            <Kbd slot="keyboard">⌘B</Kbd>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Submenu Examples</Menu.GroupLabel>
          {/* Single level submenu */}
          <Menu.SubmenuTrigger>
            <Menu.Item>
              <Icon slot="icon">
                <FolderOpen />
              </Icon>
              <Text slot="label">Submenu with Icon</Text>
              <Text slot="description">This opens a submenu</Text>
              <Kbd slot="keyboard">⌘⇧M</Kbd>
            </Menu.Item>
            <Menu.Submenu>
              <Menu.Item id="sub1">
                <Icon slot="icon">
                  <Edit />
                </Icon>
                <Text slot="label">Submenu Item 1</Text>
              </Menu.Item>
              <Menu.Item id="sub2">
                <Text slot="label">Submenu Item 2</Text>
                <Text slot="description">No icon here</Text>
              </Menu.Item>
            </Menu.Submenu>
          </Menu.SubmenuTrigger>

          {/* Multi-level submenu - Settings */}
          <Menu.SubmenuTrigger>
            <Menu.Item>
              <Icon slot="icon">
                <Settings />
              </Icon>
              <Text slot="label">Settings</Text>
              <Text slot="description">
                Application settings and preferences
              </Text>
            </Menu.Item>
            <Menu.Submenu>
              <Menu.Item id="general">
                <Icon slot="icon">
                  <Settings />
                </Icon>
                <Text slot="label">General</Text>
              </Menu.Item>

              {/* Nested submenu - Account */}
              <Menu.SubmenuTrigger>
                <Menu.Item>
                  <Icon slot="icon">
                    <AccountCircle />
                  </Icon>
                  <Text slot="label">Account</Text>
                  <Text slot="description">
                    User account settings
                  </Text>
                </Menu.Item>
                <Menu.Submenu>
                  <Menu.Item id="profile">
                    <Text slot="label">Profile</Text>
                    <Kbd slot="keyboard">⌘P</Kbd>
                  </Menu.Item>
                  <Menu.Item id="notifications">
                    <Icon slot="icon">
                      <Notifications />
                    </Icon>
                    <Text slot="label">Notifications</Text>
                  </Menu.Item>
                  <Menu.Item id="security" isSelected>
                    <Icon slot="icon">
                      <Security />
                    </Icon>
                    <Text slot="label">Security</Text>
                    <Text slot="description">
                      Password and security settings
                    </Text>
                  </Menu.Item>
                </Menu.Submenu>
              </Menu.SubmenuTrigger>

              {/* Nested submenu - Appearance */}
              <Menu.SubmenuTrigger>
                <Menu.Item>
                  <Icon slot="icon">
                    <Palette />
                  </Icon>
                  <Text slot="label">Appearance</Text>
                  <Text slot="description">
                    Theme and display options
                  </Text>
                </Menu.Item>
                <Menu.Submenu>
                  <Menu.Item id="theme">
                    <Text slot="label">Theme</Text>
                    <Kbd slot="keyboard">⌘T</Kbd>
                  </Menu.Item>
                  <Menu.Item id="language">
                    <Icon slot="icon">
                      <Language />
                    </Icon>
                    <Text slot="label">Language</Text>
                  </Menu.Item>

                  {/* Third level submenu - View Options */}
                  <Menu.SubmenuTrigger>
                    <Menu.Item>
                      <Icon slot="icon">
                        <ViewList />
                      </Icon>
                      <Text slot="label">View Options</Text>
                      <Text slot="description">
                        Layout and display preferences
                      </Text>
                    </Menu.Item>
                    <Menu.Submenu>
                      <Menu.Item id="list-view">
                        <Icon slot="icon">
                          <ViewList />
                        </Icon>
                        <Text slot="label">List View</Text>
                        <Kbd slot="keyboard">⌘1</Kbd>
                      </Menu.Item>
                      <Menu.Item id="grid-view" isSelected>
                        <Icon slot="icon">
                          <ViewModule />
                        </Icon>
                        <Text slot="label">Grid View</Text>
                        <Kbd slot="keyboard">⌘2</Kbd>
                      </Menu.Item>
                      <Menu.Item id="dashboard-view">
                        <Icon slot="icon">
                          <Dashboard />
                        </Icon>
                        <Text slot="label">Dashboard View</Text>
                        <Kbd slot="keyboard">⌘3</Kbd>
                      </Menu.Item>
                    </Menu.Submenu>
                  </Menu.SubmenuTrigger>
                </Menu.Submenu>
              </Menu.SubmenuTrigger>

              <Menu.Separator />

              <Menu.Item id="advanced" isDisabled>
                <Text slot="label">Advanced Settings</Text>
                <Text slot="description">
                  Advanced configuration options
                </Text>
              </Menu.Item>
            </Menu.Submenu>
          </Menu.SubmenuTrigger>

          {/* Multi-level submenu - Reports */}
          <Menu.SubmenuTrigger>
            <Menu.Item>
              <Icon slot="icon">
                <Analytics />
              </Icon>
              <Text slot="label">Reports</Text>
              <Text slot="description">
                Analytics and reporting tools
              </Text>
            </Menu.Item>
            <Menu.Submenu>
              <Menu.Item id="dashboard">
                <Icon slot="icon">
                  <Dashboard />
                </Icon>
                <Text slot="label">Dashboard</Text>
                <Kbd slot="keyboard">⌘D</Kbd>
              </Menu.Item>

              {/* Nested submenu - Export Options */}
              <Menu.SubmenuTrigger>
                <Menu.Item>
                  <Icon slot="icon">
                    <Share />
                  </Icon>
                  <Text slot="label">Export</Text>
                  <Text slot="description">
                    Export data in various formats
                  </Text>
                </Menu.Item>
                <Menu.Submenu>
                  <Menu.Item id="export-pdf">
                    <Icon slot="icon">
                      <Download />
                    </Icon>
                    <Text slot="label">Export as PDF</Text>
                    <Kbd slot="keyboard">⌘⇧P</Kbd>
                  </Menu.Item>
                  <Menu.Item id="export-csv">
                    <Icon slot="icon">
                      <Download />
                    </Icon>
                    <Text slot="label">Export as CSV</Text>
                    <Kbd slot="keyboard">⌘⇧C</Kbd>
                  </Menu.Item>
                  <Menu.Item id="export-json" isLoading>
                    <Icon slot="icon">
                      <Download />
                    </Icon>
                    <Text slot="label">Export as JSON</Text>
                    <Text slot="description">
                      Preparing export...
                    </Text>
                  </Menu.Item>
                </Menu.Submenu>
              </Menu.SubmenuTrigger>

              {/* Nested submenu - Import Options */}
              <Menu.SubmenuTrigger>
                <Menu.Item>
                  <Icon slot="icon">
                    <Upload />
                  </Icon>
                  <Text slot="label">Import</Text>
                  <Text slot="description">
                    Import data from external sources
                  </Text>
                </Menu.Item>
                <Menu.Submenu>
                  <Menu.Item id="import-csv">
                    <Icon slot="icon">
                      <Upload />
                    </Icon>
                    <Text slot="label">Import CSV</Text>
                  </Menu.Item>
                  <Menu.Item id="import-json">
                    <Icon slot="icon">
                      <Upload />
                    </Icon>
                    <Text slot="label">Import JSON</Text>
                  </Menu.Item>
                  <Menu.Item id="import-xml" isDisabled>
                    <Icon slot="icon">
                      <Upload />
                    </Icon>
                    <Text slot="label">Import XML</Text>
                    <Text slot="description">
                      Feature not available
                    </Text>
                  </Menu.Item>
                </Menu.Submenu>
              </Menu.SubmenuTrigger>

              <Menu.Separator />

              <Menu.Item id="custom-report" isDanger>
                <Icon slot="icon">
                  <Report />
                </Icon>
                <Text slot="label">Delete Custom Reports</Text>
                <Text slot="description">
                  Remove all custom report configurations
                </Text>
              </Menu.Item>
            </Menu.Submenu>
          </Menu.SubmenuTrigger>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Item href="/help" target="_blank" rel="noopener">
          <Icon slot="icon">
            <Help />
          </Icon>
          <Text slot="label">Help & Support</Text>
          <Text slot="description">Open help documentation</Text>
        </Menu.Item>

        <Menu.Item id="logout">
          <Icon slot="icon">
            <Logout />
          </Icon>
          <Text slot="label">Logout</Text>
          <Text slot="description">Sign out of your account</Text>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const ControlledMenu: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Menu.Root isOpen={isOpen} onOpenChange={setIsOpen}>
          <Menu.Trigger>Controlled Menu</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="item1">Item 1</Menu.Item>
            <Menu.Item id="item2">Item 2</Menu.Item>
            <Menu.Item id="item3">Item 3</Menu.Item>
          </Menu.Content>
        </Menu.Root>

        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close" : "Open"} Menu
        </Button>

        <Text>Menu is {isOpen ? "open" : "closed"}</Text>
      </div>
    );
  },
};

export const WithInteractiveStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Menu.Root defaultOpen>
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
      </Menu.Root>

      <Menu.Root defaultOpen>
        <Menu.Trigger>Loading Trigger</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="item1">Item 1</Menu.Item>
          <Menu.Item id="item2">Item 2</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen>
        <Menu.Trigger>Loading Content</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="item1">Item 1</Menu.Item>
          <Menu.Item id="item2">Item 2</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  ),
};

export const WithComplexStates: Story = {
  render: () => (
    <Menu.Root defaultOpen>
      <Menu.Trigger>Complex Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>File Operations</Menu.GroupLabel>
          <Menu.Item id="new">
            <Text slot="label">New File</Text>
            <Kbd slot="keyboard">⌘N</Kbd>
          </Menu.Item>
          <Menu.Item id="open" isSelected>
            <Text slot="label">Open File</Text>
            <Kbd slot="keyboard">⌘O</Kbd>
          </Menu.Item>
          <Menu.Item id="save">
            <Text slot="label">Save File</Text>
            <Kbd slot="keyboard">⌘S</Kbd>
          </Menu.Item>
          <Menu.Item id="save-as" isDisabled>
            <Text slot="label">Save As...</Text>
            <Kbd slot="keyboard">⌘⇧S</Kbd>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Dangerous Actions</Menu.GroupLabel>
          <Menu.Item id="delete" isDanger>
            <Text slot="label">Delete File</Text>
            <Kbd slot="keyboard">⌘⌫</Kbd>
          </Menu.Item>
          <Menu.Item id="reset" isDanger>
            <Text slot="label">Reset All Settings</Text>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Background Tasks</Menu.GroupLabel>
          <Menu.Item id="sync" isLoading>
            <Text slot="label">Synchronizing...</Text>
          </Menu.Item>
          <Menu.Item id="backup">
            <Text slot="label">Create Backup</Text>
          </Menu.Item>
        </Menu.Group>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const WithTriggerProps: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Menu.Root defaultOpen trigger="press">
        <Menu.Trigger>Press Trigger</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="press-copy">Copy (Press)</Menu.Item>
          <Menu.Item id="press-cut">Cut (Press)</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen trigger="longPress">
        <Menu.Trigger>Long Press Trigger</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="longpress-copy">Copy (Long Press)</Menu.Item>
          <Menu.Item id="longpress-cut">Cut (Long Press)</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  ),
};

export const SingleSelection: Story = {
  render: () => {
    const [selectedKey, setSelectedKey] = React.useState<string>("medium");

    return (
      <Menu.Root
        defaultOpen
        selectionMode="single"
        selectedKeys={new Set([selectedKey])}
        onSelectionChange={(keys) => {
          if (keys !== "all") {
            const newKey = Array.from(keys)[0] as string;
            setSelectedKey(newKey);
          }
        }}
      >
        <Menu.Trigger>View Options</Menu.Trigger>
        <Menu.Content>
          <Menu.Group>
            <Menu.GroupLabel>Text Size</Menu.GroupLabel>
            <Menu.Item id="small" isSelected={selectedKey === "small"}>
              <Text slot="label">Small</Text>
              <Text slot="description">Compact text display</Text>
            </Menu.Item>
            <Menu.Item id="medium" isSelected={selectedKey === "medium"}>
              <Text slot="label">Medium</Text>
              <Text slot="description">Default text size</Text>
            </Menu.Item>
            <Menu.Item id="large" isSelected={selectedKey === "large"}>
              <Text slot="label">Large</Text>
              <Text slot="description">
                Larger text for better readability
              </Text>
            </Menu.Item>
          </Menu.Group>

          <Menu.Separator />

          <Menu.Group>
            <Menu.GroupLabel>Theme</Menu.GroupLabel>
            <Menu.Item id="light">
              <Text slot="label">Light Mode</Text>
              <Text slot="description">
                Light background with dark text
              </Text>
            </Menu.Item>
            <Menu.Item id="dark">
              <Text slot="label">Dark Mode</Text>
              <Text slot="description">
                Dark background with light text
              </Text>
            </Menu.Item>
            <Menu.Item id="auto">
              <Text slot="label">Auto</Text>
              <Text slot="description">
                Follow system preference
              </Text>
            </Menu.Item>
          </Menu.Group>
        </Menu.Content>
      </Menu.Root>
    );
  },
};

export const WithClickLogging: Story = {
  render: () => (
    <Menu.Root
      defaultOpen
      onAction={(key) => console.log("Menu action triggered:", key)}
    >
      <Menu.Trigger>Actions Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="copy">
          <Icon slot="icon">
            <ContentCopy />
          </Icon>
          <Text slot="label">Copy</Text>
          <Kbd slot="keyboard">⌘C</Kbd>
        </Menu.Item>
        <Menu.Item id="cut">
          <Text slot="label">Cut</Text>
          <Kbd slot="keyboard">⌘X</Kbd>
        </Menu.Item>
        <Menu.Item id="paste">
          <Icon slot="icon">
            <ContentPaste />
          </Icon>
          <Text slot="label">Paste</Text>
          <Kbd slot="keyboard">⌘V</Kbd>
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item id="delete" isDanger>
          <Icon slot="icon">
            <Delete />
          </Icon>
          <Text slot="label">Delete</Text>
          <Kbd slot="keyboard">⌫</Kbd>
        </Menu.Item>

        <Menu.Separator />

        <Menu.SubmenuTrigger>
          <Menu.Item>
            <Icon slot="icon">
              <FolderOpen />
            </Icon>
            <Text slot="label">More Options</Text>
          </Menu.Item>
          <Menu.Submenu>
            <Menu.Item id="option1">Option 1</Menu.Item>
            <Menu.Item id="option2">Option 2</Menu.Item>
            <Menu.SubmenuTrigger>
              <Menu.Item>Even More</Menu.Item>
              <Menu.Submenu>
                <Menu.Item id="deep1">Deep Option 1</Menu.Item>
                <Menu.Item id="deep2">Deep Option 2</Menu.Item>
              </Menu.Submenu>
            </Menu.SubmenuTrigger>
          </Menu.Submenu>
        </Menu.SubmenuTrigger>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const WithCentralizedPropsAndOverride: Story = {
  render: () => (
    <Menu.Root
      defaultOpen
      onAction={(key) => console.log("Root handler:", key)}
      selectionMode="single"
      defaultSelectedKeys={["view-list"]}
    >
      <Menu.Trigger>Settings Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>View Options (inherits root props)</Menu.GroupLabel>
          <Menu.Item id="view-list">List View</Menu.Item>
          <Menu.Item id="view-grid">Grid View</Menu.Item>
          <Menu.Item id="view-detail">Detail View</Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.SubmenuTrigger>
          <Menu.Item>
            <Icon slot="icon">
              <Settings />
            </Icon>
            <Text slot="label">Advanced Settings</Text>
          </Menu.Item>
          <Menu.Submenu
            onAction={(key) => console.log("Submenu override handler:", key)}
          >
            <Menu.Item id="advanced-1">Advanced Option 1</Menu.Item>
            <Menu.Item id="advanced-2">Advanced Option 2</Menu.Item>

            <Menu.SubmenuTrigger>
              <Menu.Item>More Settings</Menu.Item>
              <Menu.Submenu>
                <Menu.Item id="deep-1">
                  Deep Setting 1 (uses submenu handler)
                </Menu.Item>
                <Menu.Item id="deep-2">
                  Deep Setting 2 (uses submenu handler)
                </Menu.Item>
              </Menu.Submenu>
            </Menu.SubmenuTrigger>
          </Menu.Submenu>
        </Menu.SubmenuTrigger>

        <Menu.Separator />

        <Menu.Item id="logout">Logout (uses root handler)</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const MultiSelection: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
      new Set(["notifications", "updates"])
    );

    return (
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <Text slot="label">Email Settings</Text>
          <Text slot="description">
            {selectedKeys.size} option{selectedKeys.size !== 1 ? "s" : ""}{" "}
            selected
          </Text>
        </Menu.Trigger>
        <Menu.Content
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={(keys) => {
            if (keys !== "all") {
              setSelectedKeys(new Set(Array.from(keys) as string[]));
            }
          }}
        >
          <Menu.Group>
            <Menu.GroupLabel>Email Preferences</Menu.GroupLabel>
            <Menu.Item
              id="notifications"
              isSelected={selectedKeys.has("notifications")}
            >
              <Icon slot="icon">
                <Notifications />
              </Icon>
              <Text slot="label">Notifications</Text>
              <Text slot="description">
                Receive notifications about important events
              </Text>
            </Menu.Item>
            <Menu.Item id="updates" isSelected={selectedKeys.has("updates")}>
              <Icon slot="icon">
                <Sync />
              </Icon>
              <Text slot="label">Product Updates</Text>
              <Text slot="description">
                Get notified about new features and improvements
              </Text>
            </Menu.Item>
            <Menu.Item
              id="marketing"
              isSelected={selectedKeys.has("marketing")}
            >
              <Icon slot="icon">
                <Analytics />
              </Icon>
              <Text slot="label">Marketing</Text>
              <Text slot="description">
                Receive promotional emails and offers
              </Text>
            </Menu.Item>
            <Menu.Item id="security" isSelected={selectedKeys.has("security")}>
              <Icon slot="icon">
                <Security />
              </Icon>
              <Text slot="label">Security Alerts</Text>
              <Text slot="description">
                Important security notifications
              </Text>
            </Menu.Item>
          </Menu.Group>

          <Menu.Separator />

          <Menu.Group>
            <Menu.GroupLabel>Content Preferences</Menu.GroupLabel>
            <Menu.Item
              id="newsletters"
              isSelected={selectedKeys.has("newsletters")}
            >
              <Icon slot="icon">
                <Report />
              </Icon>
              <Text slot="label">Newsletters</Text>
              <Text slot="description">
                Weekly digest of articles and insights
              </Text>
            </Menu.Item>
            <Menu.Item id="tips" isSelected={selectedKeys.has("tips")}>
              <Icon slot="icon">
                <Help />
              </Icon>
              <Text slot="label">Tips & Tricks</Text>
              <Text slot="description">
                Helpful tips to get the most out of the platform
              </Text>
            </Menu.Item>
          </Menu.Group>
        </Menu.Content>
      </Menu.Root>
    );
  },
};
