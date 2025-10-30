import type { ReactNode } from "react";
import {
  type SelectProps as RaSelectProps,
  type ListBoxProps as RaListBoxProps,
  type ListBoxItemProps as RaListBoxItemProps,
  type ListBoxSectionProps as RaListBoxSectionProps,
} from "react-aria-components";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { OmitUnwantedProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type SelectRecipeProps = {
  /**
   * Size variant of the select
   */
  size?: SlotRecipeProps<"select">["size"];
  /**
   * Visual style variant of the select
   */
  variant?: SlotRecipeProps<"select">["variant"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type SelectRootSlotProps = HTMLChakraProps<
  "div",
  SelectRecipeProps & RaSelectProps<object>
>;

export type SelectTriggerSlotProps = HTMLChakraProps<"button">;

export type SelectTriggerLabelSlotProps = HTMLChakraProps<"span">;

export type SelectOptionsSlotProps = HTMLChakraProps<"div">;

export type SelectOptionSlotProps = HTMLChakraProps<"div">;

export type SelectOptionGroupSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

export type SelectRootProps = OmitUnwantedProps<SelectRootSlotProps> &
  RaSelectProps & {
    /**
     * Whether the select is in a loading state
     * @default false
     */
    isLoading?: boolean;
    /**
     * Children elements (must be ReactNode, no render props/functions allowed)
     */
    children: ReactNode;
    /**
     * Optional element to display at the start of the input field
     * Respects text direction (left in LTR, right in RTL)
     */
    leadingElement?: ReactNode;
    /**
     * Whether to show a clear button when a value is selected
     * @default false
     */
    isClearable?: boolean;
    /**
     * Ref forwarding to the root element
     */
    ref?: React.Ref<HTMLDivElement>;
  };

export type SelectOptionsProps<T> = RaListBoxProps<T> &
  OmitUnwantedProps<SelectOptionsSlotProps, keyof RaListBoxProps<T>>;

export type SelectOptionProps = Omit<
  RaListBoxItemProps,
  | "onClick"
  | "translate"
  | "onBlur"
  | "onFocus"
  | "onKeyDown"
  | "onKeyUp"
  | "onMouseDown"
  | "onMouseUp"
> &
  OmitUnwantedProps<SelectOptionSlotProps, keyof RaListBoxItemProps> & {
    /**
     * Ref forwarding to the option element
     */
    ref?: React.Ref<HTMLDivElement>;
  };

export type SelectOptionGroupProps<T> = RaListBoxSectionProps<T> &
  OmitUnwantedProps<
    SelectOptionGroupSlotProps,
    keyof RaListBoxSectionProps<T>
  > & {
    /**
     * Label text for the option group section
     */
    label: string;
  };
