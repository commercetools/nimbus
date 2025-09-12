import { DialogTrigger as RaDialogTrigger } from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { DialogRootSlot } from "../dialog.slots";
import type { DialogRootProps } from "../dialog.types";
import { DialogProvider } from "./dialog.context";
import { memo } from "react";

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
export const DialogRoot = memo(function DialogRoot(props: DialogRootProps) {
  const recipe = useSlotRecipe({ key: "dialog" });
  // Extract recipe props
  const [recipeProps] = recipe.splitVariantProps(props);
  // Extract props that are usable on RaDialogTrigger
  const { children, isOpen, onOpenChange, defaultOpen = false } = props;

  return (
    // Share all props (config + variant props) with the Dialog subcomponents
    <DialogProvider value={props}>
      <DialogRootSlot {...recipeProps}>
        <RaDialogTrigger
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          defaultOpen={defaultOpen}
        >
          {children}
        </RaDialogTrigger>
      </DialogRootSlot>
    </DialogProvider>
  );
});

DialogRoot.displayName = "Dialog.Root";
