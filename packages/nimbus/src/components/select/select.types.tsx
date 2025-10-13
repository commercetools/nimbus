import type { ReactNode } from "react";
import {
  type SelectProps as RaSelectProps,
  type ListBoxProps as RaListBoxProps,
  type ListBoxItemProps as RaListBoxItemProps,
  type ListBoxSectionProps as RaListBoxSectionProps,
} from "react-aria-components";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";

export type SelectRecipeProps = {
  size?: SlotRecipeProps<"select">["size"];
  variant?: SlotRecipeProps<"select">["variant"];
};

export type SelectRootSlotProps = HTMLChakraProps<
  "div",
  SelectRecipeProps & RaSelectProps<object>
>;

export type SelectTriggerSlotProps = HTMLChakraProps<"button">;

export type SelectTriggerLabelSlotProps = HTMLChakraProps<"span">;

export type SelectOptionsSlotProps = HTMLChakraProps<"div">;

export type SelectOptionSlotProps = HTMLChakraProps<"div">;

export type SelectOptionGroupSlotProps = HTMLChakraProps<"div">;

export type SelectRootProps = SelectRootSlotProps &
  RaSelectProps & {
    /** set to true if Select is currently busy with something */
    isLoading?: boolean;
    /** Children must be ReactNode, no render props/functions allowed */
    children: ReactNode;
    /**
     * Optional element to display at the start of the input
     * Will respect text direction (left in LTR, right in RTL)
     */
    leadingElement?: ReactNode;
    /** Whether the select should show a clear button when a value is selected */
    isClearable?: boolean;
    /**
     * React ref to be forwarded to the root element
     */
    ref?: React.Ref<HTMLDivElement>;
  };

// Fix the incompatible event handler types by using a more specific type
export interface SelectOptionsProps<T>
  extends RaListBoxProps<T>,
    Omit<SelectOptionsSlotProps, keyof RaListBoxProps<T>> {}

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
  Omit<SelectOptionSlotProps, keyof RaListBoxItemProps> & {
    /**
     * React ref to be forwarded to the option element
     */
    ref?: React.Ref<HTMLDivElement>;
  };

export type SelectOptionGroupProps<T> = RaListBoxSectionProps<T> &
  Omit<SelectOptionGroupSlotProps, keyof RaListBoxSectionProps<T>> & {
    /** the label for the section */
    label: string;
  };
