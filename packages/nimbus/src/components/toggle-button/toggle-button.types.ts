import type {
  HTMLChakraProps,
  RecipeProps,
} from "@chakra-ui/react/styled-system";
import type { ToggleButtonProps as RaToggleButtonProps } from "react-aria-components";
import type { SemanticPalettesOnly } from "@/type-utils";

// ============================================================
// RECIPE PROPS
// ============================================================

type ToggleButtonRecipeProps = {
  /**
   * Size variant of the toggle button
   * @default "md"
   */
  size?: RecipeProps<"nimbusToggleButton">["size"];
  /**
   * Resting chrome of the toggle button — always neutral. `colorPalette` is
   * reserved for the active state.
   * @default "outline"
   */
  variant?: RecipeProps<"nimbusToggleButton">["variant"];
  /**
   * Weight of the active (selected) fill: `tint` (light accent wash) or `solid`
   * (full accent fill).
   * @default "tint"
   */
  activeFillStyle?: RecipeProps<"nimbusToggleButton">["activeFillStyle"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type ToggleButtonRootSlotProps = Omit<
  HTMLChakraProps<"button", ToggleButtonRecipeProps>,
  "colorPalette"
> & {
  /**
   * Color palette for the toggle button
   */
  colorPalette?: SemanticPalettesOnly;
};

// ============================================================
// HELPER TYPES
// ============================================================

type ExcludedProps = "css" | "colorScheme" | "recipe" | "as" | "asChild";

// ============================================================
// MAIN PROPS
// ============================================================

export type ToggleButtonProps = Omit<
  ToggleButtonRootSlotProps,
  keyof RaToggleButtonProps | ExcludedProps
> &
  RaToggleButtonProps & {
    /**
     * Ref forwarding to the button element
     */
    ref?: React.Ref<HTMLButtonElement>;
  };
