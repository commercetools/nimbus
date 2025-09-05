import type { Ref } from "react";
import type { IconProps } from "../icon/icon.types";

export interface InlineSvgProps extends Omit<IconProps, "children"> {
  /**
   * SVG markup as a string to render
   */
  data: string;
  /**
   * Custom className to apply to the SVG element
   */
  className?: string;
  /**
   * Ref to the SVG element
   */
  ref?: Ref<SVGSVGElement>;
}
