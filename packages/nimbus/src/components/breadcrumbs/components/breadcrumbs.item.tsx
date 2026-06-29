import { ChevronRight } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import {
  BreadcrumbsItemSlot,
  BreadcrumbsLinkSlot,
  BreadcrumbsSeparatorSlot,
} from "../breadcrumbs.slots";
import type { BreadcrumbsItemComponent } from "../breadcrumbs.types";

/**
 * Breadcrumbs.Item - A single entry in the breadcrumb trail.
 *
 * Renders a React Aria `Breadcrumb` (`<li>`) containing a `Link`. The last
 * item in the trail represents the current page: omit `href` and React Aria
 * marks it as current (`aria-current="page"`), rendering it as static,
 * non-interactive text. A decorative separator is rendered after every item
 * except the current one.
 *
 * @supportsStyleProps
 */
export const BreadcrumbsItem: BreadcrumbsItemComponent = ({
  children,
  id,
  ref,
  // React Aria Breadcrumb-level props
  autoFocus,
  // Link-level props (forwarded to the rendered Link)
  href,
  hrefLang,
  target,
  rel,
  download,
  ping,
  referrerPolicy,
  routerOptions,
  onPress,
  onPressStart,
  onPressEnd,
  onPressChange,
  onPressUp,
  isDisabled,
  ...rest
}) => {
  // Separate Chakra style props (applied to the <li> item slot) from any
  // remaining DOM/aria props.
  const [styleProps, restProps] = extractStyleProps(rest);

  const linkProps = {
    href,
    hrefLang,
    target,
    rel,
    download,
    ping,
    referrerPolicy,
    routerOptions,
    onPress,
    onPressStart,
    onPressEnd,
    onPressChange,
    onPressUp,
    isDisabled,
  };

  return (
    <BreadcrumbsItemSlot
      ref={ref}
      id={id}
      autoFocus={autoFocus}
      {...styleProps}
      {...restProps}
    >
      {({ isCurrent }) => (
        <>
          <BreadcrumbsLinkSlot {...linkProps}>{children}</BreadcrumbsLinkSlot>
          {!isCurrent && (
            <BreadcrumbsSeparatorSlot aria-hidden="true">
              <ChevronRight />
            </BreadcrumbsSeparatorSlot>
          )}
        </>
      )}
    </BreadcrumbsItemSlot>
  );
};

BreadcrumbsItem.displayName = "Breadcrumbs.Item";
