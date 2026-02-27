import { useRef } from "react";
import { LinkRoot } from "./link.slots";
import type { LinkProps } from "./link.types";
import { useLink, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@/utils";

/**
 * # Link
 *
 * To allow a user to navigate to a different page or resource
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/link}
 */
export const Link = (props: LinkProps) => {
  const { as, asChild, children, ref: forwardedRef, ...rest } = props;

  const localRef = useRef<HTMLAnchorElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const elementType = (as as string) || (asChild ? "span" : "a") || "a";
  const { linkProps } = useLink({ ...rest, elementType }, ref);

  return (
    <LinkRoot {...mergeProps(rest, linkProps, { as, asChild, ref })}>
      {children}
    </LinkRoot>
  );
};

Link.displayName = "Link";
