import { useRef } from "react";
import { Modal as RaModal, Dialog as RaDialog } from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
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
export const DialogContent = (props: DialogContentProps) => {
  const {
    ref: forwardedRef,
    children,
    isPortalled = true,
    portalContainer,
    hasBackdrop = true,
    isDismissable = true,
    isKeyboardDismissDisabled = false,
    onClose,
    ...restProps
  } = props;

  const recipe = useSlotRecipe({ key: "dialog" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(restProps);

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLDivElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [styleProps, htmlProps] = extractStyleProps(restRecipeProps);

  return (
    <RaModal
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    >
      <DialogPositionerSlot {...recipeProps} {...styleProps}>
        <DialogContentSlot asChild {...htmlProps}>
          <RaDialog ref={ref}>{children}</RaDialog>
        </DialogContentSlot>
      </DialogPositionerSlot>
    </RaModal>
  );
};

DialogContent.displayName = "Dialog.Content";
