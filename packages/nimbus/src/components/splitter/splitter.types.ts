import type {
  RecipeVariantProps,
  HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type { ReactNode } from "react";
import { splitterSlotRecipe } from "./splitter.recipe";

// ============================================================
// Root Component (`<Splitter.Root>`)
// ============================================================

export interface SplitterRootProps extends HTMLChakraProps<
  "div",
  RecipeVariantProps<typeof splitterSlotRecipe>
> {
  /**
   * The orientation of the splitter
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * The controlled value of the splitter (percentage of primary pane)
   */
  value?: number;

  /**
   * The default value of the splitter (percentage of primary pane)
   * @default 50
   */
  defaultValue?: number;

  /**
   * Callback fired when the value changes
   */
  onValueChange?: (value: number) => void;

  /**
   * The minimum value (percentage)
   * @default 0
   */
  minValue?: number;

  /**
   * The maximum value (percentage)
   * @default 100
   */
  maxValue?: number;

  /**
   * Whether the splitter is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * The step size for keyboard navigation
   * @default 5
   */
  step?: number;

  /**
   * The children of the splitter (should contain exactly 2 Panes and 1 Separator)
   */
  children: ReactNode;
}

// ============================================================
// Pane Component (`<Splitter.Pane>`)
// ============================================================

export interface SplitterPaneProps extends HTMLChakraProps<"div"> {
  /**
   * Whether this is the primary pane (the one that gets resized)
   */
  isPrimary?: boolean;

  /**
   * The content of the pane
   */
  children: ReactNode;
}

// ============================================================
// Separator Component (`<Splitter.Separator>`)
// ============================================================

export interface SplitterSeparatorProps extends HTMLChakraProps<"div"> {
  /**
   * Accessible label for the separator
   * @default "Resize panes"
   */
  "aria-label"?: string;
}
