import { forwardRef } from "react";
import { Modal as RaModal, Dialog as RaDialog } from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { DialogPositionerSlot, DialogContentSlot } from "../dialog.slots";
import type { DialogContentProps } from "../dialog.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * # Dialog.Content
 *
 * The main dialog content container that wraps React Aria's Modal and Dialog.
 * Handles portalling, backdrop, positioning, and content styling.
 *
 * This component creates the dialog overlay, positions the content, and provides
 * accessibility features like focus management and keyboard dismissal.
 *
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Content size="md" placement="center">
 *     <Dialog.Header>
 *       <Dialog.Title>Title</Dialog.Title>
 *     </Dialog.Header>
 *     <Dialog.Body>Content</Dialog.Body>
 *     <Dialog.Footer>Actions</Dialog.Footer>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  (props, ref) => {
    const recipe = useSlotRecipe({ key: "dialog" });
    const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
    
    const {
      children,
      isPortalled = true,
      portalContainer,
      hasBackdrop = true,
      isDismissable = true,
      isKeyboardDismissDisabled = false,
      onClose,
      ...restProps
    } = restRecipeProps;
    
    const [styleProps, htmlProps] = extractStyleProps(restProps);

    return (
      <RaModal
        isDismissable={isDismissable}
        isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      >
        <DialogPositionerSlot {...recipeProps} {...styleProps}>
          <DialogContentSlot 
            ref={ref} 
            asChild 
            {...htmlProps}
          >
            <RaDialog>{children}</RaDialog>
          </DialogContentSlot>
        </DialogPositionerSlot>
      </RaModal>
    );
  }
);

DialogContent.displayName = "Dialog.Content";
