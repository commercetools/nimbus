import type {
  HTMLChakraProps,
  ConditionalValue,
} from "@chakra-ui/react/styled-system";
import type { SystemStyleObject } from "@chakra-ui/react/styled-system";

// ============================================================
// HELPER TYPES
// ============================================================

type StackDirection = ConditionalValue<
  "row" | "column" | "row-reverse" | "column-reverse"
>;

// ============================================================
// STACK OPTIONS
// ============================================================

interface StackOptions {
  /**
   * Shorthand for `alignItems` style prop
   */
  align?: SystemStyleObject["alignItems"];
  /**
   * Shorthand for `justifyContent` style prop
   */
  justify?: SystemStyleObject["justifyContent"];
  /**
   * Shorthand for `flexWrap` style prop
   */
  wrap?: SystemStyleObject["flexWrap"];
  /**
   * The direction to stack the items.
   * @default "column"
   */
  direction?: StackDirection;
  /**
   * If provided, each stack item will show a separator
   */
  separator?: React.ReactElement;
}

// ============================================================
// SLOT PROPS
// ============================================================

type StackRootSlotProps = HTMLChakraProps<"div", StackOptions>;

// ============================================================
// MAIN PROPS
// ============================================================

export type StackProps = Omit<StackRootSlotProps, "asChild" | "css"> & {
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
};
