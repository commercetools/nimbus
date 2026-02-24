import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fireEvent } from "storybook/test";
import { useState } from "react";
import {
  Button,
  Code,
  Drawer,
  FormField,
  Kbd,
  PasswordInput,
  Select,
  Separator,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@commercetools/nimbus";

const meta: Meta<typeof Drawer.Root> = {
  title: "Components/Overlay/Drawer",
  component: Drawer.Root,
  tags: ["autodocs"],
  parameters: {
    chromatic: { delay: 500 },
  },
  argTypes: {
    placement: {
      control: { type: "select" },
      options: ["left", "right", "top", "bottom"],
      description: "Position of the drawer relative to the viewport",
    },
    showBackdrop: {
      control: { type: "boolean" },
      description: "Whether to show the backdrop overlay behind the drawer",
    },
    isOpen: {
      control: { type: "boolean" },
      description: "Whether the drawer is open (controlled mode)",
    },
    defaultOpen: {
      control: { type: "boolean" },
      description: "Whether the drawer is open by default (uncontrolled mode)",
    },
    isDismissable: {
      control: { type: "boolean" },
      description:
        "Whether the drawer can be dismissed by clicking backdrop or pressing Escape",
    },
    isKeyboardDismissDisabled: {
      control: { type: "boolean" },
      description: "Whether keyboard dismissal (Escape key) is disabled",
    },
    "aria-label": {
      control: { type: "text" },
      description:
        "Accessible label for the drawer when not using Drawer.Title",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default drawer configuration with medium size and center placement.
 */
export const Default: Story = {
  args: {},
  render: (args) => {
    return (
      <Drawer.Root {...args}>
        <Drawer.Trigger>Accepts anything as trigger</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Drawer Title</Drawer.Title>
            <Drawer.CloseTrigger autoFocus />
          </Drawer.Header>
          <Drawer.Body>
            <Text>This is the default drawer with basic functionality.</Text>
          </Drawer.Body>
          <Drawer.Footer>
            <Button slot="close">Cancel</Button>
            <Button variant="solid">Save</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    );
  },

  play: async ({ canvasElement, step }) => {
    // Use parent element to capture portal content
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open drawer via trigger click", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Accepts anything as trigger",
      });
      await userEvent.click(trigger);

      // Wait for drawer to appear in portal
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Verify drawer title
      expect(
        canvas.getByRole("heading", { name: "Drawer Title" })
      ).toBeInTheDocument();
    });

    await step("Verify initial focus on autoFocus element", async () => {
      const closeButton = canvas.getByRole("button", { name: /close/i });
      await expect(closeButton).toHaveFocus();
    });

    await step("Test close drawer via close button", async () => {
      const closeButton = canvas.getByRole("button", { name: /close/i });
      await userEvent.click(closeButton);

      // Wait for drawer to close
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });

    await step(
      "Test Cancel button with slot='close' closes drawer",
      async () => {
        // Reopen the drawer
        const trigger = canvas.getByRole("button", {
          name: "Accepts anything as trigger",
        });
        await userEvent.click(trigger);

        await waitFor(() => {
          expect(canvas.getByRole("dialog")).toBeInTheDocument();
        });

        // Test the Cancel button that has slot="close"
        const cancelButton = canvas.getByRole("button", { name: "Cancel" });
        await userEvent.click(cancelButton);

        // Wait for drawer to close
        await waitFor(() => {
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
        });
      }
    );

    await step("Test focus restoration to trigger", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Accepts anything as trigger",
      });
      await waitFor(
        () => {
          expect(trigger).toHaveFocus();
        },
        {
          timeout: 1000,
        }
      );
    });

    await step("Test Escape key dismissal", async () => {
      // Get trigger element
      const trigger = canvas.getByRole("button", {
        name: "Accepts anything as trigger",
      });

      // Reopen drawer
      await userEvent.click(trigger);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Close with Escape key
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });

      // Focus should return to trigger
      await waitFor(
        () => {
          expect(trigger).toHaveFocus();
        },
        {
          timeout: 1000,
        }
      );
    });
  },
};

/**
 * Drawer triggered by a custom Button component instead of the default Drawer.Trigger.
 */
