import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Dialog } from "./dialog";
import { Button, Stack, Text } from "@/components";

const meta: Meta<typeof Dialog.Root> = {
  title: "components/Overlay/Dialog",
  component: Dialog.Root,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: { type: "select" },
      options: ["center", "top", "bottom", "left", "right"],
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
      <Dialog.Backdrop />
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
          <Button slot="close">Save</Button>
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
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="solid" tone="primary">
          Open with Custom Button
        </Button>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Custom Button Trigger</Dialog.Title>
          <Dialog.CloseTrigger />
        </Dialog.Header>
        <Dialog.Body>Hallo</Dialog.Body>
        <Dialog.Footer>
          <Button variant="outline" tone="primary" slot="close">
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

// /**
//  * Dialog with different placement variants.
//  */
// export const Placements: Story = {
//   args: {},
//   render: () => (
//     <Stack direction="row" flexWrap="wrap">
//       {(["center", "top", "bottom", "left", "right"] as const).map(
//         (placement) => (
//           <Dialog.Root key={placement} placement={placement}>
//             <Dialog.Trigger>{placement}</Dialog.Trigger>
//             <Dialog.Content>
//               <Dialog.Backdrop />
//               <Dialog.Header>
//                 <Dialog.Title>Placement: {placement}</Dialog.Title>
//                 <Dialog.CloseTrigger />
//               </Dialog.Header>
//               <Dialog.Body>
//                 <Text>This dialog is positioned at "{placement}".</Text>
//               </Dialog.Body>
//               <Dialog.Footer>
//                 <Button>Close</Button>
//               </Dialog.Footer>
//             </Dialog.Content>
//           </Dialog.Root>
//         )
//       )}
//     </Stack>
//   ),
// };

// /**
//  * Dialog with scrollable content to test scroll behavior variants.
//  */
// export const ScrollBehavior: Story = {
//   args: {},
//   render: () => (
//     <Stack direction="row">
//       {(["inside", "outside"] as const).map((scrollBehavior) => (
//         <Dialog.Root key={scrollBehavior} scrollBehavior={scrollBehavior}>
//           <Dialog.Trigger>Scroll {scrollBehavior}</Dialog.Trigger>
//           <Dialog.Content>
//             <Dialog.Backdrop />
//             <Dialog.Header>
//               <Dialog.Title>Scroll: {scrollBehavior}</Dialog.Title>
//               <Dialog.CloseTrigger />
//             </Dialog.Header>
//             <Dialog.Body>
//               <Stack>
//                 <Text>
//                   This dialog tests "{scrollBehavior}" scroll behavior with lots
//                   of content.
//                 </Text>
//                 {Array.from({ length: 20 }, (_, i) => (
//                   <Text key={i}>
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
//                     do eiusmod tempor incididunt ut labore et dolore magna
//                     aliqua. Ut enim ad minim veniam, quis nostrud exercitation
//                     ullamco laboris.
//                   </Text>
//                 ))}
//               </Stack>
//             </Dialog.Body>
//             <Dialog.Footer>
//               <Button>Close</Button>
//             </Dialog.Footer>
//           </Dialog.Content>
//         </Dialog.Root>
//       ))}
//     </Stack>
//   ),
// };

// /**
//  * Dialog without backdrop for special use cases.
//  */
// export const WithoutBackdrop: Story = {
//   args: {},
//   render: () => (
//     <Dialog.Root>
//       <Dialog.Trigger>Open Dialog (No Backdrop)</Dialog.Trigger>
//       <Dialog.Content hasBackdrop={false}>
//         <Dialog.Header>
//           <Dialog.Title>No Backdrop Dialog</Dialog.Title>
//           <Dialog.CloseTrigger />
//         </Dialog.Header>
//         <Dialog.Body>
//           <Text>This dialog has no backdrop overlay.</Text>
//         </Dialog.Body>
//         <Dialog.Footer>
//           <Button>Close</Button>
//         </Dialog.Footer>
//       </Dialog.Content>
//     </Dialog.Root>
//   ),
// };

// /**
//  * Dialog with controlled state example.
//  */
// export const ControlledState: Story = {
//   args: {},
//   render: () => {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//       <Stack>
//         <Button onClick={() => setIsOpen(true)}>Open Controlled Dialog</Button>
//         <Text>Dialog is {isOpen ? "open" : "closed"}</Text>

//         <Dialog.Root isOpen={isOpen} onOpenChange={setIsOpen}>
//           <Dialog.Content>
//             <Dialog.Backdrop />
//             <Dialog.Header>
//               <Dialog.Title>Controlled Dialog</Dialog.Title>
//               <Dialog.CloseTrigger />
//             </Dialog.Header>
//             <Dialog.Body></Dialog.Body>
//             <Dialog.Footer>
//               <Button>Cancel</Button>
//               <Button onClick={() => setIsOpen(false)}>Save</Button>
//             </Dialog.Footer>
//           </Dialog.Content>
//         </Dialog.Root>
//       </Stack>
//     );
//   },
// };

// /**
//  * Dialog with keyboard navigation and accessibility testing.
//  */
// export const KeyboardNavigation: Story = {
//   args: {},
//   render: () => (
//     <Dialog.Root>
//       <Dialog.Trigger>Test Keyboard Navigation</Dialog.Trigger>
//       <Dialog.Content>
//         <Dialog.Backdrop />
//         <Dialog.Header>
//           <Dialog.Title>Keyboard Navigation Test</Dialog.Title>
//           <Dialog.CloseTrigger aria-label="Close dialog" />
//         </Dialog.Header>
//         <Dialog.Body>
//           <Stack>
//             <Button>First Button</Button>
//             <Button>Second Button</Button>
//           </Stack>
//         </Dialog.Body>
//         <Dialog.Footer>
//           <Button>Cancel</Button>
//           <Button>Confirm</Button>
//         </Dialog.Footer>
//       </Dialog.Content>
//     </Dialog.Root>
//   ),
// };

// /**
//  * Dialog with dismissable behavior variants.
//  */
// export const DismissableBehavior: Story = {
//   args: {},
//   render: () => (
//     <Stack direction="row">
//       <Dialog.Root isDismissable={true}>
//         <Dialog.Trigger>Dismissable Dialog</Dialog.Trigger>
//         <Dialog.Content>
//           <Dialog.Backdrop />
//           <Dialog.Header>
//             <Dialog.Title>Dismissable Dialog</Dialog.Title>
//             <Dialog.CloseTrigger />
//           </Dialog.Header>
//           <Dialog.Body>
//             <Text>
//               This dialog can be dismissed by clicking the backdrop or pressing
//               Escape.
//             </Text>
//           </Dialog.Body>
//           <Dialog.Footer>
//             <Button>Close</Button>
//           </Dialog.Footer>
//         </Dialog.Content>
//       </Dialog.Root>

//       <Dialog.Root isDismissable={false}>
//         <Dialog.Trigger>Non-Dismissable Dialog</Dialog.Trigger>
//         <Dialog.Content>
//           <Dialog.Backdrop />
//           <Dialog.Header>
//             <Dialog.Title>Non-Dismissable Dialog</Dialog.Title>
//             <Dialog.CloseTrigger />
//           </Dialog.Header>
//           <Dialog.Body>
//             <Text>
//               This dialog cannot be dismissed by clicking the backdrop or
//               pressing Escape.
//             </Text>
//           </Dialog.Body>
//           <Dialog.Footer>
//             <Button>Close</Button>
//           </Dialog.Footer>
//         </Dialog.Content>
//       </Dialog.Root>
//     </Stack>
//   ),
// };

// /**
//  * Dialog with keyboard dismiss disabled.
//  */
// export const KeyboardDismissDisabled: Story = {
//   args: {},
//   render: () => (
//     <Dialog.Root isKeyboardDismissDisabled={true}>
//       <Dialog.Trigger>Keyboard Dismiss Disabled</Dialog.Trigger>
//       <Dialog.Content>
//         <Dialog.Backdrop />
//         <Dialog.Header>
//           <Dialog.Title>Keyboard Dismiss Disabled</Dialog.Title>
//           <Dialog.CloseTrigger />
//         </Dialog.Header>
//         <Dialog.Body>
//           <Text>
//             This dialog cannot be dismissed using the Escape key, but backdrop
//             clicks still work.
//           </Text>
//         </Dialog.Body>
//         <Dialog.Footer>
//           <Button>Close</Button>
//         </Dialog.Footer>
//       </Dialog.Content>
//     </Dialog.Root>
//   ),
// };

// /**
//  * Dialog with outside interaction behavior control.
//  */
// export const OutsideInteractionBehavior: Story = {
//   args: {},
//   render: () => (
//     <Stack direction="row">
//       <Dialog.Root shouldCloseOnInteractOutside={() => true}>
//         <Dialog.Trigger>Closes on Outside Click</Dialog.Trigger>
//         <Dialog.Content>
//           <Dialog.Backdrop />
//           <Dialog.Header>
//             <Dialog.Title>Closes on Outside Click</Dialog.Title>
//             <Dialog.CloseTrigger />
//           </Dialog.Header>
//           <Dialog.Body>
//             <Text>This dialog will close when clicking outside.</Text>
//           </Dialog.Body>
//           <Dialog.Footer>
//             <Button>Close</Button>
//           </Dialog.Footer>
//         </Dialog.Content>
//       </Dialog.Root>

//       <Dialog.Root shouldCloseOnInteractOutside={() => false}>
//         <Dialog.Trigger>Ignores Outside Click</Dialog.Trigger>
//         <Dialog.Content>
//           <Dialog.Backdrop />
//           <Dialog.Header>
//             <Dialog.Title>Ignores Outside Click</Dialog.Title>
//             <Dialog.CloseTrigger />
//           </Dialog.Header>
//           <Dialog.Body>
//             <Text>This dialog will not close when clicking outside.</Text>
//           </Dialog.Body>
//           <Dialog.Footer>
//             <Button>Close</Button>
//           </Dialog.Footer>
//         </Dialog.Content>
//       </Dialog.Root>
//     </Stack>
//   ),
// };

// /**
//  * Dialog with disabled trigger state.
//  */
// export const DisabledTrigger: Story = {
//   args: {},
//   render: () => (
//     <Stack direction="row">
//       <Dialog.Root>
//         <Dialog.Trigger isDisabled={false}>Enabled Trigger</Dialog.Trigger>
//         <Dialog.Content>
//           <Dialog.Backdrop />
//           <Dialog.Header>
//             <Dialog.Title>Dialog with Enabled Trigger</Dialog.Title>
//             <Dialog.CloseTrigger />
//           </Dialog.Header>
//           <Dialog.Body>
//             <Text>This dialog was opened with an enabled trigger.</Text>
//           </Dialog.Body>
//           <Dialog.Footer>
//             <Button>Close</Button>
//           </Dialog.Footer>
//         </Dialog.Content>
//       </Dialog.Root>

//       <Dialog.Root>
//         <Dialog.Trigger isDisabled={true}>Disabled Trigger</Dialog.Trigger>
//         <Dialog.Content>
//           <Dialog.Backdrop />
//           <Dialog.Header>
//             <Dialog.Title>Dialog with Disabled Trigger</Dialog.Title>
//             <Dialog.CloseTrigger />
//           </Dialog.Header>
//           <Dialog.Body>
//             <Text>
//               This dialog cannot be opened because the trigger is disabled.
//             </Text>
//           </Dialog.Body>
//           <Dialog.Footer>
//             <Button>Close</Button>
//           </Dialog.Footer>
//         </Dialog.Content>
//       </Dialog.Root>
//     </Stack>
//   ),
// };

// /**
//  * Dialog with custom aria-label for accessibility.
//  */
// export const AriaLabel: Story = {
//   args: {},
//   render: () => (
//     <Stack direction="row">
//       <Dialog.Root aria-label="Settings Dialog">
//         <Dialog.Trigger>Dialog with aria-label</Dialog.Trigger>
//         <Dialog.Content>
//           <Dialog.Backdrop />
//           <Dialog.Header>
//             <Dialog.CloseTrigger />
//           </Dialog.Header>
//           <Dialog.Body>
//             <Text>
//               This dialog has an aria-label set on the root component instead of
//               using a Dialog.Title. This is useful when the dialog doesn't have
//               a visible title or when you want custom labeling.
//             </Text>
//           </Dialog.Body>
//           <Dialog.Footer>
//             <Button>Close</Button>
//           </Dialog.Footer>
//         </Dialog.Content>
//       </Dialog.Root>

//       <Dialog.Root>
//         <Dialog.Trigger>Dialog with Title</Dialog.Trigger>
//         <Dialog.Content>
//           <Dialog.Backdrop />
//           <Dialog.Header>
//             <Dialog.Title>Dialog with Visible Title</Dialog.Title>
//             <Dialog.CloseTrigger />
//           </Dialog.Header>
//           <Dialog.Body>
//             <Text>
//               This dialog uses a Dialog.Title component for accessibility
//               labeling.
//             </Text>
//           </Dialog.Body>
//           <Dialog.Footer>
//             <Button>Close</Button>
//           </Dialog.Footer>
//         </Dialog.Content>
//       </Dialog.Root>
//     </Stack>
//   ),
// };
