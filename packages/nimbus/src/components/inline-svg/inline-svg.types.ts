import type { Ref } from "react";
import type { IconProps } from "../icon/icon.types";

// ============================================================
// MAIN PROPS
// ============================================================

export type InlineSvgProps = Omit<IconProps, "children" | "as" | "asChild"> & {
  /**
   * SVG content as a string to be rendered inline
   */
  data: string;
  /**
   * Ref forwarding to the SVG element
   */
  ref?: Ref<SVGSVGElement>;
};
