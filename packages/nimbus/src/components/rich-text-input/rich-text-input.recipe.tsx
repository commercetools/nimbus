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
      borderWidth: "1px",
      colorPalette: "slate",
      borderColor: "colorPalette.7",
      backgroundColor: "bg.default",

      // Invalid state styling
      "&[data-invalid='true']": {
        borderWidth: "2px",
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
      padding: "400",
      minHeight: "inherit",
      outline: "none",

      // Disabled state styling for editable
      "[data-disabled='true'] &": {
        cursor: "not-allowed",
        opacity: "0.5",
      },

      // Styling for user-facing editor text
      "& h1": {
        fontSize: "600",
        fontWeight: "600",
        lineHeight: "600",
      },
      "& h2": {
        fontSize: "500",
        fontWeight: "600",
        lineHeight: "500",
      },
      "& h3": {
        fontSize: "450",
        fontWeight: "600",
        lineHeight: "450",
      },
      "& h4": {
        fontSize: "400",
        fontWeight: "600",
        lineHeight: "400",
      },
      "& h5": {
        fontSize: "350",
        fontWeight: "600",
        lineHeight: "350",
      },
      "& blockquote": {
        borderLeftWidth: "4px",
        borderLeftColor: "accent.emphasized",
        paddingLeft: "400",
        color: "fg.subtle",
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
        backgroundColor: "bg.subtle",
        padding: "100",
        borderRadius: "100",
        fontSize: "90%",
        fontFamily: "mono",
      },
      "& pre": {
        backgroundColor: "bg.subtle",
        padding: "300",
        borderRadius: "200",
        overflow: "auto",
        "& code": {
          backgroundColor: "transparent",
          padding: "0",
        },
      },
      "& a": {
        color: "accent.emphasized",
        textDecoration: "underline",
        cursor: "pointer",
        _hover: {
          textDecoration: "none",
        },
      },
      "& strong": {
        fontWeight: "600",
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
