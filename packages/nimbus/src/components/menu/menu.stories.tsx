import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu } from "./index";
import { Box, Button, Icon, IconButton, Kbd, Text } from "@/components";
import {
  MoreVert,
  KeyboardArrowDown,
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
      <Menu.Trigger>Edit Menu</Menu.Trigger>
      <Menu.Content>
        <Menu.Item id="undo">
          <Text slot="label">Undo</Text>
          <Text slot="description">Undo the last action</Text>
          <Kbd slot="keyboard">⌘Z</Kbd>
        </Menu.Item>
        <Menu.Item id="redo">
          <Text slot="label">Redo</Text>
          <Text slot="description">Redo the last undone action</Text>
          <Kbd slot="keyboard">⌘Y</Kbd>
        </Menu.Item>

        <Menu.Separator />

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
          <Text slot="description">Paste from clipboard</Text>
          <Kbd slot="keyboard">⌘V</Kbd>
        </Menu.Item>

        <Menu.Separator />

        <Menu.Item id="select-all">
          <Text slot="label">Select All</Text>
          <Text slot="description">Select all content</Text>
          <Kbd slot="keyboard">⌘A</Kbd>
        </Menu.Item>
        <Menu.Item id="delete" isCritical>
          <Text slot="label">Delete</Text>
          <Text slot="description">Delete the selected text</Text>
          <Kbd slot="keyboard">⌫</Kbd>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
};

export const TriggerVariations: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="24px">
      {/* Button Triggers */}
      <Box>
        <Text fontWeight="semibold" marginBottom="8px">
          Button Triggers
        </Text>
        <Box display="flex" gap="16px" alignItems="center">
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="solid" tone="primary">
                <KeyboardArrowDown />
                Primary
              </Button>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item id="action1">Action 1</Menu.Item>
              <Menu.Item id="action2">Action 2</Menu.Item>
              <Menu.Item id="action3">Action 3</Menu.Item>
            </Menu.Content>
          </Menu.Root>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="outline" colorPalette="primary">
                <KeyboardArrowDown />
                Outline
              </Button>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item id="action1">Action 1</Menu.Item>
              <Menu.Item id="action2">Action 2</Menu.Item>
              <Menu.Item id="action3">Action 3</Menu.Item>
            </Menu.Content>
          </Menu.Root>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button variant="ghost" colorPalette="primary">
                <KeyboardArrowDown />
                Ghost
              </Button>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item id="action1">Action 1</Menu.Item>
              <Menu.Item id="action2">Action 2</Menu.Item>
              <Menu.Item id="action3">Action 3</Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </Box>
      </Box>

      {/* IconButton Triggers */}
      <Box>
        <Text fontWeight="semibold" marginBottom="8px">
          IconButton Triggers
        </Text>
        <Box display="flex" gap="16px" alignItems="center">
          <Menu.Root>
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
              <Menu.Item id="delete" isCritical>
                Delete
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>

          <Menu.Root>
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

          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton
                variant="outline"
                colorPalette="primary"
                aria-label="Outline actions"
              >
                <MoreVert />
              </IconButton>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item id="settings">Settings</Menu.Item>
              <Menu.Item id="help">Help</Menu.Item>
              <Menu.Item id="about">About</Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </Box>
      </Box>

      {/* Default Trigger */}
      <Box>
        <Text fontWeight="semibold" marginBottom="8px">
          Default Trigger
        </Text>
        <Menu.Root>
          <Menu.Trigger>Default Menu Trigger</Menu.Trigger>
          <Menu.Content>
            <Menu.Item id="item1">Item 1</Menu.Item>
            <Menu.Item id="item2">Item 2</Menu.Item>
            <Menu.Item id="item3">Item 3</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </Box>
    </Box>
  ),
};