export const ButtonAsTrigger: Story = {
  args: {},
  render: (args) => (
    <Drawer.Root {...args}>
      <Drawer.Trigger asChild>
        <Button variant="solid">Open with Custom Button</Button>
      </Drawer.Trigger>

      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Fancy Button Trigger</Drawer.Title>
          <Drawer.CloseTrigger />
        </Drawer.Header>
        <Drawer.Body>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </Text>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="outline" slot="close" autoFocus>
            Cancel
          </Button>
          <Button variant="solid" slot="close">
            Confirm
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  ),

  play: async ({ canvasElement, step }) => {
    // Use parent element to capture portal content
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Test custom Button trigger with asChild prop", async () => {
      const customButton = canvas.getByRole("button", {
        name: "Open with Custom Button",
      });

      // Verify it's a Button component with the correct styling
      expect(customButton).toHaveClass(/nimbus-button/);

      // Click to open drawer
      await userEvent.click(customButton);

      // Wait for drawer to appear
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Verify drawer content
      expect(
        canvas.getByRole("heading", { name: "Fancy Button Trigger" })
      ).toBeInTheDocument();

      // Verify autoFocus on Cancel button
      const cancelButton = canvas.getByRole("button", { name: "Cancel" });
      await expect(cancelButton).toHaveFocus();

      // Close via confirm button
      const confirmButton = canvas.getByRole("button", { name: "Confirm" });
      await userEvent.click(confirmButton);

      // Drawer should close and focus should return to custom trigger
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });

      // Wait for focus to be restored to the custom button trigger
      await waitFor(
        () => {
          expect(customButton).toHaveFocus();
        },
        {
          timeout: 1000,
          interval: 50,
        }
      );
    });

    // Leave drawer open for Chromatic to snapshot
    await step("Open drawer for Chromatic snapshot", async () => {
      const customButton = canvas.getByRole("button", {
        name: "Open with Custom Button",
      });
      await userEvent.click(customButton);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
    });
  },
};

/**
 * Drawer content with different size variations.
 */
