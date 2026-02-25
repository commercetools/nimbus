import { defineSlotRecipe } from "@chakra-ui/react";

export const richTextInputRecipe = defineSlotRecipe({
  slots: ["root", "toolbar", "editable"],
  className: "nimbus-rich-text-input",
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      width: "full",
      borderRadius: "200",
      borderWidth: "{sizes.25}",
      colorPalette: "slate",
      borderColor: "colorPalette.7",
      backgroundColor: "colorPalette.contrast",
      _focusWithin: {
        layerStyle: "focusRing",
      },
      // Invalid state styling
      "&[data-invalid='true']": {
        borderWidth: "{sizes.50}",
        borderColor: "critical.7",
      },
    },
    toolbar: {
      boxShadow: "1",

      // Disabled state styling for toolbar
      "[data-disabled='true'] &": {
        opacity: "0.5",
      },
    },
    editable: {
      position: "relative", // Required for Slate's absolutely-positioned placeholder
      padding: "400",
      minHeight: "inherit",
      maxHeight: "inherit",
      overflow: "auto",
      outline: "none",
      color: "colorPalette.12",

      // Disabled state styling for editable
      "[data-disabled='true'] &": {
        cursor: "not-allowed",
        opacity: "0.5",
      },

      "& [data-slate-placeholder]": {
        opacity: "0.5!",
        paddingTop: "400",
      },
      // Styling for user-facing editor text
      "& p": {
        textStyle: "md",
        fontWeight: "500",
      },
      "& h1": {
        textStyle: "2xl",
        fontWeight: "500",
      },
      "& h2": {
        textStyle: "xl",
        fontWeight: "500",
      },
      "& h3": {
        textStyle: "lg",
        fontWeight: "500",
      },
      "& h4": {
        textStyle: "md",
        fontWeight: "500",
      },
      "& h5": {
        textStyle: "xs",
        fontWeight: "500",
      },
      "& blockquote": {
        textStyle: "md",
        fontWeight: "400",
        borderLeftWidth: "{sizes.100}",
        paddingLeft: "400",
      },
      "& ul": {
        paddingLeft: "600",
        listStyleType: "disc",
      },
      "& ol": {
        paddingLeft: "600",
        listStyleType: "decimal",
      },
      "& code": {
        padding: "100",
        fontFamily: "mono",
      },
      "& pre": {
        padding: "300",
        borderRadius: "200",
        overflow: "auto",
        "& code": {
          padding: "0",
        },
      },
      "& a": {
        color: "primary.11",
        textDecoration: "underline",
        cursor: "pointer",
        _hover: {
          textDecoration: "none",
        },
      },
      "& strong": {
        fontWeight: "700",
      },
      "& em": {
        fontStyle: "italic",
      },
      "& u": {
        textDecoration: "underline",
      },
      "& del": {
        textDecoration: "line-through",
      },
      "& sup": {
        fontSize: "75%",
        verticalAlign: "super",
        lineHeight: "0",
      },
      "& sub": {
        fontSize: "75%",
        verticalAlign: "sub",
        lineHeight: "0",
      },
    },
  },
  variants: {},
});
