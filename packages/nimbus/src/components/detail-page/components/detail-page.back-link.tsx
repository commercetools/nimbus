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
  ref,
  href,
  "aria-label": ariaLabel,
  children,
  ...props
}: DetailPageBackLinkProps) => {
  const msg = useLocalizedStringFormatter(detailPageMessagesStrings);
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <DetailPageBackLinkSlot
      ref={ref}
      href={href}
      aria-label={ariaLabel || msg.format("backLink")}
      {...styleProps}
      {...functionalProps}
    >
      <ArrowBack />
      {children}
    </DetailPageBackLinkSlot>
  );
};

DetailPageBackLink.displayName = "DetailPage.BackLink";
