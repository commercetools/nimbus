import {
  Heading as ChakraHeading,
  type HeadingProps as ChakraHeadingProps,
} from "@chakra-ui/react/heading";
import { HeadingContext, useContextProps } from "react-aria-components";

/**
 * Props for the Heading component.
 *
 * @property {React.Ref<HTMLHeadingElement>} [ref] - Ref to the underlying heading element.
 * @property {string | null | undefined} [slot] - Slot attribute for custom element slotting.
 */
export interface HeadingProps extends Omit<ChakraHeadingProps, "slot"> {
  /**
   * Ref to the underlying heading element.
   */
  ref?: React.Ref<HTMLHeadingElement>;
  /**
   * Slot attribute for custom element slotting.
   */
  slot?: string | null | undefined;
}

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
    <ChakraHeading
      ref={ref as React.Ref<HTMLHeadingElement>}
      {...contextProps}
      as={props.as || contextProps.as}
      slot={props.slot ?? undefined}
    />
  );
};

Heading.displayName = "Heading";
