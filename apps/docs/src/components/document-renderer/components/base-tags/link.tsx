import { Box, Link as NimbusLink } from "@commercetools/nimbus";
import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import { OpenInNew } from "@commercetools/nimbus-icons";
import { useAtom } from "jotai";
import { activeRouteAtom } from "@/atoms/route";

type LinkProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const Link = ({ children, ...rest }: LinkProps) => {
  const [, setActiveRoute] = useAtom(activeRouteAtom);
  const isExternal = rest.href?.startsWith("http");
  const isDocsLink = rest.href?.startsWith("/");

  const props = isExternal
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  if (isDocsLink) {
    const route = rest.href.substring(1);

    return (
      <NimbusLink
        {...rest}
        // Don't pass href to prevent default navigation
        href={undefined}
        onPress={() => {
          setActiveRoute(route);
        }}
      >
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
