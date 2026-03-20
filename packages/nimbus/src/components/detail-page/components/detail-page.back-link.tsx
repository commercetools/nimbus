import { useRef } from "react";
import { useLink, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { ArrowBack } from "@commercetools/nimbus-icons";
import { DetailPageBackLinkSlot } from "../detail-page.slots";
import type { DetailPageBackLinkProps } from "../detail-page.types";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { detailPageMessagesStrings } from "../detail-page.messages";

/**
 * DetailPage.BackLink - Back navigation link for the detail page
 *
 * @supportsStyleProps
 */
export const DetailPageBackLink = ({
  ref: forwardedRef,
  href,
  children,
  ...props
}: DetailPageBackLinkProps) => {
  const msg = useLocalizedStringFormatter(detailPageMessagesStrings);
  const [styleProps, functionalProps] = extractStyleProps(props);

  const localRef = useRef<HTMLAnchorElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const { linkProps } = useLink(
    { ...functionalProps, href, elementType: "a" },
    ref
  );

  return (
    <DetailPageBackLinkSlot
      ref={ref}
      {...mergeProps(styleProps, functionalProps, linkProps)}
    >
      <ArrowBack />
      {children ?? msg.format("backLink")}
    </DetailPageBackLinkSlot>
  );
};

DetailPageBackLink.displayName = "DetailPage.BackLink";
