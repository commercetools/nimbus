import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { useState } from "react";
import {
  Button,
  Code,
  Dialog,
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

const meta: Meta<typeof Dialog.Root> = {
  title: "Components/Overlay/Dialog",
  component: Dialog.Root,
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: { type: "select" },
      options: ["center", "top", "bottom"],
      description: "Position of the dialog relative to the viewport",
    },
    scrollBehavior: {
      control: { type: "select" },
      options: ["inside", "outside"],
      description:
        "Whether scrolling happens inside the dialog body or on the entire page",
    },
    isOpen: {
      control: { type: "boolean" },
      description: "Whether the dialog is open (controlled mode)",
    },
    defaultOpen: {
      control: { type: "boolean" },
      description: "Whether the dialog is open by default (uncontrolled mode)",
    },
    isDismissable: {
      control: { type: "boolean" },
      description:
        "Whether the dialog can be dismissed by clicking backdrop or pressing Escape",
    },
    isKeyboardDismissDisabled: {
      control: { type: "boolean" },
      description: "Whether keyboard dismissal (Escape key) is disabled",
    },
    "aria-label": {
      control: { type: "text" },
      description:
        "Accessible label for the dialog when not using Dialog.Title",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog.Root>;

/**
 * The default dialog configuration with medium size and center placement.
 */
export const Default: Story = {
  args: {},

  render: (args) => {
    return (
      <Dialog.Root {...args}>
        <Dialog.Trigger>Accepts anything as trigger</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.CloseTrigger autoFocus />
          </Dialog.Header>
          <Dialog.Body>
            <Text>This is the default dialog with basic functionality.</Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Button slot="close">Cancel</Button>
            <Button variant="solid">Save</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    );
  },

  play: async ({ canvasElement, step }) => {
    // Use parent element to capture portal content
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Open dialog via trigger click", async () => {
      const trigger = canvas.getByRole("button", {
        name: "Accepts anything as trigger",
      });
      await userEvent.click(trigger);

      // Wait for dialog to appear in portal
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Verify dialog title
      expect(
        canvas.getByRole("heading", { name: "Dialog Title" })
      ).toBeInTheDocument();
    });

    await step("Verify initial focus on autoFocus element", async () => {
      const closeButton = canvas.getByRole("button", { name: /close/i });
      await expect(closeButton).toHaveFocus();
    });

    await step("Test close dialog via close button", async () => {
      const closeButton = canvas.getByRole("button", { name: /close/i });
      await userEvent.click(closeButton);

      // Wait for dialog to close
      await waitFor(
        () => {
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    await step(
      "Test Cancel button with slot='close' closes dialog",
      async () => {
        // Reopen the dialog
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

        // Wait for dialog to close
        await waitFor(
          () => {
            expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
          },
          { timeout: 3000 }
        );
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

      // Reopen dialog
      await userEvent.click(trigger);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Close with Escape key
      await userEvent.keyboard("{Escape}");
      await waitFor(
        () => {
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

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
 * Dialog triggered by a custom Button component instead of the default Dialog.Trigger.
 */
export const ButtonAsTrigger: Story = {
  args: {},
  render: (args) => (
    <Dialog.Root {...args}>
      <Dialog.Trigger asChild>
        <Button variant="solid">Open with Custom Button</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Fancy Button Trigger</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="outline" slot="close" autoFocus>
            Cancel
          </Button>
          <Button variant="solid" slot="close">
            Confirm
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
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

      // Click to open dialog
      await userEvent.click(customButton);

      // Wait for dialog to appear
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Verify dialog content
      expect(
        canvas.getByRole("heading", { name: "Fancy Button Trigger" })
      ).toBeInTheDocument();

      // Verify autoFocus on Cancel button
      const cancelButton = canvas.getByRole("button", { name: "Cancel" });
      await expect(cancelButton).toHaveFocus();

      // Close via confirm button
      const confirmButton = canvas.getByRole("button", { name: "Confirm" });
      await userEvent.click(confirmButton);

      // Dialog should close and focus should return to custom trigger
      await waitFor(
        () => {
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

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
  },
};

/**
 * Dialog content with different size variations.
 */
export const SizeVariations: Story = {
  args: {},
  render: () => (
    <Stack direction="row" flexWrap="wrap">
      {(["sm", "md", "7200", "512px", "full"] as const).map((size) => (
        <Dialog.Root key={size}>
          <Dialog.Trigger>{size} size</Dialog.Trigger>
          <Dialog.Content width={size}>
            <Dialog.Header>
              <Dialog.Title>Size: {size}</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Apply the desired width to the <Code>Dialog.Content</Code>{" "}
                component, since it's a style-prop, so you can use all
                size-tokens but also custom values.
                <br />
                <br />
                <Code>{`<Dialog.Content width="${size}">`}</Code>
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button slot="close">Close</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Stack>
  ),
};

/**
 * Dialog with different placement variants.
 */
export const Placements: Story = {
  args: {},
  render: () => (
    <Stack direction="row" flexWrap="wrap">
      {(["center", "top", "bottom"] as const).map((placement) => (
        <Dialog.Root key={placement} placement={placement}>
          <Dialog.Trigger>{placement}</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Placement: {placement}</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <Text>This dialog is positioned at "{placement}".</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button slot="close" autoFocus>
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Stack>
  ),
};

/**
 * Dialog with scrollable content to test scroll behavior variants.
 * Tests keyboard accessibility when scrollBehavior="inside" is selected.
 */
export const ScrollBehavior: Story = {
  args: {},
  render: () => (
    <Stack direction="row">
      {(["inside", "outside"] as const).map((scrollBehavior) => (
        <Dialog.Root key={scrollBehavior} scrollBehavior={scrollBehavior}>
          <Dialog.Trigger>Scroll {scrollBehavior}</Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Terms and conditions</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Separator />
            <Dialog.Body data-testid={`dialog-body-${scrollBehavior}`}>
              <Stack>
                <Text>
                  This dialog tests "{scrollBehavior}" scroll behavior with lots
                  of content.
                </Text>
                <Text fontWeight="semibold">
                  {scrollBehavior === "inside"
                    ? "The dialog body is keyboard focusable and scrollable with arrow keys."
                    : "The entire page scrolls when content overflows."}
                </Text>
                {Array.from({ length: 20 }, (_, i) => (
                  <Text key={i}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris. This is paragraph {i + 1} of scrollable
                    content.
                  </Text>
                ))}
                <Text fontWeight="semibold" id={`scroll-end-${scrollBehavior}`}>
                  End of scrollable content for {scrollBehavior} behavior.
                </Text>
              </Stack>
            </Dialog.Body>
            <Separator />
            <Dialog.Footer>
              <Button ml="auto" slot="close">
                Decline
              </Button>
              <Button mr="auto" variant="solid">
                Accept
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Stack>
  ),

  play: async ({ canvasElement, step }) => {
    // Use parent element to capture portal content
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step(
      "Scroll-inside body is the keyboard-focusable scroll region",
      async () => {
        const scrollInsideTrigger = canvas.getByRole("button", {
          name: "Scroll inside",
        });
        await userEvent.click(scrollInsideTrigger);
        await waitFor(() => {
          expect(canvas.getByRole("dialog")).toBeInTheDocument();
        });

        const dialogBody = canvas.getByTestId("dialog-body-inside");
        expect(dialogBody).toHaveAttribute("tabIndex", "0");

        // Tab (real keyboard) until the scroll region holds focus.
        for (let i = 0; i < 6 && document.activeElement !== dialogBody; i++) {
          await userEvent.tab();
        }
        await expect(dialogBody).toHaveFocus();
        // Keyboard scroll (Arrow/PageDown/Home/End moving scrollTop) is not
        // asserted - scrollTop doesn't update in the test browser. See matrix.

        await userEvent.keyboard("{Escape}");
        await waitFor(
          () => {
            expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
          },
          { timeout: 3000 }
        );
      }
    );

    await step("Test 'scroll outside' behavior comparison", async () => {
      // Test scroll outside dialog
      const scrollOutsideTrigger = canvas.getByRole("button", {
        name: "Scroll outside",
      });
      await userEvent.click(scrollOutsideTrigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Verify dialog body is NOT focusable (no tabIndex) for scroll outside
      const dialogBody = canvas.getByTestId("dialog-body-outside");
      expect(dialogBody).not.toHaveAttribute("tabIndex");

      // Test that Tab doesn't focus the dialog body - it should be skipped entirely
      // Focus order for scroll outside: Close button -> Decline button -> Accept button (dialog body is skipped)
      await userEvent.tab(); // Move to Decline button
      const declineButton = canvas.getByRole("button", { name: "Decline" });
      await waitFor(() => {
        // Verify decline button is accessible
        expect(declineButton).toBeInTheDocument();
        expect(declineButton).toHaveAttribute("type", "button");
      });

      await userEvent.tab(); // Should skip dialog body and go to Accept button
      const acceptButton = canvas.getByRole("button", { name: "Accept" });
      await waitFor(() => {
        // Verify accept button is accessible
        expect(acceptButton).toBeInTheDocument();
        expect(acceptButton).toHaveAttribute("type", "button");
      });

      // Verify dialog body is never focused by tabbing once more (should cycle or stop)
      await userEvent.tab();
      await waitFor(() => {
        // Dialog body should still NOT have tabIndex for scroll outside behavior
        expect(dialogBody).not.toHaveAttribute("tabIndex");
      });

      // Close dialog
      await userEvent.keyboard("{Escape}");
      await waitFor(
        () => {
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    await step("Focus returns to the trigger after close", async () => {
      const scrollInsideTrigger = canvas.getByRole("button", {
        name: "Scroll inside",
      });
      await userEvent.click(scrollInsideTrigger);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      await userEvent.keyboard("{Escape}");
      await waitFor(
        () => {
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
      await waitFor(() => expect(scrollInsideTrigger).toHaveFocus(), {
        timeout: 1000,
      });
    });
  },
};

/**
 * Dialog with controlled state example.
 */
export const ControlledState: Story = {
  args: {},
  render: () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <Stack>
        <Switch isSelected={isOpen} onChange={setIsOpen}>
          Open Controlled Dialog
        </Switch>
        <Text>Dialog is {isOpen ? "open" : "closed"}</Text>
        <Dialog.Root isOpen={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Controlled Dialog</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>Hallo</Dialog.Body>
            <Dialog.Footer>
              <Button>Cancel</Button>
              <Button slot="close">Save</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
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
      expect(canvas.getByText("Dialog is closed")).toBeInTheDocument();
      expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();

      const switchElement = canvas.getByRole("switch");
      expect(switchElement).not.toBeChecked();

      // Test controlled opening
      await userEvent.click(switchElement);
      await waitFor(() => {
        expect(canvas.getByText("Dialog is open")).toBeInTheDocument();
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });
      expect(switchElement).toBeChecked();

      // Test onOpenChange callback synchronization via close button
      const closeButton = canvas.getByRole("button", { name: /close/i });
      await userEvent.click(closeButton);
      await waitFor(() => {
        expect(canvas.getByText("Dialog is closed")).toBeInTheDocument();
        expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      });
      expect(switchElement).not.toBeChecked();
    });
  },
};

/**
 * Dialog with various form inputs inside to demonstrate complex form layouts.
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
        <Dialog.Root isOpen={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger>Open Form Dialog</Dialog.Trigger>
          <Dialog.Content width="md">
            <Dialog.Header>
              <Dialog.Title>Complete Your Login</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
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
                  <FormField.Input width="100%">
                    <PasswordInput
                      display="block"
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
            </Dialog.Body>
            <Dialog.Footer>
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
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    );
  },
};

/**
 * Dialog with complex dismissal scenario combinations.
 */
export const ComplexDismissalScenarios: Story = {
  args: {},
  render: () => (
    <Stack direction="column" gap="400">
      {/* Scenario 1: Dismissable but no keyboard dismiss */}
      <Dialog.Root isDismissable={true} isKeyboardDismissDisabled={true}>
        <Dialog.Trigger>Backdrop ✓, Keyboard ✗</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Backdrop Only Dismissal</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            <Stack>
              <Text>This dialog can be dismissed by:</Text>
              <Text>• Clicking outside (backdrop)</Text>
              <Text>• Using the close button</Text>
              <Text>
                • <strong>NOT</strong> by pressing <Kbd>Esc</Kbd>
              </Text>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button slot="close">Close</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      {/* Scenario 2: Not dismissable but keyboard works */}
      <Dialog.Root isDismissable={false} isKeyboardDismissDisabled={false}>
        <Dialog.Trigger>Backdrop ✗, Keyboard ✓</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Keyboard Only Dismissal</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            <Stack>
              <Text>This dialog can be dismissed by:</Text>
              <Text>
                • Pressing <Kbd>Esc</Kbd>
              </Text>
              <Text>• Using the close button</Text>
              <Text>
                • <strong>NOT</strong> by clicking outside
              </Text>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button slot="close">Close</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      {/* Scenario 3: Neither dismissable nor keyboard */}
      <Dialog.Root isDismissable={false} isKeyboardDismissDisabled={true}>
        <Dialog.Trigger>Backdrop ✗, Keyboard ✗</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Modal Dialog (No Dismissal)</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            <Stack>
              <Text>This dialog can only be closed by:</Text>
              <Text>• Using the close button</Text>
              <Text>
                • <strong>NOT</strong> by clicking outside
              </Text>
              <Text>
                • <strong>NOT</strong> by pressing <Kbd>Esc</Kbd>
              </Text>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button slot="close">Close</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
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
        await waitFor(
          () => {
            expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
          },
          { timeout: 3000 }
        );
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
      await waitFor(
        () => {
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Test both disabled
      const trigger3 = canvas.getByRole("button", {
        name: "Backdrop ✗, Keyboard ✗",
      });
      await userEvent.click(trigger3);
      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Neither should close dialog
      await userEvent.keyboard("{Escape}");
      await expect(canvas.getByRole("dialog")).toBeInTheDocument();

      // Only close button works
      const closeButton = canvas.getByRole("button", { name: "Close" });
      await userEvent.click(closeButton);
      await waitFor(
        () => {
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  },
};

/**
 * Dialog with nested dialogs to test z-index management and proper stacking behavior.
 */
export const NestedDialogs: Story = {
  args: {},
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="ghost">Open Nested Dialog</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>First Level Dialog</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>

        <Dialog.Body>
          <Stack gap="400">
            <Text>This is the first level dialog.</Text>

            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button size="xs" variant="outline">
                  Open Second Dialog
                </Button>
              </Dialog.Trigger>

              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Second Level Dialog</Dialog.Title>
                  <Dialog.CloseTrigger />
                </Dialog.Header>

                <Dialog.Body>
                  <Text>
                    This is a nested dialog that should appear above the first
                    dialog with proper z-index stacking.
                  </Text>
                </Dialog.Body>

                <Dialog.Footer>
                  <Button slot="close">Close Second Dialog</Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          </Stack>
        </Dialog.Body>

        <Dialog.Footer>
          <Button slot="close">Close First Dialog</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),

  play: async ({ canvasElement, step }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );

    await step("Test nested dialogs z-index management", async () => {
      // Open first dialog
      const firstTrigger = canvas.getByRole("button", {
        name: "Open Nested Dialog",
      });
      await userEvent.click(firstTrigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
        expect(
          canvas.getByText("This is the first level dialog.")
        ).toBeInTheDocument();
      });

      // Open second dialog
      const secondTrigger = canvas.getByRole("button", {
        name: "Open Second Dialog",
      });
      await userEvent.click(secondTrigger);

      await waitFor(
        () => {
          // Both dialogs should be present
          const dialogs = canvas.getAllByRole("dialog");
          expect(dialogs).toHaveLength(2);
          expect(
            canvas.getByText(
              /This is a nested dialog that should appear above the first/
            )
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Close second dialog first (should close in proper order)
      const secondCloseButton = canvas.getByRole("button", {
        name: "Close Second Dialog",
      });
      await userEvent.click(secondCloseButton);

      await waitFor(
        () => {
          const dialogs = canvas.getAllByRole("dialog");
          expect(dialogs).toHaveLength(1);
          expect(
            canvas.getByText("This is the first level dialog.")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Close first dialog
      const firstCloseButton = canvas.getByRole("button", {
        name: "Close First Dialog",
      });
      await userEvent.click(firstCloseButton);

      await waitFor(
        () => {
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Verify focus restoration to original trigger
      await waitFor(
        () => {
          expect(firstTrigger).toHaveFocus();
        },
        { timeout: 1000 }
      );
    });

    await step("Test Escape key behavior with nested dialogs", async () => {
      // Open first dialog
      const firstTrigger = canvas.getByRole("button", {
        name: "Open Nested Dialog",
      });
      await userEvent.click(firstTrigger);

      await waitFor(() => {
        expect(canvas.getByRole("dialog")).toBeInTheDocument();
      });

      // Open second dialog
      const secondTrigger = canvas.getByRole("button", {
        name: "Open Second Dialog",
      });
      await userEvent.click(secondTrigger);

      await waitFor(
        () => {
          const dialogs = canvas.getAllByRole("dialog");
          expect(dialogs).toHaveLength(2);
        },
        { timeout: 3000 }
      );

      // Escape should close the topmost dialog first
      await userEvent.keyboard("{Escape}");

      await waitFor(
        () => {
          const dialogs = canvas.getAllByRole("dialog");
          expect(dialogs).toHaveLength(1);
          expect(
            canvas.getByText("This is the first level dialog.")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Another Escape should close the remaining dialog
      await userEvent.keyboard("{Escape}");

      await waitFor(
        () => {
          expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

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

// VRT open-state snapshots: `defaultOpen` so Chromatic captures the settled overlay (entrance animation pauses in place).

const awaitOpen = async (canvasElement: HTMLElement) => {
  const canvas = within(
    (canvasElement.parentNode as HTMLElement) ?? canvasElement
  );
  await waitFor(() => expect(canvas.getByRole("dialog")).toBeInTheDocument());
};

/**
 * Open dialog (center) - the canonical chrome: header + title + close button,
 * body, footer actions, and the blurred backdrop.
 */
export const Open: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Dialog.Root defaultOpen>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>
          <Text>This is the default dialog with basic functionality.</Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button slot="close">Cancel</Button>
          <Button variant="solid">Save</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvasElement }) => awaitOpen(canvasElement),
};

/**
 * Placement `top` - dialog pinned to the top of the viewport.
 */
export const OpenTop: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Dialog.Root defaultOpen placement="top">
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Placement: top</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>
          <Text>This dialog is positioned at the top.</Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button slot="close">Close</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvasElement }) => awaitOpen(canvasElement),
};

/**
 * Placement `bottom` - dialog pinned to the bottom of the viewport.
 */
export const OpenBottom: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Dialog.Root defaultOpen placement="bottom">
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Placement: bottom</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>
          <Text>This dialog is positioned at the bottom.</Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button slot="close">Close</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
  play: async ({ canvasElement }) => awaitOpen(canvasElement),
};

const ScrollInsideDialog = () => (
  <Dialog.Root defaultOpen scrollBehavior="inside">
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Terms and conditions</Dialog.Title>
        <Dialog.CloseTrigger />
      </Dialog.Header>
      <Separator />
      <Dialog.Body data-testid="scroll-inside-body">
        <Stack>
          {Array.from({ length: 20 }, (_, i) => (
            <Text key={i}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. This
              is paragraph {i + 1} of scrollable content.
            </Text>
          ))}
        </Stack>
      </Dialog.Body>
      <Separator />
      <Dialog.Footer>
        <Button slot="close">Decline</Button>
        <Button variant="solid">Accept</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
);

/**
 * `scrollBehavior="inside"` - constrained height with a scrollable body and
 * header/footer separators; distinct from the default `outside`.
 */
export const OpenScrollInside: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <ScrollInsideDialog />,
  play: async ({ canvasElement }) => awaitOpen(canvasElement),
};

/**
 * The scroll-inside body is a keyboard-focusable scroll region with its own
 * `focusVisibleRing` (a11y for scrolling). Reached via Tab, so the ring renders.
 */
export const OpenScrollInsideFocused: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <ScrollInsideDialog />,
  play: async ({ canvasElement }) => {
    const canvas = within(
      (canvasElement.parentNode as HTMLElement) ?? canvasElement
    );
    await waitFor(() => expect(canvas.getByRole("dialog")).toBeInTheDocument());
    const body = canvas.getByTestId("scroll-inside-body");
    // Tab (real keyboard, so :focus-visible fires) until the body holds focus.
    for (let i = 0; i < 6 && document.activeElement !== body; i++) {
      await userEvent.tab();
    }
    await expect(body).toHaveFocus();
  },
};
