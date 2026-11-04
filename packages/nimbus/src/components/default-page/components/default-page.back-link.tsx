import { useEffect, useRef, type ReactNode } from "react";
import { useFocusable, useLink, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@/utils";
import { ArrowBack } from "@commercetools/nimbus-icons";
import { Tooltip } from "@/components/tooltip/tooltip";
import { useDefaultPageContext } from "../default-page.context";
import { DefaultPageBackLinkSlot } from "../default-page.slots";
import type { DefaultPageBackLinkProps } from "../default-page.types";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { defaultPageMessagesStrings } from "../default-page.messages";

type BackLinkTriggerProps = DefaultPageBackLinkProps & {
  label: ReactNode;
};

/**
 * Lives under `Tooltip.Root` so `useFocusable` can read the trigger context.
 */
const BackLinkTrigger = ({
  ref: forwardedRef,
  href,
  label,
  ...props
}: BackLinkTriggerProps) => {
  const [styleProps, functionalProps] = extractStyleProps(props);
  const localRef = useRef<HTMLAnchorElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));
  const { linkProps } = useLink(
    { ...functionalProps, href, elementType: "a" },
    ref
  );
  const { focusableProps } = useFocusable({}, ref);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const stripDescribedBy = () => {
      if (node.hasAttribute("aria-describedby")) {
        node.removeAttribute("aria-describedby");
      }
    };

    stripDescribedBy();
    const observer = new MutationObserver(stripDescribedBy);
    observer.observe(node, {
      attributes: true,
      attributeFilter: ["aria-describedby"],
    });
    return () => observer.disconnect();
  }, [ref]);

  return (
    <DefaultPageBackLinkSlot
      ref={ref}
      {...mergeProps(styleProps, functionalProps, linkProps, focusableProps)}
    >
      <ArrowBack />
      <span className="nimbus-default-page__backLinkLabel">{label}</span>
    </DefaultPageBackLinkSlot>
  );
};

/**
 * DefaultPage.BackLink - Back navigation link for the default page
 *
 * @supportsStyleProps
 */
export const DefaultPageBackLink = ({
  children,
  ...props
}: DefaultPageBackLinkProps) => {
  const msg = useLocalizedStringFormatter(defaultPageMessagesStrings);
  const { form } = useDefaultPageContext();
  const label = children ?? msg.format("backLink");

  return (
    <Tooltip.Root isDisabled={form !== "collapsed"} delay={0} closeDelay={0}>
      <BackLinkTrigger {...props} label={label} />
      <Tooltip.Content>
        <span aria-hidden="true">{label}</span>
      </Tooltip.Content>
    </Tooltip.Root>
  );
};

DefaultPageBackLink.displayName = "DefaultPage.BackLink";