export const WithDifferentPlacements: Story = {
  render: () => {
    const placements = [
      { placement: "top start", col: "1", row: "1" },
      { placement: "top", col: "2", row: "1" },
      { placement: "top end", col: "3", row: "1" },
      { placement: "left", col: "1", row: "2" },
      { placement: "right", col: "3", row: "2" },
      { placement: "bottom start", col: "1", row: "3" },
      { placement: "bottom", col: "2", row: "3" },
      { placement: "bottom end", col: "3", row: "3" },
    ];

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="800px"
        width="100%"
        padding="200px"
        background="#f5f5f5"
        position="relative"
        overflow="auto"
      >
        {/* Central grid layout for better placement visualization */}
        <Box
          display="grid"
          gridTemplateColumns="200px 200px 200px"
          gridTemplateRows="100px 100px 100px"
          gap="40px"
          position="relative"
        >
          {placements.map(({ placement, col, row }) => (
            <Box
              key={placement}
              gridColumn={col}
              gridRow={row}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Menu.Root placement={placement as any}>
                <Menu.Trigger asChild>
                  <Button variant="solid" tone="primary" size="xs">
                    {placement}
                  </Button>
                </Menu.Trigger>
                <Menu.Content>
                  <Menu.Item id="item1">Menu Item 1</Menu.Item>
                  <Menu.Item id="item2">Menu Item 2</Menu.Item>
                  <Menu.Item id="item3">Menu Item 3</Menu.Item>
                </Menu.Content>
              </Menu.Root>
            </Box>
          ))}

          {/* Center reference */}
          <Box
            gridColumn="2"
            gridRow="2"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box border="2px dashed #ccc" padding="20px" borderRadius="8px">
              <Text color="#666" fontSize="14px" textAlign="center">
                Center Reference
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Instructions */}
        <Box
          position="absolute"
          top="20px"
          left="50%"
          transform="translateX(-50%)"
          textAlign="center"
        >
          <Text fontSize="16px" fontWeight="600" color="#333">
            Menu Placement Examples
          </Text>
          <Text fontSize="14px" color="#666" marginTop="8px">
            Click each button to see the menu placement. The layout provides
            enough space to prevent fallback positions.
          </Text>
        </Box>
      </Box>
    );
  },
};

