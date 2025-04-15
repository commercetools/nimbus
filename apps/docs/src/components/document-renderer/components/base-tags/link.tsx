import { Box, Link as StyledLink } from "@commercetools/nimbus";
import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import { OpenInNew } from "@commercetools/nimbus-icons";

type LinkProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const Link = ({ children, ...rest }: LinkProps) => {
  const isExternal = rest.href?.startsWith("http");

  const props = isExternal
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};
  return (
    <StyledLink alignItems="baseline" variant="underline" {...rest} {...props}>
      {isExternal && (
        <Box my="auto" asChild>
          <OpenInNew />
        </Box>
      )}
      {children}
    </StyledLink>
  );
};
