import type { ReactNode } from "react";
import type {
  MenuTriggerProps as RaMenuTriggerProps,
  MenuProps as RaMenuProps,
} from "react-aria-components";
import type { ButtonProps } from "../button/button.types";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type SplitButtonRecipeProps = SlotRecipeProps<"nimbusSplitButton">;

// ============================================================
// SLOT PROPS
// ============================================================

export type SplitButtonRootSlotProps = HTMLChakraProps<
  "div",
  SplitButtonRecipeProps
>;

export type SplitButtonButtonGroupSlotProps = HTMLChakraProps<"div">;

export type SplitButtonPrimaryButtonSlotProps = HTMLChakraProps<"button">;

export type SplitButtonTriggerSlotProps = HTMLChakraProps<"button">;

// ============================================================
// MAIN PROPS
// ============================================================
export type SplitButtonProps = SplitButtonRecipeProps &
  Pick<ButtonProps, "size" | "colorPalette" | "variant" | "isDisabled"> &
  Omit<RaMenuTriggerProps, "trigger" | "children"> &
  Required<Pick<RaMenuProps<object>, "onAction">> & {
    /**
     * Accessibility label for the dropdown trigger
     */
    "aria-label": string;
    /**
     * Icon element to display in the primary button (automatically wrapped in Icon component)
     */
    icon?: ReactNode;
    /**
     * Children should contain Menu components: Menu.Item, Menu.Section, Menu.Separator
     *
     * The component automatically selects the first enabled Menu.Item as the primary action.
     */
    children: ReactNode;
  };
