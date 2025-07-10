import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu } from "./index";
import { Button, Icon, IconButton, Text } from "@/components";
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
          <Menu.ItemLabel>Copy</Menu.ItemLabel>
          <Menu.ItemDescription>Copy the selected text</Menu.ItemDescription>
          <Menu.ItemKeyboard>⌘C</Menu.ItemKeyboard>
        </Menu.Item>
        <Menu.Item id="cut">
          <Menu.ItemLabel>Cut</Menu.ItemLabel>
          <Menu.ItemDescription>Cut the selected text</Menu.ItemDescription>
          <Menu.ItemKeyboard>⌘X</Menu.ItemKeyboard>
        </Menu.Item>
        <Menu.Item id="paste">
          <Menu.ItemLabel>Paste</Menu.ItemLabel>
          <Menu.ItemDescription>Paste the copied text</Menu.ItemDescription>
          <Menu.ItemKeyboard>⌘V</Menu.ItemKeyboard>
        </Menu.Item>
        <Menu.Item id="delete">
          <Menu.ItemLabel>Delete</Menu.ItemLabel>
          <Menu.ItemDescription>Delete the selected text</Menu.ItemDescription>
          <Menu.ItemKeyboard>⌫</Menu.ItemKeyboard>
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
            <Menu.ItemLabel>Submenu</Menu.ItemLabel>
            <Menu.ItemDescription>Submenu description</Menu.ItemDescription>
            <Menu.ItemKeyboard>⌘⇧S</Menu.ItemKeyboard>
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
    </Menu.Root>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <Menu.Root defaultOpen>
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
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "2rem",
        padding: "4rem",
        minHeight: "300px",
      }}
    >
      <Menu.Root defaultOpen>
        <Menu.Trigger>Top Start</Menu.Trigger>
        <Menu.Content placement="top start">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen>
        <Menu.Trigger>Top</Menu.Trigger>
        <Menu.Content placement="top">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen>
        <Menu.Trigger>Top End</Menu.Trigger>
        <Menu.Content placement="top end">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen>
        <Menu.Trigger>Bottom Start</Menu.Trigger>
        <Menu.Content placement="bottom start">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen>
        <Menu.Trigger>Bottom</Menu.Trigger>
        <Menu.Content placement="bottom">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>

      <Menu.Root defaultOpen>
        <Menu.Trigger>Bottom End</Menu.Trigger>
        <Menu.Content placement="bottom end">
          <Menu.Item id="item1">Menu Item 1</Menu.Item>
          <Menu.Item id="item2">Menu Item 2</Menu.Item>
          <Menu.Item id="item3">Menu Item 3</Menu.Item>
        </Menu.Content>
      </Menu.Root>
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
    <Menu.Root defaultOpen>
      <Menu.Trigger>Application Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Group>
          <Menu.GroupLabel>File Operations</Menu.GroupLabel>
          <Menu.Item id="new">
            <Menu.ItemIcon>
              <InsertDriveFile />
            </Menu.ItemIcon>
            <Menu.ItemLabel>New Document</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘N</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="open">
            <Menu.ItemIcon>
              <FolderOpen />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Open</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘O</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="save">
            <Menu.ItemIcon>
              <Save />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Save</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘S</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="save-as" isDisabled>
            <Menu.ItemIcon>
              <SaveAs />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Save As...</Menu.ItemLabel>
            <Menu.ItemDescription>
              Save document with a new name
            </Menu.ItemDescription>
            <Menu.ItemKeyboard>⌘⇧S</Menu.ItemKeyboard>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Edit Operations</Menu.GroupLabel>
          <Menu.Item id="undo">
            <Menu.ItemIcon>
              <Undo />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Undo</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘Z</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="redo">
            <Menu.ItemIcon>
              <Redo />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Redo</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘⇧Z</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="copy">
            <Menu.ItemIcon>
              <ContentCopy />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Copy</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘C</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="paste" isDisabled>
            <Menu.ItemIcon>
              <ContentPaste />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Paste</Menu.ItemLabel>
            <Menu.ItemDescription>Clipboard is empty</Menu.ItemDescription>
            <Menu.ItemKeyboard>⌘V</Menu.ItemKeyboard>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>View Options</Menu.GroupLabel>
          <Menu.Item id="zoom-in">
            <Menu.ItemIcon>
              <ZoomIn />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Zoom In</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘+</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="zoom-out">
            <Menu.ItemIcon>
              <ZoomOut />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Zoom Out</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘-</Menu.ItemKeyboard>
          </Menu.Item>
          <Menu.Item id="fullscreen">
            <Menu.ItemIcon>
              <Fullscreen />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Enter Fullscreen</Menu.ItemLabel>
            <Menu.ItemDescription>Hide all UI elements</Menu.ItemDescription>
            <Menu.ItemKeyboard>F11</Menu.ItemKeyboard>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Item Variations</Menu.GroupLabel>
          {/* Item with icon only */}
          <Menu.Item id="icon-only">
            <Menu.ItemIcon>
              <Edit />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Icon + Label</Menu.ItemLabel>
          </Menu.Item>

          {/* Item with label only (no icon) */}
          <Menu.Item id="label-only">
            <Menu.ItemLabel>Label Only</Menu.ItemLabel>
          </Menu.Item>

          {/* Item with label + description (no icon) */}
          <Menu.Item id="label-desc">
            <Menu.ItemLabel>Label + Description</Menu.ItemLabel>
            <Menu.ItemDescription>
              This item has a description but no icon
            </Menu.ItemDescription>
          </Menu.Item>

          {/* Item with label + keyboard (no icon) */}
          <Menu.Item id="label-kbd">
            <Menu.ItemLabel>Label + Keyboard</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘K</Menu.ItemKeyboard>
          </Menu.Item>

          {/* Item with icon + label + description (no keyboard) */}
          <Menu.Item id="icon-label-desc">
            <Menu.ItemIcon>
              <Help />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Icon + Label + Description</Menu.ItemLabel>
            <Menu.ItemDescription>
              This item has everything except keyboard shortcut
            </Menu.ItemDescription>
          </Menu.Item>

          {/* Item with icon + label + keyboard (no description) */}
          <Menu.Item id="icon-label-kbd">
            <Menu.ItemIcon>
              <Delete />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Icon + Label + Keyboard</Menu.ItemLabel>
            <Menu.ItemKeyboard>⌘⌫</Menu.ItemKeyboard>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>States & Behaviors</Menu.GroupLabel>
          <Menu.Item id="selected" isSelected>
            <Menu.ItemIcon>
              <Edit />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Selected Item</Menu.ItemLabel>
            <Menu.ItemDescription>
              This item is currently selected
            </Menu.ItemDescription>
            <Menu.ItemKeyboard>⌘E</Menu.ItemKeyboard>
          </Menu.Item>

          <Menu.Item id="danger" isDanger>
            <Menu.ItemIcon>
              <Delete />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Danger Item</Menu.ItemLabel>
            <Menu.ItemDescription>
              This is a destructive action
            </Menu.ItemDescription>
            <Menu.ItemKeyboard>⌘⌫</Menu.ItemKeyboard>
          </Menu.Item>

          <Menu.Item id="loading" isLoading>
            <Menu.ItemIcon>
              <Sync />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Loading Item</Menu.ItemLabel>
            <Menu.ItemDescription>
              This item is currently loading
            </Menu.ItemDescription>
          </Menu.Item>

          <Menu.Item id="disabled" isDisabled>
            <Menu.ItemIcon>
              <Backup />
            </Menu.ItemIcon>
            <Menu.ItemLabel>Disabled Item</Menu.ItemLabel>
            <Menu.ItemDescription>This item is disabled</Menu.ItemDescription>
            <Menu.ItemKeyboard>⌘B</Menu.ItemKeyboard>
          </Menu.Item>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Group>
          <Menu.GroupLabel>Submenu Examples</Menu.GroupLabel>
          {/* Single level submenu */}
          <Menu.SubmenuTrigger>
            <Menu.Item>
              <Menu.ItemIcon>
                <FolderOpen />
              </Menu.ItemIcon>
              <Menu.ItemLabel>Submenu with Icon</Menu.ItemLabel>
              <Menu.ItemDescription>This opens a submenu</Menu.ItemDescription>
              <Menu.ItemKeyboard>⌘⇧M</Menu.ItemKeyboard>
            </Menu.Item>
            <Menu.Submenu>
              <Menu.Item id="sub1">
                <Menu.ItemIcon>
                  <Edit />
                </Menu.ItemIcon>
                <Menu.ItemLabel>Submenu Item 1</Menu.ItemLabel>
              </Menu.Item>
              <Menu.Item id="sub2">
                <Menu.ItemLabel>Submenu Item 2</Menu.ItemLabel>
                <Menu.ItemDescription>No icon here</Menu.ItemDescription>
              </Menu.Item>
            </Menu.Submenu>
          </Menu.SubmenuTrigger>

          {/* Multi-level submenu - Settings */}
          <Menu.SubmenuTrigger>
            <Menu.Item>
              <Menu.ItemIcon>
                <Settings />
              </Menu.ItemIcon>
              <Menu.ItemLabel>Settings</Menu.ItemLabel>
              <Menu.ItemDescription>
                Application settings and preferences
              </Menu.ItemDescription>
            </Menu.Item>
            <Menu.Submenu>
              <Menu.Item id="general">
                <Menu.ItemIcon>
                  <Settings />
                </Menu.ItemIcon>
                <Menu.ItemLabel>General</Menu.ItemLabel>
              </Menu.Item>

              {/* Nested submenu - Account */}
              <Menu.SubmenuTrigger>
                <Menu.Item>
                  <Menu.ItemIcon>
                    <AccountCircle />
                  </Menu.ItemIcon>
                  <Menu.ItemLabel>Account</Menu.ItemLabel>
                  <Menu.ItemDescription>
                    User account settings
                  </Menu.ItemDescription>
                </Menu.Item>
                <Menu.Submenu>
                  <Menu.Item id="profile">
                    <Menu.ItemLabel>Profile</Menu.ItemLabel>
                    <Menu.ItemKeyboard>⌘P</Menu.ItemKeyboard>
                  </Menu.Item>
                  <Menu.Item id="notifications">
                    <Menu.ItemIcon>
                      <Notifications />
                    </Menu.ItemIcon>
                    <Menu.ItemLabel>Notifications</Menu.ItemLabel>
                  </Menu.Item>
                  <Menu.Item id="security" isSelected>
                    <Menu.ItemIcon>
                      <Security />
                    </Menu.ItemIcon>
                    <Menu.ItemLabel>Security</Menu.ItemLabel>
                    <Menu.ItemDescription>
                      Password and security settings
                    </Menu.ItemDescription>
                  </Menu.Item>
                </Menu.Submenu>
              </Menu.SubmenuTrigger>

              {/* Nested submenu - Appearance */}
              <Menu.SubmenuTrigger>
                <Menu.Item>
                  <Menu.ItemIcon>
                    <Palette />
                  </Menu.ItemIcon>
                  <Menu.ItemLabel>Appearance</Menu.ItemLabel>
                  <Menu.ItemDescription>
                    Theme and display options
                  </Menu.ItemDescription>
                </Menu.Item>
                <Menu.Submenu>
                  <Menu.Item id="theme">
                    <Menu.ItemLabel>Theme</Menu.ItemLabel>
                    <Menu.ItemKeyboard>⌘T</Menu.ItemKeyboard>
                  </Menu.Item>
                  <Menu.Item id="language">
                    <Menu.ItemIcon>
                      <Language />
                    </Menu.ItemIcon>
                    <Menu.ItemLabel>Language</Menu.ItemLabel>
                  </Menu.Item>

                  {/* Third level submenu - View Options */}
                  <Menu.SubmenuTrigger>
                    <Menu.Item>
                      <Menu.ItemIcon>
                        <ViewList />
                      </Menu.ItemIcon>
                      <Menu.ItemLabel>View Options</Menu.ItemLabel>
                      <Menu.ItemDescription>
                        Layout and display preferences
                      </Menu.ItemDescription>
                    </Menu.Item>
                    <Menu.Submenu>
                      <Menu.Item id="list-view">
                        <Menu.ItemIcon>
                          <ViewList />
                        </Menu.ItemIcon>
                        <Menu.ItemLabel>List View</Menu.ItemLabel>
                        <Menu.ItemKeyboard>⌘1</Menu.ItemKeyboard>
                      </Menu.Item>
                      <Menu.Item id="grid-view" isSelected>
                        <Menu.ItemIcon>
                          <ViewModule />
                        </Menu.ItemIcon>
                        <Menu.ItemLabel>Grid View</Menu.ItemLabel>
                        <Menu.ItemKeyboard>⌘2</Menu.ItemKeyboard>
                      </Menu.Item>
                      <Menu.Item id="dashboard-view">
                        <Menu.ItemIcon>
                          <Dashboard />
                        </Menu.ItemIcon>
                        <Menu.ItemLabel>Dashboard View</Menu.ItemLabel>
                        <Menu.ItemKeyboard>⌘3</Menu.ItemKeyboard>
                      </Menu.Item>
                    </Menu.Submenu>
                  </Menu.SubmenuTrigger>
                </Menu.Submenu>
              </Menu.SubmenuTrigger>

              <Menu.Separator />

              <Menu.Item id="advanced" isDisabled>
                <Menu.ItemLabel>Advanced Settings</Menu.ItemLabel>
                <Menu.ItemDescription>
                  Advanced configuration options
                </Menu.ItemDescription>
              </Menu.Item>
            </Menu.Submenu>
          </Menu.SubmenuTrigger>

          {/* Multi-level submenu - Reports */}
          <Menu.SubmenuTrigger>
            <Menu.Item>
              <Menu.ItemIcon>
                <Analytics />
              </Menu.ItemIcon>
              <Menu.ItemLabel>Reports</Menu.ItemLabel>
              <Menu.ItemDescription>
                Analytics and reporting tools
              </Menu.ItemDescription>
            </Menu.Item>
            <Menu.Submenu>
              <Menu.Item id="dashboard">
                <Menu.ItemIcon>
                  <Dashboard />
                </Menu.ItemIcon>
                <Menu.ItemLabel>Dashboard</Menu.ItemLabel>
                <Menu.ItemKeyboard>⌘D</Menu.ItemKeyboard>
              </Menu.Item>

              {/* Nested submenu - Export Options */}
              <Menu.SubmenuTrigger>
                <Menu.Item>
                  <Menu.ItemIcon>
                    <Share />
                  </Menu.ItemIcon>
                  <Menu.ItemLabel>Export</Menu.ItemLabel>
                  <Menu.ItemDescription>
                    Export data in various formats
                  </Menu.ItemDescription>
                </Menu.Item>
                <Menu.Submenu>
                  <Menu.Item id="export-pdf">
                    <Menu.ItemIcon>
                      <Download />
                    </Menu.ItemIcon>
                    <Menu.ItemLabel>Export as PDF</Menu.ItemLabel>
                    <Menu.ItemKeyboard>⌘⇧P</Menu.ItemKeyboard>
                  </Menu.Item>
                  <Menu.Item id="export-csv">
                    <Menu.ItemIcon>
                      <Download />
                    </Menu.ItemIcon>
                    <Menu.ItemLabel>Export as CSV</Menu.ItemLabel>
                    <Menu.ItemKeyboard>⌘⇧C</Menu.ItemKeyboard>
                  </Menu.Item>
                  <Menu.Item id="export-json" isLoading>
                    <Menu.ItemIcon>
                      <Download />
                    </Menu.ItemIcon>
                    <Menu.ItemLabel>Export as JSON</Menu.ItemLabel>
                    <Menu.ItemDescription>
                      Preparing export...
                    </Menu.ItemDescription>
                  </Menu.Item>
                </Menu.Submenu>
              </Menu.SubmenuTrigger>

              {/* Nested submenu - Import Options */}
              <Menu.SubmenuTrigger>
                <Menu.Item>
                  <Menu.ItemIcon>
                    <Upload />
                  </Menu.ItemIcon>
                  <Menu.ItemLabel>Import</Menu.ItemLabel>
                  <Menu.ItemDescription>
                    Import data from external sources
                  </Menu.ItemDescription>
                </Menu.Item>
                <Menu.Submenu>
                  <Menu.Item id="import-csv">
                    <Menu.ItemIcon>
                      <Upload />
                    </Menu.ItemIcon>
                    <Menu.ItemLabel>Import CSV</Menu.ItemLabel>
                  </Menu.Item>
                  <Menu.Item id="import-json">
                    <Menu.ItemIcon>
                      <Upload />
                    </Menu.ItemIcon>
                    <Menu.ItemLabel>Import JSON</Menu.ItemLabel>
                  </Menu.Item>
                  <Menu.Item id="import-xml" isDisabled>
                    <Menu.ItemIcon>
                      <Upload />
                    </Menu.ItemIcon>
                    <Menu.ItemLabel>Import XML</Menu.ItemLabel>
                    <Menu.ItemDescription>
                      Feature not available
                    </Menu.ItemDescription>
                  </Menu.Item>
                </Menu.Submenu>
              </Menu.SubmenuTrigger>

              <Menu.Separator />

              <Menu.Item id="custom-report" isDanger>
                <Menu.ItemIcon>
                  <Report />
                </Menu.ItemIcon>
                <Menu.ItemLabel>Delete Custom Reports</Menu.ItemLabel>
                <Menu.ItemDescription>
                  Remove all custom report configurations
                </Menu.ItemDescription>
              </Menu.Item>
            </Menu.Submenu>
          </Menu.SubmenuTrigger>
        </Menu.Group>

        <Menu.Separator />

        <Menu.Item href="/help" target="_blank" rel="noopener">
          <Menu.ItemIcon>
            <Help />
          </Menu.ItemIcon>
          <Menu.ItemLabel>Help & Support</Menu.ItemLabel>
          <Menu.ItemDescription>Open help documentation</Menu.ItemDescription>
        </Menu.Item>

        <Menu.Item id="logout">
          <Menu.ItemIcon>
            <Logout />
          </Menu.ItemIcon>
          <Menu.ItemLabel>Logout</Menu.ItemLabel>
          <Menu.ItemDescription>Sign out of your account</Menu.ItemDescription>
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
        <Menu.Content isLoading>
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
      <Menu.Root defaultOpen>
        <Menu.Trigger>View Options</Menu.Trigger>
        <Menu.Content
          selectionMode="single"
          selectedKeys={new Set([selectedKey])}
          onSelectionChange={(keys) => {
            if (keys !== "all") {
              const newKey = Array.from(keys)[0] as string;
              setSelectedKey(newKey);
            }
          }}
        >
          <Menu.Group>
            <Menu.GroupLabel>Text Size</Menu.GroupLabel>
            <Menu.Item id="small" isSelected={selectedKey === "small"}>
              <Menu.ItemLabel>Small</Menu.ItemLabel>
              <Menu.ItemDescription>Compact text display</Menu.ItemDescription>
            </Menu.Item>
            <Menu.Item id="medium" isSelected={selectedKey === "medium"}>
              <Menu.ItemLabel>Medium</Menu.ItemLabel>
              <Menu.ItemDescription>Default text size</Menu.ItemDescription>
            </Menu.Item>
            <Menu.Item id="large" isSelected={selectedKey === "large"}>
              <Menu.ItemLabel>Large</Menu.ItemLabel>
              <Menu.ItemDescription>
                Larger text for better readability
              </Menu.ItemDescription>
            </Menu.Item>
          </Menu.Group>

          <Menu.Separator />

          <Menu.Group>
            <Menu.GroupLabel>Theme</Menu.GroupLabel>
            <Menu.Item id="light">
              <Menu.ItemLabel>Light Mode</Menu.ItemLabel>
              <Menu.ItemDescription>
                Light background with dark text
              </Menu.ItemDescription>
            </Menu.Item>
            <Menu.Item id="dark">
              <Menu.ItemLabel>Dark Mode</Menu.ItemLabel>
              <Menu.ItemDescription>
                Dark background with light text
              </Menu.ItemDescription>
            </Menu.Item>
            <Menu.Item id="auto">
              <Menu.ItemLabel>Auto</Menu.ItemLabel>
              <Menu.ItemDescription>
                Follow system preference
              </Menu.ItemDescription>
            </Menu.Item>
          </Menu.Group>
        </Menu.Content>
      </Menu.Root>
    );
  },
};

