import {
  Breadcrumb as RaBreadcrumb,
  Link as RaLink,
} from "react-aria-components";
import { extractStyleProps } from "@/utils";
import {
  BreadcrumbsItemSlot,
  BreadcrumbsLinkSlot,
  BreadcrumbsSeparatorSlot,
} from "../breadcrumbs.slots";
import type { BreadcrumbsItemProps } from "../breadcrumbs.types";
import { useBreadcrumbsSeparator } from "./breadcrumbs.context";

/**
 * # Breadcrumbs.Item
 *
 * An individual breadcrumb. Renders an `<li>` (via React Aria's `Breadcrumb`)
 * containing a navigation link (via React Aria's `Link`). The decorative
 * separator configured on `Breadcrumbs.Root` is rendered before every item
 * except the first.
 *
 * When this is the last item in a `Breadcrumbs.Root`, React Aria marks it as the
 * current page automatically: it becomes non-interactive text with
 * `aria-current="page"` and is removed from the tab sequence. There is no
 * `isCurrent` prop — currentness is derived from position.
 *
 * @supportsStyleProps
 */
export const BreadcrumbsItem = ({
  children,
  id,
  href,
  isDisabled,
  target,
  rel,
  routerOptions,
  ref,
  ...rest
}: BreadcrumbsItemProps) => {
  const separator = useBreadcrumbsSeparator();
  const [styleProps, restProps] = extractStyleProps(rest);

  return (
    <BreadcrumbsItemSlot asChild>
      <RaBreadcrumb id={id}>
        <BreadcrumbsSeparatorSlot aria-hidden="true">
          {separator}
        </BreadcrumbsSeparatorSlot>
        {isDisabled ? (
          // React Aria's Breadcrumb overrides the nested Link's `isDisabled`
          // via context (it only disables the current item), so per-item
          // disabling is handled here: render non-interactive, unfocusable text.
          <BreadcrumbsLinkSlot asChild {...styleProps}>
            <span aria-disabled="true" data-disabled="true">
              {children}
            </span>
          </BreadcrumbsLinkSlot>
        ) : (
          <BreadcrumbsLinkSlot asChild {...styleProps}>
            {/* React Aria's Breadcrumb passes `isDisabled`/`aria-current` to
                this Link via context for the current (last) item, so it renders
                as a non-focusable `<span role="link">` automatically. */}
            <RaLink
              ref={ref}
              href={href}
              target={target}
              rel={rel}
              routerOptions={routerOptions}
              {...restProps}
            >
              {children}
            </RaLink>
          </BreadcrumbsLinkSlot>
        )}
      </RaBreadcrumb>
    </BreadcrumbsItemSlot>
  );
};

BreadcrumbsItem.displayName = "Breadcrumbs.Item";
