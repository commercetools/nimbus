import React from "react";
import { DialogTrigger as RaDialogTrigger } from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { DrawerRootSlot } from "../drawer.slots";
import type { DrawerRootProps } from "../drawer.types";
import { DrawerProvider } from "./drawer.context";

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
 *   <Drawer.Content>
 *     <Drawer.Header>
 *       <Drawer.Title>Drawer Title</Drawer.Title>
 *     </Drawer.Header>
 *     <Drawer.Body>Drawer content</Drawer.Body>
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 */
export const DrawerRoot = function DrawerRoot(props: DrawerRootProps) {
  const recipe = useSlotRecipe({ key: "drawer" });
  // Extract recipe props
  const [recipeProps] = recipe.splitVariantProps(props);
  // Extract props that are usable on RaDialogTrigger
  const { children, isOpen, onOpenChange, defaultOpen = false } = props;

  const content = <DrawerRootSlot {...recipeProps}>{children}</DrawerRootSlot>;

  // Check if any child is a Drawer.Trigger component
  // React Aria's DialogTrigger needs a pressable child, so we only use it when there's a trigger
  const hasDrawerTrigger = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child) && typeof child.type === "function") {
      const displayName = (
        child.type as React.ComponentType & { displayName?: string }
      )?.displayName;
      return (
        displayName === "DrawerTrigger" || displayName === "Drawer.Trigger"
      );
    }
    return false;
  });

  // Share all props (config + variant props) with the Drawer subcomponents
  return (
    <DrawerProvider value={props}>
      {hasDrawerTrigger ? (
        // When there's a Drawer.Trigger, use DialogTrigger for React Aria integration
        <RaDialogTrigger
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          defaultOpen={defaultOpen}
        >
          {content}
        </RaDialogTrigger>
      ) : (
        // When no Drawer.Trigger, skip DialogTrigger to avoid the warning
        content
      )}
    </DrawerProvider>
  );
};

DrawerRoot.displayName = "Drawer.Root";
