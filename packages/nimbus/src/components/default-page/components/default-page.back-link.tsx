import { useRef } from "react";
import { useLink, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { ArrowBack } from "@commercetools/nimbus-icons";
import { DefaultPageBackLinkSlot } from "../default-page.slots";
import type { DefaultPageBackLinkProps } from "../default-page.types";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { defaultPageMessagesStrings } from "../default-page.messages";

/**
 * DefaultPage.BackLink - Back navigation link for the default page
 *
 * @supportsStyleProps
 */
export const DefaultPageBackLink = ({
  ref: forwardedRef,
  href,
  children,
  ...props
}: DefaultPageBackLinkProps) => {
  const msg = useLocalizedStringFormatter(defaultPageMessagesStrings);
  const [styleProps, functionalProps] = extractStyleProps(props);

  const localRef = useRef<HTMLAnchorElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const { linkProps } = useLink(
    { ...functionalProps, href, elementType: "a" },
    ref
  );

  return (
    <DefaultPageBackLinkSlot
      ref={ref}
      {...mergeProps(styleProps, functionalProps, linkProps)}
    >
      <ArrowBack />
      {children ?? msg.format("backLink")}
    </DefaultPageBackLinkSlot>
  );
};

DefaultPageBackLink.displayName = "DefaultPage.BackLink";
