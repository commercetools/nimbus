import { IconButton } from "@/components";
import type { FloatingActionButtonProps } from "./floating-action-button.types.ts";

const FloatingActionButtonComponent = (props: FloatingActionButtonProps) => {
  return (
    <IconButton
      variant="solid"
      colorPalette="primary"
      borderRadius="full"
      boxShadow="3"
      width="1200"
      height="1200"
      zIndex="fab"
      {...props}
    />
  );
};

FloatingActionButtonComponent.displayName = "FloatingActionButton";

/**
 * ### FloatingActionButton
 *
 * A circular, elevated icon button for a single, prominent action — designed as
 * an agent panel trigger or similar high-priority action. It is a thin wrapper
 * around {@link IconButton}, so it inherits all button behavior, accessibility,
 * and props (including IconButton's accessible-label requirement).
 *
 * Placement is the consumer's responsibility via standard style props
 * (`position="fixed"`, `insetBlockEnd`, `insetInlineEnd`, …).
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/floating-action-button}
 */
export const FloatingActionButton: typeof FloatingActionButtonComponent =
  FloatingActionButtonComponent;
