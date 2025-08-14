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
    },
    toolbar: {
      boxShadow: "1",
    },
    // TODO: continue auditing styling from here
    editable: {
      padding: "400",
      minHeight: "inherit",
      outline: "none",
      "& [data-slate-placeholder='true']": {
        color: "fg.muted !important",
        opacity: "1 !important",
      },
      "& > * + *": {
        marginTop: "300",
      },
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
  variants: {
    state: {
      error: {
        root: {
          borderColor: "error.emphasized",
          _focusWithin: {
            borderColor: "error.emphasized",
            boxShadow: "0 0 0 1px token(colors.error.emphasized)",
          },
        },
      },
      warning: {
        root: {
          borderColor: "warning.emphasized",
          _focusWithin: {
            borderColor: "warning.emphasized",
            boxShadow: "0 0 0 1px token(colors.warning.emphasized)",
          },
        },
      },
    },
    disabled: {
      true: {
        root: {
          opacity: "0.5",
          cursor: "not-allowed",
          backgroundColor: "bg.subtle",
        },
      },
    },
    readOnly: {
      true: {
        root: {
          backgroundColor: "bg.subtle",
          cursor: "default",
        },
        editable: {
          cursor: "default",
        },
      },
    },
  },
});
