import { DrawerRoot } from "./components/drawer.root";
import { DrawerTrigger } from "./components/drawer.trigger";
import { DrawerContent } from "./components/drawer.content";
import { DrawerHeader } from "./components/drawer.header";
import { DrawerBody } from "./components/drawer.body";
import { DrawerFooter } from "./components/drawer.footer";
import { DrawerTitle } from "./components/drawer.title";
import { DrawerCloseTrigger } from "./components/drawer.close-trigger";

// Re-export types
export type * from "./drawer.types";

/**
 * Drawer
 * ============================================================
 * A foundational drawer component for overlays that require user attention.
 * Built with React Aria Components for accessibility and WCAG 2.1 AA compliance.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Customizable placement, size, and animations
 * - Focus management and keyboard navigation
 * - Click-outside and Escape key dismissal
 * - Portal rendering support
 * - Backdrop overlay with animations
 *
 * @example
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Trigger>Open Drawer</Drawer.Trigger>
 *   <Drawer.Content size="md" placement="center">
 *     <Drawer.Header>
 *       <Drawer.Title>Drawer Title</Drawer.Title>
 *       <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
 *     </Drawer.Header>
 *     <Drawer.Body>
 *       Drawer content goes here
 *     </Drawer.Body>
 *     <Drawer.Footer>
 *       <button>Cancel</button>
 *       <button>Save</button>
 *     </Drawer.Footer>
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 *
 * @see https://react-spectrum.adobe.com/react-aria/Dialog.html
 */
export const Drawer = {
  Root: DrawerRoot, // MUST BE FIRST - primary entry point
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  CloseTrigger: DrawerCloseTrigger,
};

// Internal exports for react-docgen
export {
  DrawerRoot as _DrawerRoot,
  DrawerTrigger as _DrawerTrigger,
  DrawerContent as _DrawerContent,
  DrawerHeader as _DrawerHeader,
  DrawerBody as _DrawerBody,
  DrawerFooter as _DrawerFooter,
  DrawerTitle as _DrawerTitle,
  DrawerCloseTrigger as _DrawerCloseTrigger,
};