export const SizeVariations: Story = {
  args: {},
  render: () => (
    <Stack direction="row" flexWrap="wrap">
      {(["sm", "md", "7200", "512px", "full"] as const).map((size) => (
        <Drawer.Root key={size}>
          <Drawer.Trigger>{size} size</Drawer.Trigger>
          <Drawer.Content width={size}>
            <Drawer.Header>
              <Drawer.Title>Size: {size}</Drawer.Title>
              <Drawer.CloseTrigger />
            </Drawer.Header>
            <Drawer.Body>
              <Text>
                Apply the desired width to the <Code>Drawer.Content</Code>{" "}
                component, since it's a style-prop, so you can use all
                size-tokens but also custom values.
                <br />
                <br />
                <Code>{`<Drawer.Content width="${size}">`}</Code>
              </Text>
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close">Close</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </Stack>
  ),
};

/**
 * Drawer with different placement variants.
 */
export const Placements: Story = {
  args: {},
  render: () => (
    <Stack direction="row" flexWrap="wrap">
      {(["left", "right", "top", "bottom"] as const).map((placement) => (
        <Drawer.Root key={placement} placement={placement} showBackdrop>
          <Drawer.Trigger>{placement}</Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Placement: {placement}</Drawer.Title>
              <Drawer.CloseTrigger />
            </Drawer.Header>
            <Drawer.Body>
              <Text>This drawer is positioned at "{placement}".</Text>
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close" autoFocus>
                Close
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </Stack>
  ),
};

/**
 * Drawer with different backdrop variants.
 */
export const BackdropVariants: Story = {
  args: {},
  render: () => (
    <Stack direction="row" flexWrap="wrap">
      {([true, false] as const).map((showBackdrop) => (
        <Drawer.Root key={String(showBackdrop)} showBackdrop={showBackdrop}>
          <Drawer.Trigger>
            Backdrop: {showBackdrop ? "enabled" : "disabled"}
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>
                Backdrop: {showBackdrop ? "Enabled" : "Disabled"}
              </Drawer.Title>
              <Drawer.CloseTrigger />
            </Drawer.Header>
            <Drawer.Body>
              <Text>
                This drawer {showBackdrop ? "has" : "does not have"} a backdrop
                overlay.
              </Text>
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close" autoFocus>
                Close
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      ))}
    </Stack>
  ),
};

/**
 * Drawer with scrollable content to demonstrate scroll behavior.
 * Tests keyboard accessibility and focus management within the drawer body.
 */
export const ScrollableContent: Story = {
  args: {},
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>Open Scrollable Drawer</Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Scrollable Content</Drawer.Title>
          <Drawer.CloseTrigger />
        </Drawer.Header>
        <Separator />
        <Drawer.Body data-testid="scrollable-drawer-body">
          <Stack>
            <Text fontWeight="semibold">
              The drawer body is keyboard focusable and scrollable with arrow
              keys.
            </Text>
            <Text>
              Use Tab to focus the drawer body, then use arrow keys, Page
              Up/Down, Home/End to scroll through the content.
            </Text>
            {Array.from({ length: 25 }, (_, i) => (
              <Text key={i}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                This is paragraph {i + 1} of scrollable content.
              </Text>
            ))}
            <Text fontWeight="semibold" color="primary.500">
              End of scrollable content. You can scroll back to the top using
              Home key.
            </Text>
          </Stack>
        </Drawer.Body>
        <Separator />
        <Drawer.Footer>
          <Button variant="outline" slot="close">
            Cancel
          </Button>
          <Button variant="solid" slot="close">
            Confirm
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  ),

  play: async ({ canvasElement, step }) => {
    // Use parent element to capture portal content
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open drawer and verify scroll setup", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Open Scrollable Drawer",
      });
      await userEvent.click(trigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Verify drawer body is focusable for keyboard scrolling
      const drawerBody = canvas.getByTestId("scrollable-drawer-body");
      expect(drawerBody).toHaveAttribute("tabIndex", "0");
    });

    await step("Test keyboard navigation to drawer body", async () => {
      const drawerBody = canvas.getByTestId("scrollable-drawer-body");

      // Verify drawer body is focusable
      expect(drawerBody).toHaveAttribute("tabIndex", "0");

      // Focus the drawer body directly to test keyboard scrolling capability
      drawerBody.focus();

      await waitFor(() => {
        expect(drawerBody).toHaveFocus();
      });
    });

    await step("Test keyboard scrolling functionality", async () => {
      const drawerBody = canvas.getByTestId("scrollable-drawer-body");
      await fireEvent.scroll(drawerBody, { target: { scrollTop: 500 } });
      expect(drawerBody.scrollTop).toBeGreaterThan(0);
    });
  },
};

/**
 * Drawer with controlled state example.
 */
export const ControlledState: Story = {
  args: {},
  render: () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <Stack>
        <Switch isSelected={isOpen} onChange={setIsOpen}>
          Open Controlled Drawer
        </Switch>
        <Text>Drawer is {isOpen ? "open" : "closed"}</Text>
        <Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen}>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Controlled Drawer</Drawer.Title>
              <Drawer.CloseTrigger />
            </Drawer.Header>
            <Drawer.Body>Hallo</Drawer.Body>
            <Drawer.Footer>
              <Button>Cancel</Button>
              <Button slot="close">Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      </Stack>
    );
  },

  play: async ({ canvasElement, step }) => {
    // Use parent element to capture portal content
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Test controlled state behavior", async () => {
      // Verify initial state
      expect(canvas.getByText("Drawer is closed")).toBeInTheDocument();
      expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();

      const switchElement = canvas.getByRole("switch");
      expect(switchElement).not.toBeChecked();

      // Test controlled opening
      await userEvent.click(switchElement);
      await waitFor(() => {
        expect(canvas.getByText("Drawer is open")).toBeInTheDocument();
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
      expect(switchElement).toBeChecked();

      // Test onOpenChange callback synchronization via close button
      const closeButton = canvas.getByRole("button", { name: /close/i });
      await userEvent.click(closeButton);
      await waitFor(() => {
        expect(canvas.getByText("Drawer is closed")).toBeInTheDocument();
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
      expect(switchElement).not.toBeChecked();
    });
  },
};

/**
 * Drawer with various form inputs inside to demonstrate complex form layouts.
 */
export const LoginForm: Story = {
  args: {},
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginReason, setLoginReason] = useState<string>("");

    const handleSubmit = () => {
      alert(
        `Username: ${username}, Password: ********, Reason: ${loginReason}`
      );
      setIsOpen(false);
    };

    return (
      <div>
        <Drawer.Root isOpen={isOpen} onOpenChange={setIsOpen}>
          <Drawer.Trigger>Open Form Drawer</Drawer.Trigger>
          <Drawer.Content width="md">
            <Drawer.Header>
              <Drawer.Title>Complete Your Login</Drawer.Title>
              <Drawer.CloseTrigger />
            </Drawer.Header>
            <Drawer.Body>
              <Stack width="100%">
                <FormField.Root>
                  <FormField.Label>Username</FormField.Label>
                  <FormField.Input width="100%">
                    <TextInput
                      autoFocus
                      width="100%"
                      placeholder="Enter your username"
                      value={username}
                      onChange={setUsername}
                      isRequired
                    />
                  </FormField.Input>
                </FormField.Root>

                <FormField.Root display="block" width="100%">
                  <FormField.Label>Password</FormField.Label>
                  <FormField.Input>
                    <PasswordInput
                      width="100%"
                      placeholder="Enter your password"
                      value={password}
                      onChange={setPassword}
                      isRequired
                    />
                  </FormField.Input>
                </FormField.Root>

                <FormField.Root width="100%">
                  <FormField.Label>Login Reason</FormField.Label>
                  <FormField.Input width="100%">
                    <Select.Root
                      width="100%"
                      aria-label="Select login reason"
                      selectedKey={loginReason}
                      onSelectionChange={(key) => setLoginReason(key as string)}
                    >
                      <Select.Options>
                        <Select.Option id="work">Work Related</Select.Option>
                        <Select.Option id="personal">
                          Personal Use
                        </Select.Option>
                        <Select.Option id="admin">
                          Administrative Tasks
                        </Select.Option>
                        <Select.Option id="maintenance">
                          System Maintenance
                        </Select.Option>
                      </Select.Options>
                    </Select.Root>
                  </FormField.Input>
                </FormField.Root>
              </Stack>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" slot="close">
                Cancel
              </Button>
              <Button
                variant="solid"
                isDisabled={!username || !password || !loginReason}
                onPress={handleSubmit}
              >
                Submit
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      </div>
    );
  },
};

