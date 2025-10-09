import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const scopedSearchInputSlotRecipe = defineSlotRecipe({
  slots: ["root", "container", "selectWrapper", "searchWrapper"],
  className: "nimbus-scoped-search-input",
  base: {
    root: {
      display: "inline-block",
      position: "relative",
      width: "100%",
    },
    container: {
      display: "inline-flex",
      alignItems: "stretch",
      position: "relative",
      width: "100%",
    },
    selectWrapper: {
      // Ensure focus ring is visible
      _focusWithin: {
        zIndex: 2,
      },
      // Target the nested Select trigger to remove right border radius
      "& .nimbus-select__trigger": {
        borderRightRadius: "0",
        // Show only 3 sides of border (left, top, bottom)
        boxShadow:
          "inset 0 1px 0 0 {colors.neutral.7}, inset 0 -1px 0 0 {colors.neutral.7}, inset 1px 0 0 0 {colors.neutral.7}",
      },
    },
    searchWrapper: {
      flex: 1,
      // Ensure focus ring is visible
      _focusWithin: {
        zIndex: 2,
      },
      // Target the nested SearchInput to remove left border radius
      "& .nimbus-search-input__root": {
        borderLeftRadius: "0",
      },
    },
  },
  variants: {
    size: {
      sm: {},
      md: {},
    },
  },
  defaultVariants: {
    size: "md",
  },
});
