import { DetailPageBackLinkSlot } from "../detail-page.slots";
import type { DetailPageBackLinkProps } from "../detail-page.types";
import { extractStyleProps } from "@/utils";

/**
 * DetailPage.BackLink - Back navigation link for the detail page
 *
 * @supportsStyleProps
 */
export const DetailPageBackLink = ({
  ref,
  href,
  children,
  ...props
}: DetailPageBackLinkProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);

  return (
    <DetailPageBackLinkSlot
      ref={ref}
      href={href}
      {...styleProps}
      {...functionalProps}
    >
      {children}
    </DetailPageBackLinkSlot>
  );
};

DetailPageBackLink.displayName = "DetailPage.BackLink";
