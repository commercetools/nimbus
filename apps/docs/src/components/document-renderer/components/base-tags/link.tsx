import { Box, Link as NimbusLink } from "@commercetools/nimbus";
import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import { OpenInNew } from "@commercetools/nimbus-icons";
import { DocLink } from "@/components/navigation/doc-link";

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
      <DocLink docRoute={rest.href} {...rest}>
        {children}
      </DocLink>
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
