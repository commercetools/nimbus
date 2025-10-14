import type { Ref } from "react";
import type { IconProps } from "../icon/icon.types";

// ============================================================
// MAIN PROPS
// ============================================================

export type InlineSvgProps = Omit<IconProps, "children" | "as" | "asChild"> & {
  data: string;
  ref?: Ref<SVGSVGElement>;
};
