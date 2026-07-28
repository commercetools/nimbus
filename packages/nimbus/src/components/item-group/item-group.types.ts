import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";

// ============================================================
// SLOT PROPS
// ============================================================

export type ItemGroupRootSlotProps = HTMLChakraProps<"div">;
export type ItemGroupSeparatorSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/** Props for the `ItemGroup.Root` component. */
export type ItemGroupRootProps = OmitInternalProps<ItemGroupRootSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};

/** Props for the `ItemGroup.Separator` component. */
export type ItemGroupSeparatorProps =
  OmitInternalProps<ItemGroupSeparatorSlotProps> & {
    ref?: React.Ref<HTMLDivElement>;
  };
