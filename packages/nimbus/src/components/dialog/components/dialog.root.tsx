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
export const DialogRoot = (props: DialogRootProps) => {
  const recipe = useSlotRecipe({ key: "dialog" });
  const [recipeProps, restProps] = recipe.splitVariantProps(props);
  
  const {
    children,
    isOpen,
    onOpenChange,
    defaultOpen = false,
    ...dialogTriggerProps
  } = restProps;

  return (
    <DialogProvider value={recipeProps}>
      <DialogRootSlot {...recipeProps}>
        <RaDialogTrigger
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          defaultOpen={defaultOpen}
          {...dialogTriggerProps}
        >
          {children}
        </RaDialogTrigger>
      </DialogRootSlot>
    </DialogProvider>
  );
};

DialogRoot.displayName = "Dialog.Root";
