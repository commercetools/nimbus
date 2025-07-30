import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within, waitFor } from "storybook/test";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { IconToggleButton } from "../icon-toggle-button";
import { ToggleButtonGroup } from "../toggle-button-group";
import { Icon } from "../icon";
import { Menu } from "../menu";
import { Box, Text } from "@/components";
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
  Undo,
  Redo,
  FormatListBulleted,
  FormatListNumbered,
  FormatStrikethrough,
  KeyboardArrowDown,
  Logout,
} from "@commercetools/nimbus-icons";
import { useState } from "react";

const meta: Meta<typeof Toolbar.Root> = {
  title: "Components / Toolbar",
  component: Toolbar.Root,
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
    <Toolbar.Root {...args} data-testid="toolbar">
      <Button size="xs" variant="ghost" data-testid="action-1">
        File
      </Button>
      <Button size="xs" variant="ghost" data-testid="action-2">
        Edit
      </Button>
      <Button size="xs" variant="ghost" data-testid="action-3">
        View
      </Button>
    </Toolbar.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify toolbar is present and accessible", async () => {
      const toolbar = canvas.getByTestId("toolbar");
      await expect(toolbar).toBeInTheDocument();
      await expect(toolbar).toHaveAttribute("role", "toolbar");
    });

    await step("Test keyboard navigation with Arrow keys", async () => {
      const action1 = canvas.getByTestId("action-1");
      const action2 = canvas.getByTestId("action-2");
      const action3 = canvas.getByTestId("action-3");

      // Focus first button
      await userEvent.click(action1);
      await expect(action1).toHaveFocus();

      // Test arrow key navigation managed by toolbar
      await userEvent.keyboard("{ArrowRight}");
      await expect(action2).toHaveFocus();

      await userEvent.keyboard("{ArrowRight}");
      await expect(action3).toHaveFocus();

      // Navigate backwards
      await userEvent.keyboard("{ArrowLeft}");
      await expect(action2).toHaveFocus();

      await userEvent.keyboard("{ArrowLeft}");
      await expect(action1).toHaveFocus();
    });
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args: any) => (
    <Toolbar.Root {...args} data-testid="vertical-toolbar">
      <IconButton
        size="xs"
        variant="ghost"
        aria-label="Home"
        data-testid="home-btn"
      >
        <Icon as={Home} />
      </IconButton>
      <Toolbar.Separator />
      <IconButton
        size="xs"
        variant="ghost"
        aria-label="Search"
        data-testid="search-btn"
      >
        <Icon as={Search} />
      </IconButton>
      <IconButton
        size="xs"
        variant="ghost"
        aria-label="Settings"
        data-testid="settings-btn"
      >
        <Icon as={Settings} />
      </IconButton>
      <IconButton
        size="xs"
        variant="ghost"
        aria-label="Profile"
        data-testid="profile-btn"
      >
        <Icon as={Person} />
      </IconButton>
      <Toolbar.Separator />
      <IconButton
        size="xs"
        variant="ghost"
        aria-label="Logout"
        data-testid="logout-btn"
      >
        <Icon as={Logout} />
      </IconButton>
    </Toolbar.Root>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Test arrow key navigation in vertical toolbar", async () => {
      const homeBtn = canvas.getByTestId("home-btn");
      const searchBtn = canvas.getByTestId("search-btn");
      const settingsBtn = canvas.getByTestId("settings-btn");
      const profileBtn = canvas.getByTestId("profile-btn");
      const logoutBtn = canvas.getByTestId("logout-btn");

      // Focus first button
      await userEvent.click(homeBtn);
      await expect(homeBtn).toHaveFocus();

      // Navigate with up/down arrows
      await userEvent.keyboard("{ArrowDown}");
      await expect(searchBtn).toHaveFocus();

      await userEvent.keyboard("{ArrowDown}");
      await expect(settingsBtn).toHaveFocus();

      await userEvent.keyboard("{ArrowDown}");
      await expect(profileBtn).toHaveFocus();

      await userEvent.keyboard("{ArrowDown}");
      await expect(logoutBtn).toHaveFocus();

      // Navigate backwards
      await userEvent.keyboard("{ArrowUp}");
      await expect(profileBtn).toHaveFocus();

      await userEvent.keyboard("{ArrowUp}");
      await expect(settingsBtn).toHaveFocus();
    });

    await step(
      "Verify horizontal keyboard arrows don't interfere",
      async () => {
        const homeBtn = canvas.getByTestId("home-btn");

        await userEvent.click(homeBtn);
        await expect(homeBtn).toHaveFocus();

        // Horizontal arrows shouldn't move focus in vertical toolbar
        await userEvent.keyboard("{ArrowLeft}");
        await expect(homeBtn).toHaveFocus();

        await userEvent.keyboard("{ArrowRight}");
        await expect(homeBtn).toHaveFocus();
      }
    );

    await step("Verify toolbar accessibility", async () => {
      const toolbar = canvas.getByTestId("vertical-toolbar");
      await expect(toolbar).toHaveAttribute("role", "toolbar");
      await expect(toolbar).toHaveAttribute("aria-orientation", "vertical");
    });
  },
};