export const SelectionModes: Story = {
  render: () => {
    const [singleSelection, setSingleSelection] =
      React.useState<string>("medium");
    const [multiSelection, setMultiSelection] = React.useState<Set<string>>(
      new Set(["bold", "italic"])
    );

    return (
      <Box display="flex" flexDirection="column" gap="32px">
        {/* Single Selection */}
        <Box>
          <Text fontWeight="semibold" marginBottom="8px">
            Single Selection Mode
          </Text>
          <Text fontSize="sm" color="gray.600" marginBottom="16px">
            Only one item can be selected at a time
          </Text>
          <Box display="flex" gap="16px">
            <Menu.Root
              selectionMode="single"
              selectedKeys={new Set([singleSelection])}
              onSelectionChange={(keys) => {
                if (keys !== "all") {
                  const newKey = Array.from(keys)[0] as string;
                  setSingleSelection(newKey);
                }
              }}
            >
              <Menu.Trigger>
                <Text slot="label">Text Size</Text>
                <Text slot="description">Currently: {singleSelection}</Text>
              </Menu.Trigger>
              <Menu.Content>
                <Menu.Group>
                  <Menu.GroupLabel>Choose text size</Menu.GroupLabel>
                  <Menu.Item
                    id="small"
                    isSelected={singleSelection === "small"}
                  >
                    <Text slot="label">Small</Text>
                    <Text slot="description">Compact text display</Text>
                  </Menu.Item>
                  <Menu.Item
                    id="medium"
                    isSelected={singleSelection === "medium"}
                  >
                    <Text slot="label">Medium</Text>
                    <Text slot="description">Default text size</Text>
                  </Menu.Item>
                  <Menu.Item
                    id="large"
                    isSelected={singleSelection === "large"}
                  >
                    <Text slot="label">Large</Text>
                    <Text slot="description">Larger text for readability</Text>
                  </Menu.Item>
                </Menu.Group>
              </Menu.Content>
            </Menu.Root>

            <Box padding="8px" background="gray.100" borderRadius="md">
              <Text fontSize="sm">Selected: {singleSelection}</Text>
            </Box>
          </Box>
        </Box>

        {/* Multiple Selection */}
        <Box>
          <Text fontWeight="semibold" marginBottom="8px">
            Multiple Selection Mode
          </Text>
          <Text fontSize="sm" color="gray.600" marginBottom="16px">
            Multiple items can be selected with checkboxes
          </Text>
          <Box display="flex" gap="16px">
            <Menu.Root
              selectionMode="multiple"
              selectedKeys={multiSelection}
              onSelectionChange={(keys) => {
                if (keys !== "all") {
                  setMultiSelection(new Set(Array.from(keys) as string[]));
                }
              }}
            >
              <Menu.Trigger>
                <Text slot="label">Text Formatting</Text>
                <Text slot="description">
                  {multiSelection.size} option
                  {multiSelection.size !== 1 ? "s" : ""} selected
                </Text>
              </Menu.Trigger>
              <Menu.Content>
                <Menu.Group>
                  <Menu.GroupLabel>Formatting Options</Menu.GroupLabel>
                  <Menu.Item id="bold" isSelected={multiSelection.has("bold")}>
                    <Icon slot="icon">
                      <Edit />
                    </Icon>
                    <Text slot="label">Bold</Text>
                    <Text slot="description">Make text bold</Text>
                  </Menu.Item>
                  <Menu.Item
                    id="italic"
                    isSelected={multiSelection.has("italic")}
                  >
                    <Icon slot="icon">
                      <Edit />
                    </Icon>
                    <Text slot="label">Italic</Text>
                    <Text slot="description">Make text italic</Text>
                  </Menu.Item>
                  <Menu.Item
                    id="underline"
                    isSelected={multiSelection.has("underline")}
                  >
                    <Icon slot="icon">
                      <Edit />
                    </Icon>
                    <Text slot="label">Underline</Text>
                    <Text slot="description">Underline text</Text>
                  </Menu.Item>
                  <Menu.Item
                    id="strikethrough"
                    isSelected={multiSelection.has("strikethrough")}
                  >
                    <Icon slot="icon">
                      <Edit />
                    </Icon>
                    <Text slot="label">Strikethrough</Text>
                    <Text slot="description">Strike through text</Text>
                  </Menu.Item>
                </Menu.Group>
              </Menu.Content>
            </Menu.Root>

            <Box padding="8px" background="gray.100" borderRadius="md">
              <Text fontSize="sm">
                Selected: {Array.from(multiSelection).join(", ") || "None"}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* No Selection Mode (Default) */}
        <Box>
          <Text fontWeight="semibold" marginBottom="8px">
            No Selection Mode (Default)
          </Text>
          <Text fontSize="sm" color="gray.600" marginBottom="16px">
            Standard menu without selection state
          </Text>
          <Menu.Root>
            <Menu.Trigger>Standard Actions</Menu.Trigger>
            <Menu.Content>
              <Menu.Item id="save">Save</Menu.Item>
              <Menu.Item id="save-as">Save As...</Menu.Item>
              <Menu.Item id="export">Export</Menu.Item>
              <Menu.Separator />
              <Menu.Item id="delete" isCritical>
                Delete
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </Box>
      </Box>
    );
  },
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
            <Text slot="description">Save document with a new name</Text>
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
            <Text slot="description">This item is currently selected</Text>
            <Kbd slot="keyboard">⌘E</Kbd>
          </Menu.Item>

          <Menu.Item id="critical" isCritical>
            <Icon slot="icon">
              <Delete />
            </Icon>
            <Text slot="label">Critical Item</Text>
            <Text slot="description">This is a destructive action</Text>
            <Kbd slot="keyboard">⌘⌫</Kbd>
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
                  <Text slot="description">User account settings</Text>
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
                  <Text slot="description">Theme and display options</Text>
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
                <Text slot="description">Advanced configuration options</Text>
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
              <Text slot="description">Analytics and reporting tools</Text>
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
                  <Text slot="description">Export data in various formats</Text>
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
                  <Menu.Item id="export-json">
                    <Icon slot="icon">
                      <Download />
                    </Icon>
                    <Text slot="label">Export as JSON</Text>
                    <Text slot="description">Preparing export...</Text>
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
                    <Text slot="description">Feature not available</Text>
                  </Menu.Item>
                </Menu.Submenu>
              </Menu.SubmenuTrigger>

              <Menu.Separator />

              <Menu.Item id="custom-report" isCritical>
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

        <Menu.Group>
          <Menu.GroupLabel>Trigger Props Examples</Menu.GroupLabel>
          {/* Nested submenu for trigger props */}
          <Menu.SubmenuTrigger>
            <Menu.Item>
              <Icon slot="icon">
                <Settings />
              </Icon>
              <Text slot="label">Trigger Types</Text>
              <Text slot="description">Different trigger behaviors</Text>
            </Menu.Item>
            <Menu.Submenu>
              <Menu.Item id="press-trigger">
                <Text slot="label">Press Trigger</Text>
                <Text slot="description">Opens on press (default)</Text>
              </Menu.Item>
              <Menu.Item id="longpress-info">
                <Text slot="label">Long Press Info</Text>
                <Text slot="description">
                  Root menu can use trigger="longPress"
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
          <Menu.Submenu>
            <Menu.Item id="advanced-1">Advanced Option 1</Menu.Item>
            <Menu.Item id="advanced-2">Advanced Option 2</Menu.Item>

            <Menu.SubmenuTrigger>
              <Menu.Item>More Settings</Menu.Item>
              <Menu.Submenu>
                <Menu.Item id="deep-1">
                  Deep Setting 1 (uses root handler)
                </Menu.Item>
                <Menu.Item id="deep-2">
                  Deep Setting 2 (uses root handler)
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
