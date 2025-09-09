/**
 * Drawer Component
 * ============================================================
 *
 * A drawer component optimized for edge-positioned sliding panels.
 * Built on the Modal base component with automatic placement and motion mapping.
 *
 * Perfect for:
 * - Navigation panels (left/right)
 * - Detail views (right)
 * - Notifications (top)
 * - Action sheets (bottom)
 * - Mobile-first interfaces
 *
 * @see {@link https://react-spectrum.adobe.com/react-aria/Dialog.html} React Aria Dialog
 */

// Main component export
export { Drawer } from "./drawer";

// Type exports
export type {
  DrawerRootProps,
  DrawerTriggerProps,
  DrawerContentProps,
  DrawerBackdropProps,
  DrawerHeaderProps,
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  DrawerCloseTriggerProps,
  DrawerSide,
  DrawerSize,
  DrawerPlacement,
  DrawerScrollBehavior,
  DrawerMotionPreset,
} from "./drawer.types";

// Recipe export for external styling
export { drawerSlotRecipe } from "./drawer.recipe";