export const WithGroups: Story = {
  args: {},
  render: (args: any) => (
    <Box>
      {["horizontal", "vertical"].map((o) => (
        <Box key={o} mb="600">
          <Toolbar.Root orientation={o} {...args} data-testid={`toolbar-${o}`}>
            <Toolbar.Group data-testid={`file-group-${o}`}>
              <IconButton
                size="xs"
                variant="ghost"
                aria-label="New"
                data-testid={`new-btn-${o}`}
              >
                <Icon as={Add} />
              </IconButton>
              <IconButton
                size="xs"
                variant="ghost"
                aria-label="Open"
                data-testid={`open-btn-${o}`}
              >
                <Icon as={FolderOpen} />
              </IconButton>
            </Toolbar.Group>
            <Toolbar.Separator
              orientation="horizontal"
              data-testid={`separator-1-${o}`}
            />
            <Toolbar.Group data-testid={`edit-group-${o}`}>
              <IconButton
                size="xs"
                variant="ghost"
                aria-label="Save"
                data-testid={`save-btn-${o}`}
              >
                <Icon as={Save} />
              </IconButton>
              <IconButton
                size="xs"
                variant="ghost"
                aria-label="Print"
                data-testid={`print-btn-${o}`}
              >
                <Icon as={Print} />
              </IconButton>
            </Toolbar.Group>
          </Toolbar.Root>
        </Box>
      ))}
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Verify groups and separators are present", async () => {
      // Test horizontal toolbar
      const horizontalToolbar = canvas.getByTestId("toolbar-horizontal");
      const horizontalFileGroup = canvas.getByTestId("file-group-horizontal");
      const horizontalEditGroup = canvas.getByTestId("edit-group-horizontal");
      const horizontalSeparator = canvas.getByTestId("separator-1-horizontal");

      await expect(horizontalToolbar).toBeInTheDocument();
      await expect(horizontalFileGroup).toBeInTheDocument();
      await expect(horizontalEditGroup).toBeInTheDocument();
      await expect(horizontalSeparator).toBeInTheDocument();

      // Test vertical toolbar
      const verticalToolbar = canvas.getByTestId("toolbar-vertical");
      const verticalFileGroup = canvas.getByTestId("file-group-vertical");
      const verticalEditGroup = canvas.getByTestId("edit-group-vertical");
      const verticalSeparator = canvas.getByTestId("separator-1-vertical");

      await expect(verticalToolbar).toBeInTheDocument();
      await expect(verticalFileGroup).toBeInTheDocument();
      await expect(verticalEditGroup).toBeInTheDocument();
      await expect(verticalSeparator).toBeInTheDocument();
    });
  },
};

