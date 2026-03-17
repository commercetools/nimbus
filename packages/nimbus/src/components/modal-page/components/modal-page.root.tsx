import { useCallback } from "react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { Drawer } from "../../drawer/drawer";
import { modalPageRecipe } from "../modal-page.recipe";
import { ModalPageRootSlot } from "../modal-page.slots";
import type { ModalPageRootProps } from "../modal-page.types";

/**
 * ModalPage.Root — renders a fullscreen Drawer (placement="right") with a grid layout.
 *
 * Hardcodes fullscreen overrides on the Drawer.Content element:
 * - width: calc(100vw - token(spacing.1200))
 * - height: 100dvh, maxH: 100dvh
 * - borderRadius: 0
 * - custom boxShadow
 *
 * @supportsStyleProps
 */
export const ModalPageRoot = ({
  ref,
  isOpen,
  onClose,
  shouldDelayOnClose = false,
  children,
}: ModalPageRootProps) => {
  const recipe = useSlotRecipe({ recipe: modalPageRecipe });
  const [recipeProps] = recipe.splitVariantProps({});

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        if (shouldDelayOnClose) {
          setTimeout(() => {
            onClose();
          }, 300);
        } else {
          onClose();
        }
      }
    },
    [onClose, shouldDelayOnClose]
  );

  return (
    <Drawer.Root
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      placement="right"
      isDismissable={false}
      isKeyboardDismissDisabled={false}
    >
      <Drawer.Content
        width="calc(100vw - var(--spacing-1200, 48px))"
        height="100dvh"
        maxH="100dvh"
        borderRadius="0"
        boxShadow="-4px 0px 24px 0px {colors.neutral.a4}"
      >
        <ModalPageRootSlot ref={ref} {...recipeProps}>
          {children}
        </ModalPageRootSlot>
      </Drawer.Content>
    </Drawer.Root>
  );
};

ModalPageRoot.displayName = "ModalPage.Root";
