import { Button as RaButton } from "react-aria-components";
import { ChevronRight } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import { TreeIndicatorSlot } from "../tree.slots";
import type { TreeIndicatorProps } from "../tree.types";

/**
 * Tree.Indicator
 *
 * The expand/collapse chevron button. React Aria wires it to the row's
 * expansion state via the `chevron` slot, and provides a localized accessible
 * name. The recipe hides it for leaf items and rotates it when expanded.
 * Renders a default chevron icon that can be overridden via `children`.
 *
 * @supportsStyleProps
 */
export const TreeIndicator = ({
  children,
  ref,
  ...props
}: TreeIndicatorProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <TreeIndicatorSlot asChild {...styleProps}>
      <RaButton
        slot="chevron"
        data-slot="indicator"
        ref={ref}
        {...functionalProps}
      >
        {children ?? <ChevronRight />}
      </RaButton>
    </TreeIndicatorSlot>
  );
};

TreeIndicator.displayName = "Tree.Indicator";
