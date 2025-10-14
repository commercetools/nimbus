import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type ScopedSearchInputRecipeProps = {
  size?: SlotRecipeProps<"scopedSearchInput">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type ScopedSearchInputRootSlotProps = HTMLChakraProps<
  "div",
  ScopedSearchInputRecipeProps
>;

export type ScopedSearchInputContainerSlotProps = HTMLChakraProps<"div">;

export type ScopedSearchInputSelectWrapperSlotProps = HTMLChakraProps<"div">;

export type ScopedSearchInputSearchWrapperSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

export type ScopedSearchInputValue = {
  text: string;
  option: string;
};

export type ScopedSearchInputOption = {
  label: string;
  value: string;
  isDisabled?: boolean;
};

export type ScopedSearchInputOptionGroup = {
  label: string;
  options: ScopedSearchInputOption[];
};

// ============================================================
// MAIN PROPS
// ============================================================

export type ScopedSearchInputProps = Omit<
  ScopedSearchInputRootSlotProps,
  "value" | "onSubmit" | "as" | "asChild"
> & {
  value: ScopedSearchInputValue;
  onValueChange?: (value: ScopedSearchInputValue) => void;
  onTextChange?: (text: string) => void;
  onOptionChange?: (option: string) => void;
  onSubmit: (value: ScopedSearchInputValue) => void;
  onReset?: () => void;
  options: ScopedSearchInputOption[] | ScopedSearchInputOptionGroup[];
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  selectAriaLabel?: string;
  searchAriaLabel?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  id?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
};
