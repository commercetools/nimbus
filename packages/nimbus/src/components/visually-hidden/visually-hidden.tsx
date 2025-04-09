import {
  VisuallyHidden as ReactAriaViusallyHidden,
  type VisuallyHiddenProps as ReactAriaVisuallyHiddenProps,
} from "react-aria";

export interface VisuallyHiddenProps
  extends Omit<ReactAriaVisuallyHiddenProps, "elementType"> {
  /** specifies the element type to render, use `span` for inline content
   * and `div` for block content */
  as?: "span" | "div";
}

export const VisuallyHidden = (props: VisuallyHiddenProps) => {
  const { as = "div", ...leftoverProps } = props;
  return <ReactAriaViusallyHidden elementType={as} {...leftoverProps} />;
};

VisuallyHidden.displayName = "VisuallyHidden";
