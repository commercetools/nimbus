import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { SearchFieldProps as RaSearchFieldProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type SearchInputRecipeProps = {
  size?: SlotRecipeProps<"searchInput">["size"];
  variant?: SlotRecipeProps<"searchInput">["variant"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type SearchInputRootSlotProps = HTMLChakraProps<
  "div",
  SearchInputRecipeProps
>;

export type SearchInputLeadingElementSlotProps = HTMLChakraProps<"div">;

export type SearchInputInputSlotProps = HTMLChakraProps<"input">;

// ============================================================
// MAIN PROPS
// ============================================================

export type SearchInputProps = Omit<
  SearchInputRootSlotProps,
  keyof RaSearchFieldProps | "as" | "asChild"
> &
  Omit<RaSearchFieldProps, "ref"> & {
    ref?: React.Ref<HTMLInputElement>;
    placeholder?: string;
  };
