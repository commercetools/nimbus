import {
  VisuallyHidden as ReactAriaViusallyHidden,
  type VisuallyHiddenProps as ReactAriaVisuallyHiddenProps,
} from "react-aria";
import { Box, type BoxProps } from "@/components";
import { type HTMLAttributes } from "react";

export interface VisuallyHiddenProps
  extends Omit<ReactAriaVisuallyHiddenProps, "elementType"> {
  /** specifies the element type to render, use `span` for inline content
   * and `div` for block content */
  as?: "span" | "div";
}

export const VisuallyHidden = (props: VisuallyHiddenProps) => {
  const { isFocusable, as = "div", ...leftoverProps } = props;

  const Comp = (
    compProps: HTMLAttributes<HTMLDivElement | HTMLSpanElement> & BoxProps
  ) => <Box as={as} {...compProps} />;

  return (
    <ReactAriaViusallyHidden
      elementType={Comp}
      isFocusable={isFocusable}
      {...leftoverProps}
    />
  );
};

VisuallyHidden.displayName = "VisuallyHidden";