/**
 * Drawer with complex dismissal scenario combinations.
 */
export const ComplexDismissalScenarios: Story = {
  args: {},
  render: () => (
    <Stack direction="column" gap="400">
      {/* Scenario 1: Dismissable but no keyboard dismiss */}
      <Drawer.Root isDismissable={true} isKeyboardDismissDisabled={true}>
        <Drawer.Trigger>Backdrop ✓, Keyboard ✗</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Backdrop Only Dismissal</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>
          <Drawer.Body>
            <Stack>
              <Text>This drawer can be dismissed by:</Text>
              <Text>• Clicking outside (backdrop)</Text>
              <Text>• Using the close button</Text>
              <Text>
                • <strong>NOT</strong> by pressing <Kbd>Esc</Kbd>
              </Text>
            </Stack>
          </Drawer.Body>
          <Drawer.Footer>
            <Button slot="close">Close</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>

      {/* Scenario 2: Not dismissable but keyboard works */}
      <Drawer.Root isDismissable={false} isKeyboardDismissDisabled={false}>
        <Drawer.Trigger>Backdrop ✗, Keyboard ✓</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Keyboard Only Dismissal</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>
          <Drawer.Body>
            <Stack>
              <Text>This drawer can be dismissed by:</Text>
              <Text>
                • Pressing <Kbd>Esc</Kbd>
              </Text>
              <Text>• Using the close button</Text>
              <Text>
                • <strong>NOT</strong> by clicking outside
              </Text>
            </Stack>
          </Drawer.Body>
          <Drawer.Footer>
            <Button slot="close">Close</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>

      {/* Scenario 3: Neither dismissable nor keyboard */}
      <Drawer.Root isDismissable={false} isKeyboardDismissDisabled={true}>
        <Drawer.Trigger>Backdrop ✗, Keyboard ✗</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Modal Drawer (No Dismissal)</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>
          <Drawer.Body>
            <Stack>
              <Text>This drawer can only be closed by:</Text>
              <Text>• Using the close button</Text>
              <Text>
                • <strong>NOT</strong> by clicking outside
              </Text>
              <Text>
                • <strong>NOT</strong> by pressing <Kbd>Esc</Kbd>
              </Text>
            </Stack>
          </Drawer.Body>
          <Drawer.Footer>
            <Button slot="close">Close</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </Stack>
  ),

  play: async ({ canvasElement, step }) => {
    // Use parent element to capture portal content
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Test dismissal behavior matrix", async () => {
      // Test backdrop enabled, keyboard disabled
      const trigger1 = canvas.getByRole("button", {
        name: "Backdrop ✓, Keyboard ✗",
      });
      await userEvent.click(trigger1);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Escape should NOT close
      await userEvent.keyboard("{Escape}");
      await expect(canvas.getByRole("dialog")).toBeInTheDocument();

      // Backdrop click SHOULD close
      const modalOverlay1 = canvas
        .getByRole("dialog")
        .closest('[role="presentation"]');
      if (modalOverlay1) {
        await userEvent.click(modalOverlay1);
        await waitFor(() => {
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
        });
      }

      // Test backdrop disabled, keyboard enabled
      const trigger2 = canvas.getByRole("button", {
        name: "Backdrop ✗, Keyboard ✓",
      });
      await userEvent.click(trigger2);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Backdrop click should NOT close
      const modalOverlay2 = canvas
        .getByRole("dialog")
        .closest('[role="presentation"]');
      if (modalOverlay2) {
        await userEvent.click(modalOverlay2);
        await expect(canvas.getByRole("dialog")).toBeInTheDocument();
      }

      // Escape SHOULD close
      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });

      // Test both disabled
      const trigger3 = canvas.getByRole("button", {
        name: "Backdrop ✗, Keyboard ✗",
      });
      await userEvent.click(trigger3);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Neither should close drawer
      await userEvent.keyboard("{Escape}");
      await expect(canvas.getByRole("dialog")).toBeInTheDocument();

      // Only close button works
      const closeButton = canvas.getByRole("button", { name: "Close" });
      await userEvent.click(closeButton);
      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  },
};

