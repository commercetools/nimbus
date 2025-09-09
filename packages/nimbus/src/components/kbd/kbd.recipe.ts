import { defineRecipe } from "@chakra-ui/react/styled-system";

export const kbdRecipe = defineRecipe({
  className: "nimbus-kbd",
  base: {
    display: "inline-flex",
    color: "inherit",
    fontSize: ".875em",
    lineHeight: "1",
    alignItems: "center",
    fontWeight: "500",
    fontFamily: "mono",
    flexShrink: "0",
    whiteSpace: "nowrap",
    userSelect: "none",
    px: "150",
    py: "100",
    borderRadius: "100",
    border: "solid-25",
    borderBottom: "solid-50",
    borderColor: "currentColor",
  },
});
