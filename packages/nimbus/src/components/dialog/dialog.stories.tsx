import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Dialog } from "./dialog";
import {
  Button,
  Stack,
  Switch,
  Text,
  TextInput,
  PasswordInput,
  FormField,
  Select,
  Kbd,
  Code,
  Separator,
} from "@/components";

const meta: Meta<typeof Dialog.Root> = {
  title: "components/Overlay/Dialog",
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
    onOpenChange: {
      action: "onOpenChange",
      description: "Callback fired when the dialog open state changes",
    },
    shouldCloseOnInteractOutside: {
      control: false,
      description:
        "Function to determine whether dialog should close on outside interaction",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default dialog configuration with medium size and center placement.
 */
export const Default: Story = {
  args: {},
  render: (args) => (
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
          <Button slot="close" variant="solid" tone="primary">
            Save
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

/**
 * Dialog triggered by a custom Button component instead of the default Dialog.Trigger.
 */
export const ButtonAsTrigger: Story = {
  args: {},
  render: (args) => (
    <Dialog.Root {...args}>
      <Dialog.Trigger asChild>
        <Button variant="solid" tone="primary">
          Open with Custom Button
        </Button>
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
          <Button variant="outline" tone="primary" slot="close" autoFocus>
            Cancel
          </Button>
          <Button variant="solid" tone="primary" slot="close">
            Confirm
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
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
            <Dialog.Body>
              <Stack>
                <Text>
                  This dialog tests "{scrollBehavior}" scroll behavior with lots
                  of content.
                </Text>
                {Array.from({ length: 20 }, (_, i) => (
                  <Text key={i}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris.
                  </Text>
                ))}
              </Stack>
            </Dialog.Body>
            <Separator />
            <Dialog.Footer>
              <Button ml="auto" slot="close" autoFocus>
                Nonono
              </Button>
              <Button mr="auto" tone="primary" variant="solid">
                Accept
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </Stack>
  ),
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
                  <FormField.Input
                    css={{
                      "& > div": {
                        width: "100%",
                      },
                    }}
                  >
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
              <Button variant="outline" tone="primary" slot="close">
                Cancel
              </Button>
              <Button
                variant="solid"
                tone="primary"
                isDisabled={!username || !password || !loginReason}
                onClick={handleSubmit}
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
};
