import { Link as StyledLink } from "@bleh-ui/react";
import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import { ExternalLink } from "@bleh-ui/icons";

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
      {isExternal && <ExternalLink size="1em" />}
      {children}
    </StyledLink>
  );
};
