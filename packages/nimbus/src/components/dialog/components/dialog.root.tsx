import React from "react";
import { DialogTrigger as RaDialogTrigger } from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { DialogRootSlot } from "../dialog.slots";
import type { DialogRootProps } from "../dialog.types";
import { DialogProvider } from "./dialog.context";

/**
 * # Dialog.Root
 *
 * The root component that provides context and state management for the dialog.
 * Uses React Aria's DialogTrigger for accessibility and keyboard interaction.
 *
 * This component must wrap all dialog parts (Trigger, Content, etc.) and provides
 * the dialog open/close state and variant styling context.
 *
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Header>
 *       <Dialog.Title>Dialog Title</Dialog.Title>
 *     </Dialog.Header>
 *     <Dialog.Body>Dialog content</Dialog.Body>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export const DialogRoot = function DialogRoot(props: DialogRootProps) {
  const recipe = useSlotRecipe({ key: "dialog" });
  // Extract recipe props
  const [recipeProps] = recipe.splitVariantProps(props);
  // Extract props that are usable on RaDialogTrigger
  const { children, isOpen, onOpenChange, defaultOpen = false } = props;

  const content = <DialogRootSlot {...recipeProps}>{children}</DialogRootSlot>;

  // Check if any child is a Dialog.Trigger component
  // React Aria's DialogTrigger needs a pressable child, so we only use it when there's a trigger
  const hasDialogTrigger = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child) && typeof child.type === "function") {
      const displayName = (
        child.type as React.ComponentType & { displayName?: string }
      )?.displayName;
      return (
        displayName === "DialogTrigger" || displayName === "Dialog.Trigger"
      );
    }
    return false;
  });

  // Share all props (config + variant props) with the Dialog subcomponents
  return (
    <DialogProvider value={props}>
      {hasDialogTrigger ? (
        // When there's a Dialog.Trigger, use DialogTrigger for React Aria integration
        <RaDialogTrigger
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          defaultOpen={defaultOpen}
        >
          {content}
        </RaDialogTrigger>
      ) : (
        // When no Dialog.Trigger, skip DialogTrigger to avoid the warning
        content
      )}
    </DialogProvider>
  );
};

DialogRoot.displayName = "Dialog.Root";
