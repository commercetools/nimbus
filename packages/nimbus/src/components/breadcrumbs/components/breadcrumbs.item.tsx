import { Link as RALink } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import {
  BreadcrumbsItemSlot,
  BreadcrumbsLinkSlot,
  BreadcrumbsSeparatorSlot,
} from "../breadcrumbs.slots";
import type { BreadcrumbsItemProps } from "../breadcrumbs.types";
import { useBreadcrumbsContext } from "./breadcrumbs.context";

/**
 * # Breadcrumbs.Item
 *
 * An individual breadcrumb. Renders an `<li>` containing a navigation link
 * (`<a>`). The decorative separator inherited from `Breadcrumbs.Root` is
 * rendered before every item except the first.
 *
 * When `isCurrent` is true the item represents the current page: it renders as
 * non-interactive text (not a link) with `aria-current="page"`, and is removed
 * from the tab sequence.
 *
 * @supportsStyleProps
 */
export const BreadcrumbsItem = ({
  children,
  href,
  isCurrent,
  isDisabled,
  target,
  rel,
  ref,
  ...rest
}: BreadcrumbsItemProps) => {
  const { separator } = useBreadcrumbsContext();
  const [styleProps, restProps] = extractStyleProps(rest);

  return (
    <BreadcrumbsItemSlot>
      <BreadcrumbsSeparatorSlot aria-hidden="true">
        {separator}
      </BreadcrumbsSeparatorSlot>
      {isCurrent ? (
        // The current page is non-interactive text — not a link — so it is not
        // in the tab order. React Aria's Link would remain focusable, so we
        // render the styled slot element directly instead.
        <BreadcrumbsLinkSlot
          ref={ref as React.Ref<HTMLAnchorElement>}
          aria-current="page"
          data-current="true"
          {...styleProps}
          {...restProps}
        >
          {children}
        </BreadcrumbsLinkSlot>
      ) : (
        <BreadcrumbsLinkSlot asChild {...styleProps}>
          <RALink
            ref={ref}
            href={isDisabled ? undefined : href}
            isDisabled={isDisabled}
            target={target}
            rel={rel}
            {...restProps}
          >
            {children}
          </RALink>
        </BreadcrumbsLinkSlot>
      )}
    </BreadcrumbsItemSlot>
  );
};

BreadcrumbsItem.displayName = "Breadcrumbs.Item";
