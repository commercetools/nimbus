import React from "react";
import { DialogTrigger as RaDialogTrigger } from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { DrawerRootSlot } from "../drawer.slots";
import type { DrawerRootProps } from "../drawer.types";
import { DrawerProvider } from "./drawer.context";
import { drawerSlotRecipe } from "../drawer.recipe";

export const DrawerRoot = function DrawerRoot(props: DrawerRootProps) {
  const recipe = useSlotRecipe({ recipe: drawerSlotRecipe });
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