/**
 * Drawer with nested drawers to test z-index management and proper stacking behavior.
 */
export const NestedDrawers: Story = {
  args: {},
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="ghost">Open Nested Drawer</Button>
      </Drawer.Trigger>

      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>First Level Drawer</Drawer.Title>
          <Drawer.CloseTrigger />
        </Drawer.Header>

        <Drawer.Body>
          <Stack gap="400">
            <Text>This is the first level drawer.</Text>

            <Drawer.Root>
              <Drawer.Trigger asChild>
                <Button size="xs" variant="outline">
                  Open Second Drawer
                </Button>
              </Drawer.Trigger>

              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Second Level Drawer</Drawer.Title>
                  <Drawer.CloseTrigger />
                </Drawer.Header>

                <Drawer.Body>
                  <Text>
                    This is a nested drawer that should appear above the first
                    drawer with proper z-index stacking.
                  </Text>
                </Drawer.Body>

                <Drawer.Footer>
                  <Button slot="close">Close Second Drawer</Button>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer.Root>
          </Stack>
        </Drawer.Body>

        <Drawer.Footer>
          <Button slot="close">Close First Drawer</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Test nested drawers z-index management", async () => {
      // Open first drawer
      const firstTrigger = canvas.getByRole("button", {
        name: "Open Nested Drawer",
      });
      await userEvent.click(firstTrigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
        expect(
          canvas.getByText("This is the first level drawer.")
        ).toBeInTheDocument();
      });

      // Open second drawer
      const secondTrigger = canvas.getByRole("button", {
        name: "Open Second Drawer",
      });
      await userEvent.click(secondTrigger);

      await waitFor(() => {
        // Both drawers should be present
        const drawers = canvas.getAllByRole("dialog");
        expect(drawers).toHaveLength(2);
        expect(
          canvas.getByText(
            /This is a nested drawer that should appear above the first/
          )
        ).toBeInTheDocument();
      });

      // Close second drawer first (should close in proper order)
      const secondCloseButton = canvas.getByRole("button", {
        name: "Close Second Drawer",
      });
      await userEvent.click(secondCloseButton);

      await waitFor(() => {
        const drawers = canvas.getAllByRole("dialog");
        expect(drawers).toHaveLength(1);
        expect(
          canvas.getByText("This is the first level drawer.")
        ).toBeInTheDocument();
      });

      // Close first drawer
      const firstCloseButton = canvas.getByRole("button", {
        name: "Close First Drawer",
      });
      await userEvent.click(firstCloseButton);

      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });

      // Verify focus restoration to original trigger
      await waitFor(
        () => {
          expect(firstTrigger).toHaveFocus();
        },
        { timeout: 1000 }
      );
    });

    await step("Test Escape key behavior with nested drawers", async () => {
      // Open first drawer
      const firstTrigger = canvas.getByRole("button", {
        name: "Open Nested Drawer",
      });
      await userEvent.click(firstTrigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Open second drawer
      const secondTrigger = canvas.getByRole("button", {
        name: "Open Second Drawer",
      });
      await userEvent.click(secondTrigger);

      await waitFor(() => {
        const drawers = canvas.getAllByRole("dialog");
        expect(drawers).toHaveLength(2);
      });

      // Escape should close the topmost drawer first
      await userEvent.keyboard("{Escape}");

      await waitFor(() => {
        const drawers = canvas.getAllByRole("dialog");
        expect(drawers).toHaveLength(1);
        expect(
          canvas.getByText("This is the first level drawer.")
        ).toBeInTheDocument();
      });

      // Another Escape should close the remaining drawer
      await userEvent.keyboard("{Escape}");

      await waitFor(() => {
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });

      // Focus should return to original trigger
      await waitFor(
        () => {
          expect(firstTrigger).toHaveFocus();
        },
        { timeout: 1000 }
      );
    });
  },
};