export const MultiSelection: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
      new Set(["notifications", "updates"])
    );

    return (
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <Menu.ItemLabel>Email Settings</Menu.ItemLabel>
          <Menu.ItemDescription>
            {selectedKeys.size} option{selectedKeys.size !== 1 ? "s" : ""}{" "}
            selected
          </Menu.ItemDescription>
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
              <Menu.ItemIcon>
                <Notifications />
              </Menu.ItemIcon>
              <Menu.ItemLabel>Notifications</Menu.ItemLabel>
              <Menu.ItemDescription>
                Receive notifications about important events
              </Menu.ItemDescription>
            </Menu.Item>
            <Menu.Item id="updates" isSelected={selectedKeys.has("updates")}>
              <Menu.ItemIcon>
                <Sync />
              </Menu.ItemIcon>
              <Menu.ItemLabel>Product Updates</Menu.ItemLabel>
              <Menu.ItemDescription>
                Get notified about new features and improvements
              </Menu.ItemDescription>
            </Menu.Item>
            <Menu.Item
              id="marketing"
              isSelected={selectedKeys.has("marketing")}
            >
              <Menu.ItemIcon>
                <Analytics />
              </Menu.ItemIcon>
              <Menu.ItemLabel>Marketing</Menu.ItemLabel>
              <Menu.ItemDescription>
                Receive promotional emails and offers
              </Menu.ItemDescription>
            </Menu.Item>
            <Menu.Item id="security" isSelected={selectedKeys.has("security")}>
              <Menu.ItemIcon>
                <Security />
              </Menu.ItemIcon>
              <Menu.ItemLabel>Security Alerts</Menu.ItemLabel>
              <Menu.ItemDescription>
                Important security notifications
              </Menu.ItemDescription>
            </Menu.Item>
          </Menu.Group>

          <Menu.Separator />

          <Menu.Group>
            <Menu.GroupLabel>Content Preferences</Menu.GroupLabel>
            <Menu.Item
              id="newsletters"
              isSelected={selectedKeys.has("newsletters")}
            >
              <Menu.ItemIcon>
                <Report />
              </Menu.ItemIcon>
              <Menu.ItemLabel>Newsletters</Menu.ItemLabel>
              <Menu.ItemDescription>
                Weekly digest of articles and insights
              </Menu.ItemDescription>
            </Menu.Item>
            <Menu.Item id="tips" isSelected={selectedKeys.has("tips")}>
              <Menu.ItemIcon>
                <Help />
              </Menu.ItemIcon>
              <Menu.ItemLabel>Tips & Tricks</Menu.ItemLabel>
              <Menu.ItemDescription>
                Helpful tips to get the most out of the platform
              </Menu.ItemDescription>
            </Menu.Item>
          </Menu.Group>
        </Menu.Content>
      </Menu.Root>
    );
  },
};
