import { useRef } from "react";
import type { MouseEvent } from "react";
import { useLink, useObjectRef, mergeProps } from "react-aria";
import { mergeRefs } from "@/utils";
import { ItemRootSlot } from "../item.slots";
import type { ItemRootProps } from "../item.types";

/**
 * Internal: link-mode root.
 *
 * Renders the root slot as an `<a>` and applies the `useLink` hook (the same
 * primitive Nimbus's `Link` uses) so the whole row is an accessible link —
 * keyboard focusable, activatable with Enter, router-aware. The Item recipe
 * remains authoritative for appearance; `useLink` only supplies interaction.
 *
 * Only the React Aria link options are handed to `useLink`; the remaining
 * (styling / DOM) props are spread straight onto the slot.
 */
const ItemRootLink = ({
  ref: forwardedRef,
  children,
  href,
  target,
  rel,
  download,
  ping,
  referrerPolicy,
  routerOptions,
  onPress,
  ...rest
}: ItemRootProps) => {
  const localRef = useRef<HTMLAnchorElement>(null);
  const ref = useObjectRef<HTMLAnchorElement>(
    mergeRefs<HTMLAnchorElement>(
      localRef,
      forwardedRef as React.Ref<HTMLAnchorElement>
    )
  );
  const { linkProps } = useLink(
    {
      href,
      target,
      rel,
      download,
      ping,
      referrerPolicy,
      routerOptions,
      onPress,
      elementType: "a",
    },
    ref
  );

  // Guard against nested-interactive navigation: a click originating inside
  // `Item.Actions` must not navigate the row. Runs in the capture phase (before
  // the action's own handlers) so it only cancels the anchor's default/managed
  // navigation, while the action control still receives and handles the event.
  const handleClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as Element | null;
    if (target?.closest?.("[data-item-actions]")) {
      e.preventDefault();
    }
  };

  return (
    <ItemRootSlot
      as="a"
      ref={ref as React.Ref<HTMLDivElement>}
      // Fold the guard into `mergeProps` (rather than passing it as a bare prop
      // before the spread) so it *chains* with any consumer-supplied
      // `onClickCapture` — react-aria composes `on*` handlers — instead of being
      // silently overwritten by the spread.
      {...mergeProps(rest, linkProps, { onClickCapture: handleClickCapture })}
    >
      {children}
    </ItemRootSlot>
  );
};

/**
 * Internal: presentational (default) root — a plain `<div>` with no link or
 * button semantics and no interactive tab stop of its own.
 */
const ItemRootStatic = ({
  ref: forwardedRef,
  children,
  ...rest
}: ItemRootProps) => (
  <ItemRootSlot ref={forwardedRef} {...rest}>
    {children}
  </ItemRootSlot>
);

/**
 * Item.Root - The row container and styling-context provider for all Item
 * parts.
 *
 * Presentational by default (`<div>`). When `href` is provided it upgrades to
 * an accessible link (`<a>`) via `useLink`. There is intentionally no
 * button/pressable-row mode — row actions belong in `Item.Actions` as nested
 * `Button`/`IconButton` controls, which keep an independent focus order.
 *
 * @supportsStyleProps
 */
export const ItemRoot = ({ href, ...props }: ItemRootProps) => {
  // Split into two components so the `useLink` hook is only ever called on the
  // link path (hooks cannot be called conditionally within one component).
  return href != null ? (
    <ItemRootLink href={href} {...props} />
  ) : (
    <ItemRootStatic {...props} />
  );
};

ItemRoot.displayName = "Item.Root";
