import { defineTextStyles } from "@chakra-ui/react";

type TextStylesType = ReturnType<typeof defineTextStyles>;

export const textStyles: TextStylesType = defineTextStyles({
  "2xs": {
    value: {
      fontSize: "300",
      lineHeight: "0.75rem",
    },
  },
  xs: {
    value: {
      fontSize: "350",
    },
  },
  sm: {
    value: {
      fontSize: "400",
    },
  },
  md: {
    value: {
      fontSize: "450",
    },
  },
  lg: {
    value: {
      fontSize: "500",
    },
  },
  xl: {
    value: {
      fontSize: "600",
    },
  },
  "2xl": {
    value: {
      fontSize: "600",
    },
  },
  "3xl": {
    value: {
      fontSize: "600",
    },
  },
  "4xl": {
    value: {
      fontSize: "600",
    },
  },
  none: {
    value: {},
  },
});
