import { HeadingContext, useContextProps } from "react-aria-components";
import { HeadingRoot } from "./heading.slots";
import type { HeadingRootSlotProps } from "./heading.types";

/**
 * Props for the Heading component.
 *
 * @property {React.Ref<HTMLHeadingElement>} [ref] - Ref to the underlying heading element.
 * @property {string | null | undefined} [slot] - Slot attribute for custom element slotting.
 */
export type HeadingProps = HeadingRootSlotProps & {
  /**
   * Ref to the underlying heading element.
   */
  ref?: React.Ref<HTMLHeadingElement>;
  /**
   * Slot attribute for custom element slotting.
   */
  slot?: string | null | undefined;
};

/**
 * # Heading
 *
 * renders a heading
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/typography/heading}
 */
export const Heading = ({ ref: forwardedRef, ...props }: HeadingProps) => {
  const [contextProps, ref] = useContextProps(
    props,
    forwardedRef ?? null,
    HeadingContext
  );

  return (
    <HeadingRoot
      ref={ref as React.Ref<HTMLHeadingElement>}
      {...contextProps}
      as={props.as || contextProps.as}
      slot={props.slot ?? undefined}
    />
  );
};

Heading.displayName = "Heading";
