import { DrawerRoot } from "./components/drawer.root";
import { DrawerTrigger } from "./components/drawer.trigger";
import { DrawerContent } from "./components/drawer.content";
import { DrawerBackdrop } from "./components/drawer.backdrop";
import { DrawerHeader } from "./components/drawer.header";
import { DrawerBody } from "./components/drawer.body";
import { DrawerFooter } from "./components/drawer.footer";
import { DrawerTitle } from "./components/drawer.title";
import { DrawerDescription } from "./components/drawer.description";
import { DrawerCloseTrigger } from "./components/drawer.close-trigger";

// Re-export types
export type * from "./drawer.types";

/**
 * Drawer
 * ============================================================
 * A drawer component optimized for edge-positioned sliding panels.
 * Built on the Modal base component with React Aria Components for accessibility and WCAG 2.1 AA compliance.
 * 
 * Perfect for navigation panels, detail views, filters, and mobile-first interfaces.
 * 
 * Key Features:
 * - Edge positioning with automatic placement and animation mapping
 * - Four sides supported: left, right, top, bottom
 * - Controlled and uncontrolled modes
 * - Customizable sizes including drawer-specific narrow/wide variants
 * - Focus management and keyboard navigation
 * - Click-outside and Escape key dismissal
 * - Portal rendering support
 * - Backdrop overlay with animations
 * 
 * The `side` prop automatically configures placement and motion:
 * - side="left" → placement="left", motionPreset="slide-in-left"
 * - side="right" → placement="right", motionPreset="slide-in-right"  
 * - side="top" → placement="top", motionPreset="slide-in-top"
 * - side="bottom" → placement="bottom", motionPreset="slide-in-bottom"
 * 
 * @example
 * // Left navigation drawer
 * <Drawer.Root>
 *   <Drawer.Trigger>Open Menu</Drawer.Trigger>
 *   <Drawer.Content side="left" size="md">
 *     <Drawer.Backdrop />
 *     <Drawer.Header>
 *       <Drawer.Title>Navigation</Drawer.Title>
 *       <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
 *     </Drawer.Header>
 *     <Drawer.Body>
 *       <nav>
 *         <a href="/home">Home</a>
 *         <a href="/about">About</a>
 *       </nav>
 *     </Drawer.Body>
 *   </Drawer.Content>
 * </Drawer.Root>
 * 
 * @example
 * // Right detail panel drawer
 * <Drawer.Root>
 *   <Drawer.Trigger>View Details</Drawer.Trigger>
 *   <Drawer.Content side="right" size="wide">
 *     <Drawer.Backdrop />
 *     <Drawer.Header>
 *       <Drawer.Title>Product Details</Drawer.Title>
 *       <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
 *     </Drawer.Header>
 *     <Drawer.Body>
 *       <Drawer.Description>
 *         Detailed product information and specifications.
 *       </Drawer.Description>
 *       product details
 *     </Drawer.Body>
 *     <Drawer.Footer>
 *       <button>Add to Cart</button>
 *       <button>Buy Now</button>
 *     </Drawer.Footer>
 *   </Drawer.Content>
 * </Drawer.Root>
 * 
 * @example
 * // Bottom mobile action sheet
 * <Drawer.Root>
 *   <Drawer.Trigger>Show Options</Drawer.Trigger>
 *   <Drawer.Content side="bottom" size="sm">
 *     <Drawer.Backdrop />
 *     <Drawer.Header>
 *       <Drawer.Title>Actions</Drawer.Title>
 *       <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
 *     </Drawer.Header>
 *     <Drawer.Body>
 *       <button>Share</button>
 *       <button>Copy Link</button>
 *       <button>Delete</button>
 *     </Drawer.Body>
 *   </Drawer.Content>
 * </Drawer.Root>
 * 
 * @see https://react-spectrum.adobe.com/react-aria/Dialog.html
 * @see Modal component (the base component this extends)
 */
export const Drawer = {
  Root: DrawerRoot,            // MUST BE FIRST - primary entry point
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Backdrop: DrawerBackdrop,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  CloseTrigger: DrawerCloseTrigger,
};

// Internal exports for react-docgen
export {
  DrawerRoot as _DrawerRoot,
  DrawerTrigger as _DrawerTrigger,
  DrawerContent as _DrawerContent,
  DrawerBackdrop as _DrawerBackdrop,
  DrawerHeader as _DrawerHeader,
  DrawerBody as _DrawerBody,
  DrawerFooter as _DrawerFooter,
  DrawerTitle as _DrawerTitle,
  DrawerDescription as _DrawerDescription,
  DrawerCloseTrigger as _DrawerCloseTrigger,
};