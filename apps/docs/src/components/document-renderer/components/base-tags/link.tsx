import { Box, Link as NimbusLink } from "@commercetools/nimbus";
import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import { OpenInNew } from "@commercetools/nimbus-icons";

type LinkProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const Link = ({ children, ...rest }: LinkProps) => {
  const isExternal = rest.href?.startsWith("http");
  const isDocsLink = rest.href?.startsWith("/");

  const props = isExternal
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  if (isDocsLink) {
    return (
      <NimbusLink href={rest.href.substring(1)} {...rest}>
        {children}
      </NimbusLink>
    );
  }
  return (
    // @ts-expect-error - something is off
    <NimbusLink alignItems="baseline" {...rest} {...props}>
      {isExternal && (
        <Box my="auto" asChild>
          <OpenInNew />
        </Box>
      )}
      {children}
    </NimbusLink>
  );
};
