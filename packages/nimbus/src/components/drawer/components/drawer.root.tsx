import { DialogTrigger as RaDialogTrigger } from "react-aria-components";
import { DrawerRootSlot } from "../drawer.slots";
import type { DrawerRootProps } from "../drawer.types";

/**
 * # Drawer.Root
 * 
 * The root component that provides context and state management for the drawer.
 * Uses React Aria's DialogTrigger for accessibility and keyboard interaction.
 * 
 * This component must wrap all drawer parts (Trigger, Content, etc.) and provides
 * the drawer open/close state and variant styling context.
 * 
 * @example
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Trigger>Open Drawer</Drawer.Trigger>
 *   <Drawer.Content side="left">
 *     <Drawer.Header>
 *       <Drawer.Title>Drawer Title</Drawer.Title>
 *     </Drawer.Header>
 *     <Drawer.Body>Drawer content</Drawer.Body>
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 */
export const DrawerRoot = (props: DrawerRootProps) => {
  const {
    children,
    isOpen,
    onOpenChange,
    defaultOpen = false,
    isDisabled = false,
    ...restProps
  } = props;

  return (
    <DrawerRootSlot {...restProps}>
      <RaDialogTrigger
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        defaultOpen={defaultOpen}
        isDisabled={isDisabled}
      >
        {children}
      </RaDialogTrigger>
    </DrawerRootSlot>
  );
};

DrawerRoot.displayName = "Drawer.Root";