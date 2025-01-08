import { Box } from "@bleh-ui/react";
import { ComponentProps } from "react";

type Foo = Record<string, ComponentProps<typeof Box>["css"]>;

const styles: Foo = {
  "& *": {
    color: "fg",
  },
  "& h1": {
    fontSize: "3xl",
    fontWeight: "semibold",
    mb: "400",
  },
  "& h2": {
    fontSize: "2xl",
    fontWeight: "semibold",
    my: "400",
  },
  "& h3": {
    fontSize: "xl",
    fontWeight: "semibold",
    my: "400",
  },
  "& h4": {
    fontSize: "lg",
    fontWeight: "semibold",
    my: "400",
  },
  "& p": {
    display: "block",
    my: "400",
  },
  "& a": {
    textDecoration: "underline",
  },
  "& ul": {
    listStyleType: "disc",
    pl: "800",
    my: "400",
  },
  "& ol": {
    listStyleType: "number",
    pl: "800",
    my: "400",
  },
  "& blockquote": {
    borderLeft: "2px solid black",
    listStyleType: "number",
    pl: "800",
    my: "400",
  },
  "& .toolbar": {
    bg: "bg",
    borderRadius: "sm",
    border: "1px solid",
    borderColor: "neutral.6",
  },
  "& [role='combobox']": {
    bg: "transparent",
  },
  "& [class*='codeMirrorToolbar']": {
    bg: "bg/85",
  },
  "& [class*='codeMirrorWrapper']": {
    border: "1px solid",
    borderColor: "neutral.6",
    padding: 0,
  },
  "& [class*='addColumnButton'], & [class*='addRowButton']": {
    bg: "colorPalette.4",
    color: "fg",
  },
  "& .cm-editor": {
    py: "200",
    textStyle: "sm",
  },

  "& .cm-gutterElement": {
    textStyle: "sm",
    fontSize: "xs",
    opacity: 0.5,
    ml: "200",
  },
};

export const CustomEditorStyles = (props: any) => {
  return <Box color="inherit" css={styles} {...props} />;
};
