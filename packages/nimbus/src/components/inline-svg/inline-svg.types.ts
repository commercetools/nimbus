import type { Ref } from "react";
import type { IconProps } from "../icon/icon.types";

export interface InlineSvgProps
  extends Omit<IconProps, "children" | "as" | "asChild"> {
  /**
   * SVG markup as a string to render
   */
  data: string;
  /**
   * Ref to the SVG element
   */
  ref?: Ref<SVGSVGElement>;
}
