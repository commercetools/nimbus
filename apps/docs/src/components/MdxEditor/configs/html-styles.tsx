import { Box } from "@bleh-ui/react";
import { ComponentProps } from "react";

type Foo = ComponentProps<typeof Box>["css"];

const styles: Foo = {
  "& *": {
    color: "fg",
  },
  "& h1": {
    fontSize: "3xl",
    fontWeight: "semibold",
    mb: "4",
  },
  "& h2": {
    fontSize: "2xl",
    fontWeight: "semibold",
    my: "4",
  },
  "& h3": {
    fontSize: "xl",
    fontWeight: "semibold",
    my: "4",
  },
  "& h4": {
    fontSize: "lg",
    fontWeight: "semibold",
    my: "4",
  },
  "& p": {
    display: "block",
    my: "4",
  },
  "& a": {
    textDecoration: "underline",
  },
  "& ul": {
    listStyleType: "disc",
    pl: "8",
    my: "4",
  },
  "& ol": {
    listStyleType: "number",
    pl: "8",
    my: "4",
  },
  "& blockquote": {
    borderLeft: "2px solid black",
    listStyleType: "number",
    pl: "8",
    my: "4",
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
};

export const CustomEditorStyles = (props: any) => {
  return <Box color="inherit" css={styles} {...props} />;
};
