import React from "react";
import { DialogTrigger as RaDialogTrigger } from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { DialogRootSlot } from "../dialog.slots";
import type { DialogRootProps } from "../dialog.types";
import { DialogProvider } from "./dialog.context";

export const DialogRoot = function DialogRoot(props: DialogRootProps) {
  const recipe = useSlotRecipe({ key: "dialog" });
  // Extract recipe props
  const [recipeProps] = recipe.splitVariantProps(props);
  // Extract props that are usable on RaDialogTrigger
  const { children, isOpen, onOpenChange, defaultOpen = false } = props;

  const content = <DialogRootSlot {...recipeProps}>{children}</DialogRootSlot>;

  // Check if any direct child is a Dialog.Trigger component
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
        // When no Dialog.Trigger, skip using RaDialogTrigger to avoid console.warning's
        content
      )}
    </DialogProvider>
  );
};

DialogRoot.displayName = "Dialog.Root";
