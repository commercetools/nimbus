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

/**
 * # VisuallyHidden
 *
 * makes content accessible to screen readers but hides it visually
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/accessibility/visually-hidden}
 */
export const VisuallyHidden = (props: VisuallyHiddenProps) => {
  const { as = "div", ...leftoverProps } = props;
  return <ReactAriaViusallyHidden elementType={as} {...leftoverProps} />;
};

VisuallyHidden.displayName = "VisuallyHidden";