export const Variants: Story = {
  args: {},
  render: (args: any) => (
    <Box>
      {(["plain", "outline"] as const).map((variant) => (
        <Box key={variant} mb="300">
          <Text textStyle="sm" mb="200" color="neutral.11">
            Variant: {variant}
          </Text>
          <Toolbar.Root
            size="xs"
            variant={variant}
            orientation="horizontal"
            {...args}
            data-testid={`toolbar-${variant}-horizontal`}
            aria-label={`${variant} horizontal toolbar`}
          >
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="New"
              data-testid={`new-btn-${variant}`}
            >
              <Icon as={Add} />
            </IconButton>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Save"
              data-testid={`save-btn-${variant}`}
            >
              <Icon as={Save} />
            </IconButton>
            <Toolbar.Separator data-testid={`separator-${variant}`} />
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Print"
              data-testid={`print-btn-${variant}`}
            >
              <Icon as={Print} />
            </IconButton>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Settings"
              data-testid={`settings-btn-${variant}`}
            >
              <Icon as={Settings} />
            </IconButton>
          </Toolbar.Root>
        </Box>
      ))}
    </Box>
  ),
};

export const RichTextEditor: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args: any) => {
    const [textStyle, setTextStyle] = useState("h1");
    const textStyles = [
      {
        id: "h1",
        label: "Heading 1",
        props: {
          textStyle: "2xl",
          fontWeight: "700",
        },
      },
      {
        id: "h2",
        label: "Heading 2",
        props: {
          textStyle: "xl",
          fontWeight: "600",
        },
      },
      {
        id: "h3",
        label: "Heading 3",
        props: {
          textStyle: "lg",
          fontWeight: "500",
        },
      },
      {
        id: "h4",
        label: "Heading 4",
        props: {
          textStyle: "md",
          fontWeight: "500",
        },
      },
      {
        id: "p",
        label: "Paragraph",
        props: {
          textStyle: "md",
          color: "neutral.11",
        },
      },
    ];

    const selectedTextStyle = textStyles.find((v) => v.id === textStyle);
    const selectedTextStyleProps = selectedTextStyle?.props || {};
    const selectedTextStyleLabel = selectedTextStyle?.label || "";

    const sizes = ["xs", "md"] as const;

    return (
      <Box>
        {sizes.map((size) => (
          <Box mb="600" key={size}>
            <Text textStyle="xl" mb="300">
              {size}
            </Text>
            <Toolbar.Root
              size={size}
              {...args}
              data-testid={`rich-toolbar-${size}`}
              aria-label="Text formatting"
            >
              {/* Font Style & Size */}
              <Menu.Root onAction={(v) => setTextStyle(String(v))}>
                <Menu.Trigger
                  borderRadius="200"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="neutral.6"
                  width="160px"
                  data-testid={`menu-trigger-${size}`}
                  aria-label="Text style menu"
                >
                  <Box display="flex" alignItems="center" gap="200" px="200">
                    <Box
                      display="flex"
                      alignItems="center"
                      gap="200"
                      flexGrow="1"
                    >
                      <Text my="auto" {...selectedTextStyleProps}>
                        {selectedTextStyleLabel}
                      </Text>
                    </Box>
                    <Icon>
                      <KeyboardArrowDown />
                    </Icon>
                  </Box>
                </Menu.Trigger>
                <Menu.Content data-testid={`menu-content-${size}`}>
                  {textStyles.map((v) => (
                    <Menu.Item
                      key={v.id}
                      id={v.id}
                      data-testid={`menu-item-${v.id}-${size}`}
                    >
                      <Text {...v.props}>{v.label}</Text>
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Root>
              <Toolbar.Separator data-testid={`separator-1-${size}`} />

              {/* Text Formatting Toggles */}
              <Toolbar.Group data-testid={`format-group-${size}`}>
                <IconToggleButton
                  size={size}
                  variant="ghost"
                  aria-label="Bold"
                  data-testid={`bold-btn-${size}`}
                >
                  <Icon as={FormatBold} />
                </IconToggleButton>
                <IconToggleButton
                  size={size}
                  variant="ghost"
                  aria-label="Italic"
                  data-testid={`italic-btn-${size}`}
                >
                  <Icon as={FormatItalic} />
                </IconToggleButton>
                <IconToggleButton
                  size={size}
                  variant="ghost"
                  aria-label="Underline"
                  data-testid={`underline-btn-${size}`}
                >
                  <Icon as={FormatUnderlined} />
                </IconToggleButton>
                <IconToggleButton
                  size={size}
                  variant="ghost"
                  aria-label="Strikethrough"
                  data-testid={`strikethrough-btn-${size}`}
                >
                  <Icon as={FormatStrikethrough} />
                </IconToggleButton>
              </Toolbar.Group>
              <Toolbar.Separator data-testid={`separator-2-${size}`} />

              {/* Text Alignment Toggle Group */}
              <Toolbar.Group data-testid={`alignment-group-${size}`}>
                <ToggleButtonGroup.Root
                  size={size}
                  selectionMode="single"
                  defaultSelectedKeys={["left"]}
                  aria-label="Text alignment"
                  data-testid={`alignment-toggle-group-${size}`}
                >
                  <IconToggleButton
                    id="left"
                    size={size}
                    variant="ghost"
                    aria-label="Align Left"
                    data-testid={`align-left-${size}`}
                  >
                    <Icon as={FormatAlignLeft} />
                  </IconToggleButton>
                  <IconToggleButton
                    id="center"
                    size={size}
                    variant="ghost"
                    aria-label="Align Center"
                    data-testid={`align-center-${size}`}
                  >
                    <Icon as={FormatAlignCenter} />
                  </IconToggleButton>
                  <IconToggleButton
                    id="right"
                    size={size}
                    variant="ghost"
                    aria-label="Align Right"
                    data-testid={`align-right-${size}`}
                  >
                    <Icon as={FormatAlignRight} />
                  </IconToggleButton>
                </ToggleButtonGroup.Root>
              </Toolbar.Group>
              <Toolbar.Separator data-testid={`separator-3-${size}`} />

              {/* Lists & Indentation */}
              <ToggleButtonGroup.Root
                selectionMode="single"
                defaultSelectedKeys={[]}
                size={size}
                data-testid={`list-toggle-group-${size}`}
                aria-label="List formatting"
              >
                <IconToggleButton
                  id="bulleted-list"
                  size={size}
                  variant="ghost"
                  aria-label="Bulleted List"
                  data-testid={`bulleted-list-${size}`}
                >
                  <Icon as={FormatListBulleted} />
                </IconToggleButton>
                <IconToggleButton
                  id="numbered-list"
                  size={size}
                  variant="ghost"
                  aria-label="Numbered List"
                  data-testid={`numbered-list-${size}`}
                >
                  <Icon as={FormatListNumbered} />
                </IconToggleButton>
              </ToggleButtonGroup.Root>
              <Toolbar.Separator data-testid={`separator-4-${size}`} />

              <Toolbar.Group data-testid={`history-group-${size}`}>
                <IconButton
                  size="xs"
                  variant="ghost"
                  aria-label="Undo"
                  isDisabled
                  data-testid={`undo-btn-${size}`}
                >
                  <Icon as={Undo} />
                </IconButton>
                <IconButton
                  size="xs"
                  variant="ghost"
                  aria-label="Redo"
                  data-testid={`redo-btn-${size}`}
                >
                  <Icon as={Redo} />
                </IconButton>
              </Toolbar.Group>
            </Toolbar.Root>
          </Box>
        ))}
      </Box>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const size = "md"; // Test with md size for better visibility

    // Get elements
    const menuTrigger = canvas.getByTestId(`menu-trigger-${size}`);
    const boldBtn = canvas.getByTestId(`bold-btn-${size}`);

    await step("Open Menu and select an item", async () => {
      // Step 1: Open menu
      await userEvent.click(menuTrigger);

      // Step 2: Select h2
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{Enter}");

      await waitFor(async () => {
        await expect(menuTrigger).toHaveFocus();
      });
    });

    await step("Toolbar is still navigable", async () => {
      await waitFor(async () => {
        // Step 3: Test arrow navigation to the bold button
        await userEvent.keyboard("{ArrowRight}");
        await expect(boldBtn).toHaveFocus();
      });

      await userEvent.keyboard("{ArrowLeft}");
      await expect(menuTrigger).toHaveFocus();
    });
  },
};
