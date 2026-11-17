import { useRef } from "react";
import { useLink, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@/utils";
import { ArrowBack } from "@commercetools/nimbus-icons";
import { Tooltip } from "@/components/tooltip/tooltip";
import {
  DefaultPageBackLinkSlot,
  DefaultPageBackLinkLabelSlot,
} from "../default-page.slots";
import { useDefaultPageContext } from "../default-page.context";
import type { DefaultPageBackLinkProps } from "../default-page.types";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { defaultPageMessagesStrings } from "../default-page.messages";

/**
 * The tooltip repeats the link's accessible name, so assistive technology
 * should skip it. React Aria drops `aria-hidden` from tooltip props, so it is
 * set on the element directly.
 */
const hideFromAssistiveTechnology = (element: HTMLDivElement | null) => {
  element?.setAttribute("aria-hidden", "true");
};

/**
 * The link itself. It is a separate component so that, inside the tooltip,
 * `useLink` picks up the tooltip trigger props.
 */
const BackLinkAnchor = ({
  ref: forwardedRef,
  href,
  label,
  ...props
}: Omit<DefaultPageBackLinkProps, "children"> & { label: React.ReactNode }) => {
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
      // The tooltip repeats the label, which is already the accessible name.
      // Keep only a description the page sets itself.
      aria-describedby={props["aria-describedby"]}
    >
      <ArrowBack />
      <DefaultPageBackLinkLabelSlot>{label}</DefaultPageBackLinkLabelSlot>
    </DefaultPageBackLinkSlot>
  );
};

/**
 * DefaultPage.BackLink - Back navigation link for the default page
 *
 * In the collapsed header (`collapseHeaderOnScroll` on `DefaultPage.Root`),
 * the link shows only its icon, and a tooltip shows the label on hover and
 * keyboard focus.
 *
 * @supportsStyleProps
 */
export const DefaultPageBackLink = ({
  children,
  ...props
}: DefaultPageBackLinkProps) => {
  const msg = useLocalizedStringFormatter(defaultPageMessagesStrings);
  const context = useDefaultPageContext();
  const label = children ?? msg.format("backLink");

  if (!context?.isCollapseEnabled) {
    return <BackLinkAnchor {...props} label={label} />;
  }

  return (
    <Tooltip.Root isDisabled={!context.isHeaderCollapsed}>
      <BackLinkAnchor {...props} label={label} />
      <Tooltip.Content
        placement="bottom start"
        ref={hideFromAssistiveTechnology}
      >
        {label}
      </Tooltip.Content>
    </Tooltip.Root>
  );
};

DefaultPageBackLink.displayName = "DefaultPage.BackLink";
