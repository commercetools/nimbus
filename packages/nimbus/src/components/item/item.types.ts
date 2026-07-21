import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { AriaLinkOptions } from "react-aria";

// ============================================================
// RECIPE PROPS
// ============================================================

type ItemRecipeProps = {
  /** Controls padding and gap density. */
  size?: SlotRecipeProps<"nimbusItem">["size"];
  /** Controls visual treatment (border / subtle surface). */
  variant?: SlotRecipeProps<"nimbusItem">["variant"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type ItemRootSlotProps = HTMLChakraProps<"div", ItemRecipeProps>;
export type ItemHeaderSlotProps = HTMLChakraProps<"div">;
export type ItemMediaSlotProps = HTMLChakraProps<"div">;
export type ItemContentSlotProps = HTMLChakraProps<"div">;
export type ItemTitleSlotProps = HTMLChakraProps<"div">;
export type ItemDescriptionSlotProps = HTMLChakraProps<"div">;
export type ItemActionsSlotProps = HTMLChakraProps<"div">;
export type ItemFooterSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * The subset of React Aria's link options that `Item.Root` forwards to the
 * `useLink` hook when it upgrades from a `<div>` to an `<a>`. Presence of
 * `href` is what triggers the upgrade.
 */
export type ItemLinkProps = Partial<
  Pick<
    AriaLinkOptions,
    | "href"
    | "target"
    | "rel"
    | "download"
    | "ping"
    | "referrerPolicy"
    | "routerOptions"
    | "onPress"
  >
>;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the `Item.Root` component. Presentational by default; passing
 * `href` upgrades the root to an accessible link (see `ItemLinkProps`).
 */
export type ItemRootProps = OmitInternalProps<ItemRootSlotProps> &
  ItemLinkProps & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement & HTMLAnchorElement>;
    [key: `data-${string}`]: unknown;
  };

/** Props for the `Item.Header` component. */
export type ItemHeaderProps = OmitInternalProps<ItemHeaderSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/** Media presentation variant for `Item.Media`. */
export type ItemMediaVariant = "default" | "icon" | "image";

/** Props for the `Item.Media` component. */
export type ItemMediaProps = OmitInternalProps<ItemMediaSlotProps> & {
  /**
   * How the leading media is sized/shaped. Independent of `Item.Root`'s
   * `variant`; applied via a `data-variant` attribute on the media slot.
   * @default "default"
   */
  variant?: ItemMediaVariant;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/** Props for the `Item.Content` component. */
export type ItemContentProps = OmitInternalProps<ItemContentSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/** Props for the `Item.Title` component. */
export type ItemTitleProps = OmitInternalProps<ItemTitleSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/** Props for the `Item.Description` component. */
export type ItemDescriptionProps =
  OmitInternalProps<ItemDescriptionSlotProps> & {
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
  };

/** Props for the `Item.Actions` component. */
export type ItemActionsProps = OmitInternalProps<ItemActionsSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/** Props for the `Item.Footer` component. */
export type ItemFooterProps = OmitInternalProps<ItemFooterSlotProps> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};
