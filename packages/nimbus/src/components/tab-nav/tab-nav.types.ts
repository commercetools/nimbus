import type React from "react";
import type { AriaLinkOptions } from "react-aria";
import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type TabNavRecipeProps = {
  /**
   * Visual style variant of the tab navigation
   * @default "tabs"
   */
  variant?: SlotRecipeProps<"nimbusTabNav">["variant"];
  /**
   * Size of the tab navigation items
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusTabNav">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type TabNavRootSlotProps = HTMLChakraProps<"nav", TabNavRecipeProps>;

export type TabNavItemSlotProps = HTMLChakraProps<"a">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the TabNav.Root component.
 * Renders a `<nav>` landmark containing tab-styled navigation links.
 */
export type TabNavProps = OmitInternalProps<TabNavRootSlotProps> & {
  /**
   * A ref to the root `<nav>` element.
   */
  ref?: React.Ref<HTMLElement>;
  [key: `data-${string}`]: unknown;
};

type TabNavItemBaseProps = Omit<
  OmitInternalProps<TabNavItemSlotProps>,
  "onFocus" | "onBlur" | "onClick"
> &
  Pick<AriaLinkOptions, "onFocus" | "onBlur" | "onClick"> & {
    [key: `data-${string}`]: unknown;
  };

/**
 * Props for the TabNav.Item component.
 * Renders an `<a>` element styled as a tab navigation link.
 */
export type TabNavItemProps = TabNavItemBaseProps & {
  /**
   * The URL this navigation item links to.
   */
  href: string;
  /**
   * Whether this item represents the current page.
   * When true, sets `aria-current="page"` on the anchor element.
   * @default false
   */
  isCurrent?: boolean;
  /**
   * Whether the item is disabled. Disabled items cannot be interacted with
   * and are visually dimmed.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * The target window for the link.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
   */
  target?: React.HTMLAttributeAnchorTarget;
  /**
   * The relationship between the current document and the linked URL.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#rel
   */
  rel?: string;
  /**
   * The label content displayed inside the link.
   */
  children?: React.ReactNode;
  /**
   * A ref to the underlying `<a>` element.
   */
  ref?: React.Ref<HTMLAnchorElement>;
};
